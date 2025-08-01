import React, { useState, useEffect, useRef } from 'react';
import StableBannerContainer from './StableBannerContainer';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Fade,
  Grow,
  Button,
  Stack,
} from '@mui/material';
import {
  X as CloseIcon,
} from '@phosphor-icons/react';

  // Custom hook for typing animation
  const useTypingAnimation = (text, speed = 30, startDelay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsTyping(false);
    setIsComplete(false);

    const startTimer = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return { displayedText, isTyping, isComplete };
};

const OnboardingBanner = React.memo(({ 
  open,
  onClose,
  title,
  message,
  position = { top: 100, left: 300 },
  autoHide = false,
  autoHideDelay = 5000,
  variant = 'info', // 'info', 'warning', 'success', 'error'
  arrow = 'none', // 'top', 'bottom', 'left', 'right', 'none'
  actions = [], // Array of action buttons
  showCloseButton = true,
  typingSpeed = 30, // Speed of typing animation in milliseconds
}) => {
  const [visible, setVisible] = useState(open);
  
  // Typing animations for title and message
  const titleTyping = useTypingAnimation(title, typingSpeed, 0);
  const messageTyping = useTypingAnimation(message, typingSpeed, title ? 150 : 0); // Delay message if title exists

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (autoHide && visible && messageTyping.isComplete) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHide, autoHideDelay, messageTyping.isComplete]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 200);
  };

  const getVariantStyles = () => {
    const variants = {
      info: {
        bgcolor: '#2a2a2a',
        borderColor: '#42a5f5',
        color: 'white'
      },
      warning: {
        bgcolor: '#2a2a2a',
        borderColor: '#ff9800',
        color: 'white'
      },
      success: {
        bgcolor: '#2a2a2a',
        borderColor: '#4caf50',
        color: 'white'
      },
      error: {
        bgcolor: '#2a2a2a',
        borderColor: '#f44336',
        color: 'white'
      }
    };
    return variants[variant] || variants.info;
  };

  const getArrowStyles = () => {
    const arrowSize = 8;
    const arrowStyles = {
      top: {
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid ${getVariantStyles().bgcolor}`,
        }
      },
      bottom: {
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid ${getVariantStyles().bgcolor}`,
        }
      },
      left: {
        '&::before': {
          content: '""',
          position: 'absolute',
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid ${getVariantStyles().bgcolor}`,
        }
      },
      right: {
        '&::before': {
          content: '""',
          position: 'absolute',
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid ${getVariantStyles().bgcolor}`,
        }
      },
      none: {}
    };
    return arrowStyles[arrow] || {};
  };

  if (!open && !visible) return null;

  const variantStyles = getVariantStyles();
  const arrowStyles = getArrowStyles();

  return (
    <Fade in={visible} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          transform: position.transform,
          zIndex: 9997,
          maxWidth: 400,
          borderRadius: 1.5,
        }}
      >
        <Grow in={visible} timeout={300}>
          <Card
            sx={{
              ...variantStyles,
              borderRadius: 1.5,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              position: 'relative',
              ...arrowStyles,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {title && (
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                      {titleTyping.displayedText}
                      {titleTyping.isTyping && (
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            width: '2px',
                            height: '1.2em',
                            backgroundColor: 'white',
                            marginLeft: '2px',
                            animation: 'blink 1s infinite',
                            '@keyframes blink': {
                              '0%, 50%': { opacity: 1 },
                              '51%, 100%': { opacity: 0 }
                            }
                          }}
                        />
                      )}
                    </Typography>
                  )}
                </Box>
                {showCloseButton && (
                  <IconButton
                    onClick={handleClose}
                    sx={{ 
                      color: '#888', 
                      p: 0.5,
                      ml: 1,
                      borderRadius: 1.5,
                      '&:hover': {
                        color: 'white'
                      }
                    }}
                    size="small"
                  >
                    <CloseIcon size={16} />
                  </IconButton>
                )}
              </Box>
              
              <Typography variant="body2" sx={{ color: '#ccc', lineHeight: 1.4, mb: actions.length > 0 ? 2 : 0 }}>
                {messageTyping.displayedText}
                {messageTyping.isTyping && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '2px',
                      height: '1.2em',
                      backgroundColor: '#ccc',
                      marginLeft: '2px',
                      animation: 'blink 1s infinite',
                      '@keyframes blink': {
                        '0%, 50%': { opacity: 1 },
                        '51%, 100%': { opacity: 0 }
                      }
                    }}
                  />
                )}
              </Typography>

              {/* Action Buttons - Only show when message typing is complete */}
              {actions.length > 0 && messageTyping.isComplete && (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="text"
                      size="small"
                      onClick={action.onClick}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        color: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        px: 2,
                        borderRadius: 1.5,
                        py: 0.5,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white'
                        },
                        '&:focus': {
                          bgcolor: 'rgba(255, 255, 255, 0.15)'
                        }
                      }}
                    >
                      {action.text}
                    </Button>
                  ))}
                </Stack>
              )}
            </Box>
          </Card>
        </Grow>
      </Box>
    </Fade>
  );
}, (prevProps, nextProps) => {
  // Only re-render if essential props change
  return (
    prevProps.open === nextProps.open &&
    prevProps.title === nextProps.title &&
    prevProps.message === nextProps.message &&
    prevProps.variant === nextProps.variant &&
    prevProps.position?.top === nextProps.position?.top &&
    prevProps.position?.left === nextProps.position?.left &&
    prevProps.autoHide === nextProps.autoHide &&
    prevProps.actions?.length === nextProps.actions?.length
  );
});

// Hook for managing multiple banners
export const useOnboardingBanners = () => {
  const [banners, setBanners] = useState([]);
  const bannersRef = useRef([]);
  const [renderKey, setRenderKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef(null);

  // Listen for loading state changes
  useEffect(() => {
    const handleLoadingStateChange = (event) => {
      const { loading } = event.detail;
      
      if (loading) {
        // Clear any existing timeout
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        setIsLoading(true);
      } else {
        // Delay setting loading to false to prevent flicker
        loadingTimeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    };

    window.addEventListener('onboarding:loading-state-change', handleLoadingStateChange);
    return () => {
      window.removeEventListener('onboarding:loading-state-change', handleLoadingStateChange);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Update both state and ref when banners change
  const updateBanners = (newBanners) => {
    bannersRef.current = newBanners;
    setBanners(newBanners);
  };

  const showBanner = (banner) => {
    const id = Date.now() + Math.random();
    const newBanners = [...bannersRef.current, { ...banner, id, open: true }];
    updateBanners(newBanners);
    return id;
  };

  const hideBanner = (id) => {
    const newBanners = bannersRef.current.filter(banner => banner.id !== id);
    updateBanners(newBanners);
  };

  const hideAllBanners = () => {
    updateBanners([]);
  };

  // Force re-render without changing banner content
  const forceRender = () => {
    setRenderKey(prev => prev + 1);
  };

  const BannerContainer = React.memo(() => (
    <StableBannerContainer
      banners={bannersRef.current}
      onCloseBanner={hideBanner}
    />
  ));

  return {
    showBanner,
    hideBanner,
    hideAllBanners,
    forceRender,
    BannerContainer
  };
};

export default OnboardingBanner; 