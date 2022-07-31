import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HTTP_METHODS } from '../../constants/http-methods'
import { AxiosResponse } from 'axios'

export enum HTTP_REQUEST_STATUSES {
  NEW = 'NEW',
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED',
}

// TODO: `path` and `query` are out of sync with whatever is stored in configuration files. Rename them to `queryParameters` and `pathParameters` respectively.
export type HttpRequest = {
  id: string
  name: string
  httpMethod: HTTP_METHODS
  url: string
  body: Record<string, unknown>
  path: Record<string, unknown>
  query: Record<string, unknown>
  requestResult: Pick<AxiosResponse, 'data' | 'status' | 'headers'>
  status: HTTP_REQUEST_STATUSES
}

export const httpRequestsAdapter = createEntityAdapter<HttpRequest>()

const initialState = httpRequestsAdapter.getInitialState({
  currentId: null as string | null,
})

export type HttpRequestsChangeMethodAction = PayloadAction<{
  newMethod: HTTP_METHODS
  requestId: string
}>

export type HttpRequestsChangeUrlAction = PayloadAction<{ newUrl: string; requestId: string }>

export type HttpRequestsSynchronizeAction = PayloadAction<{
  meta: {
    id: string
    type: string
    url: string
  }
  body: HttpRequest['body']
  queryParameters: HttpRequest['query']
  pathParameters: HttpRequest['path']
  // TODO: Headers are missing from HTTP request configuration.
  headers: unknown
}>

export const httpRequestsSlice = createSlice({
  name: 'httpRequests',
  initialState,
  reducers: {
    synchronizeFs: (state, action: HttpRequestsSynchronizeAction) => {
      httpRequestsAdapter.updateOne(state, {
        id: action.payload.meta.id,
        changes: {
          url: action.payload.meta.url,
          query: action.payload.queryParameters,
          path: action.payload.pathParameters,
          body: action.payload.body,
          httpMethod: action.payload.meta.type as HTTP_METHODS,
        },
      })
    },
    changeUrl: (state, action: HttpRequestsChangeUrlAction) => {
      httpRequestsAdapter.updateOne(state, {
        id: action.payload.requestId,
        changes: {
          url: action.payload.newUrl,
        },
      })
    },
    changeMethod: (state, action: HttpRequestsChangeMethodAction) => {
      httpRequestsAdapter.updateOne(state, {
        id: action.payload.requestId,
        changes: {
          httpMethod: action.payload.newMethod,
        },
      })
    },
    createHttpRequest: (state, action: PayloadAction<HttpRequest>) => {
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
    httpRequestFulfilled: (
      state,
      action: PayloadAction<{
        id: string
        requestResult: HttpRequest['requestResult']
      }>,
    ) => {
      httpRequestsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: HTTP_REQUEST_STATUSES.FULFILLED,
          requestResult: action.payload.requestResult,
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
    changeCurrentRequest: (state, action: PayloadAction<{ id: string }>) => {
      state.currentId = action.payload.id
    },
  },
})
