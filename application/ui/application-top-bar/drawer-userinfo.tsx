import { Stack, Box, Avatar, Typography } from '@mui/material';
import * as React from 'react';
import { RequireSession } from '../session';
import { Require } from '../../../lib/require';

export function DrawerUserInfo() {
  return (
    <Stack direction="column" gap={2}>
      <RequireSession>
        {(session) => (
          <Require value={session.user}>
            {(user) => (
              <React.Fragment>
                <Require value={user.image}>
                  {(image) => (
                    <Box
                      sx={{
                        height: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <Avatar
                        variant="square"
                        alt="Avatar"
                        src={image}
                        sx={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                  )}
                </Require>
                <Require value={user.name ?? user.email}>
                  {() => (
                    <Box sx={{ padding: '20px' }}>
                      <Require value={user.name}>
                        {(name) => (
                          <Typography variant="h6" whiteSpace="normal">
                            {name}
                          </Typography>
                        )}
                      </Require>
                      <Require value={user.email}>
                        {(email) => (
                          <Typography
                            variant="caption"
                            sx={{ overflowWrap: 'break-word' }}
                          >
                            {email}
                          </Typography>
                        )}
                      </Require>
                    </Box>
                  )}
                </Require>
              </React.Fragment>
            )}
          </Require>
        )}
      </RequireSession>
    </Stack>
  );
}
