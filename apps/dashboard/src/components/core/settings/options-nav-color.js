/**
 * Navigation Color Options Component
 * 
 * A settings component that allows users to customize the navigation bar's
 * color scheme. Provides options for different levels of visual prominence
 * in the dashboard's navigation area.
 */

'use client';

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Info as InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';

import { Option } from './option';

/**
 * Navigation Color Options Component
 * 
 * Renders a group of options for selecting the navigation bar's color scheme.
 * Each option represents a different level of visual prominence, from subtle
 * to more noticeable styles.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function when selection changes
 * @param {string} props.value - Currently selected color scheme ('blend_in', 'discrete', or 'evident')
 * @returns {JSX.Element} A stack of navigation color options with labels
 */
export function OptionsNavColor({ onChange, value }) {
  return (
    <Stack spacing={1}>
      {/* Header with Label and Tooltip */}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <InputLabel>Nav color</InputLabel>
        <Tooltip placement="top" title="Dashboard only">
          <InfoIcon color="var(--mui-palette-text-secondary)" fontSize="var(--icon-fontSize-md)" weight="fill" />
        </Tooltip>
      </Stack>

      {/* Color Options Container */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Blend-in', value: 'blend_in' },
          { label: 'Discrete', value: 'discrete' },
          { label: 'Evident', value: 'evident' },
        ].map((option) => (
          <Option
            key={option.label}
            label={option.label}
            onClick={() => {
              onChange?.(option.value);
            }}
            selected={option.value === value}
          />
        ))}
      </Stack>
    </Stack>
  );
}
