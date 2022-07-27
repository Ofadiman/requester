import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HTTP_METHODS } from '../../constants/http-methods'

export type HttpRequest = {
  id: string
  name: string
  httpMethod: HTTP_METHODS
  url: string
  body: Record<string, unknown>
  path: Record<string, unknown>
  query: Record<string, unknown>
}

export const httpRequestsAdapter = createEntityAdapter<HttpRequest>()

const initialState = httpRequestsAdapter.getInitialState({
  currentId: null as string | null,
})

export const httpRequestsSlice = createSlice({
  name: 'httpRequests',
  initialState,
  reducers: {
    addOne: (state, action: PayloadAction<HttpRequest>) => {
      httpRequestsAdapter.addOne(state, action)
      state.currentId = action.payload.id
    },
  },
})
