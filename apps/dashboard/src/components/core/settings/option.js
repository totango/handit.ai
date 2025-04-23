/**
 * Option Component
 * 
 * A specialized Chip component for use in settings and selection interfaces.
 * Provides visual feedback for selected state through a custom border effect
 * while maintaining the soft variant styling of Material-UI's Chip.
 */

import * as React from 'react';
import Chip from '@mui/material/Chip';

/**
 * Option Component
 * 
 * A wrapper around Material-UI's Chip component that adds a custom selected state
 * indicator using a pseudo-element border effect.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.selected - Whether the option is currently selected
 * @param {Object} props...props - Additional props to be passed to the Chip component
 * @returns {JSX.Element} A styled chip with selection indicator
 */
export function Option({ selected, ...props }) {
  return (
    <Chip
      {...props}
      sx={{
        position: 'relative',
        '&::before': {
          borderRadius: 'inherit',
          bottom: 0,
          content: '" "',
          left: 0,
          pointerEvents: 'none',
          position: 'absolute',
          right: 0,
          top: 0,
          ...(selected && { boxShadow: '0 0 0 2px var(--mui-palette-primary-main)' }),
        },
      }}
      variant="soft"
    />
  );
}
