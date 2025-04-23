/**
 * Root Layout Component
 * 
 * This is the main layout component that wraps all pages in the Next.js application.
 * It serves as the entry point for the application and sets up the core providers
 * and configuration needed throughout the app.
 * 
 * Key responsibilities:
 * 1. Sets up the HTML structure and viewport configuration
 * 2. Initializes core providers (Auth, Redux, Settings, etc.)
 * 3. Configures Google Analytics
 * 4. Applies global styles and theme settings
 * 
 * @module Layout
 */

import '@/styles/global.css';

import { config } from '@/config';
import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';
import { getSettings as getPersistedSettings } from '@/lib/settings/get-settings';
import { UserProvider } from '@/contexts/auth/user-context';
import { ReduxProvider } from '@/contexts/reduxProvider';
import { SettingsProvider } from '@/contexts/settings';
import { Analytics } from '@/components/core/analytics';
import { I18nProvider } from '@/components/core/i18n-provider';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { Toaster } from '@/components/core/toaster';
import Script from 'next/script';
import * as gtag from '@/lib/gtag'; // Ensure you have this file for GA setup

/**
 * Viewport configuration for the application
 * Controls how the page is displayed on mobile devices and sets theme color
 * for browser UI elements
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: config.site.themeColor,
};

/**
 * Root Layout Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The root layout component
 * 
 * @example
 * // The layout is automatically used by Next.js
 * // No need to manually import or use it
 */
export default async function Layout({ children }) {
  // Fetch settings on the server
  const baseSettings = await getPersistedSettings();
  const settings = applyDefaultSettings(baseSettings);
  
  return (
    <html data-mui-color-scheme={settings.colorScheme} lang="en">
      <body>
        {/* Google Analytics Scripts */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
          `}
        </Script>

        {/* 
          Provider Hierarchy:
          1. Analytics - Tracks page views and user interactions
          2. ReduxProvider - Global state management
          3. LocalizationProvider - Handles date, time, and number formatting
          4. UserProvider - Manages authentication and user state
          5. SettingsProvider - Application settings and preferences
          6. I18nProvider - Internationalization and translations
          7. ThemeProvider - UI theme and styling
        */}
        <Analytics>
          <ReduxProvider>
            <LocalizationProvider>
              <UserProvider>
                <SettingsProvider settings={settings}>
                  <I18nProvider language="en">
                    <ThemeProvider>
                      {children}
                      <Toaster position="bottom-right" />
                    </ThemeProvider>
                  </I18nProvider>
                </SettingsProvider>
              </UserProvider>
            </LocalizationProvider>
          </ReduxProvider>
        </Analytics>
      </body>
    </html>
  );
}
