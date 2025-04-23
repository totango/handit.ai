'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export function ModelsPopover({ models, anchorEl, onChange, onClose, open = false }) {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: 'auto' } } }}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
      {models.map((model) => (
        <MenuItem
          key={model.name}
          onClick={() => {
            onChange?.(model.id);
          }}
        >
          {model.name}
        </MenuItem>
      ))}
    </Menu>
  );
}
