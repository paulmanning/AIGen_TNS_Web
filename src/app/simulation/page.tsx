'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setSimulation } from '@/store/simulationSlice'
import type { SimulationData } from '@/types/simulation'
import { MapComponent } from '@/components/map/MapComponent'
import { ShipPicker } from '@/components/ship-picker/ShipPicker'
import type { ShipData } from '@/data/ships'
import { ShipDetails } from '@/components/ship-details/ShipDetails'

export default function SimulationPage() {
  const dispatch = useDispatch()
  const simulation = useSelector((state: RootState) => state.simulation as SimulationData | null)
  const [isSetupMode, setIsSetupMode] = useState(true)
  const [selectedShip, setSelectedShip] = useState<ShipData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const lastLocation = React.useRef<SimulationData['location'] | null>(null)

  useEffect(() => {
    const loadSimulation = () => {
      setIsLoading(true)
      const simData = localStorage.getItem('currentSimulation')
      console.log('Loading simulation data:', simData)
      
      if (simData) {
        try {
          const parsed = JSON.parse(simData)
          
          // Ensure all required fields are present
          if (!parsed.name || !parsed.location?.center || !parsed.location?.zoom) {
            console.error('Missing required simulation data')
            setIsLoading(false)
            return
          }
          
          console.log('Setting simulation:', parsed)
          dispatch(setSimulation(parsed))
        } catch (error) {
          console.error('Error loading simulation:', error)
        }
      }
      setIsLoading(false)
    }

    if (!simulation) {
      loadSimulation()
    } else {
      setIsLoading(false)
    }
  }, [dispatch, simulation])

  // Ensure map updates when simulation changes
  useEffect(() => {
    if (simulation?.location) {
      console.log('Map should update with:', simulation.location)
    }
  }, [simulation])

  const handleSave = () => {
    if (!simulation) return
    setIsSetupMode(false)
    localStorage.setItem('currentSimulation', JSON.stringify(simulation))
    console.log('Saved simulation:', simulation)
  }

  const handleShipSelect = (ship: ShipData) => {
    setSelectedShip(ship)
  }

  const handleMapChange = (center: [number, number], zoom: number) => {
    if (!simulation) return
    
    // Check if the location has actually changed
    if (
      Math.abs(simulation.location.center[0] - center[0]) < 0.0001 &&
      Math.abs(simulation.location.center[1] - center[1]) < 0.0001 &&
      Math.abs(simulation.location.zoom - zoom) < 0.01
    ) {
      return
    }
    
    const updatedSimulation: SimulationData = {
      ...simulation,
      location: { 
        center: [
          Number(center[0].toFixed(4)),
          Number(center[1].toFixed(4))
        ] as [number, number],
        zoom: Number(zoom.toFixed(2))
      }
    }
    
    // Save to localStorage first
    localStorage.setItem('currentSimulation', JSON.stringify(updatedSimulation))
    
    // Then update Redux state
    dispatch(setSimulation(updatedSimulation))
  }

  // Remove the simulation state debug log
  useEffect(() => {
    if (simulation?.location) {
      // Only log significant changes
      if (lastLocation.current?.center[0] !== simulation.location.center[0] ||
          lastLocation.current?.center[1] !== simulation.location.center[1] ||
          lastLocation.current?.zoom !== simulation.location.zoom) {
        lastLocation.current = simulation.location
      }
    }
  }, [simulation])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading simulation...</div>
      </div>
    )
  }

  if (!simulation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: No simulation data found</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Top Navigation */}
      <header className="flex-none bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Naval Tactical Simulator - {isSetupMode ? 'Setup' : 'Run'}
          </h1>
          <div>
            <button 
              onClick={handleSave}
              className={`px-3 py-1 rounded ${
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

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Ship Picker */}
        <div className="w-64 flex-none bg-gray-100 border-r dark:bg-gray-800 dark:border-gray-700">
          <ShipPicker
            onSelect={handleShipSelect}
            selectedShipId={selectedShip?.id}
          />
        </div>

        {/* Main View Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Simulation Title */}
          <div className="flex-none bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {simulation.name}
            </h2>
            <span className="text-sm text-gray-400">
              {simulation.startTime && 
                `Start: ${new Date(simulation.startTime).toLocaleString()}`}
            </span>
          </div>

          {/* Ocean View with Map */}
          <div className="flex-1 relative min-h-0">
            <MapComponent
              key={`map-${simulation.id}`}
              center={simulation.location.center}
              zoom={simulation.location.zoom}
              onChange={handleMapChange}
            />
          </div>

          {/* Timeline Control */}
          <div className="flex-none h-48 bg-gray-100 border-t dark:bg-gray-800 dark:border-gray-700 p-4">
            <div className="flex items-center justify-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <span className="text-xl">⏪</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <span className="text-xl">▶️</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <span className="text-xl">⏩</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Info Panel */}
        <div className="w-72 flex-none bg-gray-100 border-l dark:bg-gray-800 dark:border-gray-700">
          <ShipDetails ship={selectedShip} />
        </div>
      </div>
    </div>
  )
} 