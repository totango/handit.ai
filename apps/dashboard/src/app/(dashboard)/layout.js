/**
 * Dashboard Layout Component
 * 
 * This component serves as the root layout for the dashboard section with:
 * - Authentication protection
 * - Dynamic layout management
 * - Consistent user experience
 * - Secure access control
 * - Global onboarding system
 * 
 * The layout ensures that all dashboard pages are protected by authentication
 * and wrapped in a dynamic layout that adapts to user preferences and system state.
 */
'use client';

import * as React from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import { Rocket } from '@phosphor-icons/react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { DynamicLayout } from '@/components/dashboard/layout/dynamic-layout';
import { OnboardingOrchestrator } from '@/components/onboarding';

/**
 * Main dashboard layout component
 * Provides authentication protection and dynamic layout structure for all dashboard pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the dashboard layout
 * @returns {JSX.Element} The authenticated dashboard layout structure
 */
export default function Layout({ children }) {
  // Global onboarding state  
  const [showOnboarding, setShowOnboarding] = React.useState(false); // Don't start by default

  return (
    <AuthGuard>
      <DynamicLayout>
        {children}

        {/* Floating onboarding trigger - backup option */}
        {!showOnboarding && (
          <Tooltip title="Start HandIt Onboarding">
            <Fab
              color="primary"
              size="small"
              onClick={() => setShowOnboarding(true)}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
              }}
            >
              <Rocket size={20} />
            </Fab>
          </Tooltip>
        )}

        {/* Onboarding System - Always render so it can listen for sidebar events */}
        <OnboardingOrchestrator
          autoStart={false}
          triggerOnMount={false}
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      </DynamicLayout>
    </AuthGuard>
  );
}
