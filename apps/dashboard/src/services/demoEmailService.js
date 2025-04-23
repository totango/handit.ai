/**
 * @fileoverview Demo Email API service
 * Provides RTK Query endpoints for demo email generation, evaluation, and analysis
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for demo email operations
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Email generation
 * - Email evaluation
 * - Insight generation
 * - Prompt enhancement
 */
export const demoEmailApi = createApi({
  reducerPath: 'demoEmailApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['demoEmail'],
  endpoints: (builder) => ({
    /**
     * Generate demo email
     * @type {MutationEndpoint}
     * @param {Object} data - Generation parameters
     * @returns {Object} Generated email content
     * 
     * @description
     * Generates a demo email based on provided parameters.
     * Results are tagged for cache management.
     */
    generateEmail: builder.mutation({
      query: (data) => ({
        url: 'demo-email/generate',
        method: 'POST',
        body: data,
      }),
      providesTags: ['demoEmail'],
    }),

    /**
     * Evaluate demo email
     * @type {MutationEndpoint}
     * @param {Object} data - Email evaluation parameters
     * @returns {Object} Evaluation results
     * 
     * @description
     * Evaluates a demo email and returns analysis results.
     * Used for quality assessment and improvement suggestions.
     */
    evaluateEmail: builder.mutation({
      query: (data) => ({
        url: 'demo-email/evaluate',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Get email insights
     * @type {MutationEndpoint}
     * @param {Object} data - Insight generation parameters
     * @returns {Object} Generated insights
     * 
     * @description
     * Generates insights and analysis for a demo email.
     * Provides detailed feedback and improvement suggestions.
     */
    getInsights: builder.mutation({
      query: (data) => ({
        url: 'demo-email/insight',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Enhance email prompt
     * @type {MutationEndpoint}
     * @param {Object} data - Prompt enhancement parameters
     * @returns {Object} Enhanced prompt
     * 
     * @description
     * Enhances the input prompt for better email generation.
     * Improves the quality and effectiveness of generated content.
     */
    enhancePrompt: builder.mutation({
      query: (data) => ({
        url: 'demo-email/enhance-prompt',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export generated hooks
export const {
  useGenerateEmailMutation,
  useEvaluateEmailMutation,
  useGetInsightsMutation,
  useEnhancePromptMutation,
} = demoEmailApi; 