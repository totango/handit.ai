/**
 * @fileoverview ItemMenu component for displaying item action menu
 * Provides a context menu for item actions like edit and delete
 */

import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Pencil as PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

/**
 * ItemMenu component for displaying item action menu
 * @component
 * @param {Object} props - Component props
 * @param {HTMLElement} props.anchorEl - Element to anchor the menu to
 * @param {Function} props.onClose - Callback function when menu is closed
 * @param {Function} props.onMenuUpdate - Callback function when edit action is selected
 * @param {Function} props.onDelete - Callback function when delete action is selected
 * @param {boolean} [props.open=false] - Whether the menu is open
 * @returns {JSX.Element} Rendered menu component
 * 
 * @description
 * This component provides:
 * - A context menu for item actions
 * - Edit and delete options with icons
 * - Proper menu positioning and animation
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
      {/* Edit menu item */}
      <MenuItem onClick={onMenuUpdate}>
        <ListItemIcon>
          <PencilIcon />
        </ListItemIcon>
        Edit
      </MenuItem>
      {/* Delete menu item */}
      <MenuItem onClick={onDelete} sx={{ color: 'var(--mui-palette-error-main)' }}>
        <ListItemIcon>
          <TrashIcon />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Menu>
  );
}
