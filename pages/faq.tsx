import * as React from 'react';
import { Box, Grid, Typography, Divider, Link } from '@mui/material';
import { ApplicationTopBar } from '../application/ui/application-top-bar';
import { NextHead } from '../lib/next-head';

export default function FAQ() {
  return (
    <React.Fragment>
      <NextHead title="Pasta - FAQ" titleKey="faq" />
      <ApplicationTopBar />
      <Box sx={{ flexFlow: 1, marginTop: '24px', marginBottom: '24px' }}>
        <Grid item container spacing={2} xs={12}>
          <Grid item xs={1} md={3} />
          <Grid item xs={10} md={6}>
            <Typography variant="h4">FAQ</Typography>
            <Divider />
            <ul>
              <li>
                <strong>What is It?</strong> A hand-made note-taking app with
                end-to-end encryption. Nothing more.
              </li>
              <li>
                <strong>Can I use this for myself?</strong> You could dare.
                Nowadays, I have only one problem: I am not paying anyone for
                hosting, databases, or even domains to support this thing. This
                app is totally free and I do not want to monetize It.
              </li>
              <li>
                <strong>
                  Can this thing replace my INSERT_YOUR_NOTE_TAKING_APP_HERE?
                </strong>{' '}
                It depends on your needs. I developed this thing for my own and
                my friends, but you can try It. But please be nice and do not
                abuse It.
              </li>
              <li>
                <strong>
                  How can I be sure you&apos;re not sending my private
                  unencrypted data to anywhere?
                </strong>{' '}
                The best way is to check up the{' '}
                <Link
                  href="https://github.com/pokatomnik/pasta3"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  source code
                </Link>
                .
              </li>
              <li>
                <strong>
                  I forgot a passphrase for my text. Can you restore It?
                </strong>{' '}
                No way. This app does not even save a password in the
                browser&apos;s persistent storages, let alone saving them in the
                database.
              </li>
            </ul>
          </Grid>
          <Grid item xs={1} md={3} />
        </Grid>
      </Box>
    </React.Fragment>
  );
}
