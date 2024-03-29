import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import {
  persistReducer,
  Storage,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import { httpRequestsSlice } from './http-requests/http-requests.slice'
import { workspacesSlice } from './workspaces/workspaces.slice'

export type RootState = ReturnType<typeof rootReducer>
const rootReducer = combineReducers({
  [workspacesSlice.name]: workspacesSlice.reducer,
  [httpRequestsSlice.name]: httpRequestsSlice.reducer,
})

export class ReduxPersistElectronStorage implements Storage {
  public async getItem(key: string): Promise<void> {
    return window.electron.electronStoreGetItem(key)
  }

  public async setItem(key: string, value: unknown) {
    await window.electron.electronStoreSetItem(key, value)
  }

  public async removeItem(key: string) {
    await window.electron.electronStoreRemoveItem(key)
  }
}

const persistedReducer = persistReducer(
  {
    key: 'root-reducer',
    storage: new ReduxPersistElectronStorage(),
    version: 1,
  },
  rootReducer,
)

// TODO: Check which middlewares and enhancers I can use to improve the application or developer experience.
export const configureAppStore = () => {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        // I want to use `redux-saga` library to handle asynchronous actions in the application so I disabled `redux-thunk` which does the same thing.
        thunk: false,
      }),
      sagaMiddleware,
    ],
    reducer: persistedReducer,
  })

  // TODO: Hot module replacement is not working for unknown reasons.
  // if (process.env.NODE_ENV === 'development' && module.hot) {
  //   module.hot.accept('./root.reducer', () => store.replaceReducer(rootReducer))
  // }

  return { sagaMiddleware, store }
}

type TypedSelector = TypedUseSelectorHook<RootState>
export const useTypedSelector: TypedSelector = useSelector
