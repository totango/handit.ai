/**
 * @fileoverview Dialog state management hook
 * Provides state management and control functions for dialog/modal components
 */

import * as React from 'react';

/**
 * Custom hook for managing dialog/modal state
 * @function
 * @returns {Object} Dialog state and control functions
 * @property {*} data - Additional data associated with the dialog
 * @property {Function} handleClose - Function to close the dialog
 * @property {Function} handleOpen - Function to open the dialog with optional data
 * @property {boolean} open - Current open state of the dialog
 * 
 * @description
 * This hook provides:
 * - Dialog open/close state management
 * - Optional data passing for dialog content
 * - Memoized control functions
 * - Simple interface for dialog components
 * 
 * @example
 * const { open, data, handleOpen, handleClose } = useDialog();
 * // Open dialog with data
 * handleOpen({ title: 'Example', content: 'Dialog content' });
 * // Close dialog
 * handleClose();
 */
export function useDialog() {
  // Dialog state management
  const [state, setState] = React.useState({ open: false, data: undefined });

  /**
   * Opens the dialog with optional data
   * @param {*} data - Optional data to pass to the dialog
   */
  const handleOpen = React.useCallback((data) => {
    setState({ open: true, data });
  }, []);

  /**
   * Closes the dialog and clears associated data
   */
  const handleClose = React.useCallback(() => {
    setState({ open: false });
  }, []);

  return { data: state.data, handleClose, handleOpen, open: state.open };
}
