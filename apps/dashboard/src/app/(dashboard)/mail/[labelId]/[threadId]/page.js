/**
 * Mail Thread Page Component
 * 
 * This component serves as the detailed view for individual mail threads that:
 * - Displays the full content of a specific mail thread
 * - Shows thread details including sender, recipients, and attachments
 * - Provides page metadata for SEO and browser display
 * 
 * The component is rendered within the mail layout context and
 * displays the thread content based on the threadId parameter.
 */
import * as React from 'react';

import { config } from '@/config';
import { ThreadView } from '@/components/dashboard/mail/thread-view';

/**
 * Page metadata for SEO and browser display
 * Sets the page title using the site name from config
 * Includes thread context in the title
 */
export const metadata = {
  title: `Thread | Mail | Dashboard | ${config.site.name}`
};

/**
 * Mail thread page component that renders the detailed thread view
 * @param {Object} props - Component props
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.threadId - ID of the mail thread to display
 * @returns {JSX.Element} The mail thread detail interface
 */
export default function Page({ params }) {
  const { threadId } = params;

  return <ThreadView threadId={threadId} />;
}
