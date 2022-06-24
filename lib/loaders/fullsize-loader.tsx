import * as React from 'react';
import { CircularProgress, Box } from '@mui/material';

export function FullsizeLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
}
