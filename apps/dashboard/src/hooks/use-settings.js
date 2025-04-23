/**
 * @fileoverview Settings context hook
 * Provides access to application settings through the SettingsContext
 */

import * as React from 'react';

import { SettingsContext } from '@/contexts/settings';

/**
 * Custom hook for accessing application settings
 * @function
 * @returns {Object} Settings context value
 * @property {Object} settings - Current application settings
 * @property {Function} setSettings - Function to update settings
 * @throws {Error} If used outside of SettingsProvider
 * 
 * @description
 * This hook provides:
 * - Access to application settings
 * - Settings update functionality
 * - Context validation
 * - Type-safe settings management
 * 
 * @example
 * const { settings, setSettings } = useSettings();
 * // Update a setting
 * setSettings({ ...settings, theme: 'dark' });
 */
export function useSettings() {
  const context = React.useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}
