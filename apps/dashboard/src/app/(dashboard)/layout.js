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
import { OnboardingOrchestrator, OnboardingChatContainer } from '@/components/onboarding';
import { useUser } from '@/hooks/use-user';
import { useGetAgentsQuery } from '@/services/agentsService';
import userService from '../../services/userService';

/**
 * Main dashboard layout component
 * Provides authentication protection and dynamic layout structure for all dashboard pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the dashboard layout
 * @returns {JSX.Element} The authenticated dashboard layout structure
 */
export default function Layout({ children }) {
  return (
    <AuthGuard>
      <LayoutInner>{children}</LayoutInner>
    </AuthGuard>
  );
}

/**
 * Inner component that has access to user data through useUser hook
 * This needs to be separate since useUser must be used within AuthGuard
 */
function LayoutInner({ children }) {
  const { user, checkSession } = useUser();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState('disconnected');
  
  // Check if user has agents to determine if we should auto-start onboarding
  const { data: userAgents = [], isLoading: isLoadingAgents } = useGetAgentsQuery({});
  
  React.useEffect(() => {
    // Only run the check after a delay (e.g., 500ms)
    const timeout = setTimeout(() => {
      if (userAgents && userAgents.length === 0 && !isLoadingAgents) {
        console.log('Layout: User has no agents, enabling automatic start');
        setEnableAutomaticStart(true);
      }
    }, 3000); // 3000ms delay

    // Cleanup the timeout if dependencies change before it fires
    return () => clearTimeout(timeout);
  }, [userAgents, isLoadingAgents]);
  // Convert to generic onboarding parameters
  const [enableAutomaticStart, setEnableAutomaticStart] = React.useState(false); // Enable auto-start only if user has no agents

  // Debug logging for user state changes
  React.useEffect(() => {
    console.log('Layout: User state updated:', {
      onboardingCurrentTour: user?.onboardingCurrentTour,
      userId: user?.id,
      email: user?.email
    });
  }, [user]);

  // Connection check handler
  const handleConnectionCheck = async () => {
    setConnectionStatus('checking');
    
    try {
      // TODO: Replace with actual API call to check agent connection
      // Simulate connection check
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly succeed or fail
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setConnectionStatus('connected');
        // Optionally call onboarding completion
        setTimeout(() => {
          setConnectionStatus('disconnected'); // Reset for demo
        }, 5000);
      } else {
        setConnectionStatus('error');
        setTimeout(() => {
          setConnectionStatus('disconnected'); // Reset for demo
        }, 3000);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('error');
      setTimeout(() => {
        setConnectionStatus('disconnected'); // Reset for demo
      }, 3000);
    }
  };

  return (
    <DynamicLayout>
      {children}


      {/* Onboarding System - Always render so it can listen for sidebar events */}
      <OnboardingOrchestrator
        autoStart={false}
        triggerOnMount={false}
        userState={{
          onboardingCurrentTour: user?.onboardingCurrentTour || null,
          userId: user?.id,
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName
        }}
        enableAutomaticStart={enableAutomaticStart}
        isLoadingAutomaticStart={isLoadingAgents}
        updateOnboardingProgress={(tourId) => userService.updateOnboardingProgress(tourId)}
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
      />

      {/* Floating Chat Container - Always render so it can listen for chat events */}
      <OnboardingChatContainer
        onConnectionCheck={handleConnectionCheck}
        connectionStatus={connectionStatus}
        onComplete={() => {
          console.log('Chat completed');
          setShowOnboarding(false);
        }}
        questions={[
          {
            id: 'framework',
            question: "What framework or platform are you using for your application?",
            placeholder: "e.g., React, Node.js, Python Flask, etc."
          },
          {
            id: 'language',
            question: "What programming language is your main application written in?",
            placeholder: "e.g., JavaScript, Python, Java, C#, etc."
          },
          {
            id: 'environment',
            question: "What type of environment are you working in?",
            placeholder: "e.g., Web app, API, Mobile app, Desktop app, etc."
          }
        ]}
      />
    </DynamicLayout>
  );
}
