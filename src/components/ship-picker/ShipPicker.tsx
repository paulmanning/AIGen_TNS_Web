'use client'

import React, { useEffect, useState } from 'react'
import { getShipIcon } from '@/utils/ship-icons'
import type { ShipData } from '@/data/ships'
import { VesselType } from '@/types/simulation'

interface ShipPickerProps {
  onSelect: (ship: ShipData) => void
  selectedShipId: string | undefined
}

export function ShipPicker({ onSelect, selectedShipId }: ShipPickerProps) {
  const [ships, setShips] = useState<ShipData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedTypes, setCollapsedTypes] = useState<Set<VesselType>>(new Set())

  useEffect(() => {
    const loadShips = async () => {
      const storedShips = localStorage.getItem('availableShips')
      if (storedShips) {
        setShips(JSON.parse(storedShips))
      }
    }
    loadShips()
  }, [])

  const filteredShips = ships.filter(ship =>
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ship.hullNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

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
        <h2 className="text-lg font-semibold mb-4">Available Ships</h2>
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
            <div key={type}>
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
                         hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <span>{getTypeLabel(type)} ({shipsOfType.length})</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {collapsedTypes.has(type) ? '▼' : '▲'}
                </span>
              </button>
              {!collapsedTypes.has(type) && (
                <div>
                  {shipsOfType.map((ship) => (
                    <div
                      key={ship.id}
                      onClick={() => onSelect(ship)}
                      className={`p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                        selectedShipId === ship.id ? 'bg-blue-100 dark:bg-blue-900' : ''
                      }`}
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