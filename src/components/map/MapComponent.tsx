'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { DroppableMapOverlay } from './DroppableMapOverlay'
import { ShipMarker } from './ShipMarker'
import type { ShipData } from '@/data/ships'
import type { SimulationShip } from '@/types/simulation'

// Set Mapbox token
if (!mapboxgl.accessToken) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token) {
    console.error('Mapbox token is missing! Make sure NEXT_PUBLIC_MAPBOX_TOKEN is set in .env.local')
  } else {
    console.log('Setting Mapbox token:', token.substring(0, 8) + '...')
    mapboxgl.accessToken = token
  }
}

interface MapComponentProps {
  center: [number, number]
  zoom: number
  onChange: (center: [number, number], zoom: number) => void
  onShipDrop?: (ship: ShipData, position: { x: number, y: number }) => void
  ships?: SimulationShip[]
}

export function MapComponent({ center, zoom, onChange, onShipDrop, ships = [] }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const shipCourses = useRef<{ [key: string]: number }>({})  // Store courses for each ship
  const shipSpeeds = useRef<{ [key: string]: number }>({})   // Store speeds for each ship
  const roots = useRef<{ [key: string]: any }>({})  // Store React roots
  const isUserInteraction = useRef(false)
  const lastCenter = useRef(center)
  const lastZoom = useRef(zoom)

  // Memoize the change handler to prevent unnecessary updates
  const handleMapChange = useCallback(() => {
    if (!map.current || !isUserInteraction.current) return
    
    const newCenter = map.current.getCenter()
    const newZoom = map.current.getZoom()
    const centerChanged = 
      Math.abs(lastCenter.current[0] - newCenter.lng) > 0.0001 ||
      Math.abs(lastCenter.current[1] - newCenter.lat) > 0.0001
    const zoomChanged = Math.abs(lastZoom.current - newZoom) > 0.01

    if (centerChanged || zoomChanged) {
      lastCenter.current = [newCenter.lng, newCenter.lat]
      lastZoom.current = newZoom
      onChange([newCenter.lng, newCenter.lat], newZoom)
    }
  }, [onChange])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return
    if (!mapboxgl.accessToken) {
      console.error('Cannot initialize map: Mapbox token is not set')
      return
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: center,
        zoom: zoom,
        dragRotate: false
      })

      map.current.on('movestart', () => {
        isUserInteraction.current = true
      })

      map.current.on('moveend', handleMapChange)
      map.current.on('zoomend', handleMapChange)

    } catch (error) {
      console.error('Error initializing map:', error)
    }

    return () => {
      Object.values(markers.current).forEach(marker => marker.remove())
      markers.current = {}
      map.current?.remove()
    }
  }, [])

  // Update map when center/zoom props change
  useEffect(() => {
    if (!map.current || isUserInteraction.current) {
      isUserInteraction.current = false
      return
    }

    map.current.setCenter(center)
    map.current.setZoom(zoom)
  }, [center, zoom])

  // Update markers when ships change
  useEffect(() => {
    const currentMap = map.current
    if (!currentMap) return

    // Remove old markers and their courses/speeds
    Object.entries(markers.current).forEach(([id, marker]) => {
      if (!ships.find(ship => ship.id === id)) {
        if (roots.current[id]) {
          roots.current[id].unmount()
          delete roots.current[id]
        }
        marker.remove()
        delete markers.current[id]
        delete shipCourses.current[id]
        delete shipSpeeds.current[id]
      }
    })

    // Update or add markers
    ships.forEach(ship => {
      // Generate random course and speed if not exists
      if (!shipCourses.current[ship.id]) {
        shipCourses.current[ship.id] = Math.floor(Math.random() * 360)
        // Generate random speed between min and max speed for the ship
        const minSpeed = ship.characteristics.minSpeed || 0
        const maxSpeed = ship.characteristics.maxSpeed || 30
        shipSpeeds.current[ship.id] = minSpeed + Math.random() * (maxSpeed - minSpeed)
      }

      if (markers.current[ship.id]) {
        // Update existing marker
        markers.current[ship.id].setLngLat([ship.position.lng, ship.position.lat])
        if (roots.current[ship.id]) {
          roots.current[ship.id].render(
            <ShipMarker 
              ship={ship} 
              heading={0} 
              affiliation="unknown"
              course={shipCourses.current[ship.id]}
              speed={shipSpeeds.current[ship.id]}
            />
          )
        }
      } else {
        // Create new marker
        const markerElement = document.createElement('div')
        markerElement.className = 'relative'
        
        // Render the ShipMarker component into the marker element
        const shipMarkerRoot = document.createElement('div')
        markerElement.appendChild(shipMarkerRoot)
        
        // Create a React root and render the ShipMarker
        const { createRoot } = require('react-dom/client')
        const root = createRoot(shipMarkerRoot)
        roots.current[ship.id] = root
        root.render(
          <ShipMarker 
            ship={ship} 
            heading={0} 
            affiliation="unknown"
            course={shipCourses.current[ship.id]}
            speed={shipSpeeds.current[ship.id]}
          />
        )
        
        const marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center',
          rotationAlignment: 'map'
        })
          .setLngLat([ship.position.lng, ship.position.lat])
          .addTo(currentMap)
        markers.current[ship.id] = marker
      }
    })

    // Cleanup function
    return () => {
      Object.values(roots.current).forEach(root => {
        try {
          root.unmount()
        } catch (e) {
          console.warn('Error unmounting root:', e)
        }
      })
      roots.current = {}
    }
  }, [ships])

  if (!mapboxgl.accessToken) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 text-red-600">
        Error: Mapbox token is missing. Check the console for details.
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      {onShipDrop && map.current && (
        <DroppableMapOverlay 
          onShipDrop={onShipDrop} 
          map={map.current} 
        />
      )}
    </div>
  )
} 