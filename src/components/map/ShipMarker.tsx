'use client'

import React from 'react'
import type { ShipData } from '@/data/ships'
import { VesselType } from '@/types/simulation'

interface ShipMarkerProps {
  ship: ShipData
  heading?: number // in degrees, 0 = North, 90 = East, etc.
  affiliation?: 'friend' | 'hostile' | 'neutral' | 'unknown'
  course?: number // in degrees, 0 = North, 90 = East, etc.
  speed?: number // in knots
}

// Constants for sizing
const SYMBOL_SIZE = 8  // Reduced from 12 (33% smaller)
const ARROW_SIZE = 12  // Kept at original size for arrow calculations
const SPEED_LINE_SCALE = 0.3 // Pixels per knot for speed line

// Basic frame shapes based on affiliation
const frameShapes = {
  friend: (size: number) => `
    M ${16 - size} ${16} 
    L ${16} ${16 - size} 
    L ${16 + size} ${16} 
    L ${16} ${16 + size} 
    Z
  `,  // Diamond
  hostile: (size: number) => `
    M ${16 - size} ${16 - size} 
    L ${16 + size} ${16 - size} 
    L ${16 + size} ${16 + size} 
    L ${16 - size} ${16 + size} 
    Z
  `,  // Square
  neutral: (size: number) => `
    M ${16 - size} ${16 - size} 
    L ${16 + size} ${16 - size} 
    L ${16 + size} ${16 + size} 
    L ${16 - size} ${16 + size} 
    Z
  `,  // Square
  unknown: (size: number) => `
    M ${16} ${16} 
    m ${-size}, 0 
    a ${size},${size} 0 1,0 ${size * 2},0 
    a ${size},${size} 0 1,0 ${-size * 2},0
  `   // Circle
}

// Ship type modifiers - all using same size multipliers now
const shipModifiers = {
  [VesselType.SURFACE_WARSHIP]: {
    symbol: (size: number) => `M ${16 - size * 0.7} ${16} L ${16 + size * 0.7} ${16}`, // Horizontal line
  },
  [VesselType.SUBMARINE]: {
    symbol: (size: number) => `
      M ${16 - size * 0.7} ${16 + size * 0.3}
      L ${16} ${16 - size * 0.3}
      L ${16 + size * 0.7} ${16 + size * 0.3}
    `,  // Inverted V for submarine
  },
  [VesselType.MERCHANT]: {
    symbol: (size: number) => `M ${16} ${16 - size * 0.7} L ${16} ${16 + size * 0.7}`, // Vertical line
  },
  [VesselType.FISHING]: {
    symbol: (size: number) => `
      M ${16} ${16 - size * 0.5}
      L ${16} ${16 + size * 0.5}
      M ${16 - size * 0.5} ${16}
      L ${16 + size * 0.5} ${16}
    `,  // Cross
  },
  [VesselType.BIOLOGIC]: {
    symbol: (size: number) => `
      M ${16 - size * 0.5} ${16 - size * 0.5}
      L ${16 + size * 0.5} ${16 + size * 0.5}
      M ${16 - size * 0.5} ${16 + size * 0.5}
      L ${16 + size * 0.5} ${16 - size * 0.5}
    `,  // X
  }
}

// Course arrow helper function - using original ARROW_SIZE for calculations
const getCourseArrow = (speed: number = 0) => {
  const arrowDistance = ARROW_SIZE * 0.9  // Distance from center
  const arrowSize = ARROW_SIZE * 0.4      // Arrow length
  const arrowBase = ARROW_SIZE * 0.2      // Arrow base width
  const speedLineLength = speed * SPEED_LINE_SCALE // Length of speed line
  
  return `
    M ${16} ${16 - arrowDistance - arrowSize - speedLineLength}
    L ${16} ${16 - arrowDistance - arrowSize}
    L ${16 - arrowBase} ${16 - arrowDistance}
    L ${16 + arrowBase} ${16 - arrowDistance}
    Z
  `
}

export function ShipMarker({ 
  ship, 
  heading = 0, 
  affiliation = 'unknown',
  course = 0,
  speed = 0
}: ShipMarkerProps) {
  const style = shipModifiers[ship.type] || shipModifiers[VesselType.SURFACE_WARSHIP]

  return (
    <div className="ship-marker">
      {/* Main SVG for symbol */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ 
          filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
          overflow: 'visible'  // Allow arrow to extend beyond SVG bounds
        }}
      >
        {/* Frame based on affiliation */}
        <path
          d={frameShapes[affiliation](SYMBOL_SIZE)}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        
        {/* Ship type modifier */}
        <path
          d={style.symbol(SYMBOL_SIZE)}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
      </svg>

      {/* Separate SVG for course arrow */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `rotate(${course}deg)`,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
          overflow: 'visible'
        }}
      >
        {/* Course arrow with speed line */}
        <path
          d={getCourseArrow(speed)}
          fill="white"
          stroke="white"
          strokeWidth="0.5"
          style={{ pointerEvents: 'none' }}
        />
      </svg>

      {/* Ship name and course/speed label */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full 
                    text-xs text-white bg-black bg-opacity-50 px-1 rounded whitespace-nowrap text-center">
        <div>{ship.name}</div>
        <div>{`${course.toFixed(0)}°/${speed.toFixed(0)}kts`}</div>
      </div>
    </div>
  )
} 