/**
 * @fileoverview Split Layout Component
 * 
 * This component implements a responsive split layout commonly used in authentication pages.
 * It creates a two-column layout with a full-height background image on the left and
 * content area on the right. The layout is responsive and collapses to a single column
 * on mobile devices.
 * 
 * Features:
 * - Responsive grid layout
 * - Full-height background image
 * - Centered content area
 * - Mobile-first design
 * - Custom background color for content area
 * 
 * @example
 * // Usage in an authentication page:
 * <SplitLayout>
 *   <SignInForm />
 * </SplitLayout>
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

/**
 * Split Layout Component
 * 
 * A responsive layout component that creates a two-column design:
 * - Left column: Full-height background image (hidden on mobile)
 * - Right column: Content area with centered content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to display in the right column
 * @returns {JSX.Element} The split layout component
 * 
 * @example
 * // Basic usage:
 * function AuthPage() {
 *   return (
 *     <SplitLayout>
 *       <SignInForm />
 *     </SplitLayout>
 *   );
 * }
 */
export function SplitLayout({ children }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 800px' }, minHeight: '100vh' }}>
      {/* Left column with background image */}
      <Box
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          p: 4,
          backgroundImage: 'url("/assets/handit-bg-2.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%'
        }}
      >
        <Stack spacing={4} sx={{ maxWidth: '700px' }}>
          <Stack spacing={1}>
            
          </Stack>
        </Stack>
      </Box>

      {/* Right column with content */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            justifyContent: 'center',
            p: 2,
            backgroundColor: 'rgb(2,31,36)'
          }}
        >
          <Box sx={{ maxWidth: '420px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
