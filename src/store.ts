import { configureStore } from '@reduxjs/toolkit'
import { COUNTER_SLICE_NAME, counterSlice } from './counter/counter.slice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    [COUNTER_SLICE_NAME]: counterSlice.reducer,
  },
})

type TypedDispatch = () => typeof store.dispatch
export const useTypedDispatch: TypedDispatch = useDispatch

type TypedSelector = TypedUseSelectorHook<ReturnType<typeof store.getState>>
export const useTypedSelector: TypedSelector = useSelector
