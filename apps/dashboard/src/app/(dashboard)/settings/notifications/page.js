/**
 * Notifications Settings Page Component
 * 
 * This page provides a comprehensive interface for managing notification preferences with:
 * - Email notification settings
 * - Phone notification preferences
 * - Notification frequency controls
 * - Channel-specific configurations
 * 
 * The component integrates with the dashboard settings layout and provides
 * a centralized view for notification management across different channels.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { EmailNotifications } from '@/components/dashboard/settings/email-notifications';
import { PhoneNotifications } from '@/components/dashboard/settings/phone-notifications';

/**
 * Page metadata configuration
 * Sets the page title for SEO and browser display
 */
export const metadata = { title: `Notifications | Settings | Dashboard | ${config.site.name}` };

/**
 * Main notifications settings page component
 * Renders the notification preferences interface with email and phone settings
 * @returns {JSX.Element} The notifications settings interface
 */
export default function Page() {
  return (
    <Stack spacing={4}>
      {/* Page Header */}
      <div>
        <Typography variant="h4">Notifications</Typography>
      </div>

      {/* Notification Settings Sections */}
      <Stack spacing={4}>
        {/* Email Notification Preferences */}
        <EmailNotifications />

        {/* Phone Notification Preferences */}
        <PhoneNotifications />
      </Stack>
    </Stack>
  );
}
