import { configureStore } from '@reduxjs/toolkit'
import { COUNTER_SLICE_NAME, counterSlice } from './counter/counter.slice'

export const store = configureStore({
  reducer: {
    [COUNTER_SLICE_NAME]: counterSlice.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch