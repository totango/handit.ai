/**
 * @fileoverview Monitoring API service
 * Provides RTK Query endpoints for model monitoring and A/B testing
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for monitoring operations
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Entry monitoring and management
 * - A/B testing metrics
 * - Model optimization tracking
 * - Reference data retrieval
 */
export const monitoringApi = createApi({
  reducerPath: 'monitoringApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['monitoring'],
  endpoints: (builder) => ({
    /**
     * Get list of monitoring entries
     * @type {QueryEndpoint}
     * @param {Object} params - Query parameters
     * @param {string} params.modelId - ID of the model
     * @param {number} [params.page=1] - Page number
     * @param {number} [params.pageSize=5] - Entries per page
     * @param {string} [params.type='verified'] - Entry type filter
     * @param {string} [params.environment='production'] - Environment filter
     * @returns {Object} Paginated list of entries
     * 
     * @description
     * Retrieves a paginated list of monitoring entries with filtering options.
     * Results are cached and can be invalidated by entry mutations.
     */
    getListOfEntries: builder.query({
      query: ({ modelId, page = 1, pageSize = 5, type = 'verified', environment = 'production' }) => ({
        url: 'monitoring/list/me/' + modelId + `?page=${page}&pageSize=${pageSize}&type=${type}&environment=${environment}`,
      }),
      providesTags: ['monitoring'],
    }),

    /**
     * Get entry details
     * @type {QueryEndpoint}
     * @param {string} id - ID of the entry
     * @returns {Object} Detailed entry data
     * 
     * @description
     * Retrieves detailed information for a specific monitoring entry.
     * Results are cached and can be invalidated by entry mutations.
     */
    getEntryDetails: builder.query({
      query: (id) => ({
        url: `monitoring/entry/${id}`,
      }),
      providesTags: ['monitoring'],
    }),

    /**
     * Get random A/B test entry
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Object} Random A/B test entry
     * 
     * @description
     * Retrieves a random entry for A/B testing purposes.
     */
    getRandomABTest: builder.query({
      query: (modelId) => ({
        url: `model-logs/random/log/${modelId}`,
      }),
    }),

    /**
     * Update monitoring entry
     * @type {MutationEndpoint}
     * @param {Object} data - Entry update data
     * @param {string} data.id - ID of entry to update
     * @returns {Object} Updated entry
     * 
     * @description
     * Updates a monitoring entry with new data.
     * Invalidates the monitoring cache to trigger a refresh.
     */
    updateEntry: builder.mutation({
      query: (data) => ({
        url: `monitoring/entry/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['monitoring'],
    }),

    /**
     * Get A/B test metrics
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Object} A/B test metrics
     * 
     * @description
     * Retrieves metrics for A/B testing of a model.
     */
    getABMetrics: builder.query({
      query: (modelId) => ({
        url: `ab-tests/model/${modelId}`,
      }),
    }),

    /**
     * Get A/B test correct entries by day
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Array<Object>} Daily correct entries data
     * 
     * @description
     * Retrieves daily statistics of correct entries for A/B testing.
     */
    getABCorrectEntriesByDay: builder.query({
      query: (modelId) => ({
        url: `ab-tests/model/${modelId}/correct-entries-by-day`,
      }),
    }),

    /**
     * Get A/B test prompts
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Array<Object>} A/B test prompts
     * 
     * @description
     * Retrieves prompts used in A/B testing for a model.
     */
    getABPrompts: builder.query({
      query: (modelId) => ({
        url: `ab-tests/model/${modelId}/prompts`,
      }),
    }),

    /**
     * Get A/B test metrics with full date range
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Object} Full date range metrics
     * 
     * @description
     * Retrieves comprehensive A/B test metrics across the full date range.
     */
    getABMetricsFullDate: builder.query({
      query: (modelId) => ({
        url: `ab-tests/model/${modelId}/metrics-full-date`,
      }),
    }),

    /**
     * Get optimized model data
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Object} Optimized model data
     * 
     * @description
     * Retrieves optimization data for a model from A/B testing.
     */
    getModelOptimized: builder.query({
      query: (modelId) => ({
        url: `ab-tests/model/${modelId}/optimized`,
      }),
    }),

    /**
     * Get reference lines
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Object} Reference line data
     * 
     * @description
     * Retrieves reference lines for A/B test comparison.
     */
    getReferenceLines: builder.query({
      query: (modelId) => ({
        url: `ab-tests/model/${modelId}/reference-lines`,
      }),
    }),
  }),
});

export const {
  useGetListOfEntriesQuery,
  useGetEntryDetailsQuery,
  useGetABMetricsQuery,
  useUpdateEntryMutation,
  useGetRandomABTestQuery,
  useGetABCorrectEntriesByDayQuery,
  useGetABPromptsQuery,
  useGetABMetricsFullDateQuery,
  useGetModelOptimizedQuery,
  useGetReferenceLinesQuery,
} = monitoringApi;
