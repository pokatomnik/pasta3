import * as React from 'react';
import { Box, Grid, Typography, Divider, Link } from '@mui/material';
import { ApplicationTopBar } from '../application/ui/application-top-bar';
import { NextHead } from '../lib/next-head';

export default function About() {
  return (
    <React.Fragment>
      <NextHead title="Pasta - About" titleKey="about" />
      <ApplicationTopBar />
      <Box sx={{ flexFlow: 1, marginTop: '24px', marginBottom: '24px' }}>
        <Grid item container spacing={2} xs={12}>
          <Grid item xs={1} md={3} />
          <Grid item xs={10} md={6}>
            <Typography variant="h4">Pasta</Typography>
            <Divider />
            <Typography variant="body1">
              Pasta is just another note-taing app
            </Typography>
            <Typography variant="h6">Key differences are:</Typography>
            <ul>
              <li>
                <strong>
                  <Link
                    href="https://en.wikipedia.org/wiki/End-to-end_encryption"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    End to end encryption
                  </Link>
                  .
                </strong>{' '}
                You can protect all your texts with{' '}
                <Link
                  href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  AES
                </Link>
                ,{' '}
                <Link
                  href="https://en.wikipedia.org/wiki/Data_Encryption_Standard"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  DES
                </Link>{' '}
                algorithms, so no one will know what exactly are about. Please
                note, do not forget passwords you using, because the encrypted
                texts will not be saved anywhere.
              </li>
              <li>
                <strong>No account required.</strong> You may choose one of{' '}
                <Link
                  href="https://en.wikipedia.org/wiki/OAuth"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  OAuth
                </Link>{' '}
                providers for authorization.
              </li>
              <li>...Or you can just save you text unencrypted:)</li>
            </ul>
          </Grid>
          <Grid item xs={1} md={3} />
        </Grid>
      </Box>
    </React.Fragment>
  );
}
