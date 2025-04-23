'use client';

import * as React from 'react';
import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { X as XIcon } from '@phosphor-icons/react';


export function PromptComparisonModal({ originalPrompt, optimizedPrompt, open, setOpen }) {
  return (
    <Dialog fullWidth maxWidth="lg" open={open} sx={{}}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5" mb={6}>
              Prompt Comparison
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
            <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card
                sx={{
                  padding: '2vmax',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'scroll',
                  maxHeight: '78vh',
                  bgcolor: 'var(--mui-palette-neutral-800)'
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Base Model Prompt:
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                  {originalPrompt}
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
                  bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
                  maxHeight: '78vh',
                }}
              >
                <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                  Optimized Prompt:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    flexGrow: 1,
                  }}
                >
                  {optimizedPrompt}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
