/**
 * Metric Summary Card Component
 * 
 * Displays a summary of key metrics and performance indicators, showing:
 * - Current values
 * - Historical trends
 * - Comparative analysis
 * - Performance thresholds
 * - Status indicators
 */

'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * MetricSummaryCard Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Metric summary data
 * @param {Object} props.data.current - Current metric values
 * @param {Object} props.data.trends - Metric trends
 * @param {Object} props.data.thresholds - Performance thresholds
 * @param {Object} props.data.status - Status indicators
 * @returns {JSX.Element} The metric summary card component
 */
export function MetricSummaryCard({ title, leftValue, leftSubtitle, rightValue, rightSubtitle }) {
  return (
    <Card sx={{ height: '100%', bgcolor: 'var(--mui-palette-background-paper)' }}>
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{
              opacity: 0.7,
              mb: 2
            }}
          >
            {title}
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2
          }}>
            {/* Left Value */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: '28px',
                  lineHeight: 1,
                  color: 'text.primary'
                }}
              >
                {leftValue}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.7,
                  color: 'text.secondary',
                  fontSize: '14px',
                  mt: '4px'
                }}
              >
                {leftSubtitle}
              </Typography>
            </Box>

            {/* Right Value */}
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: '28px',
                  lineHeight: 1,
                  color: 'text.primary'
                }}
              >
                {rightValue}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.7,
                  color: 'text.secondary',
                  fontSize: '14px',
                  mt: '4px'
                }}
              >
                {rightSubtitle}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
} 