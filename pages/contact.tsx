import * as React from 'react';
import { Box, Grid, Typography, Divider, Link } from '@mui/material';
import { ApplicationTopBar } from '../application/ui/application-top-bar';
import { NextHead } from '../lib/next-head';

export default function Contacts() {
  return (
    <React.Fragment>
      <NextHead title="Pasta - Contact" titleKey="contact" />
      <ApplicationTopBar />
      <Box sx={{ flexFlow: 1, marginTop: '24px', marginBottom: '24px' }}>
        <Grid item container spacing={2} xs={12}>
          <Grid item xs={1} md={3} />
          <Grid item xs={10} md={6}>
            <Typography variant="h4">Contacts</Typography>
            <Divider />
            <ul>
              <li>
                <strong>
                  <Link
                    sx={{ cursor: 'pointer' }}
                    onClick={(evt) => {
                      evt.preventDefault();
                      window.open('mailto:pokatomnik@yandex.ru', '_blank');
                    }}
                  >
                    pokatomnik[at]yandex.ru
                  </Link>
                </strong>
              </li>
              <li>
                <strong>
                  <Link
                    href="https://github.com/pokatomnik"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    GitHub
                  </Link>
                </strong>
              </li>
              <li>
                <strong>
                  <Link
                    href="https://danilian.xyz"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Personal website
                  </Link>
                </strong>
              </li>
            </ul>
          </Grid>
          <Grid item xs={1} md={3} />
        </Grid>
      </Box>
    </React.Fragment>
  );
}
