# Testing Specification

## Overview
This document outlines the testing strategy, tools, and practices for the Naval Tactical Simulator project.

## Testing Stack
- **Framework**: Vitest
- **Testing Libraries**:
  - `@testing-library/react` - React component testing
  - `@testing-library/user-event` - User interaction simulation
  - `@testing-library/jest-dom` - DOM matchers
  - `jsdom` - Browser environment simulation

## Test Scripts
```bash
# Run all tests once with verbose output
npm run test

# Run all tests once with minimal output
npm run test:min

# Run tests with coverage report
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run tests in watch mode with dev server
npm run dev:test

# Run tests in watch mode with verbose output and dev server
npm run dev:full
```

## Directory Structure
```
src/
├── __tests__/              # Integration/flow tests
├── components/
│   └── __tests__/         # Component-specific tests
├── test/
│   └── test-utils.tsx     # Testing utilities and helpers
└── test-setup.ts          # Global test setup
```

## Testing Utilities
Located in `src/test/test-utils.tsx`:
- Custom render function with providers
- Mock factories for common test data
- Test IDs for consistent component querying
- Mock implementations for external dependencies

## Test Categories

### Unit Tests
- Located alongside components in `__tests__` directories
- Focus on isolated component functionality
- Use mock data and dependencies
- Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests
- Located in `src/__tests__/`
- Test component interactions and data flow
- Use realistic data structures
- Verify business logic across components

### UI Flow Tests
- Test user interaction flows
- Verify component state changes
- Ensure proper event handling
- Test accessibility features

## Best Practices

### Component Testing
1. Use semantic queries (`getByRole`, `getByLabelText`)
2. Prefer user-event over fireEvent
3. Test component behavior, not implementation
4. Use test IDs sparingly and consistently
5. Mock complex dependencies

### Test Structure
1. Clear test descriptions
2. One assertion per test when possible
3. Proper setup and cleanup
4. Consistent naming conventions
5. Appropriate use of test hooks (beforeEach, afterEach)

### Mocking
1. Mock external dependencies
2. Use realistic mock data
3. Keep mocks close to production behavior
4. Clear mock reset between tests
5. Document complex mock setups

### Coverage
- Maintain high coverage for critical paths
- Focus on meaningful coverage over percentage
- Regular coverage reports and monitoring
- Document intentionally uncovered code

## Common Patterns

### Testing Redux Components
```typescript
import { render } from '@/test/test-utils'

describe('Component with Redux', () => {
  it('renders with store state', () => {
    render(<Component />)
    // Test component with store
  })
})
```

### Testing Drag and Drop
```typescript
import { render } from '@/test/test-utils'

describe('DnD Component', () => {
  it('handles drag and drop', () => {
    render(<DndComponent />)
    // Test drag and drop functionality
  })
})
```

### Testing Async Operations
```typescript
import { render, waitFor } from '@/test/test-utils'

describe('Async Component', () => {
  it('handles async operations', async () => {
    render(<AsyncComponent />)
    await waitFor(() => {
      // Assert async results
    })
  })
})
```

## Continuous Integration
- Tests run on every pull request
- Coverage reports generated automatically
- Test failures block merges
- Performance metrics tracked

## Debugging Tests
1. Use `test:ui` script for visual debugging
2. Enable verbose logging when needed
3. Use browser devtools with UI mode
4. Check test isolation issues
5. Verify mock implementations

## Future Improvements
1. Add E2E testing with Playwright
2. Implement visual regression testing
3. Add performance testing
4. Expand integration test coverage
5. Add API mocking layer 

## Current Test Coverage

### Integration Tests (`src/__tests__/`)

#### UI Flow Tests (`ui-flow.test.tsx`)
Tests the main application flow and user interactions:
- `renders the new simulation button` - Verifies initial UI state
- `opens the new simulation dialog when clicking create button` - Tests dialog interaction

#### Simulation Flow Tests (`simulation-flow.test.tsx`)
Tests core simulation functionality:
- `renders the simulation setup page` - Verifies simulation initialization
- `displays the available ships panel` - Tests ship selection UI

### Component Tests

#### Map Components

##### MapComponent (`src/components/map/__tests__/MapComponent.test.tsx`)
Tests the main map visualization:
- Map initialization and cleanup
- Marker rendering and updates
- Ship trail visualization
- Viewport controls
- Drag and drop integration

##### DroppableMapOverlay (`src/components/map/__tests__/DroppableMapOverlay.test.tsx`)
Tests map overlay drag and drop functionality:
- Drop zone activation
- Ship placement handling
- Coordinate conversion
- Hover state management
- Drop validation

