import * as React from 'react'
import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { Button, CssBaseline } from '@mui/material'
import { Provider } from 'react-redux'
import { SettingsView } from './settings/settings.view'
import { PokemonView } from './pokemon/pokemon.view'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { HomeView } from './home/home.view'
import { configureAppStore, RootState } from './redux/store'
import { MainView } from './main/main.view'

const root = ReactDOMClient.createRoot(document.getElementById('react-app'))

// TODO: Figure out a way to safely type properties exposed via preload script.
declare global {
  interface Window {
    api: any
  }
}

// 1. Nie renderuj nic do momentu, aż store nie będzie załadowany z file systemu.
// 2. Na uruchomienie aplikacji wyślij

window.api.initializeReduxStore().then((reduxStore: RootState) => {
  console.log(
    '\x1b[33m\x1b[40m%s\x1b[0m',
    `\n===== [DEBUG] ===== Initialized redux store from electron ===== [DEBUG] =====`,
  )
  console.log(reduxStore)
  console.log(
    '\x1b[33m\x1b[40m%s\x1b[0m',
    `===== [DEBUG] ===== Initialized redux store from electron ===== [DEBUG] =====\n`,
  )

  const store = configureAppStore(reduxStore)

  const _unsubscribe = store.subscribe(() => {
    const currentReduxStore = store.getState()
    window.api.persistReduxStore(currentReduxStore)
    console.log(
      '\x1b[33m\x1b[40m%s\x1b[0m',
      `\n===== [DEBUG] ===== Debugging changed redux state ===== [DEBUG] =====`,
    )
    console.log(currentReduxStore)
    console.log(
      '\x1b[33m\x1b[40m%s\x1b[0m',
      `===== [DEBUG] ===== Debugging changed redux state ===== [DEBUG] =====\n`,
    )
  })

  root.render(
    <StrictMode>
      <CssBaseline />
      <Provider store={store}>
        <Button
          onClick={() => {
            window.api.resetStore()
          }}
        >
          Reset store
        </Button>
        <HashRouter>
          <Routes>
            <Route path={`/`} element={<HomeView />} />
            <Route path={`/pokemon`} element={<PokemonView />} />
            <Route path={`/settings`} element={<SettingsView />} />
            <Route path={`/main`} element={<MainView />} />
          </Routes>
        </HashRouter>
      </Provider>
    </StrictMode>,
  )
})
