import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './store'
import { SettingsView } from './settings/settings.view'
import { PokemonView } from './pokemon/pokemon.view'
import { CounterView } from './counter/counter.view'

const root = ReactDOMClient.createRoot(document.getElementById('react-app'))

root.render(
  <Provider store={store}>
    <CssBaseline />
    <CounterView />
    <PokemonView />
    <SettingsView />
  </Provider>,
)