##### ShipMarker (`src/components/map/__tests__/ShipMarker.test.tsx`)
Tests ship marker visualization:
- Marker rendering with correct position
- Course arrow display
- Ship icon selection
- Nationality flag display
- Selection state handling

##### ShipPicker (`src/components/map/__tests__/ShipPicker.test.tsx`)
Tests ship selection interface:
- Ship list rendering
- Category filtering
- Search functionality
- Drag source setup
- Ship preview display

#### UI Components

##### CollapsiblePanel (`src/components/ui/__tests__/CollapsiblePanel.test.tsx`)
Tests collapsible panel behavior:
- Panel expansion/collapse
- Header rendering
- Content visibility
- Animation states
- Accessibility features

#### Simulation Components

##### SimulationController (`src/components/simulation/__tests__/SimulationController.test.tsx`)
Tests simulation control interface:
- Time display formatting
- Play/pause functionality
- Speed control
- Ship selection
- Course/speed updates

##### SimulationControls (`src/components/simulation/__tests__/SimulationControls.test.tsx`)
Tests simulation control elements:
- Time controls
- Speed adjustment
- Restart functionality
- State synchronization
- UI feedback

##### SimulationList (`src/components/simulation/__tests__/SimulationList.test.tsx`)
Tests simulation management:
- List rendering
- Simulation selection
- Creation dialog
- Deletion handling
- State persistence

#### Layout Components

##### MainLayout (`src/components/layout/__tests__/MainLayout.test.tsx`)
Tests application layout structure:
- Component arrangement
- Navigation elements
- Responsive behavior
- Child component rendering
- Header/footer placement

### Test Utilities

#### Custom Render Function
```typescript
function customRender(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
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
```

#### Mock Factories
```typescript
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
```

#### Test IDs
```typescript
export const testIds = {
  searchInput: 'ship-search-input',
  shipItem: 'ship-item',
  categoryHeader: 'category-header',
  shipList: 'ship-list',
  dragHandle: 'drag-handle'
}
```

### Coverage Summary
Current test coverage focuses on:
- Core simulation logic
- User interface interactions
- Map visualization components
- State management
- Drag and drop functionality
- Time control systems
- Ship management features

Areas for expansion:
- Error handling scenarios
- Edge cases in ship movement
- Network error states
- Performance degradation handling
- Mobile-specific interactions

## Detailed Test Descriptions

### Integration Tests

#### UI Flow Tests (`ui-flow.test.tsx`)
```typescript
describe('UI Flow', () => {
  it('renders the new simulation button', () => {
    // Verifies that the "New Simulation" button is present in the UI
    // Expected: Button with text "New Simulation" exists
  })

  it('opens the new simulation dialog when clicking create button', () => {
    // Tests the interaction flow for creating a new simulation
    // Expected: Dialog with heading "Create New Simulation" appears after click
  })
})
```

#### Simulation Flow Tests (`simulation-flow.test.tsx`)
```typescript
describe('Simulation Creation Flow', () => {
  it('renders the simulation setup page', () => {
    // Verifies the simulation setup page initialization
    // Expected: Page heading contains simulation name and setup indicator
  })

  it('displays the available ships panel', () => {
    // Tests the ship selection panel visibility
    // Expected: Panel with heading "Available Ships" is present
  })
})
```

### Component Tests

#### Map Components

##### DroppableMapOverlay (`DroppableMapOverlay.test.tsx`)
```typescript
describe('DroppableMapOverlay', () => {
  it('renders the overlay container', () => {
    // Tests basic overlay rendering
    // Expected: Overlay element exists with correct positioning classes
  })

  it('handles ship drop with valid coordinates', async () => {
    // Tests successful ship placement
    // Expected: 
    // - onShipDrop called with correct coordinates
    // - Drop message displayed and auto-dismissed
  })

  it('handles ship drop when map is not available', async () => {
    // Tests error handling for missing map
    // Expected: onShipDrop not called
  })

  it('handles ship drop without client offset', async () => {
    // Tests error handling for invalid drop
    // Expected: onShipDrop not called
  })

  it('positions drop message correctly', async () => {
    // Tests UI feedback positioning
    // Expected: Message appears at correct coordinates with proper offset
  })
})
```

