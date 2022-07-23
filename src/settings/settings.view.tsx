import React, { ReactElement, useEffect, useState } from 'react'
import { WindowSize } from '../file-system-store'
import { Box, Button } from '@mui/material'

export const SettingsView = (): ReactElement => {
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null)

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

  const handleDirectoryPickerClick = async () => {
    const result = await (window as any).api.openDirectoryPicker()
    console.log(
      '\x1b[33m\x1b[40m%s\x1b[0m',
      `\n===== [DEBUG] ===== Result after picking directory ===== [DEBUG] =====`,
    )
    console.log(result)
    console.log(
      '\x1b[33m\x1b[40m%s\x1b[0m',
      `===== [DEBUG] ===== Result after picking directory ===== [DEBUG] =====\n`,
    )

    setSelectedDirectory(result.filePaths[0])
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
      <Button onClick={handleDirectoryPickerClick}>Open directory picker</Button>
      <Box>Workspace directory is: {selectedDirectory ?? 'unset'}</Box>
    </Box>
  )
}
