/**
 * Correct Inference Comparison Analytics Component
 * 
 * Displays a comparison of correct vs incorrect inference rates across
 * different models or time periods. Includes:
 * - Bar chart visualization
 * - Percentage breakdowns
 * - Trend analysis
 * - Success rate calculations
 */

'use client';

import * as React from 'react';
import { Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Skeleton } from '@mui/material';

import { parseTitle } from '@/lib/text';
import { NoSsr } from '@/components/core/no-ssr';
import { CorrectGraphSwitch } from '@/components/dashboard/layout/correct-graph-switch';

const bars = [
  { name: 'Base Model', dataKey: 'base', color: 'var(--mui-palette-primary-200)' },
  { name: 'Optimized Model', dataKey: 'optimized', color: 'var(--mui-palette-primary-400)' },
];

function TooltipContent({ active, payload }) {
  if (!active) {
    return null;
  }

  const time = payload[0]?.payload.date;
  const formattedDate = time ? format(time, 'MMM d, yyyy') : '';
  return (
    <Paper sx={{ border: '1px solid var(--mui-palette-divider)', boxShadow: 'var(--mui-shadows-16)', p: 1 }}>
      <Stack spacing={2}>
        <p
          style={{
            marginLeft: '4px',
            marginTop: '4px',
            marginBottom: '0px',
            color: '#6e6e6e',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          {formattedDate}
        </p>
        {payload?.map((entry) => (
          <Stack direction="row" key={entry.name} spacing={3} sx={{ alignItems: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
              <Box sx={{ bgcolor: entry.fill, borderRadius: '2px', height: '8px', width: '8px' }} />
              <Typography sx={{ whiteSpace: 'nowrap' }}>{entry?.dataKey === 'base' ? 'Base Model' : 'Optimized Model'}</Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {new Intl.NumberFormat('en-US', {
                maximumFractionDigits: 2,
              }).format(entry.value)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

/**
 * CorrectInferenceComparison Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Analytics data for inference comparison
 * @param {Array<Object>} props.data.series - Inference metrics
 * @param {string} props.data.series[].name - Model or time period name
 * @param {Array<number>} props.data.series[].correct - Correct inference counts
 * @param {Array<number>} props.data.series[].incorrect - Incorrect inference counts
 * @param {Array<string>} props.data.categories - Categories for comparison
 * @returns {JSX.Element} The correct inference comparison component
 */
export function CorrectInferenceComparison({ data, type = 'Correct', title = '', setType, isLoading }) {
  const chartHeight = 150;
  if (isLoading || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader
          avatar={
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          }
          title={<Skeleton variant="text" width="40%" />}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Skeleton variant="rectangular" width={120} height={32} />
          </Box>
          <Stack divider={<Divider />} spacing={3}>
            <Skeleton variant="rectangular" height={chartHeight} />
            <Stack direction="row" spacing={2}>
              {[1, 2].map((item) => (
                <Stack key={item} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Skeleton variant="rectangular" width={16} height={4} />
                  <Skeleton variant="text" width={60} />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <ChartPieIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title={'Correctly ' + title}
      />
      <CardContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
          }}
        >
          <CorrectGraphSwitch onTypeChange={setType} type={type} />

        </div>
        <Stack divider={<Divider />} spacing={3}>
          <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
            <ResponsiveContainer height={chartHeight}>
              <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" syncWithTicks />
                <XAxis axisLine={false} dataKey="date" hide />
                <YAxis type="number" />
                {bars.map((bar) => (
                  <Bar
                    animationDuration={300}
                    barSize={8}
                    fill={bar.color}
                    key={bar.name}
                    name={bar.name}
                    radius={[5, 5, 5, 5]}
                    dataKey={bar.dataKey}
                  />
                ))}
                <Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
              </BarChart>
            </ResponsiveContainer>
          </NoSsr>
          <Legend />
        </Stack>
      </CardContent>
    </Card>
  );
}

function Legend() {
  return (
    <Stack direction="row" spacing={2}>
      {bars.map((bar) => (
        <Stack direction="row" key={bar.name} spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: bar.color, borderRadius: '2px', height: '4px', width: '16px' }} />
          <Typography color="text.secondary" variant="caption">
            {parseTitle(bar.name)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
