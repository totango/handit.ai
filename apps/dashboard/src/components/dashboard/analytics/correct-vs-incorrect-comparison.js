/**
 * Correct vs Incorrect Comparison Analytics Component
 * 
 * Displays a detailed comparison of correct and incorrect predictions,
 * showing:
 * - Side-by-side comparison of success rates
 * - Trend analysis over time
 * - Percentage breakdowns
 * - Performance metrics
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

const bars = [
  { name: 'Incorrect Entries', dataKey: 'incorrect', color: 'var(--mui-palette-primary-light)' },
  { name: 'Correct Entries', dataKey: 'correct', color: 'var(--mui-palette-primary-400)' },

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
              <Typography sx={{ whiteSpace: 'nowrap' }}>{entry?.dataKey === 'correct' ? 'Correct Conversations' : 'Incorrect Conversations'}</Typography>
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
 * CorrectVsIncorrectComparison Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Analytics data for comparison
 * @param {Array<Object>} props.data.series - Comparison metrics
 * @param {string} props.data.series[].name - Metric name
 * @param {Array<number>} props.data.series[].correct - Correct prediction counts
 * @param {Array<number>} props.data.series[].incorrect - Incorrect prediction counts
 * @param {Array<string>} props.data.categories - Time periods or categories
 * @returns {JSX.Element} The correct vs incorrect comparison component
 */
export function CorrectVsIncorrectComparison({ data, title = 'Model Performance', isLoading, model, height }) {
  const chartHeight = height ? 120 : 160;

  if (isLoading || !data || data.length === 0) {
    return (
      <Card sx={{ height: height || '46vh', width: '100%' }}>
        <CardHeader
          avatar={
            <Skeleton variant="circular">
              <Avatar />
            </Skeleton>
          }
          title={<Skeleton variant="text" width="40%" />}
        />
        <CardContent>
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
    <Card sx={{ height: height || '46vh', width: '100%' }}>
      <CardHeader
        avatar={
          <Avatar>
            <ChartPieIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title={title}
      />
      <CardContent>
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
                    barSize={6}
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