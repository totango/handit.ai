/**
 * Model Refinement Dashboard Page Component
 * 
 * This page provides a comprehensive interface for model refinement and A/B testing with:
 * - Model performance comparison
 * - A/B testing visualization
 * - Prompt comparison analysis
 * - Entry performance tracking
 * - Real-time metrics and statistics
 * 
 * The component uses RTK Query for data management and provides
 * a user-friendly interface for model optimization analysis.
 */
'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useGetModelByIdQuery, useGetModelsQuery } from '@/services/modelsService';
import {
  useGetABCorrectEntriesByDayQuery,
  useGetABMetricsFullDateQuery,
  useGetABPromptsQuery,
  useGetModelOptimizedQuery,
  useGetRandomABTestQuery,
  useGetReferenceLinesQuery,
} from '@/services/monitoringService'; // Import the RTK query hook

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowRightIcon } from '@mui/x-date-pickers';
import { ChartLine, ShoppingBag, Target } from '@phosphor-icons/react';

import { onModelChange } from '@/lib/routeHelper';
import { CorrectInferenceComparison } from '@/components/dashboard/analytics/correct-inference-comparison.js';
import { ModelsSwitch } from '@/components/dashboard/layout/models-switch';
import { EntriesComparisonModal } from '@/components/dashboard/modelRefinement/entires-comparison-modal.js';
import { PromptComparisonModal } from '@/components/dashboard/modelRefinement/prompt-comparison-modal.js';
import { StatABCard } from '@/components/dashboard/modelRefinement/stat-ab-card';
import { HelperWidget } from '@/components/dashboard/overview/helper-widget';
import { CustomSignOut } from '@/components/dashboard/layout/user-popover/custom-sign-out';
import { authClient } from '@/lib/auth/custom/client';
import { useUser } from '@/hooks/use-user';

/**
 * Main model refinement dashboard page component
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters
 * @param {string} props.searchParams.modelId - ID of the selected model
 * @returns {JSX.Element} The model refinement dashboard interface
 */
