import { call, select } from 'typed-redux-saga'

import { Logger } from '../../../utils/logger'
import { httpRequestsAdapter, HttpRequestsChangeMethodAction } from '../http-requests.slice'
import { workspacesAdapter } from '../../workspaces/workspaces.slice'
import { RootState } from '../../store'
import { typeGuards } from '../../../utils/type-guards'

// TODO: I might be able to retrieve current workspace on the electron side from the electron store.
const currentWorkspaceSelector = (state: RootState) => {
  if (typeGuards.isNull(state.workspacesSlice.currentId)) {
    return
  }

  return workspacesAdapter
    .getSelectors()
    .selectById(state.workspacesSlice, state.workspacesSlice.currentId)
}

export function* changeHttpRequestMethodSaga(action: HttpRequestsChangeMethodAction) {
  const workspace = yield* select(currentWorkspaceSelector)
  const logger = new Logger('change http request method saga')
  logger.info('action', action)
  const httpRequest = yield* select((state: RootState) => {
    if (typeGuards.isNull(state.httpRequests.currentId)) {
      return
    }

    return httpRequestsAdapter
      .getSelectors()
      .selectById(state.httpRequests, action.payload.requestId)
  })

  if (typeGuards.isUndefined(workspace)) {
    return
  }

  if (typeGuards.isUndefined(httpRequest)) {
    return
  }

  yield* call(window.electron.changeHttpRequestMethod, {
    newMethod: action.payload.newMethod,
    requestName: httpRequest.name,
    workspacePath: workspace.path,
  })
}
