import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { SimulationData } from '@/types/simulation'
import Home from '@/app/page'
import SimulationPage from '@/app/simulation/page'

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  return {
    getItem: jest.fn((key: string) => {
      console.log('localStorage.getItem:', key, store[key])
      return store[key]
    }),
    setItem: jest.fn((key: string, value: string) => {
      console.log('localStorage.setItem:', key, value)
      store[key] = value
    }),
    clear: jest.fn(() => {
      console.log('localStorage.clear')
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock router
const mockRouterPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush
  }),
  useSearchParams: () => null
}))

// Mock mapbox-gl
interface MapboxEvent {
  type: string
  target: any
}

interface MapboxCallback {
  (event: MapboxEvent): void
}

const mockMapInstance = {
  getCenter: jest.fn(() => ({ lng: -155.5, lat: 19.5 })),
  getZoom: jest.fn(() => 5),
  dragRotate: {
    disable: jest.fn()
  },
  touchZoomRotate: {
    disableRotation: jest.fn()
  },
  on: jest.fn((event: string, callback: MapboxCallback) => {
    if (event === 'load') {
      callback({ type: 'load', target: mockMapInstance })
    }
  }),
  addControl: jest.fn(),
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  remove: jest.fn()
}

// Ensure the mock is properly assigned when the map is initialized
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => mockMapInstance),
  NavigationControl: jest.fn(),
  ScaleControl: jest.fn()
}))

// Create test store
const createTestStore = () => {
  const simulationReducer = (state: SimulationData | null = null, action: any) => {
    switch (action.type) {
      case 'simulation/setSimulation':
        return action.payload
      default:
        return state
    }
  }

  return configureStore({
    reducer: {
      simulation: simulationReducer
    }
  })
}

// Get references to mocked functions after mocking
const mockMap = jest.requireMock('mapbox-gl').Map

// Set up map event handling
const callbacks: { [key: string]: MapboxCallback[] } = {}
mockMapInstance.on.mockImplementation((event: string, callback: MapboxCallback) => {
  if (!callbacks[event]) {
    callbacks[event] = []
  }
  callbacks[event].push(callback)
  
  // Immediately trigger load event to simulate map initialization
  if (event === 'load') {
    callback({ type: 'load', target: mockMapInstance })
  }
})

// Create helper to trigger events
const triggerMapEvent = (eventType: string) => {
  if (callbacks[eventType]) {
    callbacks[eventType].forEach(callback => 
      callback({ type: eventType, target: mockMapInstance })
    )
  }
}

