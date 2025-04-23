import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

export const evaluatorMetricApi = createApi({
  reducerPath: 'evaluatorMetricApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['EvaluatorMetric'],
  endpoints: (builder) => ({
    getEvaluatorMetrics: builder.query({
      query: () => ({ url: '/evaluator-metrics', method: 'GET' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'EvaluatorMetric', id })),
              { type: 'EvaluatorMetric', id: 'LIST' },
            ]
          : [{ type: 'EvaluatorMetric', id: 'LIST' }],
    }),
    createEvaluatorMetric: builder.mutation({
      query: (body) => ({
        url: '/evaluator-metrics',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'EvaluatorMetric', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEvaluatorMetricsQuery,
  useCreateEvaluatorMetricMutation,
} = evaluatorMetricApi; 