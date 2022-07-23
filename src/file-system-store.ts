import Store from 'electron-store'
import { append } from 'ramda'
import { uuidFactory } from './utils/uuid.factory'

const WINDOW_SIZE_KEY = 'WINDOW_SIZE_KEY' as const

// TODO: Add generic typings to store.
const store = new Store()

const DEFAULT_WINDOW_SIZE: WindowSize = {
  width: 1600,
  height: 900,
}

export type WindowSize = {
  width: number
  height: number
}

export const getWindowSize = (): WindowSize => {
  const storedWindowSize = store.get(WINDOW_SIZE_KEY)

  if (storedWindowSize) {
    console.log(`Loaded window size from file system.`)

    // TODO: Remove casting and add error handling for a scenario when local state is corrupted.
    return storedWindowSize as WindowSize
  }

  console.info(`Window size is not present in file system. Persisting default window size.`)
  store.set(WINDOW_SIZE_KEY, DEFAULT_WINDOW_SIZE)

  return DEFAULT_WINDOW_SIZE
}

export const setWindowSize = (size: WindowSize): void => {
  console.log(
    `Persisting new window size to file system. New width: ${size.width}, new height: ${size.height}.`,
  )
  store.set(WINDOW_SIZE_KEY, size)
}

export type Workspace = {
  name: string
  id: string
}

const WORKSPACES_KEY = `WORKSPACES_KEY`

export const addWorkspace = (name: string): Workspace[] => {
  // TODO: Remove unsafe casting.
  const workspaces: Workspace[] =
    (store.get(WORKSPACES_KEY) as Workspace[] | undefined) ?? ([] as Workspace[])

  const newWorkspaces = append({ id: uuidFactory.generateVersion4(), name })(workspaces)

  store.set(WORKSPACES_KEY, newWorkspaces)

  return newWorkspaces
}
