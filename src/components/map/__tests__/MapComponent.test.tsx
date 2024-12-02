import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MapComponent } from '../MapComponent'
import mapboxgl from 'mapbox-gl'
import type { ShipData } from '@/data/ships'
import type { SimulationShip } from '@/types/simulation'

// Mock mapboxgl
const mockMapInstance = {
  getCenter: vi.fn(() => ({ lng: -155.5, lat: 19.5 })),
  getZoom: vi.fn(() => 5),
  setCenter: vi.fn(),
  setZoom: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  remove: vi.fn(),
  resize: vi.fn(),
  getSource: vi.fn(),
  addSource: vi.fn(),
  addLayer: vi.fn(),
  getLayer: vi.fn(),
  removeLayer: vi.fn(),
  removeSource: vi.fn(),
  getContainer: vi.fn(() => ({
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: 800,
      height: 600
    })
  }))
}

vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(() => mockMapInstance),
    Marker: vi.fn(() => ({
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      getElement: vi.fn().mockReturnValue(document.createElement('div'))
    })),
    accessToken: 'mock-token'
  }
}))

describe('MapComponent', () => {
  const defaultProps = {
    center: [-155.5, 19.5] as [number, number],
    zoom: 5,
    onChange: vi.fn(),
    ships: [] as SimulationShip[],
    isSetupMode: true,
    isPlaying: false,
    currentTime: 0
  }

  const testShip: SimulationShip = {
    id: 'test-ship',
    name: 'Test Ship',
    callsign: 'TST-01',
    type: 'SURFACE_WARSHIP',
    course: 45,
    speed: 20,
    position: { lng: -155.5, lat: 19.5 },
    waypoints: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Set Mapbox token before each test
    mapboxgl.accessToken = 'mock-token'
  })

  it('initializes map with correct props', () => {
    render(<MapComponent {...defaultProps} />)
    
    const mapConstructor = mapboxgl.Map as unknown as ReturnType<typeof vi.fn>
    expect(mapConstructor).toHaveBeenCalledWith({
      container: expect.any(HTMLDivElement),
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: defaultProps.center,
      zoom: defaultProps.zoom,
      dragRotate: false
    })
  })

  it('updates map when center/zoom props change', () => {
    const { rerender } = render(<MapComponent {...defaultProps} />)

    // Update props
    const newProps = {
      ...defaultProps,
      center: [-156.0, 20.0] as [number, number],
      zoom: 6
    }
    rerender(<MapComponent {...newProps} />)

    expect(mockMapInstance.setCenter).toHaveBeenCalledWith(newProps.center)
    expect(mockMapInstance.setZoom).toHaveBeenCalledWith(newProps.zoom)
  })

  it('creates markers for ships', () => {
    const props = {
      ...defaultProps,
      ships: [testShip]
    }
    render(<MapComponent {...props} />)

    const markerConstructor = mapboxgl.Marker as unknown as ReturnType<typeof vi.fn>
    expect(markerConstructor).toHaveBeenCalled()
    
    const marker = markerConstructor.mock.results[0].value
    expect(marker.setLngLat).toHaveBeenCalledWith([testShip.position.lng, testShip.position.lat])
    expect(marker.addTo).toHaveBeenCalled()
  })

  it('creates ship trails when not in setup mode', () => {
    const props = {
      ...defaultProps,
      isSetupMode: false,
      ships: [testShip]
    }
    render(<MapComponent {...props} />)

    expect(mockMapInstance.addSource).toHaveBeenCalledWith(
      `trail-${testShip.id}`,
      expect.objectContaining({
        type: 'geojson',
        data: expect.any(Object)
      })
    )
    expect(mockMapInstance.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: `trail-${testShip.id}`,
        type: 'line'
      })
    )
  })

  it('updates existing ship trails', () => {
    const props = {
      ...defaultProps,
      isSetupMode: false,
      ships: [testShip]
    }

    const mockSource = {
      setData: vi.fn()
    }
    mockMapInstance.getSource.mockReturnValue(mockSource)

    const { rerender } = render(<MapComponent {...props} />)

    // Update with new time
    rerender(<MapComponent {...props} currentTime={100} />)

    expect(mockSource.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Feature',
        geometry: expect.objectContaining({
          type: 'LineString'
        })
      })
    )
  })

  it('handles map interaction events', () => {
    render(<MapComponent {...defaultProps} />)

    // Verify event listeners are set up
    expect(mockMapInstance.on).toHaveBeenCalledWith('dragstart', expect.any(Function))
    expect(mockMapInstance.on).toHaveBeenCalledWith('zoomstart', expect.any(Function))
    expect(mockMapInstance.on).toHaveBeenCalledWith('dragend', expect.any(Function))
    expect(mockMapInstance.on).toHaveBeenCalledWith('zoomend', expect.any(Function))

    // Simulate drag interaction
    const dragStartHandler = mockMapInstance.on.mock.calls.find(call => call[0] === 'dragstart')[1]
    const dragEndHandler = mockMapInstance.on.mock.calls.find(call => call[0] === 'dragend')[1]

    dragStartHandler()
    dragEndHandler()

    expect(defaultProps.onChange).toHaveBeenCalledWith(
      [expect.any(Number), expect.any(Number)],
      expect.any(Number)
    )
  })

  it('cleans up resources on unmount', () => {
    const props = {
      ...defaultProps,
      isSetupMode: false,
      ships: [testShip]
    }
    const { unmount } = render(<MapComponent {...props} />)
    const marker = (mapboxgl.Marker as unknown as ReturnType<typeof vi.fn>).mock.results[0].value

    unmount()

    expect(mockMapInstance.remove).toHaveBeenCalled()
    expect(marker.remove).toHaveBeenCalled()
    expect(mockMapInstance.off).toHaveBeenCalledTimes(4) // dragstart, zoomstart, dragend, zoomend
  })
}) 