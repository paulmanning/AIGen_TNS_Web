'use client'

import React from 'react'
import { ShipData } from '@/data/ships'
import { SimulationShip } from '@/types/simulation'
import { getShipIcon } from '@/utils/ship-icons'

interface ShipDetailsProps {
  ship: ShipData | null
  isSetupMode: boolean
  simulationShip?: SimulationShip
}

export function ShipDetails({ ship, isSetupMode, simulationShip }: ShipDetailsProps) {
  if (!ship) {
    return (
      <div className="p-4 text-navy-light text-center">
        Select a ship to view details
      </div>
    )
  }

  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined | null, decimals: number = 1) => {
    if (value === undefined || value === null) return '0'
    return value.toFixed(decimals)
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="navy-title mb-4">Ship Details</h2>
      
      {/* Basic Info */}
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2" role="img" aria-label={ship.type}>
            {getShipIcon(ship.type, ship.nationality, ship.id)}
          </span>
          <div>
            <h3 className="font-medium text-navy-lightest">{ship.name}</h3>
            <p className="text-sm text-navy-light">
              {ship.hullNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Current State (only in run mode) */}
      {!isSetupMode && simulationShip && (
        <div className="space-y-2 border-l-2 border-accent-gold pl-2">
          <h4 className="navy-subtitle">
            Current State
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-navy-light">Position:</span>
              <div className="text-navy-lightest">
                {formatNumber(simulationShip.position?.lat, 4)}°N, {formatNumber(simulationShip.position?.lng, 4)}°E
              </div>
            </div>
            <div>
              <span className="text-navy-light">Course:</span>
              <div className="text-navy-lightest">{formatNumber(simulationShip.course)}°</div>
            </div>
            <div>
              <span className="text-navy-light">Speed:</span>
              <div className="text-navy-lightest">{formatNumber(simulationShip.speed)} kts</div>
            </div>
            <div>
              <span className="text-navy-light">Depth:</span>
              <div className="text-navy-lightest">{formatNumber(simulationShip.depth, 0)} m</div>
            </div>
          </div>
        </div>
      )}

      {/* Characteristics */}
      {ship.characteristics && (
        <div className="space-y-2">
          <h4 className="navy-subtitle">
            Characteristics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-navy-light">Speed:</span>
              <div className="text-navy-lightest">
                {ship.characteristics.minSpeed || 0} - {ship.characteristics.maxSpeed || 30} kts
              </div>
            </div>
            <div>
              <span className="text-navy-light">Depth:</span>
              <div className="text-navy-lightest">
                {ship.characteristics.minDepth || 0} - {ship.characteristics.maxDepth || 0} m
              </div>
            </div>
            <div>
              <span className="text-navy-light">Turn Rate:</span>
              <div className="text-navy-lightest">{ship.characteristics.turnRate || 6}°/min</div>
            </div>
            <div>
              <span className="text-navy-light">Acceleration:</span>
              <div className="text-navy-lightest">{ship.characteristics.accelerationRate || 2} kts/min</div>
            </div>
          </div>
        </div>
      )}

      {/* Propulsion */}
      {ship.characteristics?.propulsion && (
        <div className="space-y-2">
          <h4 className="navy-subtitle">
            Propulsion
          </h4>
          {ship.characteristics.propulsion.map((prop, index) => (
            <div key={index} className="text-sm">
              <div className="text-navy-light">
                {prop.type}
              </div>
              {prop.configuration?.bladeCount && (
                <div className="text-navy-lightest">
                  {prop.configuration.bladeCount} blade {prop.configuration.bladeType}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Acoustic Signatures */}
      {ship.acousticSignatures && ship.acousticSignatures.length > 0 && (
        <div className="space-y-2">
          <h4 className="navy-subtitle">
            Acoustic Signatures
          </h4>
          {ship.acousticSignatures.map((sig, index) => (
            <div key={index} className="text-sm border-l-2 border-navy-medium pl-2">
              <div className="font-medium text-navy-lightest">{sig.type}</div>
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <span className="text-navy-light">Center:</span>
                  <div className="text-navy-lightest">{sig.centerFrequency} Hz</div>
                </div>
                <div>
                  <span className="text-navy-light">Bandwidth:</span>
                  <div className="text-navy-lightest">{sig.bandwidth} Hz</div>
                </div>
                <div>
                  <span className="text-navy-light">Strength:</span>
                  <div className="text-navy-lightest">{sig.signalStrength} dB</div>
                </div>
                {sig.driftRate && (
                  <div>
                    <span className="text-navy-light">Drift:</span>
                    <div className="text-navy-lightest">{sig.driftRate} Hz/min</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 