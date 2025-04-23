/**
 * Country Sessions vs Bounce Rate Analytics Component
 * 
 * Displays a comparison of country-specific analytics, showing:
 * - Session counts by country
 * - Bounce rates for each country
 * - Geographic distribution of traffic
 * - Performance metrics by region
 */

'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { parseTitle } from '@/lib/text';

import { NoSsr } from '@/components/core/no-ssr';

const bars = [
  { name: 'Current Month', dataKey: 'v1', color: 'var(--mui-palette-primary-400)' },
  { name: 'Last Month', dataKey: 'v2', color: 'var(--mui-palette-primary-light)' },
];

/**
 * CountrySessionsVsBounceRate Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Analytics data for country comparison
 * @param {Array<Object>} props.data.series - Country-specific metrics
 * @param {string} props.data.series[].name - Country name
 * @param {Array<number>} props.data.series[].sessions - Session counts
 * @param {Array<number>} props.data.series[].bounceRate - Bounce rates
 * @param {Array<string>} props.data.categories - Time periods
 * @returns {JSX.Element} The country sessions vs bounce rate comparison component
 */
export function CountrySessionsVsBounceRate({ data, title = true }) {
  const chartHeight = 300;

  return (
    <Card>
      {title && (
        <CardHeader
          avatar={
            <Avatar>
              <ChartPieIcon fontSize="var(--Icon-fontSize)" />
            </Avatar>
          }
          title="Performance Comparison last Month"
        />
      )}
      <CardContent>
        <Stack divider={<Divider />} spacing={3}>
          <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
            <ResponsiveContainer height={chartHeight}>
              <BarChart barGap={10} data={data} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 100 }}>
                <CartesianGrid horizontal={false} strokeDasharray="2 4" syncWithTicks />
                <XAxis axisLine={false} tickLine={false} type="number" />
                <YAxis axisLine={false} dataKey="label" tick={<Tick />} tickLine={false} type="category" />
                {bars.map((bar) => (
                  <Bar
                    animationDuration={300}
                    barSize={12}
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

function Tick({ height, payload, width, x, y }) {
  const { value } = payload;
  return (
    <foreignObject height={width} width={height} x={(x ?? 0) - 150} y={(y ?? 0) - 16}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography noWrap variant="body2">
          {parseTitle(value)}
        </Typography>
      </Stack>
    </foreignObject>
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

function TooltipContent({ active, payload }) {
  if (!active) {
    return null;
  }
  return (
    <Paper sx={{ border: '1px solid var(--mui-palette-divider)', boxShadow: 'var(--mui-shadows-16)', p: 1 }}>
      <Stack spacing={2}>
        {payload?.map((entry) => (
          <Stack direction="row" key={entry.name} spacing={3} sx={{ alignItems: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: '1 1 auto' }}>
              <Box sx={{ bgcolor: entry.fill, borderRadius: '2px', height: '8px', width: '8px' }} />
              <Typography sx={{ whiteSpace: 'nowrap' }}>{entry.name}</Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(
                entry.value / 100
              )}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
