import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { SimulationData } from '@/types/simulation'

interface SimulationState {
  data: SimulationData | null
}

const initialState: SimulationState = {
  data: null
}

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setSimulation: (state, action: PayloadAction<SimulationData | null>) => {
      if (action.payload === null) {
        state.data = null
        return
      }
      
      state.data = {
        ...action.payload,
        ships: [...(action.payload.ships || [])]
      }
    }
  }
})

export const { setSimulation } = simulationSlice.actions
export default simulationSlice.reducer 