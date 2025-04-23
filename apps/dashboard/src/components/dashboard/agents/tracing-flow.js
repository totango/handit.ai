/**
 * Tracing Flow Component
 * 
 * A component that visualizes the execution flow of an agent entry using ReactFlow.
 * Displays nodes representing execution steps with their metrics and connections
 * between steps. Supports interactive features like node selection and flow navigation.
 */

'use client';

import * as React from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Typography } from '@mui/material';
import { useGetAgentEntryByIdQuery } from '@/services/agentsService';

// Register custom node type
const nodeTypes = {
  custom: CustomNode,
};

/**
 * CustomNode Component
 * 
 * A custom node component for ReactFlow that displays step information,
 * including step number, label, and duration metrics.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Node data containing step information
 * @param {string} props.data.label - The label/title of the step
 * @param {number} props.data.stepNumber - The sequence number of the step
 * @param {number} props.data.duration - The execution duration in milliseconds
 * @returns {JSX.Element} The custom node component
 */
function CustomNode({ data }) {
  return (
    <Box
      sx={{
        background: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        minWidth: 180,
      }}
    >
      {/* Step Label */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {data.label}
      </Typography>
      {/* Step Number Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          width: 24,
          height: 24,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}
      >
        {data.stepNumber}
      </Box>
      {/* Duration Display */}
      <Typography variant="caption" color="text.secondary" component="div">
        Duration: {(data.duration / 1000).toFixed(2)}s
      </Typography>
    </Box>
  );
}

/**
 * TracingFlow Component
 * 
 * The main component that renders the execution flow visualization using ReactFlow.
 * Transforms entry steps into nodes and edges, and provides interactive features
 * for exploring the flow.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.entry - The entry object containing execution steps
 * @param {Function} props.onNodeClick - Callback function when a node is clicked
 * @returns {JSX.Element} The tracing flow component
 */
export function TracingFlow({ entry, onNodeClick }) {
  // ReactFlow state management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /**
   * Transform entry steps into nodes and edges for ReactFlow
   */
  React.useEffect(() => {
    if (!entry?.steps) return;

    // Create nodes from steps
    const newNodes = entry.steps.map((step, index) => ({
      id: (step.mappingnodeid ? step.mappingnodeid : step.nodeId).toString(),
      type: 'custom',
      position: { x: 250 * index, y: 0 },
      data: {
        label: step.nodeName,
        stepNumber: index + 1,
        duration: step.duration,
        type: step.type,
        input: step.input,
        output: step.output,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));

    // Create edges connecting the nodes
    const newEdges = entry.steps.slice(1).map((step, index) => ({
      id: `e${index}`,
      source: (entry.steps[index].mappingnodeid ? entry.steps[index].mappingnodeid : entry.steps[index].nodeId).toString(),
      target: (step.mappingnodeid ? step.mappingnodeid : step.nodeId).toString(),
      animated: true,
      style: { stroke: '#2196f3' },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [entry, setNodes, setEdges]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
        attributionPosition="bottom-right"
      >
        {/* Flow Background */}
        <Background />
        {/* Flow Controls */}
        <Controls
          showZoom={true}
          showFitView={false}
          showInteractive={false}
        />
      </ReactFlow>
    </Box>
  );
} 