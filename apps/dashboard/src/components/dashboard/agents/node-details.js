/**
 * Node Details Component
 * 
 * A component that displays detailed information about a node in the agent flow,
 * including node information, metrics, insights, and recent entries. Supports
 * different display formats based on node type (model or tool) and provides
 * interactive features for viewing entry flows.
 */

'use client';

import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Tooltip,
} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react';

/**
 * NodeDetails Component
 * 
 * Displays comprehensive information about a node in the agent flow, including:
 * - Basic node information (type, model/tool details)
 * - Performance metrics for model nodes
 * - Insights and issues with severity indicators
 * - Recent entries with timestamps and flow navigation
 * 
 * @param {Object} props - Component props
 * @param {Object} props.node - The node object containing data to display
 * @param {Object} [props.metrics={}] - Performance metrics for model nodes
 * @param {Array} [props.insights=[]] - Array of insights and issues
 * @param {Array} [props.entries=[]] - Array of recent entries
 * @param {Function} [props.onEntrySelect] - Callback function when an entry is selected
 * @returns {JSX.Element} The node details component
 */
export const NodeDetails = ({
  node,
  metrics = {},
  insights = [],
  entries = [],
  onEntrySelect
}) => {
  /**
   * Handles click on an entry to view its flow
   * @param {Object} entry - The selected entry object
   */
  const handleEntryClick = (entry) => {
    if (onEntrySelect) {
      onEntrySelect(entry);
    }
  };

  return (
    <Stack spacing={3}>
      {/* Node Information Section */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>Node Information</Typography>
        <List dense>
          {/* Node Type */}
          <ListItem>
            <ListItemText
              primary="Type"
              secondary={node.data.type}
            />
          </ListItem>
          {/* Model-specific Information */}
          {node.data.type === 'model' && (
            <ListItem>
              <ListItemText
                primary="Model"
                secondary={node.data.model}
              />
            </ListItem>
          )}
          {/* Tool-specific Information */}
          {node.data.type === 'tool' && (
            <>
              <ListItem>
                <ListItemText
                  primary="Tool Type"
                  secondary={node.data.toolType}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Description"
                  secondary={node.data.description}
                />
              </ListItem>
            </>
          )}
        </List>
      </Box>

      <Divider />

      {/* Metrics Section - Only for Model Nodes */}
      {node.data.type === 'model' && metrics && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Metrics</Typography>
          <List dense>
            {Object.entries(metrics).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemText
                  primary={key}
                  secondary={`${(value * 100).toFixed(1)}%`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Insights Section */}
      {insights.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Insights & Issues</Typography>
          <List dense>
            {insights.map((insight, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={insight.title}
                  secondary={insight.description}
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={insight.severity}
                    size="small"
                    color={insight.severity === 'critical' ? 'error' : 'warning'}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Divider />

      {/* Recent Entries Section */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>Recent Entries</Typography>
        {entries.length > 0 ? (
          <List dense>
            {/* Display up to 5 most recent entries */}
            {entries.slice(0, 5).map((entry, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Entry ${entry.id}`}
                  secondary={new Date(entry.timestamp).toLocaleString()}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="View entry flow">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleEntryClick(entry)}
                    >
                      <ArrowRightIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" variant="body2">
            No entries found
          </Typography>
        )}
        {/* View All Entries Button - Only shown if there are more than 5 entries */}
        {entries.length > 5 && (
          <Button
            variant="text"
            size="small"
            endIcon={<ArrowRightIcon />}
            onClick={() => {/* TODO: Show all entries */ }}
            sx={{ mt: 1 }}
          >
            View all entries
          </Button>
        )}
      </Box>
    </Stack>
  );
}; 