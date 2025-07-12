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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Code,
} from '@phosphor-icons/react';
import CodeRenderer from './CodeRenderer';

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

  const [isVisible, setIsVisible] = useState(visible);
  const [sessionId, setSessionId] = useState(null);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeModalContent, setCodeModalContent] = useState('');
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
      addMessage('ai', "Hi! I'm your Handit assistant. I can help you with onboarding questions, guide you through connecting your agent, or answer any questions about using Handit. How can I help you today?");
    }
  }, []);

  useEffect(() => {
    const handleOpenChat = async (event) => {
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
        
                 // Call AI agent with the message
         setIsLoading(true);
         try {
           const aiResponse = await callAIAgent(event.detail.message);
           const processedResponse = processAIResponse(aiResponse);
           
           addMessage('ai', processedResponse.content, processedResponse.type, processedResponse.metadata);
         } catch (error) {
           addMessage('ai', "I'm sorry, I encountered an error. Please try again or check your connection.");
         } finally {
           setIsLoading(false);
         }
      }
    };

    window.addEventListener('openOnboardingChat', handleOpenChat);
    return () => {
      window.removeEventListener('openOnboardingChat', handleOpenChat);
    };
  }, [mode, sessionId]);



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

  const parseMarkdownCodeBlocks = (content) => {
    // Regex to match code blocks with language specification
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'text',
        code: match[2].trim()
      });
    }
    
    return codeBlocks;
  };

  const processAIResponse = (response) => {
    const content = response.answer || response.response || response.message;
    
    // Check if response has explicit code property
    if (response.hasCode || response.code) {
      return {
        content,
        type: 'code',
        metadata: {
          code: response.code,
          language: response.language || 'javascript'
        }
      };
    }
    
    // Check for markdown code blocks
    const codeBlocks = parseMarkdownCodeBlocks(content);
    if (codeBlocks.length > 0) {
      return {
        content,
        type: 'markdown-with-code',
        metadata: {
          codeBlocks
        }
      };
    }
    
    // Regular text response
    return {
      content,
      type: 'text',
      metadata: {}
    };
  };

  const callAIAgent = async (question) => {
    try {
      const aiApiUrl = process.env.NEXT_PUBLIC_AI_AGENT_URL || 'http://localhost:3006/api/ai/chat';
      
      const response = await fetch(aiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          sessionId: sessionId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store sessionId from first response
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      return data;
    } catch (error) {
      console.error('Error calling AI agent:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage('user', userMessage);

    setIsLoading(true);
    
    try {
      const aiResponse = await callAIAgent(userMessage);
      const processedResponse = processAIResponse(aiResponse);
      
      addMessage('ai', processedResponse.content, processedResponse.type, processedResponse.metadata);
    } catch (error) {
      addMessage('ai', "I'm sorry, I encountered an error. Please try again or check your connection.");
    } finally {
      setIsLoading(false);
    }
  };



  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openCodeModal = (code) => {
    setCodeModalContent(code);
    setCodeModalOpen(true);
  };

  const renderMarkdownWithCode = (content, codeBlocks) => {
    // Split content by code blocks to render markdown and code separately
    const parts = [];
    let lastIndex = 0;
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let codeBlockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textPart = content.substring(lastIndex, match.index);
        parts.push({
          type: 'text',
          content: textPart,
          key: `text-${parts.length}`
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        content: codeBlocks[codeBlockIndex],
        key: `code-${codeBlockIndex}`
      });

      lastIndex = match.index + match[0].length;
      codeBlockIndex++;
    }

    // Add remaining text after last code block
    if (lastIndex < content.length) {
      const textPart = content.substring(lastIndex);
      parts.push({
        type: 'text',
        content: textPart,
        key: `text-${parts.length}`
      });
    }

    return parts.map((part) => {
      if (part.type === 'text') {
        return (
          <Typography 
            key={part.key}
            variant="body2" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              mb: 1,
              '& strong': { fontWeight: 600 },
              '& em': { fontStyle: 'italic' }
            }}
          >
            {part.content.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')}
          </Typography>
        );
      } else {
                 return (
           <Box
             key={part.key}
             sx={{
               position: 'relative',
               maxHeight: '200px',
               overflow: 'auto',
               borderRadius: 1,
               mb: 2,
               '& pre': {
                 margin: '0 !important',
               }
             }}
           >
             <CodeRenderer
               code={part.content.code}
               language={part.content.language}
               showLineNumbers={false}
             />
             <Box
               sx={{
                 position: 'absolute',
                 top: 8,
                 right: 8,
                 display: 'flex',
                 gap: 1
               }}
             >
               <Tooltip title="Copy code">
                 <IconButton
                   size="small"
                   onClick={() => copyToClipboard(part.content.code)}
                   sx={{
                     bgcolor: 'rgba(0, 0, 0, 0.3)',
                     color: 'white',
                     '&:hover': {
                       bgcolor: 'rgba(0, 0, 0, 0.5)'
                     }
                   }}
                 >
                   <Copy size={14} />
                 </IconButton>
               </Tooltip>
               <Tooltip title="Open in modal">
                 <IconButton
                   size="small"
                   onClick={() => openCodeModal(part.content.code)}
                   sx={{
                     bgcolor: 'rgba(0, 0, 0, 0.3)',
                     color: 'white',
                     '&:hover': {
                       bgcolor: 'rgba(0, 0, 0, 0.5)'
                     }
                   }}
                 >
                   <Code size={14} />
                 </IconButton>
               </Tooltip>
             </Box>
           </Box>
        );
      }
    });
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
          {(message.type === 'instruction' || message.type === 'code') && message.metadata.code ? (
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {message.content}
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  maxHeight: '200px',
                  overflow: 'auto',
                  borderRadius: 1,
                  '& pre': {
                    margin: '0 !important',
                  }
                }}
              >
                <CodeRenderer
                  code={message.metadata.code}
                  language={message.metadata.language || 'javascript'}
                  showLineNumbers={false}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <Tooltip title="Copy code">
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(message.metadata.code)}
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }}
                    >
                      <Copy size={14} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Open in modal">
                    <IconButton
                      size="small"
                      onClick={() => openCodeModal(message.metadata.code)}
                      sx={{
                        bgcolor: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }}
                    >
                      <Code size={14} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ) : message.type === 'markdown-with-code' && message.metadata.codeBlocks ? (
            <Box>
              {renderMarkdownWithCode(message.content, message.metadata.codeBlocks)}
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
        zIndex: 10,
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

        {/* Connection Status */}
        {onConnectionCheck && (
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.borderColor}` }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={getConnectionStatusIcon()}
                label={getConnectionStatusText()}
                color={getConnectionStatusColor()}
                variant="outlined"
                sx={{ flex: 1, color: 'primary.main', borderRadius: '0px', borderColor: 'transparent' }}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={onConnectionCheck}
                disabled={connectionStatus === 'checking'}
                sx={{
                  borderColor: 'transparent',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                  backgroundColor: 'rgba(117,120,255, 0.2)',
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
              placeholder="Ask me anything..."
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

      {/* Code Modal */}
      <Dialog
        open={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: theme.bgcolor,
            color: theme.color,
            minHeight: '30vh',
            height: 'auto',
            maxHeight: '50vh',
            zIndex: 50
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.borderColor}`,
            color: theme.color
          }}
        >
          <Typography variant="h6">Code Preview</Typography>
          <IconButton
            onClick={() => setCodeModalOpen(false)}
            sx={{ color: theme.color }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              position: 'relative',
              minHeight: '400px',
              overflow: 'auto',
              '& pre': {
                margin: '0 !important',
                minHeight: '400px'
              }
            }}
          >
            <CodeRenderer
              code={codeModalContent}
              language="javascript"
              showLineNumbers={true}
            />
            <Tooltip title="Copy code">
              <IconButton
                onClick={() => copyToClipboard(codeModalContent)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.5)'
                  }
                }}
              >
                <Copy size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.borderColor}` }}>
          <Button
            onClick={() => copyToClipboard(codeModalContent)}
            startIcon={<Copy size={16} />}
            sx={{ color: theme.color }}
          >
            Copy Code
          </Button>
          <Button
            onClick={() => setCodeModalOpen(false)}
            variant="contained"
            sx={{
              bgcolor: '#4A90E2',
              '&:hover': {
                bgcolor: '#357ABD'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnboardingChat; 