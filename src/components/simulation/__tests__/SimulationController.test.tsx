import { render, screen, fireEvent } from '@testing-library/react'
import { SimulationController } from '../SimulationController'
import { VesselType } from '@/types/simulation'

describe('SimulationController', () => {
  const defaultProps = {
    ships: [],
    currentTime: 300, // 5 minutes
    isPlaying: false,
    onPlayPause: jest.fn(),
    onTimeChange: jest.fn(),
    onShipSelect: jest.fn(),
  }

  it('displays formatted time', () => {
    render(<SimulationController {...defaultProps} />)
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('handles play/pause button click', () => {
    render(<SimulationController {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /play|pause/i }))
    expect(defaultProps.onPlayPause).toHaveBeenCalled()
  })

  it('handles time change with skip buttons', () => {
    render(<SimulationController {...defaultProps} />)
    
    // Skip backward
    fireEvent.click(screen.getByRole('button', { name: /skip back/i }))
    expect(defaultProps.onTimeChange).toHaveBeenCalledWith(240) // 300 - 60

    // Skip forward
    fireEvent.click(screen.getByRole('button', { name: /skip forward/i }))
    expect(defaultProps.onTimeChange).toHaveBeenCalledWith(360) // 300 + 60
  })

  // Add test for when ships are present
  it('renders ship information when ships are provided', () => {
    const propsWithShip = {
      ...defaultProps,
      ships: [{
        id: 'test-ship',
        name: 'Test Ship',
        hullNumber: 'TST-01',
        type: VesselType.SURFACE_WARSHIP,
        nationality: 'TEST',
        position: { lat: 0, lng: 0 },
        characteristics: {
          maxSpeed: 20,
          minSpeed: 0,
          maxDepth: 0,
          minDepth: 0,
          turnRate: 2,
          accelerationRate: 1,
          depthChangeRate: 0,
          propulsion: []
        },
        acousticSignatures: []
      }]
    }

    render(<SimulationController {...propsWithShip} />)
    expect(screen.getByText('Test Ship')).toBeInTheDocument()
    expect(screen.getByText('20 kts / 0m')).toBeInTheDocument()
  })
}) 