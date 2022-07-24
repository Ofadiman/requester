import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

export const workspacesAdapter = createEntityAdapter<Workspace>()
const initialState = workspacesAdapter.getInitialState()

export const workspacesSlice = createSlice({
  name: 'workspacesSlice',
  initialState,
  reducers: {
    addOne: workspacesAdapter.addOne,
    updateOne: workspacesAdapter.updateOne,
  },
})

export type Workspace = {
  path: string
  name: string
  id: string
}

export type WorkspaceSliceState = typeof initialState
