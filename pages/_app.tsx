import * as React from 'react';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { Box } from '@mui/material';

function MyApp(props: {
  Component: React.ComponentType<object>;
  pageProps: {
    session: Session;
    pageProps: object;
  };
}) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <SessionProvider session={session}>
      <Box sx={{ flexGrow: 1 }}>
        <Component {...pageProps} />
      </Box>
    </SessionProvider>
  );
}

export default MyApp;
