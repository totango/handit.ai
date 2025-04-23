import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function StatCard({ title, subTitle, icon }) {
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
            {icon}
          </Avatar>
          <Typography variant="h5">{title}</Typography>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          {subTitle}
        </Typography>
      </Stack>
    </Card>
  );
}
