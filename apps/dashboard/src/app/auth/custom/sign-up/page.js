/**
 * Custom Sign Up Page
 * 
 * This module implements the sign-up page for custom authentication.
 * It provides a protected route that is only accessible to guests
 * (non-authenticated users) and displays a sign-up form in a split layout.
 * 
 * Features:
 * - Guest-only access
 * - Split layout design
 * - Custom sign-up form
 * - SEO-friendly metadata
 * 
 * @module sign-up-page
 */

import * as React from 'react';

import { config } from '@/config';
import { SignUpForm } from '@/components/auth/custom/sign-up-form';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';

/**
 * Page metadata for SEO and browser tab title
 * 
 * @type {Object}
 * @property {string} title - The page title in format "Sign up | Custom | Auth | {siteName}"
 */
export const metadata = { title: `Sign up | Custom | Auth | ${config.site.name}` };

/**
 * Sign Up Page Component
 * 
 * Renders the sign-up page with the following structure:
 * - GuestGuard: Ensures only non-authenticated users can access
 * - SplitLayout: Provides a two-column layout
 * - SignUpForm: The main registration form
 * 
 * @returns {JSX.Element} The sign-up page component
 * 
 * @example
 * // The page will be accessible at:
 * // /auth/custom/sign-up
 */
export default function Page() {
  return (
    <GuestGuard>
      <SplitLayout>
        <SignUpForm />
      </SplitLayout>
    </GuestGuard>
  );
}
