/**
 * Primary Color Options Component
 * 
 * A settings component that allows users to customize the application's
 * primary color theme. Provides a visual interface with color swatches
 * for different color options, each with a descriptive label.
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';

import { Option } from './option';

/**
 * Primary Color Options Component
 * 
 * Renders a group of options for selecting the application's primary color.
 * Each option is represented by a color swatch with a label, showing the
 * actual color that will be applied when selected.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function when selection changes
 * @param {string} props.value - Currently selected color theme
 * @returns {JSX.Element} A stack of color options with visual swatches
 */
export function OptionsPrimaryColor({ onChange, value }) {
  return (
    <Stack spacing={1}>
      {/* Section Label */}
      <InputLabel>Primary color</InputLabel>

      {/* Color Options Container */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Chateau Green', value: 'chateauGreen', color: '#16b364' },
          { label: 'Neon Blue', value: 'neonBlue', color: '#635bff' },
          { label: 'Royal Blue', value: 'royalBlue', color: '#5265ff' },
          { label: 'Tomato Orange', value: 'tomatoOrange', color: '#ff6c47' },
        ].map((option) => (
          <Option
            icon={
              <Box
                sx={{
                  bgcolor: option.color,
                  borderRadius: '50%',
                  flex: '0 0 auto',
                  height: '24px',
                  width: '24px'
                }}
              />
            }
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
