import type { ShipData } from '@/data/ships'

export enum VesselType {
  SURFACE_WARSHIP = 'SURFACE_WARSHIP',
  SUBMARINE = 'SUBMARINE',
  MERCHANT = 'MERCHANT',
  FISHING = 'FISHING',
  BIOLOGIC = 'BIOLOGIC'
}

export interface SimulationShip extends ShipData {
  position: {
    lat: number
    lng: number
  }
  course: number  // in degrees, 0 = North, 90 = East, etc.
  speed: number   // in knots
  depth: number   // in meters, 0 = surface
}

export interface SimulationData {
  id: string
  name: string
  startTime?: string
  location: {
    center: [number, number]
    zoom: number
  }
  ships?: SimulationShip[]
} 