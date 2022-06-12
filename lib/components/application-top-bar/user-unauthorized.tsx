import { signIn } from 'next-auth/react';
import { RequireUnauthorized } from '../session/require-unauthorized';
import { IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

export function UserUnauthorized() {
  return (
    <RequireUnauthorized>
      <IconButton
        size="large"
        edge="end"
        aria-label="Unauthorized user"
        aria-haspopup="true"
        onClick={() => {
          signIn();
        }}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </RequireUnauthorized>
  );
}
