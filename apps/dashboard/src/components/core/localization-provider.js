/**
 * LocalizationProvider Component
 * 
 * A React component that provides date localization support for the application.
 * Integrates with MUI's date picker components using the Day.js adapter.
 * This component ensures consistent date formatting and handling throughout
 * the application's date-related components.
 */

'use client';

import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';

/**
 * LocalizationProvider Component
 * 
 * Wraps the application to provide date localization context using Day.js.
 * Enables consistent date handling and formatting across all MUI date picker
 * components in the application.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped with date localization context
 * @returns {JSX.Element} The wrapped children with date localization context
 */
export function LocalizationProvider({ children }) {
  return <Provider dateAdapter={AdapterDayjs}>{children}</Provider>;
}
