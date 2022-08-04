import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'

import { HTTP_METHODS } from '../../enums/http-methods'

export enum HTTP_REQUEST_STATUSES {
  FULFILLED = 'FULFILLED',
  NEW = 'NEW',
  PENDING = 'PENDING',
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
  body: HttpRequest['body'],
  headers: HttpRequest['headers'],
  meta: {
    id: string
    type: string
    url: string
  },
  pathParameters: HttpRequest['pathParameters']
  queryParameters: HttpRequest['queryParameters']
}>

export const httpRequestsSlice = createSlice({
  initialState,
  name: 'httpRequests',
  reducers: {
    changeCurrentRequest: (state, action: PayloadAction<{ id: string }>) => {
      state.currentId = action.payload.id
    },
    changeMethod: (state, action: HttpRequestsChangeMethodAction) => {
      httpRequestsAdapter.updateOne(state, {
        changes: {
          httpMethod: action.payload.newMethod,
        },
        id: action.payload.requestId,
      })
    },
    changeUrl: (state, action: HttpRequestsChangeUrlAction) => {
      httpRequestsAdapter.updateOne(state, {
        changes: {
          url: action.payload.newUrl,
        },
        id: action.payload.requestId,
      })
    },
    createHttpRequest: (state, action: PayloadAction<HttpRequest>) => {
      httpRequestsAdapter.addOne(state, action)
      state.currentId = action.payload.id
    },
    httpRequestFulfilled: (
      state,
      action: PayloadAction<{
        id: string
        requestResult: HttpRequest['requestResult']
      }>,
    ) => {
      httpRequestsAdapter.updateOne(state, {
        changes: {
          requestResult: action.payload.requestResult,
          status: HTTP_REQUEST_STATUSES.FULFILLED,
        },
        id: action.payload.id,
      })
    },
    httpRequestPending: (state, action: PayloadAction<{ id: string }>) => {
      httpRequestsAdapter.updateOne(state, {
        changes: {
          status: HTTP_REQUEST_STATUSES.PENDING,
        },
        id: action.payload.id,
      })
    },
    httpRequestRejected: (state, action: PayloadAction<{ id: string }>) => {
      httpRequestsAdapter.updateOne(state, {
        changes: {
          status: HTTP_REQUEST_STATUSES.REJECTED,
        },
        id: action.payload.id,
      })
    },
    synchronizeFs: (state, action: HttpRequestsSynchronizeAction) => {
      httpRequestsAdapter.updateOne(state, {
        changes: {
          body: action.payload.body,
          httpMethod: action.payload.meta.type as HTTP_METHODS,
          pathParameters: action.payload.pathParameters,
          queryParameters: action.payload.queryParameters,
          url: action.payload.meta.url,
        },
        id: action.payload.meta.id,
      })
    },
  },
})
