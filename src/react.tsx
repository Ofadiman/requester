import * as React from 'react'
import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './store'
import { SettingsView } from './settings/settings.view'
import { PokemonView } from './pokemon/pokemon.view'
import { CounterView } from './counter/counter.view'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { HomeView } from './home/home.view'

const root = ReactDOMClient.createRoot(document.getElementById('react-app'))

root.render(
  <StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path={`/`} element={<HomeView />} />
          <Route path={`/pokemon`} element={<PokemonView />} />
          <Route path={`/settings`} element={<SettingsView />} />
          <Route path={`/counter`} element={<CounterView />} />
        </Routes>
      </HashRouter>
    </Provider>
  </StrictMode>,
)