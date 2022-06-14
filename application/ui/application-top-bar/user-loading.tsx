import * as React from 'react';
import { RequireLoading } from '../session/require-loading';
import { IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

export function UserLoading() {
  return (
    <RequireLoading>
      <IconButton
        size="large"
        edge="end"
        aria-label="Unauthorized user"
        aria-haspopup="true"
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </RequireLoading>
  );
}
