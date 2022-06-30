import * as React from 'react';
import noop from 'lodash/noop';
import {
  Box,
  Card,
  CardHeader,
  Stack,
  Typography,
  IconButton,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { ExistingPasta } from '../../stores/pasta/existing-pasta';
import { EncryptionSelector } from '../encryption-selector';
import { PastaEncryption, NoEncryption } from '../../stores/encryption';
import { PassPrompt } from '../pass-prompt';
import { useModal } from '../modal';
import { Editor } from '../../../lib/editor';
import { looksLikeURL } from '../../../lib/url-checker';
import { LinkPopover } from '../link-popover';

export const ExistingPastaItem = observer(
  (props: {
    item: ExistingPasta;
    onMenuOpen: (el: HTMLElement, algorithm: PastaEncryption) => void;
  }) => {
    const { modalJSX, openDialog } = useModal<string>();

    const [clickedLink, setClickedLink] = React.useState<{
      word: string;
      clientX: number;
      clientY: number;
    } | null>(null);

    const onWordClick = (clickedWord: Exclude<typeof clickedLink, null>) => {
      if (looksLikeURL(clickedWord.word)) {
        setClickedLink(clickedWord);
      }
    };

    const clearClickedLink = () => {
      setClickedLink(null);
    };

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
          <Box
            sx={{
              padding: '16px 16px 0 16px',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: '100%',
              }}
            >
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
          </Box>
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
            <Editor
              selectAllAtFirstClick
              value={props.item.content}
              minRows={10}
              onChange={noop}
              onWordClick={(word) => {
                onWordClick({
                  ...word,
                  clientY: word.clientY + 15,
                });
              }}
            />
            <LinkPopover
              open={clickedLink !== null}
              onClose={clearClickedLink}
              x={clickedLink?.clientX ?? 0}
              y={clickedLink?.clientY ?? 0}
              url={clickedLink?.word ?? ''}
            />
          </CardContent>
        </Card>
        {modalJSX}
      </React.Fragment>
    );
  }
);
