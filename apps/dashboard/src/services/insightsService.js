/**
 * @fileoverview Insights API service
 * Provides RTK Query endpoints for model insights and analysis
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for model insights
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Model insights retrieval
 * - Performance analysis
 * - Model behavior insights
 */
export const insightsApi = createApi({
  reducerPath: 'insightsApi',
  baseQuery: baseQueryWithSandbox,
  endpoints: (builder) => ({
    /**
     * Get insights for a specific model
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model to get insights for
     * @returns {Object} Model insights and analysis data
     * 
     * @description
     * Retrieves detailed insights and analysis for a specific model.
     * Includes performance metrics, behavior patterns, and improvement suggestions.
     */
    getInsightsOfModel: builder.query({
      query: (modelId) => ({
        url: `insights/${modelId}`,
      }),
    }),
  }),
});

// Export generated hooks
export const { useGetInsightsOfModelQuery } = insightsApi;
