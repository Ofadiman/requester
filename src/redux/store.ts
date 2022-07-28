import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { workspacesSlice } from './workspaces/workspaces.slice'
import { httpRequestsSlice } from './http-requests/http-requests.slice'
import { default as createSagaMiddleware } from 'redux-saga'

export type RootState = ReturnType<typeof rootReducer>
const rootReducer = combineReducers({
  [workspacesSlice.name]: workspacesSlice.reducer,
  [httpRequestsSlice.name]: httpRequestsSlice.reducer,
})

// TODO: Check which middlewares and enhancers I can use to improve the application or developer experience.
export const configureAppStore = (preloadedState: RootState | undefined) => {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState ?? {},
    middleware: (getDefaultMiddleware) => {
      return [
        ...getDefaultMiddleware({
          // I want to use `redux-saga` library to handle asynchronous actions in the application so I disabled `redux-thunk` which does the same thing.
          thunk: false,
        }),
        sagaMiddleware,
      ]
    },
  })

  // TODO: Hot module replacement is not working for unknown reasons.
  // if (process.env.NODE_ENV === 'development' && module.hot) {
  //   module.hot.accept('./root.reducer', () => store.replaceReducer(rootReducer))
  // }

  return { store, sagaMiddleware }
}

type TypedSelector = TypedUseSelectorHook<RootState>
export const useTypedSelector: TypedSelector = useSelector
