import { all, takeLatest } from 'typed-redux-saga'
import { httpRequestsSlice } from './http-requests.slice'
import { makeRequestSaga } from './sagas/make-request.saga'

export function* httpRequestsSaga() {
  yield* all([takeLatest(httpRequestsSlice.actions.httpRequestPending.type, makeRequestSaga)])
}
