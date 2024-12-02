import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SimulationControls } from '../SimulationControls'
import type { SimulationData } from '@/types/simulation'

describe('SimulationControls', () => {
  const mockSimulation: SimulationData = {
    id: 'test-sim',
    name: 'Test Simulation',
    description: 'Test Description',
    startTime: '2024-03-15T10:00',
    location: {
      center: [-155.5, 19.5],
      zoom: 5
    },
    duration: 120,
    vessels: [],
    ships: [],
    isSetupMode: true,
    isPlaying: false,
    currentTime: 0,
    selectedShipId: undefined,
    simulationSpeed: 1,
    timeMultiplier: 1,
    isPaused: false,
    bounds: {
      north: 20,
      south: 19,
      east: -155,
      west: -156
    }
  }

  const defaultProps = {
    simulation: mockSimulation,
    onReset: vi.fn()
  }

  it('renders the simulation title with setup mode', () => {
    render(<SimulationControls {...defaultProps} />)
    expect(screen.getByText('Naval Tactical Simulator - Setup')).toBeInTheDocument()
  })

  it('renders reset and save buttons in setup mode', () => {
    render(<SimulationControls {...defaultProps} />)
    expect(screen.getByText('Reset')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('toggles between setup and run mode', () => {
    render(<SimulationControls {...defaultProps} />)
    
    // Initially in setup mode
    const toggleButton = screen.getByText('Save')
    expect(screen.getByText('Naval Tactical Simulator - Setup')).toBeInTheDocument()
    
    // Switch to run mode
    fireEvent.click(toggleButton)
    expect(screen.getByText('Naval Tactical Simulator - Run')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
    
    // Switch back to setup mode
    fireEvent.click(screen.getByText('Running'))
    expect(screen.getByText('Naval Tactical Simulator - Setup')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('calls onReset when reset button is clicked', () => {
    render(<SimulationControls {...defaultProps} />)
    const resetButton = screen.getByText('Reset')
    fireEvent.click(resetButton)
    expect(defaultProps.onReset).toHaveBeenCalled()
  })

  it('applies correct button styles based on mode', () => {
    render(<SimulationControls {...defaultProps} />)
    
    // Check setup mode styles
    const toggleButton = screen.getByText('Save')
    expect(toggleButton).toHaveClass('bg-blue-600')
    
    // Switch to run mode and check styles
    fireEvent.click(toggleButton)
    const runningButton = screen.getByText('Running')
    expect(runningButton).toHaveClass('bg-green-600')
  })
}) 