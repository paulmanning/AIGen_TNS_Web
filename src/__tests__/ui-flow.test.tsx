import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Page from '@/app/page'

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