import * as React from 'react';
import { Observer } from 'mobx-react';
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
  Typography,
} from '@mui/material';
import { PastaStore } from '../../stores/pasta';
import { ExistingPasta } from '../../stores/pasta/existing-pasta';
import { EncryptionSelector } from '../encryption-selector';

interface IMenuClosed {
  open: false;
  el: null;
  pasta: null;
}

interface IMenuOpen {
  open: true;
  el: HTMLElement;
  pasta: ExistingPasta;
}

export const ExistingPastaList = PastaStore.modelClient((props) => {
  const [menuState, setMenuState] = React.useState<IMenuOpen | IMenuClosed>({
    open: false,
    el: null,
    pasta: null,
  });

  const tryRemovePasta = () => {
    menuState.pasta?.tryRemove();
    setMenuState({
      open: false,
      el: null,
      pasta: null,
    });
  };

  return (
    <React.Fragment>
      {props.pastaStore.existingPastaList.map((existingPasta) => {
        return (
          <Observer key={existingPasta._id}>
            {() => (
              <Card variant="elevation" key={existingPasta._id}>
                <CardHeader
                  title={
                    <React.Fragment>
                      <Stack direction="row">
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ flexGrow: 1 }}
                        >
                          {existingPasta.name}
                        </Typography>
                        {existingPasta.encrypted && (
                          <EncryptionSelector
                            onAlgorithmChange={() => {}}
                            requirePasss={() => Promise.resolve('')}
                          />
                        )}
                        <IconButton
                          aria-label="Menu"
                          onClick={(evt) => {
                            setMenuState({
                              open: true,
                              el: evt.currentTarget,
                              pasta: existingPasta,
                            });
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Stack>
                    </React.Fragment>
                  }
                />
                <CardContent>
                  <TextField
                    multiline
                    fullWidth
                    variant="outlined"
                    minRows={10}
                    disabled
                    value={existingPasta.content}
                  />
                </CardContent>
              </Card>
            )}
          </Observer>
        );
      })}
      <Menu
        anchorEl={menuState.el}
        keepMounted
        open={menuState.open}
        onClose={() => {
          setMenuState({
            open: false,
            el: null,
            pasta: null,
          });
        }}
      >
        <MenuItem onClick={() => {}}>Download</MenuItem>
        <MenuItem onClick={tryRemovePasta}>Delete</MenuItem>
      </Menu>
    </React.Fragment>
  );
});
