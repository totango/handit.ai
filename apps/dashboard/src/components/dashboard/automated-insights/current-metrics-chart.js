/**
 * Current Metrics Chart Component
 * 
 * Displays real-time metrics visualization, showing:
 * - Current performance indicators
 * - Metric trends
 * - Comparative analysis
 * - Performance thresholds
 */

'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartBar } from '@phosphor-icons/react';
import { Button } from '@mui/material';
import { ArrowRightIcon } from '@mui/x-date-pickers';
import { parseTitle } from '@/lib/text';

function MetricProgressBar({ label, value, index }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {label && label.length > 0 ? label : (index === 0 ? 'Accuracy' : index === 1 ? 'Precision' : 'Recall')}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {(value * 100).toFixed(1)}%
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', width: '100%', height: 5, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${value * 100}%`,
            bgcolor: 'primary.400',
            borderRadius: 1,
            transition: 'width 0.5s ease-in-out',
          }}
        />
      </Box>
    </Box>
  );
}

/**
 * CurrentMetricsChart Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Metrics data
 * @param {Array<Object>} props.data.series - Time series data
 * @param {string} props.data.series[].name - Metric name
 * @param {Array<number>} props.data.series[].data - Metric values
 * @param {Array<string>} props.data.categories - Time categories
 * @returns {JSX.Element} The current metrics chart component
 */
export function CurrentMetricsChart({ metrics, setOpen, height, disabled = false }) {
  return (
    <Card sx={{ height: height || '100%' }}>
      <CardHeader
        avatar={
          <Avatar>
            <ChartBar fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Current Metrics"
        sx={{ paddingBottom: '8px' }}
      />
      <CardContent>
        <Stack spacing={3} sx={{ height: '100%', pt: 1 }}>
          {metrics.slice(0, 3).map((metric, index) => (
            <MetricProgressBar
              key={metric.label}
              label={parseTitle(metric.label)}
              value={metric.value}
              index={index}
            />
          ))}
        </Stack>
        {!disabled && <Button variant="text" color="secondary" endIcon={<ArrowRightIcon />} sx={{ float: 'right', mt: 2 }} onClick={() => setOpen(true)}>
          View All
        </Button>}
      </CardContent>
    </Card>
  );
} 