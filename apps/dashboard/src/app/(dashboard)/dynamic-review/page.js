/**
 * Dynamic Review Dashboard Page Component
 * 
 * This page provides a comprehensive interface for reviewing and managing AI model outputs with:
 * - Model selection and switching
 * - Statistics dashboard for verified/unverified entries
 * - Advertisement cards for expert services
 * - Detailed entries table with pagination
 * 
 * The component uses RTK Query for data management and provides
 * a user-friendly interface for model review operations.
 */
'use client';

import * as React from 'react';
import { useGetListOfEntriesQuery } from '@/services/monitoringService'; // Import the RTK query hook

import { Card, Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { CheckCircle, Eye, Rows, WarningOctagon } from '@phosphor-icons/react';

import { StatCard } from '@/components/dashboard/logistics/stat-card';
import { AdvertisementCard } from '@/components/dashboard/smart-feedback-loop/advertisement-card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { EntriesTable } from '@/components/dashboard/smart-feedback-loop/entries-table';
import { useGetModelsQuery } from '@/services/modelsService';

/**
 * Loading skeleton component for the models switch section
 * @returns {JSX.Element} Skeleton UI for models switch
 */
function ModelsSwitchSkeleton() {
  return (
    <Stack
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: '1vh',
        paddingTop: '1vh',
      }}
    >
      <Stack spacing={1} sx={{ width: 200 }}>
        <Skeleton variant="rectangular" width={150} height={24} />
        <Skeleton variant="text" width={100} />
      </Stack>
    </Stack>
  );
}

/**
 * Loading skeleton component for stat cards
 * @returns {JSX.Element} Skeleton UI for stat cards
 */
