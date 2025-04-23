/**
 * Automated Insights Dashboard Page Component
 * 
 * This page provides a comprehensive model performance and insights dashboard with:
 * - Model performance visualization and metrics
 * - Correct vs incorrect classification analysis
 * - Current metrics comparison and trends
 * - AI-powered insights and suggestions
 * - Model optimization capabilities
 * 
 * The dashboard uses RTK Query for data management and provides
 * real-time insights into model performance and optimization opportunities.
 */
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGetInsightsOfModelQuery } from '@/services/insightsService';
import {
  useGetCorrectEntriesByDayQuery,
  useGetDifferenceWeekCountByClassQuery,
  useGetEntriesCountByClassQuery,
  useGetLastModelMetricsByIdQuery,
  useGetMetricsComparisonLastMonthQuery,
  useGetNumberOfAlertsByTypeQuery,
} from '@/services/modelMetricsService';
import { useApplySuggestionsMutation, useUseOptimizedPromptMutation } from '@/services/modelsService';
import { useGetModelByIdQuery, useGetModelsQuery } from '@/services/modelsService';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { NewPromptComparison } from '@/components/dashboard/automated-insights/new-prompt-comparison.js';

import { parseTitle } from '@/lib/text';
import { CorrectVsIncorrectComparison } from '@/components/dashboard/analytics/correct-vs-incorrect-comparison';
import { ChatInsightsCard } from '@/components/dashboard/automated-insights/chat-insights-card';
import { CurrentMetricsChart } from '@/components/dashboard/automated-insights/current-metrics-chart';
import { MetricSummaryCard } from '@/components/dashboard/automated-insights/metric-summary-card';
import { PerformanceModal } from '@/components/dashboard/automated-insights/performance-modal';
import { ModelsSwitch } from '@/components/dashboard/layout/models-switch';

/**
 * Main automated insights dashboard page component
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters
 * @param {string} [props.searchParams.modelId] - Optional model ID from URL
 * @returns {JSX.Element} The automated insights dashboard interface
 */
