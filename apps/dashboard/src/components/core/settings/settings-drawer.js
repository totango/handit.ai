/**
 * Settings Drawer Component
 * 
 * A slide-out drawer that provides a comprehensive interface for managing
 * application settings. Includes options for color scheme, layout, navigation,
 * and other visual preferences. Features a reset button and organized sections
 * for different setting categories.
 */

'use client';

import * as React from 'react';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowCounterClockwise as ArrowCounterClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowCounterClockwise';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { OptionsColorScheme } from './options-color-scheme';
import { OptionsDirection } from './options-direction';
import { OptionsLayout } from './options-layout';
import { OptionsNavColor } from './options-nav-color';
import { OptionsPrimaryColor } from './options-primary-color';

/**
 * Settings Drawer Component
 * 
 * Renders a slide-out drawer containing various application settings options.
 * Each setting is managed by its own component, and changes are propagated
 * through callbacks to the parent component.
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.canReset=true] - Whether the reset functionality is enabled
 * @param {Function} props.onClose - Callback function when drawer is closed
 * @param {Function} props.onUpdate - Callback function when settings are updated
 * @param {Function} props.onReset - Callback function when settings are reset
 * @param {boolean} props.open - Whether the drawer is open
 * @param {Object} [props.values={}] - Current settings values
 * @returns {JSX.Element} A drawer containing settings options
 */
export function SettingsDrawer({ canReset = true, onClose, onUpdate, onReset, open, values = {} }) {
  /**
   * Handles changes to individual settings
   * 
   * @param {string} field - The setting field to update
   * @param {any} value - The new value for the setting
   */
  const handleChange = React.useCallback(
    (field, value) => {
      onUpdate?.({ [field]: value });
    },
    [onUpdate]
  );

  return (
    <Drawer
      ModalProps={{ BackdropProps: { invisible: true }, sx: { zIndex: 1400 } }}
      PaperProps={{ elevation: 24, sx: { display: 'flex', flexDirection: 'column', maxWidth: '100%', width: '440px' } }}
      anchor="right"
      disableScrollLock
      onClose={onClose}
      open={open}
    >
      {/* Drawer Header */}
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2 }}>
        <Typography variant="h6">App settings</Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          {/* Reset Button with Badge */}
          <Badge
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            color="error"
            sx={{ '& .MuiBadge-badge': { top: 6, right: 6, ...(!canReset && { display: 'none' }) } }}
            variant="dot"
          >
            <IconButton onClick={onReset}>
              <ArrowCounterClockwiseIcon />
            </IconButton>
          </Badge>
          {/* Close Button */}
          <IconButton onClick={onClose}>
            <XIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Settings Options Container */}
      <Stack spacing={5} sx={{ overflowY: 'auto', p: 3 }}>
        {/* Primary Color Settings */}
        <OptionsPrimaryColor
          onChange={(value) => {
            handleChange('primaryColor', value);
          }}
          value={values.primaryColor}
        />
        {/* Color Scheme Settings */}
        <OptionsColorScheme
          onChange={(value) => {
            handleChange('colorScheme', value);
          }}
          value={values.colorScheme}
        />
        {/* Navigation Color Settings */}
        <OptionsNavColor
          onChange={(value) => {
            handleChange('navColor', value);
          }}
          value={values.navColor}
        />
        {/* Layout Settings */}
        <OptionsLayout
          onChange={(value) => {
            handleChange('layout', value);
          }}
          value={values.layout}
        />
        {/* Text Direction Settings */}
        <OptionsDirection
          onChange={(value) => {
            handleChange('direction', value);
          }}
          value={values.direction}
        />
      </Stack>
    </Drawer>
  );
}
