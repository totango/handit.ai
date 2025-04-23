/**
 * Dropdown Context Module
 * 
 * Provides a React context for managing dropdown/popover state and interactions.
 * This context handles mouse events, keyboard navigation, and positioning
 * for dropdown components throughout the application.
 */

import * as React from 'react';

/**
 * No-operation function used as default context values
 * @param {...any} _ - Any arguments passed to the function
 * @returns {void}
 */
function noop(..._) {
  // Do nothing
}

/**
 * Dropdown Context
 * 
 * React context for managing dropdown state and interactions.
 * Provides methods for handling mouse events, keyboard navigation,
 * and tracking the anchor element for positioning.
 * 
 * @type {React.Context<{
 *   anchorEl: HTMLElement | null,
 *   onPopoverMouseEnter: () => void,
 *   onPopoverMouseLeave: () => void,
 *   onPopoverEscapePressed: () => void,
 *   onTriggerMouseEnter: () => void,
 *   onTriggerMouseLeave: () => void,
 *   onTriggerKeyUp: (event: KeyboardEvent) => void,
 *   open: boolean
 * }>}
 */
export const DropdownContext = React.createContext({
  // The element that the dropdown is anchored to
  anchorEl: null,

  // Event handlers for the popover/dropdown content
  onPopoverMouseEnter: noop,
  onPopoverMouseLeave: noop,
  onPopoverEscapePressed: noop,

  // Event handlers for the trigger element
  onTriggerMouseEnter: noop,
  onTriggerMouseLeave: noop,
  onTriggerKeyUp: noop,

  // Current open state of the dropdown
  open: false,
});
