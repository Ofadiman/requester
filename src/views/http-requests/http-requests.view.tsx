import React, { ChangeEvent, useId } from 'react'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { useDispatch } from 'react-redux'
import {
  HTTP_REQUEST_STATUSES,
  httpRequestsAdapter,
  httpRequestsSlice,
} from '../../redux/http-requests/http-requests.slice'
import { uuidFactory } from '../../utils/uuid.factory'
import { useTypedSelector } from '../../redux/store'
import { HTTP_METHODS } from '../../constants/http-methods'
import { typeGuards } from '../../utils/type-guards'

export const HttpRequestsView: React.FC = () => {
  const id = useId()
  const dispatch = useDispatch()
  const httpRequests = useTypedSelector((state) =>
    httpRequestsAdapter.getSelectors().selectAll(state.httpRequests),
  )
  // TODO: Consider moving this to a separate file.
  const currentHttpRequest = useTypedSelector((state) => {
    if (state.httpRequests.currentId === null) {
      return
    }

    return httpRequestsAdapter
      .getSelectors()
      .selectById(state.httpRequests, state.httpRequests.currentId)
  })

  const handleAddHttpRequest = () => {
    // TODO: Handle the case where a request named "New request" already exists in the selected folder.
    // TODO: Probably, I want to just call `createHttpRequest` here and initialize all the fields in reducer.
    dispatch(
      httpRequestsSlice.actions.createHttpRequest({
        id: uuidFactory.generateVersion4(),
        pathParameters: {},
        name: 'New request',
        httpMethod: HTTP_METHODS.GET,
        body: {},
        queryParameters: {},
        headers: {},
        url: '',
        status: HTTP_REQUEST_STATUSES.NEW,
        requestResult: {
          data: {},
          // TODO: I would probably like to set `null` as the default value here.
          status: 0,
          headers: {},
        },
      }),
    )
  }

  const handleHttpRequestStart = () => {
    // TODO: Handle situation where http request was not found (e.g. store got corrupted).
    if (typeGuards.isUndefined(currentHttpRequest)) {
      return
    }

    dispatch(httpRequestsSlice.actions.httpRequestPending({ id: currentHttpRequest.id }))
  }

  const handleChange = (event: SelectChangeEvent<HTTP_METHODS>) => {
    if (typeGuards.isUndefined(currentHttpRequest)) {
      return
    }

    dispatch(
      httpRequestsSlice.actions.changeMethod({
        requestId: currentHttpRequest.id,
        newMethod: event.target.value as HTTP_METHODS,
      }),
    )
  }

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (typeGuards.isUndefined(currentHttpRequest)) {
      return
    }

    dispatch(
      httpRequestsSlice.actions.changeUrl({
        newUrl: event.target.value,
        requestId: currentHttpRequest.id,
      }),
    )
  }

  // TODO: Handle a situation when user closes all tabs and the is NO current http request selected.
  return (
    <Grid
      sx={{
        width: '100vw',
        height: '100vh',
        margin: 0,
      }}
      container
      spacing={1}
      direction={'column'}
      wrap={'nowrap'}
    >
      <Grid
        container
        item
        spacing={1}
        sx={{ height: 64, backgroundColor: 'hsla(60,100%,50%,0.5)' }}
        xs={0}
      >
        <Grid item>
          <Box>Workspace picker here</Box>
        </Grid>
        <Grid item flexGrow={1}>
          <Box>Expander here</Box>
        </Grid>
        <Grid item>
          <Box>Some menu here</Box>
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ backgroundColor: 'green' }} flexGrow={1}>
        <Grid
          spacing={1}
          container
          item
          xs={2}
          sx={{ backgroundColor: 'hsla(90,100%,50%,0.5)' }}
          direction={'column'}
        >
          <Grid item flexShrink={1}>
            <Button fullWidth variant={'contained'} onClick={handleAddHttpRequest}>
              Create request
            </Button>
          </Grid>

          {httpRequests.map((httpRequest) => {
            return (
              <Grid item flexShrink={1} key={httpRequest.id}>
                <Button
                  fullWidth
                  onClick={() => {
                    dispatch(httpRequestsSlice.actions.changeCurrentRequest({ id: httpRequest.id }))
                  }}
                >
                  {httpRequest.id} {httpRequest.name}
                </Button>
              </Grid>
            )
          })}
        </Grid>
        <Grid container item xs={10} sx={{ backgroundColor: 'hsla(120,100%,50%,0.5)' }}>
          <Grid container>
            <Grid container>
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel id={id}>Age</InputLabel>
                  <Select
                    labelId={id}
                    id="1df76b4d-1890-46af-ae4b-6d4339ba0873"
                    value={currentHttpRequest?.httpMethod ?? HTTP_METHODS.GET}
                    label="Age"
                    onChange={handleChange}
                  >
                    {Object.values(HTTP_METHODS).map((httpMethod) => {
                      return (
                        <MenuItem value={httpMethod} key={httpMethod}>
                          {httpMethod}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  id="1eceef86-5ebe-4db9-8c4c-2c1d2f959b1a"
                  label="Outlined"
                  variant="outlined"
                  value={currentHttpRequest?.url ?? ''}
                  onChange={handleUrlChange}
                />
              </Grid>
            </Grid>
            <Box>{JSON.stringify(currentHttpRequest)}</Box>
            <Button variant={'contained'} onClick={handleHttpRequestStart}>
              Dispatch fetch start action
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
