import React, { ReactElement } from 'react'
import { Button } from '@mui/material'
import { counterSlice } from './counter.slice'
import { useTypedDispatch, useTypedSelector } from '../store'

export const CounterView = (): ReactElement => {
  const count = useTypedSelector((state) => state.counter.value)
  const dispatch = useTypedDispatch()

  return (
    <div>
      <div>
        <Button onClick={() => dispatch(counterSlice.actions.decrement())}>Decrement</Button>
        <span>{count}</span>
        <Button onClick={() => dispatch(counterSlice.actions.increment())}>Increment</Button>
      </div>
    </div>
  )
}
