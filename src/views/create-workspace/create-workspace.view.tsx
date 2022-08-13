import React, { ChangeEvent, FC, useMemo, useState } from 'react'
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { AddRounded, CloseRounded, KeyRounded } from '@mui/icons-material'
import dayjs from 'dayjs'

import { typeGuards } from '../../utils/type-guards'

export const CreateWorkspaceView: FC = () => {
  const [isWorkspacePickerCanceledSnackbarOpen, setIsWorkspacePickerCanceledSnackbarOpen] =
    useState(false)
  const [isWorkspaceAlreadyExistSnackbarOpen, setIsWorkspaceAlreadyExistSnackbarOpen] =
    useState(false)
  const [workspacePath, setWorkspacePath] = useState('')
  const [encryptionKey, setEncryptionKey] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const [hasWorkspaceAlreadyExistsError, setHasWorkspaceAlreadyExistsError] = useState(false)
  const isCreateWorkspaceButtonDisabled = useMemo<boolean>(() => {
    const isWorkspaceNotSet = workspacePath.length === 0
    if (isWorkspaceNotSet) {
      return true
    }

    const isEncryptionKeyNotSet = encryptionKey.length === 0
    if (isEncryptionKeyNotSet) {
      return true
    }

    const isWorkspaceNameNotSet = workspaceName.length === 0
    if (isWorkspaceNameNotSet) {
      return true
    }

    if (hasWorkspaceAlreadyExistsError) {
      return true
    }

    return false
  }, [
    encryptionKey.length,
    hasWorkspaceAlreadyExistsError,
    workspaceName.length,
    workspacePath.length,
  ])

  const openDirectoryPicker = async () => {
    const result: Electron.OpenDialogReturnValue = await window.electron.openDirectoryPicker()

    if (result.canceled) {
      setIsWorkspacePickerCanceledSnackbarOpen(true)

      return
    }

    const [workspacePath] = result.filePaths

    if (typeGuards.isUndefined(workspacePath)) {
      throw new Error(`Workspace path cannot be undefined.`)
    }

    const doesWorkspaceExist = await window.electron.checkIfWorkspaceDirectoryExits(workspacePath)
    const isWorkspacePathAlreadySelected = workspacePath.length !== 0

    if (doesWorkspaceExist && isWorkspacePathAlreadySelected) {
      setIsWorkspaceAlreadyExistSnackbarOpen(true)

      return
    }

    if (doesWorkspaceExist && !isWorkspacePathAlreadySelected) {
      setHasWorkspaceAlreadyExistsError(true)

      return
    }

    setWorkspacePath(workspacePath)
    setHasWorkspaceAlreadyExistsError(false)
  }

  const handleWorkspacePickerCanceledSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    // This line is taken from MaterialUI documentation and I don't know what it is doing.
    if (reason === 'clickaway') {
      return
    }

    setIsWorkspacePickerCanceledSnackbarOpen(false)
  }

  const handleWorkspaceAlreadyExistSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    // This line is taken from MaterialUI documentation and I don't know what it is doing.
    if (reason === 'clickaway') {
      return
    }

    setIsWorkspaceAlreadyExistSnackbarOpen(false)
  }

  const generateEncryptionKey = async () => {
    const encryptionKey = await window.electron.generateEncryptionKey()

    setEncryptionKey(encryptionKey)
  }

  const handleEncryptionKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEncryptionKey(event.target.value)
  }

  const handleWorkspaceNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(event.target.value)
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
        <Grid
          component={Paper}
          item
          container
          flexDirection="column"
          gap={6}
          sx={{ padding: 6, width: 500 }}
        >
          <Grid item>
            <Typography variant="h3">Create workspace</Typography>
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="workspace-name-3f1063ad-57f0-4af8-8b6a-2febe9d3b6ce"
              label="Workspace name"
              variant="standard"
              onChange={handleWorkspaceNameChange}
              value={workspaceName}
            />
          </Grid>

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
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton onClick={generateEncryptionKey} size="small">
                        <KeyRounded />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Grid item container flexDirection="row" flexWrap="nowrap">
            <Grid item container flexGrow={1} justifyContent="center" alignItems="center">
              <TextField
                error={hasWorkspaceAlreadyExistsError}
                helperText={
                  hasWorkspaceAlreadyExistsError ? 'Requester workspace already exists' : ''
                }
                fullWidth
                id="workspace-directory-4130617d-7d44-43ff-ae39-60e533d683ca"
                label="Workspace directory"
                variant="standard"
                value={workspacePath}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton onClick={openDirectoryPicker} size="small">
                        <AddRounded />
                      </IconButton>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>

          <Button disabled={isCreateWorkspaceButtonDisabled}>Create workspace</Button>
        </Grid>
      </Grid>
      <Snackbar
        open={isWorkspacePickerCanceledSnackbarOpen}
        autoHideDuration={dayjs.duration({ seconds: 5 }).asMilliseconds()}
        onClose={handleWorkspacePickerCanceledSnackbarClose}
        message="Workspace picker canceled"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleWorkspacePickerCanceledSnackbarClose}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        }
      />
      <Snackbar
        open={isWorkspaceAlreadyExistSnackbarOpen}
        autoHideDuration={dayjs.duration({ seconds: 5 }).asMilliseconds()}
        onClose={handleWorkspaceAlreadyExistSnackbarClose}
        message="Requester workspace already exists"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleWorkspaceAlreadyExistSnackbarClose}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        }
      />
    </>
  )
}
