/**
 * Prompt Analysis Card Component
 * 
 * Displays analysis of prompt performance and effectiveness, showing:
 * - Prompt success rates
 * - Response quality metrics
 * - Usage patterns
 * - Improvement suggestions
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, Typography, Skeleton, Box } from '@mui/material';
import { ChatText } from '@phosphor-icons/react';

/**
 * PromptAnalysisCard Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.model - Prompt model data
 * @param {boolean} props.isLoading - Indicates if the component is loading
 * @returns {JSX.Element} The prompt analysis card component
 */
export function PromptAnalysisCard({ model, isLoading }) {
  if (isLoading) {
    return (
      <Card sx={{ height: '100%', minHeight: 400 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="90%" height={60} />
          <Skeleton variant="rectangular" height={200} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxHeight: 400, minHeight: 400 }}>
      <CardHeader
        avatar={<ChatText size={24} />}
        title="Prompt Analysis"
        subheader="Current prompt configuration and analysis"
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Current Prompt:
        </Typography>
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            mb: 3,
            overflow: 'auto',
            maxHeight: 250,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {model?.parameters?.prompt || 'No prompt available'}
          </Typography>
        </Box>


      </CardContent>
    </Card>
  );
} 