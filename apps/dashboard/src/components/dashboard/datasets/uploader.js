/**
 * @fileoverview Uploader component for handling dataset file uploads
 * Provides a dialog interface for uploading and managing dataset files
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { FileDropzone } from '@/components/core/file-dropzone';
import { FileIcon } from '@/components/core/file-icon';

/**
 * Converts bytes to human-readable file size
 * @param {number} bytes - Size in bytes
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted file size string
 * 
 * @example
 * bytesToSize(1024) // returns "1 KB"
 * bytesToSize(1024 * 1024) // returns "1 MB"
 */
function bytesToSize(bytes, decimals = 2) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Uploader component for handling dataset file uploads
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to handle dialog close
 * @param {boolean} [props.open=false] - Whether the dialog is open
 * @returns {JSX.Element} Rendered uploader component
 * 
 * @description
 * This component provides:
 * - A dialog interface for file uploads
 * - File dropzone for drag-and-drop uploads
 * - File list with size and type information
 * - Individual file removal
 * - Bulk file removal
 * - File size formatting
 */
export function Uploader({ onClose, open = false }) {
  // File list state
  const [files, setFiles] = React.useState([]);

  // Reset files when dialog opens
  React.useEffect(() => {
    setFiles([]);
  }, [open]);

  /**
   * Handles file drop events
   * @param {Array<File>} newFiles - New files to add
   */
  const handleDrop = React.useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  /**
   * Handles removal of a single file
   * @param {File} file - File to remove
   */
  const handleRemove = React.useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  /**
   * Handles removal of all files
   */
  const handleRemoveAll = React.useCallback(() => {
    setFiles([]);
  }, []);

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      {/* Dialog header */}
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
        <Typography variant="h6">Upload files</Typography>
        <IconButton onClick={onClose}>
          <XIcon />
        </IconButton>
      </Stack>

      <DialogContent>
        <Stack spacing={3}>
          {/* File dropzone */}
          <FileDropzone accept={{ '*/*': [] }} caption="Max file size is 3 MB" files={files} onDrop={handleDrop} />

          {/* File list */}
          {files.length ? (
            <Stack spacing={2}>
              <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {files.map((file) => {
                  const extension = file.name.split('.').pop();

                  return (
                    <Stack
                      component="li"
                      direction="row"
                      key={file.path}
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                        border: '1px solid var(--mui-palette-divider)',
                        borderRadius: 1,
                        flex: '1 1 auto',
                        p: 1,
                      }}
                    >
                      <FileIcon extension={extension} />
                      <Box sx={{ flex: '1 1 auto' }}>
                        <Typography variant="subtitle2">{file.name}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {bytesToSize(file.size)}
                        </Typography>
                      </Box>
                      <Tooltip title="Remove">
                        <IconButton
                          onClick={() => {
                            handleRemove(file);
                          }}
                        >
                          <XIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  );
                })}
              </Stack>

              {/* Action buttons */}
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button color="secondary" onClick={handleRemoveAll} size="small" type="button">
                  Remove all
                </Button>
                <Button onClick={onClose} size="small" type="button" variant="contained">
                  Upload
                </Button>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
