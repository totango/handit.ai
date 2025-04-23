/**
 * @fileoverview Settings context for managing application-wide settings
 * Provides a React context for managing and accessing application settings across components
 */

'use client';

import * as React from 'react';

import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';

/**
 * Settings context for managing application settings
 * @type {React.Context<{settings: Object, setSettings: Function}>}
 * @property {Object} settings - Current application settings
 * @property {Function} setSettings - Function to update settings
 */
export const SettingsContext = React.createContext({
  settings: applyDefaultSettings({}),
  setSettings: () => {
    // noop
  },
});

/**
 * Settings provider component for managing application settings
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.settings - Initial settings object
 * @returns {JSX.Element} Settings provider component
 * 
 * @description
 * This component provides:
 * - Settings state management
 * - Settings update functionality
 * - Context value for child components
 * - Automatic settings synchronization
 */
export function SettingsProvider({ children, settings: initialSettings }) {
  // Settings state management
  const [state, setState] = React.useState(initialSettings);

  // Update settings when initial settings change
  React.useEffect(() => {
    setState(initialSettings);
  }, [initialSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings: state,
        setSettings: (newSettings) => {
          setState(newSettings);
        },
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Settings consumer component for accessing settings context
 * @type {React.Consumer<{settings: Object, setSettings: Function}>}
 */
export const SettingsConsumer = SettingsContext.Consumer;
