'use client'

import { useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import type { ShipData } from '@/data/ships'
import { defaultShips } from '@/data/ships'
import { VesselType } from '@/types/simulation'

interface ShipPickerItemProps {
  ship: ShipData
}

function ShipPickerItem({ ship }: ShipPickerItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SHIP',
    item: () => {
      console.log('Starting drag for ship:', ship.id)
      return ship
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      console.log('Drag ended:', {
        dropped: monitor.didDrop(),
        shipId: ship.id
      })
    }
  }), [ship])

  const getFlagEmoji = (nationality: string) => {
    switch (nationality) {
      case 'USA':
        return '🇺🇸'
      case 'GBR':
        return '🇬🇧'
      case 'CHN':
        return '🇨🇳'
      case 'JPN':
        return '🇯🇵'
      default:
        return ''
    }
  }

  return (
    <div
      ref={drag}
      className={`p-2 hover:bg-gray-700 rounded cursor-move transition-colors
        ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex items-center">
        <span className="mr-2 text-lg">{getFlagEmoji(ship.nationality)}</span>
        <div>
          <div className="text-sm font-medium text-white">{ship.name}</div>
          <div className="text-xs text-gray-400">{ship.hullNumber}</div>
        </div>
      </div>
    </div>
  )
}

interface ShipCategoryProps {
  title: string
  count: number
  ships: ShipData[]
  isExpanded: boolean
  onToggle: () => void
}

function ShipCategory({ title, count, ships, isExpanded, onToggle }: ShipCategoryProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded"
      >
        <div className="flex items-center">
          <span className="text-sm font-medium text-white">{title}</span>
          <span className="ml-2 text-xs text-gray-400">({count})</span>
        </div>
        <span className="text-gray-400 text-xs">{isExpanded ? '▼' : '▶'}</span>
      </button>
      {isExpanded && (
        <div className="ml-2 border-l border-gray-700">
          {ships.map(ship => (
            <ShipPickerItem key={ship.id} ship={ship} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ShipPicker() {
  const [ships, setShips] = useState<ShipData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Surface Warship': true,
    'Submarine': true
  })

  useEffect(() => {
    // Load available ships from localStorage or use defaults
    const storedShips = localStorage.getItem('availableShips')
    const shipIds = storedShips ? JSON.parse(storedShips) : []
    setShips(defaultShips.filter(ship => shipIds.includes(ship.id)))
  }, [])

  const filteredShips = ships.filter(ship => 
    ship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ship.hullNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const shipsByType = filteredShips.reduce((acc, ship) => {
    const category = ship.type === VesselType.SUBMARINE ? 'Submarine' : 'Surface Warship'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(ship)
    return acc
  }, {} as Record<string, ShipData[]>)

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <input
          type="text"
          placeholder="Search ships..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {Object.entries(shipsByType).map(([category, ships]) => (
          <ShipCategory
            key={category}
            title={category}
            count={ships.length}
            ships={ships}
            isExpanded={expandedCategories[category]}
            onToggle={() => toggleCategory(category)}
          />
        ))}
      </div>
    </div>
  )
} 