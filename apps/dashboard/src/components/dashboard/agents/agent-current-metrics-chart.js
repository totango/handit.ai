/**
 * Agent Current Metrics Chart Component
 * 
 * A visualization component that displays month-over-month metrics for an agent.
 * Shows performance metrics in a bar chart format, comparing current month
 * with previous month values. Includes loading states and responsive layout.
 */

'use client';

import * as React from 'react';
import { Box, Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { ChartBar } from '@phosphor-icons/react';

import { AgentCurrentMetrics } from '../analytics/agent-current-metrics';

/**
 * AgentCurrentMetricsChart Component
 * 
 * A chart component that visualizes agent performance metrics over time.
 * Displays month-over-month comparisons with support for loading states
 * and responsive layout.
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.data={}] - Metrics data object containing current and previous month values
 * @param {Object} [props.selectedNode] - Currently selected node in the agent flow
 * @param {string} props.agentId - ID of the agent being monitored
 * @param {boolean} [props.isLoading=false] - Whether the component is in a loading state
 * @returns {JSX.Element} The agent current metrics chart component
 */
export function AgentCurrentMetricsChart({ data = {}, selectedNode, agentId, isLoading = false }) {
  // Transform metrics data for the chart component
  const chartData = React.useMemo(() => {
    return Object.keys(data || {}).filter((key) => key !== 'Healtcheck').map((key) => ({
      label: key.replaceAll('Average_', '').replaceAll('average_', ''),
      v1: data[key].currentMonth * 100.0 || 0,
      v2: data[key].previousMonth * 100.0 || 0,
    }));
  }, [data, selectedNode]);

  // Loading state UI
  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader
          avatar={<Skeleton variant="circular" width={40} height={40} />}
          title={<Skeleton variant="text" width={140} />}
          sx={{ paddingBottom: '8px' }}
        />
        <CardContent style={{ height: '300px' }}>
          <Stack spacing={3} sx={{ height: '300px', pt: 1 }}>
            {/* Skeleton for chart bars */}
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'flex-end', gap: 2, px: 2 }}>
              {[1, 2, 3, 4].map((index) => (
                <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="rectangular" width="100%" height={`${Math.random() * 60 + 20}%`} />
                </Box>
              ))}
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Main chart UI
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar>
            <ChartBar fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Month-over-Month Metrics"
        sx={{ paddingBottom: '8px' }}
      />
      <CardContent style={{ height: '350px' }}>
        <Stack spacing={3} sx={{ height: '350px', pt: 1 }}>
          <AgentCurrentMetrics data={chartData} title={false} />
        </Stack>
      </CardContent>
    </Card>
  );
}
