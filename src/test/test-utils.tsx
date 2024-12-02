import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { VesselType } from '@/types/simulation'
import type { ShipData } from '@/data/ships'
import { act, waitFor } from '@testing-library/react'

// Custom render function that includes providers
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          {children}
        </DndProvider>
      </Provider>
    ),
    ...options,
  })
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Export user-event
export { userEvent }

// Export act and waitFor
export { act, waitFor }

// Mock factories
export const createMockShip = (overrides: Partial<ShipData> = {}): ShipData => ({
  id: 'test-ship-1',
  name: 'USS Test Ship',
  hullNumber: 'TST-01',
  type: VesselType.SURFACE_WARSHIP,
  nationality: 'USA',
  maxSpeed: 30,
  maxTurnRate: 10,
  ...overrides
})

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    length: Object.keys(store).length
  }
}

// Mock DnD hooks
export const mockUseDrag = (isDragging = false) => [
  { isDragging },
  vi.fn(),
  vi.fn()
] as const

// Test IDs for consistent querying
export const testIds = {
  searchInput: 'ship-search-input',
  shipItem: 'ship-item',
  categoryHeader: 'category-header',
  shipList: 'ship-list',
  dragHandle: 'drag-handle'
} as const 