##### CollapsiblePanel (`CollapsiblePanel.test.tsx`)
```typescript
describe('CollapsiblePanel', () => {
  it('renders panel with title and content', () => {
    // Tests basic panel rendering
    // Expected: Title and content visible with correct structure
  })

  it('toggles collapse state when button is clicked', () => {
    // Tests panel collapse/expand functionality
    // Expected: Content opacity changes on click
  })

  it('shows correct chevron based on side and collapse state - left side', () => {
    // Tests left side chevron behavior
    // Expected: Chevron direction changes with panel state
  })

  it('shows correct chevron based on side and collapse state - right side', () => {
    // Tests right side chevron behavior
    // Expected: Chevron direction changes with panel state
  })

  it('applies correct styles based on side prop', () => {
    // Tests panel positioning styles
    // Expected: Correct flex direction applied for each side
  })

  it('applies custom className when provided', () => {
    // Tests custom styling support
    // Expected: Custom class added to panel
  })

  it('applies collapsed width style when collapsed', () => {
    // Tests panel width changes
    // Expected: Width updates on collapse
  })

  it('maintains correct content order', () => {
    // Tests DOM structure consistency
    // Expected: Content and button order maintained
  })

  it('renders title with correct orientation', () => {
    // Tests vertical title rendering
    // Expected: Title has vertical writing mode
  })

  it('applies correct transform for right side title', () => {
    // Tests right side title orientation
    // Expected: Title rotated 180 degrees
  })
})
```

##### SimulationController (`SimulationController.test.tsx`)
```typescript
describe('SimulationController', () => {
  it('displays formatted time', () => {
    // Tests time display formatting
    // Expected: Time shown in format "Mar 15, 2024, 10:05:00"
  })

  it('handles play/pause button click', () => {
    // Tests play/pause functionality
    // Expected: onPlayPause callback called when button clicked
  })

  it('handles speed change', () => {
    // Tests simulation speed adjustment
    // Expected: onSpeedChange called with new speed value
  })

  it('renders ship information when ships are provided', () => {
    // Tests ship details display
    // Expected: 
    // - Ship name displayed
    // - Course and speed shown with correct formatting
    // - Proper CSS classes applied
  })
})
```

### Test Patterns

#### Component Setup
```typescript
// Common test setup pattern
const defaultProps = {
  // Base props with mock functions
  onTimeChange: vi.fn(),
  onPlayPause: vi.fn(),
  // ... other props
}

const testData = {
  // Test data factory
  id: 'test-id',
  name: 'Test Simulation',
  // ... other data
}

beforeEach(() => {
  // Reset mocks and setup
  vi.clearAllMocks()
  vi.useFakeTimers()
})

afterEach(() => {
  // Cleanup
  vi.useRealTimers()
})
```

#### Mock Patterns
```typescript
// Mock external dependencies
vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(),
    LngLat: vi.fn()
  }
}))

// Mock React hooks
vi.mock('react-dnd', () => ({
  DndProvider: ({ children }) => children,
  useDrop: vi.fn()
}))

// Mock complex objects
const mockMap = {
  getContainer: vi.fn(() => ({
    getBoundingClientRect: () => ({
      left: 0,
      top: 0
    })
  })),
  unproject: vi.fn()
} as unknown as mapboxgl.Map
```

#### Assertion Patterns
```typescript
// DOM element presence
expect(screen.getByText('Test Text')).toBeInTheDocument()

// Style assertions
expect(element).toHaveClass('expected-class')
expect(element).toHaveStyle({ property: 'value' })

// Event handling
fireEvent.click(button)
expect(mockHandler).toHaveBeenCalled()

// Async operations
await act(async () => {
  await userEvent.click(button)
})
await waitFor(() => {
  expect(result).toBe(expected)
})
```

### Test Organization

#### File Structure
```
__tests__/
├── ComponentName.test.tsx     # Component tests
├── utils/                    # Test utilities
│   ├── setup.ts             # Setup functions
│   └── mocks.ts             # Mock factories
└── integration/             # Integration tests
```

#### Test Grouping
```typescript
describe('Component', () => {
  describe('Rendering', () => {
    // Rendering tests
  })

  describe('Interactions', () => {
    // User interaction tests
  })

  describe('State Management', () => {
    // State-related tests
  })

  describe('Error Handling', () => {
    // Error case tests
  })
})
```

### Test Coverage Goals

Each test suite aims to verify:
1. Component Rendering
   - Basic component structure
   - Proper class application
   - Correct content display

2. User Interactions
   - Click handlers
   - Drag and drop operations
   - Form submissions
   - Keyboard interactions

3. State Management
   - Component state changes
   - Redux store updates
   - Context updates

4. Error Handling
   - Invalid input handling
   - Missing prop handling
   - Network error states
   - Edge cases

5. Visual Feedback
   - Loading states
   - Success/error messages
   - Animations
   - Transitions

6. Accessibility
   - ARIA attributes
   - Keyboard navigation
   - Screen reader compatibility
   - Focus management