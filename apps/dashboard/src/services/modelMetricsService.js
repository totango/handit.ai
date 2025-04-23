/**
 * @fileoverview Model Metrics API service
 * Provides RTK Query endpoints for model performance metrics and analysis
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for model metrics
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Model metrics retrieval
 * - Performance analysis
 * - Entry statistics
 * - Alert monitoring
 * - Historical comparisons
 */
export const modelsMetricsApi = createApi({
  reducerPath: 'modelsMetricsApi',
  baseQuery: baseQueryWithSandbox,
  endpoints: (builder) => ({
    /**
     * Get all model metrics for current user
     * @type {QueryEndpoint}
     * @returns {Array<Object>} List of model metrics
     * 
     * @description
     * Retrieves metrics for all models associated with the current user.
     */
    getModelsMetrics: builder.query({
      query: () => ({
        url: 'model-metrics/me',
      }),
    }),

    /**
     * Get metrics for specific model
     * @type {QueryEndpoint}
     * @param {string} modelMetricsId - ID of the model
     * @returns {Object} Model metrics data
     * 
     * @description
     * Retrieves detailed metrics for a specific model.
     */
    getModelMetricsById: builder.query({
      query: (modelMetricsId) => ({
        url: `model-metrics/model/${modelMetricsId}`,
      }),
    }),

    /**
     * Get correct entries by day
     * @type {QueryEndpoint}
     * @param {string} modelMetricsId - ID of the model
     * @returns {Array<Object>} Daily correct entries data
     * 
     * @description
     * Retrieves daily statistics of correct predictions.
     */
    getCorrectEntriesByDay: builder.query({
      query: (modelMetricsId) => ({
        url: `model-metrics/model/${modelMetricsId}/correct-entries`,
      }),
    }),

    /**
     * Get number of alerts by type
     * @type {QueryEndpoint}
     * @param {string} modelMetricsId - ID of the model
     * @returns {Object} Alert type statistics
     * 
     * @description
     * Retrieves statistics of alerts grouped by type.
     */
    getNumberOfAlertsByType: builder.query({
      query: (modelMetricsId) => ({
        url: `model-metrics/model/${modelMetricsId}/number-of-alerts-by-type`,
      }),
    }),

    /**
     * Get latest model metrics
     * @type {QueryEndpoint}
     * @param {string} modelMetricsId - ID of the model
     * @returns {Object} Latest metrics data
     * 
     * @description
     * Retrieves the most recent metrics for a specific model.
     */
    getLastModelMetricsById: builder.query({
      query: (modelMetricsId) => ({
        url: `model-metrics/model/${modelMetricsId}/last-model-metrics`,
      }),
    }),

    /**
     * Get entries count by class
     * @type {QueryEndpoint}
     * @param {string} modelMetricsId - ID of the model
     * @returns {Object} Class distribution statistics
     * 
     * @description
     * Retrieves statistics of entries grouped by class.
     */
    getEntriesCountByClass: builder.query({
      query: (modelMetricsId) => ({
        url: `model-metrics/model/${modelMetricsId}/count-entries-by-class`,
      }),
    }),

    /**
     * Get weekly class difference
     * @type {QueryEndpoint}
     * @param {string} modelMetricsId - ID of the model
     * @returns {Object} Weekly class distribution changes
     * 
     * @description
     * Retrieves changes in class distribution over the last week.
     */
    getDifferenceWeekCountByClass: builder.query({
      query: (modelMetricsId) => ({
        url: `model-metrics/model/${modelMetricsId}/difference-last-week-by-class`,
      }),
    }),

    /**
     * Get monthly metrics comparison
     * @type {QueryEndpoint}
     * @param {string} modelMetricsId - ID of the model
     * @returns {Object} Monthly metrics comparison data
     * 
     * @description
     * Retrieves comparison of metrics between current and previous month.
     */
    getMetricsComparisonLastMonth: builder.query({
      query: (modelMetricsId) => ({
        url: `model-metrics/model/${modelMetricsId}/comparison-metrics-last-month`,
      }),
    }),

    /**
     * Get tool metrics comparison
     * @type {QueryEndpoint}
     * @param {string} toolId - ID of the tool
     * @returns {Object} Tool metrics comparison data
     * 
     * @description
     * Retrieves comparison of metrics for a specific tool over the last month.
     */
    getToolMetricsComparisonLastMonth: builder.query({
      query: (toolId) => ({
        url: `agents/${toolId}/tool-comparison-metrics-last-month`,
      }),
    }),
  }),
});

// Export generated hooks
export const {
  useGetModelsMetricsQuery,
  useGetModelMetricsByIdQuery,
  useGetCorrectEntriesByDayQuery,
  useGetNumberOfAlertsByTypeQuery,
  useGetLastModelMetricsByIdQuery,
  useGetEntriesCountByClassQuery,
  useGetDifferenceWeekCountByClassQuery,
  useGetMetricsComparisonLastMonthQuery,
  useGetToolMetricsComparisonLastMonthQuery,
} = modelsMetricsApi;
