import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Button from '@mui/material/Button'
import { CssBaseline } from '@mui/material'
import { Fragment } from 'react'

function render() {
  ReactDOM.render(
    <Fragment>
      <CssBaseline />
      <Button>Install Material UI!</Button>
    </Fragment>,
    document.body,
  )
}

render()
