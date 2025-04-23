/**
 * Team Settings Page Component
 * 
 * This page provides a comprehensive interface for managing team settings with:
 * - Team member management
 * - Role assignments
 * - Member permissions
 * - Team collaboration settings
 * 
 * The component integrates with the dashboard settings layout and provides
 * a centralized view for team-related configurations and member management.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { Members } from '@/components/dashboard/settings/members';

/**
 * Page metadata configuration
 * Sets the page title for SEO and browser display
 */
export const metadata = { title: `Team | Settings | Dashboard | ${config.site.name}` };

/**
 * Main team settings page component
 * Renders the team management interface with member list and role management
 * @returns {JSX.Element} The team settings interface
 */
export default function Page() {
  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4">Team</Typography>
      </div>
      <Members
        members={[
          {
            id: 'USR-000',
            name: 'Sofia Rivers',
            avatar: '/assets/avatar.png',
            email: 'sofia@devias.io',
            role: 'Owner',
          },
          {
            id: 'USR-002',
            name: 'Siegbert Gottfried',
            avatar: '/assets/avatar-2.png',
            email: 'siegbert.gottfried@domain.com',
            role: 'Standard',
          },
        ]}
      />
    </Stack>
  );
}
