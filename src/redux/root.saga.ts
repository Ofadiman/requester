import { all } from 'typed-redux-saga'
import { httpRequestsSaga } from './http-requests/http-requests.saga'

export function* rootSaga() {
  yield* all([httpRequestsSaga()])
}
