/**
 * Chat Insights Card Component
 * 
 * Displays insights and analytics for chat interactions, showing:
 * - Conversation metrics
 * - Response quality
 * - User engagement
 * - Performance trends
 * - Improvement suggestions
 */

'use client';

import * as React from 'react';
import { Box, Button, Card, CardContent, Grid, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { LightbulbFilament, Warning, ArrowsLeftRight } from '@phosphor-icons/react';

import { InsightModal } from './insight-modal';
import { NewPromptComparison } from './new-prompt-comparison';

function InsightBox({ title, description, type = 'insight', onClick }) {
  return (
    <Card
      sx={{
        bgcolor: 'var(--mui-palette-background-paper)',
        '&:hover': {
          bgcolor: 'var(--mui-palette-action-hover)',
          cursor: 'pointer',
        },
        transition: 'background-color 0.2s',
        borderRadius: '6px',
      }}
      onClick={() => {
        onClick(description);
      }}
    >
      <CardContent sx={{ padding: '12px !important' }}>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}></Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <Card sx={{ height: '100%', bgcolor: 'var(--mui-palette-background-default)', overflow: 'hidden' }}>
      <CardContent sx={{ height: '100%', p: 0 }}>
        <Stack sx={{ height: '100%' }}>
          {/* Selector Buttons Skeleton */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              gap: 1,
            }}
          >
            <Skeleton variant="rounded" width={100} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
          </Box>

          {/* Chat Message Skeleton */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#1a1a1a',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Skeleton
                variant="rounded"
                width="70%"
                height={80}
                sx={{
                  borderRadius: '18px',
                  ml: '8px',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }}
              />
            </Box>
          </Box>

          {/* Insights/Problems Grid Skeleton */}
          <Box sx={{ p: 2, flex: 1 }}>
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                  <Card sx={{ height: '100%', bgcolor: 'var(--mui-palette-background-paper)' }}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Skeleton variant="circular" width={20} height={20} />
                          <Skeleton variant="text" width="60%" />
                        </Box>
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="70%" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * ChatInsightsCard Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Chat insights data
 * @param {Object} props.data.metrics - Chat performance metrics
 * @param {Array<Object>} props.data.insights - List of chat insights
 * @param {Object} props.data.trends - Chat trend analysis
 * @returns {JSX.Element} The chat insights card component
 */
export function ChatInsightsCard({ model, insights, problems, isLoading, data }) {
  const [view, setView] = React.useState('insights');
  const [open, setOpen] = React.useState(false);
  const [problem, setProblem] = React.useState(null);
  const [insight, setInsight] = React.useState(null);
  const [entry, setEntry] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [comparePromptsOpen, setComparePromptsOpen] = React.useState(false);

  const items = view === 'insights' ? insights : problems;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const onClick = (entryDescription) => {
    if (view === 'insights') {
      const insight = data.find((ins) => ins.solution === entryDescription);
      setInsight(insight.solution);
      setProblem(insight.problem);
      setEntry(insight.data.entry);
      setDescription(insight.data.description);
      setOpen(true);
    } else {
      const problem = data.find((ins) => ins.problem === entryDescription);
      setProblem(problem.problem);
      setInsight(problem.solution);
      setEntry(problem.data.entry);
      setDescription(problem.data.description);
      setOpen(true);
    }
  };

  return (
    <>
      <InsightModal problem={problem} insight={insight} entry={entry} open={open} setOpen={setOpen} description={description} />
      <NewPromptComparison
        id={model?.id}
        originalPrompt={model?.prompt}
        newPrompt={model?.optimizedPrompt}
        open={comparePromptsOpen}
        setOpen={setComparePromptsOpen}
        useOptimizedPrompt={model?.useOptimizedPrompt}
        modelId={model?.id}
      />
      <Card sx={{ height: '84vh', bgcolor: 'var(--mui-palette-background-default)', overflow: 'hidden' }}>
        <CardContent sx={{ height: '100%', p: 0 }}>
          <Stack sx={{ height: '100%' }}>

            {/* Chat Area */}
            <Box
              sx={{
                p: 2,
                overflowY: 'auto',
                minHeight: '100%',
                maxHeight: '100%',
                display: 'contents',
              }}
            >
              {/* Compare Prompts Button */}
              {model?.optimizedPrompt && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pt: 2 }}>
                  <Button
                    startIcon={<ArrowsLeftRight />}
                    onClick={() => setComparePromptsOpen(true)}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: '16px',
                      bgcolor: 'rgba(117, 120, 255, 0.16)',
                      borderColor: 'transparent',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(117, 120, 255, 0.24)',
                        borderColor: 'transparent',
                      },
                    }}
                  >
                    Compare with Optimized Prompt
                  </Button>
                </Box>
              )}

              {/* Message Bubble */}
              <Box sx={{ display: 'inline', alignItems: 'flex-start', maxHeight: model?.optimizedPrompt ? '65%' : '70%', marginTop: '20px' }}>
                <Box

                  sx={{
                    bgcolor: 'var(--mui-palette-background-paper)',
                    p: '20px 20px',
                    borderRadius: '18px 18px 18px 0px',
                    position: 'relative',
                    marginLeft: '20px',
                    marginRight: '20px',
                    height: '100%',
                    overflow: 'auto',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: '-6px',
                      top: '10%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      borderRight: '6px solid #2a2a2a',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      color: '#fff',
                      lineHeight: 1.5,
                    }}
                  >
                    {model?.prompt || 'No prompt available'}
                  </Typography>
                </Box>
              </Box>
              <Box
                container
                sx={{ marginTop: '16px', marginBottom: '10px', marginLeft: '20px', marginRight: '20px', height: '36%' }}
              >
                <Grid container spacing={2}>
                  {(items || []).slice(0, 4).map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <InsightBox description={item} type={view} onClick={onClick} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* Insights/Problems Grid */}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
