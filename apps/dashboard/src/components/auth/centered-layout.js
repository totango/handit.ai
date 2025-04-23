/**
 * Centered Layout Component
 * 
 * A layout component that centers its children both vertically and horizontally
 * on the page. It provides a consistent layout for authentication pages and forms.
 * 
 * Features:
 * - Full viewport height centering
 * - Responsive padding
 * - Maximum width constraint
 * - Flexible content width
 * 
 * @module centered-layout
 */

import * as React from 'react';
import Box from '@mui/material/Box';

/**
 * Centered Layout Component
 * Centers content both vertically and horizontally with responsive padding
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be centered
 * @returns {JSX.Element} Centered layout container
 */
export function CenteredLayout({ children }) {
  return (
    <Box
      sx={{
        // Center content vertically and horizontally
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // Ensure full viewport height
        minHeight: '100vh',
        // Responsive padding: smaller on mobile, larger on desktop
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Content container with maximum width constraint */}
      <Box sx={{ maxWidth: '560px', width: '100%' }}>{children}</Box>
    </Box>
  );
}
