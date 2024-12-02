import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DroppableMapOverlay } from '../DroppableMapOverlay'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { ShipData } from '@/data/ships'
import { VesselType } from '@/types/simulation'
import mapboxgl from 'mapbox-gl'

// Mock mapboxgl
vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(),
    LngLat: vi.fn()
  }
}))

// Mock react-dnd hooks
vi.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: React.ReactNode }) => children,
  useDrop: vi.fn()
}))

describe('DroppableMapOverlay', () => {
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
      }
    ]
  }

  const mockMap = {
    getContainer: vi.fn(() => ({
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 800,
        height: 600
      })
    })),
    unproject: vi.fn((coords) => ({
      lat: 19.5,
      lng: -155.5
    }))
  } as unknown as mapboxgl.Map

  const defaultProps = {
    onShipDrop: vi.fn(),
    map: mockMap
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    // Setup default useDrop mock
    const mockRef = vi.fn()
    ;(useDrop as unknown as ReturnType<typeof vi.fn>).mockReturnValue([{ isOver: false }, mockRef])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the overlay container', () => {
    const { container } = render(<DroppableMapOverlay {...defaultProps} />)
    const overlay = container.querySelector('#map-overlay')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass('absolute', 'inset-0', 'z-10')
  })

  it('handles ship drop with valid coordinates', async () => {
    // Get the drop handler from useDrop config
    let dropHandler: Function | undefined
    ;(useDrop as unknown as ReturnType<typeof vi.fn>).mockImplementation((options: () => { drop: Function }) => {
      dropHandler = options().drop
      return [{ isOver: false }, vi.fn()]
    })

    render(<DroppableMapOverlay {...defaultProps} />)

    // Simulate drop with valid coordinates
    await act(async () => {
      dropHandler?.(mockShip, {
        getClientOffset: () => ({ x: 100, y: 100 })
      })
    })

    // Check if onShipDrop was called with correct coordinates
    expect(defaultProps.onShipDrop).toHaveBeenCalledWith(
      mockShip,
      { x: -155.5, y: 19.5 }
    )

    // Check if drop message is displayed
    const message = screen.getByText(`Dropped ${mockShip.name} at 19.5000°N, -155.5000°E`)
    expect(message).toBeInTheDocument()

    // Advance timers to clear message
    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.queryByText(`Dropped ${mockShip.name} at 19.5000°N, -155.5000°E`)).not.toBeInTheDocument()
  })

  it('handles ship drop when map is not available', async () => {
    // Get the drop handler from useDrop config
    let dropHandler: Function | undefined
    ;(useDrop as unknown as ReturnType<typeof vi.fn>).mockImplementation((options: () => { drop: Function }) => {
      dropHandler = options().drop
      return [{ isOver: false }, vi.fn()]
    })

    render(<DroppableMapOverlay {...defaultProps} map={null} />)

    // Simulate drop with valid coordinates
    await act(async () => {
      dropHandler?.(mockShip, {
        getClientOffset: () => ({ x: 100, y: 100 })
      })
    })

    // Check that onShipDrop was not called
    expect(defaultProps.onShipDrop).not.toHaveBeenCalled()
  })

  it('handles ship drop without client offset', async () => {
    // Get the drop handler from useDrop config
    let dropHandler: Function | undefined
    ;(useDrop as unknown as ReturnType<typeof vi.fn>).mockImplementation((options: () => { drop: Function }) => {
      dropHandler = options().drop
      return [{ isOver: false }, vi.fn()]
    })

    render(<DroppableMapOverlay {...defaultProps} />)

    // Simulate drop without client offset
    await act(async () => {
      dropHandler?.(mockShip, {
        getClientOffset: () => null
      })
    })

    // Check that onShipDrop was not called
    expect(defaultProps.onShipDrop).not.toHaveBeenCalled()
  })

  it('positions drop message correctly', async () => {
    // Get the drop handler from useDrop config
    let dropHandler: Function | undefined
    ;(useDrop as unknown as ReturnType<typeof vi.fn>).mockImplementation((options: () => { drop: Function }) => {
      dropHandler = options().drop
      return [{ isOver: false }, vi.fn()]
    })

    const { container } = render(<DroppableMapOverlay {...defaultProps} />)

    // Simulate drop with valid coordinates
    await act(async () => {
      dropHandler?.(mockShip, {
        getClientOffset: () => ({ x: 100, y: 100 })
      })
    })

    // Check message positioning
    const message = container.querySelector('.fixed')
    expect(message).toHaveStyle({
      left: '100px',
      top: '100px',
      transform: 'translate(-50%, -100%)',
      marginTop: '-8px'
    })
  })
}) 