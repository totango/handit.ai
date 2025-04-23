import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { WarningDiamond } from '@phosphor-icons/react/dist/ssr';
import { WarningCircle, WarningOctagon } from '@phosphor-icons/react';

export function NumberOfErrors({ amount }) {
  return (
    <Card>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Avatar
            sx={{
              bgcolor: 'var(--mui-palette-background-paper)',
              boxShadow: 'var(--mui-shadows-8)',
              color: 'var(--mui-palette-text-primary)',
            }}
          >
            <WarningOctagon fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
          <Typography variant="h5">{amount}</Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          System Failure Alerts (24h)
        </Typography>
      </Stack>
    </Card>
  );
}
