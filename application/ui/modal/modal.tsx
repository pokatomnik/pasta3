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
        cancel: () => void;
        resolve: (result: R) => void;
        reject: (e: unknown) => void;
      }>
    ): Promise<R> => {
      return new Promise((resolve, reject) => {
        setBodyJSX(
          <Component
            cancel={() => {
              setOpen(false);
            }}
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
      <div>{bodyJSX}</div>
    </Modal>
  );

  return { openDialog, modalJSX };
}
