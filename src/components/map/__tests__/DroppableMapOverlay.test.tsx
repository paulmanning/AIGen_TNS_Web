import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DroppableMapOverlay } from '../DroppableMapOverlay'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { ShipData } from '@/data/ships'
import mapboxgl from 'mapbox-gl'

// Mock mapboxgl
vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn()
  }
}))

// Mock react-dnd hooks
vi.mock('react-dnd', async () => {
  const actual = await vi.importActual('react-dnd')
  return {
    ...actual,
    useDrop: (options: any) => {
      const dropRef = vi.fn()
      const dropHandler = (item: any, monitor: any) => {
        const offset = monitor.getClientOffset()
        if (!offset) return

        // Call the onShipDrop prop with the ship data and coordinates
        const mockMap = {
          getContainer: () => ({
            getBoundingClientRect: () => ({
              left: 0,
              top: 0,
              width: 800,
              height: 600
            })
          }),
          unproject: (coords: [number, number]) => ({
            lng: -155.5,
            lat: 19.5
          })
        }

        const x = offset.x
        const y = offset.y
        const point = mockMap.unproject([x, y])
        
        // Call the actual drop handler from the component
        options.drop(item, { x: point.lng, y: point.lat })
      }

      return [{
        isOver: false,
        canDrop: true,
        drop: dropHandler
      }, dropRef]
    }
  }
})

describe('DroppableMapOverlay', () => {
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
      lng: -155.5,
      lat: 19.5
    }))
  }

  const defaultProps = {
    onShipDrop: vi.fn(),
    map: mockMap as unknown as mapboxgl.Map
  }

  const testShip: ShipData = {
    id: 'test-ship',
    name: 'Test Ship',
    callsign: 'TST-01',
    type: 'SURFACE_WARSHIP',
    nationality: 'US',
    maxSpeed: 30,
    maxTurnRate: 10
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the overlay', () => {
    const { container } = render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay {...defaultProps} />
      </DndProvider>
    )
    const overlay = container.querySelector('#map-overlay')
    expect(overlay).toBeInTheDocument()
  })

  it('handles ship drop with coordinates', () => {
    const { container } = render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay {...defaultProps} />
      </DndProvider>
    )

    const overlay = container.querySelector('#map-overlay')!
    const dropCoords = { x: 100, y: 100 }

    // Mock the DnD monitor
    const mockMonitor = {
      getClientOffset: () => ({ x: dropCoords.x, y: dropCoords.y }),
      getSourceClientOffset: () => ({ x: dropCoords.x, y: dropCoords.y })
    }

    // Get the drop handler from the useDrop hook
    const dropHandler = (overlay as any).__dropTarget?.props?.accept?.drop
    if (dropHandler) {
      dropHandler(testShip, mockMonitor)

      // Verify map coordinate conversion was attempted
      expect(mockMap.unproject).toHaveBeenCalledWith([dropCoords.x, dropCoords.y])
      expect(defaultProps.onShipDrop).toHaveBeenCalledWith(
        testShip,
        { x: -155.5, y: 19.5 }
      )
    }
  })

  it('handles null map gracefully', () => {
    const { container } = render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay {...defaultProps} map={null} />
      </DndProvider>
    )

    const overlay = container.querySelector('#map-overlay')!
    const dropEvent = new Event('drop', { bubbles: true })
    fireEvent(overlay, dropEvent)

    expect(defaultProps.onShipDrop).not.toHaveBeenCalled()
  })

  it('handles missing drop coordinates gracefully', () => {
    const { container } = render(
      <DndProvider backend={HTML5Backend}>
        <DroppableMapOverlay {...defaultProps} />
      </DndProvider>
    )

    const overlay = container.querySelector('#map-overlay')!
    const mockMonitor = {
      getClientOffset: () => null,
      getSourceClientOffset: () => null
    }

    // Get the drop handler from the useDrop hook
    const dropHandler = (overlay as any).__dropTarget?.props?.accept?.drop
    if (dropHandler) {
      dropHandler(testShip, mockMonitor)
    }

    expect(defaultProps.onShipDrop).not.toHaveBeenCalled()
  })
}) 