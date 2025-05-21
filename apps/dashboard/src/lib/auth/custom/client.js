'use client';

import { authApi } from '@/services/auth/authService';
import { store } from '@/store';

/**
 * Generates a random token using the Web Crypto API
 * @returns {string} A random hexadecimal token
 */
function generateToken() {
  // Create a new Uint8Array with 12 bytes for random values
  const arr = new Uint8Array(12);
  // Fill the array with cryptographically secure random values
  window.crypto.getRandomValues(arr);
  // Convert each byte to a hexadecimal string and join them
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Default user object for development/testing purposes
 * @type {Object}
 */
const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
};

/**
 * Authentication client for handling custom authentication operations
 * This class provides methods for user authentication, session management,
 * and user data retrieval using a custom authentication strategy.
 */
class AuthClient {
  /**
   * Registers a new user
   * @param {Object} params - User registration parameters
   * @returns {Promise<Object>} Empty object on success
   */
  async signUp(_) {
    // Make API request to register the user
    await store.dispatch(authApi.endpoints.signUp.initiate(_));
    // Fetch user data after successful registration
    await store.dispatch(authApi.endpoints.getUser.initiate());

    return {};
  }

  /**
   * Handles OAuth-based authentication
   * @param {Object} params - OAuth parameters
   * @returns {Promise<{error: string}>} Error object indicating OAuth is not implemented
   */
  async signInWithOAuth(_) {
    return { error: 'Social authentication not implemented' };
  }

  /**
   * Authenticates a user with email and password
   * @param {Object} params - Authentication parameters
   * @param {string} params.email - User's email address
   * @param {string} params.password - User's password
   * @returns {Promise<Object>} Empty object on success, error object on failure
   */
  async signInWithPassword(params) {
    const { email, password } = params;
    // Make API request to authenticate user
    try {
      // Attempt to login with provided credentials
      const answerLogin = await store.dispatch(authApi.endpoints.login.initiate({ email, password }));
      if (answerLogin.error) {
        return answerLogin;
      }
      // Fetch user data after successful login
      await store.dispatch(authApi.endpoints.getUser.initiate());
      return {};
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Initiates password reset process
   * @param {Object} params - Password reset parameters
   * @returns {Promise<{error: string}>} Error object indicating reset is not implemented
   */
  async resetPassword(_) {
    return { error: 'Password reset not implemented' };
  }

  /**
   * Updates user's password
   * @param {Object} params - Password update parameters
   * @returns {Promise<{error: string}>} Error object indicating update is not implemented
   */
  async updatePassword(_) {
    return { error: 'Update reset not implemented' };
  }

  /**
   * Retrieves the current user's data from local storage
   * @returns {Promise<{data: Object|null}>} User data object or null if not authenticated
   */
  async getUser() {
    // Check for authentication token
    const token = localStorage.getItem('custom-auth-token');
    let user = localStorage.getItem('user');
    // Return null if no token is found
    if (!token) {
      return { data: null };
    }

    // Return null if no user data is found
    if (!user) {
      return { data: null };
    }
    // Parse and return the user data
    user = JSON.parse(user);
    return { data: user };
  }

  /**
   * Signs out the current user
   * Clears authentication token and resets application state
   * @returns {Promise<Object>} Empty object on success
   */
  async signOut() {
    // Remove authentication token from local storage
    localStorage.removeItem('custom-auth-token');

    // Dispatch logout action to clear auth state
    store.dispatch({ type: 'auth/logout' });

    // Reset API state to clear any cached data
    await store.dispatch(authApi.util.resetApiState());
    return {};
  }
}

export const authClient = new AuthClient();
