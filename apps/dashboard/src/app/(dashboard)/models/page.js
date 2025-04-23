/**
 * Models Management Page Component
 * 
 * This page provides a comprehensive interface for managing AI models with:
 * - Model listing and filtering
 * - Grid and list view options
 * - Model creation and upload
 * - Dataset management
 * - Sorting and pagination
 * 
 * The component uses RTK Query for data management and provides
 * a user-friendly interface for model administration.
 */
'use client';

import * as React from 'react';
import { useAddDatasetsMutation } from '@/services/datasetsService';
import { useAddModelsMutation, useGetModelsQuery } from '@/services/modelsService';
import { Alert, Skeleton } from '@mui/material';
// Import the RTK query hook
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';

import { CreateModelForm } from '@/components/dashboard/models/create-model-form';
import { ItemsFilters } from '@/components/dashboard/models/items-filters';
import { ItemsPagination } from '@/components/dashboard/models/items-pagination';
import { StorageProvider } from '@/components/dashboard/models/storage-context';
import { StorageView } from '@/components/dashboard/models/storage-view';
import { UploadButton } from '@/components/widgets/buttons/upload-button';

/**
 * Sort items by creation date
 * @param {Array} items - Array of items to sort
 * @param {string} sortDir - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array of items
 */
function applySort(items = [], sortDir) {
  const itemsCopy = [...items];
  return itemsCopy.sort((a, b) => {
    const aCreatedAt = new Date(a.createdAt);
    const bCreatedAt = new Date(b.createdAt);

    if (sortDir === 'asc') {
      return aCreatedAt.getTime() - bCreatedAt.getTime();
    }

    return bCreatedAt.getTime() - aCreatedAt.getTime();
  });
}

/**
 * Filter items based on search query
 * @param {Array} row - Array of items to filter
 * @param {Object} filters - Filter criteria
 * @param {string} filters.query - Search query string
 * @returns {Array} Filtered array of items
 */
function applyFilters(row = [], { query }) {
  return row.filter((item) => {
    if (query) {
      if (!item.name?.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Loading state component for the header section
 * Displays skeleton UI for title and action buttons
 */
function HeaderSkeleton() {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
      <Box sx={{ flex: '1 1 auto' }}>
        <Skeleton variant="rectangular" width={200} height={32} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton variant="rectangular" width={150} height={40} />
      </Box>
    </Stack>
  );
}

/**
 * Loading state component for the filters bar
 * Displays skeleton UI for search and filter controls
 */
function FiltersBarSkeleton() {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
      <Skeleton variant="rectangular" width={200} height={40} />
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rectangular" width={100} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </Stack>
    </Stack>
  );
}

/**
 * Loading state component for individual model cards
 * Displays skeleton UI for model information and actions
 */
function ModelCardSkeleton() {
  return (
    <Card sx={{ height: '100%', p: 3 }}>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="rectangular" width={150} height={24} />
          <Skeleton variant="circular" width={40} height={40} />
        </Stack>
        <Skeleton variant="text" width="60%" />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rectangular" width={60} height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width={100} />
          <Skeleton variant="circular" width={32} height={32} />
        </Stack>
      </Stack>
    </Card>
  );
}

/**
 * Loading state component for the grid view
 * Displays skeleton UI for multiple model cards
 */
function GridViewSkeleton() {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid key={item} xs={12} md={4}>
          <ModelCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * Main models management page component
 * Handles model listing, filtering, and management
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters
 * @param {string} props.searchParams.query - Search query string
 * @param {string} props.searchParams.sortDir - Sort direction
 * @param {string} props.searchParams.view - View type ('grid' or 'list')
 * @param {number} props.searchParams.page - Current page number
 * @returns {JSX.Element} The models management interface
 */
export default function Page({ searchParams }) {
  const { query, sortDir, view = 'grid', page } = searchParams;
  // Fetch KPIs using RTK Query
  const { data: items, error, isLoading } = useGetModelsQuery();
  const [addModel, { isLoading: isAddingKpi, error: addKpiError }] = useAddModelsMutation();
  const [addDataset, { isLoading: isAddingDataset, error: addDatasetError }] = useAddDatasetsMutation();
  const [models, setModels] = React.useState([]);

  const filters = { query };
  const sortedItems = applySort(models, sortDir);
  const filteredItems = applyFilters(sortedItems, filters);
  // if error show alert

  React.useEffect(() => {
    if (items) {
      setModels(items.filter((model) => !model.isOptimized));
    }
  }, [items]);

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
        <Stack spacing={4} sx={{ flex: 1 }}>
          <HeaderSkeleton />
          <Grid container spacing={4}>
            <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
              <Stack spacing={4}>
                <FiltersBarSkeleton />
                <GridViewSkeleton />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={52} />
        </Box>
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
        minHeight: '100vh', // Ensure the content fills the full height of the viewport
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing={4} sx={{ flex: 1 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Your Models</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <UploadButton
              buttonTitle={'Create New Model'}
              onSubmit={addModel}
              onSecondarySubmit={addDataset}
              FormComponent={CreateModelForm}
            />
          </Box>
        </Stack>
        <Grid container spacing={4}>
          <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
            <Stack spacing={4}>
              <ItemsFilters filters={{ query }} sortDir={sortDir} view={view} />
              <StorageProvider items={filteredItems}>
                <StorageView view={view} />
              </StorageProvider>
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      {/* Pagination fixed at the bottom */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
        }}
      >
        <ItemsPagination count={filteredItems.length} page={0} />
      </Box>
    </Box>
  );
}
