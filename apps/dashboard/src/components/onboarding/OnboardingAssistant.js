import React, { useState } from 'react';
import {
  Box,
  Card,
  IconButton,
  Typography,
  Button,
  Stack,
  Fade,
} from '@mui/material';
import {
  ArrowLeft,
  ChatCircle,
  X as CloseIcon,
} from '@phosphor-icons/react';

const OnboardingAssistant = ({ 
  visible = true, 
  currentStep = 0, 
  totalSteps = 5, 
  onNext, 
  onPrevious, 
  onFinish,
  onOpenChat,
  onClose,
  stepTitle = "Install HandIt",
  position = "bottom-right"
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!visible) return null;

  const stepsLeft = totalSteps - currentStep - 1;
  const isLastStep = currentStep === totalSteps - 1;

  // Calculate position styles based on position prop
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-center':
        return {
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'bottom-left':
        return {
          bottom: 20,
          left: 20,
        };
      case 'bottom-right':
      default:
        return {
          bottom: 20,
          right: 20,
        };
    }
  };

  return (
    <Fade in={visible}>
      <Box
        sx={{
          position: 'fixed',
          zIndex: 9998,
          ...getPositionStyles(),
        }}
      >
        {!isMinimized ? (
          <Card
            sx={{
              bgcolor: '#333333',
              color: 'white',
              borderRadius: 3,
              overflow: 'hidden',
              minWidth: 360,
              maxWidth: 420,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Content */}
            <Box sx={{ p: 3 }}>
              {/* Title */}
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white', 
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                {stepTitle}
              </Typography>
              
              {/* Progress Dots */}
              <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3 
                }}
              >
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: index <= currentStep ? '#4A90E2' : '#666666',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                ))}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#999', 
                    ml: 2,
                    fontSize: '0.75rem'
                  }}
                >
                  {stepsLeft} steps left
                </Typography>
              </Stack>

              {/* Buttons */}
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Button
                  variant="text"
                  onClick={onOpenChat}
                  sx={{ 
                    color: '#999',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    minWidth: 'auto',
                    '&:hover': {
                      color: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Open Chat
                </Button>
                
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="text"
                    onClick={isLastStep ? onFinish : onNext}
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      px: 3,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    Next
                  </Button>
                  
                  <Button
                    variant="text"
                    onClick={onFinish}
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      px: 3,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                  >
                    Finish
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Card>
        ) : (
          // Minimized state
          <Card
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: (theme) => theme.shadows[4],
              border: '2px solid',
              borderColor: 'background.paper',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[8],
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease'
            }}
            onClick={() => setIsMinimized(false)}
          >
            <ChatCircle size={24} weight="fill" />
          </Card>
        )}
      </Box>
    </Fade>
  );
};

export default OnboardingAssistant; 