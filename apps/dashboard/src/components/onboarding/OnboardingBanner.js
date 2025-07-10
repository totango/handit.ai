import React, { useState, useEffect } from 'react';
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
  Eye,
  EyeSlash,
} from '@phosphor-icons/react';

const OnboardingBanner = ({ 
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
  icon,
}) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  useEffect(() => {
    if (autoHide && visible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [visible, autoHide, autoHideDelay]);

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
        }}
      >
        <Grow in={visible} timeout={300}>
          <Card
            sx={{
              ...variantStyles,
              borderRadius: 2,
              border: `1px solid ${variantStyles.borderColor}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              position: 'relative',
              ...arrowStyles,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {icon && (
                    <Box sx={{ mr: 1, fontSize: '1.2rem' }}>
                      {icon}
                    </Box>
                  )}
                  {title && (
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                      {title}
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
                {message}
              </Typography>

              {/* Action Buttons */}
              {actions.length > 0 && (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.type === 'primary' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={action.onClick}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        ...(action.type === 'primary' ? {
                          bgcolor: '#42a5f5',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#1976d2'
                          }
                        } : {
                          color: '#42a5f5',
                          borderColor: '#42a5f5',
                          '&:hover': {
                            bgcolor: 'rgba(66, 165, 245, 0.1)',
                            borderColor: '#1976d2'
                          }
                        })
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
};

// Hook for managing multiple banners
export const useOnboardingBanners = () => {
  const [banners, setBanners] = useState([]);

  const showBanner = (banner) => {
    const id = Date.now() + Math.random();
    setBanners(prev => [...prev, { ...banner, id, open: true }]);
    return id;
  };

  const hideBanner = (id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  };

  const hideAllBanners = () => {
    setBanners([]);
  };

  const BannerContainer = () => (
    <>
      {banners.map(banner => (
        <OnboardingBanner
          key={banner.id}
          {...banner}
          onClose={() => hideBanner(banner.id)}
        />
      ))}
    </>
  );

  return {
    showBanner,
    hideBanner,
    hideAllBanners,
    BannerContainer
  };
};

export default OnboardingBanner; 