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
  const shipTrails = useRef<{ [key: string]: string }>({})
  const markerElements = useRef<{ [key: string]: HTMLDivElement }>({})
  const isUserInteraction = useRef(false)
  const lastCenter = useRef(center)
  const lastZoom = useRef(zoom)
  const resizeObserver = useRef<ResizeObserver | null>(null)

  // Debug log for selection changes
  useEffect(() => {
    console.log('Selection changed:', selectedShipId)
  }, [selectedShipId])

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

  // Handle map resize
  const handleResize = useCallback(() => {
    if (map.current) {
      map.current.resize()
      
      // Force marker updates after resize
      Object.entries(markers.current).forEach(([id, marker]) => {
        const ship = ships.find(s => s.id === id)
        if (ship) {
          marker.setLngLat([ship.position.lng, ship.position.lat])
        }
      })
    }
  }, [ships])

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

      // Set up resize observer
      resizeObserver.current = new ResizeObserver(handleResize)
      resizeObserver.current.observe(mapContainer.current)

    } catch (error) {
      console.error('Error initializing map:', error)
    }

    return () => {
      resizeObserver.current?.disconnect()
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

    const currentMap = map.current
    currentMap.setCenter(center)
    currentMap.setZoom(zoom)
    
    // Ensure markers are in correct positions after map update
    requestAnimationFrame(() => {
      Object.entries(markers.current).forEach(([id, marker]) => {
        const ship = ships.find(s => s.id === id)
        if (ship) {
          marker.setLngLat([ship.position.lng, ship.position.lat])
        }
      })
    })
  }, [center, zoom, ships])

  // Update ship markers
  useEffect(() => {
    const mapInstance = map.current
    if (!mapInstance) return

    // Update all markers to reflect current selection state
    ships.forEach(ship => {
      // Get ship position based on mode
      const position = isSetupMode 
        ? ship.position 
        : getShipPositionAtTime(ship, currentTime)

      // Create or update marker element
      let markerElement = markerElements.current[ship.id]
      if (!markerElement) {
        markerElement = document.createElement('div')
        markerElements.current[ship.id] = markerElement
      }
      
      // Create or update marker
      let marker = markers.current[ship.id]
      const isThisShipSelected = ship.id === selectedShipId
      console.log('Updating marker:', ship.id, 'selected:', isThisShipSelected)

      if (!marker) {
        // Create React root if it doesn't exist
        let root = markerRoots.get(markerElement)
        if (!root) {
          root = createRoot(markerElement)
          markerRoots.set(markerElement, root)
        }
        root.render(<ShipMarker ship={ship} isSelected={isThisShipSelected} />)

        // Create new marker
        marker = new mapboxgl.Marker({
          element: markerElement,
          anchor: 'center',
          rotationAlignment: 'map'
        })
        markers.current[ship.id] = marker
        marker.setLngLat([position.lng, position.lat]).addTo(mapInstance)
      } else {
        // Update existing marker
        const root = markerRoots.get(markerElement)
        if (root) {
          // Force re-render with current selection state
          root.render(<ShipMarker ship={ship} isSelected={isThisShipSelected} />)
        }
        marker.setLngLat([position.lng, position.lat])
      }
    })

    // Remove markers for ships that no longer exist
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