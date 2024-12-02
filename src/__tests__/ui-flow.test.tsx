import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Page from '@/app/page'
import mapboxgl from 'mapbox-gl'

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

describe('UI Flow', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          {ui}
        </DndProvider>
      </Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Set Mapbox token before each test
    mapboxgl.accessToken = 'mock-token'
  })

  it('renders the new simulation button', () => {
    renderWithProviders(<Page />)
    expect(screen.getByText('New Simulation')).toBeInTheDocument()
  })

  it('opens the new simulation dialog when clicking create button', () => {
    renderWithProviders(<Page />)
    const createButton = screen.getByText('New Simulation')
    fireEvent.click(createButton)
    expect(screen.getByRole('heading', { name: 'Create New Simulation' })).toBeInTheDocument()
  })
}) 