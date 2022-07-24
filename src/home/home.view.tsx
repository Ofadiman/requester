import React, { FC, useState } from 'react'
import { Box, Button, IconButton, Snackbar } from '@mui/material'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'
import { AddRounded, CloseRounded } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useTypedDispatch, useTypedSelector } from '../redux/store'
import { Workspace, workspacesSlice } from '../redux/workspaces/workspaces.slice'
import { uuidFactory } from '../utils/uuid.factory'
import { useNavigate } from 'react-router-dom'

const styles: SxProps<Theme> = {
  width: '100vw',
  height: '100vh',
  display: 'grid',
}

export const HomeView: FC = () => {
  const dispatch = useTypedDispatch()
  const workspaces = useTypedSelector((state) => state.workspaces.workspaces)
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const navigate = useNavigate()

  const openDirectoryPicker = async () => {
    const result: Electron.OpenDialogReturnValue = await (window as any).api.openDirectoryPicker()

    if (result.canceled) {
      setIsSnackbarOpen(true)

      return
    }

    console.log(
      '\x1b[33m\x1b[40m%s\x1b[0m',
      `\n===== [DEBUG] ===== Result after picking a directory on the front end ===== [DEBUG] =====`,
    )
    console.log(result)
    console.log(
      '\x1b[33m\x1b[40m%s\x1b[0m',
      `===== [DEBUG] ===== Result after picking a directory on the front end ===== [DEBUG] =====\n`,
    )
    const [workspacePath] = result.filePaths

    const pickedWorkspace: Workspace = {
      id: uuidFactory.generateVersion4(),
      path: workspacePath,
      name: `Some name here ${Math.random()}`,
    }

    dispatch(workspacesSlice.actions.add(pickedWorkspace))
    const workspaces = await (window as any).api.chooseWorkspace(pickedWorkspace)
    console.log(
      '\x1b[33m\x1b[40m%s\x1b[0m',
      `\n===== [DEBUG] ===== Workspaces after update ===== [DEBUG] =====`,
    )
    console.log(workspaces)
    console.log(
      '\x1b[33m\x1b[40m%s\x1b[0m',
      `===== [DEBUG] ===== Workspaces after update ===== [DEBUG] =====\n`,
    )
    navigate('/main', { replace: true })
  }

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    // This line is taken from MaterialUI documentation and I don't know what it is doing.
    if (reason === 'clickaway') {
      return
    }

    setIsSnackbarOpen(false)
  }

  return (
    <Box sx={styles}>
      {workspaces.map((workspace) => {
        return (
          <Box>
            Id: {workspace.id}
            Name: {workspace.name}
            Path: {workspace.path}
          </Box>
        )
      })}
      <Button
        variant={'contained'}
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
          message={`Workspace picker canceled`}
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
