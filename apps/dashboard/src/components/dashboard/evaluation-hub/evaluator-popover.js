/**
 * @fileoverview Evaluator Details Panel Component
 * 
 * This component implements the View part of the MVVM pattern for the Evaluator details panel.
 * It displays and manages evaluator details, delegating business logic to the ViewModel.
 * 
 * Responsibilities:
 * - Display evaluator details
 * - Handle user interactions for editing
 * - Manage UI state for forms and dialogs
 * - Coordinate with ViewModel for data operations
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import { format, isValid } from 'date-fns';
import {
    X,
    PencilSimple,
    Check,
    ArrowsOutSimple,
    Clock,
    ChartLine,
    Code,
    Trash,
    Plus,
    MagnifyingGlass,
    Key,
    Robot,
    Brain
} from '@phosphor-icons/react/dist/ssr';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha } from '@mui/material/styles';
import { EvaluationHubViewModel } from './evaluation-hub-view-model';

/**
 * Evaluator Details Panel Component
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.evaluator - The evaluator data to display
 * @param {Function} props.onClose - Function to call when the panel should close
 * @param {Function} props.onUpdate - Function to call when evaluator data is updated
 * @param {boolean} props.open - Whether the panel is open
 * @param {boolean} props.isCreating - Whether the panel is in creation mode
 * @returns {JSX.Element} The rendered evaluator details panel
 */
