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
  const [selectedShip, setSelectedShip] = useState<ShipData | SimulationShip | null>(null)
  const [selectedFromController, setSelectedFromController] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [initialShips, setInitialShips] = useState<SimulationShip[]>([])
  const lastLocation = React.useRef<SimulationData['location'] | null>(null)
  const router = useRouter()

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
    setIsPlaying(false) // Start in paused state
    localStorage.setItem('currentSimulation', JSON.stringify(simulation))
    console.log('Saved simulation:', simulation)
  }

  const handleReturnToSetup = () => {
    setIsSetupMode(true)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleShipSelect = (ship: ShipData | SimulationShip) => {
    if ('position' in ship) {
      setSelectedShip(ship)
      setSelectedFromController(true)
    } else {
      const simShip = simulation?.ships?.find(s => s.id === ship.id)
      setSelectedShip(simShip || ship)
      setSelectedFromController(false)
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
    if (!simulation) return

    // Generate random course and speed based on ship characteristics
    const randomCourse = Math.floor(Math.random() * 360)  // 0-359 degrees
    const minSpeed = ship.characteristics?.minSpeed || 0
    const maxSpeed = ship.characteristics?.maxSpeed || 30
    const randomSpeed = Number((minSpeed + Math.random() * (maxSpeed - minSpeed)).toFixed(1))

    console.log('Generating random values for ship:', {
      name: ship.name,
      course: randomCourse,
      speed: randomSpeed,
      position: position
    })

    const newShip: SimulationShip = {
      ...ship,
      position: {
        lat: position.y,
        lng: position.x
      },
      course: randomCourse,
      speed: randomSpeed,
      depth: 0  // Surface by default
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

    const updatedSimulation: SimulationData = {
      ...simulation,
      ships: updatedShips
    }

    // Verify the values before dispatch
    console.log('New ship state:', {
      id: newShip.id,
      name: newShip.name,
      course: newShip.course,
      speed: newShip.speed,
      position: newShip.position
    })

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
      <div className="fixed inset-0 flex flex-col bg-navy-darkest">
        {/* Title Bar */}
        <div className="flex-none bg-navy-dark border-b border-navy-medium p-4">
          <div className="flex justify-between items-center">
            <h1 className="navy-title">
              Naval Tactical Simulator - {simulation.name} ({isSetupMode ? 'Setup' : 'Run'})
            </h1>
            <div className="flex gap-4">
              <button 
                onClick={handleReset}
                className="navy-button-danger"
              >
                Reset
              </button>
              {isSetupMode ? (
                <button 
                  onClick={handleSave}
                  className="navy-button-primary"
                >
                  Save
                </button>
              ) : (
                <button 
                  onClick={handleReturnToSetup}
                  className="navy-button"
                >
                  Setup
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Left Sidebar - Ship Picker (only visible in setup mode) */}
          {isSetupMode && (
            <div className="w-64 flex-none navy-panel border-r">
              <ShipPicker
                onSelect={handleShipSelect}
                selectedShipId={selectedShip?.id}
              />
            </div>
          )}

          {/* Main View Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Ocean View with Map */}
            <div className="flex-1 relative min-h-0">
              <MapComponent
                center={simulation.location.center}
                zoom={simulation.location.zoom}
                onChange={handleMapChange}
                onShipDrop={isSetupMode ? handleShipDrop : undefined}
                ships={simulation.ships || []}
                selectedShipId={selectedShip?.id}
                isSetupMode={isSetupMode}
                isPlaying={isPlaying}
              />
              {isSetupMode && <CustomDragLayer />}
            </div>

            {/* Simulation Controls */}
            <div className="flex-none h-48 navy-panel border-t">
              <SimulationController
                ships={simulation.ships || []}
                currentTime={currentTime}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onTimeChange={setCurrentTime}
                onShipSelect={handleShipSelect}
                selectedShipId={selectedShip?.id}
                isSetupMode={isSetupMode}
                duration={simulation.duration}
                startTime={simulation.startTime}
                onShipUpdate={handleShipUpdate}
                onRestart={handleRestart}
                simulationSpeed={simulationSpeed}
                onSpeedChange={setSimulationSpeed}
              />
            </div>
          </div>

          {/* Right Sidebar - Ship Details */}
          {selectedShip && (
            <div className="w-80 flex-none navy-panel border-l">
              <ShipDetails
                ship={selectedShip}
                isSetupMode={isSetupMode}
                simulationShip={
                  'position' in selectedShip
                    ? selectedShip
                    : simulation?.ships?.find(s => s.id === selectedShip.id)
                }
                selectedFromController={selectedFromController}
              />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  )
} 