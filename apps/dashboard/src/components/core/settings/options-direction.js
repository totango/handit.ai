/**
 * Text Direction Options Component
 * 
 * A settings component that allows users to switch between left-to-right (LTR)
 * and right-to-left (RTL) text orientations. Provides a visual interface with
 * icons and labels for each direction option.
 */

'use client';

import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { TextAlignLeft as TextAlignLeftIcon } from '@phosphor-icons/react/dist/ssr/TextAlignLeft';
import { TextAlignRight as TextAlignRightIcon } from '@phosphor-icons/react/dist/ssr/TextAlignRight';

import { Option } from './option';

/**
 * Text Direction Options Component
 * 
 * Renders a group of options for selecting the application's text direction.
 * Each option is represented by a chip with an icon and label, with the
 * currently selected option highlighted.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onChange - Callback function when selection changes
 * @param {string} props.value - Currently selected direction ('ltr' or 'rtl')
 * @returns {JSX.Element} A stack of text direction options with labels
 */
export function OptionsDirection({ onChange, value }) {
  return (
    <Stack spacing={1}>
      {/* Section Label */}
      <InputLabel>Orientation</InputLabel>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Left-to-right', value: 'ltr', icon: <TextAlignLeftIcon /> },
          { label: 'Right-to-left', value: 'rtl', icon: <TextAlignRightIcon /> },
        ].map((option) => (
          <Option
            icon={option.icon}
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
