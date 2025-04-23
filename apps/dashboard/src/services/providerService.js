import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

export const providerApi = createApi({
  reducerPath: 'providerApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['Provider'],
  endpoints: (builder) => ({
    getProviders: builder.query({
      query: () => ({ url: '/providers', method: 'GET' }),
      providesTags: ['providers'],
    }),
  }),
});

export const {
  useGetProvidersQuery,
} = providerApi; 