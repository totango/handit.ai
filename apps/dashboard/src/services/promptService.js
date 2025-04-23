/**
 * @fileoverview Prompt API service
 * Provides RTK Query endpoints for prompt version management and metrics
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for prompt management
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Prompt version control
 * - Prompt metrics and insights
 * - Agent prompt management
 * - Active prompt tracking
 */
export const promptApi = createApi({
  reducerPath: 'promptApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['prompts'],
  endpoints: (builder) => ({
    /**
     * Get current prompt for model
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Object} Current prompt data
     * 
     * @description
     * Retrieves the current prompt version for a specific model.
     */
    getPrompt: builder.query({
      query: (modelId) => `/prompt-versions/model/${modelId}/prompt`,
    }),

    /**
     * Get all prompt versions for model
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Array<Object>} List of prompt versions
     * 
     * @description
     * Retrieves all prompt versions associated with a model.
     * Response is transformed to extract the data array.
     */
    getPromptVersions: builder.query({
      query: (modelId) => `/prompt-versions/model/${modelId}/prompts`,
      transformResponse: (response) => response.data,
    }),

    /**
     * Get agent prompt by ID
     * @type {QueryEndpoint}
     * @param {string} agentId - ID of the agent
     * @returns {Object} Agent prompt data
     * 
     * @description
     * Retrieves prompt information for a specific autonomous agent.
     */
    getAgentByIdAutonom: builder.query({
      query: (agentId) => `/prompt-versions/agents/${agentId}`,
    }),

    /**
     * Create new prompt version
     * @type {MutationEndpoint}
     * @param {Object} params - Creation parameters
     * @param {string} params.modelId - ID of the model
     * @param {string} params.prompt - New prompt content
     * @returns {Object} Created prompt version
     * 
     * @description
     * Creates a new prompt version for a model.
     * Invalidates the prompts cache for the specific model.
     */
    createPrompt: builder.mutation({
      query: ({ modelId, prompt }) => ({
        url: `/prompt-versions/model/${modelId}/prompt`,
        method: 'POST',
        body: { prompt },
      }),
      invalidatesTags: (result, error, { modelId }) => [{ type: 'prompts', id: modelId }],
    }),

    /**
     * Update existing prompt version
     * @type {MutationEndpoint}
     * @param {Object} params - Update parameters
     * @param {string} params.modelId - ID of the model
     * @param {string} params.version - Version to update
     * @param {string} params.prompt - Updated prompt content
     * @returns {Object} Updated prompt version
     * 
     * @description
     * Updates a specific prompt version for a model.
     * Invalidates the prompts cache for the specific model.
     */
    updatePrompt: builder.mutation({
      query: ({ modelId, version, prompt }) => ({
        url: `/prompt-versions/model/${modelId}/prompt/${version}`,
        method: 'PUT',
        body: { prompt },
      }),
      invalidatesTags: (result, error, { modelId }) => [{ type: 'prompts', id: modelId }],
    }),

    /**
     * Delete prompt version
     * @type {MutationEndpoint}
     * @param {string} modelId - ID of the model
     * @returns {Object} Deletion confirmation
     * 
     * @description
     * Deletes the current prompt version for a model.
     * Invalidates the prompts cache for the specific model.
     */
    deletePrompt: builder.mutation({
      query: (modelId) => ({
        url: `/prompt-versions/model/${modelId}/prompt`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, modelId) => [{ type: 'prompts', id: modelId }],
    }),

    /**
     * Get active prompt
     * @type {QueryEndpoint}
     * @returns {Object} Active prompt data
     * 
     * @description
     * Retrieves the currently active prompt version.
     * Results are cached and can be invalidated by prompt mutations.
     */
    getActivePrompt: builder.query({
      query: () => ({
        url: '/prompt-versions/prompt/active',
      }),
      providesTags: ['prompts'],
    }),

    /**
     * Release prompt version
     * @type {MutationEndpoint}
     * @param {Object} params - Release parameters
     * @param {string} params.modelId - ID of the model
     * @param {string} params.version - Version to release
     * @param {string} params.originalModelId - ID of original model
     * @returns {Object} Release confirmation
     * 
     * @description
     * Releases a specific prompt version for a model.
     * Invalidates the prompts cache for the specific model.
     */
    releasePrompt: builder.mutation({
      query: ({ modelId, version, originalModelId }) => ({
        url: `/prompt-versions/model/${modelId}/prompt/${version}/release/${originalModelId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, modelId) => [{ type: 'prompts', id: modelId }],
    }),

    /**
     * Get all prompts
     * @type {QueryEndpoint}
     * @returns {Array<Object>} List of all prompts
     * 
     * @description
     * Retrieves all prompts across all models.
     * Results are cached and can be invalidated by prompt mutations.
     */
    getAllPrompts: builder.query({
      query: () => ({
        url: '/prompt-versions/prompts',
      }),
      providesTags: ['prompts'],
    }),

    /**
     * Get prompt version metrics
     * @type {QueryEndpoint}
     * @param {Object} params - Query parameters
     * @param {string} params.modelId - ID of the model
     * @param {string} params.version - Version to analyze
     * @returns {Object} Prompt metrics data
     * 
     * @description
     * Retrieves performance metrics for a specific prompt version.
     */
    getPromptVersionMetrics: builder.query({
      query: ({ modelId, version }) =>
        `/prompt-versions/model/${modelId}/prompt/${version}/metrics`,
    }),

    /**
     * Get prompt version insights
     * @type {QueryEndpoint}
     * @param {Object} params - Query parameters
     * @param {string} params.modelId - ID of the model
     * @param {string} params.version - Version to analyze
     * @returns {Object} Prompt insights data
     * 
     * @description
     * Retrieves detailed insights for a specific prompt version.
     */
    getPromptVersionInsights: builder.query({
      query: ({ modelId, version }) => `/prompt-versions/model/${modelId}/prompt/${version}/insights`,
    }),

    getModelOptimizationStatus: builder.query({
      query: (agentId) => `/prompt-versions/agents/${agentId}/model-optimization-status`,
      transformResponse: (response) => response,
    }),
  }),
});

// Export generated hooks
export const {
  useGetPromptQuery,
  useGetPromptVersionsQuery,
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useDeletePromptMutation,
  useGetActivePromptQuery,
  useReleasePromptMutation,
  useGetAllPromptsQuery,
  useGetAgentByIdAutonomQuery,
  useGetPromptVersionMetricsQuery,
  useGetPromptVersionInsightsQuery,
  useGetModelOptimizationStatusQuery,
} = promptApi; 