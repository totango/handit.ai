/**
 * PropertyList Component
 * 
 * A container component for organizing PropertyItem components in a consistent layout.
 * Supports both horizontal and vertical orientations, with optional dividers and
 * striped backgrounds. Uses CSS custom properties for flexible layout customization.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';

/**
 * PropertyList Component
 * 
 * Renders a stack of property items with configurable layout and styling options.
 * Supports different orientations, dividers, and striped backgrounds for
 * improved visual organization.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The property items to display
 * @param {React.ReactNode} [props.divider] - Optional divider element between items
 * @param {('horizontal'|'vertical')} [props.orientation='horizontal'] - The layout orientation
 * @param {number} [props.stripe] - Optional interval for striped background (e.g., 2 for every other item)
 * @param {Object} [props.sx] - Additional styles to apply to the stack
 * @returns {JSX.Element} A stack of property items with the specified layout
 */
export function PropertyList({ children, divider, orientation = 'horizontal', stripe, sx }) {
  return (
    <Stack
      divider={divider}
      sx={{
        '--PropertyItem-columns': orientation === 'horizontal' ? '150px minmax(0, 1fr)' : '1fr',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--PropertyList-gap)',
        ...(stripe && { [`& > *:nth-child(${stripe})`]: { bgcolor: 'var(--mui-palette-background-level1)' } }),
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
}
