/**
 * Model Tokens Settings Page Component
 * 
 * This page provides a comprehensive interface for managing model provider tokens:
 * - Service provider token management (OpenAI, Anthropic, etc.)
 * - Token configuration for different environments
 * - Optimization token selection
 * - Token usage tracking
 * 
 * The component integrates with the dashboard settings layout and provides
 * a centralized view for model token management separate from API integrations.
 */
'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { IntegrationTokensManager } from '@/components/dashboard/settings/integrations-tokens-manager';
import { useGetUserQuery } from '@/services/auth/authService';

/**
 * Main model tokens settings page component
 * Renders the token management interface for AI model providers
 * @returns {JSX.Element} The model tokens settings interface
 */
export default function Page() {
  // Fetch user data including optimization token configuration
  const { data: userData, error, isLoading } = useGetUserQuery();

  return (
    <Stack spacing={4}>
      {/* Page Header */}
      <div>
        <Typography variant="h4">Model Tokens</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Manage your AI model provider tokens and optimization settings
        </Typography>
      </div>

      {/* Model Tokens Management Section */}
      <IntegrationTokensManager 
        initialOptimizationTokenId={
          userData?.company?.optimizationTokenId 
            ? String(userData.company.optimizationTokenId) 
            : ''
        } 
      />
    </Stack>
  );
} 