export function EvaluatorPopover({ evaluator, onClose, onUpdate, open, isCreating }) {
    // Initialize view model
    const viewModel = React.useMemo(() => new EvaluationHubViewModel(), []);

    // State for related nodes
    const [relatedNodes, setRelatedNodes] = React.useState(
        isCreating ? [] : evaluator?.relatedNodes || []
    );

    // State for prompt editing
    const [isEditingPrompt, setIsEditingPrompt] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [currentPrompt, setCurrentPrompt] = React.useState(evaluator?.prompt || '');

    // State for node linking dialog
    const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    // State for LLM configuration
    const [llmConfig, setLlmConfig] = React.useState(evaluator?.llmConfig || {
        provider: 'OpenAI',
        model: 'GPT-4',
        temperature: 0.7,
        maxTokens: 2000
    });

    // State for token management dialog
    const [isTokenDialogOpen, setIsTokenDialogOpen] = React.useState(false);
    const [newToken, setNewToken] = React.useState('');

    // State for name editing
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [newName, setNewName] = React.useState(evaluator?.name || '');

    // State for description editing
    const [isEditingDescription, setIsEditingDescription] = React.useState(false);
    const [newDescription, setNewDescription] = React.useState(evaluator?.description || '');

    // Update states when evaluator changes
    React.useEffect(() => {
        if (evaluator) {
            setRelatedNodes(evaluator.relatedNodes || []);
            setCurrentPrompt(evaluator.prompt || '');
            setLlmConfig(evaluator.llmConfig || {
                provider: 'OpenAI',
                model: 'GPT-4',
                temperature: 0.7,
                maxTokens: 2000
            });
            setNewName(evaluator.name || '');
            setNewDescription(evaluator.description || '');
        }
    }, [evaluator]);

    // Handle prompt save
    const handleSavePrompt = () => {
        if (viewModel.validateEvaluatorData({ prompt: currentPrompt })) {
            onUpdate?.({
                ...evaluator,
                prompt: currentPrompt
            });
            setIsEditingPrompt(false);
        }
    };

    // Handle node removal
    const handleRemoveNode = (nodeId) => {
        const updatedNodes = relatedNodes.filter(node => node.id !== nodeId);
        setRelatedNodes(updatedNodes);
        onUpdate?.({
            ...evaluator,
            relatedNodes: updatedNodes
        });
    };

    // Handle node linking
    const handleLinkNode = (node) => {
        const updatedNodes = [...relatedNodes, node];
        setRelatedNodes(updatedNodes);
        onUpdate?.({
            ...evaluator,
            relatedNodes: updatedNodes
        });
        setIsAddNodeDialogOpen(false);
        setSearchQuery('');
    };

    // Handle provider change
    const handleProviderChange = (event) => {
        const newProvider = event.target.value;
        const provider = viewModel.getAvailableProviders().find(p => p.name === newProvider);
        const newConfig = {
            ...llmConfig,
            provider: newProvider,
            model: provider.models[0]
        };
        setLlmConfig(newConfig);
        onUpdate?.({
            ...evaluator,
            llmConfig: newConfig
        });
    };

    // Handle model change
    const handleModelChange = (event) => {
        const newConfig = {
            ...llmConfig,
            model: event.target.value
        };
        setLlmConfig(newConfig);
        onUpdate?.({
            ...evaluator,
            llmConfig: newConfig
        });
    };

    // Handle token update
    const handleTokenUpdate = () => {
        if (newToken) {
            const newConfig = {
                ...llmConfig,
                token: newToken.slice(0, 4) + '****' + newToken.slice(-4)
            };
            setLlmConfig(newConfig);
            onUpdate?.({
                ...evaluator,
                llmConfig: newConfig
            });
            setNewToken('');
            setIsTokenDialogOpen(false);
        }
    };

    // Handle name update
    const handleNameUpdate = () => {
        if (newName.trim() && viewModel.validateEvaluatorData({ name: newName })) {
            onUpdate?.({
                ...evaluator,
                name: newName.trim()
            });
            setIsEditingName(false);
        }
    };

    // Handle description update
    const handleDescriptionUpdate = () => {
        onUpdate?.({
            ...evaluator,
            description: newDescription
        });
        setIsEditingDescription(false);
    };

    // Format the last evaluation date safely
    const formatLastEvaluation = (dateString) => {
        if (!dateString) return 'No evaluation date';
        const date = new Date(dateString);
        return isValid(date) ? format(date, 'MMM dd, yyyy HH:mm') : 'Invalid date';
    };

    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: 500,
                        p: 3,
                        bgcolor: 'background.default',
                    },
                }}
            >
                {/* Header with close button */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    pb: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {isCreating ? 'Create New Evaluator' : 'Evaluator Details'}
                    </Typography>
                    <Tooltip title="Close">
                        <IconButton onClick={onClose} size="small">
                            <X weight="bold" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Stack spacing={4}>
                    {/* Evaluator Header */}
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            {isCreating ? (
                                <TextField
                                    fullWidth
                                    placeholder="Enter evaluator name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    size="small"
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {evaluator?.name}
                                    </Typography>
                                    <Tooltip title="Edit Name">
                                        <IconButton
                                            onClick={() => setIsEditingName(true)}
                                            size="small"
                                            sx={{
                                                color: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: 'primary.lighter',
                                                },
                                            }}
                                        >
                                            <PencilSimple weight="bold" size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                                label={evaluator?.type}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 500 }}
                            />
                            <Chip
                                label={evaluator?.status}
                                size="small"
                                color={evaluator?.status === 'Active' ? 'success' : 'default'}
                                sx={{ fontWeight: 500 }}
                            />
                        </Stack>
                        <Box sx={{ position: 'relative' }}>
                            {isEditingDescription ? (
                                <>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        placeholder="Enter evaluator description"
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        size="small"
                                    />
                                    <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'flex-end' }}>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                setIsEditingDescription(false);
                                                setNewDescription(evaluator?.description || '');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={handleDescriptionUpdate}
                                        >
                                            Save
                                        </Button>
                                    </Stack>
                                </>
                            ) : (
                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, flex: 1 }}>
                                        {evaluator?.description || 'No description'}
                                    </Typography>
                                    <Tooltip title="Edit Description">
                                        <IconButton
                                            onClick={() => setIsEditingDescription(true)}
                                            size="small"
                                            sx={{
                                                color: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: 'primary.lighter',
                                                },
                                            }}
                                        >
                                            <PencilSimple weight="bold" size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            )}
                        </Box>
                    </Box>

                    {/* Evaluation Prompt */}
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Code weight="bold" size={20} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Evaluation Prompt
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
                                    <Button
                                        startIcon={<ArrowsOutSimple weight="bold" />}
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        size="small"
                                        variant="outlined"
                                    >
                                        {isExpanded ? 'Collapse' : 'Expand'}
                                    </Button>
                                </Tooltip>
                                {!isEditingPrompt ? (
                                    <Tooltip title="Edit Prompt">
                                        <Button
                                            startIcon={<PencilSimple weight="bold" />}
                                            onClick={() => setIsEditingPrompt(true)}
                                            size="small"
                                        >
                                            Edit
                                        </Button>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Save Changes">
                                        <Button
                                            startIcon={<Check weight="bold" />}
                                            onClick={handleSavePrompt}
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                        >
                                            Save
                                        </Button>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Box>
                        <Paper
                            elevation={0}
                            sx={{
                                bgcolor: 'background.neutral',
                                p: 2,
                                borderRadius: 1,
                                maxHeight: isExpanded ? 'none' : '200px',
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: 'transparent',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: 'rgba(0,0,0,0.1)',
                                    borderRadius: '4px',
                                },
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <TextField
                                fullWidth
                                multiline
                                rows={isExpanded ? 20 : 8}
                                value={currentPrompt}
                                onChange={(e) => setCurrentPrompt(e.target.value)}
                                disabled={!isEditingPrompt}
                                variant="standard"
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6,
                                        '& .MuiInputBase-input': {
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        },
                                    },
                                }}
                            />
                        </Paper>
                    </Box>


                    {/* Related Nodes */}
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <Code weight="bold" size={20} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Related Nodes
                            </Typography>
                            <Tooltip title="Add Node">
                                <IconButton
                                    onClick={() => setIsAddNodeDialogOpen(true)}
                                    size="small"
                                    sx={{
                                        ml: 'auto',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'primary.lighter',
                                        },
                                    }}
                                >
                                    <Plus weight="bold" size={20} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Stack spacing={1.5}>
                            {relatedNodes.map((node) => (
                                <Paper
                                    key={node.id}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: 1,
                                        bgcolor: 'background.neutral',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                            transform: 'translateX(4px)',
                                        },
                                        position: 'relative',
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {node.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {node.type}
                                            </Typography>
                                        </Box>
                                        <Tooltip title="Remove Node">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveNode(node.id);
                                                }}
                                                size="small"
                                                sx={{
                                                    color: 'error.main',
                                                    '&:hover': {
                                                        bgcolor: 'error.lighter',
                                                    },
                                                }}
                                            >
                                                <Trash weight="bold" size={16} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>

                    {/* LLM Configuration */}
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <Brain weight="bold" size={20} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                LLM Configuration
                            </Typography>
                        </Stack>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: 'background.neutral',
                            }}
                        >
                            <Stack spacing={2}>
                                {/* Provider Selection */}
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Provider
                                    </Typography>
                                    <TextField
                                        select
                                        fullWidth
                                        value={llmConfig.provider}
                                        onChange={handleProviderChange}
                                        size="small"
                                    >
                                        {viewModel.getAvailableProviders().map((provider) => (
                                            <MenuItem key={provider.name} value={provider.name}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography>{provider.icon}</Typography>
                                                    <Typography>{provider.name}</Typography>
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                {/* Model Selection */}
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Model
                                    </Typography>
                                    <TextField
                                        select
                                        fullWidth
                                        value={llmConfig.model}
                                        onChange={handleModelChange}
                                        size="small"
                                    >
                                        {viewModel.getAvailableProviders()
                                            .find(p => p.name === llmConfig.provider)
                                            ?.models.map((model) => (
                                                <MenuItem key={model} value={model}>
                                                    {model}
                                                </MenuItem>
                                            ))}
                                    </TextField>
                                </Box>

                                {/* API Token */}
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        API Token
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            fullWidth
                                            value={llmConfig.token}
                                            size="small"
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Key size={20} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => setIsTokenDialogOpen(true)}
                                            size="small"
                                        >
                                            Update
                                        </Button>
                                    </Stack>
                                </Box>

                                {/* Advanced Settings */}
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Advanced Settings
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Temperature"
                                            type="number"
                                            value={llmConfig.temperature}
                                            onChange={(e) => {
                                                const newConfig = {
                                                    ...llmConfig,
                                                    temperature: parseFloat(e.target.value)
                                                };
                                                setLlmConfig(newConfig);
                                                onUpdate?.({
                                                    ...evaluator,
                                                    llmConfig: newConfig
                                                });
                                            }}
                                            size="small"
                                            inputProps={{ min: 0, max: 1, step: 0.1 }}
                                            sx={{ width: '50%' }}
                                        />
                                        <TextField
                                            label="Max Tokens"
                                            type="number"
                                            value={llmConfig.maxTokens}
                                            onChange={(e) => {
                                                const newConfig = {
                                                    ...llmConfig,
                                                    maxTokens: parseInt(e.target.value)
                                                };
                                                setLlmConfig(newConfig);
                                                onUpdate?.({
                                                    ...evaluator,
                                                    llmConfig: newConfig
                                                });
                                            }}
                                            size="small"
                                            inputProps={{ min: 1, step: 100 }}
                                            sx={{ width: '50%' }}
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </Paper>
                    </Box>

                    {/* Last Evaluation */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'text.secondary',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Clock weight="bold" size={16} />
                        <Typography variant="body2">
                            Last Evaluation: {formatLastEvaluation(evaluator?.lastEvaluation)}
                        </Typography>
                    </Box>

                    {/* Action Buttons for Creation Mode */}
                    {isCreating && (
                        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button
                                    onClick={onClose}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (viewModel.validateEvaluatorData({ name: newName })) {
                                            onUpdate?.({
                                                ...evaluator,
                                                name: newName.trim()
                                            });
                                        }
                                    }}
                                    variant="contained"
                                    disabled={!newName.trim()}
                                    sx={{
                                        backgroundImage: 'none',
                                        backgroundColor: 'primary.main',
                                        '&:hover': {
                                          backgroundImage: 'none',
                                          backgroundColor: 'primary.light',
                                        },
                                      }}
                                >
                                    Create Evaluator
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </Stack>
            </Drawer>

            {/* Add Node Dialog */}
            <Dialog
                open={isAddNodeDialogOpen}
                onClose={() => {
                    setIsAddNodeDialogOpen(false);
                    setSearchQuery('');
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6">Link New Node</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        placeholder="Search nodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ mb: 2, mt: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MagnifyingGlass size={20} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {viewModel.getAvailableNodes()
                            .filter(node => !relatedNodes.some(linkedNode => linkedNode.id === node.id))
                            .filter(node =>
                                node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                node.type.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((node) => (
                                <ListItem key={node.id} disablePadding>
                                    <ListItemButton
                                        onClick={() => handleLinkNode(node)}
                                        sx={{
                                            borderRadius: 1,
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={node.name}
                                            secondary={node.type}
                                            primaryTypographyProps={{
                                                variant: 'subtitle1',
                                                fontWeight: 600,
                                            }}
                                        />
                                        <Chip
                                            label="Link"
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        {viewModel.getAvailableNodes().length === 0 && (
                            <ListItem>
                                <ListItemText
                                    primary="No nodes found"
                                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                                />
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setIsAddNodeDialogOpen(false);
                            setSearchQuery('');
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Token Update Dialog */}
            <Dialog
                open={isTokenDialogOpen}
                onClose={() => {
                    setIsTokenDialogOpen(false);
                    setNewToken('');
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Key weight="bold" size={24} />
                        <Typography variant="h6">Update API Token</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="New API Token"
                        value={newToken}
                        onChange={(e) => setNewToken(e.target.value)}
                        sx={{ mt: 2 }}
                        placeholder="Enter your new API token"
                        type="password"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setIsTokenDialogOpen(false);
                            setNewToken('');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTokenUpdate}
                        variant="contained"
                        disabled={!newToken}
                    >
                        Update Token
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Name Edit Dialog */}
            <Dialog
                open={isEditingName}
                onClose={() => {
                    setIsEditingName(false);
                    setNewName(evaluator?.name || '');
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PencilSimple weight="bold" size={24} />
                        <Typography variant="h6">Edit Evaluator Name</Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Evaluator Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        sx={{ mt: 2 }}
                        placeholder="Enter evaluator name"
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setIsEditingName(false);
                            setNewName(evaluator?.name || '');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleNameUpdate}
                        variant="contained"
                        disabled={!newName.trim()}
                    >
                        Update Name
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
} 