/**
 * RTL (Right-to-Left) Support Provider
 * 
 * A component that provides RTL support for the application by managing
 * text direction and CSS transformations. Handles both document direction
 * and Emotion CSS-in-JS RTL transformations.
 */

'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import stylisRTLPlugin from 'stylis-plugin-rtl';

/**
 * Creates a cache instance configured for RTL styling
 * 
 * @returns {Object} An Emotion cache instance with RTL plugin
 */
function styleCache() {
  return createCache({ key: 'rtl', prepend: true, stylisPlugins: [stylisRTLPlugin] });
}

/**
 * RTL Provider Component
 * 
 * Manages text direction and RTL styling for the application.
 * Updates document direction and provides RTL-aware Emotion cache
 * when RTL direction is enabled.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @param {('ltr'|'rtl')} [props.direction='ltr'] - Text direction to apply
 * @returns {JSX.Element} A provider that handles RTL support
 */
export function Rtl({ children, direction = 'ltr' }) {
  // Update document direction when direction prop changes
  React.useEffect(() => {
    document.dir = direction;
  }, [direction]);

  // Provide RTL cache when direction is RTL
  if (direction === 'rtl') {
    return <CacheProvider value={styleCache()}>{children}</CacheProvider>;
  }

  // Return children as-is for LTR direction
  return <React.Fragment>{children}</React.Fragment>;
}
