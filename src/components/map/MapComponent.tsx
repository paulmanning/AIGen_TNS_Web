'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { DroppableMapOverlay } from './DroppableMapOverlay'
import { ShipMarker } from './ShipMarker'
import type { ShipData } from '@/data/ships'
import type { SimulationShip } from '@/types/simulation'
import { getShipPositionAtTime, generateShipTrail } from '@/utils/ship-position'
import { Root, createRoot } from 'react-dom/client'

// Store React roots in a WeakMap to avoid TypeScript errors
const markerRoots = new WeakMap<HTMLElement, Root>()

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
  ships: SimulationShip[]
  selectedShipId?: string
  isSetupMode: boolean
  isPlaying: boolean
  currentTime: number
}

export function MapComponent({ center, zoom, onChange, onShipDrop, ships = [], selectedShipId, isSetupMode, isPlaying, currentTime }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const markerElements = useRef<{ [key: string]: HTMLDivElement }>({})
  const shipTrails = useRef<{ [key: string]: string }>({})
  const isUserInteraction = useRef(false)

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

      // Handle map interactions
      const handleMapStart = () => {
        isUserInteraction.current = true
      }

      const handleMapEnd = () => {
        if (!map.current || !isUserInteraction.current) return
        
        const newCenter = map.current.getCenter()
        const newZoom = map.current.getZoom()
        
        onChange([newCenter.lng, newCenter.lat], newZoom)
        isUserInteraction.current = false
      }

      map.current.on('dragstart', handleMapStart)
      map.current.on('zoomstart', handleMapStart)
      map.current.on('dragend', handleMapEnd)
      map.current.on('zoomend', handleMapEnd)

      // Set up resize observer
      const resizeObserver = new ResizeObserver(() => {
        if (map.current) {
          map.current.resize()
        }
      })
      resizeObserver.observe(mapContainer.current)

      return () => {
        if (map.current) {
          map.current.off('dragstart', handleMapStart)
          map.current.off('zoomstart', handleMapStart)
          map.current.off('dragend', handleMapEnd)
          map.current.off('zoomend', handleMapEnd)
          map.current.remove()
        }
        resizeObserver.disconnect()
        Object.values(markers.current).forEach(marker => marker.remove())
        markers.current = {}
      }
    } catch (error) {
      console.error('Error initializing map:', error)
    }
  }, [])

  // Update map when center/zoom props change
  useEffect(() => {
    if (!map.current || isUserInteraction.current) return

    map.current.setCenter(center)
    map.current.setZoom(zoom)
  }, [center, zoom])

  // Update markers and trails
  useEffect(() => {
    const mapInstance = map.current
    if (!mapInstance) return

    // Update markers
    ships.forEach(ship => {
      const position = isSetupMode 
        ? ship.position 
        : getShipPositionAtTime(ship, currentTime)

      let markerElement = markerElements.current[ship.id]
      if (!markerElement) {
        markerElement = document.createElement('div')
        markerElements.current[ship.id] = markerElement
      }

      let marker = markers.current[ship.id]
      const isThisShipSelected = ship.id === selectedShipId

      if (!marker) {
        let root = markerRoots.get(markerElement)
        if (!root) {
          root = createRoot(markerElement)
          markerRoots.set(markerElement, root)
        }
        root.render(<ShipMarker ship={ship} isSelected={isThisShipSelected} />)

        marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center',
          rotationAlignment: 'map'
        })
        markers.current[ship.id] = marker
      }

      // Always update marker position and content
      marker.setLngLat([position.lng, position.lat])
      if (!marker.getElement().parentNode) {
        marker.addTo(mapInstance)
      }

      const root = markerRoots.get(markerElement)
      if (root) {
        root.render(<ShipMarker ship={ship} isSelected={isThisShipSelected} />)
      }
    })

    // Clean up removed ships
    Object.keys(markers.current).forEach(shipId => {
      if (!ships.find(s => s.id === shipId)) {
        const markerElement = markerElements.current[shipId]
        if (markerElement) {
          const root = markerRoots.get(markerElement)
          if (root) {
            root.unmount()
            markerRoots.delete(markerElement)
          }
        }
        markers.current[shipId].remove()
        delete markers.current[shipId]
        delete markerElements.current[shipId]
      }
    })
  }, [ships, currentTime, isSetupMode, selectedShipId])

  // Update trails only in run mode
  useEffect(() => {
    const mapInstance = map.current
    if (!mapInstance || isSetupMode) return

    ships.forEach(ship => {
      const trailId = `trail-${ship.id}`
      const trail = generateShipTrail(ship, currentTime)
      
      if (mapInstance.getSource(trailId)) {
        // Update existing trail
        const source = mapInstance.getSource(trailId) as mapboxgl.GeoJSONSource
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: trail
          }
        })
      } else {
        // Create new trail
        mapInstance.addSource(trailId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: trail
            }
          }
        })

        mapInstance.addLayer({
          id: trailId,
          type: 'line',
          source: trailId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ddd',
            'line-width': 1,
            'line-opacity': 0.7
          }
        })

        shipTrails.current[ship.id] = trailId
      }
    })
  }, [ships, currentTime, isSetupMode])

  // Clean up trails when component unmounts or when entering setup mode
  useEffect(() => {
    const mapInstance = map.current
    if (!mapInstance) return

    return () => {
      // Store the map instance in a closure to ensure it's available during cleanup
      const mapForCleanup = map.current
      if (!mapForCleanup) return

      Object.values(shipTrails.current).forEach(trailId => {
        try {
          if (mapForCleanup.getLayer(trailId)) {
            mapForCleanup.removeLayer(trailId)
          }
          if (mapForCleanup.getSource(trailId)) {
            mapForCleanup.removeSource(trailId)
          }
        } catch (error) {
          console.warn('Error cleaning up map layer/source:', error)
        }
      })
      shipTrails.current = {}
    }
  }, [isSetupMode])

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