'use client'

import React from 'react'
import type { SimulationShip } from '@/types/simulation'
import { VesselType } from '@/types/simulation'

interface ShipMarkerProps {
  ship: SimulationShip
  isSelected?: boolean
}

// Constants for sizing
const SYMBOL_SIZE = 8  // Base size for the tactical symbol
const ARROW_SIZE = 12  // Size for the course arrow
const SPEED_LINE_SCALE = 0.3 // Pixels per knot for speed line

// Basic frame shapes based on vessel type
const frameShapes = {
  [VesselType.SURFACE_WARSHIP]: (size: number) => `
    M ${16 - size} ${16} 
    L ${16} ${16 - size} 
    L ${16 + size} ${16} 
    L ${16} ${16 + size} 
    Z
  `,  // Diamond for surface ships
  [VesselType.SUBMARINE]: (size: number) => `
    M ${16 - size} ${16 - size} 
    L ${16 + size} ${16 - size} 
    L ${16 + size} ${16 + size} 
    L ${16 - size} ${16 + size} 
    Z
  `,  // Square for submarines
  [VesselType.MERCHANT]: (size: number) => `
    M ${16} ${16} 
    m ${-size}, 0 
    a ${size},${size} 0 1,0 ${size * 2},0 
    a ${size},${size} 0 1,0 ${-size * 2},0
  `,   // Circle for merchants
  [VesselType.FISHING]: (size: number) => `
    M ${16} ${16} 
    m ${-size}, 0 
    a ${size},${size} 0 1,0 ${size * 2},0 
    a ${size},${size} 0 1,0 ${-size * 2},0
  `,   // Circle for fishing vessels
  [VesselType.BIOLOGIC]: (size: number) => `
    M ${16} ${16} 
    m ${-size}, 0 
    a ${size},${size} 0 1,0 ${size * 2},0 
    a ${size},${size} 0 1,0 ${-size * 2},0
  `    // Circle for biologics
}

// Ship type modifiers
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

// Course arrow helper function
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

export function ShipMarker({ ship, isSelected }: ShipMarkerProps) {
  const style = shipModifiers[ship.type] || shipModifiers[VesselType.SURFACE_WARSHIP]
  const frameShape = frameShapes[ship.type] || frameShapes[VesselType.SURFACE_WARSHIP]
  
  // Colors for normal and selected states
  const colors = {
    normal: {
      stroke: '#FFFFFF',
      fill: '#FFFFFF'
    },
    selected: {
      stroke: '#FFD700',
      fill: '#FFD700'
    }
  }
  
  const currentColors = isSelected ? colors.selected : colors.normal

  // Debug log for selection state
  console.log('ShipMarker render:', ship.name, 'selected:', isSelected, 'using colors:', currentColors)

  return (
    <div className="ship-marker relative" data-selected={isSelected}>
      {/* Main SVG for symbol */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{
          filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
          overflow: 'visible'
        }}
      >
        {/* Frame based on vessel type */}
        <path
          d={frameShape(SYMBOL_SIZE)}
          fill="none"
          stroke={currentColors.stroke}
          strokeWidth="1.5"
        />
        
        {/* Ship type modifier */}
        <path
          d={style.symbol(SYMBOL_SIZE)}
          fill="none"
          stroke={currentColors.stroke}
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
          transform: `rotate(${ship.course}deg)`,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
          overflow: 'visible'
        }}
      >
        {/* Course arrow with speed line */}
        <path
          d={getCourseArrow(ship.speed)}
          fill={currentColors.fill}
          stroke={currentColors.stroke}
          strokeWidth="0.5"
          style={{ pointerEvents: 'none' }}
        />
      </svg>

      {/* Ship name and course/speed label */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full 
                    text-xs bg-black bg-opacity-50 px-1 rounded whitespace-nowrap text-center"
           style={{ color: currentColors.fill }}>
        <div>{ship.name}</div>
        <div>{`${ship.course.toFixed(0)}°/${ship.speed.toFixed(0)}kts`}</div>
      </div>
    </div>
  )
}

// For static rendering (e.g. in drop preview)
export function ShipMarker_Static({ ship }: { ship: SimulationShip }) {
  const style = shipModifiers[ship.type] || shipModifiers[VesselType.SURFACE_WARSHIP]
  const frameShape = frameShapes[ship.type] || frameShapes[VesselType.SURFACE_WARSHIP]

  return (
    <div className="ship-marker">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <path
          d={frameShape(SYMBOL_SIZE)}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <path
          d={style.symbol(SYMBOL_SIZE)}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
} 