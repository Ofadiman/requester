import './dayjs.bootstrap'
import * as React from 'react'
import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { HomeView } from './views/create-workspace/create-workspace.view'
import { HttpRequestsView } from './views/http-requests/http-requests.view'
import { Provider } from 'react-redux'
import { configureAppStore, RootState } from './redux/store'
import { IpcRegistrator } from './containers/ipc-registrator/ipc-registrator.container'
import { Logger } from './utils/logger'

const logger = new Logger('renderer')

const htmlRoot = document.getElementById('react-app')
if (htmlRoot === null) {
  throw new Error(`HTML element with id "react-app" not found in "index.html" file.`)
}
const root = ReactDOMClient.createRoot(htmlRoot)

window.electron.initializeReduxStore().then((reduxStore: RootState | undefined) => {
  logger.info(`Redux store`, reduxStore)

  const store = configureAppStore(reduxStore)

  store.subscribe(() => {
    const currentReduxStore = store.getState()
    void window.electron.persistReduxStore(currentReduxStore)

    logger.info(
      `This is the redux store immediately after an action is handled by a reducer.`,
      currentReduxStore,
    )
  })

  root.render(
    <StrictMode>
      <CssBaseline />
      <Provider store={store}>
        <HashRouter>
          <IpcRegistrator />
          <Routes>
            <Route path={`/`} element={<HomeView />} />
            <Route path={`/main`} element={<HttpRequestsView />} />
          </Routes>
        </HashRouter>
      </Provider>
    </StrictMode>,
  )
})
