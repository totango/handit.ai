/**
 * AI Chat Interface Component
 * 
 * This component provides a floating chat interface for AI interactions with:
 * - Real-time message handling
 * - Message status polling
 * - Typing indicators
 * - Error handling
 * - Responsive UI
 * 
 * The interface integrates with an AI backend service to provide
 * conversational assistance and system insights.
 */
'use client';

import * as React from 'react';
import { Box, Fab, IconButton, Paper, Stack, TextField, Typography, CircularProgress } from '@mui/material';
import { X as XIcon, ChatCircleText, PaperPlaneTilt } from '@phosphor-icons/react';
import { MessageList, SystemMessage, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

/**
 * Sends a message to the AI chat API
 * @param {string} message - The message to send
 * @returns {Promise<Object>} The API response containing messageId or error
 */
const sendMessageToAPI = async (message) => {
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

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: true, message: 'Failed to send message' };
  }
};

/**
 * Checks the status of a sent message
 * @param {string} messageId - The ID of the message to check
 * @returns {Promise<Object>} The status response containing completion state or error
 */
const checkMessageStatus = async (messageId) => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch(`/api/chat/status?messageId=${messageId}`);

    if (!response.ok) {
      throw new Error('Failed to check message status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking message status:', error);
    return { status: 'error', error: true };
  }
};

/**
 * AI Chat Interface Component
 * 
 * @returns {JSX.Element} The chat interface with floating button and message panel
 */
export function AIChatInterface() {
  // State management for chat interface
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messageListRef = React.useRef(null);

  /**
   * Effect to add welcome message when chat is first opened
   */
  React.useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        position: 'left',
        type: 'text',
        text: "Hello! I'm your AI Agent Assistant. I can provide insights about models or answer questions about your system. How can I help you today?",
        date: new Date(),
        avatar: '/static/ai-assistant.svg', // Replace with your assistant avatar
      };

      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  /**
   * Toggles the chat interface visibility
   */
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handles input field changes
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * Handles key press events in the input field
   * @param {Event} e - The key press event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Handles sending a message to the AI
   * Manages message state, loading indicators, and API communication
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      position: 'right',
      type: 'text',
      text: inputValue,
      date: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingIndicator = {
      position: 'left',
      type: 'text',
      text: '...',
      date: new Date(),
      isTyping: true,
    };

    setMessages(prev => [...prev, typingIndicator]);

    try {
      // Send message to API
      const response = await sendMessageToAPI(inputValue);

      if (response.error) {
        throw new Error(response.message || 'Failed to get response');
      }

      const messageId = response.messageId;

      // Poll for status until complete
      let complete = false;
      while (!complete) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between checks

        const statusResponse = await checkMessageStatus(messageId);

        if (statusResponse.status === 'complete') {
          complete = true;

          // Remove typing indicator and add AI response
          setMessages(prev => {
            const filtered = prev.filter(msg => !msg.isTyping);
            return [...filtered, {
              position: 'left',
              type: 'text',
              text: statusResponse.response,
              date: new Date(),
              avatar: '/static/ai-assistant.svg', // Replace with your assistant avatar
            }];
          });
        } else if (statusResponse.status === 'error') {
          complete = true;

          // Remove typing indicator and add error message
          setMessages(prev => {
            const filtered = prev.filter(msg => !msg.isTyping);
            return [...filtered, {
              position: 'left',
              type: 'text',
              text: "Sorry, I encountered an error processing your request. Please try again.",
              date: new Date(),
              avatar: '/static/ai-assistant.svg', // Replace with your assistant avatar
            }];
          });
        }
      }
    } catch (error) {
      console.error('Error in message flow:', error);

      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, {
          position: 'left',
          type: 'text',
          text: "Sorry, I encountered an error processing your request. Please try again.",
          date: new Date(),
          avatar: '/static/ai-assistant.svg', // Replace with your assistant avatar
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ChatCircleText weight="fill" />
      </Fab>

      {/* Chat Interface Panel */}
      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 360,
            height: 500,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">AI Assistant</Typography>
            <IconButton onClick={toggleChat} sx={{ color: 'inherit' }}>
              <XIcon />
            </IconButton>
          </Box>

          {/* Message List */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <MessageList
              referance={messageListRef}
              className="message-list"
              lockable={true}
              toBottomHeight={'100%'}
              dataSource={messages.map((msg, index) => {
                if (msg.isTyping) {
                  return {
                    ...msg,
                    id: `typing-${index}`,
                    text: (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">Thinking...</Typography>
                      </Box>
                    ),
                  };
                }
                return {
                  ...msg,
                  id: `msg-${index}`,
                };
              })}
            />
          </Box>

          {/* Message Input Area */}
          <Box sx={{ p: 2, backgroundColor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                size="small"
                multiline
                maxRows={3}
                sx={{ flex: 1 }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                sx={{ alignSelf: 'flex-end' }}
              >
                <PaperPlaneTilt weight="fill" />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      )}
    </>
  );
} 