function StatCardSkeleton() {
  return (
    <Card sx={{ height: '100%', p: 3 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width={120} />
          <Skeleton variant="circular" width={40} height={40} />
        </Stack>
        <Skeleton variant="rectangular" width="60%" height={40} />
      </Stack>
    </Card>
  );
}

/**
 * Loading skeleton component for advertisement cards
 * @returns {JSX.Element} Skeleton UI for advertisement cards
 */
function AdvertisementCardSkeleton() {
  return (
    <Card sx={{ height: '100%', p: 3 }}>
      <Stack spacing={2}>
        <Skeleton variant="rectangular" width="70%" height={32} />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="rectangular" width={120} height={36} />
      </Stack>
    </Card>
  );
}

/**
 * Loading skeleton component for entries table
 * @returns {JSX.Element} Skeleton UI for entries table
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
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Skeleton variant="rectangular" width={200} height={36} />
        </Stack>
      </Stack>
    </Card>
  );
}

/**
 * Main dynamic review dashboard page component
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters
 * @param {string} [props.searchParams.modelId] - Optional model ID
 * @returns {JSX.Element} The dynamic review dashboard interface
 */
export default function Page({ searchParams }) {
  const [environment, setEnvironment] = React.useState('production');

  // Set environment on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setEnvironment(localStorage.getItem('environment') || 'production');
    }
  }, []);

  // Get and process search parameters
  const searchParamsObj = useSearchParams();
  const { modelId } = searchParams;
  let page = searchParamsObj.get('page');
  let pageSize = searchParamsObj.get('rowsPerPage');
  let type = searchParamsObj.get('type');
  page = page || 1;
  pageSize = pageSize || 5;
  type = type || 'unverified';
  const router = useRouter();
  const path = usePathname();

  // Fetch models and handle model selection
  const { data: items, error: errorModels, isLoading: isLoadingModel } = useGetModelsQuery();
  const [models, setModels] = React.useState([]);

  // Redirect to first model if none selected
  React.useEffect(() => {
    if (!modelId && items && items.length > 0) {
      router.push('/dynamic-review?modelId=' + items[0].id)
    }
  }, [modelId, items]);

  // Filter out optimized models
  React.useEffect(() => {
    if (items) {
      setModels(items.filter((model) => !model.isOptimized));
    }
  }, [items]);

  // Fetch entries data
  const { data, error, isLoading } = useGetListOfEntriesQuery({
    modelId,
    page,
    pageSize,
    type,
    environment
  });

  // Show loading state
  if (isLoading || isLoadingModel) {
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
        <ModelsSwitchSkeleton />
        <Stack spacing={4} sx={{ flex: 1 }}>
          {/* Advertisement cards skeleton */}
          <Grid container style={{ height: '100%' }} alignItems="stretch">
            <Grid md={6} xs={12} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax' }}>
              <AdvertisementCardSkeleton />
            </Grid>
            <Grid md={6} xs={12} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax' }}>
              <AdvertisementCardSkeleton />
            </Grid>
          </Grid>
          {/* Stats and table skeleton */}
          <Grid container>
            {[1, 2, 3, 4].map((item) => (
              <Grid key={item} md={3} xs={3} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', paddingBottom: '1vmax' }}>
                <StatCardSkeleton />
              </Grid>
            ))}
            <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
              <EntriesTableSkeleton />
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
      <Stack spacing={4} sx={{ flex: 1 }}>
        {/* Advertisement cards section */}
        <Grid container style={{ height: '100%' }} alignItems="stretch">
          <Grid md={6} xs={12} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', display: 'flex', flexDirection: 'column' }} style={{ display: 'flex', flexDirection: 'column' }}>
            <AdvertisementCard
              title={'Need Expert AI Evaluation?'}
              message={
                'Our expert team manually evaluates your AI model outputs to ensure they align with your business goals, boosting performance and accuracy. Get reliable results with human validation.'
              }
              color={'rgba(235,243,238, 0.2)'}
              buttonColor={'white'}
              hoverColor={'rgba(235,243,238, 0.8)'}
              ctaMessage={'Get Started'}
            />
          </Grid>
          <Grid md={6} xs={12} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', display: 'flex', flexDirection: 'column' }} style={{ display: 'flex', flexDirection: 'column' }}>
            <AdvertisementCard
              title={'Maximize Your AI Investment'}
              message={
                "Handit.ai's expert consultancy helps you create, optimize, and evolve AI strategies that deliver real business impact. Get models that work—and keep working for you."
              }
              color={'rgba(235,228,253, 0.3)'}
              buttonColor={'white'}
              hoverColor={'rgba(235,228,253, 0.8)'}
              ctaMessage={'Book a Consultation'}
            />
          </Grid>
        </Grid>

        {/* Statistics cards section */}
        <Grid container>
          <Grid md={3} xs={3} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', paddingBottom: '1vmax' }}>
            <Grid sx={12}>
              <StatCard
                subTitle={'Verified Entries'}
                title={data?.amountVerified}
                icon={<Eye fontSize="var(--icon-fontSize-lg)" />}
              />
            </Grid>
          </Grid>
          <Grid md={3} xs={3} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', paddingBottom: '1vmax' }}>
            <Grid sx={12}>
              <StatCard subTitle={'Unverified Entries'} title={data?.amountUnverified} icon={<Rows fontSize="var(--icon-fontSize-lg)" />} />
            </Grid>
          </Grid>
          <Grid md={3} xs={3} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', paddingBottom: '1vmax' }}>
            <Grid sx={12}>
              <StatCard
                subTitle={'Correct Entries'}
                title={data?.correct}
                icon={<CheckCircle fontSize="var(--icon-fontSize-lg)" />}
              />
            </Grid>
          </Grid>
          <Grid md={3} xs={3} sx={{ paddingRight: '1vmax', paddingLeft: '1vmax', paddingBottom: '1vmax' }}>
            <Grid sx={12}>
              <StatCard
                subTitle={'Incorrect Entries'}
                title={data?.incorrect}
                icon={<WarningOctagon fontSize="var(--icon-fontSize-lg)" />}
              />
            </Grid>
          </Grid>

          {/* Entries table section */}
          <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
            <Stack>
              <EntriesTable modelId={modelId} rows={data?.entries || []} id={''} searchParams={{ ...searchParams, page, pageSize }} paginated total={data?.totalEntries} verified={data?.amountVerified} unverified={data?.amountUnverified} />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}