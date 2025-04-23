/**
 * AI Chat Panel Component
 * 
 * This component provides an advanced chat interface for AI interactions with:
 * - Agent-specific conversations
 * - Session persistence
 * - Real-time message handling
 * - Custom styling and UI elements
 * - Integration with company and agent data
 * 
 * The panel integrates with multiple services to provide
 * contextual assistance based on the selected agent and company.
 */
'use client';

import * as React from 'react';
import { Avatar, Box, CircularProgress, Fab, IconButton, Paper, TextField, Typography } from '@mui/material';
import { ArrowsOut, Brain, Chat, ChatCircleText, ChatsCircle, PaperPlaneTilt, X as XIcon } from '@phosphor-icons/react';
import { SystemMessage } from 'react-chat-elements';

import 'react-chat-elements/dist/main.css';

import { useParams, useSearchParams } from 'next/navigation';
import { useGetAgentByIdQuery } from '@/services/agentsService';
import { useGetUserQuery } from '@/services/auth/authService';
import { useInitializeConversationMutation } from '@/services/conversationService';

import { ChatMessage } from './chat-message';

/**
 * Sends a message to the AI chat API
 * @param {string} message - The message to send
 * @param {string} conversationId - The current conversation ID
 * @param {string} companyId - The company ID for context
 * @returns {Promise<Object>} The API response containing conversation data
 */
