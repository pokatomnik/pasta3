import * as React from 'react';
import { RequireLoading } from '../session/require-loading';
import { CircularProgress } from '@mui/material';

export function UserLoading() {
  return (
    <RequireLoading>
      <CircularProgress color="inherit" />
    </RequireLoading>
  );
}
