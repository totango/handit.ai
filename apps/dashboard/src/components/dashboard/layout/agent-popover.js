import * as React from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { parseTitle } from '@/lib/text';

export function AgentPopover({ anchorEl, agents = [], onChange, onClose, open }) {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          maxWidth: 300,
          p: 2,
        },
      }}
    >
      <Stack spacing={2}>
        {agents.map((agent) => (
          <Box
            key={agent.id}
            onClick={() => onChange(agent.id)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'var(--mui-palette-action-hover)',
              },
              p: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle1">{parseTitle(agent.name)}</Typography>
            <div style={{maxHeight: '40px', textOverflow: 'ellipsis', overflow: 'hidden'}}>
              <Typography variant="body2" color="text.secondary" sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {agent.description || 'No description'}
              </Typography>
            </div>
          </Box>
        ))}
      </Stack>
    </Popover>
  );
} 