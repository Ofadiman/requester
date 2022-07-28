import React from 'react'
import { Box, Button, Grid, Paper } from '@mui/material'
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
    // TODO: I want to create an entity factory later.
    dispatch(
      httpRequestsSlice.actions.addOne({
        id: uuidFactory.generateVersion4(),
        path: {},
        name: 'New request',
        httpMethod: HTTP_METHODS.GET,
        body: {},
        query: {},
        url: '',
        status: HTTP_REQUEST_STATUSES.NEW,
        requestResult: {
          data: {},
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
                <Paper>
                  {httpRequest.id} {httpRequest.name}
                </Paper>
              </Grid>
            )
          })}
        </Grid>
        <Grid container item xs={10} sx={{ backgroundColor: 'hsla(120,100%,50%,0.5)' }}>
          <Grid item>
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
