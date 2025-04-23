/**
 * @fileoverview ItemIcon component for displaying model icons
 * Provides icon display for different model types (folder or file)
 */

import * as React from 'react';
import Box from '@mui/material/Box';

import { FileIcon } from '@/components/core/file-icon';

/**
 * ItemIcon component for displaying model type icons
 * @component
 * @param {Object} props - Component props
 * @param {string} props.type - Type of icon to display ('folder' or file)
 * @param {string} [props.extension] - File extension for file type icons
 * @returns {JSX.Element} Rendered icon component
 * 
 * @description
 * This component provides:
 * - Conditional rendering of folder or file icons
 * - Integration with FileIcon component for file type icons
 * - Custom folder icon display
 */
export function ItemIcon({ type, extension }) {
  return type === 'folder' ? <FolderIcon /> : <FileIcon extension={extension} />;
}

/**
 * FolderIcon component for displaying folder icons
 * @component
 * @returns {JSX.Element} Rendered folder icon
 * 
 * @description
 * This component provides:
 * - Custom folder icon display using SVG
 * - Consistent sizing and alignment
 * - Responsive image scaling
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
