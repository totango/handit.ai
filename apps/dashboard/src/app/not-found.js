/**
 * Not Found Page Component
 * 
 * This is a custom 404 error page that is displayed when a user tries to access
 * a route that doesn't exist in the application. It's part of Next.js's built-in
 * error handling system.
 * 
 * Key features:
 * 1. Displays a 404 error message with a friendly explanation
 * 2. Shows a custom illustration (not-found.svg)
 * 3. Provides a button to return to the home page
 * 4. Uses Material-UI components for consistent styling
 * 
 * @module NotFound
 */

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { paths } from '@/paths';

/**
 * Metadata configuration for the page
 * Sets the title that will appear in the browser tab
 */
export const metadata = { title: `Not found | ${config.site.name}` };

/**
 * Not Found Page Component
 * 
 * Renders a user-friendly 404 error page with:
 * - A custom illustration
 * - An error message
 * - A button to return to the home page
 * 
 * @returns {JSX.Element} The not found page component
 * 
 * @example
 * // This page is automatically rendered by Next.js
 * // when a route is not found
 */
export default function NotFound() {
  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100%',
        py: '64px',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Custom 404 illustration */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              alt="Not found"
              component="img"
              src="/assets/not-found.svg"
              sx={{ height: 'auto', maxWidth: '100%', width: '200px' }}
            />
          </Box>
          
          {/* Error message and description */}
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h4">404: The page you are looking for isn&apos;t here</Typography>
            <Typography color="text.secondary">
              You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation.
            </Typography>
          </Stack>
          
          {/* Navigation button to return home */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button component={RouterLink} href={paths.home} variant="contained">
              Back to home
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
