import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CollapsiblePanel } from '../CollapsiblePanel'

describe('CollapsiblePanel', () => {
  const defaultProps = {
    title: 'Test Panel',
    children: <div data-testid="test-content">Test Content</div>
  }

  it('renders panel with title and content', () => {
    render(<CollapsiblePanel {...defaultProps} />)
    expect(screen.getByText('Test Panel')).toBeInTheDocument()
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })

  it('toggles collapse state when button is clicked', () => {
    render(<CollapsiblePanel {...defaultProps} />)
    const content = screen.getByTestId('test-content').parentElement
    expect(content).toHaveClass('opacity-100')

    fireEvent.click(screen.getByRole('button'))
    expect(content).toHaveClass('opacity-0')
  })

  it('shows correct chevron based on side and collapse state - left side', () => {
    render(<CollapsiblePanel {...defaultProps} side="left" />)
    expect(screen.getByTestId('chevron-left')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument()
  })

  it('shows correct chevron based on side and collapse state - right side', () => {
    render(<CollapsiblePanel {...defaultProps} side="right" />)
    expect(screen.getByTestId('chevron-right')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('chevron-left')).toBeInTheDocument()
  })

  it('applies correct styles based on side prop', () => {
    const { container: leftContainer } = render(<CollapsiblePanel {...defaultProps} side="left" />)
    expect(leftContainer.firstChild).toHaveClass('flex-row')

    const { container: rightContainer } = render(<CollapsiblePanel {...defaultProps} side="right" />)
    expect(rightContainer.firstChild).toHaveClass('flex-row-reverse')
  })

  it('applies custom className when provided', () => {
    const { container } = render(<CollapsiblePanel {...defaultProps} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies collapsed width style when collapsed', () => {
    const { container } = render(<CollapsiblePanel {...defaultProps} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).not.toHaveStyle({ width: '32px' })

    fireEvent.click(screen.getByRole('button'))
    expect(wrapper).toHaveStyle({ width: '32px' })
  })

  it('maintains correct content order', () => {
    // Test left side
    const { container: leftContainer } = render(<CollapsiblePanel {...defaultProps} side="left" />)
    const leftContent = screen.getByTestId('test-content')
    const leftButton = screen.getByRole('button')
    const leftWrapper = leftContainer.firstChild as HTMLElement

    // Check that content is in the first div and button is second
    expect(leftWrapper.children[0].contains(leftContent)).toBe(true)
    expect(leftWrapper.children[1]).toBe(leftButton)

    // Cleanup before next render
    cleanup()

    // Test right side
    const { container: rightContainer } = render(<CollapsiblePanel {...defaultProps} side="right" />)
    const rightContent = screen.getByTestId('test-content')
    const rightButton = screen.getByRole('button')
    const rightWrapper = rightContainer.firstChild as HTMLElement

    // Check that content is in the first div and button is second (same order, just reversed by flex)
    expect(rightWrapper.children[0].contains(rightContent)).toBe(true)
    expect(rightWrapper.children[1]).toBe(rightButton)
  })

  it('renders title with correct orientation', () => {
    render(<CollapsiblePanel {...defaultProps} />)
    const titleElement = screen.getByText('Test Panel').parentElement
    expect(titleElement).toHaveStyle({ 'writing-mode': 'vertical-rl' })
  })

  it('applies correct transform for right side title', () => {
    render(<CollapsiblePanel {...defaultProps} side="right" />)
    const titleElement = screen.getByText('Test Panel').parentElement
    expect(titleElement).toHaveStyle({ transform: 'rotate(180deg)' })
  })
}) 