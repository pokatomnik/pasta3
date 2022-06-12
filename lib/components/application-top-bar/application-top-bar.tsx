import * as React from 'react';
import { AppBar, IconButton, Toolbar, Typography, Box } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { UserUnauthorized } from './user-unauthorized';
import { UserAuthorized } from './user-authorized';
import { UserLoading } from './user-loading';

export function ApplicationTopBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Pasta
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <UserUnauthorized />
          <UserAuthorized />
          <UserLoading />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
