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
        ships: action.payload.ships?.map(ship => ({
          ...ship,
          position: { ...ship.position },
          characteristics: { ...ship.characteristics },
          acousticSignatures: [...(ship.acousticSignatures || [])]
        })) || [],
        location: {
          center: [
            Number(action.payload.location.center[0].toFixed(4)),
            Number(action.payload.location.center[1].toFixed(4))
          ] as [number, number],
          zoom: Number(action.payload.location.zoom.toFixed(2))
        }
      }
    }
  }
})

export const { setSimulation } = simulationSlice.actions
export default simulationSlice.reducer 