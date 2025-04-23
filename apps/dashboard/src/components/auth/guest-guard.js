/**
 * @fileoverview Guest Guard Component
 * 
 * This component acts as a protection layer for guest-only routes (like login, signup).
 * It ensures that authenticated users are redirected to the dashboard and only
 * non-authenticated users can access the protected content.
 * 
 * Features:
 * - Redirects authenticated users to dashboard
 * - Shows error messages if authentication fails
 * - Handles loading states
 * - Protects guest-only routes
 * 
 * @example
 * // Usage in a guest-only page:
 * <GuestGuard>
 *   <SignInForm />
 * </GuestGuard>
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

/**
 * Guest Guard Component
 * 
 * A wrapper component that ensures its children are only accessible to non-authenticated users.
 * If an authenticated user tries to access the content, they will be redirected to the dashboard.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to protect
 * @returns {React.ReactNode} The protected content or null/error message
 * 
 * @example
 * // Protecting a sign-in page:
 * function SignInPage() {
 *   return (
 *     <GuestGuard>
 *       <SignInForm />
 *     </GuestGuard>
 *   );
 * }
 */
export function GuestGuard({ children }) {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState(true);

  /**
   * Checks user permissions and handles redirects
   * 
   * This function:
   * 1. Waits for authentication state to be determined
   * 2. Redirects authenticated users to dashboard
   * 3. Shows error message if authentication fails
   * 4. Allows access to non-authenticated users
   * 
   * @async
   * @function checkPermissions
   */
  const checkPermissions = async () => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (user) {
      logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard');
      // Redirect to the correct page
      router.replace(paths.dashboard.overview);
      return;
    }

    setIsChecking(false);
  };

  // Check permissions whenever auth state changes
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

  // Show error message if authentication failed
  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  // Show protected content for non-authenticated users
  return <React.Fragment>{children}</React.Fragment>;
}
