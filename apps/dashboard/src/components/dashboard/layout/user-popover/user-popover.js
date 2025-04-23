/**
 * @fileoverview User Popover Component
 * 
 * This component implements a popover menu that displays user information and actions.
 * It shows the user's name, email, and provides authentication-related actions based on
 * the configured authentication strategy.
 * 
 * Features:
 * - Displays user profile information (name and email)
 * - Provides authentication strategy-specific actions
 * - Uses Material-UI components for consistent UI
 * - Responsive positioning and styling
 * 
 * @example
 * // Usage in a layout or navigation component:
 * <UserPopover 
 *   anchorEl={anchorElement}
 *   open={isOpen}
 *   onClose={handleClose}
 * />
 */

'use client';

import * as React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { config } from '@/config';
import { AuthStrategy } from '@/lib/auth/strategy';
import { useUser } from '@/hooks/use-user';

import { CustomSignOut } from './custom-sign-out';

/**
 * Capitalizes the first letter of a string
 * 
 * @param {string} string - The string to capitalize
 * @returns {string} The string with its first letter capitalized
 */
function capitalizeFirstLetter(string) {
  return string?.replace(/^./, string?.[0]?.toUpperCase());
}

/**
 * UserPopover Component
 * 
 * A popover menu component that displays user information and authentication actions.
 * The component adapts its content based on the configured authentication strategy.
 * 
 * @param {Object} props - Component props
 * @param {HTMLElement} props.anchorEl - The element that the popover is anchored to
 * @param {Function} props.onClose - Function to call when the popover should close
 * @param {boolean} props.open - Whether the popover is open
 * @returns {JSX.Element} A Popover component with user information and actions
 */
export function UserPopover({ anchorEl, onClose, open }) {
  const { user } = useUser();

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '280px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {/* User Information Section */}
      <Box sx={{ p: 2 }}>
        <Typography>{`${capitalizeFirstLetter(user?.firstName)} ${capitalizeFirstLetter(user?.lastName)}`}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email}
        </Typography>
      </Box>

      <Divider />

      {/* Authentication Actions Section */}
      <Box sx={{ p: 1 }}>
        {config.auth.strategy === AuthStrategy.CUSTOM ? <CustomSignOut /> : null}
        {/* TODO: Add other strategies */}
      </Box>
    </Popover>
  );
}
