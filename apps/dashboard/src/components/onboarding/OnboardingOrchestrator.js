import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Stack,
  Chip,
  IconButton,
} from '@mui/material';
import { X as CloseIcon, ArrowLeft, ArrowRight } from '@phosphor-icons/react';

import { 
  OnboardingMenu, 
  OnboardingAssistant, 
  useOnboardingBanners, 
  useInvisibleMouse 
} from './index';
import onboardingService from '../../services/onboarding/onboardingService';

const OnboardingOrchestrator = ({ 
  autoStart = false, 
  triggerOnMount = true,
  userState = {},
  onComplete = () => {},
  onSkip = () => {}
}) => {
  // Core state
  const [isActive, setIsActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [tourInfo, setTourInfo] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Component states
  const [assistantVisible, setAssistantVisible] = useState(false);
  const banners = useOnboardingBanners();
  const mouse = useInvisibleMouse();

  // Trigger highlighting when mouse targets a menu item
  const highlightMenuItem = (menuTitle) => {
    window.dispatchEvent(new CustomEvent('onboardingMouseTarget', {
      detail: { menuTitle }
    }));
  };

  // Remove highlighting when mouse leaves a menu item
  const unhighlightMenuItem = () => {
    window.dispatchEvent(new CustomEvent('onboardingMouseLeave'));
  };

  // Tour completion handler
  const handleTourComplete = useCallback(() => {
    setIsActive(false);
    setMenuOpen(false);
    setCurrentStep(null);
    setTourInfo(null);
    setAssistantVisible(false);
    
    // Remove any highlighting
    unhighlightMenuItem();
    
    // Hide mouse and banners
    mouse.hideMouse();
    banners.hideAllBanners();
    
    // Clear global onboarding flag
    window.__onboardingActive = false;
    window.dispatchEvent(new CustomEvent('onboardingStateChange', {
      detail: { active: false }
    }));
    
    onComplete();
  }, [mouse, banners, onComplete]);

  // Tour skip handler
  const handleTourSkip = useCallback(() => {
    setIsActive(false);
    setMenuOpen(false);
    setCurrentStep(null);
    setTourInfo(null);
    setAssistantVisible(false);
    
    // Remove any highlighting
    unhighlightMenuItem();
    
    // Hide mouse and banners
    mouse.hideMouse();
    banners.hideAllBanners();
    
    // Clear global onboarding flag
    window.__onboardingActive = false;
    window.dispatchEvent(new CustomEvent('onboardingStateChange', {
      detail: { active: false }
    }));
    
    onSkip();
  }, [mouse, banners, onSkip]);

  // Start onboarding flow
  const startOnboarding = useCallback((tourId = 'dashboard-tour') => {
    console.log('Starting onboarding with tour:', tourId);
    
    const step = onboardingService.startTour(tourId);
    
    if (step) {
      setCurrentStep(step);
      const tourInfo = onboardingService.getCurrentTourInfo();
      setTourInfo(tourInfo);
      setIsActive(true);
      
      // Show assistant if tour settings specify it
      if (tourInfo?.settings?.showAssistant) {
        setAssistantVisible(true);
      }
      
      // Set global onboarding flag for layout components
      window.__onboardingActive = true;
      window.dispatchEvent(new CustomEvent('onboardingStateChange', {
        detail: { active: true }
      }));
    }
  }, []); // Removed broadcastCompletedItems from dependencies since it doesn't use any state

  // Global flag to force navigation open only when assistant is visible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const showAssistant = assistantVisible || (currentStep && isActive);
      window.__onboardingActive = showAssistant;
      
      // Trigger a custom event so layout can listen for changes
      window.dispatchEvent(new CustomEvent('onboardingStateChange', { 
        detail: { active: showAssistant } 
      }));
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.__onboardingActive = false;
        window.dispatchEvent(new CustomEvent('onboardingStateChange', { 
          detail: { active: false } 
        }));
      }
    };
  }, [assistantVisible, currentStep, isActive]);

  // Initialize service
  useEffect(() => {
    onboardingService.init(userState);

    // Listen for tour events
    onboardingService.on('tourCompleted', handleTourComplete);
    onboardingService.on('tourSkipped', handleTourSkip);

    // Listen for onboarding menu trigger from sidebar
    const handleOpenOnboardingMenu = () => {
      setIsActive(true);
      setMenuOpen(true);
    };

    window.addEventListener('openOnboardingMenu', handleOpenOnboardingMenu);

    // Auto-trigger if enabled
    if (triggerOnMount) {
      const suggestedTour = onboardingService.checkTriggers();
      console.log('Suggested tour:', suggestedTour);
      if (suggestedTour && autoStart) {
        console.log('Auto-starting onboarding via triggers');
        startOnboarding();
        return;
      }
    }

    // Direct start if autoStart is true (bypass triggers entirely)
    if (autoStart) {
      console.log('Direct auto-start onboarding (bypassing triggers)');
      startOnboarding();
    }

    return () => {
      // Cleanup listeners
      window.removeEventListener('openOnboardingMenu', handleOpenOnboardingMenu);
    };
  }, [userState, autoStart, triggerOnMount]);

  // Navigation functions
  const handleNext = useCallback(() => {
    onboardingService.nextStep();
    setCurrentStep(onboardingService.getCurrentStep());
    setTourInfo(onboardingService.getCurrentTourInfo());
    
    if (!onboardingService.getCurrentStep()) {
      handleTourComplete();
    }
  }, [handleTourComplete]);

  const handlePrevious = useCallback(() => {
    onboardingService.previousStep();
    setCurrentStep(onboardingService.getCurrentStep());
    setTourInfo(onboardingService.getCurrentTourInfo());
  }, []);

  const handleSkip = useCallback(() => {
    onboardingService.skipTour('user_skip');
    handleTourSkip();
  }, [handleTourSkip]);

  const handleFinish = useCallback(() => {
    onboardingService.completeTour('tour_complete');
    handleTourComplete();
  }, [handleTourComplete]);

  // Form handling
  const handleFormSubmit = useCallback((stepId, data) => {
    const nextStep = onboardingService.submitForm(stepId, data);
    setCurrentStep(nextStep);
    setTourInfo(onboardingService.getCurrentTourInfo());
    setFormData({ ...formData, ...data });
  }, [formData]);

  // Execute cursor guidance when a step changes
  const executeCursorGuidance = useCallback((step) => {
    if (!step.cursorGuidance?.enabled) return;

    const guidance = step.cursorGuidance;
    let currentStepIndex = 0;

    const executeGuidanceStep = () => {
      if (currentStepIndex >= guidance.steps.length) {
        console.log('All guidance steps completed');
        return;
      }

      const guidanceStep = guidance.steps[currentStepIndex];
      console.log('Executing guidance step:', guidanceStep);

      // Find the target element
      const targetElement = findTargetElement(guidanceStep.target, guidanceStep.targetText);
      if (!targetElement) {
        console.warn('Target element not found for guidance step:', guidanceStep);
        return;
      }

      // Remove highlighting from previous target
      if (currentStepIndex > 0) {
        unhighlightMenuItem();
      }

      // Execute smooth cursor animation to target (from current position)
      const mousePosition = mouse.animateToElement(guidanceStep.target, {
        duration: 2000,
        onComplete: () => {
          console.log('Mouse animation completed to:', guidanceStep.target);
          
          // Highlight the target menu item when mouse reaches it
          const menuTitle = targetElement.getAttribute('data-nav-item');
          if (menuTitle) {
            highlightMenuItem(menuTitle);
          }
        }
      });

      if (mousePosition) {
        // Show instruction banner after animation completes
        if (guidanceStep.instruction) {
          setTimeout(() => {
            const rect = targetElement.getBoundingClientRect();
            const position = calculateBannerPosition(rect, guidanceStep.instruction.position);
            
            banners.showBanner({
              title: guidanceStep.instruction.title,
              message: guidanceStep.instruction.description,
              position,
              variant: 'info',
              autoHide: true,
              autoHideDelay: 12000,
              showCloseButton: false,
            });
          }, 1800); // Reduced delay for faster appearance
        }

        // Move to next step after delay
        setTimeout(() => {
          currentStepIndex++;
          executeGuidanceStep();
        }, guidance.steps[currentStepIndex].delay || 100);
      }
    };

    // Start guidance execution after initial delay
    setTimeout(executeGuidanceStep, guidance.delay || 500);
  }, []);

  // Helper function to find target elements
  const findTargetElement = (selector, targetText) => {
    console.log('Finding element with selector:', selector, 'and text:', targetText);
    
    if (targetText) {
      // Find element containing specific text
      const elements = document.querySelectorAll(selector);
      console.log('Found elements matching selector:', elements);
      for (let element of elements) {
        console.log('Checking element text:', element.textContent, 'against target:', targetText);
        if (element.textContent?.includes(targetText)) {
          console.log('Match found!', element);
          return element;
        }
      }
    }
    
    const element = document.querySelector(selector);
    console.log('Direct selector result:', element);
    return element;
  };

  // Helper function to calculate banner position
  const calculateBannerPosition = (elementRect, position) => {
    const offset = 20;
    
    switch (position) {
      case 'right':
        return { top: elementRect.top, left: elementRect.right + offset };
      case 'left':
        return { top: elementRect.top, left: elementRect.left - 300 - offset };
      case 'bottom':
        return { top: elementRect.bottom + offset, left: elementRect.left };
      case 'top':
        return { top: elementRect.top - 80 - offset, left: elementRect.left };
      default:
        return { top: elementRect.top, left: elementRect.right + offset };
    }
  };

  // Helper function to simulate typing
  const simulateTyping = (element, text) => {
    element.value = '';
    let i = 0;
    const typeChar = () => {
      if (i < text.length) {
        element.value += text.charAt(i);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        i++;
        setTimeout(typeChar, 50);
      }
    };
    typeChar();
  };

  // Execute cursor guidance when step changes
  useEffect(() => {
    if (currentStep && currentStep.type === 'cursor-only') {
      console.log('Starting cursor guidance for step:', currentStep);
      // Mouse will be shown during animation - no need to show immediately
      executeCursorGuidance(currentStep);
    }
  }, [currentStep, executeCursorGuidance]);

  // Set up click listeners for advanceOnClick targets
  useEffect(() => {
    if (currentStep && currentStep.advanceOnClick) {
      const handleTargetClick = (event) => {
        const target = event.target.closest(currentStep.advanceOnClick.target);
        if (target) {
          // Remove highlighting when user clicks (mouse will move to next target)
          unhighlightMenuItem();
          
          // Hide instruction banners when user clicks menu item (but keep center banners)
          banners.hideAllBanners();
          
          // User clicked the target element, advance to next step
          onboardingService.nextStep();
          setCurrentStep(onboardingService.getCurrentStep());
          setTourInfo(onboardingService.getCurrentTourInfo());
          
          if (!onboardingService.getCurrentStep()) {
            handleTourComplete();
          }
        }
      };

      // Add click listener to document
      document.addEventListener('click', handleTargetClick);

      // Cleanup
      return () => {
        document.removeEventListener('click', handleTargetClick);
      };
    }
  }, [currentStep, banners]);

  // Handle banner-type steps
  const [lastBannerStepId, setLastBannerStepId] = useState(null);
  
  useEffect(() => {
    if (currentStep && currentStep.type === 'banner' && currentStep.id !== lastBannerStepId) {
      const position = calculateBannerPositionForPlacement(currentStep.placement);
      
      banners.showBanner({
        title: currentStep.content.heading,
        message: currentStep.content.description,
        position,
        variant: currentStep.content.variant || 'info',
        autoHide: currentStep.content.autoHide !== false,
        autoHideDelay: currentStep.content.autoHideDelay || 10000,
        showCloseButton: currentStep.content.showCloseButton !== false,
        actions: currentStep.actions?.map(action => ({
          text: action.text,
          type: action.type,
          onClick: () => {
            // Hide current banner immediately when any action is clicked
            banners.hideAllBanners();
            
            if (action.action === 'nextStep') {
              // Directly advance step without causing re-renders
              onboardingService.nextStep();
              setCurrentStep(onboardingService.getCurrentStep());
              setTourInfo(onboardingService.getCurrentTourInfo());
              
              if (!onboardingService.getCurrentStep()) {
                handleTourComplete();
              }
            } else if (action.action === 'skipTour') {
              onboardingService.skipTour('user_skip');
              handleTourSkip();
            } else if (action.action === 'nextTour') {
              // Complete current tour and start next one
              onboardingService.completeTour('tour_complete');
              const nextStep = onboardingService.startTour(action.nextTourId);
              if (nextStep) {
                setCurrentStep(nextStep);
                const tourInfo = onboardingService.getCurrentTourInfo();
                setTourInfo(tourInfo);
                
                // Show assistant if tour settings specify it
                if (tourInfo?.settings?.showAssistant) {
                  setAssistantVisible(true);
                }
              }
            } else if (action.action === 'finishTour') {
              onboardingService.completeTour('tour_complete');
              handleTourComplete();
            }
          }
        })),
        icon: currentStep.content.icon
      });
      
      setLastBannerStepId(currentStep.id);
    }
  }, [currentStep]);

  // Helper function to calculate banner position from placement
  const calculateBannerPositionForPlacement = (placement) => {
    switch (placement) {
      case 'top-center':
        return { top: 20, left: '50%', transform: 'translateX(-50%)' };
      case 'top-left':
        return { top: 20, left: 20 };
      case 'top-right':
        return { top: 20, right: 20 };
      case 'bottom-center':
        return { bottom: 20, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-left':
        return { bottom: 20, left: 20 };
      case 'bottom-right':
        return { bottom: 20, right: 20 };
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      default:
        return { top: 20, left: '50%', transform: 'translateX(-50%)' };
    }
  };

  // Render current step content
  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'fullscreen-modal':
        return <FullscreenModal step={currentStep} onNext={handleNext} onSkip={handleSkip} />;
      
      case 'modal':
        return (
          <StepModal 
            step={currentStep} 
            onNext={handleNext} 
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            onFormSubmit={handleFormSubmit}
          />
        );
      
      case 'banner':
        // Banner is handled through banners system, no separate component needed
        return null;
      
      case 'cursor-only':
        // Cursor guidance is handled in useEffect, no visual component needed
        return null;
      
      case 'tooltip':
        return <StepTooltip step={currentStep} onNext={handleNext} onPrevious={handlePrevious} />;
      
      default:
        return null;
    }
  };

  console.log('OnboardingOrchestrator render - isActive:', isActive, 'menuOpen:', menuOpen);
  
  if (!isActive) {
    console.log('OnboardingOrchestrator not active, returning null');
    return null;
  }

  return (
    <>
      {/* Main Menu */}
      <OnboardingMenu 
        open={menuOpen} 
        onClose={() => {
          setMenuOpen(false);
          setIsActive(false);
        }}
        onStartTour={(tourId) => {
          const step = onboardingService.startTour(tourId);
          if (step) {
            setCurrentStep(step);
            const tourInfo = onboardingService.getCurrentTourInfo();
            setTourInfo(tourInfo);
            setMenuOpen(false);
            
            // Show assistant if tour settings specify it
            if (tourInfo?.settings?.showAssistant) {
              setAssistantVisible(true);
            }
          }
        }}
      />

      {/* Assistant - Always show during onboarding */}
      {(assistantVisible || (currentStep && isActive)) && (
        <OnboardingAssistant
          visible={true}
          currentStep={tourInfo ? (tourInfo.currentStep - 1) : 0}
          totalSteps={tourInfo ? tourInfo.totalSteps : 0}
          stepTitle={currentStep?.content?.heading || currentStep?.title || 'Onboarding Step'}
          position="bottom-center"
          onNext={handleNext}
          onPrevious={handlePrevious}
          onFinish={handleFinish}
          onOpenChat={() => {
            banners.showBanner({
              title: 'Chat Feature',
              message: 'This would open the AI chat assistant for help.',
              position: { top: 150, left: 400 },
              variant: 'info',
              autoHide: true,
              autoHideDelay: 3000,
            });
          }}
        />
      )}

      {/* Step Content */}
      {renderStepContent()}

      {/* Banner Container */}
      <banners.BannerContainer />

      {/* Mouse Component */}
      <mouse.MouseComponent />
    </>
  );
};

