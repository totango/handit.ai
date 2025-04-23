/**
 * Model Versions Management Page Component
 * 
 * This page provides a comprehensive interface for managing and comparing model versions with:
 * - Version comparison and analysis
 * - Prompt version management
 * - Deployment controls
 * - Automated insights
 * - Model selection and filtering
 * 
 * The component uses RTK Query for data management and provides
 * a user-friendly interface for version control and deployment.
 */
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useCreatePromptMutation,
  useGetAgentByIdAutonomQuery,
  useGetPromptVersionsQuery,
  useReleasePromptMutation,
} from '@/services/promptService';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { AutomatedInsights } from '@/components/dashboard/automated-insights/automated-insights';
import { PromptVersionComparison } from '@/components/dashboard/models/prompt-version-comparison';

/**
 * Main model versions management page component
 * Handles version comparison, deployment, and automated insights
 * @returns {JSX.Element} The model versions management interface
 */
export default function ModelVersionsPage() {
  // Extract agent ID from URL parameters
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId');

  // Fetch agent data
  const { data: agent, isLoading } = useGetAgentByIdAutonomQuery(agentId, { skip: !agentId });

  // State management for model selection and comparison
  const [selectedModel, setSelectedModel] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [rightPromptVersion, setRightPromptVersion] = React.useState(null);
  const [leftPromptVersion, setLeftPromptVersion] = React.useState(null);
  const [leftAccuracy, setLeftAccuracy] = React.useState(null);
  const [rightAccuracy, setRightAccuracy] = React.useState(null);

  // State management for new version creation
  const [isNewVersionDialogOpen, setIsNewVersionDialogOpen] = React.useState(false);
  const [newPromptText, setNewPromptText] = React.useState('');
  const [createAndDeploy, setCreateAndDeploy] = React.useState(false);
  const [error, setError] = React.useState('');

  // RTK Query mutations and queries
  const [createPrompt, { isLoading: isCreating }] = useCreatePromptMutation();
  const [releasePrompt, { isLoading: isReleasing }] = useReleasePromptMutation();
  const { refetch: refetchPromptVersions } = useGetPromptVersionsQuery(selectedModel?.modelId || selectedModel?.id, {
    skip: !selectedModel,
  });

  // State management for deployment
  const [deployDialogOpen, setDeployDialogOpen] = React.useState(false);
  const [deployTarget, setDeployTarget] = React.useState(null); // 'left' or 'right'
  const [deployError, setDeployError] = React.useState('');
  const [deploySuccess, setDeploySuccess] = React.useState(false);

  // Store the latest left/right prompt version objects
  const [leftPromptVersionObj, setLeftPromptVersionObj] = React.useState(null);
  const [rightPromptVersionObj, setRightPromptVersionObj] = React.useState(null);

  /**
   * Extract and transform models from agent data
   * Filters nodes to only include model types and formats their data
   */
  const models = React.useMemo(() => {
    if (!agent?.data?.nodes) return [];
    return agent.data.nodes
      .filter((node) => node.type === 'model' && node.Model)
      .map((node) => ({
        id: node.id,
        name: node.name,
        problemType: node.Model?.problemType || 'Unknown',
        provider: node.Model?.provider || '',
        modelId: node.modelId,
        ...node.Model,
      }));
  }, [agent]);

  /**
   * Filter models based on search input
   * Case-insensitive search on model names
   */
  const filteredModels = React.useMemo(() => {
    if (!models) return [];
    return models.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  }, [models, search]);

  // Set default selected model when models are loaded
  React.useEffect(() => {
    if (!selectedModel && filteredModels.length > 0) {
      setSelectedModel(filteredModels[0]);
    }
  }, [filteredModels, selectedModel]);

  // Update selected model when agent changes
  React.useEffect(() => {
    if (filteredModels.length > 0) {
      if (filteredModels.length > 0) {
        if (selectedModel && !filteredModels.find((m) => m.id === selectedModel.id)) {
          setSelectedModel(filteredModels[0]);
        }
      }
    }
  }, [agentId, filteredModels]);

  /**
   * Handle changes to left model selection
   * Updates both version and version object state
   */
  function handleLeftModelChange(v) {
    setLeftPromptVersion(v);
    setLeftPromptVersionObj(v);
  }

  /**
   * Handle changes to right model selection
   * Updates both version and version object state
   */
  function handleRightModelChange(v) {
    setRightPromptVersion(v);
    setRightPromptVersionObj(v);
  }

  /**
   * Handle submission of new prompt version
   * Creates new version and optionally deploys it
   */
  const handleNewVersionSubmit = async () => {
    setError('');
    try {
      const modelId = selectedModel?.modelId || selectedModel?.id;
      const result = await createPrompt({ modelId, prompt: newPromptText }).unwrap();
      if (createAndDeploy) {
        await releasePrompt({ modelId, version: result.data.version, originalModelId: modelId }).unwrap();
      }
      if (selectedModel) {
        await refetchPromptVersions();
      }
      setIsNewVersionDialogOpen(false);
      setNewPromptText('');
      setCreateAndDeploy(false);
    } catch (err) {
      setError(err?.data?.message || 'Failed to create prompt version.');
    }
  };

  /**
   * Handle deployment confirmation
   * Deploys the selected version and updates UI state
   */
  async function handleDeployConfirm() {
    setDeployError('');
    try {
      const isLeft = deployTarget === 'left';
      const versionObj = isLeft ? leftPromptVersionObj : rightPromptVersionObj;
      const modelId = versionObj?.modelId;
      const version = versionObj?.originalVersion;
      if (!modelId || !version) throw new Error('Missing model or version');
      await releasePrompt({ modelId, version, originalModelId: selectedModel.id }).unwrap();
      setDeployDialogOpen(false);
      setDeployTarget(null);
      setDeploySuccess(true);
      await refetchPromptVersions();
    } catch (err) {
      setDeployError(err?.data?.message || err?.message || 'Failed to deploy version.');
    }
  }

  /**
   * Format text for display in chips
   * Converts snake_case to Title Case
   */
  function formatChipText(text) {
    if (!text) return '';
    return text.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const bgColor = '#081b21';

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
        py: 8,
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        pb: '0px !important',
      }}
    >
      {/* Top Bar with Model Info and Actions */}
      <Card
        sx={{
          mb: 3,
          border: '1px solid var(--mui-palette-divider)',
          borderRadius: '8px',
          boxShadow: 'none',
          p: 0,
          background: bgColor,
        }}
      >
        {/* Title and Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2, pb: 1 }}>
          <Typography variant="h5" fontWeight={600} sx={{ fontSize: '1.4rem' }}>
            {selectedModel?.name || 'Select a model'}
          </Typography>
          <Stack direction="row" spacing={2}>
            {/* Deployment Selector */}
            <FormControl size="medium" sx={{ minWidth: 160 }}>
              <Select
                id="deploy-select"
                value={''}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) return 'Deploy';
                  if (selected === 'left') return `Deploy Version ${leftPromptVersionObj?.version}`;
                  if (selected === 'right') return `Deploy Version ${rightPromptVersionObj?.version}`;
                  return 'Deploy';
                }}
                onChange={(e) => {
                  setDeployTarget(e.target.value);
                  setDeployDialogOpen(true);
                }}
                disabled={!leftPromptVersionObj || !rightPromptVersionObj}
                sx={{
                  minWidth: 160,
                  height: 44,
                  fontSize: 16,
                  color: '#fff',
                  '.MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    height: 44,
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    fontSize: 16,
                    color: '#fff',
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00f7aa',
                    borderWidth: 2,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00d492',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00f7aa',
                  },
                }}
              >
                <MenuItem
                  value={'left'}
                  disabled={!leftPromptVersionObj}
                  sx={{ fontSize: 16, color: '#fff', background: 'none' }}
                >
                  Deploy Version {leftPromptVersionObj?.version}
                </MenuItem>
                <MenuItem
                  value={'right'}
                  disabled={!rightPromptVersionObj}
                  sx={{ fontSize: 16, color: '#fff', background: 'none' }}
                >
                  Deploy Version {rightPromptVersionObj?.version}
                </MenuItem>
              </Select>
            </FormControl>
            {/* New Version Button */}
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                background: 'transparent',
                border: '1px solid',
                borderColor: 'var(--mui-palette-OutlinedInput-border)',
                color: '#94e4c7',
                boxShadow: 'none',
                fontWeight: 500,
                '&:hover': {
                  background: 'rgba(0,247,170,0.08)',
                  borderColor: '#00d492',
                  boxShadow: 'none',
                },
              }}
              onClick={() => setIsNewVersionDialogOpen(true)}
            >
              New Version
            </Button>
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'var(--mui-palette-divider)', width: '100%' }} />
        {/* Model Information */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2 }}>
          <Typography variant="body1" color="white" sx={{ mr: 4 }}>
            <b>Problem Type:</b> {selectedModel?.problemType ? formatChipText(selectedModel.problemType) : '—'}
          </Typography>
          <Typography variant="body1" color="white" sx={{ mr: 4 }}>
            <b>Provider:</b> {selectedModel?.provider || '—'}
          </Typography>
        </Box>
      </Card>

      {/* New Version Creation Dialog */}
      <Dialog open={isNewVersionDialogOpen} onClose={() => setIsNewVersionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Version</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={8}
            value={newPromptText}
            onChange={(e) => setNewPromptText(e.target.value)}
            placeholder="Enter your prompt text here..."
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            disabled={isCreating || isReleasing}
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsNewVersionDialogOpen(false);
              setNewPromptText('');
              setCreateAndDeploy(false);
              setError('');
            }}
            sx={{ color: 'text.secondary' }}
            disabled={isCreating || isReleasing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNewVersionSubmit}
            variant="contained"
            disabled={!newPromptText.trim() || isCreating || isReleasing}
            sx={{
              backgroundImage: 'none',
              bgcolor: '#00f7aa',
              color: '#00282f',
              '&:hover': {
                backgroundImage: 'none',
                bgcolor: '#00d492',
              },
            }}
          >
            {isCreating || isReleasing ? 'Saving...' : createAndDeploy ? 'Create and Deploy' : 'Create Version'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deployment Confirmation Dialog */}
      <Dialog
        open={deployDialogOpen}
        onClose={() => {
          setDeployDialogOpen(false);
          setDeployTarget(null);
          setDeployError('');
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deployment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deploy Version{' '}
            {deployTarget === 'left' ? leftPromptVersionObj?.version : rightPromptVersionObj?.version}?
          </Typography>
          {deployError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {deployError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeployDialogOpen(false);
              setDeployTarget(null);
              setDeployError('');
            }}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeployConfirm}
            variant="contained"
            sx={{
              bgcolor: '#00f7aa',
              color: '#00282f',
              '&:hover': { bgcolor: '#00d492' },
              backgroundImage: 'none',
            }}
          >
            Deploy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={deploySuccess}
        autoHideDuration={3000}
        onClose={() => setDeploySuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setDeploySuccess(false)} severity="success" sx={{ width: '100%' }}>
          Deployment successful!
        </Alert>
      </Snackbar>

      {/* Main Content Grid */}
      <Grid container spacing={2}>
        {/* Left: Model Selector Panel */}
        <Grid item xs={12} md={2.5} sx={{ height: '71vh' }}>
          {isLoading ? (
            <Card sx={{ p: 2, height: '100%' }}>
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
            </Card>
          ) : (
            <Card sx={{ p: 2, height: '100%', backgroundColor: bgColor }}>
              <Typography
                variant="h6"
                sx={{ color: 'white', letterSpacing: 1, fontSize: 16, mb: 2 }}
              >
                Models
              </Typography>
              {/* Model Search Input */}
              <TextField
                size="medium"
                fullWidth
                style={{ color: 'white' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifyingGlass />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  input: { color: 'white' },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                  },
                }}
              />
              {/* Model List */}
              <List>
                {filteredModels.map((model) => (
                  <ListItem key={model.id} disablePadding>
                    <ListItemButton
                      selected={selectedModel?.id === model.id}
                      onClick={() => setSelectedModel(model)}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#082329',
                        },
                        '&.Mui-focusVisible': {
                          backgroundColor: 'rgba(20,28,32,255)',
                        },
                        ':hover': {
                          backgroundColor: 'rgba(20,28,32,255)',
                        },
                        border: 'none',
                        background: selectedModel?.id === model.id ? 'rgba(20,28,32,255)' : 'transparent',
                        color: selectedModel?.id === model.id ? '#94e4c7' : 'white',
                        fontWeight: selectedModel?.id === model.id ? 700 : 400,
                        fontSize: 20,
                        borderRadius: '8px',
                      }}
                    >
                      <Typography>{model.name}</Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Grid>

        {/* Center: Version Comparison Panel */}
        <Grid item xs={12} md={6.5} sx={{ height: '71vh' }}>
          {isLoading ? (
            <Card
              sx={{
                height: '100%',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
            >
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
            </Card>
          ) : selectedModel ? (
            <PromptVersionComparison
              bgColor={bgColor}
              modelId={selectedModel.modelId || selectedModel.id}
              onRightModelChange={(v) => {
                setRightPromptVersion(v);
                setRightPromptVersionObj(v);
              }}
              onLeftModelChange={(v) => {
                setLeftPromptVersion(v);
                setLeftPromptVersionObj(v);
              }}
              onLeftAccuracyChange={setLeftAccuracy}
              onRightAccuracyChange={setRightAccuracy}
            />
          ) : (
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Select a model to compare versions</Typography>
            </Card>
          )}
        </Grid>

        {/* Right: Automated Insights Panel */}
        <Grid item xs={12} md={3} sx={{ height: '71vh' }}>
          {isLoading ? (
            <Card sx={{ height: '100%', p: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
            </Card>
          ) : (
            <AutomatedInsights
              bgColor={bgColor}
              modelId={selectedModel?.modelId || selectedModel?.id}
              version={rightPromptVersion?.version}
              leftVersionNumber={leftPromptVersion?.version}
              rightVersionNumber={rightPromptVersion?.version}
              leftAccuracy={leftAccuracy}
              rightAccuracy={rightAccuracy}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