const sendMessageToAPI = async (message, conversationId, companyId) => {
  const params = new URLSearchParams(window.location.search);
  let agentId = params.get('agentId');

  try {
    const response = await fetch('https://model-rag-299768392189.us-central1.run.app/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: message,
        conversation_id: conversationId,
        agent_id: agentId === '65' ? '39' : agentId,
        company_id: companyId === '86' ? '63' : companyId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * AI Chat Panel Component
 * 
 * @returns {JSX.Element} The chat panel interface with floating button and message panel
 */
export function AIChatPanel() {
  // URL and query parameters
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId');

  // Data fetching hooks
  const { data: agentDetails } = useGetAgentByIdQuery(agentId === '65' ? '39' : agentId, {
    skip: !agentId,
  });
  const { data: userData } = useGetUserQuery();
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messageListRef = React.useRef(null);
  const [conversationId, setConversationId] = React.useState(null);
  const [initializeConversation] = useInitializeConversationMutation();

  /**
   * Effect to manage conversation persistence and initialization
   * Handles loading stored conversations and creating new ones
   */
  React.useEffect(() => {
    if (agentId) {
      const storedData = sessionStorage.getItem(`chat_${agentId}`);
      if (storedData) {
        const { messages: storedMessages, conversationId: storedConversationId } = JSON.parse(storedData);
        setMessages(storedMessages);
        setConversationId(storedConversationId);
      } else {
        // Initialize new conversation if none exists for this agent
        initializeConversation()
          .unwrap()
          .then((response) => {
            setConversationId(response.conversationId);
            // Add welcome message for new conversation
            const welcomeMessage = {
              position: 'left',
              type: 'text',
              text: `Hello! I'm your AI Assistant for ${agentDetails?.name}.
I can help with business‑level questions (performance insights, workflow impact) and technical deep‑dives—like metric analysis, applied improvements, or optimization suggestions for this agent.
What would you like to explore today?`,
              date: new Date(),
              avatar: '/static/ai-assistant.svg',
            };
            setMessages([welcomeMessage]);
            // Save initial state to session storage
            sessionStorage.setItem(
              `chat_${agentId}`,
              JSON.stringify({
                messages: [welcomeMessage],
                conversationId: response.conversationId,
              })
            );
          })
          .catch((error) => {
            console.error('Failed to initialize conversation:', error);
          });
      }
    } else {
      // Clear messages and conversationId if no agent is selected
      setMessages([]);
      setConversationId(null);
    }

    // Cleanup function to clear old agent's data
    return () => {
      if (agentId) {
        // Clear any pending data from previous agent
        const welcomeMessage = {
          position: 'left',
          type: 'text',
          text: `Hello! I'm your AI Assistant.
I can help with business‑level questions (performance insights, workflow impact) and technical deep‑dives—like metric analysis, applied improvements, or optimization suggestions for this agent.
What would you like to explore today?`,
          date: new Date(),
          avatar: '/static/ai-assistant.svg',
        };
        setMessages([welcomeMessage]);
        setConversationId(null);
      }
    };
  }, [agentId, initializeConversation, agentDetails?.name]);

  /**
   * Effect to scroll to bottom when messages change
   */
  React.useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
      avatar: userData?.company?.icon || '/static/user-avatar.svg',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingIndicator = {
      position: 'left',
      type: 'text',
      date: new Date(),
      isTyping: true,
      avatar: '/assets/logo 2.svg',
    };

    setMessages((prev) => [...prev, typingIndicator]);

    try {
      // Send message to API
      const response = await sendMessageToAPI(inputValue, conversationId, String(userData?.companyId) === '65' ? '39' : String(userData?.companyId));
      const conversation = response.conversation_id;
      const answer = response.response;
      setConversationId(conversation);

      // Update messages and save to session storage
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        const newMessages = [
          ...filtered,
          {
            position: 'left',
            type: 'text',
            text: answer,
            date: new Date(),
            avatar: '/assets/logo 2.svg',
          },
        ];

        // Save to session storage after updating messages
        if (agentId) {
          sessionStorage.setItem(
            `chat_${agentId}`,
            JSON.stringify({
              messages: newMessages,
              conversationId: conversation,
            })
          );
        }

        return newMessages;
      });
    } catch (error) {
      console.error('Error in message flow:', error);

      // Remove typing indicator and add error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        const newMessages = [
          ...filtered,
          {
            position: 'left',
            type: 'text',
            text: 'Sorry, I encountered an error processing your request. Please try again.',
            date: new Date(),
            avatar: '/static/ai-assistant.svg',
          },
        ];

        // Save to session storage after updating messages
        if (agentId) {
          sessionStorage.setItem(
            `chat_${agentId}`,
            JSON.stringify({
              messages: newMessages,
              conversationId,
            })
          );
        }

        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };


  // Add welcome message when chat is first opened
  if (isOpen && messages.length === 0) {
    const welcomeMessage = {
      position: 'left',
      type: 'text',
      text: "Hello! I'm your AI Agent Assistant. I can provide insights about models or answer questions about your system. How can I help you today?",
      date: new Date(),
      avatar: '/assets/logo 2.svg',
    };
    setMessages([welcomeMessage]);
  }

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
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            bgcolor: 'white',
          },
        }}
      >
        <Avatar src="/assets/lg2.png" />
      </Fab>

      {/* Chat Interface Panel */}
      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 400,
            height: 600,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: '#FFFFFF',
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: '#FFFFFF',
              color: '#1A1A1A',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: '1.1rem',
                flex: 1,
                textAlign: 'center',
              }}
            >
              {agentDetails?.name} AI Assistant
            </Typography>
            <IconButton
              onClick={toggleChat}
              sx={{
                bgcolor: '#F0F0F0',
                '&:hover': { bgcolor: '#E5E5E5' },
                color: '#1A1A1A',
              }}
            >
              <XIcon />
            </IconButton>
          </Box>

          {/* Message List */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              py: 2,
              px: 3,
              bgcolor: '#FFFFFF',
              paddingLeft: '5px',
              paddingRight: '5px',
            }}
          >
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                {msg.type === 'system' ? (
                  <SystemMessage text={msg.text} />
                ) : (
                  <ChatMessage
                    position={msg.position}
                    text={msg.text}
                    date={msg.date}
                    avatar={msg.position === 'left' ? '/assets/lg2.png' : userData?.company?.icon}
                    isTyping={msg.isTyping}
                    sx={{
                      '& .message-bubble': {
                        bgcolor: msg.position === 'left' ? '#F0F0FF' : '#F5F5F5',
                        borderRadius: '16px',
                        padding: '12px 16px',
                        maxWidth: '80%',
                      },
                      '& .avatar': {
                        bgcolor: msg.position === 'left' ? '#6B4EFF' : '#E0E0E0',
                        color: '#FFFFFF',
                        width: 32,
                        height: 32,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                      },
                    }}
                  />
                )}
              </React.Fragment>
            ))}
            <div ref={messageListRef} />
          </Box>

          {/* Message Input Area */}
          <Box
            sx={{
              p: 2,
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#F5F5F5',
                borderRadius: '24px',
                px: 2,
                py: 1,
              }}
            >
              <TextField
                fullWidth
                placeholder="Message"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                multiline
                maxRows={3}
                variant="standard"
                sx={{
                  '& .MuiInputBase-root': {
                    padding: '0px',
                    '&:before, &:after': {
                      display: 'none',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: ' 8px 0px',
                    color: '#1A1A1A',
                    '&::placeholder': {
                      color: 'rgba(0, 0, 0, 0.5)',
                      opacity: 1,
                    },
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                sx={{
                  p: 1,
                  color: '#004e54',
                  '&.Mui-disabled': {
                    color: 'rgba(0, 0, 0, 0.26)',
                  },
                }}
              >
                <PaperPlaneTilt weight="fill" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
}
