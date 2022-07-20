import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type CounterState = {
  value: number
}

const INITIAL_COUNTER_SLICE_STATE: CounterState = {
  value: 0,
}

export const COUNTER_SLICE_NAME = 'counter' as const

export const counterSlice = createSlice({
  name: COUNTER_SLICE_NAME,
  initialState: INITIAL_COUNTER_SLICE_STATE,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})
