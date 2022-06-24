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

function getMenuOpenState(
  el: HTMLElement,
  pasta: ExistingPasta,
  algorithm: PastaEncryption
): IMenuOpen {
  return { open: true, el, pasta, algorithm };
}

export function getMenuClosedState(): IMenuClosed {
  return { open: false, el: null, pasta: null, algorithm: null };
}

export const ExistingPastaList = PastaStore.modelClient((props) => {
  const { showSnack, snackJSX } = useSimpleSnack();
  const [menuState, setMenuState] = React.useState<IMenuOpen | IMenuClosed>(
    getMenuClosedState
  );

  const tryRemovePasta = () => {
    menuState.pasta?.tryRemove();
    setMenuState(getMenuClosedState);
  };

  const decrypt = () => {
    menuState.pasta?.decryptForMS(menuState.algorithm, 30 * 1000, () => {
      showSnack('Failed to decrypt');
    });
    setMenuState(getMenuClosedState);
  };

  const handleCopy = () => {
    menuState.pasta
      ?.copyToClipboard()
      .then(() => {
        showSnack('Contents copied to clipboard');
      })
      .catch(() => {
        showSnack('Failed to copy:(');
      });
    setMenuState(getMenuClosedState);
  };

  const handleDownload = () => {
    menuState.pasta?.download();
    showSnack('Download started');
    setMenuState(getMenuClosedState);
  };

  return (
    <React.Fragment>
      {props.pastaStore.existingPastaList.list.map((existingPasta) => {
        return (
          <ExistingPastaItem
            key={existingPasta._id}
            item={existingPasta}
            onMenuOpen={(el, algorithm) => {
              setMenuState(getMenuOpenState(el, existingPasta, algorithm));
            }}
          />
        );
      })}
      <Menu
        anchorEl={menuState.el}
        keepMounted
        open={menuState.open}
        onClose={() => {
          setMenuState(getMenuClosedState);
        }}
      >
        <MenuItem
          disabled={!menuState.pasta?.canBeExported}
          onClick={handleDownload}
        >
          Download
        </MenuItem>
        <MenuItem
          disabled={!menuState.pasta?.canBeExported}
          onClick={handleCopy}
        >
          Copy to clipboard
        </MenuItem>
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
