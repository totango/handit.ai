/**
 * Option Component
 * 
 * A wrapper component for Material-UI's MenuItem that provides a consistent
 * interface for selectable options in dropdown menus and select components.
 * This component serves as a standardized way to render menu items throughout
 * the application.
 */

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';

/**
 * Option Component
 * 
 * Renders a menu item that can be used in dropdown menus and select components.
 * Forwards all props to the underlying MenuItem component while maintaining
 * a consistent interface.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to display in the menu item
 * @param {Object} props... - Additional props to pass to the MenuItem component
 * @returns {JSX.Element} A menu item component
 */
export function Option({ children, ...props }) {
  return <MenuItem {...props}>{children}</MenuItem>;
}
