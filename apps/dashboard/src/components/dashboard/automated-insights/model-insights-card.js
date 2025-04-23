/**
 * Model Insights Card Component
 * 
 * Displays insights and analysis for model performance, showing:
 * - Model metrics
 * - Performance trends
 * - Usage patterns
 * - Optimization suggestions
 * - Comparative analysis
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, Typography, List, ListItem, ListItemText, Skeleton } from '@mui/material';
import { Brain } from '@phosphor-icons/react';

/**
 * ModelInsightsCard Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.model - Model insights data
 * @param {boolean} props.isLoading - Indicates if the model is loading
 * @returns {JSX.Element} The model insights card component
 */
export function ModelInsightsCard({ model, isLoading }) {
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

  const fromCamelToTitle = (str) => {
    if (!str) return 'Not specified';
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
  }

  return (
    <Card sx={{ height: '100%', minHeight: 400 }}>
      <CardHeader
        avatar={<Brain size={24} />}
        title="Model Overview"
        subheader={model?.name || 'Model Analysis'}
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary" paragraph>
          Model Type: {fromCamelToTitle(model?.type) || 'Not specified'}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Key Characteristics:
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Description"
              secondary={model?.description || 'No description available'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Created On"
              secondary={new Date(model?.createdAt).toLocaleDateString()}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Status"
              secondary={model?.status || 'Active'}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
} 