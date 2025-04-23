/**
 * @fileoverview ReduxProvider component for Redux store integration
 * Provides Redux store context to the application using React-Redux Provider
 */

'use client';

import * as React from 'react';
import { Provider } from 'react-redux';

import { store } from '../store';

/**
 * ReduxProvider component for Redux store integration
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped with Redux Provider
 * @returns {JSX.Element} Redux Provider component
 * 
 * @description
 * This component provides:
 * - Redux store context to the application
 * - State management capabilities
 * - Access to Redux store for all child components
 * - Integration with React-Redux ecosystem
 */
export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
