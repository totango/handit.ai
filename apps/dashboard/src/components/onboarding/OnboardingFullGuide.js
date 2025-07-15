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
  Chip,
} from '@mui/material';
import {
  X,
  Copy,
  Code,
  CheckCircle,
  ArrowRight,
  Key,
} from '@phosphor-icons/react';
import CodeRenderer from './CodeRenderer';
import { useGetUserQuery } from '../../services/auth/authService';

const OnboardingFullGuide = ({ visible, onClose, content = '' }) => {
  const [isVisible, setIsVisible] = useState(visible);
  const { data: userData } = useGetUserQuery();
  
  // Get current environment
  const environment = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('environment') || 'production';
    }
    return 'production';
  }, []);

  // Get the appropriate API token based on environment
  const apiToken = React.useMemo(() => {
    if (environment === 'staging') {
      return userData?.company?.stagingApiToken;
    }
    return userData?.company?.apiToken;
  }, [environment, userData?.company]);

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

  const renderMarkdownContent = (markdownContent) => {
    if (!markdownContent) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No setup guide available
        </Typography>
      );
    }

    const elements = [];
    let lastIndex = 0;

    // Parse markdown content
    const lines = markdownContent.split('\n');
    let currentSection = [];
    
    lines.forEach((line, index) => {
      // Handle headers (# ## ###)
      const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headerMatch) {
        // Add previous section if exists
        if (currentSection.length > 0) {
          elements.push(
            <Typography key={`section-${elements.length}`} variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {currentSection.join('\n')}
            </Typography>
          );
          currentSection = [];
        }

        const level = headerMatch[1].length;
        const text = headerMatch[2];
        const variant = level === 1 ? 'h5' : level === 2 ? 'h6' : 'subtitle1';
        
        elements.push(
          <Typography 
            key={`header-${elements.length}`} 
            variant={variant} 
            fontWeight="600" 
            sx={{ mt: elements.length > 0 ? 3 : 0, mb: 2, color: '#4A90E2' }}
          >
            {text}
          </Typography>
        );
        return;
      }

      // Handle code blocks
      if (line.startsWith('```')) {
        // Add previous section if exists
        if (currentSection.length > 0) {
          elements.push(
            <Typography key={`section-${elements.length}`} variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {currentSection.join('\n')}
            </Typography>
          );
          currentSection = [];
        }

        // Find end of code block
        const language = line.substring(3).trim() || 'text';
        const codeLines = [];
        let codeIndex = index + 1;
        
        while (codeIndex < lines.length && !lines[codeIndex].startsWith('```')) {
          codeLines.push(lines[codeIndex]);
          codeIndex++;
        }

        if (codeLines.length > 0) {
          const code = codeLines.join('\n');
          elements.push(
            <Box key={`code-${elements.length}`} sx={{ mb: 3, position: 'relative' }}>
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
                  showLineNumbers={false}
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
                    width: 24,
                    height: 24,
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                  }}
                >
                  <Copy size={12} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        }
        
        // Skip to after the closing ```
        return;
      }

      // Regular text line
      if (line.trim() || currentSection.length > 0) {
        currentSection.push(line);
      }
    });

    // Add final section if exists
    if (currentSection.length > 0) {
      elements.push(
        <Typography key={`section-${elements.length}`} variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {currentSection.join('\n')}
        </Typography>
      );
    }

    return <Box>{elements}</Box>;
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
          zIndex: 100,
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
          {/* API Token Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Key size={20} color="#4A90E2" />
              Your API Token
              <Chip 
                label={environment === 'staging' ? 'Staging' : 'Production'} 
                size="small" 
                color={environment === 'staging' ? 'warning' : 'primary'} 
                variant="outlined"
              />
            </Typography>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
                position: 'relative',
              }}
            >
              {apiToken ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Use this API token in your agent configuration:
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <CodeRenderer
                      code={apiToken}
                      language="text"
                      showLineNumbers={false}
                    />
                    <Tooltip title="Copy API token">
                      <IconButton
                        onClick={() => copyToClipboard(apiToken)}
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
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  API token not available. Please check your account settings.
                </Typography>
              )}
            </Paper>
          </Box>

          {/* AI Assistant Guide Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle size={20} color="#4A90E2" />
              Setup Guide
            </Typography>
            <Paper
              sx={{
                p: 3,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              {renderMarkdownContent(content)}
            </Paper>
          </Box>

          {/* Test Connection Step */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ArrowRight size={20} color="#4A90E2" />
              Test Your Connection
            </Typography>
            <Paper sx={{ p: 2, border: '1px solid', borderColor: 'grey.200' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Once you've followed the setup guide above and integrated the API token, use the "Test Connection" button below to verify everything is working correctly.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This will check if your agent can successfully communicate with Handit's monitoring system.
              </Typography>
            </Paper>
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
            variant="outlined"
            onClick={handleTestConnection}
            data-testid="guide-test-connection-button"
            sx={{
              bgcolor: 'primary.main',
              color: 'black',
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