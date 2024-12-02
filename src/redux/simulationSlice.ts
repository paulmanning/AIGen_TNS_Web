import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { SimulationShip } from '@/types/simulation'

export interface SimulationState {
  isRunning: boolean
  isPaused: boolean
  ships: SimulationShip[]
}

const initialState: SimulationState = {
  isRunning: false,
  isPaused: false,
  ships: []
}

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload
    },
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload
    },
    setShips: (state, action: PayloadAction<SimulationShip[]>) => {
      state.ships = action.payload
    },
    addShip: (state, action: PayloadAction<SimulationShip>) => {
      state.ships.push(action.payload)
    }
  }
})

export const { setRunning, setPaused, setShips, addShip } = simulationSlice.actions
export default simulationSlice.reducer 