import { AxiosResponse } from 'axios'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

import { CHANNELS } from './enums/channels'
import { Workspace } from './redux/workspaces/workspaces.slice'
import { HttpRequest } from './redux/http-requests/http-requests.slice'
import { HTTP_METHODS } from './enums/http-methods'

/**
 * This script will be run in the context of the renderer process and will be executed before the web content starts loading.
 * Here, I can access APIs from Node.js and should declare all the functions that the renderer process will be able to call via `window` object to communicate with the main process (this is called `Inter-Process Communication` and works a bit like a REST API).
 *
 * There are a few ways of communication between main process and renderer process:
 * 1. The combination of `ipcRenderer.send` and `ipcMain.on` allows a one-way communication initiated from the renderer process and handled by the main process. In this case, the renderer process does not wait nor receive replies from the main process. (https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-1-renderer-to-main-one-way)
 * 2. The combination of `ipcRenderer.invoke` and `ipcMain.handle` allows a two-way communication initiated by the renderer process and handled by the main process. In this case, the renderer process DOES wait for replies from the main process. (https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way)
 * 3. The combination of `someWindow.webContents.send` and `ipcRenderer.on` allows a one-way communication initiated from the main process and handled by the renderer process. Optionally, it is possible to send a reply to the main process (via the `event.sender.send` API) and handle it via `ipcMain.on` API. (https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-3-main-to-renderer)
 */

const PRELOADED = {
  changeHttpRequestMethod: async (args: {
    newMethod: HTTP_METHODS
    requestName: string
    workspacePath: string
  }): Promise<void> => ipcRenderer.invoke(CHANNELS.HTTP_REQUESTS_CHANGE_METHOD, args),

  changeHttpRequestUrl: async (args: {
    newUrl: string
    requestName: string
    workspacePath: string
  }): Promise<void> => ipcRenderer.invoke(CHANNELS.HTTP_REQUESTS_CHANGE_URL, args),
  checkIfWorkspaceDirectoryExits: async (path: string): Promise<boolean> =>
    ipcRenderer.invoke(CHANNELS.CHECK_IF_WORKSPACE_DIRECTORY_EXISTS, path),
  // TODO: I would probably prefer to use `persistor` object to reset redux store state from the main process.
  clearReduxStore: async () => ipcRenderer.invoke(CHANNELS.REDUX_STORE_CLEAR),
  createHttpRequestFile: async (args: CreateHttpRequestFileArgs): Promise<void> =>
    ipcRenderer.invoke(CHANNELS.HTTP_REQUESTS_CREATE, args),
  createWorkspaceDirectory: async (args: Workspace): Promise<void> =>
    ipcRenderer.invoke(CHANNELS.WORKSPACES_CREATE_DIRECTORY, args),
  electronStoreGetItem: async (key: string) =>
    ipcRenderer.invoke(CHANNELS.ELECTRON_STORE_GET_ITEM, key),
  electronStoreRemoveItem: async (key: string) => {
    await ipcRenderer.send(CHANNELS.ELECTRON_STORE_REMOVE_ITEM, key)
  },
  electronStoreSetItem: async (key: string, value: unknown) => {
    await ipcRenderer.send(CHANNELS.ELECTRON_STORE_SET_ITEM, key, value)
  },
  generateEncryptionKey: async () => ipcRenderer.invoke(CHANNELS.CRYPTO_GENERATE_ENCRYPTION_KEY),
  makeRequest: async (args: unknown): Promise<Pick<AxiosResponse, 'data' | 'status' | 'headers'>> =>
    ipcRenderer.invoke(CHANNELS.HTTP_MAKE_REQUEST, args),
  openDirectoryPicker: async () => ipcRenderer.invoke(CHANNELS.DIRECTORY_PICKER_OPEN),
  registerIpcMainEventHandler: (
    channel: CHANNELS,
    callback: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.on(channel, callback)
  },
  removeIpcMainEventHandler: (
    channel: CHANNELS,
    callback: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.removeListener(channel, callback)
  },
} as const

export type CreateHttpRequestFileArgs = { httpRequest: HttpRequest; workspace: Workspace }

// I can't declare a constant (eg. `const EXPOSED_KEY = 'electron'`) and use it for typing the API in the window object, because the editor doesn't show autocomplete for preloaded functions.
contextBridge.exposeInMainWorld('electron', PRELOADED)

declare global {
  interface Window {
    electron: typeof PRELOADED
  }
}
