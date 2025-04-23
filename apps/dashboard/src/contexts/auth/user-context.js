/**
 * Authentication Context Strategy
 * 
 * This module implements a strategy pattern for authentication context providers.
 * It dynamically selects the appropriate authentication context and provider
 * based on the configured authentication strategy.
 * 
 * The strategy pattern allows for:
 * - Easy switching between different authentication methods
 * - Consistent interface across different auth implementations
 * - Centralized configuration of auth behavior
 * 
 * @module user-context
 */

import { config } from '@/config';
import { AuthStrategy } from '@/lib/auth/strategy';

// Import custom authentication context implementation
import { UserContext as CustomUserContext, UserProvider as CustomUserProvider } from './custom/user-context';

/**
 * Authentication context provider component
 * Will be assigned based on the configured auth strategy
 * @type {React.ComponentType}
 */
// eslint-disable-next-line import/no-mutable-exports -- Export based on config
let UserProvider;

/**
 * Authentication context object
 * Will be assigned based on the configured auth strategy
 * @type {React.Context}
 */
// eslint-disable-next-line import/no-mutable-exports -- Export based on config
let UserContext;

/**
 * Select the appropriate authentication context and provider
 * based on the configured authentication strategy
 */
switch (config.auth.strategy) {
  case AuthStrategy.CUSTOM:
    // Use custom authentication implementation
    UserContext = CustomUserContext;
    UserProvider = CustomUserProvider;
    break;
  // TODO: Add other strategies
  default:
    throw new Error('Invalid auth strategy');
}

export { UserProvider, UserContext };
