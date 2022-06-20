import * as React from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  SwipeableDrawer,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { UserUnauthorized } from './user-unauthorized';
import { UserAuthorized } from './user-authorized';
import { UserLoading } from './user-loading';
import { DrawerUserInfo } from './drawer-userinfo';
import { DrawerNavigation } from './drawer-navigation';

function isIOS() {
  try {
    return (
      typeof navigator !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent)
    );
  } catch (e) {
    return false;
  }
}

export function ApplicationTopBar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const ios = isIOS();

  return (
    <React.Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen((open) => !open)}
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
      <Toolbar />
      <SwipeableDrawer
        anchor="left"
        disableBackdropTransition={ios}
        disableDiscovery={ios}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <DrawerUserInfo />
          <DrawerNavigation />
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
}
