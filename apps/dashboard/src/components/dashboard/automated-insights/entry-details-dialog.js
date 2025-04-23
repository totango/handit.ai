/**
 * Entry Details Dialog Component
 * 
 * Displays detailed information about a specific entry, showing:
 * - Entry metadata
 * - Performance metrics
 * - Related insights
 * - Historical data
 * - Action recommendations
 */


import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  Typography,
  Stack,
  Box,
  IconButton,
  Grid,
  Card,
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react';

const parseInput = (input, start = 0, end = 0) => {
  if (!input) return '';
  try {
    if (Array.isArray(input)) {
      if (start === -1) {
        return input[input.length - 1]?.content || '';
      }
      if (end === -1) {
        return input.slice(start, input.length - 1)?.map((i) => i.content).join('\n\n') || '';
      }
      if (end === 0) {
        return input.slice(start)?.map((i) => i.content).join('\n\n') || '';
      }
      return input.slice(start, end)?.map((i) => i.content).join('\n\n') || '';
    }
    return typeof input === 'object' ? JSON.stringify(input, null, 2) : input;
  } catch (e) {
    return input;
  }
};

const isCorrect = (entry) => {
  return entry?.isCorrect || false;
};

/**
 * EntryDetailsDialog Component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Object} props.entry - Entry data to display
 * @param {string} props.entry.id - Entry identifier
 * @param {Object} props.entry.metrics - Entry performance metrics
 * @param {Array<Object>} props.entry.insights - Related insights
 * @returns {JSX.Element} The entry details dialog component
 */
export function EntryDetailsDialog({ entryData, open, onClose }) {
  const router = useRouter();

  if (!entryData) return null;

  return (
    <Dialog fullWidth maxWidth="lg" open={open}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5" mb={6}>
              {isCorrect(entryData) ? 'Correct' : 'Incorrect'} Model Prediction
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={onClose}>
              <XIcon />
            </IconButton>
          </Box>
        </Stack>
        <Stack spacing={2}>
          <Grid container spacing={4} style={{ height: '100%' }} alignItems="stretch">
            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card
                sx={{
                  padding: '2vmax',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '250px',
                  overflow: 'auto',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Context:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                  {parseInput(entryData?.input, 0, -1)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card
                sx={{
                  padding: '2vmax',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '350px',
                  overflow: 'auto',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Input:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                  {parseInput(entryData?.input, -1, 1)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card
                sx={{
                  padding: '2vmax',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '350px',
                  overflow: 'auto',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Output:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    flexGrow: 1,
                  }}
                >
                  {parseInput(entryData?.output)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
    </Dialog>
  );
} 