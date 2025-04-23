/**
 * PropertyItem Component
 * 
 * A component for displaying property name-value pairs in a consistent grid layout.
 * Supports both string and custom value types, with appropriate styling and
 * fallback display for empty values. Uses CSS custom properties for flexible
 * layout customization.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * PropertyItem Component
 * 
 * Renders a property name and its corresponding value in a grid layout.
 * Handles different value types and provides appropriate styling for each.
 * Uses CSS custom properties for layout customization.
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - The property name to display
 * @param {string|React.ReactNode} props.value - The property value to display
 * @returns {JSX.Element} A grid layout containing the property name and value
 */
export function PropertyItem({ name, value }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'grid',
        gridGap: 'var(--PropertyItem-gap, 8px)',
        gridTemplateColumns: 'var(--PropertyItem-columns)',
        p: 'var(--PropertyItem-padding, 8px)',
      }}
    >
      <div>
        <Typography color="text.secondary" variant="body2">
          {name}
        </Typography>
      </div>
      <div>
        {typeof value === 'string' ? (
          <Typography color={value ? 'text.primary' : 'text.secondary'} variant="subtitle2">
            {value || 'None'}
          </Typography>
        ) : (
          <React.Fragment>{value}</React.Fragment>
        )}
      </div>
    </Box>
  );
}
