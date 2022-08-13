import './dayjs.bootstrap'
import * as React from 'react'
import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { CreateWorkspaceView } from './views/create-workspace/create-workspace.view'
import { HttpRequestsView } from './views/http-requests/http-requests.view'
import { configureAppStore } from './redux/store'
import { IpcRegistrator } from './containers/ipc-registrator/ipc-registrator.container'
import { rootSaga } from './redux/root.saga'
import { EnvironmentsView } from './views/environments/environments.view'
import { TopSideMenuLayout } from './layouts/top-side-menu.layout'
import { LeftSideMenuLayout } from './layouts/left-side-menu.layout'

const htmlRoot = document.getElementById('react-app')
if (htmlRoot === null) {
  throw new Error(`HTML element with id "react-app" not found in "index.html" file.`)
}
const root = ReactDOMClient.createRoot(htmlRoot)

const { store, sagaMiddleware } = configureAppStore()
const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

root.render(
  <StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MemoryRouter initialEntries={['/create-workspace']}>
          <IpcRegistrator />
          <Routes>
            <Route path="/create-workspace" element={<CreateWorkspaceView />} />
            <Route
              path="/http-requests"
              element={
                <TopSideMenuLayout>
                  <LeftSideMenuLayout>
                    <HttpRequestsView />
                  </LeftSideMenuLayout>
                </TopSideMenuLayout>
              }
            />
            <Route
              path="/environments"
              element={
                <TopSideMenuLayout>
                  <LeftSideMenuLayout>
                    <EnvironmentsView />
                  </LeftSideMenuLayout>
                </TopSideMenuLayout>
              }
            />
          </Routes>
        </MemoryRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
