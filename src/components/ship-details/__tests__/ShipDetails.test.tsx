import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ShipDetails } from '../ShipDetails'
import { VesselType } from '@/types/simulation'
import type { ShipData } from '@/data/ships'
import type { SimulationShip } from '@/types/simulation'

describe('ShipDetails', () => {
  const mockShip: ShipData = {
    id: 'test-ship',
    name: 'Test Ship',
    hullNumber: 'TST-01',
    type: VesselType.SURFACE_WARSHIP,
    nationality: 'USA',
    characteristics: {
      maxSpeed: 30,
      minSpeed: 0,
      maxDepth: 0,
      minDepth: 0,
      turnRate: 3,
      accelerationRate: 1,
      depthChangeRate: 0,
      propulsion: [
        {
          type: 'PROPELLER',
          configuration: {
            bladeCount: 5,
            bladeType: 'Fixed Pitch'
          }
        }
      ]
    },
    acousticSignatures: [
      {
        type: 'BROADBAND',
        centerFrequency: 150,
        bandwidth: 30,
        signalStrength: 120
      },
      {
        type: 'NARROWBAND',
        centerFrequency: 60,
        bandwidth: 2,
        signalStrength: 140,
        driftRate: 0.1
      }
    ]
  }

  const mockSimulationShip: SimulationShip = {
    ...mockShip,
    position: { lat: 19.5, lng: -155.5 },
    course: 90,
    speed: 15,
    depth: 0
  }

  it('renders empty state when no ship provided', () => {
    render(<ShipDetails ship={null as any} isSetupMode={false} />)
    expect(screen.getByText('Select a ship to view details')).toBeInTheDocument()
  })

  it('renders basic ship information', () => {
    render(<ShipDetails ship={mockShip} isSetupMode={false} />)
    expect(screen.getByText(mockShip.name)).toBeInTheDocument()
    expect(screen.getByText(mockShip.hullNumber)).toBeInTheDocument()
  })

  it('renders ship characteristics', () => {
    render(<ShipDetails ship={mockShip} isSetupMode={false} />)
    expect(screen.getByText('Characteristics')).toBeInTheDocument()
    expect(screen.getByText(`${mockShip.characteristics.minSpeed} - ${mockShip.characteristics.maxSpeed} kts`)).toBeInTheDocument()
    expect(screen.getByText(`${mockShip.characteristics.turnRate}°/min`)).toBeInTheDocument()
  })

  it('renders propulsion information', () => {
    render(<ShipDetails ship={mockShip} isSetupMode={false} />)
    expect(screen.getByText('Propulsion')).toBeInTheDocument()
    expect(screen.getByText('PROPELLER')).toBeInTheDocument()
    expect(screen.getByText('5 blade Fixed Pitch')).toBeInTheDocument()
  })

  it('renders acoustic signatures', () => {
    render(<ShipDetails ship={mockShip} isSetupMode={false} />)
    expect(screen.getByText('Acoustic Signatures')).toBeInTheDocument()
    expect(screen.getByText('BROADBAND')).toBeInTheDocument()
    expect(screen.getByText('NARROWBAND')).toBeInTheDocument()
    expect(screen.getByText('150 Hz')).toBeInTheDocument()
    expect(screen.getByText('0.1 Hz/min')).toBeInTheDocument()
  })

  it('renders simulation ship details when provided', () => {
    render(
      <ShipDetails 
        ship={mockShip} 
        isSetupMode={false} 
        simulationShip={mockSimulationShip}
        selectedFromController={true}
      />
    )
    
    // Find the position values
    const positionDiv = screen.getByText('Position:').nextElementSibling
    expect(positionDiv).toHaveTextContent('19.5000°N')
    expect(positionDiv).toHaveTextContent('-155.5000°E')

    // Find the course value
    const courseDiv = screen.getByText('Course:').nextElementSibling
    expect(courseDiv).toHaveTextContent('90°')

    // Find the speed value
    const speedDiv = screen.getByText('Speed:').nextElementSibling
    expect(speedDiv).toHaveTextContent('15.0 kts')

    // Find the depth value
    const depthDiv = screen.getByText('Depth:').nextElementSibling
    expect(depthDiv).toHaveTextContent('0 m')
  })

  it('shows initial order in setup mode', () => {
    render(
      <ShipDetails 
        ship={mockShip} 
        isSetupMode={true}
        simulationShip={mockSimulationShip}
        selectedFromController={true}
      />
    )
    expect(screen.getByText('Initial Order:')).toBeInTheDocument()
  })

  it('shows current order in simulation mode', () => {
    render(
      <ShipDetails 
        ship={mockShip} 
        isSetupMode={false}
        simulationShip={mockSimulationShip}
        selectedFromController={true}
      />
    )
    expect(screen.getByText('Current Order:')).toBeInTheDocument()
  })

  it('handles missing optional ship data', () => {
    const minimalShip: ShipData = {
      id: 'minimal-ship',
      name: 'Minimal Ship',
      type: VesselType.SURFACE_WARSHIP,
      nationality: 'USA',
      characteristics: {
        maxSpeed: 30,
        minSpeed: 0,
        maxDepth: 0,
        minDepth: 0,
        turnRate: 3,
        accelerationRate: 1,
        depthChangeRate: 0,
        propulsion: []
      },
      acousticSignatures: []
    }

    render(<ShipDetails ship={minimalShip} isSetupMode={false} />)
    expect(screen.getByText('Minimal Ship')).toBeInTheDocument()
  })
}) 