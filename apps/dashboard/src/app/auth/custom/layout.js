/**
 * Custom Authentication Layout
 * 
 * This module implements the layout component for custom authentication pages.
 * It wraps the authentication content with the appropriate strategy guard
 * to ensure the content is only rendered when the custom authentication
 * strategy is configured.
 * 
 * Features:
 * - Strategy validation
 * - Layout structure
 * - Authentication flow protection
 * 
 * @module custom-auth-layout
 */

import * as React from 'react';

import { AuthStrategy } from '@/lib/auth/strategy';
import { StrategyGuard } from '@/components/auth/strategy-guard';

/**
 * Custom Authentication Layout Component
 * Provides the layout structure for custom authentication pages
 * and ensures the correct authentication strategy is configured
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} Layout component with strategy guard
 * 
 * @example
 * // Usage in a custom auth page:
 * export default function CustomAuthPage() {
 *   return (
 *     <Layout>
 *       <CustomAuthContent />
 *     </Layout>
 *   );
 * }
 */
export default function Layout({ children }) {
  return <StrategyGuard expected={AuthStrategy.CUSTOM}>{children}</StrategyGuard>;
}
