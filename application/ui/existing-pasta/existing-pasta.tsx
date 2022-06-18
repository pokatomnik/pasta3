import * as React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { PastaStore } from '../../stores/pasta';
import { ExistingPasta } from '../../stores/pasta/existing-pasta';
import { ExistingPastaItem } from './existing-pasta-item';
import { PastaEncryption } from '../../stores/encryption';
import { useSimpleSnack } from '../snack';

interface IMenuClosed {
  open: false;
  el: null;
  pasta: null;
  algorithm: null;
}

interface IMenuOpen {
  open: true;
  el: HTMLElement;
  pasta: ExistingPasta;
  algorithm: PastaEncryption;
}

export const ExistingPastaList = PastaStore.modelClient((props) => {
  const { showSnack, snackJSX } = useSimpleSnack();
  const [menuState, setMenuState] = React.useState<IMenuOpen | IMenuClosed>({
    open: false,
    el: null,
    pasta: null,
    algorithm: null,
  });

  const tryRemovePasta = () => {
    menuState.pasta?.tryRemove();
    setMenuState({
      open: false,
      el: null,
      pasta: null,
      algorithm: null,
    });
  };

  const decrypt = () => {
    menuState.pasta?.decryptForMS(menuState.algorithm, 30 * 1000, () => {
      showSnack('Failed to decrypt');
    });
    setMenuState({
      open: false,
      el: null,
      pasta: null,
      algorithm: null,
    });
  };

  return (
    <React.Fragment>
      {props.pastaStore.existingPastaList.map((existingPasta) => {
        return (
          <ExistingPastaItem
            key={existingPasta._id}
            item={existingPasta}
            onMenuOpen={(el, algorithm) => {
              setMenuState({
                open: true,
                el,
                pasta: existingPasta,
                algorithm,
              });
            }}
          />
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
            algorithm: null,
          });
        }}
      >
        <MenuItem onClick={() => {}}>Download</MenuItem>
        <MenuItem onClick={tryRemovePasta}>Delete</MenuItem>
        {menuState.pasta?.encrypted && (
          <MenuItem disabled={menuState.pasta?.isDecrypted} onClick={decrypt}>
            Decrypt
          </MenuItem>
        )}
      </Menu>
      {snackJSX}
    </React.Fragment>
  );
});
