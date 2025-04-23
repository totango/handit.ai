'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { NoSsr } from '@/components/core/no-ssr';

const bars = [
  { name: 'System Failure Alerts', dataKey: 'v3', color: 'var(--mui-palette-primary-800)' },
  { name: 'Critical Performance Alerts', dataKey: 'v2', color: 'var(--mui-palette-primary-400)' },
  { name: 'Minor Performance Alerts', dataKey: 'v1', color: 'var(--mui-palette-primary-200)' },
];

export function AppUsage({ data, trend, diff, total }) {
  const chartHeight = 300;
  const noData = total === 0;

  return (
    <Card style={{ height: '471px', position: 'relative', overflow: 'hidden' }}>
      <CardHeader title="Alerts" />
      <Box
        sx={{
          filter: noData ? 'blur(5px)' : 'none',
          pointerEvents: noData ? 'none' : 'auto',
          height: '100%',
          transition: 'filter 0.3s',
        }}
      >
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <Stack spacing={3} sx={{ flex: '0 0 auto', justifyContent: 'space-between', width: '240px' }}>
              <Stack spacing={2}>
                <Typography color={'success.main'} variant="h2">
                  {total}
                </Typography>
                <Typography color="text.secondary">Total alerts generated this Month</Typography>
              </Stack>
              <div>
                <Typography color="text.secondary" variant="body2">
                  <Typography color="primary.main" component="span" variant="subtitle2">
                    This month
                  </Typography>{' '}
                  you have received{' '}
                  <Typography color="primary.main" component="span" variant="subtitle2">
                    {Math.abs(diff)} {trend === 'up' ? 'more' : 'less'}
                  </Typography>{' '}
                  Alerts than last month.
                </Typography>
              </div>
            </Stack>
            <Stack divider={<Divider />} spacing={2} sx={{ flex: '1 1 auto' }}>
              <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
                <ResponsiveContainer height={chartHeight}>
                  <BarChart barGap={-32} data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" vertical={false} />
                    <XAxis axisLine={false} dataKey="name" tickLine={false} type="category" xAxisId={0} />
                    <YAxis axisLine={false} hide tickCount={6} type="number" />
                    {bars
                      .sort((br) => br.dataKey)
                      .map((bar, index) => (
                        <Bar
                          animationDuration={300}
                          barSize={32}
                          dataKey={bar.dataKey}
                          fill={bar.color}
                          key={bar.name}
                          name={bar.name}
                          xAxisId={0}
                          stackId="stack"
                          radius={index == 2 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                        />
                      ))}
                    <Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />
                  </BarChart>
                </ResponsiveContainer>
              </NoSsr>
              <Legend />
            </Stack>
          </Stack>
        </CardContent>
      </Box>
      {noData && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10,
            p: 10,
            textAlign: 'center',
          }}
        >
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            No data available yet. You'll begin to see data within 24 hours after the validation of your first
            model's entries starts.
          </Typography>
        </Box>
      )}
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
            {bar.name}
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
  const time = payload[0]?.payload.timestamp;
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
              <Typography sx={{ whiteSpace: 'nowrap' }}>{entry.name}</Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {new Intl.NumberFormat('en-US').format(entry.value)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
