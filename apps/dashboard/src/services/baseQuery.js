/**
 * @fileoverview Base query configuration with sandbox support
 * Provides a base query function that handles both sandbox and production API calls
 */

import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { handleSandboxResponse } from './sandbox/service'; // Import sandbox functions

/** @constant {string} Token used to identify sandbox environment requests */
const sandboxToken = 'sandbox-test-token';

/**
 * Base query function with sandbox support
 * @function
 * @param {Object} args - Query arguments
 * @param {Object} [args.headers] - Request headers
 * @param {Object} api - RTK Query API instance
 * @param {Object} extraOptions - Additional options for the query
 * @returns {Promise<Object>} Query response
 * 
 * @description
 * This function provides:
 * - Sandbox environment detection
 * - Authentication token handling
 * - Production API integration
 * - Automatic sandbox response handling
 * 
 * The function checks if the request is for the sandbox environment
 * and routes it accordingly:
 * - Sandbox requests are handled by handleSandboxResponse
 * - Production requests use fetchBaseQuery with authentication
 */
export const baseQueryWithSandbox = async (args, api, extraOptions) => {
  const headers = args?.headers || {};
  const token = localStorage.getItem('custom-auth-token');

  if (token === sandboxToken) {
    // Call sandbox service to handle this request
    return handleSandboxResponse(args);
  } else {
    // Proceed with the actual API call
    headers['authorization'] = `Bearer ${token}`;
    // fetchbasequery, but add a function that if i got 401 it signs out 

    return fetchBaseQuery({
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      headers,
    })(args, api, extraOptions);
  }
};
