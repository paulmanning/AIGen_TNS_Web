import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ShipMarker, ShipMarker_Static } from '../ShipMarker'
import { VesselType } from '@/types/simulation'
import type { SimulationShip } from '@/types/simulation'

describe('ShipMarker', () => {
  const testShip: SimulationShip = {
    id: 'test-ship',
    name: 'Test Ship',
    callsign: 'TST-01',
    type: VesselType.SURFACE_WARSHIP,
    course: 45,
    speed: 20,
    position: { lng: -155.5, lat: 19.5 },
    waypoints: []
  }

  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = ''
  })

  it('renders ship marker with correct name and course/speed', () => {
    render(<ShipMarker ship={testShip} />)
    
    // Check ship name
    expect(screen.getByText('Test Ship')).toBeInTheDocument()
    
    // Check course/speed label
    expect(screen.getByText('45°/20kts')).toBeInTheDocument()
  })

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(<ShipMarker ship={testShip} isSelected={true} />)
    
    // Check if selected attribute is set
    const marker = container.querySelector('.ship-marker')
    expect(marker).toHaveAttribute('data-selected', 'true')
    
    // Check if paths use selected color (gold)
    const paths = container.querySelectorAll('path')
    paths.forEach(path => {
      expect(path).toHaveAttribute('stroke', '#FFD700')
    })
  })

  it('renders different vessel types with correct symbols', () => {
    const vesselTypes = [
      VesselType.SURFACE_WARSHIP,
      VesselType.SUBMARINE,
      VesselType.MERCHANT,
      VesselType.FISHING,
      VesselType.BIOLOGIC
    ]

    vesselTypes.forEach(type => {
      const ship = { ...testShip, type }
      const { container } = render(<ShipMarker ship={ship} />)
      
      // Each vessel type should have at least two paths (frame and symbol)
      const paths = container.querySelectorAll('path')
      expect(paths.length).toBeGreaterThanOrEqual(2)
      
      // Clean up after each render
      container.remove()
    })
  })

  it('rotates course arrow according to ship course', () => {
    const { container } = render(<ShipMarker ship={testShip} />)
    
    const arrowSvg = container.querySelectorAll('svg')[1] // Second SVG is the course arrow
    expect(arrowSvg).toHaveStyle({
      transform: 'rotate(45deg)'
    })
  })

  it('scales speed line according to ship speed', () => {
    const { container } = render(<ShipMarker ship={testShip} />)
    
    // Get the arrow path
    const arrowPath = container.querySelectorAll('svg')[1].querySelector('path')
    expect(arrowPath).toHaveAttribute('d', expect.stringContaining('6')) // Speed line should be present
  })

  it('handles zero speed correctly', () => {
    const stationaryShip = { ...testShip, speed: 0 }
    const { container } = render(<ShipMarker ship={stationaryShip} />)
    
    // Get the arrow path
    const arrowPath = container.querySelectorAll('svg')[1].querySelector('path')
    expect(arrowPath).toHaveAttribute('d', expect.not.stringContaining('NaN'))
  })
})

describe('ShipMarker_Static', () => {
  const testShip: SimulationShip = {
    id: 'test-ship',
    name: 'Test Ship',
    callsign: 'TST-01',
    type: VesselType.SURFACE_WARSHIP,
    course: 45,
    speed: 20,
    position: { lng: -155.5, lat: 19.5 },
    waypoints: []
  }

  it('renders static marker without course arrow or labels', () => {
    const { container } = render(<ShipMarker_Static ship={testShip} />)
    
    // Should only have one SVG (no course arrow)
    expect(container.querySelectorAll('svg').length).toBe(1)
    
    // Should not have any text labels
    expect(container.textContent).toBe('')
  })

  it('renders different vessel types correctly in static mode', () => {
    const vesselTypes = [
      VesselType.SURFACE_WARSHIP,
      VesselType.SUBMARINE,
      VesselType.MERCHANT,
      VesselType.FISHING,
      VesselType.BIOLOGIC
    ]

    vesselTypes.forEach(type => {
      const ship = { ...testShip, type }
      const { container } = render(<ShipMarker_Static ship={ship} />)
      
      // Each vessel type should have exactly two paths (frame and symbol)
      const paths = container.querySelectorAll('path')
      expect(paths.length).toBe(2)
      
      // All paths should have white stroke
      paths.forEach(path => {
        expect(path).toHaveAttribute('stroke', '#FFFFFF')
      })
      
      // Clean up after each render
      container.remove()
    })
  })
}) 