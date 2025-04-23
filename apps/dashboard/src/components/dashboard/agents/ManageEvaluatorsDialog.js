import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack, Box, TextField, MenuItem, IconButton, Menu, Autocomplete } from '@mui/material';
import NewEvaluatorDrawer from '@/components/dashboard/evaluation-hub/NewEvaluatorDrawer';
import { useGetEvaluationPromptsQuery, useAssociatePromptToModelMutation, useGetPromptsForModelQuery, useDeleteAssociationMutation, useUpdateAssociationMutation, useCreateEvaluationPromptMutation } from '@/services/reviewersTemplateService';
import { useGetProvidersQuery } from '@/services/providerService';
import { useGetIntegrationTokensQuery } from '@/services/integrationTokenService';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function ManageEvaluatorsDialog({ open, onClose, modelId, modelLabel, onEvaluatorAdded }) {
  const { data: allEvaluators = [] } = useGetEvaluationPromptsQuery();
  const { data: associatedEvaluators = [], refetch: refetchAssociated } = useGetPromptsForModelQuery(modelId, { skip: !modelId });
  const [associatePromptToModel] = useAssociatePromptToModelMutation();
  const [deleteAssociation] = useDeleteAssociationMutation();
  const [updateAssociation] = useUpdateAssociationMutation();
  const [newEvalDrawerOpen, setNewEvalDrawerOpen] = useState(false);
  const { data: providers = { data: [] } } = useGetProvidersQuery();
  const { data: tokens = [] } = useGetIntegrationTokensQuery();
  const [editingAssocId, setEditingAssocId] = useState(null);
  const [editProviderId, setEditProviderId] = useState('');
  const [editProviderModel, setEditProviderModel] = useState('');
  const [editTokenId, setEditTokenId] = useState('');
  const [search, setSearch] = useState('');
  const [createEvaluationPrompt] = useCreateEvaluationPromptMutation();

  // Find association id for removal
  const getAssociationId = (evaluatorId) => {
    const assoc = associatedEvaluators.find(ev => ev.id === evaluatorId);
    return assoc?.associationId || assoc?.association_id || assoc?.assocId || assoc?.id;
  };

  // Start editing association
  const handleEditAssoc = (assoc) => {
    setEditingAssocId(assoc.id);
    setEditProviderId(assoc.token.providerId || '');
    setEditProviderModel(assoc.providerModel || '');
    setEditTokenId(assoc.token.id || '');
  };
  const handleCancelEdit = () => {
    setEditingAssocId(null);
    setEditProviderId('');
    setEditProviderModel('');
    setEditTokenId('');
  };
  const handleSaveEdit = async (assoc) => {
    await updateAssociation({
      id: assoc.id,
      integrationTokenId: editTokenId,
      providerModel: editProviderModel,
    });
    setEditingAssocId(null);
    setEditProviderId('');
    setEditProviderModel('');
    setEditTokenId('');
    refetchAssociated();
  };

  // Associate evaluator to model immediately
  const handleAssociate = async (evaluatorId) => {
    await associatePromptToModel({
      modelId,
      evaluationPromptId: evaluatorId,
      integrationTokenId: null,
      providerModel: null,
    });
    refetchAssociated();
  };

  // Remove association
  const handleRemove = async (evaluatorId) => {
    const assocId = getAssociationId(evaluatorId);

    if (assocId) {
      await deleteAssociation(assocId);
      refetchAssociated();
    }
  };

  // Add new evaluator
  const handleAddNewEvaluator = () => {
    setNewEvalDrawerOpen(true);
  };
  const handleNewEvaluatorCreate = async (evaluator) => {
    let ev = await createEvaluationPrompt(evaluator);
  
    if (!ev) return;
    // If evaluator is wrapped in .data, unwrap
    ev = ev.data?.data || ev.data ||ev;
    setEditingAssocId(ev.id);
    setEditProviderId('');
    setEditProviderModel('');
    setEditTokenId('');
    setNewEvalDrawerOpen(false);
  };

  // Filtered evaluators (exclude associated)
  const filteredEvaluators = (allEvaluators.data || []).filter(ev =>
    !associatedEvaluators.some(ae => ae.evaluationPromptId === ev.id) &&
    (!search || ev.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 480, bgcolor: 'background.default', p: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Manage Evaluators for {modelLabel || 'Model'}
          </Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>
        <Box sx={{ px: 3, py: 2, height: '100%', overflowY: 'auto' }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Associated Evaluators</Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {/* Real associations */}
            {associatedEvaluators.map(assoc => (
              <Box key={assoc.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0.8, p: 1.2, background: 'var(--mui-palette-background-paper, #181c20)', mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{assoc.name}</Typography>
                  </Box>
                  <EvaluatorMenu assocId={assoc.id} onRemove={handleRemove} />
                </Box>
                {editingAssocId === assoc.id ? (
                  <Stack spacing={2}>
                    <TextField
                      select
                      label="Provider"
                      value={editProviderId}
                      onChange={e => setEditProviderId(e.target.value)}
                      fullWidth
                    >
                      {providers.data.map(p => (
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
                      {(providers.data.find(p => p.id === editProviderId)?.config?.models || []).map(pm => (
                        <MenuItem key={pm} value={pm}>{pm}</MenuItem>
                      ))}
                    </TextField>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button onClick={handleCancelEdit} sx={{ mr: 1 }}>Cancel</Button>
                      <Button variant="contained" onClick={() => handleSaveEdit(assoc)} disabled={!editProviderId || !editProviderModel || !editTokenId}>Save</Button>
                    </Box>
                  </Stack>
                ) : null}
              </Box>
            ))}
          </Stack>
          <Box sx={{ mt: 2, mb: 2 }}>
            <AddEvaluatorSelector
              evaluators={filteredEvaluators}
              onAssociate={handleAssociate}
              onAddNew={handleAddNewEvaluator}
            />
          </Box>
        </Box>
      </Drawer>
      <NewEvaluatorDrawer open={newEvalDrawerOpen} onClose={() => setNewEvalDrawerOpen(false)} onCreate={handleNewEvaluatorCreate} associateSection={false} />
    </>
  );
}

// Three-dot menu for evaluator actions
function EvaluatorMenu({ assocId, onRemove }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleRemoveClick = () => {
    onRemove(assocId);
    handleMenuClose();
  };
  return (
    <>
      <IconButton size="small" onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleRemoveClick} sx={{ color: 'error.main' }}>Remove</MenuItem>
      </Menu>
    </>
  );
}

// AddEvaluatorSelector component: shows a button, then a selector when clicked
function AddEvaluatorSelector({ evaluators, onAssociate, onAddNew }) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState(null);

  const handleButtonClick = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setValue(null);
    setInputValue('');
  };
  const handleChange = (event, newValue) => {
    if (newValue) {
      onAssociate(newValue.id);
      handleClose();
    }
  };

  return (
    <>
      {!open ? (
        <Button variant="contained"
        sx={{
          backgroundImage: 'none',
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundImage: 'none',
            backgroundColor: 'primary.light',
          },
        }}
        onClick={handleButtonClick}>
          Add Evaluator
        </Button>
      ) : (
        <Box sx={{ minWidth: 250, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Autocomplete
            autoFocus
            options={evaluators}
            getOptionLabel={option => option.name}
            value={value}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={(_, v) => setInputValue(v)}
            renderInput={params => (
              <TextField {...params} label="Select evaluator" size="small" autoFocus />
            )}
            sx={{ flex: 1 }}
          />
          <Button onClick={handleClose} color="secondary" size="small" sx={{
            mt: 4
          }}>Cancel</Button>
          <Button onClick={onAddNew} color="primary" size="small" sx={{
            mt: 4
          }}>New</Button>
        </Box>
      )}
    </>
  );
} 