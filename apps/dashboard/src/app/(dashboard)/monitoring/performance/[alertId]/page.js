/**
 * Performance Alert Details Page Component
 * 
 * This page provides a detailed view of model performance alerts with:
 * - Performance metrics and statistics
 * - Metric value comparisons
 * - Target value tracking
 * - AI model log analysis
 * - Detailed prediction context
 * 
 * The component uses RTK Query for data management and provides
 * comprehensive insights into model performance issues and predictions.
 */
'use client';

import * as React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useGetAlertByIdQuery } from '@/services/alertsService';
import { Card, Dialog, DialogContent, IconButton, Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { X as XIcon } from '@phosphor-icons/react';

import { parseInput, parseTitle } from '@/lib/text';
import { metricExplanations } from '@/components/dashboard/analytics/summary';
import { AvgMetricValue } from '@/components/dashboard/logistics/avg-metric-value';
import { MetricValue } from '@/components/dashboard/logistics/metric-value';
import { TargetValue } from '@/components/dashboard/logistics/target-value';
import { EntriesTable } from '@/components/dashboard/smart-feedback-loop/entries-table';
import { GoBackButton } from '@/components/widgets/buttons/go-back-button';
import { isCorrect } from '@/lib/evaluation';

/**
 * Loading state component for metric cards
 * Displays skeleton UI for performance metrics
 */
function MetricCardSkeleton() {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Skeleton variant="rectangular" width={120} height={24} />
        <Skeleton variant="rectangular" width="60%" height={60} />
        <Skeleton variant="text" width="40%" />
      </Stack>
    </Card>
  );
}

/**
 * Loading state component for entries table
 * Displays skeleton UI for model predictions and logs
 */
function EntriesTableSkeleton() {
  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Skeleton variant="rectangular" width={200} height={32} />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={120} height={40} />
            <Skeleton variant="rectangular" width={120} height={40} />
          </Stack>
        </Stack>
        {[1, 2, 3, 4, 5].map((item) => (
          <Stack key={item} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="rectangular" width={100} height={36} />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

/**
 * Main performance alert details page component
 * Handles performance metrics display, predictions, and analysis
 * @returns {JSX.Element} The performance alert details interface
 */
export default function Page() {
  // Extract URL parameters
  const searchParamsObj = useSearchParams();
  const params = useParams();
  const { alertId } = params;
  const searchParams = { type: searchParamsObj.get('type'), sortDir: searchParamsObj.get('sortDir') };
  const modal = searchParamsObj.get('modal');
  const entryId = searchParamsObj.get('entryId');

  // Fetch alert data using RTK Query
  const { data, error, isLoading } = useGetAlertByIdQuery(alertId);

  // State management for selected entry
  const [entryData, setEntryData] = React.useState({});

  /**
   * Update entry data when entryId changes
   * Finds and sets the selected entry from the logs
   */
  React.useEffect(() => {
    if (entryId) {
      const entry = data?.data?.logs.find((log) => log.id == entryId);
      setEntryData(entry);
    }
  }, [data, entryId]);

  const router = useRouter();

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
          <Stack spacing={1}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <div>
                <Skeleton variant="rectangular" width={300} height={32} />
              </div>
              <div>
                <Skeleton variant="rectangular" width={150} height={40} />
              </div>
            </div>
            <Skeleton
              variant="text"
              width="70%"
              sx={{ marginTop: '20px' }}
            />
          </Stack>

          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Performance Metrics */}
            <Grid md={4} xs={12}>
              <MetricCardSkeleton />
            </Grid>
            <Grid md={4} xs={12}>
              <MetricCardSkeleton />
            </Grid>
            <Grid md={4} xs={12}>
              <MetricCardSkeleton />
            </Grid>
            {/* Log Analysis Section */}
            <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
              <Skeleton variant="rectangular" width={200} height={32} />
            </Grid>
            <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
              <EntriesTableSkeleton />
            </Grid>
          </Grid>
        </Stack>
      </Box>
    );
  }

  return (
    <>
      {/* Prediction Details Modal */}
      {entryData && (
        <Dialog fullWidth maxWidth="lg" open={entryData && modal == 'true'} sx={{}}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* Modal Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="h5" mb={6}>
                  {isCorrect(entryData) ? 'Correct' : 'Incorrect'} Model Prediction
                </Typography>{' '}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={() => {
                  const originalParams = new URLSearchParams(window.location.search);
                  originalParams.delete('modal');
                  originalParams.delete('entryId');
                  const originalRoute = window.location.pathname;
                  return router.push(`${originalRoute}?${originalParams.toString() ? `${originalParams.toString()}&` : ''}`, {
                    scroll: false,
                  });
                }}>
                  <XIcon />
                </IconButton>
              </Box>
            </Stack>

            {/* Modal Content */}
            <Stack spacing={2}>
              <Grid container spacing={4} style={{ height: '100%' }} alignItems="stretch">
                {
                  <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
                    <Card
                      sx={{
                        padding: '2vmax',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '250px',
                        overflow: 'scroll',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                        Context:
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                        {parseInput(entryData?.input, 0, -1)}
                      </Typography>
                    </Card>
                  </Grid>
                }
                <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Card
                    sx={{
                      padding: '2vmax',
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      maxHeight: '350px',
                      overflow: 'scroll',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                      Input:
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                      {parseInput(entryData?.input, -1, 1)}
                    </Typography>
                  </Card>
                </Grid>

                {/* Output Section */}
                <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Card
                    sx={{
                      padding: '2vmax',
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      maxHeight: '350px',
                      overflow: 'scroll',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                      Output:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        flexGrow: 1,
                      }}
                    >
                      {parseInput(entryData?.output)}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
        </Dialog>
      )}

      {/* Main Content */}
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
          <Stack spacing={1}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <div>
                <Typography variant="h4">{parseTitle(data?.data?.modelMetric || '')} Metric Alert</Typography>
              </div>
              <div>
                <Stack direction="row" spacing={2} alignItems="center">
                  <GoBackButton buttonTitle={'Model Monitoring'} onClick={() => {
                    router.push(
                      `/monitoring/${data?.modelId}`,
                      { scroll: false }
                    )
                  }} />
                </Stack>
              </div>
            </div>
            <Typography
              variant="body2"
              color="textSecondary"
              paragraph
              sx={{
                marginTop: '20px',
              }}
            >
              {metricExplanations[data?.data?.modelMetric]}
            </Typography>
          </Stack>

          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Performance Metrics */}
            <Grid md={4} xs={12}>
              <MetricValue amount={data?.data?.value || 0} title={parseTitle(data?.data?.modelMetric || '')} />
            </Grid>
            <Grid md={4} xs={12}>
              <AvgMetricValue amount={data?.data?.avgValue || 0} title={parseTitle(data?.data?.modelMetric || '')} />
            </Grid>
            <Grid md={4} xs={12}>
              <TargetValue amount={0.95} title={parseTitle(data?.data?.modelMetric || '')} />
            </Grid>

            {/* Log Analysis Section */}
            <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
              <Typography variant="h5" gutterBottom>
                AI Model Log Analysis
              </Typography>
            </Grid>
            <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
              <Stack>
                <EntriesTable rows={data?.data?.logs || []} id={''} reviewed searchParams={searchParams} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
