/**
 * Presence Component
 * 
 * A visual indicator component that displays a user's current status or presence.
 * Renders a colored dot with configurable size to represent different states
 * such as online, offline, away, or busy. Uses Material-UI's color system
 * for consistent theming.
 */

import * as React from 'react';
import Box from '@mui/material/Box';

/**
 * Size configuration for presence indicators
 * 
 * @type {Object.<string, number>}
 * @property {number} small - Small indicator size (8px)
 * @property {number} medium - Medium indicator size (16px)
 * @property {number} large - Large indicator size (24px)
 */
const sizes = { small: 8, medium: 16, large: 24 };

/**
 * Presence Component
 * 
 * Renders a circular indicator that represents a user's current status.
 * The indicator's color and size can be customized based on the status
 * and size props.
 * 
 * @param {Object} props - Component props
 * @param {('small'|'medium'|'large')} [props.size='medium'] - The size of the presence indicator
 * @param {('offline'|'away'|'busy'|'online')} [props.status='offline'] - The current status to display
 * @returns {JSX.Element} A circular status indicator
 */
export function Presence({ size = 'medium', status = 'offline' }) {
  // Map status values to their corresponding theme colors
  const colors = {
    offline: 'var(--mui-palette-neutral-100)',
    away: 'var(--mui-palette-warning-main)',
    busy: 'var(--mui-palette-error-main)',
    online: 'var(--mui-palette-success-main)',
  };

  // Get the color for the current status
  const color = colors[status];

  return (
    <Box
      sx={{
        bgcolor: color,
        borderRadius: '50%',
        display: 'inline-block',
        flex: '0 0 auto',
        height: sizes[size],
        width: sizes[size],
      }}
    />
  );
}
