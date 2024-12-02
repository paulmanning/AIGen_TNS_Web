'use client'

import { useDrop } from 'react-dnd'
import type { ShipData } from '@/data/ships'
import mapboxgl from 'mapbox-gl'

export interface DroppableMapOverlayProps {
  onShipDrop: (ship: ShipData, position: { x: number, y: number }) => void
  map: mapboxgl.Map
}

export function DroppableMapOverlay({ onShipDrop, map }: DroppableMapOverlayProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ship',
    drop: (item: ShipData, monitor) => {
      console.log('Drop event detected', { item })
      const dropOffset = monitor.getClientOffset()
      if (!dropOffset) {
        console.warn('No drop offset detected')
        return
      }

      // Get map container dimensions
      const mapContainer = map.getContainer()
      const rect = mapContainer.getBoundingClientRect()
      console.log('Map container rect:', rect)
      console.log('Drop offset:', dropOffset)

      // Calculate relative position within the map container
      const x = dropOffset.x - rect.left
      const y = dropOffset.y - rect.top

      // Convert pixel coordinates to map coordinates
      const point = new mapboxgl.Point(x, y)
      const lngLat = map.unproject(point)
      console.log('Converted coordinates:', { point, lngLat })

      // Update ship position with the map coordinates
      const updatedShip = {
        ...item,
        position: {
          lng: lngLat.lng,
          lat: lngLat.lat
        }
      }

      console.log('Calling onShipDrop with:', { updatedShip, position: { x, y } })
      onShipDrop(updatedShip, { x, y })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [map, onShipDrop])

  console.log('DroppableMapOverlay state:', { isOver, canDrop })

  return (
    <div
      ref={drop}
      data-testid="map-drop-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isOver ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isOver ? 'white' : 'transparent',
        pointerEvents: 'all',
        zIndex: 1000,
        cursor: 'copy',
      }}
    >
      {isOver && <div>Release to place ship</div>}
    </div>
  )
} 