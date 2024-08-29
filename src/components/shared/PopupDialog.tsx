import React from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';


interface Action {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  title: string;
  actions: Action[];
  selectedValue: string;
}

const PopupDialog: React.FC<SimpleDialogProps> = ({ open, onClose, title, actions, selectedValue }) => {
  return (
    <Dialog onClose={() => onClose(selectedValue)} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {actions.map((action) => (
          <ListItem button onClick={() => onClose(action.value)} key={action.value}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                {action.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={action.label} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default PopupDialog;