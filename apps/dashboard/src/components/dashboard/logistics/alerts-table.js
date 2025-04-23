'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { Chip, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Warning } from '@phosphor-icons/react';
import { format } from 'date-fns';

import { paths } from '@/paths';
import { DataTable } from '@/components/core/data-table';

import { AlertsFilters } from '../monitoring/alerts-filters';
import { CustomersPagination } from '../monitoring/customers-pagination';
import { CustomersSelectionProvider } from '../monitoring/customers-selection-context';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label, coordinate }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${coordinate.x}px`, // Tooltip follows the x-coordinate of the cursor
          top: `${coordinate.y - 100}px`, // Offset by 70px to position above the cursor
          transform: 'translateX(-50%)', // Center it horizontally
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          pointerEvents: 'none', // Make sure the tooltip doesn't interfere with hovering
          zIndex: 999, // Ensure the tooltip appears on top
        }}
      >
        <div>
          {payload.map((payloadElement) => {
            const payloadTimestamp = new Date(payloadElement?.payload?.timestamp);
            const formattedDate = format(payloadTimestamp, 'MMM d, yyyy h:mm a');
            return (
              <div key={payloadElement.name} style={{ width: '160px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '4px', paddingRight: '4px' }}
                >
                  <span style={{ color: payloadElement.fill, fontSize: '14px', fontWeight: 'bold' }}>Alerts</span>
                  <span style={{ color: '#333', fontSize: '12px', fontWeight: 'normal' }}>{payloadElement.value}</span>
                </div>
                <Divider sx={{ my: 1 }}></Divider>
                <p
                  style={{
                    margin: 0,
                    color: '#6e6e6e',
                    fontSize: '13px',
                    fontWeight: 'bold',
                  }}
                >
                  {formattedDate}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

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

const columnsMetrics = [
  {
    formatter: (row) => (
      // add as in sentry error type in a color, then description
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box />
        <div>
          <Link
            color="inherit"
            component={RouterLink}
            href={paths.dashboard.monitoring.performance.details(row.id)}
            sx={{ whiteSpace: 'nowrap' }}
            variant="subtitle2"
          >
            {'The metric ' + row.data?.modelMetric.toUpperCase() + ' has an alert'}
          </Link>
          <Typography color="text.secondary" variant="body2">
            {'The ' + row.data?.modelMetric +' score for the Model has dropped to ' + (row.data?.value || 0).toFixed(2) +', which is critically below the acceptable threshold.'}
          </Typography>
        </div>
      </Stack>
    ),
    width: '250px',
  },
  {
    name: 'Report Date',
    width: '40px',
    formatter: (row) => (
      <Typography color="text.secondary" variant="body2">
        {row.createdAt.toLocaleDateString()}
      </Typography>
    ),
  },
  {
    formatter: (row) => (
      <Typography color="text.secondary" variant="body2">
        {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(row?.data?.value || 0) || 0}
      </Typography>
    ),
    name: 'Last Value',
    width: '80px',
  },
  {
    formatter: (row) => (
      <Typography color="text.secondary" variant="body2">
        {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(row?.data?.avgValue || 0) || 0}
      </Typography>
    ),
    name: 'Avg Value',
    width: '80px',
  },
  { formatter: (row) => (
    <Typography color="text.secondary" variant="body2">
      {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(0.95)}
    </Typography>
  ), field: 'severity', name: 'Target Value', width: '80px' },
  { formatter: (row) => (
    <Chip label={row.severity === 'info' ? 'Minor' : 'Critical'}  sx={{ fontWeight: 'bold', backgroundColor: severityColor(row?.severity), color: severityColorText(row?.severity) }} />

  ), name: 'Severity', width: '80px' },
];

const columnsErrors = [
  {
    formatter: (row) => (
      // add as in sentry error type in a color, then description
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box />
        <div>
          <Link
            color="inherit"
            component={RouterLink}
            href={paths.dashboard.monitoring.error.details(row.errors[0]?.id)}
            sx={{ whiteSpace: 'nowrap' }}
            variant="subtitle2"
          >
            {row.errors[0]?.data?.title || 'Http error'}
          </Link>
          <Typography color="text.secondary" variant="body2">
            {'The server responded with a 500 error'}
          </Typography>
        </div>
      </Stack>
    ),
    width: '50%',
  },
  {
    name: 'Last Report Date',
    width: '10%',
    formatter: (row) => (
      <Typography color="text.secondary" variant="body2">
        {new Date(row.errors[0]?.createdAt)?.toLocaleDateString()}
      </Typography>
    ),
  },
  {
    formatter(row) {
      // Process and sort the data
      const data = Object.entries(row?.errorsByHour).map(([timestamp, value]) => ({
        timestamp: new Date(timestamp),
        value,
      }));
      data?.reverse();

      return (
        <Box sx={{ width: '80%', height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              {/* Dashed grid line at the bottom */}
              <CartesianGrid
                strokeDasharray="4"
                horizontalCoordinatesGenerator={(props) => {
                  // Calculate the bottom coordinate only
                  const { yAxis } = props;
                  return [yAxis.scale(0)];
                }}
                vertical={false}
              />
              {/* Thin bars */}
              <Bar dataKey="value" fill="#8884d8" barSize={4} />
              {/* Customized Tooltip */}
              <Tooltip wrapperStyle={{zIndex: 100}} content={<CustomTooltip></CustomTooltip>} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      );
    },
    name: 'Last 24 Hours Errors',
    width: '30%',
  },
  {
    name: 'Events',
    width: '10%',
    formatter: (row) => (
      <Typography color="text.secondary" variant="body2">
        {row.totalErrors || 0}
      </Typography>
    ),
  },
]

function applySort(row, sortDir) {
  return row.sort((a, b) => {
    if (sortDir === 'asc') {
      return a?.createdAt?.getTime() - b?.createdAt?.getTime();
    }

    return b?.createdAt?.getTime() - a?.createdAt?.getTime();
  });
}

function applyFilters(row, { type, initDate, endDate }) {
  return row.filter((item) => {
    if (type) {
      if (item?.type !== type) {
        return false;
      }
    }
    if (initDate) {
      if (item?.createdAt.getTime() < new Date(initDate).getTime()) {
        return false;
      }
    }
    if (endDate) {
      if (item?.createdAt.getTime() > new Date(endDate).getTime()) {
        return false;
      }
    }

    return true;
  });
}

export function AlertsTable({ rows, id, searchParams }) {
  let { type, sortDir, initDate, endDate } = searchParams;
  type = type || 'metric';
  const alerts =
    rows?.map((model) => {
      return {
        ...model,
        createdAt: new Date(model?.createdAt),
        updatedAt: new Date(model?.updatedAt),
      };
    }) || [];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const sortedAlerts = applySort(alerts || [], sortDir);
  const filteredAlerts = applyFilters(sortedAlerts, { type, initDate, endDate });

  const dataToShow = filteredAlerts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <Card id="alerts-table" style={{overflow: 'visible'}}>
      <CardHeader
        avatar={
          <Avatar>
            <Warning fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Alerts"
      />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <CustomersSelectionProvider customers={[]}>
            <AlertsFilters
              filters={{ type, initDate, endDate }}
              sortDir={sortDir}
              data={alerts}
              setPage={setPage}
              id={id}
            />
            <Divider />
            <Box sx={{ overflowX: 'auto', overflow: 'visible' }}>
              <DataTable rows={dataToShow} columns={type === 'error' ? columnsErrors : columnsMetrics} />
            </Box>
            <Divider />
            <CustomersPagination
              count={filteredAlerts?.length}
              page={page}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
            />
        </CustomersSelectionProvider>
      </Box>
    </Card>
  );
}
