/**
 * @fileoverview Site URL Utility
 * 
 * This utility function determines the base URL of the application across different
 * environments (development, staging, production). It handles various URL formats
 * and ensures consistent URL structure.
 * 
 * Features:
 * - Environment-aware URL resolution
 * - Automatic HTTPS protocol addition
 * - Consistent trailing slash
 * - Fallback to localhost for development
 * 
 * @example
 * // In development:
 * getSiteURL() // returns 'http://localhost:3000/'
 * 
 * // In production with NEXT_PUBLIC_SITE_URL set:
 * getSiteURL() // returns 'https://your-domain.com/'
 * 
 * // On Vercel:
 * getSiteURL() // returns 'https://your-project.vercel.app/'
 */

/**
 * Gets the base URL of the application
 * 
 * This function resolves the site URL in the following order:
 * 1. NEXT_PUBLIC_SITE_URL environment variable (for production)
 * 2. NEXT_PUBLIC_VERCEL_URL environment variable (automatically set by Vercel)
 * 3. Falls back to localhost for development
 * 
 * The function ensures:
 * - HTTPS protocol is used (except for localhost)
 * - URL ends with a trailing slash
 * 
 * @returns {string} The normalized site URL
 * 
 * @example
 * // Usage in API routes or server components:
 * const siteUrl = getSiteURL();
 * const callbackUrl = `${siteUrl}auth/callback`;
 */
export function getSiteURL() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
}
