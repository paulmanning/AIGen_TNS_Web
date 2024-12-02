'use client'

import React from 'react'
import type { ShipData } from '@/data/ships'
import type { SimulationShip } from '@/types/simulation'
import { getShipIcon } from '@/utils/ship-icons'

interface ShipDetailsProps {
  ship: ShipData
  isSetupMode: boolean
  simulationShip?: SimulationShip
  selectedFromController?: boolean
}

function formatNumber(value: number | undefined, decimals: number = 0): string {
  if (value === undefined || value === null) return '0'
  return value.toFixed(decimals)
}

export function ShipDetails({ ship, isSetupMode, simulationShip, selectedFromController }: ShipDetailsProps) {
  if (!ship) {
    return (
      <div className="p-4 text-navy-light text-center">
        Select a ship to view details
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      {/* Basic Info - Always shown */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl" role="img" aria-label={ship.type}>
          {getShipIcon(ship.type, ship.nationality, ship.id)}
        </span>
        <div>
          <h3 className="font-medium text-navy-lightest">{ship.name}</h3>
          <p className="text-xs text-navy-light">{ship.hullNumber}</p>
        </div>
      </div>

      {/* Current State (when selected from SimulationController) */}
      {selectedFromController && simulationShip && (
        <div className="space-y-2 border-l-2 border-accent-gold pl-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-navy-light">Position:</span>
              <div className="text-navy-lightest font-mono">
                {formatNumber(simulationShip.position.lat, 4)}°N
                <br />
                {formatNumber(simulationShip.position.lng, 4)}°E
              </div>
            </div>
            <div>
              <span className="text-navy-light">Course:</span>
              <div className="text-navy-lightest font-mono">{formatNumber(simulationShip.course)}°</div>
            </div>
            <div>
              <span className="text-navy-light">Speed:</span>
              <div className="text-navy-lightest font-mono">{formatNumber(simulationShip.speed, 1)} kts</div>
            </div>
            <div>
              <span className="text-navy-light">Depth:</span>
              <div className="text-navy-lightest font-mono">{formatNumber(simulationShip.depth)} m</div>
            </div>
            <div className="col-span-2">
              <span className="text-navy-light">{isSetupMode ? 'Initial Order:' : 'Current Order:'}</span>
              <div className="text-navy-lightest font-mono">None</div>
            </div>
          </div>
        </div>
      )}

      {/* Characteristics */}
      {ship.characteristics && (
        <div className="text-xs">
          <h4 className="text-sm font-medium text-navy-light mb-1">Characteristics</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>
              <span className="text-navy-light">Speed Range:</span>
              <div className="text-navy-lightest font-mono">
                {ship.characteristics.minSpeed || 0} - {ship.characteristics.maxSpeed || 30} kts
              </div>
            </div>
            <div>
              <span className="text-navy-light">Depth Range:</span>
              <div className="text-navy-lightest font-mono">
                {ship.characteristics.minDepth || 0} - {ship.characteristics.maxDepth || 0} m
              </div>
            </div>
            <div>
              <span className="text-navy-light">Turn Rate:</span>
              <div className="text-navy-lightest font-mono">{ship.characteristics.turnRate || 6}°/min</div>
            </div>
            <div>
              <span className="text-navy-light">Acceleration:</span>
              <div className="text-navy-lightest font-mono">{ship.characteristics.accelerationRate || 2} kts/min</div>
            </div>
          </div>
        </div>
      )}

      {/* Propulsion */}
      {ship.characteristics?.propulsion && (
        <div className="text-xs">
          <h4 className="text-sm font-medium text-navy-light mb-1">Propulsion</h4>
          <div className="space-y-1">
            {ship.characteristics.propulsion.map((prop, index) => (
              <div key={index} className="border-l border-navy-medium pl-2">
                <div className="text-navy-lightest">{prop.type}</div>
                {prop.configuration?.bladeCount && (
                  <div className="text-navy-light">
                    {prop.configuration.bladeCount} blade {prop.configuration.bladeType}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acoustic Signatures */}
      {ship.acousticSignatures && ship.acousticSignatures.length > 0 && (
        <div className="text-xs">
          <h4 className="text-sm font-medium text-navy-light mb-1">Acoustic Signatures</h4>
          <div className="space-y-2">
            {ship.acousticSignatures.map((sig, index) => (
              <div key={index} className="border-l border-navy-medium pl-2">
                <div className="font-medium text-navy-lightest">{sig.type}</div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <span className="text-navy-light">Center:</span>
                    <div className="text-navy-lightest font-mono">{sig.centerFrequency} Hz</div>
                  </div>
                  <div>
                    <span className="text-navy-light">Bandwidth:</span>
                    <div className="text-navy-lightest font-mono">{sig.bandwidth} Hz</div>
                  </div>
                  <div>
                    <span className="text-navy-light">Strength:</span>
                    <div className="text-navy-lightest font-mono">{sig.signalStrength} dB</div>
                  </div>
                  {sig.driftRate && (
                    <div>
                      <span className="text-navy-light">Drift:</span>
                      <div className="text-navy-lightest font-mono">{sig.driftRate} Hz/min</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 