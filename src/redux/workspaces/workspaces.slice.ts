import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'

export const workspacesAdapter = createEntityAdapter<Workspace>()
const initialState = workspacesAdapter.getInitialState({
  currentId: null as string | null,
})

export const workspacesSlice = createSlice({
  initialState,
  name: 'workspacesSlice',
  reducers: {
    // TODO: Refactor the name of this reducer so that it better reflects what it really does (e.g. `createWorkspace`).
    addOne: (state, action: PayloadAction<Workspace>) => {
      workspacesAdapter.addOne(state, action.payload)
      state.currentId = action.payload.id
    },
    updateOne: workspacesAdapter.updateOne,
  },
})

export type Workspace = {
  id: string,
  name: string
  path: string
}
