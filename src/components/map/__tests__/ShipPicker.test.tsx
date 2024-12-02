/**
 * @vitest-environment jsdom
 */

// Mock modules first, before any imports
vi.mock('react-dnd', () => ({
  __esModule: true,
  useDrag: () => [{ isDragging: false }, vi.fn()],
  DndProvider: ({ children }: { children: React.ReactNode }) => children
}))

vi.mock('react-dnd-html5-backend', () => ({
  __esModule: true,
  HTML5Backend: {}
}))

vi.mock('@/data/ships', () => {
  const mockShips = [
    {
      id: 'test-ship-1',
      name: 'USS Test Ship',
      hullNumber: 'TST-01',
      type: 'SURFACE_WARSHIP',
      nationality: 'USA',
      maxSpeed: 30,
      maxTurnRate: 10
    },
    {
      id: 'test-ship-2',
      name: 'HMS Test Sub',
      hullNumber: 'TST-02',
      type: 'SUBMARINE',
      nationality: 'GBR',
      maxSpeed: 25,
      maxTurnRate: 8
    }
  ]

  return {
    __esModule: true,
    defaultShips: mockShips
  }
})

import { describe, it, expect, beforeEach } from 'vitest'
import { ShipPicker } from '../ShipPicker'
import { VesselType } from '@/types/simulation'
import {
  render,
  screen,
  userEvent,
  createMockShip,
  mockLocalStorage,
  testIds,
  act,
  waitFor
} from '@/test/test-utils'

describe('ShipPicker', () => {
  const storage = mockLocalStorage()

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: storage })
    storage.clear()
    storage.getItem.mockReturnValue(JSON.stringify(['test-ship-1', 'test-ship-2']))
  })

  it('renders search input and ship categories', async () => {
    await act(async () => {
      render(<ShipPicker />)
    })
    
    expect(screen.getByTestId(testIds.searchInput)).toBeInTheDocument()
    const categories = screen.getAllByTestId(testIds.categoryHeader)
    expect(categories).toHaveLength(2)
    expect(categories[0].textContent).toContain('Surface Warship')
    expect(categories[1].textContent).toContain('Submarine')
  })

  it('displays ships from localStorage', async () => {
    await act(async () => {
      render(<ShipPicker />)
    })
    
    const shipItems = screen.getAllByTestId(testIds.shipItem)
    expect(shipItems).toHaveLength(2)
    expect(screen.getByText('USS Test Ship')).toBeInTheDocument()
    expect(screen.getByText('HMS Test Sub')).toBeInTheDocument()
  })

  it('filters ships based on search query', async () => {
    const user = userEvent.setup()
    await act(async () => {
      render(<ShipPicker />)
    })
    
    const searchInput = screen.getByTestId(testIds.searchInput)
    
    // Search by name
    await user.type(searchInput, 'USS')
    await waitFor(() => {
      expect(screen.getByText('USS Test Ship')).toBeInTheDocument()
      expect(screen.queryByText('HMS Test Sub')).not.toBeInTheDocument()
    })
    
    // Clear and search by hull number
    await user.clear(searchInput)
    await user.type(searchInput, 'TST-02')
    await waitFor(() => {
      expect(screen.queryByText('USS Test Ship')).not.toBeInTheDocument()
      expect(screen.getByText('HMS Test Sub')).toBeInTheDocument()
    })
  })

  it('toggles category expansion', async () => {
    const user = userEvent.setup()
    await act(async () => {
      render(<ShipPicker />)
    })
    
    const categories = screen.getAllByTestId(testIds.categoryHeader)
    const surfaceCategory = categories.find(c => c.textContent?.includes('Surface Warship'))
    const submarineCategory = categories.find(c => c.textContent?.includes('Submarine'))
    
    // Initially expanded
    expect(screen.getByText('USS Test Ship')).toBeInTheDocument()
    expect(screen.getByText('HMS Test Sub')).toBeInTheDocument()
    
    // Collapse Surface Warship category
    await user.click(surfaceCategory!)
    await waitFor(() => {
      expect(screen.queryByText('USS Test Ship')).not.toBeInTheDocument()
      expect(screen.getByText('HMS Test Sub')).toBeInTheDocument()
    })
    
    // Collapse Submarine category
    await user.click(submarineCategory!)
    await waitFor(() => {
      expect(screen.queryByText('HMS Test Sub')).not.toBeInTheDocument()
    })
  })

  it('displays correct nationality flags', async () => {
    await act(async () => {
      render(<ShipPicker />)
    })
    
    const shipItems = screen.getAllByTestId(testIds.shipItem)
    expect(shipItems[0].textContent).toContain('🇺🇸')
    expect(shipItems[1].textContent).toContain('🇬🇧')
  })

  it('shows category counts', async () => {
    await act(async () => {
      render(<ShipPicker />)
    })
    
    const categories = screen.getAllByTestId(testIds.categoryHeader)
    expect(categories[0].textContent).toContain('(1)')
    expect(categories[1].textContent).toContain('(1)')
  })

  it('handles empty localStorage gracefully', async () => {
    storage.getItem.mockReturnValue(null)
    await act(async () => {
      render(<ShipPicker />)
    })
    
    await waitFor(() => {
      expect(screen.queryAllByTestId(testIds.shipItem)).toHaveLength(0)
      const categories = screen.getAllByTestId(testIds.categoryHeader)
      expect(categories[0].textContent).toContain('(0)')
      expect(categories[1].textContent).toContain('(0)')
    })
  })

  it('applies drag styles to ship items', async () => {
    await act(async () => {
      render(<ShipPicker />)
    })
    
    const shipItems = screen.getAllByTestId(testIds.shipItem)
    expect(shipItems[0]).toHaveClass('cursor-move', 'opacity-100')
  })

  it('maintains search state and filters case-insensitively', async () => {
    const user = userEvent.setup()
    await act(async () => {
      render(<ShipPicker />)
    })
    
    const searchInput = screen.getByTestId(testIds.searchInput)
    await user.type(searchInput, 'test')
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('test')
      expect(screen.getByText('USS Test Ship')).toBeInTheDocument()
      expect(screen.getByText('HMS Test Sub')).toBeInTheDocument()
    })
  })
}) 