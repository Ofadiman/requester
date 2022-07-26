import React, { FC, useState } from 'react'
import { Box, Button, IconButton, Snackbar } from '@mui/material'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'
import { AddRounded, CloseRounded } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../redux/store'
import {
  Workspace,
  workspacesAdapter,
  workspacesSlice,
} from '../../redux/workspaces/workspaces.slice'
import { uuidFactory } from '../../utils/uuid.factory'

const styles: SxProps<Theme> = {
  width: '100vw',
  height: '100vh',
  display: 'grid',
}

export const HomeView: FC = () => {
  const dispatch = useDispatch()
  const workspaces = useTypedSelector((state) =>
    workspacesAdapter.getSelectors().selectAll(state.workspacesSlice),
  )
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const navigate = useNavigate()

  const openDirectoryPicker = async () => {
    const result: Electron.OpenDialogReturnValue = await window.electron.openDirectoryPicker()

    if (result.canceled) {
      setIsSnackbarOpen(true)

      return
    }

    const [workspacePath] = result.filePaths

    if (workspacePath === undefined) {
      throw new Error(`Workspace path cannot be undefined.`)
    }

    const pickedWorkspace: Workspace = {
      id: uuidFactory.generateVersion4(),
      path: workspacePath,
      name: `Some name here ${Math.random()}`,
    }

    dispatch(workspacesSlice.actions.addOne(pickedWorkspace))
    navigate('/main', { replace: true })
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
