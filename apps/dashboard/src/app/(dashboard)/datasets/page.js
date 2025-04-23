/**
 * Datasets Dashboard Page Component
 * 
 * This page provides a comprehensive interface for managing datasets with:
 * - Grid/List view of all datasets
 * - Dataset creation and upload capabilities
 * - Filtering and sorting functionality
 * - Pagination support
 * 
 * The component uses RTK Query for data management and provides
 * a user-friendly interface for dataset operations.
 */
'use client';

import * as React from 'react';
import { useAddDatasetsMutation, useGetDatasetsQuery } from '@/services/datasetsService';
// Import the RTK query hook
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { CreateDatasetDialog } from '@/components/dashboard/datasets/create-dataset-dialog';
import { ItemsFilters } from '@/components/dashboard/datasets/items-filters';
import { ItemsPagination } from '@/components/dashboard/datasets/items-pagination';
import { StorageProvider } from '@/components/dashboard/datasets/storage-context';
import { StorageView } from '@/components/dashboard/datasets/storage-view';
import { UploadButton } from '@/components/widgets/buttons/upload-button';
import { Alert } from '@mui/material';

/**
 * Sorts items based on creation date
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
 * Filters items based on search query
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
 * Main datasets dashboard page component
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters
 * @param {string} [props.searchParams.query] - Optional search query string
 * @param {string} [props.searchParams.sortDir] - Optional sort direction ('asc' or 'desc')
 * @param {string} [props.searchParams.view] - Optional view mode ('grid' or 'list')
 * @param {string} [props.searchParams.page] - Optional page number
 * @returns {JSX.Element} The datasets dashboard interface
 */
export default function Page({ searchParams }) {
  const { query, sortDir, view = 'grid', page } = searchParams;

  // Fetch datasets using RTK Query
  const { data: items, error, isLoading } = useGetDatasetsQuery();
  const [addDataset, { isLoading: isAddingKpi, error: addKpiError }] = useAddDatasetsMutation();

  const filters = { query };
  const sortedItems = applySort(items, sortDir);
  const filteredItems = applyFilters(sortedItems, filters);

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
      {/* Error alert for dataset creation failures */}
      {addKpiError ? <Alert color="error" sx={{ marginBottom: 3 }}>{addKpiError.data.error}</Alert> : null}

      <Stack spacing={4} sx={{ flex: 1 }}>
        {/* Header section with title and create button */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Your Datasets</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <UploadButton
              buttonTitle={'Create New Dataset'}
              onSubmit={addDataset}
              FormComponent={CreateDatasetDialog}
            />
          </Box>
        </Stack>

        {/* Main content area */}
        <Grid container spacing={4}>
          <Grid md={12} xs={12} sx={{ padding: '1vmax' }}>
            <Stack spacing={4}>
              {/* Filters and view controls */}
              <ItemsFilters filters={{ query }} sortDir={sortDir} view={view} />

              {/* Dataset storage view with context provider */}
              <StorageProvider items={filteredItems}>
                <StorageView view={view} />
              </StorageProvider>
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      {/* Pagination controls fixed at the bottom */}
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