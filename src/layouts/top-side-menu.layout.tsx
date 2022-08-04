import React from 'react'
import { Box, Grid } from '@mui/material'

export const TopSideMenuLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  const TopSideMenu = (
    <Grid container item>
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
  )

  return (
    <Grid
      sx={{
        height: '100vh',
        margin: 0,
        width: '100vw',
      }}
      container
      direction="column"
      wrap="nowrap"
    >
      <Grid container item spacing={0} sx={{ height: 64 }}>
        {TopSideMenu}
      </Grid>
      <Grid container item spacing={0} flexGrow={1}>
        {props.children}
      </Grid>
    </Grid>
  )
}
