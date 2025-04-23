/**
 * Theme Provider Component
 * 
 * A comprehensive theme provider that combines Material-UI's theme system
 * with custom theme settings, RTL support, and Emotion CSS-in-JS caching.
 * Manages the application's visual appearance and styling system.
 */

'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { useSettings } from '@/hooks/use-settings';
import { createTheme } from '@/styles/theme/create-theme';

import EmotionCache from './emotion-cache';
import { Rtl } from './rtl';
import { MuiCard } from '@/styles/theme/components/card';

/**
 * Theme Provider Component
 * 
 * Provides theme configuration and styling infrastructure for the application.
 * Integrates Material-UI's theme system with custom settings, RTL support,
 * and Emotion CSS-in-JS caching.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be themed
 * @returns {JSX.Element} A provider that handles theme configuration
 */
export function ThemeProvider({ children }) {
  // Get current theme settings from the application
  const { settings } = useSettings();

  // Create theme instance with current settings
  const theme = createTheme({
    // Component-specific theme overrides
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '5px',
          },
        },
      },
    },
    // Theme customization from settings
    primaryColor: settings.primaryColor,
    colorScheme: settings.colorScheme,
    direction: settings.direction,
  });

  return (
    // Emotion cache provider for CSS-in-JS
    <EmotionCache options={{ key: 'mui' }}>
      {/* Material-UI theme provider with CSS variables support */}
      <CssVarsProvider defaultColorScheme={settings.colorScheme} defaultMode={settings.colorScheme} theme={theme}>
        {/* Reset CSS and provide base styles */}
        <CssBaseline />
        {/* RTL support provider */}
        <Rtl direction={settings.direction}>{children}</Rtl>
      </CssVarsProvider>
    </EmotionCache>
  );
}
