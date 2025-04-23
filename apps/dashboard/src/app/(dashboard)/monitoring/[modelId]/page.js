/**
 * Model Monitoring Dashboard Page Component
 * 
 * This page provides a comprehensive monitoring interface for individual models with:
 * - Performance metrics and trends
 * - System health monitoring
 * - Error tracking and alerts
 * - Geographic and device analytics
 * - Real-time status updates
 * 
 * The component uses RTK Query for data management and provides
 * detailed insights into model performance and system health.
 */
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetModelMetricsByIdQuery } from '@/services/modelMetricsService';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Card, Skeleton } from '@mui/material';

import { CountrySessionsVsBounceRate } from '@/components/dashboard/analytics/country-sessions-vs-bounce-rate';
import { Devices } from '@/components/dashboard/analytics/devices';
import { Summary } from '@/components/dashboard/analytics/summary';
import { AlertsTable } from '@/components/dashboard/logistics/alerts-table';
import { GoBackButton } from '@/components/widgets/buttons/go-back-button';
import { event } from '@/lib/gtag';
import { useUser } from '@/hooks/use-user';

/**
 * Loading state component for the summary section
 * Displays skeleton UI for metrics and statistics
 */
function SummarySkeleton() {
  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Stack spacing={1}>
            <Skeleton variant="rectangular" width={120} height={24} />
            <Skeleton variant="rectangular" width="60%" height={60} />
            <Skeleton variant="text" width="40%" />
          </Stack>
        </Grid>
        {[1, 2, 3].map((item) => (
          <Grid key={item} xs={12} md={4}>
            <Stack spacing={1}>
              <Skeleton variant="rectangular" width={100} height={24} />
              <Skeleton variant="rectangular" width="40%" height={60} />
              <Skeleton variant="text" width="30%" />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

/**
 * Loading state component for chart sections
 * Displays skeleton UI for analytics charts
 */
function ChartSkeleton() {
  return (
    <Box sx={{ width: '100%', height: 400, p: 3 }}>
      <Stack spacing={2}>
        <Skeleton variant="rectangular" width={200} height={32} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Stack>
    </Box>
  );
}

/**
 * Loading state component for the alerts table
 * Displays skeleton UI for alerts and notifications
 */
function AlertsTableSkeleton() {
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Skeleton variant="rectangular" width={200} height={32} />
      {[1, 2, 3, 4].map((item) => (
        <Stack key={item} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Stack>
          <Skeleton variant="rectangular" width={100} height={36} />
        </Stack>
      ))}
    </Stack>
  );
}

/**
 * Main model monitoring page component
 * Handles model metrics display, alerts, and analytics
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters
 * @returns {JSX.Element} The model monitoring dashboard interface
 */
export default function Page({ searchParams }) {
  // Extract model ID from URL parameters
  const params = useParams();
  const { modelId } = params;
  const router = useRouter();
  const { user } = useUser();

  // Fetch model metrics data using RTK Query
  const { data, error, isLoading } = useGetModelMetricsByIdQuery(modelId);

  // Transform alerts data for display
  const transformedAlerts = [
    ...(data?.groupedAlerts?.metricAlerts || []),
    ...Object.keys(data?.groupedAlerts?.errorAlerts || {}).map(
      (key) =>
        ({
          type: 'error',
          totalErrors: data?.groupedAlerts?.errorAlerts[key]?.totalErrors,
          message: key,
          errorsByHour: data?.groupedAlerts?.errorAlerts[key]?.errorsByHour,
          errors: data?.groupedAlerts?.errorAlerts[key]?.errors,
        }) || []
    ),
  ];

  /**
   * Track monitoring page view for analytics
   * Records user interaction with the monitoring dashboard
   */
  const trackMontioringView = () => {
    event({
      action: 'monitoring_view',
      params: { modelId: modelId, email: user?.email, user: user?.id },
    });
  };

  // Loading state UI
  if (isLoading) {
    return (
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing={4}>
          {/* Header Section */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Skeleton variant="rectangular" width={200} height={32} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Skeleton variant="rectangular" width={150} height={40} />
            </Box>
          </Stack>

          {/* Main Content Grid */}
          <Grid container spacing={4} style={{ height: '100%' }} alignItems="stretch">
            {/* Summary Section */}
            <Grid xs={12}>
              <Card>
                <SummarySkeleton />
              </Card>
            </Grid>

            {/* Analytics Charts */}
            <Grid lg={7} xs={12}>
              <Card>
                <ChartSkeleton />
              </Card>
            </Grid>

            {/* Device Analytics */}
            <Grid lg={5} xs={12}>
              <Card>
                <Box sx={{ p: 3, height: 400 }}>
                  <Stack spacing={2}>
                    <Skeleton variant="rectangular" width={150} height={24} />
                    <Skeleton variant="circular" width={300} height={300} sx={{ alignSelf: 'center' }} />
                  </Stack>
                </Box>
              </Card>
            </Grid>

            {/* Alerts Table */}
            <Grid xs={12}>
              <Card>
                <AlertsTableSkeleton />
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing={4}>
        {/* Header Section */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">{data?.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <GoBackButton buttonTitle={'Monitoring Overview'} onClick={() => router.push(`/monitoring`)} />
          </Box>
        </Stack>

        {/* Main Content Grid */}
        <Grid container spacing={4} style={{ height: '100%' }} alignItems="stretch">
          {/* Performance Summary Section */}
          <Grid
            xs={12}
            sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', display: 'flex', flexDirection: 'column' }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <Summary
              systemAlerts={data?.numberOfAlertsByTypeThisMonth?.error || 0}
              differenceSystemAlerts={data?.differenceAlertsByType?.error || 0}
              metric1={data?.avgModelMetricsCurrentMonth[Object.keys(data?.lastModelMetrics)[0]] || 0}
              metric2={data?.avgModelMetricsCurrentMonth[Object.keys(data?.lastModelMetrics)[1]] || 0}
              metric3={data?.avgModelMetricsCurrentMonth[Object.keys(data?.lastModelMetrics)[2]] || 0}
              metricLabel1={
                data?.lastModelMetrics[Object.keys(data?.lastModelMetrics)[0]]?.label[0].toUpperCase() +
                data?.lastModelMetrics[Object.keys(data?.lastModelMetrics)[0]]?.label.slice(1) || 'Accuracy'
              }
              metricLabel2={
                data?.lastModelMetrics[Object.keys(data?.lastModelMetrics)[1]]?.label[0].toUpperCase() +
                data?.lastModelMetrics[Object.keys(data?.lastModelMetrics)[1]]?.label.slice(1) || 'F1'
              }
              metricLabel3={
                data?.lastModelMetrics[Object.keys(data?.lastModelMetrics)[2]]?.label[0].toUpperCase() +
                data?.lastModelMetrics[Object.keys(data?.lastModelMetrics)[2]]?.label.slice(1) || 'Recall'
              }
              differenceMetric1={data?.differenceModelMetrics[Object.keys(data?.lastModelMetrics)[0]] || 0}
              differenceMetric2={data?.differenceModelMetrics[Object.keys(data?.lastModelMetrics)[1]] || 0}
              differenceMetric3={data?.differenceModelMetrics[Object.keys(data?.lastModelMetrics)[2]] || 0}
            />
          </Grid>

          {/* Performance Trends Chart */}
          <Grid
            lg={7}
            xs={12}
            sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', display: 'flex', flexDirection: 'column' }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <CountrySessionsVsBounceRate
              data={
                Object.keys(data?.lastModelMetrics || {})
                  .map((key) => ({
                    label: data?.lastModelMetrics[key]?.label,
                    v1: (data?.avgModelMetricsCurrentMonth[key] || 0) * 100.0,
                    v2: (data?.avgModelMetricsLastMonth[key] || 0) * 100.0,
                  })) || []
              }
            />
          </Grid>

          {/* System Health Chart */}
          <Grid lg={5} xs={12}>
            <Devices
              data={[
                { name: 'Outage', value: data?.lastHealthErrorDays || 0, color: 'var(--mui-palette-error-300)' },
                {
                  name: 'Stable',
                  value: 30 - ((data?.lastHealthErrorDays || 0) - (data?.lastHealthWarningDays || 0)),
                  color: 'var(--mui-palette-success-200)',
                },
                { name: 'Unstable', value: data?.lastHealthWarningDays || 0, color: 'var(--mui-palette-warning-200)' },
              ]}
            />
          </Grid>

          {/* Alerts and Notifications Table */}
          <Grid xs={12}>
            <AlertsTable rows={transformedAlerts || []} id={modelId} searchParams={searchParams} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
