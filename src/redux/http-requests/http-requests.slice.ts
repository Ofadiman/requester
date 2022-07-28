import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HTTP_METHODS } from '../../constants/http-methods'

export enum HTTP_REQUEST_STATUSES {
  NEW = 'NEW',
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED',
}

export type HttpRequest = {
  id: string
  name: string
  httpMethod: HTTP_METHODS
  url: string
  body: Record<string, unknown>
  path: Record<string, unknown>
  query: Record<string, unknown>
  response: any
  status: HTTP_REQUEST_STATUSES
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
    httpRequestPending: (state, action: PayloadAction<{ id: string }>) => {
      httpRequestsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: HTTP_REQUEST_STATUSES.PENDING,
        },
      })
    },
    httpRequestFulfilled: (state, action: PayloadAction<{ id: string }>) => {
      httpRequestsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: HTTP_REQUEST_STATUSES.FULFILLED,
        },
      })
    },
    httpRequestRejected: (state, action: PayloadAction<{ id: string }>) => {
      httpRequestsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: HTTP_REQUEST_STATUSES.REJECTED,
        },
      })
    },
  },
})