/**
 * @fileoverview AI Chat hook for managing chat interactions
 * Provides state management and message handling for AI chat functionality
 */

import * as React from 'react';

/**
 * Custom hook for managing AI chat interactions
 * @function
 * @returns {Object} Chat state and control functions
 * @property {Array<Object>} messages - Array of chat messages
 * @property {boolean} isLoading - Loading state indicator
 * @property {string|null} error - Error message if any
 * @property {Function} sendMessage - Function to send a new message
 * @property {Function} addSystemMessage - Function to add a system message
 * @property {Function} clearMessages - Function to clear all messages
 * 
 * @description
 * This hook provides:
 * - Message state management
 * - Loading state handling
 * - Error handling
 * - Message sending with typing indicators
 * - System message support
 * - Message clearing functionality
 * - Polling for message status
 * - Automatic error recovery
 */
export function useAIChat() {
  // State management
  const [messages, setMessages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /**
   * Sends a message to the AI chat endpoint
   * @async
   * @param {string} message - The message to send
   * @throws {Error} If message sending or status checking fails
   */
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      position: 'right',
      type: 'text',
      text: message,
      date: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Add typing indicator
    const typingIndicator = {
      position: 'left',
      type: 'text',
      isTyping: true,
      date: new Date(),
    };

    setMessages(prev => [...prev, typingIndicator]);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const messageId = data.messageId;

      // Poll for status until complete
      let complete = false;
      let attempts = 0;
      const MAX_ATTEMPTS = 30; // Prevent infinite loops

      while (!complete && attempts < MAX_ATTEMPTS) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusResponse = await fetch(`/api/chat/status?messageId=${messageId}`);

        if (!statusResponse.ok) {
          throw new Error('Failed to check message status');
        }

        const statusData = await statusResponse.json();

        if (statusData.status === 'complete') {
          complete = true;

          // Remove typing indicator and add AI response
          setMessages(prev => {
            const filtered = prev.filter(msg => !msg.isTyping);
            return [...filtered, {
              position: 'left',
              type: 'text',
              text: statusData.response,
              date: new Date(),
            }];
          });
        } else if (statusData.status === 'error') {
          throw new Error(statusData.message || 'Error processing request');
        }
      }

      if (!complete) {
        throw new Error('Request timed out');
      }
    } catch (err) {
      console.error('Error in message flow:', err);
      setError(err.message);

      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          position: 'left',
          type: 'text',
          text: `Sorry, I encountered an error: ${err.message}. Please try again.`,
          date: new Date(),
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Adds a system message to the chat
   * @param {string} text - The system message text
   */
  const addSystemMessage = (text) => {
    setMessages(prev => [
      ...prev,
      {
        type: 'system',
        text,
        date: new Date(),
      }
    ]);
  };

  /**
   * Clears all messages from the chat
   */
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addSystemMessage,
    clearMessages,
  };
} 