import * as React from 'react';
import { useState, useEffect } from 'react';
import { useGetDatasetsQuery } from '@/services/datasetsService';
import { useGetEvaluationPromptsQuery, useGetPromptsForModelQuery, useAssociatePromptToModelMutation, useDeleteAssociationMutation, useUpdateAssociationMutation } from '@/services/reviewersTemplateService';
import { useGetProvidersQuery } from '@/services/providerService';
import { useGetIntegrationTokensQuery } from '@/services/integrationTokenService';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  Autocomplete,
  Chip,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { X as XIcon, Plus as PlusIcon } from '@phosphor-icons/react';
import { dayjs } from '@/lib/dayjs';
import { DropDownDescriptionSelector } from '@/components/core/DropDownDescriptionSelector';
import { aiProblemTypes, modelCategories, modelTypes } from '@/constants/models';
import NewEvaluatorModal from '@/components/dashboard/evaluation-hub/NewEvaluatorModal';
import { useUpdateModelsMutation, useGetModelsQuery } from '@/services/modelsService';

export function EditModelForm({ model, onClose, open = false, onSubmit }) {
  const { data: evaluators = [] } = useGetEvaluationPromptsQuery();
  const { data: reviewerAssociations = [], refetch: refetchAssociations } = useGetPromptsForModelQuery(model.id, { skip: !model.id });
  const [updateModel] = useUpdateModelsMutation();
  const [associatePromptToModel] = useAssociatePromptToModelMutation();
  const [deleteAssociation] = useDeleteAssociationMutation();

  // Prefill state from model
  const [newError, setNewError] = useState('');
  const [isDatasetFormVisible, setDatasetFormVisible] = useState(false);
  const [name, setName] = useState(model?.name || '');
  const [url, setUrl] = useState(model?.url || '');
  const [description, setDescription] = useState(model?.description || '');
  const [type, setType] = useState(model?.type || '');
  const [problemType, setProblemType] = useState(model?.problemType || '');
  const [provider, setProvider] = useState(model?.provider || '');
  const [modelCreationDate, setModelCreationDate] = useState(model?.modelCreationDate ? dayjs(model.modelCreationDate) : dayjs());
  const [modelCategory, setModelCategory] = useState(model?.modelCategory || '');

  const [selectedEvaluators, setSelectedEvaluators] = useState(
    reviewerAssociations && evaluators.data ? evaluators.data.filter(ev => reviewerAssociations.map(assoc => assoc.evaluationPromptId).includes(ev.id)) : []
  );
  const [isEvaluatorModalOpen, setEvaluatorModalOpen] = useState(false);
  const { refetch: refetchModels } = useGetModelsQuery();

  // Special option for creating evaluator
  const CREATE_EVALUATOR_OPTION = { id: '__create__', name: '+ Create evaluator' };
  const evaluatorOptions = React.useMemo(() => {
    const base = evaluators.data || [];
    if (!base.find(ev => ev.id === CREATE_EVALUATOR_OPTION.id)) {
      return [...base, CREATE_EVALUATOR_OPTION];
    }
    return base;
  }, [evaluators]);

  useEffect(() => {
    if (open && model) {
      setName(model.name || '');
      setUrl(model.url || '');
      setDescription(model.description || '');
      setType(model.type || '');
      setProblemType(model.problemType || '');
      setProvider(model.provider || '');
      setModelCreationDate(model.modelCreationDate ? dayjs(model.modelCreationDate) : dayjs());
      setModelCategory(model.modelCategory || '');
      setSelectedEvaluators(evaluators.data ? evaluators.data.filter(ev => reviewerAssociations.map(assoc => assoc.evaluationPromptId).includes(ev.id)) : []);
    }
    // eslint-disable-next-line
  }, [open, model, evaluators.data, reviewerAssociations]);

  const handleCloseAll = () => {
    onClose();
    setDatasetFormVisible(false);
  };

  const handleSubmit = async () => {
    setNewError('');
    if (!name || name === '') {
      return setNewError('Model name is required');
    }
    const modelData = {
      id: model.id,
      name,
      url,
      description,
      type,
      problemType,
      provider,
      modelCreationDate,
      modelCategory,
    };
    try {
      // 1. Update the model fields
      const updated = await updateModel(modelData).unwrap();
      // 2. Sync reviewer associations
      const selectedIds = selectedEvaluators.map(ev => ev.id);
      const currentIds = reviewerAssociations.map(a => a.evaluationPromptId);
      // Add new associations
      for (const evId of selectedIds) {
        if (!currentIds.includes(evId)) {
          await associatePromptToModel({
            modelId: model.id,
            evaluationPromptId: evId,
            integrationTokenId: null,
            providerModel: null,
          });
        }
      }
      // Remove associations for deselected
      for (const assoc of reviewerAssociations) {
        if (!selectedIds.includes(assoc.evaluationPromptId)) {
          await deleteAssociation(assoc.id);
        }
      }
      refetchAssociations();
      refetchModels();
      onSubmit && onSubmit(updated);
      handleCloseAll();
    } catch (err) {
      setNewError(err?.data?.message || 'Failed to update model');
    }
  };

  const handleCreateEvaluator = (newEvaluator) => {
    setSelectedEvaluators((prev) => [...prev, newEvaluator]);
    setEvaluatorModalOpen(false);
  };


  return (
    <Dialog fullWidth maxWidth="md" open={open}>
      <Box sx={{ px: 1, border: '1px solid var(--mui-palette-divider)' }}>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
          <Typography variant="h6">Edit your Model</Typography>
          <IconButton onClick={handleCloseAll}>
            <XIcon />
          </IconButton>
        </Stack>
      </Box>
      {!isDatasetFormVisible ? (
        <DialogContent>
          {newError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {newError}
            </Alert>
          )}
          <Stack divider={<Divider />} spacing={3} sx={{ px: 1, py: 2 }}>
            <Stack spacing={3}>
              <Stack direction={'row'} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Model Name</InputLabel>
                  <OutlinedInput name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Model Url</InputLabel>
                  <OutlinedInput name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                </FormControl>
              </Stack>
              <FormControl>
                <InputLabel>Description</InputLabel>
                <OutlinedInput
                  name="description"
                  value={description}
                  multiline
                  rows={2}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <Stack direction={'row'} spacing={2}>
                <DropDownDescriptionSelector
                  title={'Model type'}
                  labelName={'modelType'}
                  placeholder={'Select your model type'}
                  type={type}
                  handleChange={(e) => setType(e.target.value)}
                  typesOptions={modelTypes}
                />
                <DropDownDescriptionSelector
                  title={'AI Problem type'}
                  labelName={'problemType'}
                  placeholder={'Select the AI problem type'}
                  type={problemType}
                  handleChange={(e) => setProblemType(e.target.value)}
                  typesOptions={aiProblemTypes}
                />
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <DropDownDescriptionSelector
                  title={'Model Category'}
                  labelName={'modelCategory'}
                  placeholder={'Select model category'}
                  type={modelCategory}
                  handleChange={(e) => setModelCategory(e.target.value)}
                  typesOptions={modelCategories}
                />
                <FormControl fullWidth>
                  <DateTimePicker
                    fullWidth
                    format="MMM D, YYYY hh:mm A"
                    label="Model creation date"
                    value={modelCreationDate}
                    onChange={(newValue) => setModelCreationDate(newValue)}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Autocomplete
                  multiple
                  options={evaluatorOptions}
                  getOptionLabel={option => option.name}
                  filterSelectedOptions
                  value={selectedEvaluators}
                  onChange={(_, value, reason, details) => {
                    const last = value[value.length - 1];
                    if (last && last.id === CREATE_EVALUATOR_OPTION.id) {
                      setEvaluatorModalOpen(true);
                      setSelectedEvaluators(value.filter(v => v.id !== CREATE_EVALUATOR_OPTION.id));
                    } else {
                      setSelectedEvaluators(value);
                    }
                  }}
                  renderOption={(props, option) =>
                    option.id === CREATE_EVALUATOR_OPTION.id ? (
                      <li {...props} style={{ fontWeight: 600, borderTop: '1px solid #eee' }}>
                        {option.name}
                      </li>
                    ) : (
                      <li {...props}>{option.name}</li>
                    )
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Assign Evaluators"
                      placeholder={selectedEvaluators.length === 0 ? "Type to search..." : ""}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option.id}
                        sx={{ bgcolor: 'primary.dark', color: 'white', fontWeight: 500 }}
                      />
                    ))
                  }
                  sx={{ mt: 2, flex: 1 }}
                />
              </Stack>
              {/* Reviewer Association Management - now grouped with evaluator selection */}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
              <Button color="secondary" variant="outlined" onClick={handleCloseAll} sx={{ width: '9vmax' }}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={handleSubmit}
                color="primary"
                sx={{
                  borderColor: 'transparent',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                  backgroundColor: 'rgba(117,120,255, 0.2)',
                  width: '9vmax',
                }}
              >
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      ) : (
        <></>
      )}
      <NewEvaluatorModal
        open={isEvaluatorModalOpen}
        onClose={() => setEvaluatorModalOpen(false)}
        onCreate={handleCreateEvaluator}
        associateSection={false}
      />
    </Dialog>
  );
} 