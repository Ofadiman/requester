import React, { ReactElement, useEffect } from 'react'
import { WindowSize } from '../file-system-store'

export const WINDOW_SIZE_CHANNEL = 'WINDOW_SIZE_CHANNEL'

export const SettingsView = (): ReactElement => {
  useEffect(() => {
    const handleResize = (_event: UIEvent): void => {
      const newWindowSize: WindowSize = {
        height: window.outerHeight,
        width: window.outerWidth,
      }

      // TODO: Come up with a way to type functions used for communication between processes.
      void (window as any).api.resizeWindow(newWindowSize)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <div>Settings view works.</div>
}
