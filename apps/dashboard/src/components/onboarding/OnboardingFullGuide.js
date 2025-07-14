import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  X,
  Copy,
  Code,
  CheckCircle,
  ArrowRight,
} from '@phosphor-icons/react';
import CodeRenderer from './CodeRenderer';

const OnboardingFullGuide = ({ visible, onClose, content = '' }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    const handleShowGuide = (event) => {
      setIsVisible(true);
    };

    window.addEventListener('onboarding:show-full-guide', handleShowGuide);
    return () => {
      window.removeEventListener('onboarding:show-full-guide', handleShowGuide);
    };
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };



  const handleTestConnection = () => {
    // Close the guide
    setIsVisible(false);
    onClose?.();
    
    // Trigger the test connection step
    window.dispatchEvent(new CustomEvent('onboarding:test-connection-clicked'));
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const renderGuideContent = () => {
    if (!content) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No guide content available
          </Typography>
        </Box>
      );
    }

    // Parse content for code blocks and sections
    const sections = content.split('\n\n');
    
    return (
      <Box>
        {sections.map((section, index) => {
          // Check if section contains code (simplified detection)
          if (section.includes('```')) {
            const codeMatch = section.match(/```(\w+)?\n([\s\S]*?)\n?```/);
            if (codeMatch) {
              const language = codeMatch[1] || 'javascript';
              const code = codeMatch[2];
              const description = section.replace(/```[\s\S]*?```/, '').trim();
              
              return (
                <Box key={index} sx={{ mb: 3 }}>
                  {description && (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {description}
                    </Typography>
                  )}
                  <Box sx={{ position: 'relative' }}>
                    <Paper
                      sx={{
                        overflow: 'hidden',
                        bgcolor: '#1e1e1e',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <CodeRenderer
                        code={code}
                        language={language}
                        showLineNumbers={true}
                      />
                    </Paper>
                    <Tooltip title="Copy code">
                      <IconButton
                        onClick={() => copyToClipboard(code)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.8)'
                          }
                        }}
                      >
                        <Copy size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              );
            }
          }
          
          // Regular text section
          if (section.trim()) {
            return (
              <Typography key={index} variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                {section}
              </Typography>
            );
          }
          
          return null;
        })}
      </Box>
    );
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={handleClose}
      />
      
      {/* Guide Modal */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" fontWeight="600">
            🚀 Agent Setup Guide
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            px: 3,
            py: 2,
            pb: 10, // Extra padding for fixed button
          }}
        >
          {/* AI Assistant Response Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle size={20} color="#4A90E2" />
              AI Assistant Response
            </Typography>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              {renderGuideContent()}
            </Paper>
          </Box>

          {/* Step-by-step Setup Guide */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ArrowRight size={20} color="#4A90E2" />
              Step-by-Step Setup
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Step 1 */}
              <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                  1. Install the Handit SDK
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add monitoring to your agent with our lightweight SDK
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <CodeRenderer
                    code="npm install handit-sdk"
                    language="bash"
                    showLineNumbers={false}
                  />
                  <Tooltip title="Copy command">
                    <IconButton
                      onClick={() => copyToClipboard('npm install handit-sdk')}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        width: 24,
                        height: 24,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                      }}
                    >
                      <Copy size={12} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>

              {/* Step 2 */}
              <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                  2. Initialize Monitoring
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add the monitoring code to your agent and configure tracking
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <CodeRenderer
                    code={`import { HandIt } from '@handit/sdk';

const handit = new HandIt({
  apiKey: 'your-api-key',
  projectId: 'your-project-id'
});

// Track your AI calls
const response = await handit.track('agent-call', {
  input: userQuery,
  model: 'gpt-4',
  function: yourAIFunction
});`}
                    language="javascript"
                    showLineNumbers={false}
                  />
                  <Tooltip title="Copy code">
                    <IconButton
                      onClick={() => copyToClipboard(`import { HandIt } from '@handit/sdk';

const handit = new HandIt({
  apiKey: 'your-api-key',
  projectId: 'your-project-id'
});

// Track your AI calls
const response = await handit.track('agent-call', {
  input: userQuery,
  model: 'gpt-4',
  function: yourAIFunction
});`)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        width: 24,
                        height: 24,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                      }}
                    >
                      <Copy size={12} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>

              {/* Step 3 */}
              <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                  3. Test Connection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use the "Test Connection" button below to verify your setup is working
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* Fixed Bottom Actions */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ minWidth: 100 }}
          >
            Close
          </Button>
          
          <Button
            variant="contained"
            onClick={handleTestConnection}
            data-testid="guide-test-connection-button"
            sx={{
              bgcolor: '#4A90E2',
              '&:hover': { bgcolor: '#357ABD' },
              minWidth: 140,
            }}
          >
            Test Connection
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default OnboardingFullGuide; 