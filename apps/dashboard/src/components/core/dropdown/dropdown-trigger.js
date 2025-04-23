/**
 * Dropdown Trigger Component
 * 
 * A component that wraps trigger elements (buttons, links, etc.) to add dropdown
 * functionality. It enhances the child element with mouse and keyboard event
 * handlers while preserving any existing event handlers.
 */

import * as React from 'react';

import { DropdownContext } from './dropdown-context';

/**
 * Dropdown Trigger Component
 * 
 * This component clones its child element and adds dropdown event handlers
 * while preserving any existing event handlers on the child element.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactElement} props.children - The trigger element to be enhanced with dropdown functionality
 * @returns {React.ReactElement} The enhanced trigger element with dropdown event handlers
 */
export function DropdownTrigger({ children }) {
  // Get event handlers from dropdown context
  const {
    onTriggerMouseEnter,
    onTriggerMouseLeave,
    onTriggerKeyUp
  } = React.useContext(DropdownContext);

  // Clone the child element and add dropdown event handlers
  return React.cloneElement(children, {
    // Handle keyboard events
    onKeyUp: (event) => {
      // Preserve existing onKeyUp handler if present
      children.props.onKeyUp?.(event);
      // Add dropdown-specific key handling
      onTriggerKeyUp(event);
    },

    // Handle mouse enter events
    onMouseEnter: (event) => {
      // Preserve existing onMouseEnter handler if present
      children.props.onMouseEnter?.(event);
      // Add dropdown-specific mouse enter handling
      onTriggerMouseEnter(event);
    },

    // Handle mouse leave events
    onMouseLeave: (event) => {
      // Preserve existing onMouseLeave handler if present
      children.props.onMouseLeave?.(event);
      // Add dropdown-specific mouse leave handling
      onTriggerMouseLeave(event);
    },
  });
}
