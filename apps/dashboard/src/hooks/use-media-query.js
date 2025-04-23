/**
 * @fileoverview Media query hook for responsive design
 * Provides a hook for handling Material-UI breakpoint-based media queries
 */

import * as React from 'react';
import { useTheme } from '@mui/material/styles';

/**
 * Custom hook for handling Material-UI breakpoint-based media queries
 * @function
 * @param {string} fn - Media query function ('up', 'down', 'between', 'only', 'not')
 * @param {string} start - Starting breakpoint for the media query
 * @param {string} [end] - Ending breakpoint for 'between' queries
 * @returns {boolean} Whether the media query matches
 * @throws {Error} If invalid parameters are provided
 * 
 * @description
 * This hook provides:
 * - Material-UI breakpoint integration
 * - Real-time media query matching
 * - Automatic cleanup of event listeners
 * - Support for various query types:
 *   - 'up': Matches breakpoint and above
 *   - 'down': Matches breakpoint and below
 *   - 'between': Matches between two breakpoints
 *   - 'only': Matches only the specified breakpoint
 *   - 'not': Matches everything except the breakpoint
 * 
 * @example
 * // Check if screen is medium and up
 * const isMediumUp = useMediaQuery('up', 'md');
 * // Check if screen is between small and large
 * const isBetween = useMediaQuery('between', 'sm', 'lg');
 */
export function useMediaQuery(fn, start, end) {
  const theme = useTheme();
  const [matches, setMatches] = React.useState(false);

  let mq;

  if (['up', 'down'].includes(fn) && start) {
    mq = theme.breakpoints[fn](start);
  } else if (fn === 'between' && start && end) {
    mq = theme.breakpoints[fn](start, end);
  } else if (['only', 'not'].includes(fn) && start) {
    mq = theme.breakpoints[fn](start);
  } else {
    throw new Error('Invalid useMediaQuery params');
  }

  mq = mq.replace(/^@media(?: ?)/m, '');

  React.useEffect(() => {
    setMatches(window.matchMedia(mq).matches);

    function handler(event) {
      setMatches(event.matches);
    }

    const mediaQueryList = window.matchMedia(mq);

    mediaQueryList.addEventListener('change', handler);

    return () => {
      mediaQueryList.removeEventListener('change', handler);
    };
  }, [mq]);

  return matches;
}
