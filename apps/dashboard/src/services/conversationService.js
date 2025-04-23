/**
 * @fileoverview Conversation API service
 * Provides RTK Query endpoints for conversation management and messaging
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithSandbox } from './baseQuery';

/**
 * RTK Query API for conversation management
 * @type {Object}
 * 
 * @description
 * This API provides endpoints for:
 * - Conversation initialization
 * - Message sending
 * - Conversation state management
 */
export const conversationApi = createApi({
  reducerPath: 'conversationApi',
  baseQuery: baseQueryWithSandbox,
  tagTypes: ['conversations'],
  endpoints: (builder) => ({
    /**
     * Initialize a new conversation
     * @type {MutationEndpoint}
     * @returns {Object} New conversation data
     * 
     * @description
     * Creates a new conversation instance and returns its data.
     * This is typically the first step in starting a new chat session.
     */
    initializeConversation: builder.mutation({
      query: () => ({
        url: 'messages/conversation',
        method: 'POST',
      }),
      providesTags: ['conversations'],
    }),

    /**
     * Send a message in a conversation
     * @type {MutationEndpoint}
     * @param {Object} params - Message parameters
     * @param {string} params.conversationId - ID of the conversation
     * @param {string} params.message - Message content to send
     * @returns {Object} Message response data
     * 
     * @description
     * Sends a message to an existing conversation.
     * The message will be processed and a response will be returned.
     */
    sendMessage: builder.mutation({
      query: ({ conversationId, message }) => ({
        url: 'messages',
        method: 'POST',
        body: {
          conversationId,
          message,
        },
      }),
      providesTags: ['conversations'],
    }),
  }),
});

// Export generated hooks
export const {
  useInitializeConversationMutation,
  useSendMessageMutation,
} = conversationApi; 