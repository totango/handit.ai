'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export function MetricsPopover({ metrics, anchorEl, onChange, onClose, open = false }) {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: 'auto' } } }}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
    >
      {(metrics || []).map((metric) => (
        <MenuItem
          key={metric.name}
          onClick={() => {
            onChange(metric);
          }}
        >
          {metric.name}
        </MenuItem>
      ))}
    </Menu>
  );
}
