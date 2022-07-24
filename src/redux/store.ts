import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { pokemonApi } from '../pokemon/pokemon.api'
import { counterSlice } from '../counter/counter.slice'
import { workspacesSlice } from './workspaces/workspaces.slice'

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
