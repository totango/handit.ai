/**
 * Settings Layout Component
 * 
 * This component provides the layout structure for all settings pages with:
 * - Responsive navigation sidebar
 * - Content area for settings pages
 * - Consistent spacing and layout
 * - Mobile-friendly design
 * 
 * The layout ensures a consistent user experience across all settings pages
 * and handles responsive behavior for different screen sizes.
 */
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { SideNav } from '@/components/dashboard/settings/side-nav';

/**
 * Main settings layout component
 * Provides the structural layout for settings pages with navigation and content areas
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in the content area
 * @returns {JSX.Element} The settings layout structure
 */
export default function Layout({ children }) {
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      {/* Main Layout Container */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        sx={{ position: 'relative' }}
      >
        {/* Navigation Sidebar */}
        <SideNav />

        {/* Content Area */}
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
          {children}
        </Box>
      </Stack>
    </Box>
  );
}
