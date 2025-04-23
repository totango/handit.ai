/**
 * Business Metrics Dashboard Page Component
 * 
 * This page provides a comprehensive interface for managing Key Performance Indicators (KPIs) with:
 * - Grid/List view of all KPIs
 * - KPI creation and upload capabilities
 * - Filtering and sorting functionality
 * - Pagination support
 * 
 * The component uses RTK Query for data management and provides
 * a user-friendly interface for KPI operations.
 */
'use client';

import * as React from 'react';
import { useAddKpiMutation, useDeleteKpiMutation, useGetKpisQuery, useUpdateKpiMutation } from '@/services/kpiService'; // Import the RTK query hook
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { ItemsFilters } from '@/components/dashboard/businessMetrics/items-filters';
import { ItemsPagination } from '@/components/dashboard/businessMetrics/items-pagination';
import { StorageProvider } from '@/components/dashboard/businessMetrics/storage-context';
import { StorageView } from '@/components/dashboard/businessMetrics/storage-view';
import { UploadButton } from '@/components/dashboard/businessMetrics/upload-button';

/**
 * Sorts items based on creation date
 * @param {Array} items - Array of items to sort
 * @param {string} sortDir - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array of items
 */
function applySort(items, sortDir) {
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
function applyFilters(row, { query }) {
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
 * Main KPI dashboard page component
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters
 * @param {string} [props.searchParams.query] - Optional search query string
 * @param {string} [props.searchParams.sortDir] - Optional sort direction ('asc' or 'desc')
 * @param {string} [props.searchParams.view] - Optional view mode ('grid' or 'list')
 * @param {string} [props.searchParams.page] - Optional page number
 * @returns {JSX.Element} The KPI dashboard interface
 */
export default function Page({ searchParams }) {
  const { query, sortDir, view = 'grid', page } = searchParams;

  // Fetch KPIs using RTK Query
  const { data, error, isLoading } = useGetKpisQuery();
  const [addKpi, { isLoading: isAddingKpi, error: addKpiError }] = useAddKpiMutation();

  const items = data?.map((item) => ({ ...item, currentValue: item?.companyMetricLog?.value })) || [];
  const filters = { query };
  const sortedItems = applySort(items, sortDir);
  const filteredItems = applyFilters(sortedItems, filters);

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: '2vmax',
        width: 'var(--Content-width)',
        minHeight: '100vh', // Ensure the content fills the full height of the viewport
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing={4} sx={{ flex: 1 }}>
        {/* Header section with title and create button */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Your KPI's</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <UploadButton buttonTitle={'Create New KPI'} onSubmit={addKpi} />
          </Box>
        </Stack>

        {/* Main content area */}
        <Grid container spacing={4}>
          <Grid md={12} xs={12} sx={{ padding: '2vmax' }}>
            <Stack spacing={4}>
              {/* Filters and view controls */}
              <ItemsFilters filters={{ query }} sortDir={sortDir} view={view} />

              {/* KPI storage view with context provider */}
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