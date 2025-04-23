/**
 * Dashboard Layout Component
 * 
 * This component serves as the root layout for the dashboard section with:
 * - Authentication protection
 * - Dynamic layout management
 * - Consistent user experience
 * - Secure access control
 * 
 * The layout ensures that all dashboard pages are protected by authentication
 * and wrapped in a dynamic layout that adapts to user preferences and system state.
 */
'use client';

import * as React from 'react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { DynamicLayout } from '@/components/dashboard/layout/dynamic-layout';

/**
 * Main dashboard layout component
 * Provides authentication protection and dynamic layout structure for all dashboard pages
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the dashboard layout
 * @returns {JSX.Element} The authenticated dashboard layout structure
 */
export default function Layout({ children }) {
  return (
    // Authentication Protection Layer
    <AuthGuard>
      {/* Dynamic Layout Container */}
      <DynamicLayout>
        {children}
      </DynamicLayout>
    </AuthGuard>
  );
}
