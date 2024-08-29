import React, { ReactNode } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

interface AlertDialogProps {
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    onClick?: () => void;
  }>;
  children: ReactNode;
  onOpen?: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ title, message, buttons, children, onOpen }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);

    if (onOpen) {
      onOpen();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement, { onClick: handleClickOpen })}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {buttons.map((button, index) => (
            <Button
              key={index}
              color={button.color || 'primary'}
              onClick={() => {
                if (button.onClick) {
                  button.onClick();
                }
                handleClose();
              }}
            >
              {button.text}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AlertDialog;