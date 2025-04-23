/**
 * Security Settings Page Component
 * 
 * This page provides a comprehensive interface for managing security settings with:
 * - Password management and updates
 * - Multi-factor authentication
 * - Login history tracking
 * - Security preferences
 * 
 * The component integrates with the dashboard settings layout and provides
 * a centralized view for security-related configurations and monitoring.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { LoginHistory } from '@/components/dashboard/settings/login-history';
import { MultiFactor } from '@/components/dashboard/settings/multi-factor';
import { PasswordForm } from '@/components/dashboard/settings/password-form';

/**
 * Page metadata configuration
 * Sets the page title for SEO and browser display
 */
export const metadata = { title: `Security | Settings | Dashboard | ${config.site.name}` };

/**
 * Main security settings page component
 * Renders the security management interface with password, MFA, and login history
 * @returns {JSX.Element} The security settings interface
 */
export default function Page() {
  return (
    <Stack spacing={4}>
      {/* Page Header */}
      <div>
        <Typography variant="h4">Security</Typography>
      </div>

      {/* Security Settings Sections */}
      <Stack spacing={4}>
        {/* Password Management Section */}
        <PasswordForm />

        {/* Multi-Factor Authentication Section */}
        <MultiFactor />

        {/* Login History Section */}
        <LoginHistory />
      </Stack>
    </Stack>
  );
}
