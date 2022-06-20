import React from 'react';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import type { NextPageContext } from 'next';
import { ApplicationTopBar } from '../application/ui/application-top-bar';
import { Grid, Box, Stack } from '@mui/material';
import { NewPasta } from '../application/ui/new-pasta';
import { ExistingPastaList } from '../application/ui/existing-pasta';
import { PastaStore } from '../application/stores/pasta';
import { Store } from '../application/services/store';
import { Pasta } from '../domain/pasta';
import { NextHead } from '../lib/next-head';

const ModelClient = PastaStore.modelProvider(() => {
  return (
    <React.Fragment>
      <NextHead title="Pasta3" key="index" />
      <ApplicationTopBar />
      <Box sx={{ flexFlow: 1, marginTop: '24px', marginBottom: '24px' }}>
        <Grid item container spacing={2} xs={12}>
          <Grid item xs={1} md={3} />
          <Grid item xs={10} md={6}>
            <Stack spacing={2}>
              <NewPasta />
              <ExistingPastaList />
            </Stack>
          </Grid>
          <Grid item xs={1} md={3} />
        </Grid>
      </Box>
    </React.Fragment>
  );
});

export default function Index(props: { pasta: Array<Pasta> }) {
  return <ModelClient pasta={props.pasta} />;
}

export async function getServerSideProps(context: NextPageContext): Promise<{
  props: {
    pasta: Array<Pasta>;
  };
}> {
  const storage = new Store();
  let session: Session | null = null;

  try {
    session = await getSession({
      req: context.req,
    });
  } catch (e) {
    session = null;
  }

  const email = session?.user?.email;

  if (!email) {
    return {
      props: {
        pasta: [],
      },
    };
  }

  let pasta = new Array<Pasta>();
  try {
    pasta = await storage.pastaStore
      .getPastas(email, 0, Number.MAX_SAFE_INTEGER)
      .then((res) => {
        return res.map((item) => {
          return { ...item, _id: item._id.toString() };
        });
      });
  } catch (e) {
    console.warn('Failed to get pasta with reason:');
    console.warn(e);
  }

  return {
    props: { pasta },
  };
}
