import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'

import { HTTP_METHODS } from '../../enums/http-methods'

export enum HTTP_REQUEST_STATUSES {
  NEW = 'NEW',
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED',
}

export type JsonObject = {
  [Key: string]:
    | string
    | number
    | boolean
    | null
    | JsonObject
    | Array<string | number | boolean | null | JsonObject | Array<JsonObject>>
}

export type JsonArray = Array<string | number | boolean | null | JsonObject | Array<JsonObject>>

/**
 * This type corresponds to what the value of a JSON object sent over the network might look like.
 */
export type Json = JsonObject | JsonArray

export type HttpRequest = {
  body: Json
  headers: Record<string, string>
  httpMethod: HTTP_METHODS
  id: string
  name: string
  pathParameters: Record<string, string>
  queryParameters: Record<string, string>
  requestResult: Pick<AxiosResponse, 'data' | 'status' | 'headers'>
  status: HTTP_REQUEST_STATUSES
  url: string
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
  queryParameters: HttpRequest['queryParameters']
  pathParameters: HttpRequest['pathParameters']
  headers: HttpRequest['headers']
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
          queryParameters: action.payload.queryParameters,
          pathParameters: action.payload.pathParameters,
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
