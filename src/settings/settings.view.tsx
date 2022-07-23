import React, { ReactElement, useEffect } from 'react'
import { WindowSize } from '../file-system-store'
import { Box, Button } from '@mui/material'

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

  const handleAppQuit = () => {
    void (window as any).api.quitApp()
  }

  return (
    <Box
      sx={{
        borderColor: 'black',
        borderWidth: 1,
      }}
    >
      Settings view works.
      <Button onClick={handleAppQuit}>Quit app</Button>
    </Box>
  )
}
