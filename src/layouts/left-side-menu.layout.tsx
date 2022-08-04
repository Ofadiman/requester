import React from 'react'
import { Divider, Grid, ListItemIcon, ListItemText, MenuItem, MenuList } from '@mui/material'
import { FolderCopyRounded, WidgetsRounded } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export const LeftSideMenuLayout: React.FC<{ children: React.ReactNode }> = (props) => {
  const navigate = useNavigate()

  const LeftSideMenu = (
    <MenuList
      sx={{
        borderRightColor: (theme) => theme.palette.divider,
        borderRightStyle: 'solid',
        borderRightWidth: 1,
        borderTopColor: (theme) => theme.palette.divider,
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        height: '100%',
      }}
    >
      <MenuItem
        sx={{ display: 'flex', flexFlow: 'column' }}
        onClick={() => {
          navigate('/http-requests')
        }}
      >
        <ListItemIcon>
          <FolderCopyRounded fontSize="medium" />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            fontSize: (theme) => theme.typography.caption.fontSize,
          }}
        >
          Requests
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem
        sx={{ display: 'flex', flexFlow: 'column' }}
        onClick={() => {
          navigate('/environments')
        }}
      >
        <ListItemIcon>
          <WidgetsRounded fontSize="medium" />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            fontSize: (theme) => theme.typography.caption.fontSize,
          }}
        >
          Environments
        </ListItemText>
      </MenuItem>
      <Divider />
    </MenuList>
  )

  return (
    <Grid flexGrow={1} container item direction={'row'} wrap={'nowrap'} spacing={0}>
      <Grid item>{LeftSideMenu}</Grid>
      <Grid item container flexGrow={1}>
        {props.children}
      </Grid>
    </Grid>
  )
}
