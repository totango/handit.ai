/**
 * Color Scheme Options Component
 * 
 * A settings component that allows users to switch between light and dark color schemes.
 * Provides a visual interface with icons and labels for each theme option.
 */

'use client';

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { Moon as MoonIcon } from '@phosphor-icons/react/dist/ssr/Moon';
import { Sun as SunIcon } from '@phosphor-icons/react/dist/ssr/Sun';

import { Option } from './option';

/**
 * Color Scheme Options Component
 * 
 * Renders a group of options for selecting the application's color scheme.
 * Each option is represented by a chip with an icon and label, with the
 * currently selected option highlighted.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function when selection changes
 * @param {string} props.value - Currently selected color scheme ('light' or 'dark')
 * @returns {JSX.Element} A stack of color scheme options with labels
 */
export function OptionsColorScheme({ onChange, value }) {
  return (
    <Stack spacing={1}>
      {/* Section Label */}
      <InputLabel>Color scheme</InputLabel>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Light', value: 'light', icon: <SunIcon /> },
          { label: 'Dark', value: 'dark', icon: <MoonIcon /> },
        ].map((option) => (
          <Option
            icon={option.icon}
            key={option.value}
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
