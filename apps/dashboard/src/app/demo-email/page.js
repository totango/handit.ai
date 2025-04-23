/**
 * Demo Email Generator Page Component
 * 
 * This component provides an interactive interface for generating business emails with:
 * - Real-time email generation
 * - Email quality evaluation
 * - Model optimization capabilities
 * - Chat-like interface
 * 
 * The page allows users to input their requirements and receive AI-generated
 * business emails with subject lines and content.
 */
'use client';

import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { PaperPlaneTilt, ArrowClockwise } from '@phosphor-icons/react';
import {
  useGenerateEmailMutation,
  useEvaluateEmailMutation,
  useGetInsightsMutation,
  useEnhancePromptMutation,
} from '@/services/demoEmailService';

/**
 * Main demo email generator page component
 * Provides an interactive interface for generating and optimizing business emails
 * @returns {JSX.Element} The email generator interface
 */
export default function DemoEmailPage() {
  // State management for messages and UI
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [isEnhancing, setIsEnhancing] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const [currentModelLogId, setCurrentModelLogId] = React.useState(null);
  const [isOptimized, setIsOptimized] = React.useState(false);
  const messageListRef = React.useRef(null);

  // API mutations
  const [generateEmail] = useGenerateEmailMutation();
  const [evaluateEmail] = useEvaluateEmailMutation();
  const [getInsights] = useGetInsightsMutation();
  const [enhancePrompt] = useEnhancePromptMutation();

  /**
   * Auto-scroll to bottom when new messages are added
   */
  React.useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /**
   * Handle input field changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * Handle Enter key press for message submission
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Reset the chat interface to initial state
   */
  const handleRestart = () => {
    setMessages([]);
    setInputValue('');
    setIsLoading(false);
    setIsEvaluating(false);
    setIsEnhancing(false);
    setIsGenerating(false);
    setIsComplete(false);
    setCurrentModelLogId(null);
  };

  /**
   * Process and send user message, generate email response
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

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

    try {
      // Generate email based on user input
      const { data: emailData, error: emailError } = await generateEmail({
        text: inputValue.trim(),
        optimized: isOptimized,
      });

      if (emailError) {
        throw new Error('Failed to generate email');
      }

      // Enable optimization after initial generation
      setTimeout(() => {
        setIsOptimized(true);
      }, 10000);

      // Add generated email to chat
      setMessages(prev => [...prev, {
        position: 'left',
        type: 'text',
        text: `Subject: ${emailData.subject}\n\n${emailData.message}`,
        date: new Date(),
      }]);

    } catch (error) {
      console.error('Error in message flow:', error);
      setMessages(prev => [...prev, {
        position: 'left',
        type: 'text',
        text: "Sorry, I encountered an error processing your request. Please try again.",
        date: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setIsEvaluating(false);
      setIsEnhancing(false);
      setIsGenerating(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: 2,
            backgroundColor: '#2C3E50',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Business Email Generator</Typography>
            {/* Optimization Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={isOptimized}
                  onChange={(e) => setIsOptimized(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-thumb': {
                      backgroundColor: 'white',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '& .Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'inherit' }}>
                  {isOptimized ? 'Optimized' : 'Based'}
                </Typography>
              }
              sx={{ color: 'inherit' }}
            />
          </Stack>
          {/* Restart Button */}
          {isComplete && (
            <Button
              startIcon={<ArrowClockwise />}
              onClick={handleRestart}
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Restart
            </Button>
          )}
        </Box>

        {/* Messages Section */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: '#F5F6FA' }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: msg.position === 'right' ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  backgroundColor: msg.position === 'right' ? '#3498DB' : 'white',
                  color: msg.position === 'right' ? 'white' : '#2C3E50',
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1,
                    opacity: msg.position === 'right' ? 0.8 : 0.6,
                    color: msg.position === 'right' ? 'white' : '#2C3E50',
                  }}
                >
                  {new Date(msg.date).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}
          {/* Loading Indicator */}
          {(isLoading || isEvaluating || isEnhancing || isGenerating) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={20} sx={{ color: '#3498DB' }} />
                <Typography variant="body2" color="#2C3E50">
                  {isLoading ? 'Generating email...' :
                    isEvaluating ? 'Reviewing email quality...' :
                      isEnhancing ? 'Enhancing model...' :
                        'Generating enhanced email...'}
                </Typography>
              </Stack>
            </Box>
          )}
          <div ref={messageListRef} />
        </Box>

        {/* Input Section */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: '#E0E0E0', backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your email request..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isEvaluating || isEnhancing || isGenerating || isComplete}
              multiline
              maxRows={3}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#3498DB',
                  },
                  '& input': {
                    color: 'black',
                  },
                },
                '& .Mui-focused fieldset': {
                  borderColor: '#3498DB',
                },
                '& .MuiInputBase-input': {
                  color: 'black',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isEvaluating || isEnhancing || isGenerating || isComplete}
              sx={{
                minWidth: 'auto',
                px: 2,
                backgroundColor: '#3498DB',
                '&:hover': {
                  backgroundColor: '#2980B9',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#BDC3C7',
                }
              }}
            >
              <PaperPlaneTilt weight="fill" />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 