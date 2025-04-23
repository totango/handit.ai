'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';

import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

import { paths } from '@/paths';
import { DataTable } from '@/components/core/data-table';
import { Warning } from '@phosphor-icons/react/dist/ssr/Warning';
import { WarningDiamond } from '@phosphor-icons/react/dist/ssr/WarningDiamond';

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

const columns = [
  {
    formatter: (row) => (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-primary-main)',
            borderRadius: '50%',
            flex: '0 0 auto',
            height: '8px',
            width: '8px',
            mx: 1,
          }}
        />
        <div>
          <Link
            color="inherit"
            component={RouterLink}
            href={paths.dashboard.monitoring.details(row.id)}
            sx={{ whiteSpace: 'nowrap' }}
            variant="subtitle2"
          >
            {row.name}
          </Link>
          <Typography color="text.secondary" variant="body2">
            {row.email}
          </Typography>
        </div>
      </Stack>
    ),
    name: 'MODEL',
    width: '200px',
  },
  {
    formatter(row) {
      // Process and sort the data
      const data = Object.entries(row.lastAlertsByHour).map(([timestamp, value]) => ({
        timestamp: new Date(timestamp),
        value,
      }));
      data?.reverse();

      return (
        <Box sx={{ width: '80%', height: 40, zIndex: 100 }}>
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
              <Tooltip wrapperStyle={{zIndex: 100}} itemStyle={{ zIndex: 100 }} content={<CustomTooltip></CustomTooltip>} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      );
    },
    name: 'ALERTS CHART',
    width: '20%',
  },
  {
    formatter(row) {
      return (
        <Typography color="text.primary" variant="body1">
          {row.lastAlerts}
        </Typography>
      );
    },
    name: 'ALERTS (24h)',
    width: '100px',
  },
  {
    formatter(row) {
      return (
        <Typography color="text.primary" variant="body1">
          {row.lastErrors}
        </Typography>
      );
    },
    name: 'ERRORS (24h)',
    width: '100px',
  },
  {
    formatter: (row) => {
      const mapping = {
        success: { label: 'Stable', color: 'success' },
    error: { label: 'Outage', color: 'error' },
    warning: { label: 'Unstable', color: 'warning' },
    unknown: { label: 'Unknown', color: 'info' },
      };

      const healthCheck = row.modelMetrics.find((metric) => metric.type === 'health_check');
      if (!healthCheck || !healthCheck.modelMetricLog) {
        return <Chip color={"success"} label="Stable" size="small" variant="soft" />;
      }
      const { label, color } = mapping[healthCheck.modelMetricLog.value?.toLowerCase()] ?? { label: 'Unknown', icon: null };

      return <Chip color={color} label={label} size="small" variant="soft" />
    },
    name: 'HEALTH CHECK',
    width: '50px',
  },
];

export function MonitoringTable({ rows }) {
  return (
    <React.Fragment>
      <DataTable columns={columns} rows={rows} selectable={false} />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No models found
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
