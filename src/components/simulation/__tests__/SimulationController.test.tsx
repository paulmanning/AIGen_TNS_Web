import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SimulationController } from '../SimulationController'
import { SimulationShip } from '@/types/simulation'

describe('SimulationController', () => {
  const defaultProps = {
    currentTime: 300,
    duration: 7200,
    isPlaying: false,
    simulationSpeed: 1,
    startTime: '2024-03-15T10:00',
    onTimeChange: vi.fn(),
    onPlayPause: vi.fn(),
    onSpeedChange: vi.fn(),
    onRestart: vi.fn(),
    ships: [],
    selectedShipId: undefined,
    onShipSelect: vi.fn(),
    isSetupMode: false,
    onShipUpdate: vi.fn()
  }

  const testShip: SimulationShip = {
    id: 'test-ship',
    name: 'Test Ship',
    callsign: 'TST-01',
    type: 'SURFACE_WARSHIP',
    course: 0,
    speed: 20,
    position: [0, 0],
    waypoints: []
  }

  const propsWithShip = {
    ...defaultProps,
    ships: [testShip]
  }

  it('displays formatted time', () => {
    render(<SimulationController {...defaultProps} />)
    expect(screen.getByText('Mar 15, 2024, 10:05:00')).toBeInTheDocument()
  })

  it('handles play/pause button click', () => {
    render(<SimulationController {...defaultProps} />)
    const playButton = screen.getByTitle('Play')
    fireEvent.click(playButton)
    expect(defaultProps.onPlayPause).toHaveBeenCalled()
  })

  it('handles speed change', () => {
    render(<SimulationController {...defaultProps} />)
    const speedSelect = screen.getByTitle('Simulation Speed')
    fireEvent.change(speedSelect, { target: { value: '2' } })
    expect(defaultProps.onSpeedChange).toHaveBeenCalledWith(2)
  })

  it('renders ship information when ships are provided', () => {
    render(<SimulationController {...propsWithShip} />)
    expect(screen.getByText('Test Ship')).toBeInTheDocument()
    const speedElement = screen.getByText((content, element) => {
      const hasClass = (className: string) => element?.classList?.contains(className)
      return hasClass('text-xs') && 
             hasClass('whitespace-nowrap') && 
             hasClass('text-navy-light') && 
             element?.textContent?.includes('0°') && 
             element?.textContent?.includes('20.0') && 
             element?.textContent?.includes('kts')
    })
    expect(speedElement).toBeInTheDocument()
  })
}) 