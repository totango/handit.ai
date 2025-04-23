/**
 * @fileoverview Setup API service
 * Provides RTK Query endpoints for downloading various setup configurations
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for setup operations
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - MCP setup downloads
 * - Context setup downloads
 * - Configuration setup downloads
 */
export const setupApi = createApi({
  reducerPath: 'setupApi',
  baseQuery: baseQueryWithSandbox,
  endpoints: (builder) => ({
    /**
     * Download MCP setup file
     * @type {MutationEndpoint}
     * @param {string} id - ID of the MCP setup
     * @returns {Blob} MCP setup file
     * 
     * @description
     * Downloads the MCP (Model Control Panel) setup configuration file.
     * Returns a blob that can be downloaded as a file.
     */
    downloadMCPSetup: builder.mutation({
      query: (id) => ({
        url: `setup/mcp/${id}`,
        method: 'GET',
        responseType: 'blob',
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
    }),

    /**
     * Download context setup file
     * @type {MutationEndpoint}
     * @param {string} id - ID of the context setup
     * @returns {Blob} Context setup file
     * 
     * @description
     * Downloads the context setup configuration file.
     * Returns a blob that can be downloaded as a file.
     */
    downloadContextSetup: builder.mutation({
      query: (id) => ({
        url: `setup/context/${id}`,
        method: 'GET',
        responseType: 'blob',
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
    }),

    /**
     * Download configuration setup file
     * @type {MutationEndpoint}
     * @param {string} id - ID of the configuration setup
     * @returns {Blob} Configuration setup file
     * 
     * @description
     * Downloads the general configuration setup file.
     * Returns a blob that can be downloaded as a file.
     */
    downloadConfigSetup: builder.mutation({
      query: (id) => ({
        url: `setup/config/${id}`,
        method: 'GET',
        responseType: 'blob',
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
    }),
  }),
});

// Export generated hooks
export const {
  useDownloadMCPSetupMutation,
  useDownloadContextSetupMutation,
  useDownloadConfigSetupMutation,
} = setupApi;

/**
 * Helper function to handle blob downloads
 * @param {Response} response - The blob response from the API
 * @param {string} filename - The name to save the file as
 * 
 * @description
 * Creates a temporary download link and triggers the file download.
 * Automatically cleans up the temporary elements after download.
 */
export const handleBlobDownload = async (response, filename) => {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}; 