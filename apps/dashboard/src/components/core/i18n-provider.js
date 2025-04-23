/**
 * I18nProvider Component
 * 
 * A React component that provides internationalization (i18n) support for the application.
 * Integrates with next-i18next to handle language switching and translation management.
 * This component ensures that the selected language is properly applied throughout
 * the application's component tree.
 */

'use client';

import * as React from 'react';
import { useTranslation } from 'next-i18next';

import { logger } from '@/lib/default-logger';

import '@/lib/i18n';

/**
 * I18nProvider Component
 * 
 * Wraps the application to provide i18n context and language switching functionality.
 * Automatically changes the application language when the language prop changes.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped with i18n context
 * @param {string} [props.language='en'] - The language code to use (e.g., 'en', 'fr', 'es')
 * @returns {JSX.Element} The wrapped children with i18n context
 */
export function I18nProvider({ children, language = 'en' }) {
  // Get i18n instance from next-i18next
  const { i18n } = useTranslation();

  // Effect to handle language changes
  React.useEffect(() => {
    // Attempt to change the language
    i18n.changeLanguage(language).catch(() => {
      // Log error if language change fails
      logger.error(`Failed to change language to ${language}`);
    });
  }, [i18n, language]);

  // Render children with i18n context
  return <React.Fragment>{children}</React.Fragment>;
}
