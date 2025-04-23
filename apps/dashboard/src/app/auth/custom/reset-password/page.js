/**
 * Custom Reset Password Page
 * 
 * This module implements the password reset page for custom authentication.
 * It provides a protected route that is only accessible to guests
 * (non-authenticated users) and displays a password reset form in a split layout.
 * 
 * Features:
 * - Guest-only access
 * - Split layout design
 * - Custom reset password form
 * - SEO-friendly metadata
 * 
 * @module reset-password-page
 */

import * as React from 'react';

import { config } from '@/config';
import { ResetPasswordForm } from '@/components/auth/custom/reset-password-form';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';

/**
 * Page metadata for SEO and browser tab title
 * 
 * @type {Object}
 * @property {string} title - The page title in format "Reset password | Custom | Auth | {siteName}"
 */
export const metadata = { title: `Reset password | Custom | Auth | ${config.site.name}` };

/**
 * Reset Password Page Component
 * 
 * Renders the password reset page with the following structure:
 * - GuestGuard: Ensures only non-authenticated users can access
 * - SplitLayout: Provides a two-column layout
 * - ResetPasswordForm: The main password reset form
 * 
 * @returns {JSX.Element} The reset password page component
 * 
 * @example
 * // The page will be accessible at:
 * // /auth/custom/reset-password
 */
export default function Page() {
  return (
    <GuestGuard>
      <SplitLayout>
        <ResetPasswordForm />
      </SplitLayout>
    </GuestGuard>
  );
}
