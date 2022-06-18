import * as React from 'react';

import { Snackbar } from '@mui/material';

export function useSimpleSnack() {
  const [text, setText] = React.useState('');
  const [display, setDisplay] = React.useState(false);

  const showSnack = React.useCallback((text: string) => {
    setText(text);
    setDisplay(true);
  }, []);

  const snackJSX = (
    <Snackbar
      autoHideDuration={3000}
      open={display}
      onClose={() => {
        setDisplay(false);
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      message={text}
    />
  );

  return { showSnack, snackJSX };
}
