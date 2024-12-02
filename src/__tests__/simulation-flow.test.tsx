import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { simulationReducer } from '@/store/simulationSlice'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React from 'react'
import Page from '@/app/simulation/page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock mapbox-gl
vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(),
      off: vi.fn(),
      remove: vi.fn(),
      getCanvas: vi.fn(() => ({
        style: {},
      })),
      getContainer: vi.fn(() => ({
        getBoundingClientRect: vi.fn(() => ({
          width: 800,
          height: 600,
        })),
      })),
      project: vi.fn(() => ({ x: 0, y: 0 })),
      unproject: vi.fn(() => ({ lat: 0, lng: 0 })),
    })),
    Marker: vi.fn(() => ({
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      getElement: vi.fn(() => document.createElement('div')),
    })),
  },
}))

// Mock ship-position utility
vi.mock('@/utils/ship-position', () => ({
  getShipPositionAtTime: vi.fn((ship) => ship.position),
  resetInitialPositions: vi.fn(),
}))

// Mock default ships data
vi.mock('@/data/ships', () => ({
  defaultShips: [],
}))

// Mock React components
vi.mock('@/components/map/MapComponent', () => ({
  MapComponent: vi.fn(() => React.createElement('div', { 'data-testid': 'map-component' }, 'Map Component')),
}))

vi.mock('@/components/ship-picker/ShipPicker', () => ({
  ShipPicker: vi.fn(() => React.createElement('div', { 'data-testid': 'ship-picker' }, 'Available Ships')),
}))

vi.mock('@/components/ship-picker/CustomDragLayer', () => ({
  CustomDragLayer: vi.fn(() => React.createElement('div', { 'data-testid': 'drag-layer' }, 'Drag Layer')),
}))

vi.mock('@/components/simulation/SimulationController', () => ({
  SimulationController: vi.fn(() => React.createElement('div', { 'data-testid': 'simulation-controller' }, 'Simulation Controller')),
}))

vi.mock('@/components/ship-details/ShipDetails', () => ({
  ShipDetails: vi.fn(() => React.createElement('div', { 'data-testid': 'ship-details' }, 'Ship Details')),
}))

describe('Simulation Creation Flow', () => {
  const testData = {
    id: 'test-id',
    name: 'Test Simulation',
    description: 'Test Description',
    location: {
      center: [-155.5, 19.5],
      zoom: 5
    },
    ships: [],
    isSetupMode: true,
    isPaused: true,
    time: 0,
    speed: 1,
  }

  // Create a test store with the test data
  const store = configureStore({
    reducer: {
      simulation: simulationReducer,
    },
    preloadedState: {
      simulation: {
        data: testData,
        simulations: [],
        currentSimulation: testData,
        isSetupMode: true,
        isPaused: true,
        time: 0,
        speed: 1,
      },
    },
  })

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Set up localStorage with test data
    localStorage.setItem('currentSimulation', JSON.stringify(testData))
    localStorage.setItem('availableShips', JSON.stringify([]))

    // Reset all mocks
    vi.clearAllMocks()

    // Mock window.ResizeObserver
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    // Mock window.IntersectionObserver
    window.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          {ui}
        </DndProvider>
      </Provider>
    )
  }

  it('renders the simulation setup page', async () => {
    const { container } = renderWithProviders(<Page />)
    
    // Debug output
    await waitFor(() => {
      console.log('Container HTML:', container.innerHTML)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('map-component')).toBeInTheDocument()
      expect(screen.getByTestId('ship-picker')).toBeInTheDocument()
      expect(screen.getByTestId('simulation-controller')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('displays the available ships panel', async () => {
    const { container } = renderWithProviders(<Page />)
    
    // Debug output
    await waitFor(() => {
      console.log('Container HTML:', container.innerHTML)
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('ship-picker')).toBeInTheDocument()
      expect(screen.getByText(/Available Ships/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })
}) 