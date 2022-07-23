// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import { CONTEXT_BRIDGE_EVENT_NAMES } from './context-bridge-event-names'

// The ways of communication between electron process and react process.
// 1. `invoke` — You send data from the frontend, process it with `ipcMain.handle` on the backend and return information to the frontend.
// 2. `send` — You send data from the frontend, process it in the backend with `ipcMain.on` and send back a reply when it is processed.
// 3. `on` — You receive data from the backend `event.sender` and process that with the help of a callback function.

contextBridge.exposeInMainWorld('api', {
  resizeWindow: (args: unknown) =>
    ipcRenderer.invoke(CONTEXT_BRIDGE_EVENT_NAMES.RESIZE_WINDOW, args),
})
