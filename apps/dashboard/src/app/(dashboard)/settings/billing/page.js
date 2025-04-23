/**
 * Billing Settings Page Component
 * 
 * This page provides a comprehensive interface for managing billing and subscription settings with:
 * - Subscription plan management
 * - Invoice history and details
 * - Payment information
 * - Billing cycle tracking
 * 
 * The component integrates with the dashboard settings layout and provides
 * a centralized view for billing-related configurations and history.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import { dayjs } from '@/lib/dayjs';
import { Invoices } from '@/components/dashboard/settings/invoices';
import { Plans } from '@/components/dashboard/settings/plans';

/**
 * Page metadata configuration
 * Sets the page title for SEO and browser display
 */
export const metadata = { title: `Billing | Settings | Dashboard | ${config.site.name}` };

/**
 * Main billing settings page component
 * Renders the billing management interface with subscription plans and invoice history
 * @returns {JSX.Element} The billing settings interface
 */
export default function Page() {
  // Sample invoice data for demonstration
  const sampleInvoices = [
    {
      id: 'INV-003',
      currency: 'USD',
      totalAmount: 14.99,
      issueDate: dayjs().subtract(1, 'month').toDate()
    },
    {
      id: 'INV-002',
      currency: 'USD',
      totalAmount: 14.99,
      issueDate: dayjs().subtract(2, 'months').toDate()
    },
    {
      id: 'INV-001',
      currency: 'USD',
      totalAmount: 14.99,
      issueDate: dayjs().subtract(3, 'months').toDate()
    },
  ];

  return (
    <Stack spacing={4}>
      {/* Page Header */}
      <div>
        <Typography variant="h4">Billing & plans</Typography>
      </div>

      {/* Settings Sections */}
      <Stack spacing={4}>
        {/* Subscription Plans Section */}
        <Plans />
        <Invoices
          invoices={[
            { id: 'INV-003', currency: 'USD', totalAmount: 14.99, issueDate: dayjs().subtract(1, 'month').toDate() },
            { id: 'INV-002', currency: 'USD', totalAmount: 14.99, issueDate: dayjs().subtract(2, 'months').toDate() },
            { id: 'INV-001', currency: 'USD', totalAmount: 14.99, issueDate: dayjs().subtract(3, 'months').toDate() },
          ]}
        />
      </Stack>
    </Stack>
  );
}
