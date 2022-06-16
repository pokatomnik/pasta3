import * as React from 'react';
import { Button, Stack, Paper, Input, Box } from '@mui/material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  maxWidth: 300,
};

export function PassPrompt(props: {
  resolve: (pass: string) => void;
  reject: (e: unknown) => void;
  cancel: () => void;
}) {
  const [pass, setPass] = React.useState('');

  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    ref.current?.focus();
  });

  return (
    <Box sx={style}>
      <Paper sx={{ padding: '40px' }}>
        <Stack direction="column" gap={2}>
          <form
            style={{ display: 'contents' }}
            onSubmit={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              props.resolve(pass);
            }}
          >
            <Input
              inputRef={ref}
              placeholder="Passphrase"
              type="password"
              value={pass}
              onChange={(evt) => {
                setPass(evt.currentTarget.value);
              }}
            />
            <Stack gap={2} direction="row" justifyContent="end">
              <Button disabled={pass.length < 6} type="submit">
                OK
              </Button>
              <Button
                type="button"
                onClick={() => {
                  props.cancel();
                }}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}
