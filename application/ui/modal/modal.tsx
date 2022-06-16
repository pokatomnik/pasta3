import { Modal, Backdrop } from '@mui/material';
import React from 'react';

export function useModal<R>(
  onClose?: React.ComponentProps<typeof Modal>['onClose']
) {
  const [open, setOpen] = React.useState(false);
  const [bodyJSX, setBodyJSX] = React.useState<JSX.Element>(<React.Fragment />);

  const openDialog = React.useCallback(
    (
      Component: React.ComponentType<{
        resolve: (result: R) => void;
        reject: (e: unknown) => void;
      }>
    ): Promise<R> => {
      return new Promise((resolve, reject) => {
        setBodyJSX(
          <Component
            resolve={(result) => {
              resolve(result);
              setOpen(false);
            }}
            reject={(e) => {
              reject(e);
              setOpen(false);
            }}
          />
        );
        setOpen(true);
      });
    },
    []
  );

  const modalJSX = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={(...args) => {
        setOpen(false);
        onClose?.(...args);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      {bodyJSX}
    </Modal>
  );

  return { openDialog, modalJSX };
}
