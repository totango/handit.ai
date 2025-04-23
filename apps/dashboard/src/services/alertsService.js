/**
 * @fileoverview Alerts API service
 * Provides RTK Query endpoints for alert management and retrieval
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for alert management
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Alert retrieval by ID
 * - Alert status monitoring
 * - Alert data access
 */
export const alertsApi = createApi({
  reducerPath: 'alertsApi',
  baseQuery: baseQueryWithSandbox,
  endpoints: (builder) => ({
    /**
     * Get alert by ID
     * @type {QueryEndpoint}
     * @param {string} alertId - The unique identifier of the alert
     * @returns {Object} Alert data
     */
    getAlertById: builder.query({
      query: (alertId) => ({
        url: `alerts/${alertId}`,
      }),
    }),
  }),
});

// Export generated hooks
export const { useGetAlertByIdQuery } = alertsApi;
