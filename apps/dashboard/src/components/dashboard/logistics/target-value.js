import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Target, WarningCircle } from '@phosphor-icons/react';

export function TargetValue({ amount, title }) {
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
            <Target fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
          <Typography variant="h5">{new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(amount)}</Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          Target {title} value
        </Typography>
      </Stack>
    </Card>
  );
}
