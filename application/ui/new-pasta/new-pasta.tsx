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
import { PastaStore } from '../../stores/pasta';
import { EncryptionSelector } from '../encryption-selector';
import { useModal } from '../modal';
import { PassPrompt } from '../pass-prompt';
import { PastaEncryption, NoEncryption } from '../../stores/encryption';

export const NewPasta = PastaStore.modelClient((props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const { modalJSX, openDialog } = useModal<string>();

  const requireKey = React.useCallback((): Promise<string> => {
    return openDialog(PassPrompt);
  }, [openDialog]);

  const [encryptionAlgorithm, setEncryptionAlgorithm] =
    React.useState<PastaEncryption | null>(null);

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
    closeMenu();
  };

  const save = async () => {
    if (props.pastaStore.newPasta.canBeSaved) {
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
                    disabled={!props.pastaStore.canBeDownloaded}
                  >
                    Download
                  </MenuItem>
                  <MenuItem
                    onClick={save}
                    disabled={!props.pastaStore.canBeSaved}
                  >
                    Save
                  </MenuItem>
                </Menu>
              </Stack>
            </React.Fragment>
          }
        />
        <CardContent>
          <TextField
            multiline
            fullWidth
            variant="filled"
            placeholder="A new Pasta content"
            minRows={10}
            value={props.pastaStore.newPasta.content}
            onChange={(evt) => {
              props.pastaStore.newPasta.setContent(evt.currentTarget.value);
            }}
          />
        </CardContent>
      </Card>
      {modalJSX}
    </React.Fragment>
  );
});
