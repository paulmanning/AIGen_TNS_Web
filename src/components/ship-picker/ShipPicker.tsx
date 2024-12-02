'use client'

import React, { useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getShipIcon } from '@/utils/ship-icons'
import type { ShipData } from '@/data/ships'
import { defaultShips } from '@/data/ships'
import { VesselType } from '@/types/simulation'
import { getEmptyImage } from 'react-dnd-html5-backend'

interface ShipPickerProps {
  onSelect: (ship: ShipData) => void
  selectedShipId?: string
}

// Custom drag layer component
const DragPreview = () => (
  <div style={{ width: 32, height: 32 }}>
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="8" fill="rgba(59, 130, 246, 0.5)" stroke="#2563eb" strokeWidth="1.5"/>
      <path d="M 16 16 L 16 4 M 16 4 L 12 8 M 16 4 L 20 8" stroke="#2563eb" strokeWidth="1.5" fill="none"/>
    </svg>
  </div>
)

function DraggableShip({ ship, isSelected, onSelect }: {
  ship: ShipData
  isSelected: boolean
  onSelect: () => void
}) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'SHIP',
    item: () => {
      console.log(`Starting drag for ${ship.name} (${ship.id})`)
      return {
        ...ship,
        preview: <DragPreview />
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  }), [ship])

  // Use empty image as default preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  return (
    <div
      ref={drag}
      onClick={onSelect}
      className={`
        p-4 cursor-move select-none
        hover:bg-gray-200 dark:hover:bg-gray-700
        ${isDragging ? 'opacity-50' : ''}
        ${isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl" role="img" aria-label={ship.type}>
          {getShipIcon(ship.type, ship.nationality, ship.id)}
        </span>
        <div>
          <div className="font-medium">{ship.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {ship.hullNumber}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShipPicker({ onSelect, selectedShipId }: ShipPickerProps) {
  const [ships, setShips] = useState<ShipData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedTypes, setCollapsedTypes] = useState<Set<VesselType>>(new Set())

  useEffect(() => {
    const storedShips = localStorage.getItem('availableShips')
    let loadedShips: ShipData[] = []
    
    if (storedShips) {
      loadedShips = JSON.parse(storedShips)
    } else {
      loadedShips = defaultShips
      localStorage.setItem('availableShips', JSON.stringify(defaultShips))
    }
    
    setShips(loadedShips)
    
    // Select first ship if none is selected
    if (loadedShips.length > 0 && !selectedShipId) {
      onSelect(loadedShips[0])
    }
  }, [onSelect, selectedShipId])

  const filteredShips = ships.filter(ship => {
    if (!ship || typeof ship.name !== 'string') return false
    return (
      ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ship.hullNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
  })

  // Group ships by type
  const groupedShips = filteredShips.reduce((groups, ship) => {
    const type = ship.type
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(ship)
    return groups
  }, {} as Record<VesselType, ShipData[]>)

  const typeOrder: VesselType[] = [
    VesselType.SURFACE_WARSHIP,
    VesselType.SUBMARINE,
    VesselType.MERCHANT,
    VesselType.FISHING,
    VesselType.BIOLOGIC
  ]

  const getTypeLabel = (type: VesselType): string => {
    return type.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 select-none">Available Ships</h2>
        <input
          type="text"
          placeholder="Search ships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {typeOrder.map(type => {
          const shipsOfType = groupedShips[type] || []
          if (shipsOfType.length === 0) return null

          return (
            <div key={type} className="select-none">
              <button
                onClick={() => setCollapsedTypes(prev => {
                  const newSet = new Set(prev)
                  if (newSet.has(type)) {
                    newSet.delete(type)
                  } else {
                    newSet.add(type)
                  }
                  return newSet
                })}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 
                         font-medium flex items-center justify-between 
                         hover:bg-gray-300 dark:hover:bg-gray-600
                         select-none"
              >
                <span>{getTypeLabel(type)} ({shipsOfType.length})</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {collapsedTypes.has(type) ? '▼' : '▲'}
                </span>
              </button>
              {!collapsedTypes.has(type) && (
                <div>
                  {shipsOfType.map((ship) => (
                    <DraggableShip
                      key={ship.id}
                      ship={ship}
                      isSelected={ship.id === selectedShipId}
                      onSelect={() => onSelect(ship)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 