import { call } from 'typed-redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'

import { Logger } from '../../../utils/logger'
import { Workspace } from '../workspaces.slice'

// TODO: Refactor this saga to handle the case where a workspace in the selected folder already exists.
export function* createWorkspaceDirectorySaga(action: PayloadAction<Workspace>) {
  const logger = new Logger('create workspace directory saga')
  logger.info('workspace', action.payload)

  yield* call(window.electron.createWorkspaceDirectory, action.payload)
}
