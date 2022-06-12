import * as React from 'react';
import { RequireSession } from '../session/require-session';
import { IconButton, Tooltip, Avatar, Menu, MenuItem } from '@mui/material';
import { signOut } from 'next-auth/react';

export function UserAuthorized() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  return (
    <React.Fragment>
      <RequireSession>
        {(session) => {
          const { user } = session;
          if (!user) {
            return <React.Fragment />;
          }
          const { email, image, name } = user;
          if (!image) {
            return <React.Fragment />;
          }
          return (
            <Tooltip title={email ?? ''}>
              <IconButton
                sx={{ p: 0 }}
                onClick={(evt) => {
                  setAnchorEl(evt.currentTarget);
                  setMenuOpen(true);
                }}
              >
                <Avatar alt={name ?? ''} src={image} />
              </IconButton>
            </Tooltip>
          );
        }}
      </RequireSession>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          setAnchorEl(null);
        }}
      >
        <MenuItem
          onClick={() => {
            setMenuOpen(false);
            setAnchorEl(null);
            signOut();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
