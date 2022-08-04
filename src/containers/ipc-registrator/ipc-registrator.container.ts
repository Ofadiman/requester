import React, { useEffect } from 'react'
import { useNavigate, NavigateFunction } from 'react-router-dom'
import { IpcRendererEvent } from 'electron'
import { useDispatch } from 'react-redux'
import { Dispatch } from '@reduxjs/toolkit'
import { CHANNELS } from '../../enums/channels'
import {
  httpRequestsSlice,
  HttpRequestsSynchronizeAction,
} from '../../redux/http-requests/http-requests.slice'

const clearReduxStoreIpc = async (): Promise<void> => {
  /**
   * This function clears the redux store from local file system, but does not cause the UI to rerender.
   */
  await window.electron.clearReduxStore()
}

const createNavigationFunction =
  (navigate: NavigateFunction) =>
  // TODO: Add better typings to arguments received from the main process.
  (_event: IpcRendererEvent, args: { to: string }) => {
    navigate(args.to)
  }

const createDispatchFunction =
  (dispatch: Dispatch) =>
  (_event: IpcRendererEvent, args: HttpRequestsSynchronizeAction['payload']) => {
    dispatch(httpRequestsSlice.actions.synchronizeFs(args))
  }

/**
 * In order to be able to make changes to the react application from the main process via IPC events I have to register event handlers somewhere in the react tree, where hooks can be used and all contexts are available.
 *
 * Examples of actions I may want to perform:
 * - Reset redux store from native menu which is available only from main process.
 * - Change current route via `navigate` function returned from `useNavigate` hook.
 */
export const IpcRegistrator: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const navigateIpc = createNavigationFunction(navigate)
  const dispatchIpc = createDispatchFunction(dispatch)

  useEffect(() => {
    window.electron.registerIpcMainEventHandler(
      CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS,
      clearReduxStoreIpc,
    )

    window.electron.registerIpcMainEventHandler(CHANNELS.NAVIGATION, navigateIpc)

    window.electron.registerIpcMainEventHandler(
      CHANNELS.FILE_SYSTEM_HTTP_REQUEST_CHANGED,
      dispatchIpc,
    )

    return () => {
      window.electron.removeIpcMainEventHandler(
        CHANNELS.REDUX_STORE_RESET_FROM_MAIN_PROCESS,
        clearReduxStoreIpc,
      )

      window.electron.removeIpcMainEventHandler(CHANNELS.NAVIGATION, navigateIpc)

      window.electron.removeIpcMainEventHandler(
        CHANNELS.FILE_SYSTEM_HTTP_REQUEST_CHANGED,
        dispatchIpc,
      )
    }
  }, [dispatchIpc, navigateIpc])

  return null
}
