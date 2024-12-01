'use client'

import { useState } from 'react'
import type { SimulationData } from '@/types/simulation'

interface SimulationControlsProps {
  simulation: SimulationData
  onReset: () => void
}

export function SimulationControls({ simulation, onReset }: SimulationControlsProps) {
  const [isSetupMode, setIsSetupMode] = useState(true)

  return (
    <header className="flex-none bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Naval Tactical Simulator - {isSetupMode ? 'Setup' : 'Run'}
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={onReset}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition-colors"
          >
            Reset
          </button>
          <button 
            onClick={() => setIsSetupMode(!isSetupMode)}
            className={`px-3 py-1 rounded transition-colors ${
              isSetupMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSetupMode ? 'Save' : 'Running'}
          </button>
        </div>
      </div>
    </header>
  )
} 