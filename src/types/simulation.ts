export enum VesselType {
  SURFACE_WARSHIP = 'SURFACE_WARSHIP',
  SUBMARINE = 'SUBMARINE',
  MERCHANT = 'MERCHANT',
  FISHING = 'FISHING',
  BIOLOGIC = 'BIOLOGIC'
}

export interface SimulationData {
  id: string
  name: string
  description: string
  location: {
    center: [number, number]
    zoom: number
  }
  startTime: string
  duration: number
  vessels: {
    id: string
    position: Position
  }[]
}

export interface Position {
  coordinates: [number, number]
  heading: number
  speed: number
  depth: number
  timestamp: number
} 