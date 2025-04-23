/**
 * @fileoverview ItemMenu component for model actions
 * Provides a context menu for model operations (edit and delete)
 */

import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Pencil as PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

/**
 * ItemMenu component for model actions
 * @component
 * @param {Object} props - Component props
 * @param {HTMLElement} props.anchorEl - Element to anchor the menu to
 * @param {Function} props.onClose - Function to handle menu close
 * @param {Function} props.onMenuUpdate - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {boolean} [props.open=false] - Whether the menu is open
 * @returns {JSX.Element} Rendered menu component
 * 
 * @description
 * This component provides:
 * - Context menu for model actions
 * - Edit and delete operations
 * - Icon-based menu items
 * - Positioned relative to anchor element
 */
export function ItemMenu({ anchorEl, onClose, onMenuUpdate, onDelete, open = false }) {
  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {/* Edit action */}
      <MenuItem onClick={onMenuUpdate}>
        <ListItemIcon>
          <PencilIcon />
        </ListItemIcon>
        Edit
      </MenuItem>
      {/* Delete action */}
      <MenuItem onClick={onDelete} sx={{ color: 'var(--mui-palette-error-main)' }}>
        <ListItemIcon>
          <TrashIcon />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Menu>
  );
}
