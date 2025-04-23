import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Pencil as PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

export function ItemMenu({ anchorEl, onClose, onMenuUpdate, onDelete, open = false }) {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem onClick={onMenuUpdate}>
        <ListItemIcon>
          <PencilIcon />
        </ListItemIcon>
        Edit
      </MenuItem>
      <MenuItem onClick={onDelete} sx={{ color: 'var(--mui-palette-error-main)' }}>
        <ListItemIcon>
          <TrashIcon />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Menu>
  );
}
