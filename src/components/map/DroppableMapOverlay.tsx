'use client'

import { useDrop } from 'react-dnd'
import { useState } from 'react'
import type { ShipData } from '@/data/ships'
import mapboxgl from 'mapbox-gl'

interface DroppableMapOverlayProps {
  onShipDrop: (ship: ShipData, position: { x: number, y: number }) => void
  map: mapboxgl.Map | null
}

export function DroppableMapOverlay({ onShipDrop, map }: DroppableMapOverlayProps) {
  const [dropMessage, setDropMessage] = useState<string | null>(null)
  const [messagePosition, setMessagePosition] = useState({ x: 0, y: 0 })

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'SHIP',
    drop: (item: ShipData & { preview?: React.ReactNode }, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset || !map) return

      // Get map container element
      const mapContainer = map.getContainer()
      const rect = mapContainer.getBoundingClientRect()

      // Calculate relative position within the map
      const x = offset.x - rect.left
      const y = offset.y - rect.top

      // Convert screen coordinates to map coordinates
      const point = map.unproject([x, y])
      
      console.log(`Dropping ${item.name} at coordinates: ${point.lat.toFixed(4)}°N, ${point.lng.toFixed(4)}°E`)

      // Show drop message
      setDropMessage(`Dropped ${item.name} at ${point.lat.toFixed(4)}°N, ${point.lng.toFixed(4)}°E`)
      setMessagePosition({ x: offset.x, y: offset.y })

      // Clear message after 3 seconds
      setTimeout(() => setDropMessage(null), 3000)

      // Call the drop handler with the ship data (without preview)
      const { preview, ...shipData } = item
      onShipDrop(shipData, { x: point.lng, y: point.lat })
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  }), [map, onShipDrop])

  return (
    <div
      ref={drop}
      id="map-overlay"
      className="absolute inset-0 z-10"
      style={{ pointerEvents: 'all' }}
    >
      {dropMessage && (
        <div
          className="fixed bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm pointer-events-none"
          style={{
            left: messagePosition.x,
            top: messagePosition.y,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px'
          }}
        >
          {dropMessage}
        </div>
      )}
    </div>
  )
} 