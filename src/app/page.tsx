'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setSimulation } from '@/store/simulationSlice'
import { NewSimulationDialog } from '@/components/dialogs/NewSimulationDialog'
import type { SimulationData } from '@/types/simulation'

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleNewSimulation = () => {
    setIsDialogOpen(true)
  }

  const handleCreateSimulation = (simulationData: SimulationData) => {
    console.log('Creating simulation:', simulationData)
    // Save to localStorage and Redux store
    localStorage.setItem('currentSimulation', JSON.stringify(simulationData))
    dispatch(setSimulation(simulationData))
    router.push('/simulation')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold">
          Naval Tactical Simulator
        </h1>
        
        <p className="text-xl text-gray-600">
          Welcome to the Naval Tactical Simulator
        </p>

        <div className="space-y-4">
          <button
            onClick={handleNewSimulation}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            New Simulation
          </button>
        </div>
      </div>

      <NewSimulationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateSimulation}
      />
    </main>
  )
} 