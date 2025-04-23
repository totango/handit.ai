import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

export const reviewersTemplateApi = createApi({
  reducerPath: 'reviewersTemplateApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['ReviewersTemplate'],
  endpoints: (builder) => ({
    getEvaluationPrompts: builder.query({
      query: () => ({ url: '/reviewers-template/evaluation-prompts', method: 'GET' }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'ReviewersTemplate', id })),
              { type: 'ReviewersTemplate', id: 'LIST' },
            ]
          : [{ type: 'ReviewersTemplate', id: 'LIST' }],
    }),
    createEvaluationPrompt: builder.mutation({
      async queryFn(body, _queryApi, _extraOptions, baseQuery) {
        // Send metricId, not metric
        const { name, prompt, metricId, associations = [], defaultProviderModel, defaultIntegrationTokenId } = body;
        const createRes = await baseQuery({
          url: '/reviewers-template/evaluation-prompts',
          method: 'POST',
          body: { name, prompt, metricId, defaultProviderModel, defaultIntegrationTokenId },
        });
        if (!createRes.data?.data?.id) {
          return { error: createRes.error || { message: 'Failed to create evaluation prompt' } };
        }
        const evaluationPromptId = createRes.data.data.id;
        // Associate to models
        for (const assoc of associations) {
          await baseQuery({
            url: `/reviewers-template/models/${assoc.modelId}/evaluation-prompts`,
            method: 'POST',
            body: {
              evaluationPromptId,
              integrationTokenId: assoc.tokenId,
              providerModel: assoc.providerModel,
            },
          });
        }
        return { data: createRes.data };
      },
      invalidatesTags: [{ type: 'ReviewersTemplate', id: 'LIST' }],
    }),
    updateEvaluationPrompt: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/reviewers-template/evaluation-prompts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ReviewersTemplate', id },
        { type: 'ReviewersTemplate', id: 'LIST' },
      ],
    }),
    associatePromptToModel: builder.mutation({
      query: ({ modelId, evaluationPromptId, integrationTokenId, providerModel }) => ({
        url: `/reviewers-template/models/${modelId}/evaluation-prompts`,
        method: 'POST',
        body: { evaluationPromptId, integrationTokenId, providerModel },
      }),
      invalidatesTags: [{ type: 'ReviewersTemplate', id: 'LIST' }],
    }),
    getPromptsForModel: builder.query({
      query: (modelId) => `/reviewers-template/models/${modelId}/evaluation-prompts`,
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ReviewersTemplate', id })),
              { type: 'ReviewersTemplate', id: 'LIST' },
            ]
          : [{ type: 'ReviewersTemplate', id: 'LIST' }],
    }),
    updateAssociation: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/reviewers-template/evaluation-prompts/associations/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ReviewersTemplate', id },
        { type: 'ReviewersTemplate', id: 'LIST' },
      ],
    }),
    deleteAssociation: builder.mutation({
      query: (id) => ({
        url: `/reviewers-template/evaluation-prompts/associations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'ReviewersTemplate', id },
        { type: 'ReviewersTemplate', id: 'LIST' },
      ],
    }),
    getEvaluationPromptStats: builder.query({
      query: () => '/reviewers-template/evaluation-prompts/stats',
      transformResponse: (response) => response.data,
      providesTags: [{ type: 'ReviewersTemplate', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetEvaluationPromptsQuery,
  useCreateEvaluationPromptMutation,
  useUpdateEvaluationPromptMutation,
  useAssociatePromptToModelMutation,
  useGetPromptsForModelQuery,
  useGetEvaluationPromptStatsQuery,
  useUpdateAssociationMutation,
  useDeleteAssociationMutation,
} = reviewersTemplateApi; 