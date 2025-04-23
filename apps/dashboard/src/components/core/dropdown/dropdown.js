/**
 * Dropdown Component
 * 
 * A compound component that manages the state and behavior of dropdown menus.
 * Provides context for trigger and popover components, handling mouse and keyboard
 * interactions with configurable delay for hover behavior.
 */

import * as React from 'react';

import { DropdownContext } from './dropdown-context';

/**
 * Dropdown Component
 * 
 * Manages the state and behavior of a dropdown menu, including:
 * - Hover interactions with configurable delay
 * - Keyboard navigation
 * - Anchor element positioning
 * - Event handling for trigger and popover
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (typically DropdownTrigger and DropdownPopover)
 * @param {number} [props.delay=50] - Delay in milliseconds before closing the dropdown on mouse leave
 * @returns {JSX.Element} A context provider for dropdown functionality
 */
export function Dropdown({ children, delay = 50 }) {
  // State for tracking the anchor element (trigger element)
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Ref for storing cleanup timeout
  const cleanupRef = React.useRef();

  /**
   * Handles mouse enter on trigger element
   * Immediately shows the dropdown and clears any pending close
   */
  const handleTriggerMouseEnter = React.useCallback((event) => {
    clearTimeout(cleanupRef.current);
    setAnchorEl(event.currentTarget);
  }, []);

  /**
   * Handles mouse leave on trigger element
   * Schedules dropdown close after delay
   */
  const handleTriggerMouseLeave = React.useCallback(
    (_) => {
      cleanupRef.current = setTimeout(() => {
        setAnchorEl(null);
      }, delay);
    },
    [delay]
  );

  /**
   * Handles keyboard interaction on trigger element
   * Shows dropdown on Enter or Space key
   */
  const handleTriggerKeyUp = React.useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setAnchorEl(event.currentTarget);
    }
  }, []);

  /**
   * Handles mouse enter on popover
   * Prevents dropdown from closing while hovering
   */
  const handlePopoverMouseEnter = React.useCallback((_) => {
    clearTimeout(cleanupRef.current);
  }, []);

  /**
   * Handles mouse leave on popover
   * Schedules dropdown close after delay
   */
  const handlePopoverMouseLeave = React.useCallback(
    (_) => {
      cleanupRef.current = setTimeout(() => {
        setAnchorEl(null);
      }, delay);
    },
    [delay]
  );

  /**
   * Handles escape key press on popover
   * Immediately closes the dropdown
   */
  const handlePopoverEscapePressed = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Determine if dropdown should be open based on anchor element
  const open = Boolean(anchorEl);

  // Provide dropdown context to children
  return (
    <DropdownContext.Provider
      value={{
        // Current anchor element for positioning
        anchorEl,

        // Event handlers for popover
        onPopoverMouseEnter: handlePopoverMouseEnter,
        onPopoverMouseLeave: handlePopoverMouseLeave,
        onPopoverEscapePressed: handlePopoverEscapePressed,

        // Event handlers for trigger
        onTriggerMouseEnter: handleTriggerMouseEnter,
        onTriggerMouseLeave: handleTriggerMouseLeave,
        onTriggerKeyUp: handleTriggerKeyUp,

        // Current open state
        open,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}
