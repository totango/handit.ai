/**
 * Analytics Component
 * 
 * Provides Google Tag Manager (GTM) integration and page view tracking
 * for the application. Manages GTM initialization and automatic page
 * view event tracking.
 */

'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GTMProvider, useGTMDispatch } from '@elgorditosalsero/react-gtm-hook';

import { config } from '@/config';

/**
 * Page View Tracker Component
 * 
 * Tracks page views by dispatching GTM events when the pathname or
 * search parameters change. Uses Next.js navigation hooks to detect
 * route changes.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} A component that tracks page views
 */
function PageViewTracker({ children }) {
  // Get GTM dispatch function and navigation state
  const dispatch = useGTMDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views when navigation state changes
  React.useEffect(() => {
    dispatch({ event: 'page_view', page: pathname });
  }, [dispatch, pathname, searchParams]);

  return <React.Fragment>{children}</React.Fragment>;
}

/**
 * Analytics Provider Component
 * 
 * Initializes Google Tag Manager and provides page view tracking
 * functionality. If GTM is not configured, renders children without
 * tracking capabilities.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} A provider that handles analytics tracking
 */
export function Analytics({ children }) {
  // Skip GTM initialization if not configured
  if (!config.gtm?.id) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  // Initialize GTM and wrap with page view tracking
  return (
    <GTMProvider state={{ id: config.gtm.id }}>
      <PageViewTracker>{children}</PageViewTracker>
    </GTMProvider>
  );
}
