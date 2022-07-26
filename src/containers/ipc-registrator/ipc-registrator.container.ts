import React, { useEffect } from 'react'
import { CHANNELS } from '../../constants/channels'

const clearReduxStoreIpc = async (): Promise<void> => {
  /**
   * This function clears the redux store from local file system, but does not cause the UI to rerender.
   */
  await window.electron.clearReduxStore()
}

/**
 * In order to be able to make changes to the react application from the main process via IPC events I have to register event handlers somewhere in the react tree, where hooks can be used and all contexts are available.
 *
 * Examples of actions I may want to perform:
 * - Reset redux store from native menu which is available only from main process.
 * - Change current route via `navigate` function returned from `useNavigate` hook.
 */
export const IpcRegistrator: React.FC = () => {
  useEffect(() => {
    console.log(`Attaching event listener for ${clearReduxStoreIpc.name}`)
    window.electron.registerIpcMainEventHandler(
      CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS,
      clearReduxStoreIpc,
    )

    return () => {
      console.log(`Clearing event listener for ${clearReduxStoreIpc.name}`)
      window.electron.removeIpcMainEventHandler(
        CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS,
        clearReduxStoreIpc,
      )
    }
  }, [])

  return null
}
