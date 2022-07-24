import { contextBridge, ipcRenderer } from 'electron'
import { CONTEXT_BRIDGE_EVENT_NAMES } from './context-bridge-event-names'
import { Workspace } from './redux/workspaces/workspaces.slice'
import { RootState } from './redux/store'

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
  initializeReduxStore: async () => {
    return ipcRenderer.invoke(CONTEXT_BRIDGE_EVENT_NAMES.INITIALIZE_REDUX_STORE)
  },
  openDirectoryPicker: async () => {
    return ipcRenderer.invoke(CONTEXT_BRIDGE_EVENT_NAMES.OPEN_DIRECTORY_PICKER)
  },
  resetStore: async () => {
    return ipcRenderer.invoke(CONTEXT_BRIDGE_EVENT_NAMES.RESET_STORE)
  },
  chooseWorkspace: async (args: Workspace) => {
    return ipcRenderer.invoke(CONTEXT_BRIDGE_EVENT_NAMES.CHOOSE_WORKSPACE, args)
  },
  persistReduxStore: async (args: RootState) => {
    return ipcRenderer.invoke(CONTEXT_BRIDGE_EVENT_NAMES.PERSIST_REDUX_STORE, args)
  },
} as const

// I can't declare a constant (eg. `const EXPOSED_KEY = 'electron'`) and use it for typing the API in the window object, because the editor doesn't show autocomplete for preloaded functions.
contextBridge.exposeInMainWorld('electron', PRELOADED)

declare global {
  interface Window {
    electron: typeof PRELOADED
  }
}
