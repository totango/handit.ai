/**
 * @fileoverview Evaluation Hub Page Component
 * 
 * This is the main page component for the Evaluation Hub feature. It provides
 * the layout and container for the evaluation hub table and any future
 * additional components.
 * 
 * The page follows the dashboard layout pattern and provides a consistent
 * user experience with other dashboard pages.
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { EvaluationHubTable } from '@/components/dashboard/evaluation-hub/evaluation-hub-table';
import NewEvaluatorDrawer from '@/components/dashboard/evaluation-hub/NewEvaluatorDrawer';
import { useCreateEvaluationPromptMutation } from '@/services/reviewersTemplateService';

/**
 * Evaluation Hub Page Component
 * 
 * @component
 * @returns {JSX.Element} The rendered evaluation hub page
 * 
 * @description
 * This component serves as the main container for the Evaluation Hub feature.
 * It provides:
 * - Consistent layout with other dashboard pages
 * - Proper spacing and padding
 * - Container for the evaluation hub table
 */
export default function EvaluationHubPage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [createEvaluationPrompt] = useCreateEvaluationPromptMutation();

  React.useEffect(() => {
    const handler = () => setDrawerOpen(true);
    window.addEventListener('openNewEvaluator', handler);
    return () => window.removeEventListener('openNewEvaluator', handler);
  }, []);

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);
  const handleCreateEvaluator = async (data) => {
    await createEvaluationPrompt(data);
    setDrawerOpen(false);
  };

  return (
    <Box
      sx={{
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
        py: 8,
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        pb: '0px !important',
      }}
    >
      {/* Main content container */}
      <Box sx={{ px: 2, pb: 4, pt: 4, paddingRight: 0 }}>
        <EvaluationHubTable onNewEvaluator={handleOpenDrawer} />
      </Box>
      <NewEvaluatorDrawer open={drawerOpen} onClose={handleCloseDrawer} onCreate={handleCreateEvaluator} />
    </Box>
  );
} 