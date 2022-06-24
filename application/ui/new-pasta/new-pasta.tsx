import * as React from 'react';
import { MoreVert } from '@mui/icons-material';
import {
  Card,
  Stack,
  CardHeader,
  TextField,
  IconButton,
  CardContent,
  Menu,
  MenuItem,
  FormControl,
  Switch,
  FormGroup,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { PastaStore } from '../../stores/pasta';
import { EncryptionSelector } from '../encryption-selector';
import { useModal } from '../modal';
import { PassPrompt } from '../pass-prompt';
import { PastaEncryption, NoEncryption } from '../../stores/encryption';
import { useSimpleSnack } from '../snack';
import { Editor } from '../../../lib/editor';
import { LinkPopover } from '../link-popover';
import { looksLikeURL } from '../../../lib/url-checker';

export const NewPasta = PastaStore.modelClient((props) => {
  const { showSnack, snackJSX } = useSimpleSnack();

  const [clickedLink, setClickedLink] = React.useState<{
    word: string;
    clientX: number;
    clientY: number;
  } | null>(null);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const session = useSession();

  const { modalJSX, openDialog } = useModal<string>();

  const requireKey = React.useCallback((): Promise<string> => {
    return openDialog(PassPrompt);
  }, [openDialog]);

  const [encryptionAlgorithm, setEncryptionAlgorithm] =
    React.useState<PastaEncryption | null>(null);

  const onWordClick = (clickedWord: Exclude<typeof clickedLink, null>) => {
    if (looksLikeURL(clickedWord.word)) {
      setClickedLink(clickedWord);
    }
  };

  const clearClickedLink = () => {
    setClickedLink(null);
  };

  const openMenu = (htmlEl: HTMLElement) => {
    setMenuOpen(true);
    setAnchorEl(htmlEl);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const downloadAsFile = () => {
    props.pastaStore.newPasta.download();
    showSnack('Download started');
    closeMenu();
  };

  const copyAsText = () => {
    props.pastaStore.newPasta
      .copyToClipboard()
      .then(() => {
        showSnack('Content copied to clipboard');
      })
      .catch(() => {
        showSnack('Failed to copy:(');
      });
    closeMenu();
  };

  const save = async () => {
    if (!session.data) {
      signIn();
    } else if (props.pastaStore.newPasta.canBeSaved) {
      const algorithm = props.pastaStore.newPasta.encrypted
        ? encryptionAlgorithm
        : new PastaEncryption({
            requirePass: () => Promise.resolve(''),
            symmetricEncrypion: new NoEncryption(),
          });
      if (algorithm) {
        props.pastaStore.newPasta.save(algorithm);
      }
    }
    closeMenu();
  };

  return (
    <React.Fragment>
      <Card variant="elevation" sx={{ backgroundColor: '#dfefff' }}>
        <CardHeader
          title={
            <React.Fragment>
              <Stack direction="row">
                <FormControl variant="standard" fullWidth>
                  <TextField
                    variant="standard"
                    fullWidth
                    placeholder="Name"
                    value={props.pastaStore.newPasta.name}
                    onChange={(evt) => {
                      props.pastaStore.newPasta.setName(
                        evt.currentTarget.value
                      );
                    }}
                  />
                </FormControl>
                {props.pastaStore.newPasta.encrypted && (
                  <EncryptionSelector
                    onAlgorithmChange={setEncryptionAlgorithm}
                    requirePasss={requireKey}
                  />
                )}
                <Tooltip
                  title={
                    props.pastaStore.newPasta.encrypted
                      ? 'Encrypted'
                      : 'Unencrypted'
                  }
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={props.pastaStore.newPasta.encrypted}
                          onChange={(evt) => {
                            props.pastaStore.newPasta.setEncrypted(
                              evt.currentTarget.checked
                            );
                          }}
                        />
                      }
                      label="🔒"
                    />
                  </FormGroup>
                </Tooltip>
                <IconButton
                  aria-label="Menu"
                  onClick={(evt) => {
                    openMenu(evt.currentTarget);
                  }}
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={menuOpen}
                  onClose={closeMenu}
                >
                  <MenuItem
                    onClick={downloadAsFile}
                    disabled={!props.pastaStore.newPasta.canBeSaved}
                  >
                    Download
                  </MenuItem>
                  <MenuItem
                    onClick={copyAsText}
                    disabled={!props.pastaStore.newPasta.hasContent}
                  >
                    Copy to clipboard
                  </MenuItem>
                  <MenuItem
                    onClick={save}
                    disabled={!props.pastaStore.newPasta.canBeSaved}
                  >
                    Save
                  </MenuItem>
                </Menu>
              </Stack>
            </React.Fragment>
          }
        />
        <CardContent>
          <Editor
            onChange={(evt) => {
              props.pastaStore.newPasta.setContent(evt.currentTarget.value);
            }}
            value={props.pastaStore.newPasta.content}
            placeholder="A new Pasta content"
            minRows={10}
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
      {snackJSX}
    </React.Fragment>
  );
});
