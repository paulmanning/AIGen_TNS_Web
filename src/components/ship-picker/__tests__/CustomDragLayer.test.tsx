import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CustomDragLayer } from '../CustomDragLayer'
import { VesselType } from '@/types/simulation'
import type { ShipData } from '@/data/ships'

// Mock react-dnd hooks
vi.mock('react-dnd', () => ({
  useDragLayer: vi.fn()
}))

import { useDragLayer } from 'react-dnd'

describe('CustomDragLayer', () => {
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when not dragging', () => {
    vi.mocked(useDragLayer).mockReturnValue({
      isDragging: false,
      item: null,
      currentOffset: null,
      clientOffset: null,
      initialClientOffset: null,
      initialSourceClientOffset: null,
      differenceFromInitialOffset: null
    })

    const { container } = render(<CustomDragLayer />)
    expect(container.firstChild).toBeNull()
  })

  it('renders drag preview when dragging', () => {
    vi.mocked(useDragLayer).mockReturnValue({
      isDragging: true,
      item: mockShip,
      currentOffset: { x: 100, y: 100 },
      clientOffset: { x: 100, y: 100 },
      initialClientOffset: { x: 0, y: 0 },
      initialSourceClientOffset: { x: 0, y: 0 },
      differenceFromInitialOffset: { x: 100, y: 100 }
    })

    const { container } = render(<CustomDragLayer />)
    const dragPreview = container.firstChild as HTMLElement
    expect(dragPreview).toBeTruthy()
    expect(dragPreview).toHaveStyle({
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '100',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%'
    })

    const previewContent = dragPreview.firstChild as HTMLElement
    expect(previewContent).toBeTruthy()
    expect(previewContent.style.transform).toMatch(/translate\(\d+px,\s*\d+px\)/)
  })

  it('handles null offset', () => {
    vi.mocked(useDragLayer).mockReturnValue({
      isDragging: true,
      item: mockShip,
      currentOffset: null,
      clientOffset: null,
      initialClientOffset: null,
      initialSourceClientOffset: null,
      differenceFromInitialOffset: null
    })

    const { container } = render(<CustomDragLayer />)
    const dragPreview = container.firstChild as HTMLElement
    expect(dragPreview).toBeTruthy()
    const dragContent = dragPreview.firstChild as HTMLElement
    expect(dragContent).toHaveStyle({
      display: 'none'
    })
  })

  it('renders custom preview component if provided', () => {
    const CustomPreview = () => <div data-testid="custom-preview">Custom Preview</div>
    
    vi.mocked(useDragLayer).mockReturnValue({
      isDragging: true,
      item: { ...mockShip, preview: <CustomPreview /> },
      currentOffset: { x: 100, y: 100 },
      clientOffset: { x: 100, y: 100 },
      initialClientOffset: { x: 0, y: 0 },
      initialSourceClientOffset: { x: 0, y: 0 },
      differenceFromInitialOffset: { x: 100, y: 100 }
    })

    render(<CustomDragLayer />)
    expect(screen.getByTestId('custom-preview')).toBeInTheDocument()
  })

  it('applies correct styles for different ship types', () => {
    const ships = [
      { ...mockShip, type: VesselType.SURFACE_WARSHIP },
      { ...mockShip, type: VesselType.SUBMARINE },
      { ...mockShip, type: VesselType.MERCHANT },
      { ...mockShip, type: VesselType.FISHING },
      { ...mockShip, type: VesselType.BIOLOGIC }
    ]

    ships.forEach(ship => {
      vi.mocked(useDragLayer).mockReturnValue({
        isDragging: true,
        item: ship,
        currentOffset: { x: 100, y: 100 },
        clientOffset: { x: 100, y: 100 },
        initialClientOffset: { x: 0, y: 0 },
        initialSourceClientOffset: { x: 0, y: 0 },
        differenceFromInitialOffset: { x: 100, y: 100 }
      })

      const { container, rerender } = render(<CustomDragLayer />)
      const dragPreview = container.firstChild as HTMLElement
      expect(dragPreview).toBeTruthy()
      const previewContent = dragPreview.firstChild as HTMLElement
      expect(previewContent).toBeTruthy()
      expect(previewContent.style.transform).toMatch(/translate\(\d+px,\s*\d+px\)/)
      rerender(<></>)
    })
  })

  it('handles window scroll offset', () => {
    const scrollX = 50
    const scrollY = 75
    Object.defineProperty(window, 'scrollX', { value: scrollX })
    Object.defineProperty(window, 'scrollY', { value: scrollY })

    vi.mocked(useDragLayer).mockReturnValue({
      isDragging: true,
      item: mockShip,
      currentOffset: { x: 100, y: 100 },
      clientOffset: { x: 100, y: 100 },
      initialClientOffset: { x: 0, y: 0 },
      initialSourceClientOffset: { x: 0, y: 0 },
      differenceFromInitialOffset: { x: 100, y: 100 }
    })

    const { container } = render(<CustomDragLayer />)
    const dragPreview = container.firstChild as HTMLElement
    expect(dragPreview).toBeTruthy()
    const previewContent = dragPreview.firstChild as HTMLElement
    expect(previewContent).toBeTruthy()
    expect(previewContent.style.transform).toMatch(/translate\(\d+px,\s*\d+px\)/)
  })
}) 