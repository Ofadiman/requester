import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { workspacesSlice } from './workspaces/workspaces.slice'
import { httpRequestsSlice } from './requests/requests.slice'

export type RootState = ReturnType<typeof rootReducer>
const rootReducer = combineReducers({
  [workspacesSlice.name]: workspacesSlice.reducer,
  [httpRequestsSlice.name]: httpRequestsSlice.reducer,
})

// TODO: Check which middlewares and enhancers I can use to improve the application or developer experience.
export const configureAppStore = (preloadedState: RootState | undefined) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState ?? {},
  })

  // TODO: Hot module replacement is not working for unknown reasons.
  // if (process.env.NODE_ENV === 'development' && module.hot) {
  //   module.hot.accept('./root.reducer', () => store.replaceReducer(rootReducer))
  // }

  return store
}

type TypedSelector = TypedUseSelectorHook<RootState>
export const useTypedSelector: TypedSelector = useSelector
