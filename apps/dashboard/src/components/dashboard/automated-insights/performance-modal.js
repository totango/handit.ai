/**
 * Performance Modal Component
 * 
 * Displays a modal dialog showing detailed performance metrics and insights,
 * including:
 * - Performance trends
 * - Key metrics visualization
 * - Comparative analysis
 * - Performance recommendations
 */

'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
} from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle, Warning, X as XIcon } from '@phosphor-icons/react';
import { CountrySessionsVsBounceRate } from '../analytics/country-sessions-vs-bounce-rate';

/**
 * PerformanceModal Component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Object} props.data - Performance data to display
 * @returns {JSX.Element} The performance modal component
 */
export function PerformanceModal({ data, open, setOpen }) {
  return (
    <Dialog fullWidth maxWidth="md" open={open} sx={{}}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5" mb={6}>
              Performance Details
            </Typography>{' '}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={() => {
                setOpen(false);
              }}
            >
              <XIcon />
            </IconButton>
          </Box>
        </Stack>
        <Stack spacing={2}>
          <CountrySessionsVsBounceRate
            data={
              Object.keys(data || {}).map((key) => ({
                label: key,
                v1: data[key].currentMonth * 100.0 || 0,
                v2: data[key].previousMonth * 100.0 || 0,
              })) || []
            }
            title={false}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
