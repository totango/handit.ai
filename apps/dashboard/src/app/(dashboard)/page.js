/**
 * Dashboard Overview Page Component
 * 
 * This component serves as the main dashboard overview with:
 * - Performance metrics and statistics
 * - Model monitoring and management
 * - Dataset management
 * - Sandbox environment handling
 * 
 * The page provides a comprehensive view of system performance,
 * model health, and quick access to key management features.
 */
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAddEmailMutation } from '@/services/dashboardService';
import { useGetOverviewQuery } from '@/services/kpiService';
import { useGetModelsMetricsQuery } from '@/services/modelMetricsService';
import { Card, CardContent, CardHeader, Modal, Skeleton, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Database, Eye, Info, WarningDiamond } from '@phosphor-icons/react';
import { ChartLineUp, ShoppingBag } from '@phosphor-icons/react/dist/ssr';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Warning as WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';

import { paths } from '@/paths';
import { event } from '@/lib/gtag';
import { isSandboxPage } from '@/lib/sandbox';
import { useUser } from '@/hooks/use-user';
import { AppUsage } from '@/components/dashboard/overview/app-usage';
import { HelperWidget } from '@/components/dashboard/overview/helper-widget';
import { Subscriptions } from '@/components/dashboard/overview/subscriptions';
import { Summary } from '@/components/dashboard/overview/summary';

/**
 * Loading state component for summary cards
 * Displays skeleton UI elements while data is being fetched
 * @returns {JSX.Element} The skeleton loading state for summary cards
 */
function SummarySkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={120} />
          </Stack>
          <Stack spacing={1}>
            <Skeleton variant="text" width="60%" height={40} />
            <Stack direction="row" spacing={1} alignItems="center">
              <Skeleton variant="text" width={40} />
              <Skeleton variant="text" width={60} />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Main dashboard overview page component
 * Provides a comprehensive view of system performance and management features
 * @returns {JSX.Element} The dashboard overview interface
 */
export default function Page() {
  // Router and state management
  const router = useRouter();
  const [openPopup, setOpenPopup] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const { user } = useUser();

  React.useEffect(() => {
    router.push(paths.dashboard.agentsMonitoring);
  }, []);

  const [addemail, { isLoading: isAddingEmail, error: addEmailError }] = useAddEmailMutation();

  // Analytics tracking
  const trackDashboardView = () => {
    event({
      action: 'dashboard_view',
      params: { email: user?.email, user: user?.id },
    });
  };

  // Effects
  React.useEffect(() => {
    router.push(paths.dashboard.agentsMonitoring);
  }, []);

  React.useEffect(() => {
    trackDashboardView();
  }, []);

  React.useEffect(() => {
    const isSandbox = isSandboxPage(window);
    const emailCaptured = localStorage.getItem('emailCaptured');
    if (isSandbox && !emailCaptured) {
      setOpenPopup(true);
    }
  }, []);

  // Email submission handler
  const handleEmailSubmit = async () => {
    if (email) {
      localStorage.setItem('emailCaptured', 'true');
      await addemail({ email });
      setOpenPopup(false);
    }
  };

  // Loading state
  if (true) {
    return (
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          {/* Header Section */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Skeleton variant="text" width={200} height={40} />
            </Box>
          </Stack>

          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Summary Cards */}
            {[1, 2, 3].map((item) => (
              <Grid key={item} md={4} xs={12}>
                <SummarySkeleton />
              </Grid>
            ))}

            {/* Charts and Subscriptions */}
            <div container style={{ display: 'flex', width: '100%' }}>
              <Grid md={8} xs={12}>
                <Card>
                  <CardHeader
                    title={<Skeleton variant="text" width="40%" />}
                    subheader={<Skeleton variant="text" width="30%" />}
                  />
                  <CardContent>
                    <Skeleton variant="rectangular" height={300} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid md={4} xs={12}>
                <Card>
                  <CardHeader
                    title={<Skeleton variant="text" width="60%" />}
                    subheader={<Skeleton variant="text" width="40%" />}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      {[1, 2, 3, 4].map((item) => (
                        <Stack key={item} direction="row" spacing={2} alignItems="center">
                          <Skeleton variant="circular" width={32} height={32} />
                          <Stack spacing={0.5} flex={1}>
                            <Skeleton variant="text" width="70%" />
                            <Skeleton variant="text" width="40%" />
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </div>

            {/* Helper Widgets */}
            {[1, 2, 3].map((item) => (
              <Grid key={item} md={4} xs={12}>
                <Card>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Stack spacing={0.5} flex={1}>
                          <Skeleton variant="text" width="50%" />
                          <Skeleton variant="text" width="30%" />
                        </Stack>
                      </Stack>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="rectangular" width={120} height={36} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    );
  }

  // Main dashboard view
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        {/* Header Section */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Overview</Typography>
          </Box>
        </Stack>

        {/* Main Content Grid */}
        <Grid container spacing={4}>
          {/* Performance Metrics */}
          <Grid md={4} xs={12}>
            {/* Model Entries Summary */}
          </Grid>
          <Grid md={4} xs={12}>
            {/* Performance Alerts Summary */}
          </Grid>
          <Grid md={4} xs={12}>
            {/* System Failure Alerts Summary */}
          </Grid>

          {/* Charts and Subscriptions */}
          <div container style={{ display: 'flex', width: '100%' }}>
            <Grid md={8} xs={12}>
              {/* App Usage Chart */}
            </Grid>
            <Grid md={4} xs={12}>
              {/* Subscriptions List */}
            </Grid>
          </div>

          {/* Helper Widgets */}
          <Grid md={4} xs={12}>
            <HelperWidget
              action={
                <Button
                  color="secondary"
                  endIcon={<ArrowRightIcon />}
                  size="small"
                  onClick={() => {
                    router.push(paths.dashboard.agentsMonitoring);
                  }}
                >
                  Monitor Agents
                </Button>
              }
              description="Visit the Smart Optimization section for intelligent model optimization and comparison."
              icon={ChartLineUp}
              label="Model Monitoring"
              title="Optimize and Compare Your Models"
            />
          </Grid>
          <Grid md={4} xs={12}>
            <HelperWidget
              action={
                <Button
                  color="secondary"
                  endIcon={<ArrowRightIcon />}
                  size="small"
                  onClick={() => {
                    router.push(paths.dashboard.models);
                  }}
                >
                  Manage Models
                </Button>
              }
              description="Effortlessly create new models or modify existing ones to fit your needs."
              icon={ShoppingBag}
              label="Models"
              title="Manage and Optimize Your Models"
            />
          </Grid>
          <Grid md={4} xs={12}>
            <HelperWidget
              action={
                <Button
                  color="secondary"
                  endIcon={<ArrowRightIcon />}
                  size="small"
                  onClick={() => {
                    router.push(paths.dashboard.datasets);
                  }}
                >
                  Manage Datasets
                </Button>
              }
              description="Easily upload new datasets or update existing ones to keep your data accurate."
              icon={Database}
              label="Datasets"
              title="Manage Your Datasets"
            />
          </Grid>
        </Grid>
      </Stack>

      {/* Sandbox Email Capture Modal */}
      <Modal open={openPopup} onClose={() => { }} BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}>
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            border: '1px solid var(--mui-palette-divider)',
          }}
        >
          <Typography variant="h6">Sandbox</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Welcome to our sandbox! Here, you can explore our features and see how they work. Enter your email to
            continue and stay updated with the latest improvements.
          </Typography>
          <TextField
            label="Work email"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleEmailSubmit}>
            Enter Sandbox
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
