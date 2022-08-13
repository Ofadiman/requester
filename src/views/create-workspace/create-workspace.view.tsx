import React, { ChangeEvent, FC, useState } from 'react'
import { Button, Grid, IconButton, InputAdornment, Snackbar, TextField } from '@mui/material'
import { CasinoRounded, AddRounded, CloseRounded, KeyRounded } from '@mui/icons-material'
import dayjs from 'dayjs'

import { typeGuards } from '../../utils/type-guards'

export const CreateWorkspaceView: FC = () => {
  // const dispatch = useDispatch()
  // const navigate = useNavigate()
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [workspacePath, setWorkspacePath] = useState('')
  const [encryptionKey, setEncryptionKey] = useState('')

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

    setWorkspacePath(workspacePath)

    // const pickedWorkspace: Workspace = {
    //   encryptionKey: uuidFactory.generateVersion4(),
    //   id: uuidFactory.generateVersion4(),
    //   name: `Some name here ${Math.random()}`,
    //   path: workspacePath,
    // }

    // dispatch(workspacesSlice.actions.addOne(pickedWorkspace))
    // navigate('/http-requests', { replace: true })
  }

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    // This line is taken from MaterialUI documentation and I don't know what it is doing.
    if (reason === 'clickaway') {
      return
    }

    setIsSnackbarOpen(false)
  }

  const generateEncryptionKey = async () => {
    const encryptionKey = await window.electron.generateEncryptionKey()

    setEncryptionKey(encryptionKey)
  }

  const handleEncryptionKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEncryptionKey(event.target.value)
  }

  return (
    <>
      <Grid
        flexGrow={1}
        container
        sx={{
          display: 'grid',
          height: '100vh',
          width: '100vw',
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item container flexDirection="column" gap={3} sx={{ width: 400 }}>
          <Grid item container flexDirection="row" flexWrap="nowrap">
            <Grid item container flexGrow={1} justifyContent="center" alignItems="center">
              <TextField
                fullWidth
                id="encryption-key-3f1063ad-57f0-4af8-8b6a-2febe9d3b6ce"
                label="Encryption key"
                variant="standard"
                onChange={handleEncryptionKeyChange}
                value={encryptionKey}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyRounded />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item container justifyContent="center" alignItems="center" xs>
              <IconButton onClick={generateEncryptionKey}>
                <CasinoRounded />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item container flexDirection="row" flexWrap="nowrap">
            <Grid item container flexGrow={1} justifyContent="center" alignItems="center">
              <TextField
                fullWidth
                id="workspace-directory-4130617d-7d44-43ff-ae39-60e533d683ca"
                label="Workspace directory"
                variant="standard"
                value={workspacePath}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item container justifyContent="center" alignItems="center" xs>
              <IconButton onClick={openDirectoryPicker}>
                <AddRounded />
              </IconButton>
            </Grid>
          </Grid>
          <Button>Create workspace</Button>
        </Grid>
      </Grid>
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
    </>
  )
}
