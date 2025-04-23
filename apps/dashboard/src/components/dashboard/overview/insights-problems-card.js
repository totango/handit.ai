'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, Typography, Avatar, Box, Stack, ToggleButton, ToggleButtonGroup, Grid } from '@mui/material';
import { LightbulbFilament, Warning } from '@phosphor-icons/react';

function InsightCard({ title, description }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightbulbFilament size={24} color="var(--mui-palette-primary-main)" />
            <Typography variant="subtitle1">{title}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProblemCard({ title, description }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning size={24} color="var(--mui-palette-error-main)" />
            <Typography variant="subtitle1">{title}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function InsightsProblemsCard({ insights, problems, isLoading }) {
  const [view, setView] = React.useState('insights');

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view selector"
        >
          <ToggleButton value="insights" aria-label="insights">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightbulbFilament size={20} />
              <Typography variant="button">Insights</Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="problems" aria-label="problems">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning size={20} />
              <Typography variant="button">Problems</Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2}>
        {view === 'insights' ? (
          insights.map((insight, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <InsightCard title={insight.title} description={insight.description} />
            </Grid>
          ))
        ) : (
          problems.map((problem, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <ProblemCard title={problem.title} description={problem.description} />
            </Grid>
          ))
        )}
      </Grid>
    </Stack>
  );
} 