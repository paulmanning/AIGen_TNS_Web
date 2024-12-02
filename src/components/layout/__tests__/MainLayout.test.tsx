import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MainLayout } from '../MainLayout'

describe('MainLayout', () => {
  const defaultProps = {
    children: <div>Test Content</div>
  }

  it('renders the application title', () => {
    render(<MainLayout {...defaultProps} />)
    expect(screen.getByText('Naval Tactical Simulator')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(<MainLayout {...defaultProps} />)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies correct layout styles', () => {
    const { container } = render(<MainLayout {...defaultProps} />)
    
    // Check root container styles
    const root = container.firstChild as HTMLElement
    expect(root).toHaveClass('min-h-screen', 'bg-gray-100', 'dark:bg-gray-900')
    
    // Check header styles
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-white', 'dark:bg-gray-800', 'shadow')
    
    // Check main content styles
    const main = screen.getByRole('main')
    expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'py-6', 'px-4')
  })

  it('renders header with correct styles', () => {
    render(<MainLayout {...defaultProps} />)
    
    const headerContent = screen.getByText('Naval Tactical Simulator')
    const headerContainer = headerContent.closest('div')
    expect(headerContainer).toHaveClass('max-w-7xl', 'mx-auto', 'py-4', 'px-4')
    expect(headerContent).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'dark:text-white')
  })

  it('handles multiple children', () => {
    render(
      <MainLayout>
        <div>First Child</div>
        <div>Second Child</div>
      </MainLayout>
    )
    expect(screen.getByText('First Child')).toBeInTheDocument()
    expect(screen.getByText('Second Child')).toBeInTheDocument()
  })

  it('handles no children gracefully', () => {
    render(<MainLayout children={undefined} />)
    expect(screen.getByText('Naval Tactical Simulator')).toBeInTheDocument()
    const main = screen.getByRole('main')
    expect(main).toBeEmptyDOMElement()
  })

  it('maintains semantic HTML structure', () => {
    render(<MainLayout {...defaultProps} />)
    
    // Check semantic structure
    expect(screen.getByRole('banner')).toBeInTheDocument() // <header>
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument() // <h1>
    expect(screen.getByRole('main')).toBeInTheDocument() // <main>
  })

  it('preserves child component functionality', () => {
    const TestComponent = () => (
      <button onClick={() => {}}>Interactive Child</button>
    )
    
    render(
      <MainLayout>
        <TestComponent />
      </MainLayout>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toBeEnabled()
  })
}) 