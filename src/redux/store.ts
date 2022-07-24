import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { pokemonApi } from '../pokemon/pokemon.api'
import { counterSlice } from '../counter/counter.slice'
import { workspacesSlice } from './workspaces/workspaces.slice'
import rootReducer from './root.reducer'

// TODO: Check which middlewares and enhancers I can use to improve the application or developer experience.
// TODO: Fix typing on preloadedState.
export const configureAppStore = (preloadedState: unknown) => {
  const store = configureStore({
    reducer: rootReducer,
  })

  // TODO: Hot module replacement is not working for unknown reasons.
  // if (process.env.NODE_ENV === 'development' && module.hot) {
  //   module.hot.accept('./root.reducer', () => store.replaceReducer(rootReducer))
  // }

  return store
}

export const store = configureStore({
  reducer: {
    [counterSlice.name]: counterSlice.reducer,
    [workspacesSlice.name]: workspacesSlice.reducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
})

setupListeners(store.dispatch)

type TypedDispatch = () => typeof store.dispatch
export const useTypedDispatch: TypedDispatch = useDispatch

type TypedSelector = TypedUseSelectorHook<ReturnType<typeof store.getState>>
export const useTypedSelector: TypedSelector = useSelector
