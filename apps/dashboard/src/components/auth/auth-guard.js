/**
 * Authentication Guard Component
 * 
 * This component protects routes that require authentication.
 * It checks the user's authentication status and redirects to the
 * appropriate sign-in page if the user is not authenticated.
 * 
 * Features:
 * - Route protection
 * - Authentication state checking
 * - Sandbox mode support
 * - Multiple auth strategy support
 * - Loading and error states
 * 
 * @module auth-guard
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { config } from '@/config';
import { paths } from '@/paths';
import { AuthStrategy } from '@/lib/auth/strategy';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { store } from '@/store';
import { isSandboxPage } from '@/lib/sandbox';

/**
 * Authentication Guard Component
 * Protects routes by checking authentication status and redirecting if necessary
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be protected
 * @returns {JSX.Element|null} Protected content or null/error state
 */
export function AuthGuard({ children }) {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState(true);
  const { checkSession } = useUser();

  /**
   * Checks user permissions and authentication status
   * Handles redirects and sandbox mode
   * 
   * @returns {Promise<void>}
   */
  const checkPermissions = async () => {
    // Wait for initial loading to complete
    if (isLoading) {
      return;
    }

    // Handle authentication errors
    if (error) {
      setIsChecking(false);
      return;
    }

    // Handle sandbox mode
    if (isSandboxPage(window)) {
      if (!user) {
        // Set sandbox credentials and refresh session
        store.dispatch({ type: 'auth/setSandboxCredentials' })
        await checkSession();
        return router.refresh();
      }
    }

    // Handle unauthenticated users
    if (!user) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');

      // Redirect based on configured auth strategy
      switch (config.auth.strategy) {
        case AuthStrategy.CUSTOM: {
          router.replace(paths.auth.custom.signIn);
          return;
        }
        // TODO: Add other strategies

        default: {
          logger.error('[AuthGuard]: Unknown auth strategy');
          return;
        }
      }
    }

    // User is authenticated, allow access
    setIsChecking(false);
  };

  // Check permissions when auth state changes
  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  // Show nothing while checking permissions
  if (isChecking) {
    return null;
  }

  // Show error if authentication failed
  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  // Render protected content
  return <React.Fragment>{children}</React.Fragment>;
}
