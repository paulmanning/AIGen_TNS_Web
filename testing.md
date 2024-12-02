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