/**
 * Error Alert Details Page Component
 * 
 * This page provides a detailed view of individual error alerts with:
 * - Error statistics and trends
 * - Temporal analysis (daily/hourly breakdowns)
 * - Detailed error logs and history
 * - Error metadata and context
 * - Expandable error details
 * 
 * The component uses RTK Query for data management and provides
 * comprehensive insights into error patterns and occurrences.
 */
'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGetAlertByIdQuery } from '@/services/alertsService';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Breadcrumbs, Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from '@/paths';
import { BreadcrumbsSeparator } from '@/components/core/breadcrumbs-separator';
import { VehiclesOverview } from '@/components/dashboard/logistics/vehicles-overview';
import { GoBackButton } from '@/components/widgets/buttons/go-back-button';

/**
 * Loading state component for chart sections
 * Displays skeleton UI for analytics charts
 */
function ChartSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" width={200} height={32} />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Loading state component for error logs section
 * Displays skeleton UI for error history and details
 */
function ErrorLogsSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Skeleton variant="rectangular" width={150} height={32} />
            <Skeleton variant="text" width="80%" />
          </Stack>

          {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item} sx={{ mb: 1, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="circular" width={32} height={32} />
                </Stack>
                <Stack spacing={2} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                  <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((subItem) => (
                      <Grid key={subItem} item xs={12} md={6} sx={{ bgcolor: '#f8f8f8', p: 1 }}>
                        <Skeleton variant="text" width="90%" />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Stack>
            </Box>
          ))}
          <Skeleton variant="rectangular" width={120} height={36} />
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Main error alert details page component
 * Handles error statistics display, logs, and analytics
 * @returns {JSX.Element} The error alert details interface
 */
export default function Page() {
  // Extract alert ID from URL parameters
  const params = useParams();
  const { alertId } = params;

  // Fetch alert data using RTK Query
  const { data, error, isLoading } = useGetAlertByIdQuery(alertId);

  // State management for expandable error logs
  const [expanded, setExpanded] = React.useState(null);
  const [visibleLogs, setVisibleLogs] = React.useState(5);

  /**
   * Handle expansion of error log details
   * @param {string} id - ID of the error log to expand/collapse
   */
  const handleExpandClick = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  /**
   * Get background color based on error severity
   * @param {string} severity - Error severity level
   * @returns {string} CSS color value
   */
  const severityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'var(--mui-palette-error-100)';
      case 'warning':
        return 'var(--mui-palette-warning-100)';
      case 'info':
      default:
        return 'var(--mui-palette-success-100)';
    }
  };

  /**
   * Get text color based on error severity
   * @param {string} severity - Error severity level
   * @returns {string} CSS color value
   */
  const severityColorText = (severity) => {
    switch (severity) {
      case 'critical':
        return 'var(--mui-palette-error-main)';
      case 'warning':
        return 'var(--mui-palette-warning-main)';
      case 'info':
      default:
        return 'var(--mui-palette-success-main)';
    }
  };

  // Sample chart data for visualization
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 50),
  }));

  /**
   * Load more error logs
   * Increases the number of visible logs by 5
   */
  const handleLoadMore = () => {
    setVisibleLogs((prev) => prev + 5);
  };

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
                <Skeleton variant="rectangular" width={400} height={32} />
              </div>
              <div>
                <Skeleton variant="rectangular" width={150} height={40} />
              </div>
            </div>
          </Stack>

          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Daily Error Trends */}
            <Grid md={6} xs={12}>
              <ChartSkeleton />
            </Grid>
            {/* Hourly Error Trends */}
            <Grid md={6} xs={12}>
              <ChartSkeleton />
            </Grid>
            {/* Error Logs */}
            <Grid xs={12}>
              <ErrorLogsSkeleton />
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
        <Stack spacing={1}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            <div>
              <Typography variant="h4">
                {data?.alert?.title || 'Http Error'} - {data?.alert?.data?.status || 500} Status
              </Typography>
            </div>
            <div>
              <Stack direction="row" spacing={2} alignItems="center">
                <GoBackButton buttonTitle={'Model Monitoring'} onClick={() => router.back()} />
              </Stack>
            </div>
          </div>
        </Stack>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Daily Error Distribution */}
          <Grid md={6} xs={12}>
            <VehiclesOverview fullData={data?.grouped?.errorsByDay} />
          </Grid>
          {/* Hourly Error Distribution */}
          <Grid md={6} xs={12}>
            <VehiclesOverview fullData={data?.grouped?.errorsByHour} type={'hour'} />
          </Grid>
          {/* Error Logs Section */}
          <Grid xs={12}>
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" gutterBottom>
                    Issues
                  </Typography>
                </Stack>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Detailed history of errors related to this alert, including information such as the status, message,
                  and endpoint of each error.
                </Typography>

                {/* Error Logs List */}
                {(data?.grouped?.errors || []).slice(0, visibleLogs).map((log) => (
                  <Box key={log.id} sx={{ mb: 1, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1 }}>
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        Error ID: {log.id} - Model Status: "{log.data.status}" -{' '}
                        {new Date(log.createdAt).toLocaleDateString()}
                      </Typography>
                      <IconButton
                        onClick={() => handleExpandClick(log.id)}
                        aria-expanded={expanded === log.id}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Stack>
                    {/* Expandable Error Details */}
                    <Collapse in={expanded === log.id} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6} sx={{ bgcolor: '#f0f8ff', p: 1 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Status:</strong> {log?.data?.status}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6} sx={{ bgcolor: '#f0f8ff', p: 1 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Error Message:</strong> {log?.data?.message}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6} sx={{ bgcolor: '#f8f8f8', p: 1 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Endpoint:</strong> {log?.data?.endpoint}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6} sx={{ bgcolor: '#f8f8f8', p: 1 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Full Output:</strong> {log?.data?.output}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Box>
                ))}
                {/* Load More Button */}
                {(data?.grouped?.errors || []).length > visibleLogs && (
                  <Button variant="text" onClick={handleLoadMore} sx={{ mt: 2 }}>
                    Show more logs
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
