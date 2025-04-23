/**
 * Node Filter Dialog Component
 * 
 * A reusable dialog component that displays node filter information in a formatted,
 * monospace text display. Provides a clean interface for viewing filter content with
 * a close button and actions. The dialog is responsive and supports full-width display
 * for better readability of filter content.
 */

'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { X } from '@phosphor-icons/react';

/**
 * NodeFilterDialog Component
 * 
 * A dialog component that displays node filter information in a formatted way.
 * Features include:
 * - Full-width dialog with maximum width constraint
 * - Monospace text display for filter content
 * - Close button in header and footer
 * - Responsive layout with proper spacing
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls the visibility of the dialog
 * @param {Function} props.onClose - Callback function when the dialog is closed
 * @param {string} props.title - The title of the dialog
 * @param {string} props.content - The filter content to display
 * @returns {JSX.Element} The node filter dialog component
 */
export function NodeFilterDialog({ open, onClose, title, content }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      {/* Dialog Header */}
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{title}</Typography>
          {/* Close Button */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <X />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent dividers>
        {/* Filter Content Display */}
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            p: 2,
            bgcolor: 'background.neutral',
            borderRadius: 1,
          }}
        >
          {content}
        </Typography>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
} 