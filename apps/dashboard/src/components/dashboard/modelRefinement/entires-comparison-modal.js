'use client';

import * as React from 'react';
import { Box, Button, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { X as XIcon } from '@phosphor-icons/react';

import { parseInput } from '@/lib/text';

export function EntriesComparisonModal({ originalEntry, optimizedEntry, open, setOpen, changeEntries }) {
  return (
    <Dialog fullWidth maxWidth="lg" open={open} sx={{}}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5" mb={6}>
              Entries Comparison
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
                  maxHeight: '30vh',
                  overflow: 'scroll',
                  bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Input:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                  {parseInput(originalEntry?.input, -1, 1)}
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
                  maxHeight: '35vh',
                  bgcolor: 'var(--mui-palette-neutral-800)',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Base Model Output:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                  {parseInput(originalEntry?.output)}
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
                  bgcolor: 'var(--mui-palette-neutral-800)',
                  maxHeight: '35vh',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Optimized Model Output:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    flexGrow: 1,
                  }}
                >
                  {parseInput(optimizedEntry?.output)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Stack>
        <Grid
          item
          xs={4}
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button
            onClick={changeEntries}
            variant="outlined"
            sx={{
              maxWidth: '200px',
              marginTop: '30px',
            }}
            style={{
              backgroundColor: 'rgba(235,228,253, 0.8) !important',
            }}
          >
            {'Show Next Entry'}
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
