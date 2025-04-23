/**
 * @fileoverview KPI API service
 * Provides RTK Query endpoints for Key Performance Indicator management
 */

// services/kpiService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for KPI management
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Dashboard overview
 * - KPI retrieval
 * - KPI creation
 * - KPI updates
 * - KPI deletion
 */
export const kpiApi = createApi({
  reducerPath: 'kpiApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['kpis'],
  endpoints: (builder) => ({
    /**
     * Get dashboard overview
     * @type {QueryEndpoint}
     * @returns {Object} Dashboard overview data
     * 
     * @description
     * Retrieves comprehensive dashboard overview data.
     * Results are cached and can be invalidated by KPI mutations.
     */
    getOverview: builder.query({
      query: () => ({
        url: 'dashboard',
      }),
      providesTags: ['kpis'], // Provide tags for the query
    }),

    /**
     * Get user's KPIs
     * @type {QueryEndpoint}
     * @returns {Array<Object>} List of user's KPIs
     * 
     * @description
     * Retrieves all KPIs associated with the current user.
     * Results are cached and can be invalidated by KPI mutations.
     */
    getKpis: builder.query({
      query: () => ({
        url: 'company-metrics/me',
      }),
      providesTags: ['kpis'], // Provide tags for the query
    }),

    /**
     * Add new KPI
     * @type {MutationEndpoint}
     * @param {Object} kpiData - KPI creation data
     * @returns {Object} Created KPI
     * 
     * @description
     * Creates a new KPI with the provided data.
     * Invalidates the KPIs cache to trigger a refresh.
     */
    addKpi: builder.mutation({
      query: (kpiData) => ({
        url: 'company-metrics',
        method: 'POST',
        body: kpiData,
      }),
      invalidatesTags: ['kpis'],
    }),

    /**
     * Update existing KPI
     * @type {MutationEndpoint}
     * @param {Object} kpiData - KPI update data
     * @param {string} kpiData.id - ID of KPI to update
     * @returns {Object} Updated KPI
     * 
     * @description
     * Updates an existing KPI with new data.
     * Invalidates the KPIs cache to trigger a refresh.
     */
    updateKpi: builder.mutation({
      query: (kpiData) => ({
        url: `company-metrics/${kpiData.id}`,
        method: 'PUT',
        body: kpiData,
      }),
      invalidatesTags: ['kpis'],
    }),

    /**
     * Delete KPI
     * @type {MutationEndpoint}
     * @param {string} kpiId - ID of KPI to delete
     * @returns {Object} Deletion confirmation
     * 
     * @description
     * Removes a KPI by its ID.
     * Invalidates the KPIs cache to trigger a refresh.
     */
    deleteKpi: builder.mutation({
      query: (kpiId) => ({
        url: `company-metrics/${kpiId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['kpis'],
    }),
  }),
});

export const { useGetKpisQuery, useAddKpiMutation, useUpdateKpiMutation, useDeleteKpiMutation, useGetOverviewQuery } = kpiApi;
