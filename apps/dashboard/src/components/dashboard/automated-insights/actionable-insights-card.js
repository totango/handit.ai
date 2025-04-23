/**
 * Actionable Insights Card Component
 * 
 * Displays actionable insights and recommendations based on system performance,
 * showing:
 * - Key performance indicators
 * - Improvement opportunities
 * - Action recommendations
 * - Impact predictions
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, Typography, List, ListItem, ListItemIcon, ListItemText, Skeleton, Divider, Stack, Box } from '@mui/material';
import { Lightning, Warning, CheckCircle } from '@phosphor-icons/react';
import { EntryDetailsDialog } from './entry-details-dialog';

/**
 * ActionableInsightsCard Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Insights data
 * @param {Array<Object>} props.data.insights - List of actionable insights
 * @param {string} props.data.insights[].title - Insight title
 * @param {string} props.data.insights[].description - Insight description
 * @param {string} props.data.insights[].impact - Expected impact
 * @param {string} props.data.insights[].action - Recommended action
 * @returns {JSX.Element} The actionable insights card component
 */
export function ActionableInsightsCard({ model, isLoading, insights }) {
  const [selectedEntry, setSelectedEntry] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const noData = !insights || insights.length === 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="rectangular" height={200} />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        sx={{
          backgroundColor: 'var(--mui-palette-background-paper)',
          boxShadow: 'var(--mui-shadows-8)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardHeader
          avatar={<Lightning size={24} />}
          title="Actionable Insights"
          subheader="Problems identified and recommended solutions"
        />
        <Box
          sx={{
            filter: noData ? 'blur(5px)' : 'none',
            pointerEvents: noData ? 'none' : 'auto',
            height: '100%',
            transition: 'filter 0.3s',
          }}
        >
          <CardContent>
            <List>
              {(insights || []).map((problem, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      cursor: problem.entry ? 'pointer' : 'default',
                      '&:hover': problem.entry ? {
                        backgroundColor: 'action.hover',
                      } : {},
                      transition: 'background-color 0.2s',
                      borderRadius: 1,
                    }}
                    onClick={() => {
                      if (problem.entry) {
                        setSelectedEntry(problem.entry);
                        setDialogOpen(true);
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Warning size={24} color="var(--mui-palette-warning-main)" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          {problem.problem}
                          {problem.data.entry && (
                            <Typography variant="caption" color="primary.main">
                              (Click to view example)
                            </Typography>
                          )}
                        </Stack>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Problem:
                          </Typography>
                          {" " + problem.data.description}
                          <br />
                          <Typography component="span" variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <CheckCircle size={16} style={{ marginRight: 8 }} />
                            Solution: {problem.solution}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < problems.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Box>
        {noData && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 10,
              p: 10,
              textAlign: 'center',
            }}
          >
            <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
              No insights available yet. Insights will be generated after your model has processed enough entries to identify patterns and potential improvements.
            </Typography>
          </Box>
        )}
      </Card>
      <EntryDetailsDialog
        entryData={selectedEntry}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedEntry(null);
        }}
      />
    </>
  );
} 