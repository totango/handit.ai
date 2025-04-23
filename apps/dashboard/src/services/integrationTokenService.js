import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

export const integrationTokenApi = createApi({
  reducerPath: 'integrationTokenApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['IntegrationToken'],
  endpoints: (builder) => ({
    getIntegrationTokens: builder.query({
      query: () => ({ url: '/integration-tokens', method: 'GET' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'IntegrationToken', id })),
              { type: 'IntegrationToken', id: 'LIST' },
            ]
          : [{ type: 'IntegrationToken', id: 'LIST' }],
    }),
    createIntegrationToken: builder.mutation({
      query: (body) => ({
        url: '/integration-tokens',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'IntegrationToken', id: 'LIST' }],
    }),
    updateIntegrationToken: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/integration-tokens/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'IntegrationToken', id },
        { type: 'IntegrationToken', id: 'LIST' },
      ],
    }),
    setOptimizationToken: builder.mutation({
      query: ({ tokenId }) => ({
        url: '/integration-tokens/set-optimization-token',
        method: 'POST',
        body: { tokenId },
      }),
      invalidatesTags: [{ type: 'IntegrationToken', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetIntegrationTokensQuery,
  useCreateIntegrationTokenMutation,
  useUpdateIntegrationTokenMutation,
  useSetOptimizationTokenMutation,
} = integrationTokenApi; 