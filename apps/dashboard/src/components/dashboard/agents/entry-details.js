/**
 * Entry Details Component
 * 
 * A component that displays detailed information about an agent execution flow.
 * Shows a vertical stepper with each node's input/output data and execution time,
 * providing a chronological view of the agent's decision-making process.
 */

'use client';

import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Card,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';

/**
 * EntryDetails Component
 * 
 * Displays a detailed view of an agent execution flow, showing the sequence of nodes
 * that were processed, their inputs, outputs, and execution times. The component
 * reconstructs the flow path based on the entry's start node and the graph's edges.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.entry - The execution entry data containing timestamps and node entries
 * @param {Array} props.nodes - Array of nodes in the agent flow
 * @param {Array} props.edges - Array of edges connecting the nodes
 * @returns {JSX.Element} The entry details component
 */
export const EntryDetails = ({ entry, nodes, edges }) => {
  /**
   * Creates a sequence of nodes based on the entry flow
   * Traverses the graph from the start node following edges to build the execution path
   */
  const nodeSequence = React.useMemo(() => {
    const sequence = [];
    let currentNodeId = entry.startNodeId;

    while (currentNodeId) {
      const node = nodes.find(n => n.id === currentNodeId);
      if (node) {
        sequence.push(node);
        // Find the next node through edges
        const nextEdge = edges.find(e => e.source === currentNodeId);
        currentNodeId = nextEdge?.target;
      } else {
        break;
      }
    }

    return sequence;
  }, [entry, nodes, edges]);

  return (
    <Stack spacing={3}>
      {/* Entry Overview Section */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Entry Flow
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Timestamp: {new Date(entry.timestamp).toLocaleString()}
        </Typography>
      </Box>

      {/* Flow Steps Section */}
      <Stepper orientation="vertical">
        {nodeSequence.map((node, index) => {
          // Find the corresponding entry data for this node
          const nodeEntry = entry.nodeEntries?.find(ne => ne.nodeId === node.id || ne.mappingnodeid === node.id);

          return (
            <Step key={node.id} active={true}>
              {/* Node Label */}
              <StepLabel>
                <Typography variant="subtitle2">
                  {node.data.label} ({node.data.type})
                </Typography>
              </StepLabel>

              {/* Node Content */}
              <StepContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {/* Input Data Card */}
                  <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Input
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem'
                      }}
                    >
                      {nodeEntry?.input || 'No input data'}
                    </Typography>
                  </Card>

                  {/* Output Data Card */}
                  <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Output
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem'
                      }}
                    >
                      {nodeEntry?.output || 'No output data'}
                    </Typography>
                  </Card>

                  {/* Execution Time */}
                  {nodeEntry?.executionTime && (
                    <Typography variant="caption" color="text.secondary">
                      Execution time: {nodeEntry.executionTime}ms
                    </Typography>
                  )}
                </Stack>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Stack>
  );
}; 