/**
 * Insight Modal Component
 * 
 * Displays a modal with insights and analysis, showing:
 * - Key insights
 * - Performance metrics
 * - Trend analysis
 * - Recommendations
 * - Action items
 */

'use client';

import * as React from 'react';
import { Box, Button, Dialog, DialogContent, Grid, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle, Warning, X as XIcon } from '@phosphor-icons/react';

import { parseInput } from '@/lib/text';
import { parseOutputContent } from '@/lib/parsers';

/**
 * InsightModal Component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Object} props.data - Insight data to display
 * @param {Array<Object>} props.data.insights - List of insights
 * @param {Object} props.data.metrics - Performance metrics
 * @param {Object} props.data.trends - Trend analysis
 * @returns {JSX.Element} The insight modal component
 */
export function InsightModal({ problem, insight, description, entry, open, setOpen }) {
  return (
    <Dialog fullWidth maxWidth="lg" open={open} sx={{}}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5" mb={6}>
              Insight Details
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
          <Grid container spacing={4} style={{ height: '100%' }} alignItems="stretch">
            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card
                sx={{
                  padding: '2vmax',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'scroll',
                  maxHeight: '35vh',
                  bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
                }}
              >
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    transition: 'background-color 0.2s',
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon sx={{ marginRight: 2 }}>
                    <Warning size={24} color="var(--mui-palette-warning-main)" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        Problem: {problem}
                      </Stack>
                    }
                    secondary={
                      <>

                        {" " + description}
                        <br />
                        <Typography component="span" variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <CheckCircle size={16} style={{ marginRight: 8 }} />
                          Solution: {insight}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Card>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card
                sx={{
                  padding: '2vmax',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '50vh',
                  overflow: 'scroll',
                  bgcolor: 'var(--mui-palette-neutral-800)',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Input:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                  {parseInput(entry?.input, -1, 1)}
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
                  overflow: 'scroll',
                  maxHeight: '60vh',
                  bgcolor: 'var(--mui-palette-neutral-800)',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Output:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                  {parseOutputContent(entry?.output)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
