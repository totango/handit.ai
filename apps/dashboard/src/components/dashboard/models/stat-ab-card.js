/**
 * @fileoverview StatAbCard component for displaying A/B testing statistics
 * Provides a card interface for showing statistical comparisons between two versions
 */

'use client';

import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';
import { ArrowUp, ArrowDown } from '@phosphor-icons/react';

/**
 * StatAbCard component for displaying A/B testing statistics
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {number} props.valueA - Value for version A
 * @param {number} props.valueB - Value for version B
 * @param {string} [props.suffix='%'] - Suffix for values
 * @returns {JSX.Element} Rendered stat card component
 * 
 * @description
 * This component provides:
 * - A/B testing statistics display
 * - Version comparison visualization
 * - Percentage difference calculation
 * - Color-coded performance indicators
 */
export function StatABCard() {
  // Mock data - replace with actual data fetching
  const metrics = [
    {
      name: 'Accuracy',
      valueA: 85,
      valueB: 92,
      unit: '%',
    },
    {
      name: 'Response Time',
      valueA: 250,
      valueB: 180,
      unit: 'ms',
      lowerIsBetter: true,
    },
    {
      name: 'Cost per 1K tokens',
      valueA: 0.03,
      valueB: 0.04,
      unit: '$',
      lowerIsBetter: true,
    },
  ];

  const calculateDiff = (valueA, valueB, lowerIsBetter = false) => {
    const diff = ((valueB - valueA) / valueA) * 100;
    const isPositive = lowerIsBetter ? diff < 0 : diff > 0;
    return { diff: Math.abs(diff.toFixed(1)), isPositive };
  };

  return (
    <Card>
      <CardHeader title="Metrics Comparison" />
      <CardContent>
        <Stack spacing={3}>
          {metrics.map((metric) => {
            const { diff, isPositive } = calculateDiff(
              metric.valueA,
              metric.valueB,
              metric.lowerIsBetter
            );

            return (
              <Box key={metric.name}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="subtitle2">{metric.name}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {isPositive ? (
                      <ArrowUp color="success" weight="bold" />
                    ) : (
                      <ArrowDown color="error" weight="bold" />
                    )}
                    <Typography
                      variant="subtitle2"
                      color={isPositive ? 'success.main' : 'error.main'}
                    >
                      {diff}%
                    </Typography>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary" mb={0.5}>
                      Version A
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={(metric.valueA / Math.max(metric.valueA, metric.valueB)) * 100}
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="body2">
                        {metric.valueA}
                        {metric.unit}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box flex={1}>
                    <Typography variant="caption" color="text.secondary" mb={0.5}>
                      Version B
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={(metric.valueB / Math.max(metric.valueA, metric.valueB)) * 100}
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="body2">
                        {metric.valueB}
                        {metric.unit}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
} 