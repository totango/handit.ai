/**
 * Settings Button Component
 * 
 * A floating action button that provides access to application settings.
 * Features an animated gear icon and opens a settings drawer when clicked.
 * Manages color scheme and other application-wide settings.
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';

import { config } from '@/config';
import { setSettings as setPersistedSettings } from '@/lib/settings/set-settings';
import { useSettings } from '@/hooks/use-settings';

import { SettingsDrawer } from './settings-drawer';

/**
 * Settings Button Component
 * 
 * Renders a floating action button with an animated gear icon that opens
 * a settings drawer. Manages application settings including color scheme
 * and provides functionality to update and reset settings.
 * 
 * @returns {JSX.Element} A floating settings button with tooltip
 */
export function SettingsButton() {
  // Get current settings and color scheme utilities
  const { settings } = useSettings();
  const { setColorScheme } = useColorScheme();
  const router = useRouter();

  // State for controlling the settings drawer visibility
  const [openDrawer, setOpenDrawer] = React.useState(false);

  /**
   * Updates application settings and persists changes
   * 
   * @param {Object} values - New settings values to apply
   * @returns {Promise<void>}
   */
  const handleUpdate = async (values) => {
    // Update color scheme if provided
    if (values.colorScheme) {
      setColorScheme(values.colorScheme);
    }

    // Merge new settings with existing ones
    const updatedSettings = { ...settings, ...values };

    // Persist settings to storage
    await setPersistedSettings(updatedSettings);

    // Refresh the router to apply the new settings
    router.refresh();
  };

  /**
   * Resets all settings to their default values
   * 
   * @returns {Promise<void>}
   */
  const handleReset = async () => {
    // Reset color scheme to default
    setColorScheme(config.site.colorScheme);

    // Clear persisted settings
    await setPersistedSettings({});

    // Refresh the router to apply the new settings
    router.refresh();
  };

  return (
    <React.Fragment>
      {/* Settings Button with Tooltip */}
      <Tooltip title="Settings">
        <Box
          component="button"
          onClick={() => {
            setOpenDrawer(true);
          }}
          sx={{
            animation: 'spin 4s linear infinite',
            background: 'var(--mui-palette-neutral-900)',
            border: 'none',
            borderRadius: '50%',
            bottom: 0,
            color: 'var(--mui-palette-common-white)',
            cursor: 'pointer',
            display: 'inline-flex',
            height: '40px',
            m: 4,
            p: '10px',
            position: 'fixed',
            right: 0,
            width: '40px',
            zIndex: 'var(--mui-zIndex-speedDial)',
            '&:hover': { bgcolor: 'var(--mui-palette-neutral-700)' },
            '@keyframes spin': { '0%': { rotate: '0' }, '100%': { rotate: '360deg' } },
          }}
        >
          <GearSixIcon fontSize="var(--icon-fontSize-md)" />
        </Box>
      </Tooltip>
    </React.Fragment>
  );
}
