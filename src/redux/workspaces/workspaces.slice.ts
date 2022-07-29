import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'

export const workspacesAdapter = createEntityAdapter<Workspace>()
const initialState = workspacesAdapter.getInitialState({
  currentId: null as string | null,
})

export const workspacesSlice = createSlice({
  name: 'workspacesSlice',
  initialState,
  reducers: {
    addOne: (state, action: PayloadAction<Workspace>) => {
      workspacesAdapter.addOne(state, action.payload)
      state.currentId = action.payload.id
    },
    updateOne: workspacesAdapter.updateOne,
  },
})

export type Workspace = {
  path: string
  name: string
  id: string
}

export type WorkspaceSliceState = typeof initialState
