/**
 * Redux Store Configuration
 * 
 * This module configures the main Redux store for the application.
 * It sets up the store with multiple API slices and their middleware,
 * enabling features like caching, invalidation, and real-time updates.
 * 
 * @module store
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { agentsApi } from '@/services/agentsService';
import { authApi } from '@/services/auth/authService';
import { conversationApi } from '@/services/conversationService';

/**
 * Configured Redux store instance
 * 
 * The store is configured with:
 * - Multiple API slices for different features
 * - Custom middleware for API handling
 * - Automatic state management for API requests
 * 
 * @type {Object}
 */
export const store = configureStore({
  // Combine reducers from different API slices
  reducer: {
    // Agents API slice for managing agent-related state
    [agentsApi.reducerPath]: agentsApi.reducer,
    // Authentication API slice for managing auth state
    [authApi.reducerPath]: authApi.reducer,
    // Conversation API slice for managing chat state
    [conversationApi.reducerPath]: conversationApi.reducer,
  },
  // Configure middleware to handle API requests
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // Add middleware for each API slice
      agentsApi.middleware,
      authApi.middleware,
      conversationApi.middleware
    ),
});

// Enable automatic refetching of data when the window regains focus
// This helps keep the data fresh and in sync
setupListeners(store.dispatch); 
