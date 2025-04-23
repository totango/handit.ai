/**
 * Agent Current Metrics Analytics Component
 * 
 * Displays real-time metrics for agent performance, showing:
 * - Current session counts
 * - Active user metrics
 * - Response time statistics
 * - Success rate indicators
 * - Performance trends
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

function CustomizedTick(props) {
  const { x, y, stroke, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fill="#666">
        <tspan textAnchor="middle" x="0">
          Line 1
        </tspan>
        <tspan textAnchor="middle" x="0" dy="20">
          Line 2
        </tspan>
        <tspan textAnchor="middle" x="0" dy="40">
          Line 3
        </tspan>
      </text>
    </g>
  );
}

const bars = [
  { name: 'Current Month', dataKey: 'v1', color: 'var(--mui-palette-primary-400)' },
  { name: 'Last Month', dataKey: 'v2', color: 'var(--mui-palette-primary-light)' },
];

/**
 * AgentCurrentMetrics Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Real-time agent metrics
 * @param {Array<Object>} props.data.series - Time series metrics
 * @param {string} props.data.series[].name - Metric name
 * @param {Array<number>} props.data.series[].value - Metric values
 * @param {Array<string>} props.data.categories - Time periods
 * @returns {JSX.Element} The agent current metrics component
 */
export function AgentCurrentMetrics({ data, title = true }) {
  const chartHeight = 330;

  return (
    <Stack divider={<Divider />} spacing={3}>
      <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
        <ResponsiveContainer height={chartHeight}>
          <BarChart
            barGap={10}
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 40, bottom: 0, left: 60 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="2 4" syncWithTicks />
            <XAxis
              axisLine={false}
              tickLine={false}
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis axisLine={false} dataKey="label" tick={<Tick />} tickLine={false} type="category" width={20} />
            {bars.map((bar) => (
              <Bar
                animationDuration={300}
                dataKey={bar.dataKey}
                fill={bar.color}
                key={bar.dataKey}
                barSize={12}
                name={bar.name}
                radius={[0, 5, 5, 0]}
                label={(props) => {
                  const value = props.value?.toFixed(1);
                  return (
                    <text
                      x={props.x + props.width + 5}
                      y={props.y + props.height / 2}
                      fill="var(--mui-palette-text-primary)"
                      textAnchor="start"
                      dominantBaseline="central"
                      fontSize={12}
                      color="text.secondary"
                    >
                      {`${parseInt(value)}%`}
                    </text>
                  );
                }}
              />
            ))}
            <Tooltip animationDuration={50} content={<TooltipContent />} cursor={false} />

          </BarChart>
        </ResponsiveContainer>
      </NoSsr>
    </Stack>
  );
}

function Tick({ height, payload, width, x, y }) {
  const { value } = payload;
  const lines = parseTitle(value).split(' ');

  return (
    <foreignObject
      height={50}  // Fixed height to accommodate two lines
      width={100}  // Fixed width for text
      x={(x ?? 0) - 110}  // Adjusted x position
      y={(y ?? 0) - 30}   // Adjusted y position to center vertically
    >
      <Stack
        direction="column"
        spacing={0}
        sx={{
          alignItems: 'flex-end',
          justifyContent: 'center',
          height: '100%',
          width: '100%'
        }}
      >
        {lines.map((line, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              lineHeight: 1.2,
              display: 'block',
              width: '100%',
              textAlign: 'right',
              fontSize: '0.75rem'
            }}
          >
            {line.trim()}
          </Typography>
        ))}
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
              {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(entry.value / 100)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
