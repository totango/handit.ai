/**
 * NoSsr Component
 * 
 * A utility component that prevents server-side rendering of its children.
 * Useful for components that rely on browser-specific APIs or need to be
 * rendered only on the client side. Based on MUI's NoSsr implementation
 * but without prop-types dependency.
 * 
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-base/src/NoSsr/NoSsr.tsx
 */

'use client';

import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';

/**
 * NoSsr Component
 * 
 * Renders its children only on the client side, with optional deferred mounting
 * and fallback content during server-side rendering.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to render on the client side
 * @param {boolean} [props.defer=false] - Whether to defer mounting until after initial render
 * @param {React.ReactNode} [props.fallback=null] - Content to show during server-side rendering
 * @returns {JSX.Element} The rendered component
 */
export function NoSsr(props) {
  const { children, defer = false, fallback = null } = props;
  // Track whether the component has mounted on the client
  const [mountedState, setMountedState] = React.useState(false);

  // Use enhanced effect for immediate mounting when not deferred
  useEnhancedEffect(() => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);

  // Use regular effect for deferred mounting
  React.useEffect(() => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);

  // Render children only after client-side mounting, fallback otherwise
  return <React.Fragment>{mountedState ? children : fallback}</React.Fragment>;
}
