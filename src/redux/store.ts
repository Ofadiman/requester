import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { workspacesSlice } from './workspaces/workspaces.slice'

export type RootState = ReturnType<typeof rootReducer>
const rootReducer = combineReducers({
  [workspacesSlice.name]: workspacesSlice.reducer,
})

// TODO: Check which middlewares and enhancers I can use to improve the application or developer experience.
export const configureAppStore = (preloadedState: RootState) => {
  // TODO: Preload state on application initialization.
  const store = configureStore({
    reducer: rootReducer,
    // TODO: I cannot simply pass `preloadedState` here because state inferred from root reducer and state expected by the `preloadedState` key have some different properties that are presumably used for type inference.
    preloadedState: {
      workspacesSlice: preloadedState.workspacesSlice,
    },
  })

  // TODO: Hot module replacement is not working for unknown reasons.
  // if (process.env.NODE_ENV === 'development' && module.hot) {
  //   module.hot.accept('./root.reducer', () => store.replaceReducer(rootReducer))
  // }

  return store
}

type TypedSelector = TypedUseSelectorHook<RootState>
export const useTypedSelector: TypedSelector = useSelector
