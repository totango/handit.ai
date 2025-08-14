import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardHeader, CardContent, Stack, Typography, Button, IconButton, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Alert
} from '@mui/material';
import { Plus, PencilSimple, Trash, CheckCircle, TestTube } from '@phosphor-icons/react/dist/ssr';
import { useGetIntegrationTokensQuery, useCreateIntegrationTokenMutation, useUpdateIntegrationTokenMutation, useDeleteIntegrationTokenMutation, useSetOptimizationTokenMutation, useTestIntegrationTokenMutation } from '@/services/integrationTokenService';
import { useGetProvidersQuery } from '@/services/providerService';

export function IntegrationTokensManager({ initialOptimizationTokenId }) {
  const { data: tokens = [] } = useGetIntegrationTokensQuery();
  const { data: providers = [] } = useGetProvidersQuery();
  const [createToken] = useCreateIntegrationTokenMutation();
  const [updateToken] = useUpdateIntegrationTokenMutation();
  const [setOptimizationToken] = useSetOptimizationTokenMutation();
  const [testToken] = useTestIntegrationTokenMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editToken, setEditToken] = useState(null);
  const [form, setForm] = useState({ providerId: '', name: '', type: '', token: '', accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey', baseURL: '', model: '', apiKey: '', timeout: '', maxRetries: '', headers: {} });
  const [optimizationTokenId, setOptimizationTokenId] = useState(initialOptimizationTokenId || '');
  const [testResult, setTestResult] = useState(null);
  const [testingTokenId, setTestingTokenId] = useState(null);

  useEffect(() => {
    setOptimizationTokenId(initialOptimizationTokenId || '');
  }, [initialOptimizationTokenId]);

  // Check if the selected provider is AWSBedrock
  const isAWSBedrock = () => {
    const selectedProvider = providers?.data?.find(p => p.id === form.providerId);
    return selectedProvider?.name === 'AWSBedrock';
  };

  // Check if the selected provider is CustomProvider
  const isCustomProvider = () => {
    const selectedProvider = providers?.data?.find(p => p.id === form.providerId);
    return selectedProvider?.name === 'CustomProvider';
  };

  // Handlers for add/edit
  const handleOpenDialog = (token) => {
    setEditToken(token || null);
    if (token) {
      // Check if token has AWS credentials in data field
      const hasAWSData = token.data && token.data.accessKeyId && token.data.secretAccessKey && token.data.region;
      const hasAPIKey = token.token && token.token !== 'aws-bedrock-credentials' && token.token !== 'no-auth-required';
      
      // Check if token has CustomProvider data
      const hasCustomData = token.data && token.data.baseURL && token.data.model;
      
      // Determine auth method based on what data is available
      let authMethod = 'apiKey';
      if (hasAWSData) {
        authMethod = 'awsCredentials';
      } else if (hasAPIKey) {
        authMethod = 'apiKey';
      }
      
      setForm({ 
        providerId: token.providerId, 
        name: token.name, 
        type: token.type, 
        token: hasAPIKey ? token.token : '', 
        accessKeyId: hasAWSData ? token.data?.accessKeyId : '', 
        secretAccessKey: hasAWSData ? token.data?.secretAccessKey : '', 
        region: hasAWSData ? token.data?.region : '',
        authMethod: authMethod,
        baseURL: hasCustomData ? token.data.baseURL : '',
        model: hasCustomData ? token.data.model : '',
        apiKey: hasCustomData ? token.data.apiKey || '' : '',
        timeout: hasCustomData ? token.data.timeout?.toString() || '' : '',
        maxRetries: hasCustomData ? token.data.maxRetries?.toString() || '' : '',
        headers: hasCustomData ? token.data.headers || {} : {}
      });
    } else {
      setForm({ providerId: '', name: '', type: '', token: '', accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey', baseURL: '', model: '', apiKey: '', timeout: '', maxRetries: '', headers: {} });
    }
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditToken(null);
    setForm({ providerId: '', name: '', type: '', token: '', accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey', baseURL: '', model: '', apiKey: '', timeout: '', maxRetries: '', headers: {} });
  };
  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    // Clear provider-specific fields when switching providers
    if (field === 'providerId') {
      const selectedProvider = providers?.data?.find(p => p.id === value);
      if (selectedProvider?.name === 'AWSBedrock') {
        // Clear CustomProvider fields
        setForm(f => ({ ...f, baseURL: '', model: '', apiKey: '', timeout: '', maxRetries: '', headers: {}, token: '' }));
      } else if (selectedProvider?.name === 'CustomProvider') {
        // Clear AWS fields
        setForm(f => ({ ...f, accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey', token: '' }));
      } else {
        // Clear both AWS and CustomProvider fields
        setForm(f => ({ ...f, accessKeyId: '', secretAccessKey: '', region: '', authMethod: 'apiKey', baseURL: '', model: '', apiKey: '', timeout: '', maxRetries: '', headers: {} }));
      }
    }
    // Clear fields when switching auth method (AWS only)
    if (field === 'authMethod') {
      if (value === 'apiKey') {
        setForm(f => ({ ...f, accessKeyId: '', secretAccessKey: '', region: '' }));
      } else {
        setForm(f => ({ ...f, token: '' }));
      }
    }
  };
  const handleSave = async () => {
    const submitData = { ...form, type: 'token' };
    
    if (editToken) {
      await updateToken({ id: editToken.id, ...submitData });
    } else {
      await createToken(submitData);
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

  // Test token connection
  const handleTestToken = async (tokenId) => {
    setTestingTokenId(tokenId);
    setTestResult(null);
    try {
      const result = await testToken({ id: tokenId }).unwrap();
      setTestResult({ success: true, message: result.message, response: result.response });
    } catch (error) {
      setTestResult({ success: false, message: error.data?.error || 'Test failed', details: error.data?.details });
    } finally {
      setTestingTokenId(null);
    }
  };

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader title="Manage Service Provider Tokens" action={<Button startIcon={<Plus />} onClick={() => handleOpenDialog(null)}>Add Token</Button>} />
        <CardContent>
          <Stack spacing={2} divider={<Divider />}> 
            {tokens.length === 0 && <Typography color="text.secondary">No tokens yet.</Typography>}
            {tokens.map(token => {
              const provider = providers?.data?.find(p => p.id === token.providerId);
              const isCustomProvider = provider?.name === 'CustomProvider';
              return (
                <Stack key={token.id} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2">{token.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{provider?.name || token.providerId} &mdash; {token.type}</Typography>
                    {isCustomProvider && token.data?.baseURL && (
                      <Typography variant="caption" color="text.secondary">
                        {token.data.baseURL} ({token.data.model})
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {isCustomProvider && (
                      <IconButton 
                        onClick={() => handleTestToken(token.id)}
                        disabled={testingTokenId === token.id}
                        title="Test Connection"
                      >
                        <TestTube />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleOpenDialog(token)}><PencilSimple /></IconButton>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
      {testResult && (
        <Alert 
          severity={testResult.success ? 'success' : 'error'} 
          onClose={() => setTestResult(null)}
        >
          <Typography variant="subtitle2">{testResult.message}</Typography>
          {testResult.response && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Response: {testResult.response}
            </Typography>
          )}
          {testResult.details && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Details: {testResult.details}
            </Typography>
          )}
        </Alert>
      )}
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
            {isCustomProvider() ? (
              <>
                <TextField 
                  label="Base URL" 
                  value={form.baseURL} 
                  onChange={e => handleFormChange('baseURL', e.target.value)} 
                  fullWidth 
                  required
                  placeholder="e.g., http://localhost:11434/v1"
                  helperText="The OpenAI-compatible API endpoint (including /v1 path)"
                />
                <TextField 
                  label="Model Name" 
                  value={form.model} 
                  onChange={e => handleFormChange('model', e.target.value)} 
                  fullWidth 
                  required
                  placeholder="e.g., llama2:7b, gpt-3.5-turbo-instruct"
                  helperText="The model identifier to use with this endpoint"
                />
                <TextField 
                  label="API Key (Optional)" 
                  value={form.apiKey} 
                  onChange={e => handleFormChange('apiKey', e.target.value)} 
                  fullWidth 
                  type="password"
                  placeholder="Optional authentication token"
                  helperText="Leave empty if the API doesn't require authentication"
                />
                <Stack direction="row" spacing={2}>
                  <TextField 
                    label="Timeout (ms)" 
                    value={form.timeout} 
                    onChange={e => handleFormChange('timeout', e.target.value)} 
                    type="number"
                    placeholder="30000"
                    helperText="Request timeout in milliseconds"
                  />
                  <TextField 
                    label="Max Retries" 
                    value={form.maxRetries} 
                    onChange={e => handleFormChange('maxRetries', e.target.value)} 
                    type="number"
                    placeholder="3"
                    helperText="Maximum retry attempts"
                  />
                </Stack>
              </>
            ) : isAWSBedrock() ? (
              <>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Authentication Method</FormLabel>
                  <RadioGroup value={form.authMethod} onChange={e => handleFormChange('authMethod', e.target.value)}>
                    <FormControlLabel value="apiKey" control={<Radio />} label="API Key" />
                    <FormControlLabel value="awsCredentials" control={<Radio />} label="AWS Credentials (Access Key ID + Secret)" />
                  </RadioGroup>
                </FormControl>
                {form.authMethod === 'apiKey' ? (
                  <TextField label="API Key" value={form.token} onChange={e => handleFormChange('token', e.target.value)} fullWidth />
                ) : (
                  <>
                    <TextField 
                      label="Access Key ID" 
                      value={form.accessKeyId} 
                      onChange={e => handleFormChange('accessKeyId', e.target.value)} 
                      fullWidth 
                    />
                    <TextField 
                      label="Secret Access Key" 
                      value={form.secretAccessKey} 
                      onChange={e => handleFormChange('secretAccessKey', e.target.value)} 
                      fullWidth 
                      type="password"
                    />
                    <TextField 
                      label="Region" 
                      value={form.region} 
                      onChange={e => handleFormChange('region', e.target.value)} 
                      fullWidth 
                      placeholder="e.g., us-east-1"
                    />
                  </>
                )}
              </>
            ) : (
              <TextField label="Token" value={form.token} onChange={e => handleFormChange('token', e.target.value)} fullWidth />
            )}
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