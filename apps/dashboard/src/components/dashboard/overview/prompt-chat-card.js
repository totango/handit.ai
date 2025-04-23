'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, Typography, Avatar, Box, Stack, Divider } from '@mui/material';
import { ChatCircleText } from '@phosphor-icons/react';

export function PromptChatCard({ prompt, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader
          avatar={<Avatar><ChatCircleText /></Avatar>}
          title="Current Prompt"
        />
        <CardContent>
          <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Loading prompt...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        avatar={<Avatar><ChatCircleText /></Avatar>}
        title="Current Prompt"
      />
      <CardContent>
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'background.neutral', 
            borderRadius: 1,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 2 
            }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main'
                }}
              >
                AI
              </Avatar>
              <Box 
                sx={{ 
                  p: 1.5,
                  bgcolor: 'primary.lighter',
                  borderRadius: 2,
                  maxWidth: 'calc(100% - 48px)'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {prompt}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
} 