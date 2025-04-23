/**
 * Monitoring Dashboard Page Component
 * 
 * This page provides a comprehensive monitoring interface for all models with:
 * - Model status tracking
 * - Performance metrics overview
 * - Filtering and sorting capabilities
 * - Pagination support
 * - Real-time status updates
 * 
 * The component uses RTK Query for data management and provides
 * a centralized view of model health and performance.
 */
'use client';

import * as React from 'react';
import { useGetModelsMetricsQuery } from '@/services/modelMetricsService';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Skeleton } from '@mui/material';

import { CustomersFilters } from '@/components/dashboard/monitoring/customers-filters';
import { CustomersPagination } from '@/components/dashboard/monitoring/customers-pagination';
import { CustomersSelectionProvider } from '@/components/dashboard/monitoring/customers-selection-context';
import { MonitoringTable } from '@/components/dashboard/monitoring/monitoring-table';

/**
 * Loading state component for the monitoring table
 * Displays skeleton UI for model entries
 */
function TableSkeleton() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Stack
          key={item}
          direction="row"
          spacing={2}
          sx={{
            p: 2,
            alignItems: 'center',
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={1} sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="20%" height={20} />
          </Stack>
          <Skeleton variant="rectangular" width={100} height={32} />
          <Skeleton variant="rectangular" width={100} height={32} />
          <Skeleton variant="rectangular" width={100} height={32} />
        </Stack>
      ))}
    </Stack>
  );
}

/**
 * Main monitoring dashboard page component
 * Handles model metrics display, filtering, and pagination
 * @param {Object} props - Component props
 * @param {Object} props.searchParams - URL search parameters
 * @returns {JSX.Element} The monitoring dashboard interface
 */
export default function Page({ searchParams }) {
  // Extract URL parameters
  const { modelName, sortDir, status } = searchParams;

  // Fetch model metrics data using RTK Query
  const { data, error, isLoading } = useGetModelsMetricsQuery();

  // Pagination state management
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  /**
   * Transform and filter model data
   * Processes raw model data and adds computed fields
   */
  const models =
    data?.filter((model) => !model.isOptimized).map((model) => {
      return {
        ...model,
        createdAt: new Date(model?.createdAt),
        updatedAt: new Date(model?.updatedAt),
        modelCreationDate: new Date(model?.modelCreationDate),
        status: model.modelMetrics?.find((metric) => metric.type === 'health_check')?.modelMetricLog?.value?.toLowerCase() || 'success',
      };
    }) || [];

  // Apply sorting and filtering
  const sortedModels = applySort(models, sortDir);
  const filteredModels = applyFilters(sortedModels, { status });

  // Calculate pagination slice
  const dataToShow = filteredModels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            <Typography variant="h4">Monitoring</Typography>
          </Box>
        </Stack>

        {/* Main Content */}
        <CustomersSelectionProvider customers={filteredModels}>
          <Card>
            {isLoading ? (
              <>
                {/* Loading State Header */}
                <Box sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Skeleton variant="rectangular" width={200} height={40} />
                    <Stack direction="row" spacing={2}>
                      <Skeleton variant="rectangular" width={120} height={40} />
                      <Skeleton variant="rectangular" width={120} height={40} />
                    </Stack>
                  </Stack>
                </Box>
                <Divider />
                {/* Loading State Table */}
                <Box sx={{ overflowX: 'auto', overflow: 'visible' }}>
                  <TableSkeleton />
                </Box>
                <Divider />
                {/* Loading State Pagination */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Skeleton variant="rectangular" width={300} height={40} />
                </Box>
              </>
            ) : (
              <>
                {/* Filters Section */}
                <CustomersFilters
                  filters={{ status, modelName }}
                  sortDir={sortDir}
                  data={models}
                  setPage={setPage}
                />
                <Divider />
                {/* Monitoring Table */}
                <Box sx={{ overflowX: 'auto', overflow: 'visible' }}>
                  <MonitoringTable rows={dataToShow} />
                </Box>
                <Divider />
                {/* Pagination Controls */}
                <CustomersPagination
                  count={filteredModels.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  setPage={setPage}
                  setRowsPerPage={setRowsPerPage}
                />
              </>
            )}
          </Card>
        </CustomersSelectionProvider>
      </Stack>
    </Box>
  );
}

/**
 * Sort models by creation date
 * @param {Array} row - Array of model data
 * @param {string} sortDir - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array of models
 */
function applySort(row, sortDir) {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return a?.createdAt?.getTime() - b?.createdAt?.getTime();
    }
    return b?.createdAt?.getTime() - a?.createdAt?.getTime();
  });
}

/**
 * Filter models by status
 * @param {Array} row - Array of model data
 * @param {Object} filters - Filter criteria
 * @param {string} filters.status - Status to filter by
 * @returns {Array} Filtered array of models
 */
function applyFilters(row, { status }) {
  return row.filter((item) => {
    if (status) {
      if (item?.status !== status) {
        return false;
      }
    }
    return true;
  });
}
