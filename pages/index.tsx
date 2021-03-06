import React from 'react';
import { ApplicationTopBar } from '../application/ui/application-top-bar';
import { Grid, Box, Stack } from '@mui/material';
import { NewPasta } from '../application/ui/new-pasta';
import { ExistingPastaList } from '../application/ui/existing-pasta';
import { PastaStore } from '../application/stores/pasta';
import { NextHead } from '../lib/next-head';
import { FullsizeLoader } from '../lib/loaders';

const Loader = PastaStore.modelClient((props) => {
  if (props.pastaStore.existingPastaList.arePastaLoading) {
    return <FullsizeLoader />;
  }
  return <React.Fragment />;
});

export default PastaStore.modelProvider(() => {
  return (
    <React.Fragment>
      <NextHead title="Pasta" titleKey="index" />
      <ApplicationTopBar />
      <Box sx={{ flexFlow: 1, marginTop: '24px', marginBottom: '24px' }}>
        <Grid item container spacing={2} xs={12}>
          <Grid item xs={1} md={3} />
          <Grid item xs={10} md={6}>
            <Stack spacing={2}>
              <NewPasta />
              <ExistingPastaList />
              <Loader />
            </Stack>
          </Grid>
          <Grid item xs={1} md={3} />
        </Grid>
      </Box>
    </React.Fragment>
  );
});
