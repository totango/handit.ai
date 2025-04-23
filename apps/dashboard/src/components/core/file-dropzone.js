/**
 * File Dropzone Component
 * 
 * A drag-and-drop file upload interface built with react-dropzone and Material-UI.
 * Provides a visual area for file uploads with support for both click-to-upload
 * and drag-and-drop interactions. Includes visual feedback for active drag states
 * and customizable captions.
 */

'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CloudArrowUp as CloudArrowUpIcon } from '@phosphor-icons/react/dist/ssr/CloudArrowUp';
import { useDropzone } from 'react-dropzone';

/**
 * File Dropzone Component
 * 
 * Renders a file upload area that supports both click-to-upload and drag-and-drop
 * functionality. Provides visual feedback during drag operations and displays
 * a customizable caption.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.caption] - Optional caption text displayed below the upload prompt
 * @param {Object} props.props - Additional props passed to react-dropzone's useDropzone hook
 * @returns {JSX.Element} A file upload interface with drag-and-drop support
 */
export function FileDropzone({ caption, ...props }) {
  // Initialize dropzone functionality
  const { getRootProps, getInputProps, isDragActive } = useDropzone(props);

  return (
    <Stack spacing={2}>
      {/* Dropzone Container */}
      <Box
        sx={{
          alignItems: 'center',
          border: '1px dashed var(--mui-palette-divider)',
          borderRadius: 1,
          cursor: 'pointer',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          p: 6,
          // Visual feedback for active drag state
          ...(isDragActive && { bgcolor: 'var(--mui-palette-action-selected)', opacity: 0.5 }),
          // Hover effect when not dragging
          '&:hover': { ...(!isDragActive && { bgcolor: 'var(--mui-palette-action-hover)' }) },
        }}
        {...getRootProps()}
      >
        {/* Hidden file input */}
        <input {...getInputProps()} />
        {/* Upload Interface */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {/* Upload Icon */}
          <Avatar
            sx={{
              '--Avatar-size': '64px',
              '--Icon-fontSize': 'var(--icon-fontSize-lg)',
              bgcolor: 'var(--mui-palette-background-paper)',
              boxShadow: 'var(--mui-shadows-8)',
              color: 'var(--mui-palette-text-primary)',
            }}
          >
            <CloudArrowUpIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
          {/* Upload Text and Caption */}
          <Stack spacing={1}>
            <Typography variant="h6">
              <Typography component="span" sx={{ textDecoration: 'underline' }} variant="inherit">
                Click to upload
              </Typography>{' '}
              or drag and drop
            </Typography>
            {/* Optional Caption */}
            {caption ? (
              <Typography color="text.secondary" variant="body2">
                {caption}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
