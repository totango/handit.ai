/**
 * Account Settings Page Component
 * 
 * This page provides a comprehensive interface for managing user account settings with:
 * - Account details management
 * - Privacy settings
 * - Theme preferences
 * - Account deletion options
 * 
 * The component integrates with the dashboard settings layout and provides
 * a centralized view for account-related configurations.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { AccountDetails } from '@/components/dashboard/settings/account-details';
import { DeleteAccount } from '@/components/dashboard/settings/delete-account';
import { Privacy } from '@/components/dashboard/settings/privacy';
import { ThemeSwitch } from '@/components/dashboard/settings/theme-switch';

/**
 * Page metadata configuration
 * Sets the page title for SEO and browser display
 */
export const metadata = { title: `Account | Settings | Dashboard | ${config.site.name}` };

/**
 * Main account settings page component
 * Renders the account management interface with various settings sections
 * @returns {JSX.Element} The account settings interface
 */
export default function Page() {
  return (
    <Stack spacing={4}>
      {/* Page Header */}
      <div>
        <Typography variant="h4">Account</Typography>
      </div>

      {/* Settings Sections */}
      <Stack spacing={4}>
        {/* Account Details Section */}
        <AccountDetails />

        {/* Privacy Settings Section */}
        <Privacy />

        {/* Theme Preferences Section */}
        <ThemeSwitch />

        {/* Account Deletion Section */}
        <DeleteAccount />
      </Stack>
    </Stack>
  );
}
