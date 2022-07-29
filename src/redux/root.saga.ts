import { all } from 'typed-redux-saga'
import { httpRequestsSaga } from './http-requests/http-requests.saga'
import { workspacesSaga } from './workspaces/workspaces.saga'

export function* rootSaga() {
  yield* all([httpRequestsSaga(), workspacesSaga()])
}
