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