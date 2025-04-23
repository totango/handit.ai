/**
 * Custom Node Component
 * 
 * A customizable node component for the agent flow editor.
 * Provides a visual representation of model and tool nodes with
 * configurable inputs/outputs, model selection, and editing capabilities.
 */

import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Copy, PencilSimple as EditIcon, Plus as PlusIcon, Trash as TrashIcon } from '@phosphor-icons/react';
import { Handle, Position, useReactFlow, useUpdateNodeInternals } from 'reactflow';

import * as agentService from '../../../services/agentsService.js';
import { ModelSelector } from './model-selector';

/**
 * Node color mapping for different node types
 * @type {Object.<string, string>}
 */
const nodeColors = {
  model: 'var(--mui-palette-primary-lighter)',
  tool: 'var(--mui-palette-warning-lighter)',
};

/**
 * CustomNode Component
 * 
 * A customizable node component for the agent flow editor that represents
 * either a model or tool node. Supports configurable inputs/outputs,
 * model selection, and editing capabilities.
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the node
 * @param {Object} props.data - Node data including type, label, and configuration
 * @param {boolean} props.isConnectable - Whether the node can be connected
 * @returns {JSX.Element} The custom node component
 */
export const CustomNode = React.memo(({ id, data, isConnectable }) => {
  // ReactFlow hooks
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // Node state
  const [selectedModel, setSelectedModel] = React.useState(data.model);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  // Reference to previous data for comparison
  const prevDataRef = React.useRef(data);

  // Edit form state
  const [editData, setEditData] = React.useState({
    label: data.label,
    description: data.description || '',
    toolType: data.toolType || '',
    inputs: data.inputs || [{ id: 'in-1', label: 'Input' }],
    outputs: data.outputs || [{ id: 'out-1', label: 'Output' }],
  });

  // Open dialog if just created
  React.useEffect(() => {
    if (data.justCreated) {
      if (data.type === 'tool') {
        setIsEditDialogOpen(true);
      }
      // For both types, clear justCreated after opening
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, justCreated: false } } : node
        )
      );
    }
  }, [data.justCreated, data.type, id, setNodes]);

  // Update edit data when node data changes
  React.useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      prevDataRef.current = data;
      setEditData((prev) => ({
        ...prev,
        label: data.label,
        description: data.description || '',
        toolType: data.toolType || '',
        inputs: data.inputs || prev.inputs,
        outputs: data.outputs || prev.outputs,
      }));
    }
  }, [data]);

  // Update node internals when handles change
  React.useEffect(() => {
    if (id && (editData.inputs !== prevDataRef.current?.inputs || editData.outputs !== prevDataRef.current?.outputs)) {
      updateNodeInternals(id);
    }
  }, [id, editData.inputs, editData.outputs, updateNodeInternals]);

  /**
   * Adds a new input handle to the node
   */
  const handleAddInput = () => {
    const newInputs = [
      ...editData.inputs,
      {
        id: `in-${editData.inputs.length + 1}`,
        label: `Input ${editData.inputs.length + 1}`,
      },
    ];

    const newData = {
      ...editData,
      inputs: newInputs,
    };

    setEditData(newData);

    if (data.onEdit) {
      data.onEdit(newData);
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, inputs: newInputs } };
          }
          return node;
        })
      );
      updateNodeInternals(id);
    }
  };

  /**
   * Adds a new output handle to the node
   */
  const handleAddOutput = () => {
    const newOutputs = [
      ...editData.outputs,
      {
        id: `out-${editData.outputs.length + 1}`,
        label: `Output ${editData.outputs.length + 1}`,
      },
    ];

    const newData = {
      ...editData,
      outputs: newOutputs,
    };

    setEditData(newData);

    if (data.onEdit) {
      data.onEdit(newData);
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, outputs: newOutputs } };
          }
          return node;
        })
      );
      updateNodeInternals(id);
    }
  };

  /**
   * Updates the label of a handle
   * @param {string} type - The type of handle ('inputs' or 'outputs')
   * @param {number} index - The index of the handle to update
   * @param {string} newLabel - The new label for the handle
   */
  const handleUpdateHandle = (type, index, newLabel) => {
    const newHandles = editData[type].map((handle, i) => (i === index ? { ...handle, label: newLabel } : handle));

    const newData = {
      ...editData,
      [type]: newHandles,
    };

    setEditData(newData);

    if (data.onEdit) {
      data.onEdit(newData);
      updateNodeInternals(id);
    }
  };

  /**
   * Deletes a handle from the node
   * @param {string} type - The type of handle ('inputs' or 'outputs')
   * @param {number} index - The index of the handle to delete
   */
  const handleDeleteHandle = (type, index) => {
    const newHandles = editData[type].filter((_, i) => i !== index);

    const newData = {
      ...editData,
      [type]: newHandles,
    };

    setEditData(newData);

    if (data.onEdit) {
      data.onEdit(newData);
      updateNodeInternals(id);
    }
  };

  /**
   * Renders the input or output handles for the node
   * @param {Array} handles - Array of handle configurations
   * @param {string} type - The type of handle ('target' or 'source')
   * @param {Position} position - The position of the handles
   * @returns {JSX.Element|null} The rendered handles or null
   */
  const renderHandles = (handles, type, position) => {
    if (!handles) return null;

    return handles.map((handle, index) => (
      <React.Fragment key={handle.id}>
        <Handle
          type={type}
          position={position}
          id={handle.id}
          isConnectable={isConnectable}
          style={{
            width: 8,
            height: 8,
            background: nodeColors[data.type],
            border: '1px solid #fff',
            [position === Position.Top ? 'top' : 'bottom']: '8px',
            left: `${(index + 1) * (100 / (handles.length + 1))}%`,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            color: 'text.secondary',
            position: 'absolute',
            left: `${(index + 1) * (100 / (handles.length + 1))}%`,
            transform: 'translateX(-50%)',
            [position === Position.Top ? 'top' : 'bottom']: '24px',
          }}
        >
          {handle.label}
        </Typography>
      </React.Fragment>
    ));
  };

  /**
   * Handles model selection changes
   * @param {string} modelId - The ID of the selected model
   */
  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    if (data.onModelChange) {
      data.onModelChange(modelId);
    }
  };

  /**
   * Handles form submission for node editing
   */
  const handleEditSubmit = () => {
    if (data.onEdit) {
      const updatedData = {
        ...editData,
        model: selectedModel,
        type: data.type,
        position: data.position,
      };

      data.onEdit(updatedData);
    }

    setIsEditDialogOpen(false);
  };
  console.log(data);
  return (
    <>
      <Card
        sx={{
          padding: 1.5,
          borderRadius: 2,
          minWidth: 250,
          backgroundColor: nodeColors[data.type] || 'white',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          pt: 4,
          pb: 4,
        }}
      >
        {/* Input handles */}
        {renderHandles(data.inputs || editData.inputs, 'target', Position.Top)}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'relative', zIndex: 0 }}>
          {/* Node header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {data.label}
            </Typography>
            <Box>
              {/* Copy button */}
              {data.slug && data.slug.length > 0 && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(data.slug);
                    if (data.onCopy) {
                      data.onCopy(data);
                    }
                  }}
                >
                  <Copy />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  data.onDelete();
                }}
              >
                <TrashIcon />
              </IconButton>
            </Box>
          </Box>


          {data.type === 'model' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
              <ModelSelector value={selectedModel} onChange={handleModelChange} isModelNode autoOpen={!!data.justCreated}/>
            </Box>
          )}
          {data.type === 'tool' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
                }}
                sx={{
                  textTransform: 'none',
                  cursor: 'pointer',
                  borderColor: '#45A495',
                  color: '#45A495',
                  '&:hover': {
                    borderColor: '#45A495',
                    color: '#45A495',
                  },
                }}
              >
                Edit {data.label}
              </Button>
            </Box>
          )}

          {data.type === 'tool' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data.toolType && (
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: 'var(--mui-palette-warning-main)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    alignSelf: 'flex-start',
                  }}
                >
                  Edit {data.toolType}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Output handles */}
        {renderHandles(data.outputs || editData.outputs, 'source', Position.Bottom)}
      </Card>

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{data.type === 'tool' ? 'Edit Tool' : 'Edit Node'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Node label */}
            <TextField
              autoFocus
              name="label"
              label="Label"
              fullWidth
              value={editData.label}
              onChange={(e) => setEditData((prev) => ({ ...prev, label: e.target.value }))}
            />
            {/* Node description */}
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
            {/* Tool type (for tool nodes) */}
            {data.type === 'tool' && (
              <>
                <TextField
                  label="Tool Type"
                  fullWidth
                  value={editData.toolType}
                  onChange={(e) => setEditData((prev) => ({ ...prev, toolType: e.target.value }))}
                  placeholder="e.g., HTTP, Database, File System"
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={editData.description}
                  onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this tool does..."
                />
              </>
            )}
            {/* Input handles */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">Inputs</Typography>
                <Button size="small" startIcon={<PlusIcon />} onClick={handleAddInput}>
                  Add Input
                </Button>
              </Box>
              <List dense>
                {editData.inputs.map((handle, index) => (
                  <ListItem key={handle.id}>
                    <TextField
                      size="small"
                      fullWidth
                      value={handle.label}
                      onChange={(e) => handleUpdateHandle('inputs', index, e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDeleteHandle('inputs', index)}
                        disabled={editData.inputs.length === 1}
                      >
                        <TrashIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
            {/* Output handles */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">Outputs</Typography>
                <Button size="small" startIcon={<PlusIcon />} onClick={handleAddOutput}>
                  Add Output
                </Button>
              </Box>
              <List dense>
                {editData.outputs.map((handle, index) => (
                  <ListItem key={handle.id}>
                    <TextField
                      size="small"
                      fullWidth
                      value={handle.label}
                      onChange={(e) => handleUpdateHandle('outputs', index, e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDeleteHandle('outputs', index)}
                        disabled={editData.outputs.length === 1}
                      >
                        <TrashIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
