/**
 * File Icon Component
 * 
 * A component that displays appropriate icons for different file types.
 * Maps file extensions to their corresponding icon assets and provides
 * a fallback icon for unknown file types.
 */

import * as React from 'react';
import Box from '@mui/material/Box';

/**
 * File extension to icon asset mapping
 * 
 * Maps common file extensions to their corresponding icon assets.
 * Used to determine which icon to display based on the file extension.
 */
const icons = {
  jpeg: '/assets/icon-jpg.svg',
  jpg: '/assets/icon-jpg.svg',
  mp4: '/assets/icon-mp4.svg',
  pdf: '/assets/icon-pdf.svg',
  png: '/assets/icon-png.svg',
  svg: '/assets/icon-svg.svg',
};

/**
 * File Icon Component
 * 
 * Renders an icon representing a file type based on its extension.
 * Falls back to a generic file icon if the extension is not recognized
 * or not provided.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.extension] - File extension to determine the icon (e.g., 'pdf', 'jpg')
 * @returns {JSX.Element} An icon representing the file type
 */
export function FileIcon({ extension }) {
  // Determine which icon to use based on the extension
  let icon;

  if (!extension) {
    // Use generic icon if no extension is provided
    icon = '/assets/icon-other.svg';
  } else {
    // Use mapped icon or fallback to generic icon
    icon = icons[extension] ?? '/assets/icon-other.svg';
  }

  return (
    <Box
      sx={{
        // Container styling for consistent icon display
        alignItems: 'center',
        display: 'inline-flex',
        flex: '0 0 auto',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
      }}
    >
      {/* Icon image with responsive sizing */}
      <Box alt="File" component="img" src={icon} sx={{ height: '100%', width: 'auto' }} />
    </Box>
  );
}
