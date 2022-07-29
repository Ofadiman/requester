import { all, takeLatest } from 'typed-redux-saga'
import { workspacesSlice } from './workspaces.slice'
import { createWorkspaceDirectorySaga } from './sagas/create-workspace-directory.saga'

export function* workspacesSaga() {
  yield* all([takeLatest(workspacesSlice.actions.addOne.type, createWorkspaceDirectorySaga)])
}