export default function Page({ searchParams }) {
  // Extract and process URL parameters
  const searchParamsObj = useSearchParams();
  const { modelId } = searchParams;
  let page = searchParamsObj.get('page');
  let pageSize = searchParamsObj.get('rowsPerPage');
  let type = searchParamsObj.get('type');

  // Set default values for pagination and filtering
  page = page || 1;
  pageSize = pageSize || 5;
  type = type || 'unverified';

  // Navigation and authentication utilities
  const router = useRouter();
  const { checkSession } = useUser();
  const path = usePathname();

  // Fetch available models
  const { data: items, error: errorModels, isLoading: isLoadingModel, refetch: refetchModels } = useGetModelsQuery();

  // State for correct entries data
  const [correctEntries, setCorrectEntries] = React.useState([]);

  // Fetch A/B testing data
  const { data: correctEntriesByDay, isLoading: isLoadingCorrectEntriesByDay } = useGetABCorrectEntriesByDayQuery(
    modelId,
    { skip: !modelId }
  );

  // Fetch optimized model data
  const {
    data: optimizedModel,
    error: errorOptimizedModel,
    isLoading: isLoadingOptimizedModel,
    refetch: refetchOptimizedModel
  } = useGetModelOptimizedQuery(modelId, { skip: !modelId });

  // Fetch additional model data
  const { data: prompts, isLoading: isLoadingPrompts } = useGetABPromptsQuery(modelId, { skip: !modelId });
  const { data: metricsFullDate, isLoading: isLoadingMetricsFullDate } = useGetABMetricsFullDateQuery(modelId, {
    skip: !modelId,
  });
  const { data: referenceLines, isLoading: isLoadingReferenceLines } = useGetReferenceLinesQuery(modelId, {
    skip: !modelId,
  });

  // Modal state management
  const [openComparison, setOpenComparison] = React.useState(false);
  const [openEntriesComparison, setOpenEntriesComparison] = React.useState(false);
  const [graphType, setGraphType] = React.useState('Correct');

  // Fetch random A/B test entry
  const {
    data: entry,
    refetch,
  } = useGetRandomABTestQuery(modelId, { skip: !modelId });

  // Auto-navigate to first A/B test model if none selected
  React.useEffect(() => {
    if (!modelId && items && items.length > 0) {
      router.push('/model-refinement?modelId=' + items.filter((model) => model.ab)[0]?.id);
    }
  }, [modelId, items]);

  /**
   * Handles user sign out process
   * Signs out the user and checks session status
   */
  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      console.error('Error signing out', error);
    }
    await checkSession?.();
  };

  // Handle authentication errors
  React.useEffect(() => {
    if (errorModels) {
      handleSignOut();
    }
  }, [errorModels]);

  // Process and transform correct entries data
  React.useEffect(() => {
    if (correctEntriesByDay) {
      const baseCorrectEntries =
        graphType === 'Correct'
          ? correctEntriesByDay?.baseModelMetric?.correctEntriesByDay
          : correctEntriesByDay?.baseModelMetric?.incorrectEntriesByDay;
      const optimizedCorrectEntries =
        graphType === 'Correct'
          ? correctEntriesByDay?.optimizedModelMetric?.correctEntriesByDay
          : correctEntriesByDay?.optimizedModelMetric?.incorrectEntriesByDay;

      // Sort entries by date
      const keys = Object.keys(baseCorrectEntries);
      keys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      // Transform data for graph visualization
      const dataForGraph = keys.map((entry) => ({
        date: entry,
        base: baseCorrectEntries[entry],
        optimized: optimizedCorrectEntries ? optimizedCorrectEntries[entry] : 0,
      }));

      setCorrectEntries(dataForGraph);
    }
  }, [correctEntriesByDay, graphType]);

  // Fetch model details
  const { data: model, error, isLoading } = useGetModelByIdQuery(modelId, { skip: !modelId });

  /**
   * Fetches a new random A/B test entry
   * Used for refreshing the comparison data
   */
  const fetchEntry = async () => {
    try {
      refetch();
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  // Fetch initial entry on model selection
  React.useEffect(() => {
    fetchEntry();
  }, [modelId]);

  return (
    <>
      {/* Comparison modals */}
      <PromptComparisonModal
        originalPrompt={prompts?.basePrompt}
        optimizedPrompt={prompts?.optimizedPrompt}
        open={openComparison}
        setOpen={setOpenComparison}
      />
      <EntriesComparisonModal
        originalEntry={entry?.original}
        optimizedEntry={entry?.optimized}
        open={openEntriesComparison}
        setOpen={setOpenEntriesComparison}
        changeEntries={fetchEntry}
      />

      {/* Main dashboard layout */}
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Model selector */}
        <ModelsSwitch
          onModelChange={(modelId) => onModelChange(path, router, modelId)}
          modelId={modelId}
        />

        <Stack spacing={4} sx={{ flex: 1, marginTop: '24px' }}>
          <Grid container style={{ height: '100%' }} alignItems="stretch">
            {/* Main statistics card */}
            <Grid
              md={9}
              xs={12}
              sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', display: 'flex', flexDirection: 'column' }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <StatABCard optimizedModel={optimizedModel} model={model} data={metricsFullDate} isLoading={isLoadingMetricsFullDate} referenceLines={referenceLines} />
            </Grid>

            {/* Helper widgets */}
            <Grid
              md={3}
              xs={12}
              sx={{
                paddingRight: '1vmax',
                paddingLeft: '1vmax',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '460px',
              }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {/* Performance insights widget */}
              <HelperWidget
                action={
                  <Button
                    color="secondary"
                    endIcon={<ArrowRightIcon />}
                    size="small"
                    onClick={() => setOpenComparison(true)}
                    disabled={!model}
                  >
                    See Comparison
                  </Button>
                }
                description=""
                icon={ChartLine}
                label="Performance"
                title="Prompt Comparison Insights"
                padding={5}
              />

              {/* A/B testing widget */}
              <HelperWidget
                action={
                  <Button
                    color="secondary"
                    endIcon={<ArrowRightIcon />}
                    size="small"
                    onClick={() => setOpenEntriesComparison(true)}
                    disabled={!model}
                  >
                    See Entries
                  </Button>
                }
                description=""
                icon={Target}
                label="Entries"
                title="Entry Performance A/B Test"
                padding={5}
              />
            </Grid>

            {/* Correct inference comparison chart */}
            <Grid
              md={12}
              xs={12}
              sx={{
                paddingRight: '1vmax',
                paddingLeft: '1vmax',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '30px',
              }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <CorrectInferenceComparison
                data={correctEntries}
                type={graphType}
                setType={setGraphType}
                title={model?.parameters?.title}
                isLoading={isLoadingCorrectEntriesByDay}
              />
            </Grid>
          </Grid>
          <Grid container></Grid>
        </Stack>
      </Box>
    </>
  );
}
