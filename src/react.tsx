import * as React from 'react'
import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { Button, CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { SettingsView } from './settings/settings.view'
import { PokemonView } from './pokemon/pokemon.view'
import { CounterView } from './counter/counter.view'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { HomeView } from './home/home.view'
import { configureAppStore } from './redux/store'
import { MainView } from './main/main.view'

const root = ReactDOMClient.createRoot(document.getElementById('react-app'))

root.render(
  <StrictMode>
    <CssBaseline />
    <Provider store={configureAppStore({})}>
      <Button
        onClick={() => {
          void (window as any).api.resetStore()
        }}
      >
        Reset store
      </Button>
      <HashRouter>
        <Routes>
          <Route path={`/`} element={<HomeView />} />
          <Route path={`/pokemon`} element={<PokemonView />} />
          <Route path={`/settings`} element={<SettingsView />} />
          <Route path={`/counter`} element={<CounterView />} />
          <Route path={`/main`} element={<MainView />} />
        </Routes>
      </HashRouter>
    </Provider>
  </StrictMode>,
)
