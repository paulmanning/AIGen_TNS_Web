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
    drop: (item: ShipData, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset || !map) return

      const element = document.getElementById('map-overlay')
      if (!element) return

      const rect = element.getBoundingClientRect()
      const x = offset.x - rect.left
      const y = offset.y - rect.top

      // Convert screen coordinates to map coordinates
      const point = map.unproject([x, y])
      
      // Show drop message
      setDropMessage(`Dropped ${item.name} at ${point.lat.toFixed(4)}°N, ${point.lng.toFixed(4)}°E`)
      setMessagePosition({ x: offset.x, y: offset.y })

      // Clear message after 3 seconds
      setTimeout(() => setDropMessage(null), 3000)

      // Call the drop handler
      onShipDrop(item, { x: point.lng, y: point.lat })
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  }), [map, onShipDrop])

  return (
    <>
      <div
        id="map-overlay"
        ref={drop}
        className="absolute inset-0"
        style={{ 
          backgroundColor: isOver ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
          transition: 'background-color 0.2s ease-in-out'
        }}
      />
      {dropMessage && (
        <div
          className="fixed z-50 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg pointer-events-none"
          style={{
            left: messagePosition.x,
            top: messagePosition.y - 40,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {dropMessage}
        </div>
      )}
    </>
  )
} 