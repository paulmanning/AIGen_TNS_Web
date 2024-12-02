'use client'

import { useState, useMemo } from 'react'
import { SimulationShip, VesselType } from '@/types/simulation'
import { BiPlay, BiPause, BiReset } from 'react-icons/bi'
import { getShipIcon } from '@/utils/ship-icons'

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
  startTime: string
  onShipUpdate: (updatedShips: SimulationShip[]) => void
  onRestart: () => void
  simulationSpeed: number
  onSpeedChange: (speed: number) => void
}

function formatNumber(value: number | undefined, decimals: number = 0): string {
  if (value === undefined || value === null) return '0'
  return value.toFixed(decimals)
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

function formatDateTime(isoString: string, addSeconds: number = 0): string {
  const date = new Date(isoString)
  date.setSeconds(date.getSeconds() + addSeconds)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
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
  startTime,
  onShipUpdate,
  onRestart,
  simulationSpeed,
  onSpeedChange,
}: SimulationControllerProps) {
  // Generate tick marks every 30 minutes
  const timeMarks = useMemo(() => {
    const marks = []
    const durationInSeconds = duration * 60  // Convert minutes to seconds
    const interval = 30 * 60 // 30 minutes in seconds
    for (let time = 0; time <= durationInSeconds; time += interval) {
      marks.push({
        value: time,
        label: formatTime(time)
      })
    }
    return marks
  }, [duration])

  // Convert duration to seconds for the slider
  const durationInSeconds = duration * 60

  return (
    <div className="h-full flex flex-col">
      {/* Ship Timeline */}
      <div className={`${isSetupMode ? 'h-full' : 'flex-1'} overflow-y-auto border-b border-navy-medium`}>
        {ships.map((ship) => (
          <div
            key={ship.id}
            onClick={() => onShipSelect(ship)}
            className={`
              py-2 px-4 cursor-pointer transition-colors border-l-4
              ${ship.id === selectedShipId 
                ? 'bg-navy-medium border-accent-gold text-accent-gold' 
                : 'hover:bg-navy-dark hover:border-navy-light border-transparent text-navy-lightest'
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl" role="img" aria-label={ship.type}>
                {getShipIcon(ship.type, ship.nationality, ship.id)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{ship.name}</div>
                <div className={`text-xs ${ship.id === selectedShipId ? 'text-accent-gold' : 'text-navy-light'}`}>
                  {ship.hullNumber}
                </div>
              </div>
              <div className={`text-xs whitespace-nowrap ${ship.id === selectedShipId ? 'text-accent-gold' : 'text-navy-light'}`}>
                {formatNumber(ship.course, 0)}° @ {formatNumber(ship.speed, 1)} kts
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar - Only shown in run mode */}
      {!isSetupMode && (
        <div className="flex-none p-2 bg-navy-dark space-y-4">
          {/* Time Slider with Tick Marks */}
          <div className="space-y-4 px-4">
            {/* Time Marks */}
            <div className="relative h-6">
              {timeMarks.map((mark, index) => {
                const percent = (mark.value / durationInSeconds) * 100
                return (
                  <div 
                    key={index}
                    className="absolute flex flex-col items-center"
                    style={{ 
                      left: `${percent}%`,
                      transform: 'translateX(-50%)',
                      minWidth: '40px'
                    }}
                  >
                    <div className="text-xs text-navy-light whitespace-nowrap">
                      {mark.label}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tick Marks and Slider */}
            <div className="relative mt-2">
              {/* Tick Marks */}
              <div className="absolute w-full top-0 h-1">
                {timeMarks.map((mark, index) => {
                  const percent = (mark.value / durationInSeconds) * 100
                  return (
                    <div 
                      key={index}
                      className="absolute w-px h-full bg-navy-medium"
                      style={{ 
                        left: `${percent}%`,
                      }}
                    />
                  )
                })}
              </div>

              {/* Slider */}
              <input
                type="range"
                min={0}
                max={durationInSeconds}
                value={currentTime}
                onChange={(e) => onTimeChange(Number(e.target.value))}
                className="w-full focus:outline-none relative z-10"
              />
            </div>
          </div>

          {/* Controls and Current Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={onRestart}
                className="navy-button"
                title="Restart"
              >
                <BiReset size={16} />
              </button>
              <button
                onClick={onPlayPause}
                className="navy-button"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <BiPause size={16} /> : <BiPlay size={16} />}
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
            <div className="text-navy-lightest font-mono text-sm">
              {formatDateTime(startTime, currentTime)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 