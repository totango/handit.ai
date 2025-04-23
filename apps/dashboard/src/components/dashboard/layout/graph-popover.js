'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export function GraphPopover({ items, anchorEl, onChange, onClose, open = false }) {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: 'auto' } } }}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
      {items.map((item) => (
        <MenuItem
          key={item}
          onClick={() => {
            onChange?.(item);
          }}
        >
          {item}
        </MenuItem>
      ))}
    </Menu>
  );
}
