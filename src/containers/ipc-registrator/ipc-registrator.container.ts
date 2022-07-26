import React, { useEffect } from 'react'
import { CHANNELS } from '../../constants/channels'
import { Logger } from '../../utils/logger'

const logger = new Logger(`ipc registrator`)

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
    logger.info(
      `Registering event listener on channel "${CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS}" for function named "${clearReduxStoreIpc.name}".`,
    )

    window.electron.registerIpcMainEventHandler(
      CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS,
      clearReduxStoreIpc,
    )

    return () => {
      logger.info(
        `Removing event listener on channel "${CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS}" for function named "${clearReduxStoreIpc.name}".`,
      )

      window.electron.removeIpcMainEventHandler(
        CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS,
        clearReduxStoreIpc,
      )
    }
  }, [])

  return null
}
