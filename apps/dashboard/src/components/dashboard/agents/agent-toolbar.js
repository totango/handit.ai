/**
 * Agent Toolbar Component
 * 
 * A toolbar interface for adding new nodes to the agent flow editor.
 * Provides buttons for creating model and tool nodes, with support for
 * both click-to-add and drag-and-drop functionality.
 */

import * as React from 'react';
import { Box, Button, Stack, Typography, Tooltip } from '@mui/material';
import { Brain, Wrench } from '@phosphor-icons/react';

/**
 * Available node types for the agent flow editor
 * @type {Array<{type: string, label: string, icon: React.ComponentType, tooltip: string}>}
 */
const nodeTypes = [
  {
    type: 'model',
    label: 'LLM Node',
    icon: Brain,
    tooltip: 'Click to add a model node, or drag and drop it onto the canvas. Models process inputs using AI.',
  },
  {
    type: 'tool',
    label: 'Tool Node',
    icon: Wrench,
    tooltip: 'Click to add a tool node, or drag and drop it onto the canvas. Tools perform specific actions or integrate services.',
  },
];

/**
 * AgentToolbar Component
 * 
 * A toolbar that provides buttons for adding new nodes to the agent flow editor.
 * Supports both click-to-add and drag-and-drop functionality for creating
 * model and tool nodes.
 * 
 * @returns {JSX.Element} The agent toolbar component
 */
export const AgentToolbar = () => {
  /**
   * Handles the start of a drag operation for a node type
   * @param {DragEvent} event - The drag event
   * @param {string} nodeType - The type of node being dragged
   */
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  /**
   * Creates and adds a new node to the flow editor
   * @param {string} type - The type of node to create ('model' or 'tool')
   */
  const addNewNode = (type) => {
    // Calculate random position for new node
    const position = {
      x: Math.random() * 500,  // Random x position within 500px
      y: Math.random() * 300   // Random y position within 300px
    };

    // Create new node configuration
    const newNode = {
      id: `node_${Math.random()}`,
      type: 'custom',
      position,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        type: type,
        justCreated: true,
      },
    };

    // Dispatch custom event to notify parent component
    const event = new CustomEvent('addNode', { detail: newNode });
    window.dispatchEvent(event);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 4,
        backgroundColor: 'background.paper',
        p: 2,
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Add Node
        </Typography>
        <Stack spacing={1}>
          {nodeTypes.map(({ type, label, icon: Icon, tooltip }) => (
            <Tooltip
              key={type}
              title={tooltip}
              placement="right"
              arrow
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<Icon />}
                onDragStart={(event) => onDragStart(event, type)}
                onClick={() => addNewNode(type)}
                draggable
                sx={{
                  justifyContent: 'flex-start',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                {label}
              </Button>
            </Tooltip>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}; 