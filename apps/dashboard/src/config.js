/**
 * @fileoverview Application Configuration
 * 
 * This file centralizes all application configuration settings, including site metadata,
 * authentication strategy, and third-party service integrations. It provides a single
 * source of truth for application-wide settings.
 * 
 * Features:
 * - Site metadata and branding
 * - Authentication configuration
 * - Third-party service integrations
 * - Environment-aware settings
 * 
 * @example
 * // Accessing configuration values:
 * import { config } from '@/config';
 * 
 * // Site name
 * console.log(config.site.name); // 'Handit.AI'
 * 
 * // Auth strategy
 * console.log(config.auth.strategy); // 'custom'
 */

import { AuthStrategy } from '@/lib/auth/strategy';
import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

/**
 * Application Configuration Object
 * 
 * @type {Object}
 * @property {Object} site - Site metadata and branding
 * @property {string} site.name - Application name
 * @property {string} site.description - Application description
 * @property {string} site.colorScheme - Default color scheme ('dark' | 'light')
 * @property {string} site.themeColor - Theme color for browser UI
 * @property {string} site.primaryColor - Primary color for UI elements
 * @property {string} site.url - Base URL of the application
 * @property {string} site.version - Application version
 * 
 * @property {string} logLevel - Application logging level
 * 
 * @property {Object} auth - Authentication configuration
 * @property {string} auth.strategy - Authentication strategy to use
 * 
 * @property {Object} mapbox - Mapbox integration settings
 * @property {string} mapbox.apiKey - Mapbox API key
 * 
 * @property {Object} gtm - Google Tag Manager settings
 * @property {string} gtm.id - Google Tag Manager container ID
 */
export const config = {
  site: {
    name: 'Handit.AI',
    description: '',
    colorScheme: 'dark',
    themeColor: '#090a0b',
    primaryColor: 'neonBlue',
    url: getSiteURL(),
    version: process.env.NEXT_PUBLIC_SITE_VERSION || '0.0.0',
  },
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || LogLevel.ALL,
  auth: { strategy: process.env.NEXT_PUBLIC_AUTH_STRATEGY || AuthStrategy.CUSTOM },

  mapbox: { apiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY },
  gtm: { id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID },
};
