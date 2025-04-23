/**
 * Tracing Details Component
 * 
 * A component that displays detailed tracing information for agent entries and nodes,
 * including execution status, duration, timestamps, and input/output data. Supports
 * both entry-level and node-level tracing details with formatted displays for better
 * readability.
 */

'use client';

import * as React from 'react';
import {
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react';
import { format } from 'date-fns';

/**
 * NodeDetails Component
 * 
 * A subcomponent that displays detailed information about a specific node in the tracing flow,
 * including its type, input/output data, and execution duration.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.node - The node object containing tracing data
 * @returns {JSX.Element|null} The node details component or null if no node is provided
 */
function NodeDetails({ node }) {
  if (!node) return null;

  const { input, output, duration, type } = node.data;

  return (
    <Stack spacing={2}>
      {/* Node Type Information */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Node Type
        </Typography>
        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
          {type}
        </Typography>
      </Box>

      {/* Node Input Data */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Input
        </Typography>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            bgcolor: 'background.neutral',
            p: 1,
            borderRadius: 1,
            fontFamily: 'monospace'
          }}
        >
          {input}
        </Typography>
      </Box>

      {/* Node Output Data */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Output
        </Typography>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            bgcolor: 'background.neutral',
            p: 1,
            borderRadius: 1,
            fontFamily: 'monospace'
          }}
        >
          {output}
        </Typography>
      </Box>

      {/* Node Execution Duration */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Duration
        </Typography>
        <Typography variant="body2">
          {(duration / 1000).toFixed(2)}s
        </Typography>
      </Box>
    </Stack>
  );
}

/**
 * TracingDetails Component
 * 
 * The main component that displays tracing information for an agent entry,
 * including execution status, duration, timestamps, and input/output data.
 * Can display either entry-level information or detailed node information
 * when a specific node is selected.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.entry - The entry object containing basic tracing data
 * @param {Object} [props.selectedNode] - The currently selected node for detailed view
 * @param {Function} props.onClose - Callback function when the details view is closed
 * @param {Object} [props.entryFlow] - Additional flow-specific data for the entry
 * @returns {JSX.Element} The tracing details component
 */
export function TracingDetails({ entry, selectedNode, onClose, entryFlow }) {
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Entry Details</Typography>
      </Stack>

      {/* Entry Status */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Status
        </Typography>
        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
          {entryFlow?.status || entry.status}
        </Typography>
      </Box>

      {/* Entry Duration */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Duration
        </Typography>
        <Typography variant="body2">
          {((entryFlow?.duration || entry.duration) / 1000).toFixed(2)}s
        </Typography>
      </Box>

      {/* Entry Timestamp */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          Created At
        </Typography>
        <Typography variant="body2">
          {entry.createdAt ? format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm:ss') : 'N/A'}
        </Typography>
      </Box>

      <Divider />

      {/* Conditional Content: Node Details or Entry I/O */}
      {selectedNode ? (
        <NodeDetails node={selectedNode} />
      ) : (
        <Stack spacing={2}>
          {/* Entry Input Data */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Input
            </Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                bgcolor: 'background.neutral',
                p: 1,
                borderRadius: 1,
                fontFamily: 'monospace',
              }}
            >
              {entryFlow?.input || entry.input}
            </Typography>
          </Box>

          {/* Entry Output Data */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Output
            </Typography>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                bgcolor: 'background.neutral',
                p: 1,
                borderRadius: 1,
                fontFamily: 'monospace'
              }}
            >
              {entryFlow?.output || entry.output}
            </Typography>
          </Box>
        </Stack>
      )}
    </Stack>
  );
} 