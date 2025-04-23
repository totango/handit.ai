/**
 * @fileoverview Models API service
 * Provides RTK Query endpoints for model management and optimization
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for model management
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Model CRUD operations
 * - Model optimization
 * - Log management
 * - Prompt optimization
 */
export const modelsApi = createApi({
  reducerPath: 'modelsApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['models'],
  endpoints: (builder) => ({
    /**
     * Get user's models
     * @type {QueryEndpoint}
     * @returns {Array<Object>} List of user's models
     * 
     * @description
     * Retrieves all models associated with the current user.
     * Results are cached and can be invalidated by model mutations.
     */
    getModels: builder.query({
      query: () => ({
        url: 'models/me',
      }),
      providesTags: ['models'], // Provide tags for the query
    }),
    /**
     * Get model by ID
     * @type {QueryEndpoint}
     * @param {string} modelId - ID of the model to retrieve
     * @returns {Object} Model data
     * 
     * @description
     * Retrieves detailed information for a specific model.
     */
    getModelById: builder.query({
      query: (modelId) => ({
        url: `models/${modelId}`,
      }),
    }),
    /**
     * Add new model
     * @type {MutationEndpoint}
     * @param {Object} modelsData - Model creation data
     * @returns {Object} Created model
     * 
     * @description
     * Creates a new model with the provided data.
     * Invalidates the models cache to trigger a refresh.
     */
    addModels: builder.mutation({
      query: (modelsData) => ({
        url: 'models',
        method: 'POST',
        body: modelsData,
      }),
      invalidatesTags: ['models'],
    }),
    /**
     * Apply optimization suggestions
     * @type {MutationEndpoint}
     * @param {string} modelId - ID of the model to optimize
     * @returns {Object} Optimization results
     * 
     * @description
     * Applies automatic optimization suggestions to a model.
     */
    applySuggestions: builder.mutation({
      query: (modelId) => ({
        url: `automatic-optimization/${modelId}/apply-suggestions`,
        method: 'POST',
      }),
    }),
    /**
     * Use optimized prompt
     * @type {MutationEndpoint}
     * @param {Object} params - Optimization parameters
     * @param {string} params.modelId - ID of the model
     * @param {string} params.newPrompt - New optimized prompt
     * @returns {Object} Update confirmation
     * 
     * @description
     * Updates a model with an optimized prompt.
     */
    useOptimizedPrompt: builder.mutation({
      query: ({ modelId, newPrompt }) => ({
        url: `automatic-optimization/${modelId}/use-optimized-prompt`,
        method: 'POST',
        body: { newPrompt },
      }),
    }),
    /**
     * Update existing model
     * @type {MutationEndpoint}
     * @param {Object} modelsData - Model update data
     * @param {string} modelsData.id - ID of model to update
     * @returns {Object} Updated model
     * 
     * @description
     * Updates an existing model with new data.
     * Invalidates the models cache to trigger a refresh.
     */
    updateModels: builder.mutation({
      query: (modelsData) => ({
        url: `models/${modelsData.id}`,
        method: 'PUT',
        body: modelsData,
      }),
      invalidatesTags: ['models'],
    }),
    /**
     * Delete model
     * @type {MutationEndpoint}
     * @param {string} modelsId - ID of model to delete
     * @returns {Object} Deletion confirmation
     * 
     * @description
     * Removes a model by its ID.
     * Invalidates the models cache to trigger a refresh.
     */
    deleteModels: builder.mutation({
      query: (modelsId) => ({
        url: `models/${modelsId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['models'],
    }),
    /**
     * Get model logs count
     * @type {QueryEndpoint}
     * @returns {Object} Log count statistics
     * 
     * @description
     * Retrieves the count of model logs for the current user.
     */
    getMineModelLogsCount: builder.query({
      query: () => ({
        url: `model-logs/count/me`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetModelsQuery,
  useGetModelByIdQuery,
  useGetMineModelLogsCountQuery,
  useAddModelsMutation,
  useUpdateModelsMutation,
  useDeleteModelsMutation,
  useApplySuggestionsMutation,
  useUseOptimizedPromptMutation,
} = modelsApi;
