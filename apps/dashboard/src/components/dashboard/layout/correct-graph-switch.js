'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import { usePopover } from '@/hooks/use-popover';

import { GraphPopover } from './graph-popover';

export function CorrectGraphSwitch({ onTypeChange, type }) {
  const popover = usePopover();

  return (
    <React.Fragment>
      <Stack
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingLeft: '2vmax',
          justifyContent: 'flex-end',
          marginTop: '-10%'
        }}
      >
        <Stack
          direction="row"
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          spacing={2}
          sx={{
            alignItems: 'center',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            cursor: 'pointer',
            p: '4px 8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '54px'
            }}
          >
            <Typography color="var(--Workspaces-name-color)" variant="subtitle2">
              {type}
            </Typography>
          </Box>
          <CaretUpDownIcon color="rgba(255, 255, 255, 0.6)" fontSize="var(--icon-fontSize-sm)" />
        </Stack>
      </Stack>
      {/* call the popover when having multiple users available */}
      <GraphPopover
        anchorEl={popover.anchorRef?.current}
        open={popover?.open}
        onClose={popover?.handleClose}
        items={[
          'Correct', 'Incorrect'
        ]}
        onChange={onTypeChange}
      />
    </React.Fragment>
  );
}
