/**
 * @fileoverview Dashboard API service
 * Provides RTK Query endpoints for dashboard functionality and user registration
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query API for dashboard operations
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - User email registration
 * - Dashboard data management
 * - Authentication operations
 */
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { }) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    /**
     * Add user email for registration
     * @type {MutationEndpoint}
     * @param {Object} email - Email registration data
     * @returns {Object} Registration response
     * 
     * @description
     * Registers a user's email address for authentication.
     * This is typically used in the initial user registration flow.
     */
    addEmail: builder.mutation({
      query: (email) => ({
        url: 'auth/email-register',
        method: 'POST',
        body: email,
      }),
    }),
  }),
});

// Export generated hooks
export const { useAddEmailMutation } = dashboardApi;
