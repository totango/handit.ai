/**
 * Chat Message Component
 * 
 * A reusable component for rendering individual chat messages in the AI chat interface.
 * Supports both user and AI messages with different styling and layout.
 * 
 * Features:
 * - Different layouts for user and AI messages
 * - Avatar display for both parties
 * - Timestamp formatting
 * - Typing indicator support
 * - Multi-line message support
 * - Custom styling through sx prop
 */
import * as React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { format } from 'date-fns';

/**
 * Chat Message Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.position - Message position ('left' for AI, 'right' for user)
 * @param {string} props.text - Message content
 * @param {Date} props.date - Message timestamp
 * @param {string} props.avatar - URL for the avatar image
 * @param {boolean} props.isTyping - Whether to show typing indicator
 * @param {Object} props.sx - Additional styles to apply to the root element
 * @returns {JSX.Element} A styled chat message bubble with avatar and timestamp
 */
export function ChatMessage({ position, text, date, avatar, isTyping, sx = {} }) {
  const isUser = position === 'right';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 1,
        mb: 2,
        mx: 2,
        ...sx,
      }}
    >
      {/* Avatar */}
      <Avatar
        src={avatar}
        alt={isUser ? "User" : "AI Assistant"}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...(position === 'left' && {
            bgcolor: '#FFFFFF',
            border: '1px solid #004e54',
          })
        }}
      />

      {/* Message Bubble */}
      <Box
        className="message-bubble"
        sx={{
          bgcolor: isUser ? '#F5F5F5' : '#F0F0FF',
          borderRadius: '16px',
          padding: '12px 16px',
          maxWidth: '80%',
          wordBreak: 'break-word',
          fontSize: '10px',
        }}
      >
        {isTyping ? (
          // Typing Indicator
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1A1A1A' }}>
            <Typography variant="body1" sx={{ fontSize: '14px' }}>
              Thinking...
            </Typography>
          </Box>
        ) : (
          // Message Content
          <Typography variant="body1" sx={{ color: '#1A1A1A', fontSize: '14px' }}>
            {text.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < text.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </Typography>
        )}
      </Box>

      {/* Timestamp */}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          alignSelf: 'flex-end',
          ml: isUser ? 2 : 0,
          mr: isUser ? 0 : 2,
        }}
      >
        {format(date, 'HH:mm')}
      </Typography>
    </Box>
  );
}
