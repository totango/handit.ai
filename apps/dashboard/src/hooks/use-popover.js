/**
 * @fileoverview Popover state management hook
 * Provides state management and control functions for popover/menu components
 */

import * as React from 'react';

/**
 * Custom hook for managing popover/menu state
 * @function
 * @returns {Object} Popover state and control functions
 * @property {React.RefObject} anchorRef - Reference to the popover anchor element
 * @property {Function} handleClose - Function to close the popover
 * @property {Function} handleOpen - Function to open the popover
 * @property {Function} handleToggle - Function to toggle the popover state
 * @property {boolean} open - Current open state of the popover
 * 
 * @description
 * This hook provides:
 * - Popover open/close state management
 * - Anchor element reference
 * - Memoized control functions
 * - Toggle functionality
 * - Simple interface for popover components
 */
export function usePopover() {
  // Reference to the anchor element
  const anchorRef = React.useRef(null);
  // Popover open state
  const [open, setOpen] = React.useState(false);

  /**
   * Opens the popover
   */
  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  /**
   * Closes the popover
   */
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  /**
   * Toggles the popover state
   */
  const handleToggle = React.useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  return { anchorRef, handleClose, handleOpen, handleToggle, open };
}
