import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Providers } from '../providers'
import { store } from '@/store'

describe('Providers', () => {
  it('renders children with store and DnD providers', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>
    
    const { getByTestId } = render(
      <Providers>
        <TestChild />
      </Providers>
    )
    
    expect(getByTestId('test-child')).toBeInTheDocument()
    expect(getByTestId('test-child').textContent).toBe('Test Content')
    expect(store.getState()).toBeDefined()
  })

  it('provides Redux store to children', () => {
    let testStore: any
    const TestChild = () => {
      testStore = store
      return null
    }
    
    render(
      <Providers>
        <TestChild />
      </Providers>
    )
    
    expect(testStore).toBeDefined()
    expect(testStore.dispatch).toBeDefined()
    expect(testStore.getState).toBeDefined()
  })

  it('provides DnD context to children', () => {
    const TestChild = () => {
      const context = document.querySelectorAll('[data-rbd-droppable-context-id]')
      return <div data-testid="dnd-test">{context.length > 0 ? 'DnD Active' : 'No DnD'}</div>
    }
    
    const { getByTestId } = render(
      <Providers>
        <TestChild />
      </Providers>
    )
    
    expect(getByTestId('dnd-test')).toBeInTheDocument()
  })
}) 