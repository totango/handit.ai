/**
 * Automated Insights Component
 * 
 * Main component for displaying automated insights and analytics,
 * including:
 * - Performance metrics
 * - System health indicators
 * - Usage patterns
 * - Optimization suggestions
 * - Trend analysis
 */

'use client';

import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useGetPromptVersionInsightsQuery } from '@/services/promptService';

import { InsightModal } from './insight-modal';

function InsightListItem({ insight, onClick }) {
  return (
    <ListItem
      button
      onClick={() => onClick(insight)}
      sx={{
        px: 0,
        py: 1.5,
        cursor: 'pointer',
        bgcolor: 'transparent',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
        borderRadius: 1,
        alignItems: 'flex-start',
        mb: 0.5,
        fontSize: 16,
      }}
    >
      <ListItemIcon sx={{ minWidth: 15, mt: 0.5 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#99a9af', mt: 0.5 }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body1" color="white" sx={{ fontWeight: 300, fontSize: 15, lineHeight: 1.2 }}>
            {insight.solution}
          </Typography>
        }
      />
    </ListItem>
  );
}

/**
 * AutomatedInsights Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.modelId - Model ID
 * @param {Object} props.version - Version of the model
 * @param {Object} props.leftVersionNumber - Left version number
 * @param {Object} props.rightVersionNumber - Right version number
 * @param {Object} props.leftAccuracy - Left accuracy
 * @param {Object} props.rightAccuracy - Right accuracy
 * @param {Object} props.bgColor - Background color
 * @returns {JSX.Element} The automated insights component
 */
export function AutomatedInsights({ modelId, version, leftVersionNumber, rightVersionNumber, leftAccuracy, rightAccuracy, bgColor }) {
  const [open, setOpen] = React.useState(false);
  const [selectedInsight, setSelectedInsight] = React.useState(null);

  const { data, isLoading } = useGetPromptVersionInsightsQuery(
    modelId && version ? { modelId, version } : { skip: true }
  );
  const insights = data?.data || [];

  const handleInsightClick = (insight) => {
    setSelectedInsight(insight);
    setOpen(true);
  };

  // --- Suggested Action Logic ---
  let suggestion = null;
  let diff = null;
  let showSuggestion = false;
  if (
    typeof leftAccuracy === 'number' &&
    typeof rightAccuracy === 'number' &&
    leftVersionNumber &&
    rightVersionNumber
  ) {

    diff = Math.abs(rightAccuracy - leftAccuracy);
    const percentDiff = (diff * 100).toFixed(2);
    if (rightAccuracy > leftAccuracy) {
      suggestion = (
        <>

          <Typography variant="body2" color="white" sx={{ fontSize: 14 }}>
            Deploy version {rightVersionNumber} to improve accuracy.
          </Typography>
        </>
      );
      showSuggestion = true;
    } else if (leftAccuracy > rightAccuracy) {
      suggestion = (
        <>


          <Typography variant="body2" color="white">
            Version {rightVersionNumber} has lower accuracy. Consider deploying version {leftVersionNumber} for better results.
          </Typography>
        </>
      );
      showSuggestion = true;
    } else {
      suggestion = (
        <>

          <Typography variant="body2" color="white">
            No action needed. Both versions perform equally well in accuracy.
          </Typography>
        </>
      );
      showSuggestion = true;
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Merged Automated Insights and Suggested Action */}
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: bgColor }}>
        {/* Automated Insights (top) */}
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="h6" sx={{ color: '#94e4c7', fontWeight: 600, fontSize: 16, mb: 1 }}>
            Automated Insights
          </Typography>
        </Box>
        <CardContent sx={{ p: 2, flex: 1, overflow: 'auto', pt: 1, pb: 0 }}>
          {isLoading ? (
            <Typography color="text.secondary">Loading insights…</Typography>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'transparent', p: 0, m: 0 }}>
              {insights.length === 0 ? (
                <Typography color="text.secondary">No insights available for this version.</Typography>
              ) : (
                insights.slice(0, 4).map((insight) => (
                  <InsightListItem
                    key={insight.id}
                    insight={insight}
                    onClick={handleInsightClick}
                  />
                ))
              )}
            </List>
          )}
        </CardContent>
        {/* Divider between sections */}
        <Box sx={{ px: 2 }}>
          <Divider />
        </Box>
        {/* Suggested Action (bottom) */}
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', pb: 18 }}>
          <Typography variant="h6" sx={{ color: '#abd4d7', fontWeight: 600, letterSpacing: 1, fontSize: 15, mb: 1 }}>
            Suggested Action
          </Typography>
          {showSuggestion ? suggestion : (
            <Typography variant="body2" color="text.secondary">
              Not enough data to suggest an action.
            </Typography>
          )}
        </Box>
      </Card>
      {selectedInsight && (
        <InsightModal
          problem={selectedInsight.problem}
          insight={selectedInsight.solution}
          entry={selectedInsight.data?.entry}
          open={open}
          setOpen={setOpen}
          description={selectedInsight.data?.description}
        />
      )}
    </Box>
  );
} 