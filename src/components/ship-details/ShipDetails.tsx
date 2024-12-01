'use client'

import React from 'react'
import { ShipData } from '@/data/ships'
import { getShipIcon } from '@/utils/ship-icons'

interface ShipDetailsProps {
  ship: ShipData | null
}

export function ShipDetails({ ship }: ShipDetailsProps) {
  if (!ship) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
        Select a ship to view details
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Ship Details</h2>
      
      {/* Basic Info */}
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2" role="img" aria-label={ship.type}>
            {getShipIcon(ship.type, ship.nationality, ship.id)}
          </span>
          <div>
            <h3 className="font-medium">{ship.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {ship.hullNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Characteristics */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
          Characteristics
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Speed:</span>
            <div>
              {ship.characteristics.minSpeed} - {ship.characteristics.maxSpeed} kts
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Depth:</span>
            <div>
              {ship.characteristics.minDepth} - {ship.characteristics.maxDepth} m
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Turn Rate:</span>
            <div>{ship.characteristics.turnRate}°/min</div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Acceleration:</span>
            <div>{ship.characteristics.accelerationRate} kts/min</div>
          </div>
        </div>
      </div>

      {/* Propulsion */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
          Propulsion
        </h4>
        {ship.characteristics.propulsion.map((prop, index) => (
          <div key={index} className="text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              {prop.type}
            </div>
            {prop.configuration.bladeCount && (
              <div>
                {prop.configuration.bladeCount} blade {prop.configuration.bladeType}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Acoustic Signatures */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
          Acoustic Signatures
        </h4>
        {ship.acousticSignatures.map((sig, index) => (
          <div key={index} className="text-sm border-l-2 border-gray-300 pl-2">
            <div className="font-medium">{sig.type}</div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Center:</span>
                <div>{sig.centerFrequency} Hz</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Bandwidth:</span>
                <div>{sig.bandwidth} Hz</div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Strength:</span>
                <div>{sig.signalStrength} dB</div>
              </div>
              {sig.driftRate && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Drift:</span>
                  <div>{sig.driftRate} Hz/min</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 