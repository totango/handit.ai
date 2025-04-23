/**
 * Layout Options Component
 * 
 * A settings component that allows users to switch between vertical and horizontal
 * dashboard layouts. Provides a visual interface with interactive previews of each
 * layout option, including tooltips and visual feedback for selection.
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';

/**
 * Layout Options Component
 * 
 * Renders a group of options for selecting the dashboard's layout orientation.
 * Each option is represented by an interactive preview with a label, showing
 * how the layout will appear when selected.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function when selection changes
 * @param {string} props.value - Currently selected layout ('vertical' or 'horizontal')
 * @returns {JSX.Element} A stack of layout options with visual previews
 */
export function OptionsLayout({ onChange, value }) {
  return (
    <Stack spacing={1}>
      {/* Header with Label and Tooltip */}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <InputLabel>Layout</InputLabel>
        <Tooltip placement="top" title="Dashboard only">
          <InfoIcon color="var(--mui-palette-text-secondary)" fontSize="var(--icon-fontSize-md)" weight="fill" />
        </Tooltip>
      </Stack>

      {/* Layout Options Grid */}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, minmax(0, 140px))' }}>
        {[
          { label: 'Vertical', value: 'vertical', icon: <VerticalIcon /> },
          { label: 'Horizontal', value: 'horizontal', icon: <HorizontalIcon /> },
        ].map((option) => (
          <Stack key={option.value} spacing={1}>
            {/* Interactive Preview Box */}
            <Box
              onClick={() => {
                onChange?.(option.value);
              }}
              role="button"
              sx={{
                borderRadius: 1,
                cursor: 'pointer',
                display: 'flex',
                height: '88px',
                position: 'relative',
                '&::before': {
                  borderRadius: 'inherit',
                  bottom: 0,
                  content: '" "',
                  left: 0,
                  pointerEvents: 'none',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  ...(option.value === value && { boxShadow: '0 0 0 2px var(--mui-palette-primary-main)' }),
                },
              }}
              tabIndex={0}
            >
              {option.icon}
            </Box>
            {/* Option Label */}
            <Typography sx={{ textAlign: 'center' }} variant="subtitle2">
              {option.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}

/**
 * Vertical Layout Preview Icon
 * 
 * Renders a visual representation of the vertical layout option,
 * showing a sidebar with navigation items and a main content area.
 * 
 * @returns {JSX.Element} A box containing the vertical layout preview
 */
function VerticalIcon() {
  return (
    <Box
      sx={{
        border: '1px solid var(--mui-palette-divider)',
        borderRadius: 'inherit',
        display: 'flex',
        flex: '1 1 auto',
      }}
    >
      {/* Navigation Sidebar */}
      <Box sx={{ borderRight: '1px dashed var(--mui-palette-divider)', px: 1, py: 0.5 }}>
        <Stack spacing={1}>
          <Box sx={{ bgcolor: 'var(--mui-palette-primary-main)', borderRadius: '2px', height: '4px', width: '26px' }} />
          <Box
            sx={{ bgcolor: 'var(--mui-palette-background-level3)', borderRadius: '2px', height: '4px', width: '26px' }}
          />
          <Box
            sx={{ bgcolor: 'var(--mui-palette-background-level3)', borderRadius: '2px', height: '4px', width: '26px' }}
          />
        </Stack>
      </Box>
      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: '1 1 auto', p: 1 }}>
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-background-level1)',
            border: '1px dashed var(--mui-palette-divider)',
            borderRadius: 1,
            flex: '1 1 auto',
          }}
        />
      </Box>
    </Box>
  );
}

/**
 * Horizontal Layout Preview Icon
 * 
 * Renders a visual representation of the horizontal layout option,
 * showing a top navigation bar and a main content area.
 * 
 * @returns {JSX.Element} A box containing the horizontal layout preview
 */
function HorizontalIcon() {
  return (
    <Box
      sx={{
        border: '1px solid var(--mui-palette-divider)',
        borderRadius: 'inherit',
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
      }}
    >
      {/* Top Navigation Bar */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', borderBottom: '1px dashed var(--mui-palette-divider)', px: 1, py: '4px' }}
      >
        <Box sx={{ bgcolor: 'var(--mui-palette-primary-main)', borderRadius: '2px', height: '4px', width: '16px' }} />
        <Box
          sx={{ bgcolor: 'var(--mui-palette-background-level3)', borderRadius: '2px', height: '4px', width: '16px' }}
        />
        <Box
          sx={{ bgcolor: 'var(--mui-palette-background-level3)', borderRadius: '2px', height: '4px', width: '16px' }}
        />
      </Stack>
      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: '1 1 auto', p: 1 }}>
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-background-level1)',
            border: '1px dashed var(--mui-palette-divider)',
            borderRadius: 1,
            flex: '1 1 auto',
          }}
        />
      </Box>
    </Box>
  );
}
