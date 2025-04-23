/**
 * Tip Component
 * 
 * A component for displaying helpful tips or suggestions to users.
 * Renders a message with a lightbulb icon in a visually distinct container.
 * Uses Material-UI's styling system for consistent theming and appearance.
 */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Lightbulb as LightbulbIcon } from '@phosphor-icons/react/dist/ssr/Lightbulb';

/**
 * Tip Component
 * 
 * Renders a tip message with a lightbulb icon in a styled container.
 * The message is displayed with a "Tip." prefix in bold text,
 * followed by the main message content.
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - The tip message to display
 * @returns {JSX.Element} A styled tip container with icon and message
 */
export function Tip({ message }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        // Container styling
        alignItems: 'center',
        bgcolor: 'var(--mui-palette-background-level1)',
        borderRadius: 1,
        p: 1,
      }}
    >
      {/* Lightbulb icon */}
      <LightbulbIcon />

      {/* Tip message with styled prefix */}
      <Typography color="text.secondary" variant="caption">
        <Typography
          component="span"
          sx={{ fontWeight: 700 }}
          variant="inherit"
        >
          Tip.
        </Typography>{' '}
        {message}
      </Typography>
    </Stack>
  );
}
