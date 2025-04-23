'use client';

import * as React from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { CountrySessionsVsBounceRate } from '../analytics/country-sessions-vs-bounce-rate';

export function MetricsComparisonModal({ leftVersion, rightVersion, open, setOpen }) {
  const metricsData = React.useMemo(() => {
    if (!leftVersion || !rightVersion) return [];
    
    const metrics = ['accuracy', 'f1', 'precision', 'recall'];
    return metrics.map(metric => ({
      label: metric.charAt(0).toUpperCase() + metric.slice(1),
      v1: (leftVersion.metrics?.[metric] || 0) * 100,
      v2: (rightVersion.metrics?.[metric] || 0) * 100,
    }));
  }, [leftVersion, rightVersion]);

  return (
    <Dialog fullWidth maxWidth="md" open={open}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5" mb={6}>
              Metrics Comparison
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => setOpen(false)}>
              <XIcon />
            </IconButton>
          </Box>
        </Stack>
        <Stack spacing={2}>
          <CountrySessionsVsBounceRate
            data={metricsData}
            title={false}
            labels={{
              v1: `Version ${leftVersion?.version || ''}`,
              v2: `Version ${rightVersion?.version || ''}`,
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
} 