describe('UI Flow Tests', () => {
  const testData = {
    name: 'Pacific Theater Simulation',
    description: 'Naval exercise in the Pacific',
    location: {
      center: [-155.5, 19.5],
      zoom: 5
    }
  }

  let store: ReturnType<typeof createTestStore>

  beforeAll(() => {
    // Clear localStorage once before all tests
    localStorageMock.clear()
  })

  beforeEach(() => {
    // Create fresh store for each test
    store = createTestStore()

    // Reset mocks but don't clear localStorage
    mockRouterPush.mockReset()
    mockMap.mockClear()
    
    // Set up mock implementations
    mockMapInstance.getCenter.mockImplementation(() => ({ 
      lng: testData.location.center[0], 
      lat: testData.location.center[1] 
    }))
    mockMapInstance.getZoom.mockImplementation(() => testData.location.zoom)
    
    // Mock map events
    const callbacks: { [key: string]: MapboxCallback[] } = {}
    mockMapInstance.on.mockImplementation((event: string, callback: MapboxCallback) => {
      if (!callbacks[event]) {
        callbacks[event] = []
      }
      callbacks[event].push(callback)
      
      // Immediately trigger load event
      if (event === 'load') {
        callback({ type: 'load', target: mockMapInstance })
      }
    })

    // Create helper to trigger events
    mockMapInstance.triggerEvent = (eventType: string) => {
      if (callbacks[eventType]) {
        callbacks[eventType].forEach(callback => 
          callback({ type: eventType, target: mockMapInstance })
        )
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    // Clean up localStorage after all tests
    localStorageMock.clear()
  })

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {ui}
      </Provider>
    )
  }

  // Custom event type for map events
  const createMapEvent = (type: string) => {
    const event = new Event(type, {
      bubbles: true,
      cancelable: true
    })
    Object.defineProperty(event, 'target', {
      value: mockMapInstance,
      enumerable: true
    })
    return event
  }

  it('should display welcome page and handle simulation creation flow', async () => {
    const user = userEvent.setup()

    // Clear any existing simulation data
    localStorageMock.setItem('currentSimulation', '')

    // 1. Render and verify welcome page
    let { unmount: unmountHome } = renderWithProviders(<Home />)

    // Verify welcome page content
    expect(screen.getByRole('heading', { name: 'Naval Tactical Simulator' })).toBeInTheDocument()
    expect(screen.getByText('Welcome to the Naval Tactical Simulator')).toBeInTheDocument()
    const newSimButton = screen.getByRole('button', { name: 'New Simulation' })
    expect(newSimButton).toBeInTheDocument()

    // 2. Open new simulation dialog
    await act(async () => {
      await user.click(newSimButton)
    })

    // Verify dialog content
    expect(screen.getByRole('heading', { name: 'Create New Simulation' })).toBeInTheDocument()
    const nameInput = screen.getByLabelText('Simulation Name')
    const descInput = screen.getByLabelText('Description')
    const startTimeInput = screen.getByLabelText('Start Time')
    const durationInput = screen.getByLabelText('Duration (minutes)')

    expect(nameInput).toBeInTheDocument()
    expect(descInput).toBeInTheDocument()
    expect(startTimeInput).toBeInTheDocument()
    expect(durationInput).toBeInTheDocument()

    // 3. Fill out simulation form
    await act(async () => {
      await user.type(nameInput, testData.name)
      await user.type(descInput, testData.description)
      await user.clear(startTimeInput)
      await user.type(startTimeInput, '2024-03-15T10:00')
      await user.clear(durationInput)
      await user.type(durationInput, '120')

      // Simulate map events
      triggerMapEvent('movestart')
      triggerMapEvent('moveend')
      triggerMapEvent('zoomend')
    })

    // 4. Submit form
    const createButton = screen.getByRole('button', { name: 'Create' })
    await act(async () => {
      await user.click(createButton)
      
      // Add a small delay to allow for state updates
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Wait for simulation to be saved
    let savedSimulationData: any
    await waitFor(() => {
      const savedSimulation = JSON.parse(localStorageMock.getItem('currentSimulation') || '{}')
      console.log('Checking saved simulation:', savedSimulation)
      expect(savedSimulation.name).toBe(testData.name)
      savedSimulationData = savedSimulation
    })

    // Verify navigation was triggered
    expect(mockRouterPush).toHaveBeenCalledWith('/simulation')

    // Clean up home page
    unmountHome()

    // Save the simulation data for the next render
    const simulationJson = JSON.stringify(savedSimulationData)
    localStorageMock.clear() // Clear any other data
    localStorageMock.setItem('currentSimulation', simulationJson)

    // Update Redux store with simulation data
    store.dispatch({ type: 'simulation/setSimulation', payload: savedSimulationData })

    // 5. Render and verify simulation page
    const { unmount: unmountSimulation } = renderWithProviders(<SimulationPage />)

    // Wait for map initialization
    await waitFor(() => {
      expect(mockMap).toHaveBeenCalled()
    })

    // Wait for simulation data to be loaded
    await waitFor(() => {
      const currentSimulation = JSON.parse(localStorageMock.getItem('currentSimulation') || '{}')
      expect(currentSimulation.name).toBe(testData.name)
    })

    // Verify simulation page content
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Naval Tactical Simulator - Setup/ })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /Available Ships/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Save/ })).toBeInTheDocument()
    })

    // Verify map initialization
    expect(mockMapInstance.getCenter).toHaveBeenCalled()
    expect(mockMapInstance.getZoom).toHaveBeenCalled()
    expect(mockMapInstance.dragRotate.disable).toHaveBeenCalled()
    expect(mockMapInstance.touchZoomRotate.disableRotation).toHaveBeenCalled()

    // Verify simulation data
    const finalSimulation = JSON.parse(localStorageMock.getItem('currentSimulation') || '{}')
    expect(finalSimulation.name).toBe(testData.name)
    expect(finalSimulation.description).toBe(testData.description)
    expect(finalSimulation.location.center).toEqual(testData.location.center)
    expect(finalSimulation.location.zoom).toBe(testData.location.zoom)

    // Clean up simulation page
    unmountSimulation()
  })
}) 