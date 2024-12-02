import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { setSimulation } from '@/store/simulationSlice'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Page from '@/app/simulation/page'

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
    vessels: [],
    ships: [],
    isSetupMode: true,
    isPlaying: false,
    currentTime: 0,
    selectedShipId: undefined,
    simulationSpeed: 1,
    timeMultiplier: 1,
    isPaused: false,
    bounds: {
      north: 20,
      south: 19,
      east: -155,
      west: -156
    }
  }

  beforeEach(() => {
    // Clear localStorage and reset store before each test
    localStorage.clear()
    store.dispatch(setSimulation(null))
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

  it('renders the simulation setup page', () => {
    store.dispatch(setSimulation(testData))
    renderWithProviders(<Page />)
    expect(screen.getByRole('heading', { name: /Naval Tactical Simulator - Test Simulation \(Setup\)/ })).toBeInTheDocument()
  })

  it('displays the available ships panel', () => {
    store.dispatch(setSimulation(testData))
    renderWithProviders(<Page />)
    expect(screen.getByRole('heading', { name: 'Available Ships' })).toBeInTheDocument()
  })
}) 