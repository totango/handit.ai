'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Wrench as WrenchIcon } from '@phosphor-icons/react/dist/ssr/Wrench';
import { Cell, Pie, PieChart } from 'recharts';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';

import { NoSsr } from '@/components/core/no-ssr';

export function VehiclesCondition({ error, success, warning }) {
  const total = error + success + warning;

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <BellIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Model Stability Checks (30d)"
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid md={4} xs={12}>
            <VehicleCondition
              amount={success}
              color="var(--mui-palette-success-main)"
              description=" "
              title="Stable"
              total={total}
              trackColor="var(--mui-palette-success-100)"
            />
          </Grid>
          <Grid md={4} xs={12}>
            <VehicleCondition
              amount={warning}
              color="var(--mui-palette-warning-main)"
              description=""
              title="Unstable"
              total={total}
              trackColor="var(--mui-palette-warning-100)"
            />
          </Grid>
          <Grid md={4} xs={12}>
            <VehicleCondition
              amount={error}
              color="var(--mui-palette-error-main)"
              description=""
              title="Outage"
              total={total}
              trackColor="var(--mui-palette-error-100)"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function VehicleCondition({ amount, color, description, title, total, trackColor }) {
  const chartSize = 50;
  const chartTickness = 12;

  const progress = Math.round((amount / total) * 100);

  const data = [
    { name: title, value: progress, color },
    { name: 'Empty', value: 100 - progress, color: trackColor },
  ];

  return (
    <Card variant="outlined">
      <Stack spacing={3} sx={{ alignItems: 'center', px: 2, py: 3 }}>
        <Typography variant="h6">{title}</Typography>
        <NoSsr fallback={<Box sx={{ height: `${chartSize}px`, width: `${chartSize}px` }} />}>
          <PieChart height={chartSize} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} width={chartSize}>
            <Pie
              animationDuration={300}
              cx={chartSize / 2}
              cy={chartSize / 2}
              data={data}
              dataKey="value"
              innerRadius={chartSize / 2 - chartTickness}
              nameKey="name"
              outerRadius={chartSize / 2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell fill={entry.color} key={entry.name} />
              ))}
            </Pie>
          </PieChart>
        </NoSsr>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">{amount}</Typography>
          <Typography color="text.secondary" variant="body2">
            {description}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}
