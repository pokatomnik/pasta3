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
} from '@mui/material';
import { PastaStore } from '../../stores/pasta';
import { EncryptionSelector } from '../encryption-selector';

export const NewPasta = PastaStore.modelClient((props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const openMenu = (htmlEl: HTMLElement) => {
    setMenuOpen(true);
    setAnchorEl(htmlEl);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const downloadAsFile = () => {};

  const save = () => {
    if (props.pastaStore.newPasta.canBeSaved) {
      props.pastaStore.newPasta.save();
    }
    closeMenu();
  };

  return (
    <Card variant="elevation">
      <CardHeader
        title={
          <React.Fragment>
            <Stack direction="row">
              <FormControl variant="standard" fullWidth>
                <TextField
                  variant="standard"
                  fullWidth
                  placeholder="A new Pasta name"
                  value={props.pastaStore.newPasta.name}
                  onChange={(evt) => {
                    props.pastaStore.newPasta.setName(evt.currentTarget.value);
                  }}
                />
              </FormControl>
              <EncryptionSelector
                onAlgorithmChange={() => {}}
                requirePasss={() => Promise.resolve('')}
              />
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
                <MenuItem onClick={downloadAsFile}>Download</MenuItem>
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
          variant="outlined"
          placeholder="A new Pasta content"
          minRows={10}
          value={props.pastaStore.newPasta.content}
          onChange={(evt) => {
            props.pastaStore.newPasta.setContent(evt.currentTarget.value);
          }}
        />
      </CardContent>
    </Card>
  );
});
