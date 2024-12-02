import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SimulationList } from '../SimulationList'

describe('SimulationList', () => {
  const mockSimulations = [
    {
      id: 'sim-1',
      name: 'Test Simulation 1',
      lastModified: new Date('2024-03-15T10:00:00'),
      description: 'Test Description 1'
    },
    {
      id: 'sim-2',
      name: 'Test Simulation 2',
      lastModified: new Date('2024-03-14T10:00:00')
    }
  ]

  const defaultProps = {
    simulations: mockSimulations,
    onLoadSimulation: vi.fn()
  }

  it('renders the list title', () => {
    render(<SimulationList {...defaultProps} />)
    expect(screen.getByText('Recent Simulations')).toBeInTheDocument()
  })

  it('renders all simulations in the list', () => {
    render(<SimulationList {...defaultProps} />)
    
    // Check simulation names
    expect(screen.getByText('Test Simulation 1')).toBeInTheDocument()
    expect(screen.getByText('Test Simulation 2')).toBeInTheDocument()
    
    // Check last modified dates
    expect(screen.getByText(`Last modified: ${mockSimulations[0].lastModified.toLocaleDateString()}`)).toBeInTheDocument()
    expect(screen.getByText(`Last modified: ${mockSimulations[1].lastModified.toLocaleDateString()}`)).toBeInTheDocument()
  })

  it('renders description when available', () => {
    render(<SimulationList {...defaultProps} />)
    expect(screen.getByText('Test Description 1')).toBeInTheDocument()
  })

  it('does not render description when not available', () => {
    render(<SimulationList {...defaultProps} />)
    const descriptions = screen.getAllByText(/Test Description/i)
    expect(descriptions).toHaveLength(1) // Only one description should be rendered
  })

  it('calls onLoadSimulation with correct id when load button is clicked', () => {
    render(<SimulationList {...defaultProps} />)
    
    // Get all load buttons
    const loadButtons = screen.getAllByText('Load')
    expect(loadButtons).toHaveLength(2)
    
    // Click first simulation's load button
    fireEvent.click(loadButtons[0])
    expect(defaultProps.onLoadSimulation).toHaveBeenCalledWith('sim-1')
    
    // Click second simulation's load button
    fireEvent.click(loadButtons[1])
    expect(defaultProps.onLoadSimulation).toHaveBeenCalledWith('sim-2')
  })

  it('renders correctly with empty simulations list', () => {
    render(<SimulationList simulations={[]} onLoadSimulation={defaultProps.onLoadSimulation} />)
    expect(screen.getByText('Recent Simulations')).toBeInTheDocument()
    expect(screen.queryByText('Load')).not.toBeInTheDocument()
  })

  it('applies correct styles to simulation items', () => {
    render(<SimulationList {...defaultProps} />)
    
    // Check container styles
    const container = screen.getByText('Recent Simulations').closest('.bg-white')
    expect(container).toHaveClass('bg-white', 'dark:bg-gray-800', 'shadow', 'rounded-lg')
    
    // Check simulation item styles
    const items = screen.getAllByText(/Test Simulation/i).map(el => 
      el.closest('.bg-gray-50')
    )
    items.forEach(item => {
      expect(item).toHaveClass(
        'bg-gray-50',
        'dark:bg-gray-700',
        'rounded-lg',
        'flex',
        'items-center',
        'justify-between'
      )
    })
    
    // Check load button styles
    const loadButtons = screen.getAllByText('Load')
    loadButtons.forEach(button => {
      expect(button).toHaveClass(
        'bg-blue-600',
        'hover:bg-blue-700',
        'text-white',
        'rounded-md'
      )
    })
  })
}) 