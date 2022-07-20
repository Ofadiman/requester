import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './store'
import { CounterView } from './counter/counter.view'

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <CssBaseline />
      <CounterView />
    </Provider>,
    document.body,
  )
}

render()
