import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Workspace = {
  path: string
  name: string
  id: string
}

export type WorkspacesSliceState = {
  workspaces: Workspace[]
}

const INITIAL_WORKSPACES_SLICE_STATE: WorkspacesSliceState = {
  workspaces: [],
}

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState: INITIAL_WORKSPACES_SLICE_STATE,
  reducers: {
    add: (state: WorkspacesSliceState, action: PayloadAction<Workspace>) => {
      state.workspaces.push(action.payload)
    },
  },
})
