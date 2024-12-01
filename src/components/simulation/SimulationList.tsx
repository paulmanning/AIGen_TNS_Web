'use client'

import React from 'react'

interface Simulation {
  id: string
  name: string
  lastModified: Date
  description?: string
}

interface SimulationListProps {
  simulations: Simulation[]
  onLoadSimulation: (id: string) => void
}

export function SimulationList({ simulations, onLoadSimulation }: SimulationListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Simulations
        </h2>
        <div className="space-y-4">
          {simulations.map((sim) => (
            <div 
              key={sim.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {sim.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last modified: {sim.lastModified.toLocaleDateString()}
                </p>
                {sim.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {sim.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => onLoadSimulation(sim.id)}
                className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Load
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 