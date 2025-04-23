/**
 * @fileoverview User Context Hook
 * 
 * This hook provides access to the user context throughout the application.
 * It ensures that the user context is only used within the UserProvider
 * and provides type-safe access to user data and authentication methods.
 * 
 * Features:
 * - Type-safe access to user context
 * - Runtime validation of provider presence
 * - Centralized user state management
 * 
 * @example
 * // Usage in a component:
 * import { useUser } from '@/hooks/use-user';
 * 
 * function UserProfile() {
 *   const { user, signOut } = useUser();
 *   return (
 *     <div>
 *       <h1>Welcome, {user.name}</h1>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 */

import * as React from 'react';

import { UserContext } from '@/contexts/auth/user-context';

/**
 * Custom hook to access the user context
 * 
 * This hook provides access to:
 * - User profile information
 * - Authentication state
 * - Authentication methods (sign in, sign out, etc.)
 * 
 * @throws {Error} If used outside of UserProvider
 * @returns {Object} The user context object containing user data and methods
 * 
 * @example
 * // Accessing user data:
 * const { user } = useUser();
 * console.log(user.email);
 * 
 * // Using authentication methods:
 * const { signOut } = useUser();
 * await signOut();
 */
export function useUser() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
