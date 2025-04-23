/**
 * @fileoverview Custom Sign In Page
 * 
 * This page implements the sign-in functionality for custom authentication.
 * It provides a protected route that is only accessible to guests (non-authenticated users)
 * and displays a sign-in form in a split layout.
 * 
 * Features:
 * - Guest-only access (redirects authenticated users)
 * - Split layout design for better UX
 * - Custom authentication form
 * - SEO-friendly metadata
 * 
 * @example
 * // The page will be accessible at:
 * // /auth/custom/sign-in
 */

import * as React from 'react';

import { config } from '@/config';
import { SignInForm } from '@/components/auth/custom/sign-in-form';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';

/**
 * Page metadata for SEO and browser tab title
 * 
 * @type {Object}
 * @property {string} title - The page title in format "Sign in | Custom | Auth | {siteName}"
 */
export const metadata = { title: `Sign in | Custom | Auth | ${config.site.name}` };

/**
 * Sign In Page Component
 * 
 * Renders the sign-in page with the following structure:
 * - GuestGuard: Ensures only non-authenticated users can access
 * - SplitLayout: Provides a two-column layout
 * - SignInForm: The main authentication form
 * 
 * @returns {JSX.Element} The sign-in page component
 */
export default function Page() {
  return (
    <GuestGuard>
      <SplitLayout>
        <SignInForm />
      </SplitLayout>
    </GuestGuard>
  );
}
