/**
 * Mail Page Component
 * 
 * This component serves as the main mail interface page that:
 * - Displays the mail threads view for the selected label
 * - Integrates with the mail layout for consistent UI
 * - Provides page metadata for SEO and browser display
 * 
 * The component is rendered within the mail layout context and
 * displays the appropriate mail threads based on the current label.
 */
import * as React from 'react';

import { config } from '@/config';
import { ThreadsView } from '@/components/dashboard/mail/threads-view';

/**
 * Page metadata for SEO and browser display
 * Sets the page title using the site name from config
 */
export const metadata = {
  title: `Mail | Dashboard | ${config.site.name}`
};

/**
 * Mail page component that renders the threads view
 * @returns {JSX.Element} The mail threads interface
 */
export default function Page() {
  return <ThreadsView />;
}
