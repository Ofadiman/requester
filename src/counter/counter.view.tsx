import React, { ReactElement } from 'react'
import { Button } from '@mui/material'
import { AppDispatch, RootState } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import { counterSlice } from './counter.slice'

export const CounterView = (): ReactElement => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div>
      <div>
        <Button onClick={() => dispatch(counterSlice.actions.increment())}>Increment</Button>
        <span>{count}</span>
        <Button onClick={() => dispatch(counterSlice.actions.decrement())}>Decrement</Button>
      </div>
    </div>
  )
}
