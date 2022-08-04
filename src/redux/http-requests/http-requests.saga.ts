import { all, takeLatest } from 'typed-redux-saga'

import { httpRequestsSlice } from './http-requests.slice'
import { makeRequestSaga } from './sagas/make-request.saga'
import { createHttpRequestSaga } from './sagas/create-http-request.saga'
import { changeHttpRequestMethodSaga } from './sagas/change-http-request-method.saga'
import { changeHttpRequestUrlSaga } from './sagas/change-http-request-url.saga'

export function* httpRequestsSaga() {
  yield* all([
    takeLatest(httpRequestsSlice.actions.httpRequestPending.type, makeRequestSaga),
    takeLatest(httpRequestsSlice.actions.createHttpRequest.type, createHttpRequestSaga),
    takeLatest(httpRequestsSlice.actions.changeMethod.type, changeHttpRequestMethodSaga),
    takeLatest(httpRequestsSlice.actions.changeUrl.type, changeHttpRequestUrlSaga),
  ])
}
