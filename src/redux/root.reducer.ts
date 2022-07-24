import { combineReducers } from '@reduxjs/toolkit'
import { workspacesSlice } from './workspaces/workspaces.slice'

const rootReducer = combineReducers({
  [workspacesSlice.name]: workspacesSlice.reducer,
})

// TODO: Confirm that exporting as `default` or `const` makes any difference in case of hot module replacement feature from webpack (HMR).
export default rootReducer
