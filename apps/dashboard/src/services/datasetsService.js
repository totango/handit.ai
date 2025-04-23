/**
 * @fileoverview Datasets API service
 * Provides RTK Query endpoints for dataset management operations
 */

// services/datasetsService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for dataset management
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Dataset retrieval
 * - Dataset creation
 * - Dataset updates
 * - Dataset deletion
 */
export const datasetsApi = createApi({
  reducerPath: 'datasetsApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['datasets'],
  endpoints: (builder) => ({
    /**
     * Get user's datasets
     * @type {QueryEndpoint}
     * @returns {Array<Object>} List of user's datasets
     * 
     * @description
     * Retrieves all datasets associated with the current user.
     * Results are cached and can be invalidated by dataset mutations.
     */
    getDatasets: builder.query({
      query: () => ({
        url: 'datasets/me',
      }),
      providesTags: ['datasets'], // Provide tags for the query
    }),
    /**
     * Add new dataset
     * @type {MutationEndpoint}
     * @param {Object} datasetData - Dataset creation data
     * @returns {Object} Created dataset
     * 
     * @description
     * Creates a new dataset with the provided data.
     * Invalidates the datasets cache to trigger a refresh.
     */
    addDatasets: builder.mutation({
      query: (datasetData) => ({
        url: 'datasets',
        method: 'POST',
        body: datasetData,
      }),
      invalidatesTags: ['datasets'],
    }),
    /**
     * Update existing dataset
     * @type {MutationEndpoint}
     * @param {Object} datasetData - Dataset update data
     * @param {string} datasetData.id - ID of dataset to update
     * @returns {Object} Updated dataset
     * 
     * @description
     * Updates an existing dataset with new data.
     * Invalidates the datasets cache to trigger a refresh.
     */
    updateDatasets: builder.mutation({
      query: (datasetData) => ({
        url: `datasets/${datasetData.id}`,
        method: 'PUT',
        body: datasetData,
      }),
      invalidatesTags: ['datasets'],
    }),
    /**
     * Delete dataset
     * @type {MutationEndpoint}
     * @param {string} datasetId - ID of dataset to delete
     * @returns {Object} Deletion confirmation
     * 
     * @description
     * Removes a dataset by its ID.
     * Invalidates the datasets cache to trigger a refresh.
     */
    deleteDatasets: builder.mutation({
      query: (datasetId) => ({
        url: `datasets/${datasetId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['datasets'],
    }),
  }),
});

export const { useGetDatasetsQuery, useAddDatasetsMutation, useUpdateDatasetsMutation, useDeleteDatasetsMutation } =
  datasetsApi;
