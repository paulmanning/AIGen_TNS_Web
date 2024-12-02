'use client'

import { useState } from 'react'
import { SimulationShip, VesselType } from '@/types/simulation'
import { PlayCircle, PauseCircle, SkipBack, SkipForward, RotateCcw, Play, Pause, Anchor, Ship, Fish, Waves } from 'lucide-react'

interface SimulationControllerProps {
  ships: SimulationShip[]
  currentTime: number
  isPlaying: boolean
  onPlayPause: () => void
  onTimeChange: (time: number) => void
  onShipSelect: (ship: SimulationShip) => void
  selectedShipId: string | undefined
  isSetupMode: boolean
  duration: number
  onShipUpdate: (updatedShips: SimulationShip[]) => void
  onRestart: () => void
  simulationSpeed: number
  onSpeedChange: (speed: number) => void
}

function formatNumber(value: number | undefined, decimals: number = 0): string {
  if (value === undefined || value === null) return '0'
  return value.toFixed(decimals)
}

function getShipIcon(type: VesselType) {
  switch (type) {
    case VesselType.SURFACE_WARSHIP:
      return <Ship size={16} />
    case VesselType.SUBMARINE:
      return <Waves size={16} />
    case VesselType.MERCHANT:
      return <Anchor size={16} />
    case VesselType.FISHING:
      return <Fish size={16} />
    case VesselType.BIOLOGIC:
      return <Waves size={16} />
    default:
      return <Ship size={16} />
  }
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
  onSpeedChange,
}: SimulationControllerProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Control Bar */}
      <div className="flex-none p-2 border-b border-navy-medium bg-navy-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onRestart}
              className="navy-button"
              title="Restart"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onPlayPause}
              className="navy-button"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="relative">
              <select
                value={simulationSpeed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="min-w-[60px] px-2 py-1 rounded bg-navy-dark text-navy-lightest border border-white focus:border-accent-gold focus:outline-none appearance-none pr-6"
                title="Simulation Speed"
              >
                <option value="1">1×</option>
                <option value="2">2×</option>
                <option value="5">5×</option>
                <option value="10">10×</option>
                <option value="20">20×</option>
                <option value="50">50×</option>
              </select>
            </div>
          </div>
          <div className="text-navy-lightest font-mono">
            {formatTime(currentTime)}
          </div>
        </div>
        <div className="mt-4 px-2">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => onTimeChange(Number(e.target.value))}
            className="w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Ship Timeline */}
      <div className="flex-1 overflow-y-auto">
        {ships.map((ship) => (
          <div
            key={ship.id}
            onClick={() => onShipSelect(ship)}
            className={`
              p-2 cursor-pointer transition-colors border-l-4
              ${ship.id === selectedShipId 
                ? 'bg-navy-medium border-accent-gold text-accent-gold' 
                : 'hover:bg-navy-dark hover:border-navy-light border-transparent text-navy-lightest'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <span className={`text-xl ${ship.id === selectedShipId ? 'text-accent-gold' : ''}`} role="img" aria-label={ship.type}>
                {getShipIcon(ship.type)}
              </span>
              <div>
                <div className="font-medium">{ship.name}</div>
                <div className={`text-sm ${ship.id === selectedShipId ? 'text-accent-gold' : 'text-navy-light'}`}>
                  {ship.hullNumber}
                </div>
              </div>
              <div className={`ml-auto text-sm ${ship.id === selectedShipId ? 'text-accent-gold' : 'text-navy-light'}`}>
                {ship.speed !== undefined && ship.course !== undefined ? (
                  `${formatNumber(ship.speed, 1)} kts @ ${formatNumber(ship.course)}°`
                ) : (
                  'Not moving'
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
} 