/**
 * Agent Editor Component
 * 
 * A visual flow editor for creating and editing agent configurations.
 * Provides a drag-and-drop interface for building agent workflows using
 * ReactFlow, with support for custom nodes, model selection, and tool configuration.
 */

import * as React from 'react';
import ReactFlow, { addEdge, Background, Controls, useEdgesState, useNodesState, ControlButton } from 'reactflow';
import { X as XIcon, ArrowsOut, Copy } from '@phosphor-icons/react';

import 'reactflow/dist/style.css';

import { useGetModelsQuery, useAddModelsMutation } from '@/services/modelsService';
import { useAssociatePromptToModelMutation } from '@/services/reviewersTemplateService';
import { Card, ClickAwayListener, Dialog, DialogContent, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { AgentToolbar } from './agent-toolbar';
import { CreateAgentDialog } from './create-agent-dialog';
import { CustomNode } from './custom-node';
import { CreateModelForm } from '@/components/dashboard/models/create-model-form';

// Register custom node types for the flow editor
const nodeTypes = {
  custom: CustomNode,
};

// Node ID generator
let id = 0;
const getId = () => `node_${id++}`;

/**
 * AgentEditor Component
 * 
 * A visual flow editor for creating and editing agent configurations.
 * Supports drag-and-drop node creation, model selection, and workflow
 * visualization.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the agent editor
 * @param {Array} [props.initialNodes=[]] - Initial nodes for the flow editor
 * @param {Array} [props.initialEdges=[]] - Initial edges for the flow editor
 * @param {Function} props.onSave - Callback function when saving the agent
 * @param {boolean} [props.isEdit=false] - Whether the editor is in edit mode
 * @param {Object} [props.initialData] - Initial data for the agent
 * @returns {JSX.Element} The agent editor component
 */
export const AgentEditor = ({ title, initialNodes = [], initialEdges = [], onSave, isEdit, initialData }) => {
  // Fetch available models
  const { data: models, refetch: refetchModels } = useGetModelsQuery();
  const [addModel] = useAddModelsMutation();
  const [associatePromptToModel] = useAssociatePromptToModelMutation();

  // Flow editor state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // UI state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isModelFormOpen, setIsModelFormOpen] = React.useState(false);
  const [selectedNodeId, setSelectedNodeId] = React.useState(null);
  const reactFlowWrapper = React.useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
  });

  /**
   * Handles copying node data to clipboard
   * @param {Object} data - The data to copy
   */
  const handleCopy = React.useCallback((data) => {
    setSnackbar({
      open: true,
      message: `Slug "${data.slug}" copied to clipboard`,
    });
  }, []);

  /**
   * Updates the model for a specific node
   * @param {string} nodeId - The ID of the node to update
   * @param {string} model - The new model ID
   */
  const handleModelChange = React.useCallback((nodeId, model) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              model,
              modelId: model,
            },
          }
          : node
      )
    );
  }, []);

  /**
   * Handles the creation of a new model
   * @param {string} modelId - The ID of the newly created model
   */
  const handleModelCreated = async (modelData) => {
    setLoading(true);
    setSnackbar({ open: false, message: '' });
    try {
      // 1. Create the model

      const createdModel = await addModel(modelData).unwrap();

      // 2. Associate each reviewer
      if (modelData.evaluatorIds && modelData.evaluatorIds.length > 0) {
        await Promise.all(
          modelData.evaluatorIds.map((evaluatorId) =>
            associatePromptToModel({
              modelId: createdModel.id,
              evaluationPromptId: evaluatorId,
            })
          )
        );
      }
      // 3. Assign the model to the node
      handleModelChange(selectedNodeId, createdModel.id);
      setSnackbar({ open: true, message: 'Model created and reviewers associated!' });
      setIsModelFormOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err?.data?.message || 'Failed to create model or associate reviewers' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the model creation form for a specific node
   * @param {string} nodeId - The ID of the node to create a model for
   */
  const handleOpenModelForm = React.useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
    setIsModelFormOpen(true);
  }, []);

  /**
   * Updates the data for a specific node
   * @param {string} nodeId - The ID of the node to update
   * @param {Object} newData - The new data for the node
   */
  const handleEditNode = React.useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          }
          : node
      )
    );
  }, []);

  /**
   * Removes a node and its associated edges
   * @param {string} nodeId - The ID of the node to delete
   */
  const handleDeleteNode = React.useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, []);

  // Initialize nodes with callbacks
  React.useEffect(() => {
    if (!initialNodes.length) return;

    const nodesWithCallbacks = initialNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onModelChange: (model) => handleModelChange(node.id, model),
        onEdit: (newData) => handleEditNode(node.id, newData),
        onDelete: () => handleDeleteNode(node.id),
        onCopy: (data) => handleCopy(data),
      },
    }));
    setNodes(nodesWithCallbacks);
  }, [initialNodes, handleModelChange, handleEditNode, handleDeleteNode]);

  /**
   * Handles connecting nodes in the flow editor
   */
  const onConnect = React.useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  /**
   * Handles drag over events for node dropping
   */
  const onDragOver = React.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handles dropping new nodes onto the flow editor
   */
  const onDrop = React.useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: 'custom',
        position,
        data: {
          justCreated: true,
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
          type: type,
          model: undefined,
          description: type === 'tool' ? '' : undefined,
          toolType: type === 'tool' ? '' : undefined,
          onModelChange: (model) => handleModelChange(newNode.id, model),
          onEdit: (newData) => handleEditNode(newNode.id, newData),
          onDelete: () => handleDeleteNode(newNode.id),
          onCopy: (data) => handleCopy(data),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, models, handleModelChange, handleEditNode, handleDeleteNode]
  );

  /**
   * Handles saving the agent configuration
   */
  const handleSave = async (agentData) => {
    setLoading(true);
    await onSave({
      agentData,
      nodes,
      edges,
    });
    setLoading(false);
  };

  // Expose save function to window
  React.useEffect(() => {
    window.saveAgent = () => setIsDialogOpen(true);
    return () => {
      delete window.saveAgent;
    };
  }, [setIsDialogOpen]);

  /**
   * Handles toggling fullscreen mode
   */
  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  // Handle custom node addition events
  React.useEffect(() => {
    const handleAddNode = (event) => {
      const newNode = event.detail;
      setNodes((nds) => nds.concat({
        ...newNode,
        data: {
          ...newNode.data,
          model: undefined,
          description: newNode.data.type === 'tool' ? '' : undefined,
          toolType: newNode.data.type === 'tool' ? '' : undefined,
          onModelChange: (model) => handleModelChange(newNode.id, model),
          onEdit: (newData) => handleEditNode(newNode.id, newData),
          onDelete: () => handleDeleteNode(newNode.id),
          onCopy: (data) => handleCopy(data),
        },
      }));
    };

    window.addEventListener('addNode', handleAddNode);
    return () => window.removeEventListener('addNode', handleAddNode);
  }, [models, handleModelChange, handleEditNode, handleDeleteNode]);

  // Track unsaved changes
  React.useEffect(() => {
    const nodesWithoutCallbacks = nodes.map((node) => ({
      ...node,
      height: null,
      width: null,
      data: {
        ...node.data,
        onModelChange: undefined,
        onEdit: undefined,
        onDelete: undefined,
        onCopy: undefined,
      },
    }));

    // Remove height and width from nodes
    nodesWithoutCallbacks.forEach((node) => {
      delete node.height;
      delete node.width;
    });

    // Compare with initial state
    const hasNodeChanges = JSON.stringify(nodesWithoutCallbacks) !== JSON.stringify(initialNodes);
    const hasEdgeChanges = JSON.stringify(edges) !== JSON.stringify(initialEdges);

    setHasUnsavedChanges(hasNodeChanges || hasEdgeChanges);

    // Expose hasUnsavedChanges to window for MainNav
    window.hasUnsavedChanges = hasNodeChanges || hasEdgeChanges;

    return () => {
      delete window.hasUnsavedChanges;
    };
  }, [nodes, edges, initialNodes, initialEdges]);

  // Handle unsaved changes warning
  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <Stack spacing={4}>
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <CircularProgress />
        </Box>
      )}
      {snackbar.open && (
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ open: false, message: '' })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert icon={false} severity="success" sx={{ display: 'flex', alignItems: 'center' }} style={{ display: 'flex', alignItems: 'center' }}><Copy style={{ marginRight: 10, height: 15, width: 15 }} />{snackbar.message}</Alert>
        </Snackbar>
      )}
      <Card ref={reactFlowWrapper} sx={{ height: '85vh', position: 'relative' }}>
        <AgentToolbar />
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onModelChange: handleModelChange.bind(null, node.id),
              onOpenModelForm: handleOpenModelForm.bind(null, node.id),
              models,
            }
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={4}
        >
          <Background />
          <Controls
            showZoom={true}
            showFitView={false}
            showInteractive={false}
          >
            <ControlButton onClick={handleFullscreen} title="Fullscreen">
              <ArrowsOut />
            </ControlButton>
          </Controls>
        </ReactFlow>
      </Card>

      <CreateAgentDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleSave}
        initialData={initialData}
        isEdit={isEdit}
        isLoading={loading}
      />

      {isModelFormOpen && (
        <ClickAwayListener onClickAway={() => setIsModelFormOpen(false)}>
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 1,
              zIndex: 1000,
            }}
          >
            <CreateModelForm onSubmit={handleModelCreated} />
          </Box>
        </ClickAwayListener>
      )}

      <Dialog
        fullScreen
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'background.default'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setIsFullscreen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 2,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <XIcon />
          </IconButton>
          <ReactFlow
            nodes={nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                onModelChange: handleModelChange.bind(null, node.id),
                onOpenModelForm: handleOpenModelForm.bind(null, node.id),
                models,
              }
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={4}
          >
            <Background />
            <Controls
              showZoom={true}
              showFitView={false}
              showInteractive={false}
            />
          </ReactFlow>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};
