/**
 * Agent Tracing Page Component
 * 
 * This page serves as a wrapper for the dynamic tracing visualization component.
 * It handles:
 * - Dynamic loading of the tracing component to optimize initial page load
 * - Passing entry log data from URL parameters to the tracing component
 * 
 * The component is loaded dynamically to avoid SSR issues with visualization libraries
 * and to improve initial page load performance.
 */
"use client";

import { useSearchParams } from 'next/navigation';
import dynamic from "next/dynamic";

// Dynamically import the tracing component with SSR disabled
// This is necessary because the tracing visualization likely uses browser-specific APIs
// and visualization libraries that aren't compatible with server-side rendering
const TracingPage = dynamic(() => import("@/components/tracing/page"), {
  ssr: false, // Disable server-side rendering
});

/**
 * Main page component that renders the tracing visualization
 * @returns {JSX.Element} The tracing page component with entry log data
 */
export default function Page() {
  // Get entry log ID from URL query parameters
  const searchParams = useSearchParams();
  const entryLog = searchParams.get('entryLog');

  // Render the dynamically loaded tracing component with the entry log data
  return <TracingPage initialEntryLog={entryLog} />;
}
