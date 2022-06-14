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
} from '@mui/material';
import { useSession } from 'next-auth/react';

export function NewPasta() {
  const session = useSession();
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

  const save = () => {};

  return (
    <Card variant="elevation">
      <CardHeader
        title={
          <React.Fragment>
            <Stack direction="row">
              <TextField
                fullWidth
                variant="standard"
                placeholder="A new Pasta name"
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
                <MenuItem onClick={save} disabled={!session}>
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
        />
      </CardContent>
    </Card>
  );
}
