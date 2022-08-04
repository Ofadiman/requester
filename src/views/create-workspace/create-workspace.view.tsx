import React, { FC, useState } from 'react'
import { Box, Button, IconButton, Snackbar } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import { AddRounded, CloseRounded } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { typeGuards } from '../../utils/type-guards'
import { uuidFactory } from '../../utils/uuid.factory'
import { Workspace, workspacesSlice } from '../../redux/workspaces/workspaces.slice'

const styles: SxProps<Theme> = {
  display: 'grid',
  height: '100vh',
  width: '100vw',
}

export const CreateWorkspaceView: FC = () => {
  const dispatch = useDispatch()
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const navigate = useNavigate()

  const openDirectoryPicker = async () => {
    const result: Electron.OpenDialogReturnValue = await window.electron.openDirectoryPicker()

    if (result.canceled) {
      setIsSnackbarOpen(true)

      return
    }

    const [workspacePath] = result.filePaths

    if (typeGuards.isUndefined(workspacePath)) {
      throw new Error(`Workspace path cannot be undefined.`)
    }

    const pickedWorkspace: Workspace = {
      id: uuidFactory.generateVersion4(),
      name: `Some name here ${Math.random()}`,
      path: workspacePath,
    }

    dispatch(workspacesSlice.actions.addOne(pickedWorkspace))
    navigate('/http-requests', { replace: true })
  }

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    // This line is taken from MaterialUI documentation and I don't know what it is doing.
    if (reason === 'clickaway') {
      return
    }

    setIsSnackbarOpen(false)
  }

  return (
    <Box sx={styles}>
      <Button
        variant="contained"
        sx={{
          margin: 'auto',
        }}
        onClick={openDirectoryPicker}
      >
        Choose workspace directory <AddRounded />
      </Button>
      {isSnackbarOpen && (
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={dayjs.duration({ seconds: 5 }).asMilliseconds()}
          onClose={handleSnackbarClose}
          message="Workspace picker canceled"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseRounded fontSize="small" />
            </IconButton>
          }
        />
      )}
    </Box>
  )
}
