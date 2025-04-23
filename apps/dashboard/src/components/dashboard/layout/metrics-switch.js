'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { usePopover } from '@/hooks/use-popover';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { parseTitle } from '@/lib/text.js';

export function MetricsSwitch({ onMetricChange, metric, metrics }) {
  const popover = usePopover();

  React.useEffect(() => {
    if (metrics && metrics.length) {
      onMetricChange(metrics[0]);
    }
  }, [metrics]);

  const onChange = (metric) => {
    onMetricChange(metric);
    popover.handleClose();
  };

  return (
    <React.Fragment>
      <Stack
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          marginBottom: '10px',
          justifyContent: 'end',
          paddingRight: '10px',
        }}
      >
        <Stack
          direction="row"
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          spacing={2}
          sx={{
            alignItems: 'center',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '12px',
            cursor: 'pointer',
            p: '4px 8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <ToggleButtonGroup
              color="primary"
              aria-label="Platform"
              sx={{
                borderRadius: '50px',
              }}
              value={metric?.id}
            >
              {(metrics || []).sort((a, b) => a.name.localeCompare(b.name)).map((metric) => (
                <ToggleButton key={metric.id} value={metric.id}
                  sx={{
                    fontSize: '0.7rem',
                    marginLeft: '4px',
                    marginRight: '4px',
                  }}
                  style={{
                    borderRadius: '50px',
                    padding: '4px 8px',
                    minWidth: '80px'
                  }}
                  onClick={() => onChange(metric)}
                >
                  {parseTitle(metric.name)}
                </ToggleButton>
                ))}
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
