/**
 * @fileoverview CreateModelForm component for creating new AI models
 * Provides a form interface for creating models with dataset selection and configuration
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
import { useGetDatasetsQuery } from '@/services/datasetsService';
import { useGetEvaluationPromptsQuery } from '@/services/reviewersTemplateService';
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
import { Option } from '@/components/core/option';
import { DatasetsInput } from '@/components/dashboard/models/datasets-input';
import { aiProblemTypes, modelCategories, modelTypes } from '@/constants/models';

import { CreateDatasetForm } from '../datasets/create-dataset-form'; // Import the Dataset Form
import NewEvaluatorModal from '@/components/dashboard/evaluation-hub/NewEvaluatorModal';

/**
 * CreateModelForm component for creating new AI models
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to handle form close
 * @param {boolean} [props.open=false] - Whether the form dialog is open
 * @param {Function} props.onSubmit - Function to handle model creation
 * @param {Function} props.onSecondarySubmit - Function to handle dataset creation
 * @returns {JSX.Element} Rendered form component
 * 
 * @description
 * This component provides:
 * - Model creation form with validation
 * - Dataset selection and creation
 * - Model type and category selection
 * - Provider selection
 * - Creation date picker
 * - Error handling and display
 */
export function CreateModelForm({ onClose, open = false, onSubmit }) {
  // Fetch available datasets
  const { data: initialDatasets, error, isLoading } = useGetDatasetsQuery();
  const { data: evaluators = [] } = useGetEvaluationPromptsQuery();

  // Form state management
  const [newError, setNewError] = useState('');
  const [isDatasetFormVisible, setDatasetFormVisible] = useState(false); // Toggle between forms
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [problemType, setProblemType] = useState('');
  const [provider, setProvider] = useState('');
  const [modelCreationDate, setModelCreationDate] = useState(dayjs());
  const [datasets, setDatasets] = useState([]);
  const [modelCategory, setModelCategory] = useState('');
  const [selectedEvaluators, setSelectedEvaluators] = useState([]);
  const [isEvaluatorModalOpen, setEvaluatorModalOpen] = useState(false);

  // Special option for creating evaluator
  const CREATE_EVALUATOR_OPTION = { id: '__create__', name: '+ Create evaluator' };
  const evaluatorOptions = React.useMemo(() => {
    const base = evaluators.data || [];
    // Avoid duplicate if already present
    if (!base.find(ev => ev.id === CREATE_EVALUATOR_OPTION.id)) {
      return [...base, CREATE_EVALUATOR_OPTION];
    }
    return base;
  }, [evaluators]);

  /**
   * Handles closing both model and dataset forms
   */
  const handleCloseAll = () => {
    onClose();
    setDatasetFormVisible(false);
  };

  /**
   * Handles form submission with validation
   */
  const handleSubmit = async () => {
    console.log('entroooooo 1111')
    setNewError('');
    console.log('entroooooo 2222')
    console.log('name', name);
    if (!name || name === '') {
      return setNewError('Model name is required');
    }
    console.log('entroooooo 3333')
    const modelData = {
      name,
      url,
      description,
      type,
      problemType,
      provider,
      modelCreationDate,
      modelCategory,
      evaluatorIds: selectedEvaluators.map(ev => ev.id),
    };
    console.log('entroooooo 4444')
    console.log('modelData', modelData);

    const ans = await onSubmit(modelData);
    console.log('ans', ans);
    // Reset form state
    setName('');
    setUrl('');
    setType('');
    setProblemType('');
    setProvider('');
    setDescription('');
    setModelCreationDate(dayjs());
    setModelCategory('');
    setSelectedEvaluators([]);
    handleCloseAll();
    setNewError('');
  };

  const handleCreateEvaluator = (newEvaluator) => {
    // Add the new evaluator to the list and select it
    setSelectedEvaluators((prev) => [...prev, newEvaluator]);
    setEvaluatorModalOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open}>
      {/* Dialog header */}
      <Box sx={{ px: 1, border: '1px solid var(--mui-palette-divider)' }}>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
          <Typography variant="h6">{isDatasetFormVisible ? 'Create your Dataset' : 'Create your LLM Node'}</Typography>
          {!isDatasetFormVisible && (
            <IconButton onClick={handleCloseAll}>
              <XIcon />
            </IconButton>
          )}
        </Stack>
      </Box>

      {!isDatasetFormVisible ? (
        <DialogContent>
          {/* Error display */}
          {newError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {newError || 'An error occurred while fetching datasets'}
            </Alert>
          )}

          {/* Model creation form */}
          <Stack divider={<Divider />} spacing={3} sx={{ px: 1, py: 2 }}>
            <>
              {/* Model Creation Form */}
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

                {/* Model type and problem type */}
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

                {/* Autocomplete for Datasets with Create Button */}
              

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

                {/* Evaluator/Reviewer selection */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Autocomplete
                    multiple
                    options={evaluatorOptions}
                    getOptionLabel={option => option.name}
                    filterSelectedOptions
                    value={selectedEvaluators}
                    onChange={(_, value, reason, details) => {
                      // If the last selected is the create option, open modal
                      const last = value[value.length - 1];
                      if (last && last.id === CREATE_EVALUATOR_OPTION.id) {
                        setEvaluatorModalOpen(true);
                        // Remove the create option from selection
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
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
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
                  Confirm
                </Button>
              </Stack>
            </>
          </Stack>
        </DialogContent>
      ) : (
        <>
          {/* Dataset creation form */}
        </>
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
