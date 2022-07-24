import './dayjs.bootstrap'
import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { Button, CssBaseline } from '@mui/material'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { HomeView } from './home/home.view'
import { MainView } from './main/main.view'
import { Provider } from 'react-redux'
import { StrictMode } from 'react'
import { configureAppStore, RootState } from './redux/store'

const htmlRoot = document.getElementById('react-app')
if (htmlRoot === null) {
  throw new Error(`HTML element with id "react-app" not found in "index.html" file`)
}
const root = ReactDOMClient.createRoot(htmlRoot)

window.electron.initializeReduxStore().then((reduxStore: RootState) => {
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

  store.subscribe(() => {
    const currentReduxStore = store.getState()
    void window.electron.persistReduxStore(currentReduxStore)
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
            void window.electron.clearReduxStore()
          }}
        >
          Reset store
        </Button>
        <HashRouter>
          <Routes>
            <Route path={`/`} element={<HomeView />} />
            <Route path={`/main`} element={<MainView />} />
          </Routes>
        </HashRouter>
      </Provider>
    </StrictMode>,
  )
})
