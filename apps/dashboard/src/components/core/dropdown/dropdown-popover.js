/**
 * Dropdown Popover Component
 * 
 * A wrapper component for Material-UI's Popover that integrates with the dropdown context.
 * Provides consistent positioning, event handling, and styling for dropdown menus
 * throughout the application.
 */

import * as React from 'react';
import Popover from '@mui/material/Popover';

import { DropdownContext } from './dropdown-context';

/**
 * Dropdown Popover Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the popover
 * @param {Object} props.PaperProps - Props to be passed to the underlying Paper component
 * @param {Object} props...props - Additional props to be passed to the Popover component
 * @returns {JSX.Element} A positioned popover with event handling and styling
 */
export function DropdownPopover({ children, PaperProps, ...props }) {
  const { anchorEl, onPopoverMouseEnter, onPopoverMouseLeave, onPopoverEscapePressed, open } =
    React.useContext(DropdownContext);

  return (
    <Popover
      // Anchor element for positioning
      anchorEl={anchorEl}

      // Default positioning configuration
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown') {
          onPopoverEscapePressed?.();
        }
      }}

      // Control visibility
      open={open}

      // Configure paper component with event handlers
      slotProps={{
        paper: {
          ...PaperProps,
          onMouseEnter: onPopoverMouseEnter,
          onMouseLeave: onPopoverMouseLeave,
          // Ensure paper component can receive mouse events
          sx: { ...PaperProps?.sx, pointerEvents: 'auto' },
        },
      }}

      // Disable pointer events on the popover container
      // to allow interaction with elements behind it
      sx={{ pointerEvents: 'none' }}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      {...props}
    >
      {children}
    </Popover>
  );
}
