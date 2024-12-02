'use client'

import { useDrag } from 'react-dnd'
import type { ShipData } from '@/data/ships'

export function DraggableShip({ ship }: { ship: ShipData }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ship',
    item: ship,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`p-2 border rounded cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {ship.name}
    </div>
  )
} 