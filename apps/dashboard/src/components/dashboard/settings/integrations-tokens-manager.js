import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardHeader, CardContent, Stack, Typography, Button, IconButton, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import { Plus, PencilSimple, Trash, CheckCircle } from '@phosphor-icons/react/dist/ssr';
import { useGetIntegrationTokensQuery, useCreateIntegrationTokenMutation, useUpdateIntegrationTokenMutation, useDeleteIntegrationTokenMutation, useSetOptimizationTokenMutation } from '@/services/integrationTokenService';
import { useGetProvidersQuery } from '@/services/providerService';

export function IntegrationTokensManager({ initialOptimizationTokenId }) {
  const { data: tokens = [] } = useGetIntegrationTokensQuery();
  const { data: providers = [] } = useGetProvidersQuery();
  const [createToken] = useCreateIntegrationTokenMutation();
  const [updateToken] = useUpdateIntegrationTokenMutation();
  const [setOptimizationToken] = useSetOptimizationTokenMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editToken, setEditToken] = useState(null);
  const [form, setForm] = useState({ providerId: '', name: '', type: '', token: '' });
  const [optimizationTokenId, setOptimizationTokenId] = useState(initialOptimizationTokenId || '');

  useEffect(() => {
    setOptimizationTokenId(initialOptimizationTokenId || '');
  }, [initialOptimizationTokenId]);

  // Handlers for add/edit
  const handleOpenDialog = (token) => {
    setEditToken(token || null);
    setForm(token ? { providerId: token.providerId, name: token.name, type: token.type, token: token.token } : { providerId: '', name: '', type: '', token: '' });
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditToken(null);
    setForm({ providerId: '', name: '', type: '', token: '' });
  };
  const handleFormChange = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const handleSave = async () => {
    if (editToken) {
      await updateToken({ id: editToken.id, ...form, type: 'token' });
    } else {
      await createToken(form);
    }
    handleCloseDialog();
  };
  const handleDelete = async (id) => {
  };

  // Persist optimizationTokenId selection
  const handleOptimizationTokenChange = async (e) => {
    const tokenId = e.target.value;
    setOptimizationTokenId(tokenId);
    try {
      await setOptimizationToken({ tokenId });
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader title="Manage Service Provider Tokens" action={<Button startIcon={<Plus />} onClick={() => handleOpenDialog(null)}>Add Token</Button>} />
        <CardContent>
          <Stack spacing={2} divider={<Divider />}> 
            {tokens.length === 0 && <Typography color="text.secondary">No tokens yet.</Typography>}
            {tokens.map(token => (
              <Stack key={token.id} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2">{token.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{providers?.data?.find(p => p.id === token.providerId)?.name || token.providerId} &mdash; {token.type}</Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => handleOpenDialog(token)}><PencilSimple /></IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Optimization Token" />
        <CardContent>
          <RadioGroup value={optimizationTokenId} onChange={handleOptimizationTokenChange}>
            {tokens.map(token => (
              <FormControlLabel key={token.id} value={String(token.id)} control={<Radio />} label={token.name} />
            ))}
          </RadioGroup>
          <Typography variant="caption" color="text.secondary">Select the token to use for optimization processes.</Typography>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editToken ? 'Edit Token' : 'Add Token'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField select label="Provider" value={form.providerId} onChange={e => handleFormChange('providerId', e.target.value)} fullWidth>
              {providers?.data?.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </TextField>
            <TextField label="Name" value={form.name} onChange={e => handleFormChange('name', e.target.value)} fullWidth />
            <TextField label="Token" value={form.token} onChange={e => handleFormChange('token', e.target.value)} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
} 