export default function Page({ searchParams }) {
  // Modal and prompt state management
  const [open, setOpen] = React.useState(false);
  const [openNewPromptComparison, setOpenNewPromptComparison] = React.useState(false);
  const [newPrompt, setNewPrompt] = React.useState('');
  const { modelId } = searchParams;
  const router = useRouter();
  const path = usePathname();

  // RTK Query hooks for data fetching
  const { data: items, isLoading: isLoadingModels } = useGetModelsQuery();
  const { data: model, isLoading: isLoadingModel } = useGetModelByIdQuery(modelId, { skip: !modelId });
  const { data: insights, isLoading: isLoadingInsights } = useGetInsightsOfModelQuery(modelId, { skip: !modelId });
  const { data: correctEntriesByDay, isLoading: isLoadingCorrectEntriesByDay } = useGetCorrectEntriesByDayQuery(
    modelId,
    { skip: !modelId }
  );
  const { data: lastModelMetrics, isLoading: isLoadingLastModelMetrics } = useGetLastModelMetricsByIdQuery(modelId, {
    skip: !modelId,
  });
  const { data: entriesCountByClass, isLoading: isLoadingEntriesCountByClass } = useGetEntriesCountByClassQuery(
    modelId,
    { skip: !modelId }
  );
  const [applySuggestions, { isLoading: isLoadingApplySuggestions }] = useApplySuggestionsMutation();
  const [useOptimizedPrompt, { isLoading: isLoadingUseOptimizedPrompt }] = useUseOptimizedPromptMutation();
  const { data: differenceWeekCountByClass, isLoading: isLoadingDifferenceWeekCountByClass } =
    useGetDifferenceWeekCountByClassQuery(modelId, { skip: !modelId });
  const { data: metricsComparisonLastMonth, isLoading: isLoadingMetricsComparisonLastMonth } =
    useGetMetricsComparisonLastMonthQuery(modelId, { skip: !modelId });

  // Transform correct/incorrect entries data for visualization
  const correctVsIncorrectData = React.useMemo(() => {
    if (!correctEntriesByDay) return [];

    return Object.entries(correctEntriesByDay?.correctEntriesByDay)
      .slice(0, 15)
      .map(([date, value]) => ({
        date: new Date(date),
        correct: value || 0,
        incorrect: correctEntriesByDay?.incorrectEntriesByDay[date] || 0,
      }))
      .sort((a, b) => a.date - b.date);
  }, [correctEntriesByDay]);

  // Calculate correct entries for last week
  const correctLastWeek = React.useMemo(() => {
    if (!correctEntriesByDay) return 0;

    return Object.entries(correctEntriesByDay?.correctEntriesByDay)
      .slice(0, 7)
      .map(([date, value]) => value || 0)
      .reduce((a, b) => a + b, 0);
  }, [correctEntriesByDay]);

  // Calculate correct entries for current week
  const correctCurrentWeek = React.useMemo(() => {
    if (!correctEntriesByDay) return 0;
    return Object.entries(correctEntriesByDay?.correctEntriesByDay)
      .slice(7, 14)
      .map(([date, value]) => value || 0)
      .reduce((a, b) => a + b, 0);
  }, [correctEntriesByDay]);

  // Calculate correct entries for last month
  const correctLastMonth = React.useMemo(() => {
    if (!correctEntriesByDay) return 0;
    return Object.entries(correctEntriesByDay?.correctEntriesByDay)
      .slice(0, 30)
      .map(([date, value]) => value || 0)
      .reduce((a, b) => a + b, 0);
  }, [correctEntriesByDay]);

  // Calculate incorrect entries for last month
  const incorrectLastMonth = React.useMemo(() => {
    if (!correctEntriesByDay) return 0;
    return Object.entries(correctEntriesByDay?.incorrectEntriesByDay)
      .map(([date, value]) => value || 0)
      .reduce((a, b) => a + b, 0);
  }, [correctEntriesByDay]);

  // Auto-navigate to first model if none selected
  React.useEffect(() => {
    if (!modelId && items && items.length > 0) {
      router.push('/automated-insights?modelId=' + items[0]?.id);
    }
  }, [modelId, items]);

  // Calculate percentage difference between current and last week
  const differencePositiveCount = correctLastWeek > 0 ? ((correctCurrentWeek - correctLastWeek) / correctLastWeek * 100).toFixed(2) : 100;

  // Transform metrics comparison data for visualization
  const metrics = React.useMemo(() => {
    return Object.entries(metricsComparisonLastMonth || {}).map(([key, value]) => ({
      label: key,
      value: value?.currentMonth || 0,
    }));
  }, [metricsComparisonLastMonth]);

  // Handle applying AI suggestions to the model
  const applySuggestionsAction = async () => {
    const response = await applySuggestions(modelId);
    setNewPrompt(response?.data?.prompt);
    setOpenNewPromptComparison(true);
  };

  // Handle using the optimized prompt
  const useOptimizedPromptAction = async (modelId, newPrompt) => {
    const response = await useOptimizedPrompt({ modelId, newPrompt });
    setOpenNewPromptComparison(false);
    router.refresh();
  };

  return (
    <>
      {/* Loading overlay for apply suggestions action */}
      {isLoadingApplySuggestions && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Ensure it's on top of all other content
          }}
        >
          <CircularProgress size={80} />
        </Box>
      )}

      {/* Performance comparison modal */}
      <PerformanceModal data={metricsComparisonLastMonth || {}} open={open} setOpen={setOpen} />

      {/* New prompt comparison modal */}
      <NewPromptComparison
        id={model?.id}
        originalPrompt={model?.prompt}
        newPrompt={newPrompt}
        open={openNewPromptComparison}
        setOpen={setOpenNewPromptComparison}
        useOptimizedPrompt={useOptimizedPromptAction}
        modelId={modelId}
      />

      {/* Main dashboard container */}
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
          minHeight: '90vh', // Ensure the content fills the full height of the viewport
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing={4} sx={{ flex: 1, marginTop: '24px' }}>
          <Grid container spacing={3} alignItems="stretch">
            {/* Left Column */}
            <Grid xs={12} md={6}>
              <Stack spacing={3}>
                {/* Performance Graph */}
                <Grid xs={12} sx={{ width: '100%', padding: '0px' }}>
                  <CorrectVsIncorrectComparison
                    data={correctVsIncorrectData}
                    title="Model Performance (Last 15 Days)"
                    isLoading={isLoadingModel}
                    model={model}
                  />
                </Grid>

                {/* Metrics and Alerts Section */}
                <Grid container spacing={3}>
                  {/* Current Metrics Chart */}
                  <Grid xs={12} md={6} sx={{ height: '38vh' }}>
                    <CurrentMetricsChart metrics={metrics} setOpen={setOpen} />
                  </Grid>

                  {/* Metric summary cards */}
                  <Grid xs={12} md={6} sx={{ height: '38vh' }}>
                    <Stack spacing={3} sx={{ height: '100%' }}>
                      <MetricSummaryCard
                        title={'Correctly ' + (model?.parameters?.title || (
                          model?.problemType.includes('class') ? 'Classified' : 'Processed'
                        ) + ' Entries')}
                        leftValue={(correctLastMonth + incorrectLastMonth) > 0 ? ((correctLastMonth) / (correctLastMonth + incorrectLastMonth) * 100).toFixed(2) + '%' : '0%'}
                        leftSubtitle={'Correct Entries'}
                      />
                      <MetricSummaryCard
                        title={'Correctly ' + model?.parameters?.title + ' (30 Days)'}
                        leftValue={correctLastMonth}
                        leftSubtitle={'Correct'}
                        rightValue={incorrectLastMonth}
                        rightSubtitle={'Incorrect'}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid xs={12} md={6}>
              <ChatInsightsCard
                model={model}
                insights={insights?.map((ins) => ins.solution)}
                problems={insights?.map((ins) => ins.problem)}
                isLoading={isLoadingModel || isLoadingInsights}
                data={insights}
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
