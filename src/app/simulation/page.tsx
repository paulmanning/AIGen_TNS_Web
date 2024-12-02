'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { RootState } from '@/store'
import { setSimulation } from '@/store/simulationSlice'
import type { SimulationData, SimulationShip } from '@/types/simulation'
import { MapComponent } from '@/components/map/MapComponent'
import { ShipPicker } from '@/components/ship-picker/ShipPicker'
import { CustomDragLayer } from '@/components/ship-picker/CustomDragLayer'
import { SimulationController } from '@/components/simulation/SimulationController'
import type { ShipData } from '@/data/ships'
import { defaultShips } from '@/data/ships'
import { ShipDetails } from '@/components/ship-details/ShipDetails'

export default function SimulationPage() {
  const dispatch = useDispatch()
  const simulation = useSelector((state: RootState) => state.simulation.data)
  const [isSetupMode, setIsSetupMode] = useState(true)
  const [selectedShip, setSelectedShip] = useState<ShipData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const lastLocation = React.useRef<SimulationData['location'] | null>(null)
  const router = useRouter()
  const [simulationSpeed, setSimulationSpeed] = useState(1)

  // Initialize available ships in localStorage
  useEffect(() => {
    const storedShips = localStorage.getItem('availableShips')
    if (!storedShips) {
      localStorage.setItem('availableShips', JSON.stringify(defaultShips))
      console.log('Initialized available ships in localStorage')
    }
  }, [])

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

  const handleShipSelect = (shipOrId: ShipData | string) => {
    if (typeof shipOrId === 'string') {
      // If we got a shipId (from SimulationController), find the ship data
      const ship = simulation?.ships?.find(s => s.id === shipOrId)
      if (ship) {
        setSelectedShip(ship)
      }
    } else {
      // If we got a ShipData object (from ShipPicker), use it directly
      setSelectedShip(shipOrId)
    }
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

  const handleShipDrop = useCallback((ship: ShipData, position: { x: number, y: number }) => {
    console.log('Current ships:', simulation?.ships)
    console.log('Dropping ship:', ship)
    
    if (!simulation) return

    const newShip: SimulationShip = {
      ...ship,
      position: {
        lat: position.y,
        lng: position.x
      }
    }

    // Check if ship already exists
    const updatedShips = simulation.ships ? [...simulation.ships] : []
    const existingShipIndex = updatedShips.findIndex(s => s.id === ship.id)
    
    if (existingShipIndex !== -1) {
      // Update existing ship
      updatedShips[existingShipIndex] = newShip
    } else {
      // Add new ship
      updatedShips.push(newShip)
    }

    console.log('Updated ships:', updatedShips)

    const updatedSimulation: SimulationData = {
      ...simulation,
      ships: updatedShips
    }

    console.log('Final simulation state:', updatedSimulation)
    dispatch(setSimulation(updatedSimulation))
  }, [simulation, dispatch])

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

  const handleReset = () => {
    localStorage.clear() // Clear any stored simulation data
    router.push('/')    // Navigate to root/welcome page
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeChange = (newTime: number) => {
    setCurrentTime(newTime)
  }

  const handleShipUpdate = useCallback((updatedShips: SimulationShip[]) => {
    if (!simulation) return
    
    const updatedSimulation: SimulationData = {
      ...simulation,
      ships: updatedShips
    }
    
    dispatch(setSimulation(updatedSimulation))
  }, [simulation, dispatch])

  const handleRestart = useCallback(() => {
    setCurrentTime(0)
    setIsPlaying(false)
    
    // Reset ships to their initial positions
    if (simulation?.ships) {
      const resetShips = simulation.ships.map(ship => ({
        ...ship,
        course: 0,
        speed: 0,
        depth: 0
      }))
      handleShipUpdate(resetShips)
    }
  }, [simulation, handleShipUpdate])

  const handleSpeedChange = useCallback((speed: number) => {
    setSimulationSpeed(speed)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading simulation...</div>
      </div>
    )
  }

  if (!simulation) {
    return null
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 flex flex-col">
        {/* Top Navigation */}
        <header className="flex-none bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              Naval Tactical Simulator - {isSetupMode ? 'Setup' : 'Run'}
            </h1>
            <div className="flex gap-4">
              <button 
                onClick={handleReset}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700"
              >
                Reset
              </button>
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
                onShipDrop={handleShipDrop}
                ships={simulation.ships || []}
              />
            </div>

            {/* Simulation Controller */}
            <div className="flex-none h-48 bg-gray-100 border-t dark:bg-gray-800 dark:border-gray-700">
              <SimulationController
                ships={simulation?.ships || []}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onTimeChange={handleTimeChange}
                onShipSelect={handleShipSelect}
                selectedShipId={selectedShip?.id}
                isSetupMode={isSetupMode}
                duration={3600}
                onShipUpdate={handleShipUpdate}
                onRestart={handleRestart}
                simulationSpeed={simulationSpeed}
                onSpeedChange={handleSpeedChange}
              />
            </div>
          </div>

          {/* Right Sidebar - Info Panel */}
          <div className="w-72 flex-none bg-gray-100 border-l dark:bg-gray-800 dark:border-gray-700">
            <ShipDetails ship={selectedShip} />
          </div>
        </div>
        <CustomDragLayer />
      </div>
    </DndProvider>
  )
} 