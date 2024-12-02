'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CollapsiblePanelProps {
  title: string
  children: React.ReactNode
  side: 'left' | 'right'
  className?: string
}

export function CollapsiblePanel({ 
  title, 
  children, 
  side, 
  className = '' 
}: CollapsiblePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const showLeftChevron = (side === 'left' && !isCollapsed) || (side === 'right' && isCollapsed)
  const showRightChevron = (side === 'left' && isCollapsed) || (side === 'right' && !isCollapsed)

  return (
    <div 
      className={`flex ${side === 'right' ? 'flex-row-reverse' : 'flex-row'} h-full bg-gray-800 border-gray-700 ${
        side === 'right' ? 'border-l' : 'border-r'
      } transition-all duration-300 ${className}`}
      style={{
        width: isCollapsed ? '32px' : undefined
      }}
    >
      {/* Content */}
      <div 
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isCollapsed ? 'w-0 opacity-0' : 'opacity-100'
        }`}
        style={{ display: isCollapsed ? 'none' : undefined }}
      >
        {children}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex-none w-8 bg-gray-700 hover:bg-gray-600 flex items-center justify-center border-gray-600 transition-colors"
      >
        <div 
          className="flex items-center justify-center text-white"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: side === 'right' ? 'rotate(180deg)' : undefined
          }}
        >
          {isCollapsed ? (
            <>
              <span className="mr-2 uppercase tracking-wider text-xs font-medium">{title}</span>
              {showRightChevron && <ChevronRight data-testid="chevron-right" size={16} />}
              {showLeftChevron && <ChevronLeft data-testid="chevron-left" size={16} />}
            </>
          ) : (
            <>
              {showLeftChevron && <ChevronLeft data-testid="chevron-left" size={16} />}
              {showRightChevron && <ChevronRight data-testid="chevron-right" size={16} />}
              <span className="ml-2 uppercase tracking-wider text-xs font-medium">{title}</span>
            </>
          )}
        </div>
      </button>
    </div>
  )
} 