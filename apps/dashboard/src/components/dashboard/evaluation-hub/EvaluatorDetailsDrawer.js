import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Drawer,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { X, PencilSimple, Plus, ArrowsOutSimple, Code, Check } from '@phosphor-icons/react/dist/ssr';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { useGetEvaluatorMetricsQuery } from '@/services/evaluatorMetricService';
import { useGetModelsQuery } from '@/services/modelsService';
import { useGetProvidersQuery } from '@/services/providerService';
import { useGetIntegrationTokensQuery, useCreateIntegrationTokenMutation } from '@/services/integrationTokenService';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { useUpdateEvaluationPromptMutation, useAssociatePromptToModelMutation, useUpdateAssociationMutation, useDeleteAssociationMutation } from '@/services/reviewersTemplateService';
import Menu from '@mui/material/Menu';

export default function EvaluatorDetailsDrawer({ open, onClose, evaluator, onUpdate }) {
  const [isEditing, setIsEditing] = useState(true);
  const [name, setName] = useState(evaluator?.name || '');
  const [prompt, setPrompt] = useState(evaluator?.prompt || '');
  const [metricId, setMetricId] = useState(evaluator?.metricId || evaluator?.metric || '');
  const [associations, setAssociations] = useState(evaluator?.associations || []);
  const [addAssocOpen, setAddAssocOpen] = useState(false);
  const [assocModelId, setAssocModelId] = useState('');
  const [assocProviderId, setAssocProviderId] = useState('');
  const [assocProviderModel, setAssocProviderModel] = useState('');
  const [assocTokenId, setAssocTokenId] = useState('');
  const [editingAssocModelId, setEditingAssocModelId] = useState(null);
  const [editProviderId, setEditProviderId] = useState('');
  const [editProviderModel, setEditProviderModel] = useState('');
  const [editTokenId, setEditTokenId] = useState('');
  const [metricDialogOpen, setMetricDialogOpen] = useState(false);
  const [newMetricName, setNewMetricName] = useState('');
  const [newMetricDescription, setNewMetricDescription] = useState('');
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenValue, setNewTokenValue] = useState('');
  const [tokenModelId, setTokenModelId] = useState(null);
  const [tokenProviderId, setTokenProviderId] = useState(null);
  
  // Token form state (similar to settings)
  const [tokenForm, setTokenForm] = useState({
    providerId: '',
    name: '',
    token: '',
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    authMethod: 'apiKey'
  });
  const [creatingMetric, setCreatingMetric] = useState(false);
  const [creatingToken, setCreatingToken] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [assocMenuAnchorEl, setAssocMenuAnchorEl] = useState(null);
  const [assocMenuModelId, setAssocMenuModelId] = useState(null);

  const [defaultProviderId, setDefaultProviderId] = useState(evaluator?.defaultIntegrationToken?.providerId || '');
  const [defaultProviderModel, setDefaultProviderModel] = useState(evaluator?.defaultProviderModel || '');
  const [defaultTokenId, setDefaultTokenId] = useState(evaluator?.defaultIntegrationToken?.id || '');

  const { data: metrics = [] } = useGetEvaluatorMetricsQuery();
  const { data: models = [] } = useGetModelsQuery();
  const { data: providers = [] } = useGetProvidersQuery();
  const { data: tokens = [] } = useGetIntegrationTokensQuery();
  const [createToken] = useCreateIntegrationTokenMutation();
  const [updatePrompt] = useUpdateEvaluationPromptMutation();
  const [associatePromptToModel] = useAssociatePromptToModelMutation();
  const [deleteAssociation] = useDeleteAssociationMutation();

  // Store original associations in a ref
  const originalAssociationsRef = useRef([]);
  useEffect(() => {
    if (open && evaluator) {
      // Store a deep copy of the original associations
      originalAssociationsRef.current = (evaluator.associations || evaluator.modelAssociations || []).map(a => ({ ...a }));
    }
  }, [open, evaluator]);

  // Reset state when drawer is closed or evaluator changes
  useEffect(() => {
    if (!open) {
      setName(evaluator?.name || '');
      setPrompt(evaluator?.prompt || '');
      setMetricId(evaluator?.metricId || evaluator?.metric || '');
      setAssociations(evaluator?.modelAssociations || []);
      setAddAssocOpen(false);
      setAssocModelId('');
      setAssocProviderId('');
      setAssocProviderModel('');
      setAssocTokenId('');
      setEditingAssocModelId(null);
      setEditProviderId('');
      setEditProviderModel('');
      setEditTokenId('');
      setMetricDialogOpen(false);
      setNewMetricName('');
      setNewMetricDescription('');
      setTokenDialogOpen(false);
      setNewTokenName('');
      setNewTokenValue('');
      setTokenModelId(null);
      setTokenProviderId(null);
      setTokenForm({ providerId: '', name: '', token: '', accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey' });
      setCreatingMetric(false);
      setCreatingToken(false);
      setIsEditingPrompt(false);
      setIsExpanded(false);
      setAssocMenuAnchorEl(null);
      setAssocMenuModelId(null);
      setDefaultProviderId(evaluator?.defaultIntegrationToken?.providerId || '');
      setDefaultProviderModel(evaluator?.defaultProviderModel || '');
      setDefaultTokenId(evaluator?.defaultIntegrationToken?.id || '');
    } else if (evaluator) {
      setName(evaluator.name || '');
      setPrompt(evaluator.prompt || '');
      setMetricId(evaluator.metricId || evaluator.metric || '');
      setAssociations(evaluator.modelAssociations || []);
      setAddAssocOpen(false);
      setAssocModelId('');
      setAssocProviderId('');
      setAssocProviderModel('');
      setAssocTokenId('');
      setEditingAssocModelId(null);
      setEditProviderId('');
      setEditProviderModel('');
      setEditTokenId('');
      setMetricDialogOpen(false);
      setNewMetricName('');
      setNewMetricDescription('');
      setTokenDialogOpen(false);
      setNewTokenName('');
      setNewTokenValue('');
      setTokenModelId(null);
      setTokenProviderId(null);
      setTokenForm({ providerId: '', name: '', token: '', accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey' });
      setCreatingMetric(false);
      setCreatingToken(false);
      setIsEditingPrompt(false);
      setIsExpanded(false);
      setAssocMenuAnchorEl(null);
      setAssocMenuModelId(null);
      setDefaultProviderId(evaluator?.defaultIntegrationToken?.providerId || '');
      setDefaultProviderModel(evaluator?.defaultProviderModel || '');
      setDefaultTokenId(evaluator?.defaultIntegrationToken?.id || '');
    }
  }, [open, evaluator]);

  // Add availableModels logic
  const associatedModelIds = associations.map(a => a.modelId);
  const availableModels = models.filter(m => !associatedModelIds.includes(m.id));

  // Check if the selected provider is AWSBedrock
  const isAWSBedrock = () => {
    const selectedProvider = providers?.data?.find(p => p.id === tokenForm.providerId);
    return selectedProvider?.name === 'AWSBedrock';
  };

  // Token form handlers (similar to settings)
  const handleTokenFormChange = (field, value) => {
    setTokenForm(prev => ({ ...prev, [field]: value }));
    // Clear AWS fields when switching away from AWSBedrock
    if (field === 'providerId') {
      const selectedProvider = providers?.data?.find(p => p.id === value);
      if (selectedProvider?.name !== 'AWSBedrock') {
        setTokenForm(prev => ({ ...prev, accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey' }));
      } else {
        setTokenForm(prev => ({ ...prev, token: '' }));
      }
    }
    // Clear fields when switching auth method
    if (field === 'authMethod') {
      if (value === 'apiKey') {
        setTokenForm(prev => ({ ...prev, accessKeyId: '', secretAccessKey: '', region: '' }));
      } else {
        setTokenForm(prev => ({ ...prev, token: '' }));
      }
    }
  };

  const handleCloseTokenDialog = () => {
    setTokenDialogOpen(false);
    setTokenForm({ providerId: '', name: '', token: '', accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey' });
  };

  // Helper function to extract AWS credentials from token data
  const extractAWSCredentials = (token) => {
    if (token && token.data && token.data.accessKeyId && token.data.secretAccessKey && token.data.region) {
      return {
        accessKeyId: token.data.accessKeyId,
        secretAccessKey: token.data.secretAccessKey,
        region: token.data.region
      };
    }
    return { accessKeyId: '', secretAccessKey: '', region: '' };
  };

  // ... (reuse the same association logic as in NewEvaluatorDrawer) ...

  // Add handleCreateToken logic
  const handleCreateToken = async () => {
    const selectedProvider = providers?.data?.find(p => p.id === tokenForm.providerId);
    const isAWSProvider = selectedProvider?.name === 'AWSBedrock';
    
    // Validate required fields based on provider type and auth method
    if (!tokenForm.name || !tokenForm.providerId) return;
    if (isAWSProvider && tokenForm.authMethod === 'awsCredentials' && (!tokenForm.accessKeyId || !tokenForm.secretAccessKey || !tokenForm.region)) return;
    if ((isAWSProvider && tokenForm.authMethod === 'apiKey' && !tokenForm.token) || (!isAWSProvider && !tokenForm.token)) return;
    
    setCreatingToken(true);
    try {
      const tokenData = {
        name: tokenForm.name,
        providerId: tokenForm.providerId,
        authMethod: tokenForm.authMethod,
      };
      
      if (isAWSProvider && tokenForm.authMethod === 'awsCredentials') {
        tokenData.accessKeyId = tokenForm.accessKeyId;
        tokenData.secretAccessKey = tokenForm.secretAccessKey;
        tokenData.region = tokenForm.region;
      } else {
        tokenData.token = tokenForm.token;
      }
      
      const token = await createToken(tokenData).unwrap();
      
      // Find the provider and get the first available model
      const selectedProvider = providers?.data?.find(p => p.id === tokenForm.providerId);
      const firstModel = selectedProvider?.config?.models?.[0];
      
      // Set the newly created token as the default token along with provider and first model
      setDefaultTokenId(token.id);
      setDefaultProviderId(tokenForm.providerId);
      if (firstModel) {
        setDefaultProviderModel(firstModel);
      }
      
      // If adding a new association
      if (addAssocOpen && tokenModelId) {
        setAssocTokenId(token.id);
      }
      // If editing an association
      if (editingAssocModelId && tokenModelId === editingAssocModelId) {
        setEditTokenId(token.id);
      }
      
      handleCloseTokenDialog();
    } finally {
      setCreatingToken(false);
    }
  };

  // For brevity, only show the top section and edit logic here
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 600, p: 3, bgcolor: 'background.default' } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Evaluator Details
        </Typography>
        <Stack direction="row" spacing={1}>
          {!isEditing && (
            <Button startIcon={<PencilSimple />} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          <IconButton onClick={onClose} size="small">
            <X weight="bold" />
          </IconButton>
        </Stack>
      </Box>
      <Stack spacing={4}>
        {/* Name */}
        {!isEditing ? (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Reviewer Name</Typography>
            <Typography variant="body1" sx={{ py: 1 }}>{name || '-'}</Typography>
          </Box>
        ) : (
          <TextField
            label="Evaluator Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
          />
        )}
        {/* Description */}
        
        {/* Prompt */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Code weight="bold" size={20} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Evaluation Prompt</Typography>
            </Stack>
            {isEditing && (
              <Stack direction="row" spacing={1}>
                <Tooltip title={isExpanded ? 'Collapse' : 'Expand'}>
                  <Button
                    startIcon={<ArrowsOutSimple weight="bold" />}
                    onClick={() => setIsExpanded(!isExpanded)}
                    size="small"
                    variant="outlined"
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </Tooltip>
              </Stack>
            )}
          </Box>
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'background.neutral',
              p: 2,
              borderRadius: 1,
              maxHeight: isExpanded ? 'none' : '200px',
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: '4px' },
              transition: 'all 0.2s ease-in-out',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={isExpanded ? 20 : 8}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
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
            ) : (
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  m: 0,
                  p: 0,
                  color: 'text.primary',
                }}
              >
                {prompt || '-'}
              </Typography>
            )}
          </Paper>
        </Box>
        {/* Associations */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              Default Provider, Model & Token
            </Typography>
            <Button
              startIcon={<Plus />}
              onClick={() => setTokenDialogOpen(true)}
              size="small"
              variant="outlined"
              data-testid="add-token-button"
            >
              Add Token
            </Button>
          </Box>
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Provider"
              value={defaultProviderId}
              onChange={e => {
                setDefaultProviderId(e.target.value);
                setDefaultProviderModel('');
                setDefaultTokenId('');
              }}
              fullWidth
            >
              {providers?.data?.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Provider Model"
              value={defaultProviderModel}
              onChange={e => setDefaultProviderModel(e.target.value)}
              fullWidth
              disabled={!defaultProviderId}
            >
              {(providers?.data?.find(p => p.id === defaultProviderId)?.config?.models || []).map(pm => (
                <MenuItem key={pm} value={pm}>{pm}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Token"
              value={defaultTokenId}
              onChange={e => setDefaultTokenId(e.target.value)}
              fullWidth
              disabled={!defaultProviderId}
            >
              {tokens.filter(t => t.providerId === defaultProviderId).map(token => (
                <MenuItem key={token.id} value={token.id}>{token.name}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1">
            Associated LLM Nodes
          </Typography>
          <Button
              onClick={() => setAddAssocOpen(true)}
              data-testid="associate-new-llm-node-button"
            >
              Associate New LLM Node
            </Button>
          </Box>
          
          {associations.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No LLM nodes associated yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {associations.map((assoc) => {
                const model = models.find(m => m.id === assoc.modelId);
                const provider = providers?.data?.find(p => p.id === assoc.providerId);
                const token = tokens.find(t => t.id === assoc.tokenId);
                const isEditingAssoc = editingAssocModelId === assoc.modelId;
                return (
                  <Box key={assoc.modelId} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2">{model?.name || assoc.modelId}</Typography>
                        <Typography variant="body2" color="text.secondary">{model?.description || '-'}</Typography>
                      </Box>
                      {isEditing ? (
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={e => {
                              setAssocMenuAnchorEl(e.currentTarget);
                              setAssocMenuModelId(assoc.modelId);
                            }}
                          >
                            <DotsThreeIcon weight="bold" />
                          </IconButton>
                          <Menu
                            anchorEl={assocMenuAnchorEl}
                            open={assocMenuAnchorEl && assocMenuModelId === assoc.modelId}
                            onClose={() => {
                              setAssocMenuAnchorEl(null);
                              setAssocMenuModelId(null);
                            }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                          >
                            <MenuItem
                              onClick={() => {
                                setAssociations(prev => prev.filter(a => a.modelId !== assoc.modelId));
                                setAssocMenuAnchorEl(null);
                                setAssocMenuModelId(null);
                              }}
                              sx={{ color: 'var(--mui-palette-error-main)' }}
                            >
                              Remove
                            </MenuItem>
                          </Menu>
                        </Stack>
                      ) : null}
                    </Stack>
                    {isEditingAssoc && isEditing ? (
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                          select
                          label="Provider"
                          value={editProviderId}
                          onChange={e => setEditProviderId(e.target.value)}
                          fullWidth
                        >
                          {providers?.data?.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          select
                          label="Provider Model"
                          value={editProviderModel}
                          onChange={e => setEditProviderModel(e.target.value)}
                          fullWidth
                          disabled={!editProviderId}
                        >
                          {(providers?.data?.find(p => p.id === editProviderId)?.config?.models || []).map(pm => (
                            <MenuItem key={pm} value={pm}>{pm}</MenuItem>
                          ))}
                        </TextField>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            select
                            label="Token"
                            value={editTokenId}
                            onChange={e => setEditTokenId(e.target.value)}
                            fullWidth
                            disabled={!editProviderId}
                          >
                            {tokens.filter(t => t.providerId === editProviderId).map(token => (
                              <MenuItem key={token.id} value={token.id}>{token.name}</MenuItem>
                            ))}
                          </TextField>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ marginTop: 'auto', marginBottom: '5px' }}
                            onClick={() => {
                              setTokenDialogOpen(true);
                              setTokenModelId(assoc.modelId);
                              setTokenProviderId(editProviderId);
                            }}
                            disabled={!editProviderId}
                          >
                            Add
                          </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button onClick={() => {
                            setEditingAssocModelId(null);
                            setEditProviderId('');
                            setEditProviderModel('');
                            setEditTokenId('');
                          }}>Cancel</Button>
                          <Button
                            onClick={() => {
                              setAssociations(prev => prev.map(a =>
                                a.modelId === assoc.modelId
                                  ? { ...a, providerId: editProviderId, providerModel: editProviderModel, tokenId: editTokenId, id: a.id }
                                  : a
                              ));
                              setEditingAssocModelId(null);
                              setEditProviderId('');
                              setEditProviderModel('');
                              setEditTokenId('');
                            }}
                            variant="contained"
                            disabled={!editProviderId || !editProviderModel || !editTokenId}
                          >
                            Save
                          </Button>
                        </Stack>
                      </Stack>
                    ) : null}
                  </Box>
                );
              })}
            </Stack>
          )}

          {isEditing && addAssocOpen && (
            <Box sx={{ mt: 2, border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
              <Stack spacing={2}>
                <TextField
                  select
                  label="LLM Node"
                  value={assocModelId}
                  onChange={e => setAssocModelId(e.target.value)}
                  fullWidth
                >
                  {availableModels.map(m => (
                    <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                  ))}
                </TextField>
                
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button onClick={() => {
                    setAddAssocOpen(false);
                    setAssocModelId('');
                    setAssocProviderId('');
                    setAssocProviderModel('');
                    setAssocTokenId('');
                  }}>Cancel</Button>
                  <Button
                    onClick={() => {
                      if (!assocModelId) return;
                      setAssociations(prev => [
                        ...prev,
                        {
                          modelId: assocModelId,
                          providerId: assocProviderId,
                          providerModel: assocProviderModel,
                          tokenId: assocTokenId,
                        },
                      ]);
                      setAddAssocOpen(false);
                      setAssocModelId('');
                      setAssocProviderId('');
                      setAssocProviderModel('');
                      setAssocTokenId('');
                    }}
                    variant="contained"
                    disabled={!assocModelId}
                    data-testid="save-association-button"
                    sx={{
                      backgroundImage: 'none',
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundImage: 'none',
                        backgroundColor: 'primary.light',
                      },
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </Box>
        {isEditing && (
            <Button
              onClick={async () => {
                // 1. Update the prompt itself
                await updatePrompt({ id: evaluator.id, name, prompt, metricId, defaultProviderModel, defaultIntegrationTokenId: defaultTokenId });
                // 2. Diff associations
                const original = originalAssociationsRef.current;
                const current = associations;
                // Build maps by id for originals and currents
                const currentById = Object.fromEntries(current.filter(a => a.id).map(a => [a.id, a]));
                // Deleted: in original but not in current (by id)
                for (const assoc of original) {
                  if (assoc.id && !currentById[assoc.id]) {
                    await deleteAssociation(assoc.id);
                  }
                }
                // Created: in current with no id
                for (const assoc of current) {
                  if (!assoc.id) {
                    await associatePromptToModel({
                      modelId: assoc.modelId,
                      evaluationPromptId: evaluator.id,
                    });
                  }
                }
                // Updated: in both, but changed fields (by id)
                
                if (onUpdate) onUpdate();
              }}
              sx={{
                backgroundImage: 'none',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundImage: 'none',
                  backgroundColor: 'primary.light',
                },
                mb: 2,
              }}
              variant="contained"
              disabled={!name || !prompt || !metricId}
            >
              Update
            </Button>
        )}
      </Stack>
      <Dialog open={tokenDialogOpen} onClose={handleCloseTokenDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add Token</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField 
              select 
              label="Provider" 
              value={tokenForm.providerId} 
              onChange={e => handleTokenFormChange('providerId', e.target.value)} 
              fullWidth
            >
              {providers?.data?.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </TextField>
            <TextField 
              label="Name" 
              value={tokenForm.name} 
              onChange={e => handleTokenFormChange('name', e.target.value)} 
              fullWidth 
            />
            {isAWSBedrock() ? (
              <>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Authentication Method</FormLabel>
                  <RadioGroup value={tokenForm.authMethod} onChange={e => handleTokenFormChange('authMethod', e.target.value)}>
                    <FormControlLabel value="apiKey" control={<Radio />} label="API Key" />
                    <FormControlLabel value="awsCredentials" control={<Radio />} label="AWS Credentials (Access Key ID + Secret)" />
                  </RadioGroup>
                </FormControl>
                {tokenForm.authMethod === 'apiKey' ? (
                  <TextField 
                    label="API Key" 
                    value={tokenForm.token} 
                    onChange={e => handleTokenFormChange('token', e.target.value)} 
                    fullWidth 
                  />
                ) : (
                  <>
                    <TextField 
                      label="Access Key ID" 
                      value={tokenForm.accessKeyId} 
                      onChange={e => handleTokenFormChange('accessKeyId', e.target.value)} 
                      fullWidth 
                    />
                    <TextField 
                      label="Secret Access Key" 
                      value={tokenForm.secretAccessKey} 
                      onChange={e => handleTokenFormChange('secretAccessKey', e.target.value)} 
                      fullWidth 
                      type="password"
                    />
                    <TextField 
                      label="Region" 
                      value={tokenForm.region} 
                      onChange={e => handleTokenFormChange('region', e.target.value)} 
                      fullWidth 
                      placeholder="e.g., us-east-1"
                    />
                  </>
                )}
              </>
            ) : (
              <TextField 
                label="Token" 
                value={tokenForm.token} 
                onChange={e => handleTokenFormChange('token', e.target.value)} 
                fullWidth 
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTokenDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateToken} 
            disabled={
              !tokenForm.name || 
              !tokenForm.providerId || 
              creatingToken ||
              (isAWSBedrock() && tokenForm.authMethod === 'awsCredentials' && (!tokenForm.accessKeyId || !tokenForm.secretAccessKey || !tokenForm.region)) ||
              (isAWSBedrock() && tokenForm.authMethod === 'apiKey' && !tokenForm.token) ||
              (!isAWSBedrock() && !tokenForm.token)
            } 
            variant="outlined"
            data-testid="save-token-button"
          >
            {creatingToken ? 'Creating...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
} 