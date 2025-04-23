/**
 * API Integrations Settings Page Component
 * 
 * This page provides a comprehensive interface for managing API integrations with:
 * - API key management for production and staging environments
 * - Integration status monitoring
 * - API usage tracking
 * - Integration configuration
 * 
 * The component integrates with the dashboard settings layout and provides
 * a centralized view for API integration management.
 */
'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { IntegrationTokensManager } from '@/components/dashboard/settings/integrations-tokens-manager';
import { Integrations } from '@/components/dashboard/settings/integrations';
import { useGetUserQuery } from '@/services/auth/authService';

/**
 * Main API integrations settings page component
 * Renders the integration management interface with API keys and configuration options
 * @returns {JSX.Element} The API integrations settings interface
 */
export default function Page() {
  // Fetch user data including API tokens
  const { data: userData, error, isLoading } = useGetUserQuery();

  return (
    <Stack spacing={4}>
      {/* Page Header */}
      <div>
        <Typography variant="h4">API Integrations</Typography>
      </div>

      {/* Integration Tokens Management Section */}
      <Integrations
        productionKey={userData?.company?.apiToken}
        stagingKey={userData?.company?.stagingApiToken}
      />
      <IntegrationTokensManager initialOptimizationTokenId={userData?.company?.optimizationTokenId ? String(userData.company.optimizationTokenId) : ''} />
    </Stack>
  );
}
