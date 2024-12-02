import type { ShipData } from '@/data/ships'

export enum VesselType {
  SURFACE_WARSHIP = 'SURFACE_WARSHIP',
  SUBMARINE = 'SUBMARINE',
  MERCHANT = 'MERCHANT',
  FISHING = 'FISHING',
  BIOLOGIC = 'BIOLOGIC'
}

export interface SimulationShip extends ShipData {
  id: string
  position: {
    lat: number
    lng: number
  }
  course: number
  speed: number
  depth?: number
  waypoints: Array<{
    lat: number
    lng: number
    speed?: number
  }>
}

export interface SimulationData {
  id: string
  name: string
  startTime: string      // ISO date string
  duration: number       // in seconds
  location: {
    center: [number, number]
    zoom: number
  }
  ships?: SimulationShip[]
} 