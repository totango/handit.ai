import React, { useState, useEffect } from 'react';
import OnboardingChat from './OnboardingChat';

const OnboardingChatContainer = ({ 
  onConnectionCheck,
  connectionStatus = 'disconnected',
  onComplete,
  questions = []
}) => {
  const [assistantVisible, setAssistantVisible] = useState(false);
  const [assistantPosition, setAssistantPosition] = useState('bottom-right');

  useEffect(() => {
    const handleOpenChat = (event) => {
      if (event.detail.mode === 'assistant') {
        setAssistantVisible(true);
        // Update position if specified
        if (event.detail.position) {
          setAssistantPosition(event.detail.position);
        }
        // If there's an initial message, it will be handled by the OnboardingChat component
      }
    };

    window.addEventListener('openOnboardingChat', handleOpenChat);
    return () => {
      window.removeEventListener('openOnboardingChat', handleOpenChat);
    };
  }, []);

  const handleConnectionCheck = async () => {
    if (onConnectionCheck) {
      await onConnectionCheck();
    }
  };

  return (
    <>
      {/* Universal Chat Assistant */}
      <OnboardingChat
        mode="assistant"
        isDarkMode={true}
        position={assistantPosition}
        visible={assistantVisible}
        onClose={() => setAssistantVisible(false)}
        onConnectionCheck={handleConnectionCheck}
        connectionStatus={connectionStatus}
        onComplete={onComplete}
        questions={questions}
      />
    </>
  );
};

export default OnboardingChatContainer; 