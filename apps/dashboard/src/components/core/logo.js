/**
 * Logo Components
 * 
 * A set of components for displaying the application logo in various configurations.
 * Includes both static and dynamic logo components that support different color schemes
 * and sizes. The dynamic logo automatically adapts to the current theme.
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

// Default dimensions for the logo
const HEIGHT = 60;
const WIDTH = 60;

/**
 * Logo Component
 * 
 * A static logo component that displays either the full logo or emblem version
 * in light or dark color scheme.
 * 
 * @param {Object} props - Component props
 * @param {('light'|'dark')} [props.color='dark'] - The color scheme of the logo
 * @param {boolean} [props.emblem] - Whether to show the emblem version of the logo
 * @param {number} [props.height=60] - The height of the logo in pixels
 * @param {number} [props.width=60] - The width of the logo in pixels
 * @returns {JSX.Element} The logo image component
 */
export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }) {
  // Determine the appropriate logo asset URL based on color scheme and emblem preference
  let url;

  if (emblem) {
    url = color === 'light' ? '/assets/logo-emblem.svg' : '/assets/logo-emblem--dark.svg';
  } else {
    url = color === 'light' ? '/assets/logo.svg' : '/assets/logo--dark.svg';
  }

  return <Box alt="logo" component="img" height={height} src={url} width={width} />;
}

/**
 * DynamicLogo Component
 * 
 * A theme-aware logo component that automatically switches between light and dark
 * versions based on the current color scheme. Includes SSR handling with a fallback.
 * 
 * @param {Object} props - Component props
 * @param {('light'|'dark')} [props.colorDark='light'] - The color scheme to use in dark mode
 * @param {('light'|'dark')} [props.colorLight='dark'] - The color scheme to use in light mode
 * @param {number} [props.height=60] - The height of the logo in pixels
 * @param {number} [props.width=60] - The width of the logo in pixels
 * @param {Object} props... - Additional props to pass to the Logo component
 * @returns {JSX.Element} The dynamic logo component with SSR fallback
 */
export function DynamicLogo({ colorDark = 'light', colorLight = 'dark', height = HEIGHT, width = WIDTH, ...props }) {
  // Get the current color scheme from the theme
  const { colorScheme } = useColorScheme();
  // Determine the appropriate color based on the current scheme
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
