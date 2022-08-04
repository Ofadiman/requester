import { PayloadAction } from '@reduxjs/toolkit'
import { call, select } from 'typed-redux-saga'

import { Logger } from '../../../utils/logger'
import { HttpRequest } from '../http-requests.slice'
import { workspacesAdapter } from '../../workspaces/workspaces.slice'
import { RootState } from '../../store'
import { typeGuards } from '../../../utils/type-guards'

const currentWorkspaceSelector = (state: RootState) => {
  if (typeGuards.isNull(state.workspacesSlice.currentId)) {
    return
  }

  return workspacesAdapter
    .getSelectors()
    .selectById(state.workspacesSlice, state.workspacesSlice.currentId)
}

export function* createHttpRequestSaga(action: PayloadAction<HttpRequest>) {
  const workspace = yield* select(currentWorkspaceSelector)
  const logger = new Logger('create http request saga')
  logger.info('http request', action.payload)

  if (typeGuards.isUndefined(workspace)) {
    return
  }

  yield* call(window.electron.createHttpRequestFile, { httpRequest: action.payload, workspace })
}
