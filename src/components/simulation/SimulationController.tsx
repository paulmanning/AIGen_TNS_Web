'use client'

import { useState } from 'react'
import { SimulationShip, VesselType } from '@/types/simulation'
import { PlayCircle, PauseCircle, SkipBack, SkipForward } from 'lucide-react'

// Constants for sizing (matching ShipMarker.tsx)
const SYMBOL_SIZE = 8
const ARROW_SIZE = 12

// Basic frame shapes based on affiliation
const frameShapes = {
  friend: (size: number) => `
    M ${16 - size} ${16} 
    L ${16} ${16 - size} 
    L ${16 + size} ${16} 
    L ${16} ${16 + size} 
    Z
  `,  // Diamond
}

// Ship type modifiers
const shipModifiers = {
  [VesselType.SURFACE_WARSHIP]: {
    symbol: (size: number) => `M ${16 - size * 0.7} ${16} L ${16 + size * 0.7} ${16}`, // Horizontal line
  },
  [VesselType.SUBMARINE]: {
    symbol: (size: number) => `
      M ${16 - size * 0.7} ${16 + size * 0.3}
      L ${16} ${16 - size * 0.3}
      L ${16 + size * 0.7} ${16 + size * 0.3}
    `,  // Inverted V for submarine
  }
}

interface SimulationControllerProps {
  ships: SimulationShip[]
  currentTime: number
  isPlaying: boolean
  onPlayPause: () => void
  onTimeChange: (time: number) => void
  onShipSelect: (shipId: string) => void
  selectedShipId?: string
  isSetupMode: boolean
  duration: number
  onShipUpdate: (ships: SimulationShip[]) => void
  onRestart: () => void
  simulationSpeed: number
  onSpeedChange: (speed: number) => void
}

export function SimulationController({
  ships,
  currentTime,
  isPlaying,
  onPlayPause,
  onTimeChange,
  onShipSelect,
  selectedShipId,
  isSetupMode,
  duration,
  onShipUpdate,
  onRestart,
  simulationSpeed,
  onSpeedChange
}: SimulationControllerProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  // Convert time to mm:ss format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      className="flex flex-col w-full h-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      role="region"
      aria-label="Simulation Controller"
    >
      {/* Ship Timeline Rows */}
      <div className="flex-1 overflow-y-auto">
        {ships.map((ship) => {
          const style = shipModifiers[ship.type] || shipModifiers[VesselType.SURFACE_WARSHIP]
          return (
            <div
              key={ship.id}
              onClick={() => onShipSelect(ship.id)}
              className={`flex items-center p-1 border-b border-gray-200 dark:border-gray-700 cursor-pointer h-8
                ${selectedShipId === ship.id ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              role="button"
              aria-pressed={selectedShipId === ship.id}
              aria-label={`Select ${ship.name}`}
            >
              {/* Ship Info */}
              <div className="w-64 flex-shrink-0 flex items-center space-x-2">
                {/* Ship Symbol */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 32 32"
                  className="flex-shrink-0"
                >
                  {/* Frame */}
                  <path
                    d={frameShapes.friend(SYMBOL_SIZE)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={selectedShipId === ship.id ? 'text-blue-600' : 'text-gray-600'}
                  />
                  
                  {/* Ship type modifier */}
                  <path
                    d={style.symbol(SYMBOL_SIZE)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={selectedShipId === ship.id ? 'text-blue-600' : 'text-gray-600'}
                  />
                </svg>

                <div className="min-w-0">
                  <div className="font-medium text-sm truncate flex items-center space-x-1">
                    <span>{ship.name}</span>
                    <span className="text-xs text-gray-500">({ship.hullNumber})</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {`${Math.round(ship.speed)} kts / ${Math.round(ship.depth)}m`}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div 
                className="flex-1 h-6 relative mx-4 bg-gray-100 dark:bg-gray-700 rounded"
                role="timer"
                aria-label={`Timeline for ${ship.name}`}
              >
                {/* Current Time Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                  role="presentation"
                />

                {/* Time Grid */}
                <div className="absolute inset-0 flex">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 border-l border-gray-300 dark:border-gray-600"
                      style={{ opacity: i % 5 === 0 ? 0.5 : 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Control Bar */}
      <div 
        className="flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700"
        role="toolbar"
        aria-label="Playback controls"
      >
        {/* Time Display */}
        <div className="text-sm font-mono" role="timer" aria-label="Current time">
          {formatTime(currentTime)}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onTimeChange(Math.max(0, currentTime - 60))}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Skip back"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onPlayPause}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <PauseCircle className="w-6 h-6" />
            ) : (
              <PlayCircle className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => onTimeChange(Math.min(duration, currentTime + 60))}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label="Skip forward"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Control */}
        <select
          value={simulationSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="px-2 py-1 border rounded text-sm"
        >
          {[1, 2, 5, 10, 20, 50].map(speed => (
            <option key={speed} value={speed}>{speed}x</option>
          ))}
        </select>
      </div>
    </div>
  )
} 