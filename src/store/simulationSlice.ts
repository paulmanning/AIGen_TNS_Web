import { createSlice } from '@reduxjs/toolkit'
import type { SimulationData } from '@/types/simulation'

const initialState: SimulationData | null = null

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setSimulation: (state, action) => action.payload
  }
})

export const { setSimulation } = simulationSlice.actions
export default simulationSlice.reducer 