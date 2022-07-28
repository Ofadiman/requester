import { call, put, select } from 'typed-redux-saga'
import { httpRequestsAdapter, httpRequestsSlice } from '../http-requests.slice'
import { RootState } from '../../store'
import { PayloadAction } from '@reduxjs/toolkit'
import { typeGuards } from '../../../utils/type-guards'
import { Logger } from '../../../utils/logger'

// TODO: Consider moving this selector to a separate file.
const selector = (state: RootState, id: string) =>
  httpRequestsAdapter.getSelectors().selectById(state.httpRequests, id)

export function* makeRequestSaga(action: PayloadAction<{ id: string }>) {
  const httpRequest = yield* select(selector, action.payload.id)

  if (typeGuards.isNotUndefined(httpRequest)) {
    const logger = new Logger('http request saga')
    logger.info('Http request', httpRequest)

    const response = yield* call(window.electron.makeRequest, httpRequest)
    logger.info('Response in saga', response)
    yield* put(
      httpRequestsSlice.actions.httpRequestFulfilled({
        id: action.payload.id,
        requestResult: response,
      }),
    )
  } else {
    // TODO: I want to show some kind of notification here, that something went wrong.
    yield* call(console.log, 'Http request not found')
  }
}
