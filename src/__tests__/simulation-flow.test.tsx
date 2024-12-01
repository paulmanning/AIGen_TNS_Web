import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { setSimulation } from '@/store/simulationSlice'
import Home from '@/app/page'
import SimulationPage from '@/app/simulation/page'

// Mock next/navigation
const mockRouter = {
  push: jest.fn()
}
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => null
}))

// Mock mapbox-gl since it's not available in the test environment
const mockMapInstance = {
  on: jest.fn((event, callback) => {
    if (event === 'load') {
      callback({ type: 'load', target: mockMapInstance })
    }
  }),
  remove: jest.fn(),
  getCenter: jest.fn(() => ({ lng: -155.5, lat: 19.5 })),
  getZoom: jest.fn(() => 5),
  dragRotate: {
    disable: jest.fn()
  },
  touchZoomRotate: {
    disableRotation: jest.fn()
  },
  addControl: jest.fn()
}

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => mockMapInstance),
  NavigationControl: jest.fn(),
  ScaleControl: jest.fn()
}))

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  )
}

describe('Simulation Creation Flow', () => {
  const testData = {
    id: 'test-id',
    name: 'Test Simulation',
    description: 'Test Description',
    startTime: '2024-03-15T10:00',
    location: {
      center: [-155.5, 19.5],
      zoom: 5
    },
    duration: 120,
    vessels: []
  }

  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorage.clear()
    mockRouter.push.mockReset()
    
    // Reset Redux store
    store.dispatch(setSimulation(null))
    
    // Reset map mock methods
    Object.values(mockMapInstance).forEach(method => {
      if (typeof method === 'function') {
        method.mockClear()
      }
    })
    mockMapInstance.dragRotate.disable.mockClear()
    mockMapInstance.touchZoomRotate.disableRotation.mockClear()
    
    // Add console logging for debugging
    const originalError = console.error
    const originalLog = console.log
    console.error = (...args) => {
      // Don't throw on React unmounting warnings
      if (args[0]?.includes('unmount') || args[0]?.includes('Should not already be working')) {
        originalError.apply(console, args)
        return
      }
      originalError.apply(console, args)
      throw new Error('Console error was called: ' + args.join(' '))
    }
    console.log = (...args) => {
      originalLog.apply(console, args)
    }
  })

  afterEach(async () => {
    // Clean up after each test
    await act(async () => {
      cleanup()
    })
    jest.restoreAllMocks()
  })

  it('should create simulation and display correct data on main page', async () => {
    const user = userEvent.setup()
    
    // Render home page with providers
    await act(async () => {
      renderWithProviders(<Home />)
    })
    
    // Click "New Simulation" button
    await act(async () => {
      await user.click(screen.getByText('New Simulation'))
    })
    
    // Fill out form
    const nameInput = screen.getByLabelText('Simulation Name')
    const descInput = screen.getByLabelText('Description')
    const startTimeInput = screen.getByLabelText('Start Time')
    
    await act(async () => {
      await user.type(nameInput, testData.name)
      await user.type(descInput, testData.description)
      await user.clear(startTimeInput)
      await user.type(startTimeInput, testData.startTime)
    })
    
    // Submit form
    await act(async () => {
      await user.click(screen.getByText('Create'))
    })

    // Verify navigation was triggered
    expect(mockRouter.push).toHaveBeenCalledWith('/simulation')

    // Verify simulation data was saved to localStorage
    const savedSimulation = JSON.parse(localStorage.getItem('currentSimulation') || '{}')
    expect(savedSimulation.name).toBe(testData.name)
    expect(savedSimulation.description).toBe(testData.description)
    expect(savedSimulation.startTime).toBe(testData.startTime)

    // Clean up the previous render
    cleanup()

    // Set up simulation data in Redux store and localStorage
    const simulationData = {
      ...testData,
      id: savedSimulation.id // Keep the generated ID
    }
    store.dispatch(setSimulation(simulationData))
    localStorage.setItem('currentSimulation', JSON.stringify(simulationData))

    // Render simulation page with providers
    await act(async () => {
      renderWithProviders(<SimulationPage />)
    })

    // Wait for simulation data to load and be displayed
    await waitFor(() => {
      const titleElement = screen.getByText(testData.name)
      expect(titleElement).toBeInTheDocument()
      
      const startTimeElement = screen.getByText((content) => 
        content.includes(new Date(testData.startTime).toLocaleString())
      )
      expect(startTimeElement).toBeInTheDocument()
    }, { timeout: 2000 })
  })
}) 