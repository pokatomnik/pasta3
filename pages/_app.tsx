import * as React from 'react';
import Head from 'next/head';
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
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Pasta application" />
        <meta name="keywords" content="notes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#664aff" />
      </Head>
      <SessionProvider session={session}>
        <Box sx={{ flexGrow: 1 }}>
          <Component {...pageProps} />
        </Box>
      </SessionProvider>
    </React.Fragment>
  );
}

export default MyApp;
