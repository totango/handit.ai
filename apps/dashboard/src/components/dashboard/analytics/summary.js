/**
 * Summary Analytics Component
 * 
 * Displays a comprehensive summary of analytics data, including:
 * - Total sessions
 * - Bounce rates
 * - Average session duration
 * - User engagement metrics
 * Includes trend indicators and percentage changes.
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TrendDown as TrendDownIcon } from '@phosphor-icons/react/dist/ssr/TrendDown';
import { TrendUp as TrendUpIcon } from '@phosphor-icons/react/dist/ssr/TrendUp';
import { Tooltip } from '@mui/material';
import { parseTitle } from '@/lib/text';

export const metricExplanations = {
  precision: `
    Precision measures how often the system's positive predictions are correct. 
    High precision minimizes false positives, like marking legitimate emails as spam.
  `,
  recall: `
    Recall measures how many actual positives the system identified correctly. 
    High recall reduces missed important cases, like undetected diseases in diagnoses.
  `,
  accuracy: `
    Accuracy is the percentage of all predictions that are correct. 
    It gives a general measure of performance but can be misleading in imbalanced datasets.
  `,
  f1: `
    The F1 score balances Precision and Recall, useful when both false positives and false negatives matter, 
    like in fraud detection where catching fraud and avoiding false alarms are equally important.
  `,
  average_coherence: `
    Average Coherence evaluates how logically consistent and sensible the model's response is in relation to the question. 
    It checks if the answer makes sense, follows a clear structure, and is contextually appropriate, even if it is not fully correct.
  `,
  average_relevance: `
    Average Relevance measures how well the model's response aligns with the given prompt or question. 
    It ensures that the response stays on-topic, directly addresses the query, and provides information that is meaningful and useful.
  `,
};

/**
 * Summary Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.systemAlerts - System failure alerts
 * @param {Object} props.performanceAlerts - Performance alerts
 * @param {Object} props.differenceSystemAlerts - Difference in system alerts
 * @param {Object} props.differencePerformanceAlerts - Difference in performance alerts
 * @param {Object} props.metric1 - First metric
 * @param {Object} props.metric2 - Second metric
 * @param {string} props.metricLabel1 - Label for the first metric
 * @param {string} props.metricLabel2 - Label for the second metric
 * @param {Object} props.metric3 - Third metric
 * @param {string} props.metricLabel3 - Label for the third metric
 * @param {Object} props.differenceMetric3 - Difference in the third metric
 * @param {Object} props.differenceMetric1 - Difference in the first metric
 * @param {Object} props.differenceMetric2 - Difference in the second metric
 * @returns {JSX.Element} The summary analytics component
 */
export function Summary({
  systemAlerts,
  performanceAlerts,
  differenceSystemAlerts,
  differencePerformanceAlerts,
  metric1,
  metric2,
  metricLabel1,
  metricLabel2,
  metric3,
  metricLabel3,
  differenceMetric3,
  differenceMetric1,
  differenceMetric2,
}) {


  return (
    <Card>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          p: 3,
        }}
      >
        <Tooltip title="System Failure Alerts: Problems in the system, like API errors or downtime, that could disrupt operations.">
          <Stack
            spacing={1}
            sx={{
              borderRight: { xs: 'none', md: '1px solid var(--mui-palette-divider)' },
              borderBottom: { xs: '1px solid var(--mui-palette-divider)', md: 'none' },
              pb: { xs: 2, md: 0 },
            }}
          >
            <Typography color="text.secondary">System Failure Alerts (30d)</Typography>
            <Typography variant="h3">{new Intl.NumberFormat('en-US').format(systemAlerts)}</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {differenceSystemAlerts >= 0 ? (
                <TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
              ) : (
                <TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
              )}
              <Typography color="text.secondary" variant="body2">
                <Typography
                  color={differenceSystemAlerts >= 0 ? 'success.main' : 'error.main'}
                  component="span"
                  variant="subtitle2"
                >
                  {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(differenceSystemAlerts)}
                </Typography>{' '}
                {differenceSystemAlerts >= 0 ? 'increase' : 'decrease'} vs last month
              </Typography>
            </Stack>
          </Stack>
        </Tooltip>

        <Tooltip title={metricExplanations[metricLabel3?.toLowerCase()] || `Current ${metricLabel3} Value`}>
          <Stack
            spacing={1}
            sx={{
              borderRight: { xs: 'none', md: '1px solid var(--mui-palette-divider)' },
              borderBottom: { xs: '1px solid var(--mui-palette-divider)', md: 'none' },
              pb: { xs: 2, md: 0 },
            }}
          >
            <Typography color="text.secondary">Current {parseTitle(metricLabel3)} Value</Typography>
            <Typography variant="h3">
              {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, style: 'percent' }).format(metric3)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {differenceMetric3 >= 0 ? (
                <TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
              ) : (
                <TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
              )}
              <Typography color="text.secondary" variant="body2">
                <Typography
                  color={differenceMetric3 >= 0 ? 'success.main' : 'error.main'}
                  component="span"
                  variant="subtitle2"
                >
                  {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(differenceMetric3)}
                </Typography>{' '}
                {differenceMetric1 >= 0 ? 'increase' : 'decrease'} vs last month
              </Typography>
            </Stack>
          </Stack>
        </Tooltip>

        <Tooltip title={metricExplanations[metricLabel1?.toLowerCase()] || `Current ${metricLabel1} Value`}>
          <Stack
            spacing={1}
            sx={{
              borderRight: { xs: 'none', md: '1px solid var(--mui-palette-divider)' },
              borderBottom: { xs: '1px solid var(--mui-palette-divider)', md: 'none' },
              pb: { xs: 2, md: 0 },
            }}
          >
            <Typography color="text.secondary">Current {parseTitle(metricLabel1)} Value</Typography>
            <Typography variant="h3">
              {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, style: 'percent' }).format(metric1)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {differenceMetric1 >= 0 ? (
                <TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
              ) : (
                <TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
              )}
              <Typography color="text.secondary" variant="body2">
                <Typography
                  color={differenceMetric1 >= 0 ? 'success.main' : 'error.main'}
                  component="span"
                  variant="subtitle2"
                >
                  {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(differenceMetric1)}
                </Typography>{' '}
                {differenceMetric1 >= 0 ? 'increase' : 'decrease'} vs last month
              </Typography>
            </Stack>
          </Stack>
        </Tooltip>

        <Tooltip title={metricExplanations[metricLabel2?.toLowerCase()] || `Current ${metricLabel2} Value`}>
          <Stack spacing={1}>
            <Typography color="text.secondary">Current {parseTitle(metricLabel2)} Value</Typography>
            <Typography variant="h3">
              {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, style: 'percent' }).format(metric2)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {differenceMetric2 >= 0 ? (
                <TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
              ) : (
                <TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
              )}
              <Typography color="text.secondary" variant="body2">
                <Typography
                  color={differenceMetric2 >= 0 ? 'success.main' : 'error.main'}
                  component="span"
                  variant="subtitle2"
                >
                  {new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(differenceMetric2)}
                </Typography>{' '}
                {differenceMetric2 >= 0 ? 'increase' : 'decrease'} vs last month
              </Typography>
            </Stack>
          </Stack>
        </Tooltip>
      </Box>
    </Card>
  );
}