// Fullscreen Modal Component
const FullscreenModal = ({ step, onNext, onSkip }) => (
  <Dialog
    open={true}
    fullScreen
    PaperProps={{
      sx: {
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }}
  >
    <DialogContent sx={{ textAlign: 'center', color: 'white', maxWidth: 600 }}>
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
        {step.content.heading}
      </Typography>
      <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
        {step.content.subheading}
      </Typography>
      <Typography variant="body1" sx={{ mb: 6, fontSize: '1.2rem', opacity: 0.8 }}>
        {step.content.description}
      </Typography>
      
      <Stack direction="row" spacing={3} justifyContent="center">
        {step.actions?.map((action, index) => (
          <Button
            key={index}
            variant={action.type === 'primary' ? 'contained' : 'outlined'}
            size="large"
            onClick={action.action === 'nextStep' ? onNext : onSkip}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              bgcolor: action.type === 'primary' ? 'white' : 'transparent',
              color: action.type === 'primary' ? '#667eea' : 'white',
              border: action.type !== 'primary' ? '2px solid white' : 'none',
              '&:hover': {
                bgcolor: action.type === 'primary' ? '#f5f5f5' : 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            {action.text}
          </Button>
        ))}
      </Stack>
    </DialogContent>
  </Dialog>
);

// Step Modal Component
const StepModal = ({ step, onNext, onPrevious, onSkip, onFormSubmit }) => {
  const [formValues, setFormValues] = useState({});

  const handleFormChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (step.content.form) {
      onFormSubmit(step.id, formValues);
    } else {
      onNext();
    }
  };

  return (
    <Dialog
      open={true}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { bgcolor: '#2a2a2a', color: 'white', borderRadius: 2 }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
          {step.content.heading}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#ccc' }}>
          {step.content.description}
        </Typography>

        {/* Form Content */}
        {step.content.form && (
          <Box sx={{ mb: 4 }}>
            {step.content.form.type === 'multiple-choice' && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <RadioGroup
                  value={formValues[step.content.form.field] || ''}
                  onChange={(e) => handleFormChange(step.content.form.field, e.target.value)}
                >
                  {step.content.form.options.map((option) => (
                    <Card
                      key={option.value}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: formValues[step.content.form.field] === option.value ? 'rgba(66, 165, 245, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: formValues[step.content.form.field] === option.value ? '2px solid #42a5f5' : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleFormChange(step.content.form.field, option.value)}
                    >
                      <FormControlLabel
                        value={option.value}
                        control={<Radio sx={{ color: 'white' }} />}
                        label={
                          <Box>
                            <Typography variant="h6" sx={{ color: 'white' }}>
                              {option.label}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ccc', mt: 1 }}>
                              {option.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Card>
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {/* Additional Fields */}
            {step.content.form.additionalFields?.map((field) => (
              <TextField
                key={field.name}
                fullWidth
                label={field.label}
                placeholder={field.placeholder}
                multiline={field.type === 'textarea'}
                rows={field.type === 'textarea' ? 3 : 1}
                required={field.required}
                value={formValues[field.name] || ''}
                onChange={(e) => handleFormChange(field.name, e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#42a5f5' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            ))}
          </Box>
        )}

        {/* Code Snippet */}
        {step.content.codeSnippet && (
          <Card sx={{ bgcolor: 'rgba(0, 0, 0, 0.3)', p: 3, mb: 4 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#00ff00' }}>
              {step.content.codeSnippet.tabs?.[0]?.content || step.content.codeSnippet}
            </Typography>
          </Card>
        )}

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {step.actions?.map((action, index) => (
            <Button
              key={index}
              variant={action.type === 'primary' ? 'contained' : 'outlined'}
              onClick={handleSubmit}
              sx={{ color: action.type === 'primary' ? 'white' : '#42a5f5' }}
            >
              {action.text}
            </Button>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

// Step Tooltip Component
const StepTooltip = ({ step, onNext, onPrevious }) => (
  <Box
    sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10000,
      bgcolor: '#2a2a2a',
      color: 'white',
      p: 3,
      borderRadius: 2,
      maxWidth: 400,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>
      {step.content.heading}
    </Typography>
    <Typography variant="body2" sx={{ mb: 3, color: '#ccc' }}>
      {step.content.description}
    </Typography>
    
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="outlined" onClick={onPrevious} size="small">
        Previous
      </Button>
      <Button variant="contained" onClick={onNext} size="small">
        Next
      </Button>
    </Stack>
  </Box>
);

export default OnboardingOrchestrator; 