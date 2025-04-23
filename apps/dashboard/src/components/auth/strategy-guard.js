/**
 * Authentication Strategy Guard Component
 * 
 * This component ensures that pages are only rendered when the correct
 * authentication strategy is configured. It provides a safety check to
 * prevent rendering pages that require specific auth strategies when
 * they are not properly configured.
 * 
 * Features:
 * - Strategy validation
 * - Error messaging
 * - Conditional rendering
 * 
 * @module strategy-guard
 */

import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import { config } from '@/config';

/**
 * Strategy Guard Component
 * Ensures content is only rendered when the correct auth strategy is configured
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be conditionally rendered
 * @param {string} props.expected - The expected authentication strategy
 * @returns {JSX.Element} Either the children or an error message
 * 
 * @example
 * // Protecting a custom auth page:
 * function CustomAuthPage() {
 *   return (
 *     <StrategyGuard expected="custom">
 *       <CustomAuthContent />
 *     </StrategyGuard>
 *   );
 * }
 */
export function StrategyGuard({ children, expected }) {
  // Check if the current auth strategy matches the expected one
  if (config.auth.strategy !== expected) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert color="error">
          To render this page, you need to configure the auth strategy to &quot;{expected}&quot;
        </Alert>
      </Box>
    );
  }

  // Render children if the strategy matches
  return <React.Fragment>{children}</React.Fragment>;
}
