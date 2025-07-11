import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  Paper,
  InputAdornment,
  Chip,
  Tooltip,
  CircularProgress,
  Card,
} from '@mui/material';
import {
  PaperPlaneTilt,
  Robot,
  User,
  Copy,
  Warning,
  CheckCircle,
  XCircle,
  X,
} from '@phosphor-icons/react';

const OnboardingChat = ({ 
  onConnectionCheck,
  connectionStatus = 'disconnected', // 'disconnected', 'checking', 'connected', 'error'
  mode = 'assistant', // 'assistant' or 'agent-setup'
  onComplete,
  isDarkMode = false,
  position = 'bottom-left', // 'bottom-left', 'bottom-right', 'top-left', 'top-right', 'center'
  visible = false,
  onClose,
  questions = []
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFlow, setCurrentFlow] = useState('greeting'); // 'greeting', 'questions', 'instructions', 'followup'
  const [userAnswers, setUserAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(visible);
  const messagesEndRef = useRef(null);

  const theme = {
    bgcolor: '#333333',
    color: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
    messageBg: 'rgba(255, 255, 255, 0.1)',
    aiMessageBg: 'rgba(74, 144, 226, 0.2)',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    // Only add initial greeting if no messages exist
    if (messages.length === 0) {
      addMessage('ai', "Hi! I'm your assistant. I can help you with onboarding questions or guide you through connecting your agent. How can I help you today?");
    }
  }, []);

  useEffect(() => {
    const handleOpenChat = (event) => {
      if (event.detail.mode === mode && event.detail.message) {
        // Add the user's message
        const userMessage = {
          id: Date.now() + Math.random(),
          sender: 'user',
          content: event.detail.message,
          type: 'text',
          metadata: {},
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Simulate AI response
        setTimeout(() => {
          const aiMessage = {
            id: Date.now() + Math.random(),
            sender: 'ai',
            content: mode === 'assistant' 
              ? "I'm here to help you with your onboarding! Let me know what specific questions you have about using Handit or setting up your agents."
              : "Thanks for your message! I'll help you with agent setup. Let me know what you'd like to know about connecting your agent.",
            type: 'text',
            metadata: {},
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        }, 1000);
      }
    };

    window.addEventListener('openOnboardingChat', handleOpenChat);
    return () => {
      window.removeEventListener('openOnboardingChat', handleOpenChat);
    };
  }, [mode]);



  const addMessage = (sender, content, type = 'text', metadata = {}) => {
    const message = {
      id: Date.now() + Math.random(),
      sender,
      content,
      type,
      metadata,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);

    // Handle both assistant and agent setup in the same flow
    if (currentFlow === 'greeting' || currentFlow === 'questions' || currentFlow === 'instructions' || currentFlow === 'followup') {
      // We're in agent setup mode regardless of the original mode
      await handleAgentSetupFlow(userMessage);
    } else {
      // Regular assistant conversation
      await handleAssistantFlow(userMessage);
    }
  };

  const handleAgentSetupFlow = async (userMessage) => {
    setIsLoading(true);

    try {
      switch (currentFlow) {
        case 'greeting':
          if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('ready') || userMessage.toLowerCase().includes('start')) {
            addMessage('ai', questions[0].question);
            setCurrentFlow('questions');
          } else {
            addMessage('ai', "No problem! When you're ready to connect your agent, just let me know. I'll guide you through the whole process step by step.");
          }
          break;

        case 'questions':
          const currentQuestion = questions[questionIndex];
          setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: userMessage }));
          
          if (questionIndex < questions.length - 1) {
            setQuestionIndex(questionIndex + 1);
            setTimeout(() => {
              addMessage('ai', questions[questionIndex + 1].question);
            }, 500);
          } else {
            // All questions answered, provide instructions
            setCurrentFlow('instructions');
            setTimeout(() => {
              generateInstructions({ ...userAnswers, [currentQuestion.id]: userMessage });
            }, 500);
          }
          break;

        case 'instructions':
        case 'followup':
          // Handle follow-up questions
          addMessage('ai', "Great question! Before we dive into that, please make sure you've followed the setup instructions above. Once your agent is connected, I'll be happy to help with any additional questions you might have!");
          break;
      }
    } catch (error) {
      addMessage('ai', "I'm sorry, I encountered an error. Please try again or check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssistantFlow = async (userMessage) => {
    setIsLoading(true);
    
    try {
      // Check if user wants to connect an agent
      const isAgentConnectionRequest = userMessage.toLowerCase().includes('connect') && 
        (userMessage.toLowerCase().includes('agent') || userMessage.toLowerCase().includes('setup'));
        
      if (isAgentConnectionRequest) {
        // Start agent setup flow
        addMessage('ai', "Great! I'll help you connect your agent to Handit. I'll ask you a few questions to provide personalized setup instructions. Ready to get started?");
        setCurrentFlow('greeting');
      } else {
        // Regular assistant response
        addMessage('ai', "I'm here to help you with your onboarding! Feel free to ask me anything about using Handit or setting up your agents.");
      }
    } catch (error) {
      addMessage('ai', "I'm sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateInstructions = (answers) => {
    const { framework, language, environment } = answers;
    
    addMessage('ai', `Perfect! Based on your answers (${framework}, ${language}, ${environment}), here are your personalized setup instructions:`);
    
    // Installation instructions
    setTimeout(() => {
      addMessage('ai', "**Step 1: Install the Handit SDK**", 'instruction', {
        code: `npm install handit-sdk`,
        copyText: `npm install handit-sdk`
      });
    }, 1000);

    // Configuration instructions
    setTimeout(() => {
      addMessage('ai', "**Step 2: Configure your agent**", 'instruction', {
        code: `import { HanditAgent } from 'handit-sdk';

const agent = new HanditAgent({
  apiKey: 'your-api-key-here',
  agentId: 'your-agent-id',
  environment: '${environment.toLowerCase()}'
});`,
        copyText: `import { HanditAgent } from 'handit-sdk';

const agent = new HanditAgent({
  apiKey: 'your-api-key-here',
  agentId: 'your-agent-id',
  environment: '${environment.toLowerCase()}'
});`
      });
    }, 2000);

    // Usage instructions
    setTimeout(() => {
      addMessage('ai', "**Step 3: Start tracking**", 'instruction', {
        code: `// Initialize the agent
await agent.initialize();

// Track your first event
agent.track('user_action', {
  action: 'button_click',
  component: 'signup_form'
});`,
        copyText: `// Initialize the agent
await agent.initialize();

// Track your first event
agent.track('user_action', {
  action: 'button_click',
  component: 'signup_form'
});`
      });
    }, 3000);

    setTimeout(() => {
      addMessage('ai', "That's it! Once you've followed these steps, use the 'Check Connection' button below to verify everything is working. If you need any help or have questions, just ask!");
      setCurrentFlow('followup');
    }, 4000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderMessage = (message) => {
    const isAi = message.sender === 'ai';
    
    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isAi ? 'flex-start' : 'flex-end',
          mb: 1,
          alignItems: 'flex-start',
          gap: 1
        }}
      >
        {isAi && (
          <Box
            sx={{
              bgcolor: '#4A90E2',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.5
            }}
          >
            <Robot size={16} color="white" />
          </Box>
        )}
        
        <Paper
          sx={{
            p: 1.5,
            maxWidth: '70%',
            bgcolor: isAi ? theme.aiMessageBg : theme.messageBg,
            borderRadius: isAi ? '20px 20px 20px 8px' : '20px 20px 8px 20px',
            color: theme.color,
            wordBreak: 'break-word'
          }}
        >
          {message.type === 'instruction' && message.metadata.code ? (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {message.content}
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: 1,
                  position: 'relative',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  overflow: 'auto'
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {message.metadata.code}
                </pre>
                <Tooltip title="Copy code">
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(message.metadata.copyText)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <Copy size={14} />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Typography>
          )}
        </Paper>
        
        {!isAi && (
          <Box
            sx={{
              bgcolor: '#666666',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.5
            }}
          >
            <User size={16} color="white" />
          </Box>
        )}
      </Box>
    );
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'checking': return 'info';
      case 'error': return 'error';
      default: return 'warning';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'checking': return 'Checking...';
      case 'error': return 'Connection Error';
      default: return 'Not Connected';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle size={16} />;
      case 'checking': return <CircularProgress size={16} />;
      case 'error': return <XCircle size={16} />;
      default: return <Warning size={16} />;
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return {
          bottom: 20,
          left: 20,
        };
      case 'bottom-right':
        return {
          bottom: 20,
          right: 20,
        };
      case 'top-left':
        return {
          top: 20,
          left: 20,
        };
      case 'top-right':
        return {
          top: 20,
          right: 20,
        };
      case 'center':
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      default:
        return {
          bottom: 20,
          left: 20,
        };
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 10000,
        ...getPositionStyles(),
        width: 520,
        height: 600,
        borderRadius: '5px',
      }}
    >
              <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.bgcolor,
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
            borderRadius: '5px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
        {/* Header */}
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.color,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            Handit Assistant
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: theme.color,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>
              {/* Chat Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
          }}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
              <Box
                sx={{
                  bgcolor: '#4A90E2',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Robot size={16} color="white" />
              </Box>
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: theme.aiMessageBg,
                  borderRadius: '20px 20px 20px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2" sx={{ color: theme.color }}>
                  Thinking...
                </Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Connection Status (when in agent setup flow) */}
        {(currentFlow === 'instructions' || currentFlow === 'followup') && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.borderColor}` }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={getConnectionStatusIcon()}
                label={getConnectionStatusText()}
                color={getConnectionStatusColor()}
                variant="outlined"
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                onClick={onConnectionCheck}
                disabled={connectionStatus === 'checking'}
                sx={{
                  bgcolor: '#4A90E2',
                  '&:hover': {
                    bgcolor: '#357ABD'
                  }
                }}
              >
                Check Connection
              </Button>
            </Stack>
          </Box>
        )}

        {/* Chat Input */}
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.borderColor}` }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentFlow === 'questions' 
                  ? questions[questionIndex]?.placeholder || "Type your answer..."
                  : "Ask me anything..."
              }
              variant="outlined"
              size="small"
              disabled={isLoading}
              sx={{
                borderRadius: '5px',
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.inputBg,
                  borderRadius: '5px',
                  '& fieldset': { borderColor: theme.borderColor },
                  '&:hover fieldset': { borderColor: theme.borderColor },
                  '&.Mui-focused fieldset': { borderColor: '#4A90E2' },
                },
                '& .MuiOutlinedInput-input': {
                  color: theme.color,
                  fontSize: '0.875rem',
                  py: 0.8,
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      size="small"
                      disabled={!inputValue.trim() || isLoading}
                      sx={{
                        color: inputValue.trim() && !isLoading ? '#4A90E2' : theme.borderColor,
                        '&:hover': {
                          bgcolor: 'rgba(74, 144, 226, 0.1)'
                        }
                      }}
                    >
                      <PaperPlaneTilt size={16} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default OnboardingChat; 