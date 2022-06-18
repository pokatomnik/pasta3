import * as React from 'react';
import {
  Card,
  CardHeader,
  Stack,
  Typography,
  IconButton,
  CardContent,
  TextField,
  LinearProgress,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { ExistingPasta } from '../../stores/pasta/existing-pasta';
import { EncryptionSelector } from '../encryption-selector';
import { PastaEncryption, NoEncryption } from '../../stores/encryption';
import { PassPrompt } from '../pass-prompt';
import { useModal } from '../modal';

export const ExistingPastaItem = observer(
  (props: {
    item: ExistingPasta;
    onMenuOpen: (el: HTMLElement, algorithm: PastaEncryption) => void;
  }) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const { modalJSX, openDialog } = useModal<string>();

    const getPass = () => {
      return openDialog(PassPrompt);
    };

    const algorithmRef = React.useRef<PastaEncryption | null>(null);

    return (
      <React.Fragment>
        <Card
          variant="elevation"
          key={props.item._id}
          sx={{ backgroundColor: props.item.color }}
        >
          <CardHeader
            title={
              <React.Fragment>
                <Stack direction="row">
                  <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    {props.item.name}
                  </Typography>
                  {props.item.encrypted && !props.item.isDecrypted && (
                    <EncryptionSelector
                      onAlgorithmChange={(algorithm) => {
                        algorithmRef.current = algorithm;
                      }}
                      requirePasss={getPass}
                    />
                  )}
                  <IconButton
                    aria-label="Menu"
                    onClick={(evt) => {
                      props.onMenuOpen(
                        evt.currentTarget,
                        algorithmRef.current ??
                          new PastaEncryption({
                            requirePass: () => Promise.resolve(''),
                            symmetricEncrypion: new NoEncryption(),
                          })
                      );
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                </Stack>
              </React.Fragment>
            }
          />
          <LinearProgress
            sx={{
              visibility:
                props.item.encrypted && props.item.isDecrypted
                  ? 'visible'
                  : 'hidden',
            }}
            variant="determinate"
            value={
              props.item.encrypted && props.item.isDecrypted
                ? props.item.countdownTimer.percentLeft
                : 100
            }
          />
          <CardContent>
            <TextField
              inputRef={inputRef}
              onFocus={() => {
                inputRef.current?.select();
              }}
              multiline
              fullWidth
              variant="filled"
              minRows={10}
              value={props.item.content}
            />
          </CardContent>
        </Card>
        {modalJSX}
      </React.Fragment>
    );
  }
);
