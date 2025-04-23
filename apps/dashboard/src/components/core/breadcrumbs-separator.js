/**
 * Breadcrumbs Separator Component
 * 
 * A visual separator for breadcrumb navigation that displays as a small
 * circular dot. Uses Material-UI's theme system for consistent styling
 * and color management.
 */

import * as React from 'react';
import Box from '@mui/material/Box';

/**
 * Breadcrumbs Separator Component
 * 
 * Renders a small circular dot that serves as a visual separator between
 * breadcrumb items. The separator uses the neutral-500 color from the
 * theme palette for a subtle appearance.
 * 
 * @returns {JSX.Element} A circular dot separator for breadcrumbs
 */
export function BreadcrumbsSeparator() {
  return (
    <Box
      sx={{
        // Use neutral color from theme for subtle appearance
        bgcolor: 'var(--mui-palette-neutral-500)',
        // Circular shape with equal height and width
        borderRadius: '50%',
        height: '4px',
        width: '4px'
      }}
    />
  );
}
