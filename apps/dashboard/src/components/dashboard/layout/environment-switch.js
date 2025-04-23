'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Warning } from '@phosphor-icons/react';

export function EnvironmentSwitch() {
  // Get initial environment from localStorage or default to 'production'
  const [environment, setEnvironment] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('environment') || 'production';
    }
    return 'production';
  });

  const handleEnvironmentChange = (event, newEnvironment) => {
    if (newEnvironment !== null) {
      setEnvironment(newEnvironment);
      localStorage.setItem('environment', newEnvironment);
    }
  };

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          border: '1px solid var(--Workspaces-border-color)',
          borderRadius: '12px',
          p: '4px 8px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {environment === 'staging' && (
            <Warning 
              size={20} 
              weight="fill" 
              color="var(--warning-main)"
            />
          )}
          <Typography
            variant="subtitle2"
            sx={{ 
              color: environment === 'staging' 
                ? 'var(--warning-main)' 
                : 'var(--success-main)'
            }}
          >
            Environment:
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={environment}
          exclusive
          onChange={handleEnvironmentChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 1,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.875rem',
            },
          }}
        >
          <ToggleButton 
            value="production"
            sx={{ 
              color: environment === 'production' ? 'var(--success-main) !important' : 'inherit',
              borderColor: environment === 'production' ? 'var(--success-main) !important' : 'inherit'
            }}
          >
            Production
          </ToggleButton>
          <ToggleButton 
            value="staging"
            sx={{ 
              color: environment === 'staging' ? 'var(--warning-main) !important' : 'inherit',
              borderColor: environment === 'staging' ? 'var(--warning-main) !important' : 'inherit'
            }}
          >
            Staging
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
} 