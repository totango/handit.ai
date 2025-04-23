/**
 * Insight Details Modal Component
 * 
 * Displays detailed information about a specific insight, showing:
 * - Insight description
 * - Related metrics
 * - Impact analysis
 * - Action recommendations
 * - Historical context
 */

import * as React from 'react';
import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { X as XIcon } from '@phosphor-icons/react';

import { parseInput } from '@/lib/text';

/**
 * InsightDetailsModal Component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Object} props.insight - Insight data to display
 * @param {string} props.insight.title - Insight title
 * @param {string} props.insight.description - Insight description
 * @param {Object} props.insight.metrics - Related metrics
 * @param {string} props.insight.impact - Impact analysis
 * @returns {JSX.Element} The insight details modal component
 */
export function InsightDetailsModal({ insight, problem, entry, open, onClose }) {
  return (
    <Dialog fullWidth maxWidth="lg" open={open}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5" mb={6}>
              Insight Details
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={onClose}>
              <XIcon />
            </IconButton>
          </Box>
        </Stack>

        {/* Content */}
        <Stack spacing={2}>
          <Grid container spacing={4} style={{ height: '100%' }} alignItems="stretch">
            {/* Problem and Insight Section */}
            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
              <Stack spacing={2}>
                {/* Problem Card */}
                <Card
                  sx={{
                    padding: '2vmax',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'rgba(var(--mui-palette-error-mainChannel) / 0.1)',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ marginBottom: 2, color: 'error.main' }}>
                    Problem Identified:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                    {problem}
                  </Typography>
                </Card>

                {/* Insight Card */}
                <Card
                  sx={{
                    padding: '2vmax',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.1)',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ marginBottom: 2, color: 'primary.main' }}>
                    Actionable Insight:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                    {insight}
                  </Typography>
                </Card>
              </Stack>
            </Grid>

            {/* Entry Details Section */}
            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card
                sx={{
                  padding: '2vmax',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '30vh',
                  overflow: 'auto',
                  bgcolor: 'var(--mui-palette-neutral-800)',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Triggering Entry:
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Input:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {entry?.input ? parseInput(entry.input) : 'No input available'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Output:
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {entry?.output ? parseInput(entry.output) : 'No output available'}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
    </Dialog>
  );
} 