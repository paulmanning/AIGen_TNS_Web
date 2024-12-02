import type { SimulationShip } from '@/types/simulation'

// Convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Convert knots to degrees per second (for position calculation)
function knotsToDegreesPerSecond(knots: number): number {
  // 1 knot = 1 nautical mile per hour
  // 1 nautical mile = 1/60 degree
  // Convert to per second
  return (knots * (1/60)) / 3600
}

// Calculate new position after time elapsed
export function calculateNewPosition(
  startLat: number,
  startLng: number,
  course: number,
  speed: number,
  elapsedSeconds: number
): { lat: number; lng: number } {
  // Convert speed from knots to degrees/second
  const speedInDegreesPerSecond = knotsToDegreesPerSecond(speed)
  
  // Calculate distance traveled in degrees
  const distance = speedInDegreesPerSecond * elapsedSeconds
  
  // Convert course to radians (adjust for 0 = North, clockwise)
  const courseRad = toRadians(90 - course)
  
  // Calculate latitude change (North/South)
  const latChange = distance * Math.sin(courseRad)
  
  // Calculate longitude change (East/West), accounting for latitude
  const avgLat = toRadians(startLat + latChange / 2) // Use average latitude for better accuracy
  const lngChange = (distance * Math.cos(courseRad)) / Math.cos(avgLat)
  
  return {
    lat: startLat + latChange,
    lng: startLng + lngChange
  }
}

// Store initial positions of ships
const initialPositions: { [key: string]: { lat: number; lng: number } } = {}

// Get ship position at a specific time
export function getShipPositionAtTime(
  ship: SimulationShip,
  elapsedSeconds: number
): { lat: number; lng: number } {
  // Store initial position if not already stored
  if (!initialPositions[ship.id]) {
    initialPositions[ship.id] = { ...ship.position }
  }

  // Use initial position for calculation
  return calculateNewPosition(
    initialPositions[ship.id].lat,
    initialPositions[ship.id].lng,
    ship.course,
    ship.speed,
    elapsedSeconds
  )
}

// Generate trail points for a ship's path
export function generateShipTrail(
  ship: SimulationShip,
  totalSeconds: number,
  numPoints: number = 10
): Array<[number, number]> {
  const trail: Array<[number, number]> = []
  const interval = totalSeconds / (numPoints - 1)
  
  // Ensure we have the initial position
  if (!initialPositions[ship.id]) {
    initialPositions[ship.id] = { ...ship.position }
  }
  
  for (let i = 0; i < numPoints; i++) {
    const position = getShipPositionAtTime(ship, i * interval)
    trail.push([position.lng, position.lat])
  }
  
  return trail
}

// Reset initial positions (call this when returning to setup mode or restarting)
export function resetInitialPositions(): void {
  Object.keys(initialPositions).forEach(key => {
    delete initialPositions[key]
  })
} 