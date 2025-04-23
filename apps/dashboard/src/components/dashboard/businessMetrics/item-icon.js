/**
 * @fileoverview ItemIcon component for displaying icons for KPI items
 * Provides icon display for different types of items (folders and files)
 */

import * as React from 'react';
import Box from '@mui/material/Box';

import { FileIcon } from '@/components/core/file-icon';

/**
 * ItemIcon component for displaying icons for KPI items
 * @component
 * @param {Object} props - Component props
 * @param {string} props.type - Type of the item ('folder' or file type)
 * @param {string} [props.extension] - File extension for file type items
 * @returns {JSX.Element} Rendered icon component
 * 
 * @description
 * This component provides:
 * - Conditional rendering of folder or file icons
 * - Consistent icon sizing and styling
 * - Integration with core FileIcon component
 */
export function ItemIcon({ type, extension }) {
  return type === 'folder' ? <FolderIcon /> : <FileIcon extension={extension} />;
}

/**
 * FolderIcon component for displaying folder icons
 * @component
 * @returns {JSX.Element} Rendered folder icon component
 * 
 * @description
 * This component provides:
 * - A standardized folder icon display
 * - Fixed dimensions for consistent layout
 * - SVG-based folder icon from assets
 */
function FolderIcon() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'inline-flex',
        flex: '0 0 auto',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
      }}
    >
      <Box alt="Folder" component="img" src="/assets/icon-folder.svg" sx={{ height: '100%', width: 'auto' }} />
    </Box>
  );
}
