/**
 * Emotion Cache Provider for Next.js App Directory
 * 
 * A specialized cache provider for Emotion CSS-in-JS that handles server-side
 * rendering in Next.js app directory. Manages style injection and ensures
 * proper hydration of styles between server and client.
 * 
 * Adapted from: https://github.com/garronej/tss-react/blob/main/src/next/appDir.tsx
 */

'use client';

import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';
import { CacheProvider as DefaultCacheProvider } from '@emotion/react';

/**
 * Next.js App Directory Emotion Cache Provider
 * 
 * Provides a cache instance for Emotion CSS-in-JS that works with Next.js
 * app directory's server components. Handles style collection during server
 * rendering and proper injection into the document.
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.options] - Options for creating the emotion cache
 * @param {React.ComponentType} [props.CacheProvider=DefaultCacheProvider] - Custom cache provider component
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} A cache provider with server-side rendering support
 */
export default function NextAppDirEmotionCacheProvider(props) {
  const { options, CacheProvider = DefaultCacheProvider, children } = props;

  // Initialize cache and registry for style tracking
  const [registry] = React.useState(() => {
    // Create cache instance with provided options
    const cache = createCache(options);
    cache.compat = true;

    // Store original insert method
    const prevInsert = cache.insert;
    let inserted = [];

    // Override insert method to track inserted styles
    cache.insert = (...args) => {
      const [selector, serialized] = args;

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }

      return prevInsert(...args);
    };

    // Function to flush collected styles
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  // Handle server-side style injection
  useServerInsertedHTML(() => {
    const inserted = registry.flush();

    if (inserted.length === 0) {
      return null;
    }

    let styles = '';
    let dataEmotionAttribute = registry.cache.key;
    const globals = [];

    // Process inserted styles
    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style !== 'boolean') {
        if (isGlobal) {
          globals.push({ name, style });
        } else {
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    // Return style elements for injection
    return (
      <React.Fragment>
        {/* Global styles */}
        {globals.map(({ name, style }) => (
          <style
            dangerouslySetInnerHTML={{ __html: style }}
            data-emotion={`${registry.cache.key}-global ${name}`}
            key={name}
          />
        ))}
        {/* Component styles */}
        {styles ? <style dangerouslySetInnerHTML={{ __html: styles }} data-emotion={dataEmotionAttribute} /> : null}
      </React.Fragment>
    );
  });

  // Provide cache to children
  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
