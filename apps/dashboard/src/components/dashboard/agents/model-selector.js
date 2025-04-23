/**
 * Model Selector Component
 *
 * A component that provides model selection functionality through a dialog interface.
 * Supports searching, selecting, and creating new models. Includes loading states,
 * error handling, and integration with model creation forms.
 */

import * as React from 'react';
import { useAddDatasetsMutation } from '@/services/datasetsService';
import { useAddModelsMutation, useGetModelsQuery } from '@/services/modelsService';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { UploadButton } from '@/components/widgets/buttons/upload-button';

import { CreateModelForm } from '../models/create-model-form';
import { useAssociatePromptToModelMutation } from '@/services/reviewersTemplateService';
import { EditModelForm } from '../models/edit-model-form';

/**
 * ModelSelector Component
 *
 * A component that allows users to select from existing models or create new ones.
 * Features include:
 * - Model search functionality
 * - Model creation through a form
 * - Loading states and error handling
 * - Optional selection disabling
 *
 * @param {Object} props - Component props
 * @param {string} props.value - The currently selected model ID
 * @param {Function} props.onChange - Callback function when a model is selected
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.selectEnabled=true] - Whether model selection is enabled
 * @param {boolean} [props.isModelNode=false] - Whether the selector is for a model node
   * @param {boolean} [props.autoOpen=false] - Whether the UploadButton should open automatically on mount
 * @returns {JSX.Element} The model selector component
 */
export const ModelSelector = ({ value, onChange, error, selectEnabled = true, isModelNode = false, autoOpen = false }) => {
  // Data fetching and state management
  const { data: models, isLoading } = useGetModelsQuery();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showCreateModel, setShowCreateModel] = React.useState(false);
  const [associatePromptToModel] = useAssociatePromptToModelMutation();
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  // For autoOpen
  const uploadButtonRef = React.useRef();
  const autoOpenedRef = React.useRef(false);

  React.useEffect(() => {
    if (autoOpen && isModelNode && !autoOpenedRef.current) {
      // Try to open the UploadButton dialog
      if (uploadButtonRef.current && uploadButtonRef.current.handleOpen) {
        uploadButtonRef.current.handleOpen();
        autoOpenedRef.current = true;
      }
    }
  }, [autoOpen, isModelNode]);

  const selectedModel = models?.find((m) => m.id === value);
  const [addModel, { isLoading: isAddingKpi, error: addKpiError }] = useAddModelsMutation();
  const [addDataset, { isLoading: isAddingDataset, error: addDatasetError }] = useAddDatasetsMutation();

  /**
   * Filtered list of models based on search query
   */
  const filteredModels = React.useMemo(() => {
    if (!models) return [];
    return models.filter((model) => model.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [models, searchQuery]);

  /**
   * Opens the model selection dialog
   * @param {Event} event - The click event
   */
  const handleOpen = (event) => {
    if (selectEnabled) {
      event.stopPropagation();
      setIsOpen(true);
    }
  };

  /**
   * Handles the submission of a new model
   * @param {Object} modelData - The data for the new model
   */
  const handleSubmit = async (modelData) => {
    const model = await addModel(modelData);
    handleSelect(model.data.id, model.data.name);
  };

  /**
   * Closes the model selection dialog
   */
  const handleClose = () => {
    setIsOpen(false);
  };

  /**
   * Handles the selection of a model
   * @param {string} modelId - The ID of the selected model
   */
  const handleSelect = (modelId, name = null) => {
    if (selectEnabled) {
      const model = models.find((m) => m.id == modelId);
      onChange(modelId, name || model.name);
      handleClose();
    }
  };

  const handleCreateModel = () => {
    setShowCreateModel(true);
  };

  const handleModelCreated = async (modelData) => {
    console.log('plssss')
    console.log('modelData', modelData);
    try {
      // 1. Create the model
      console.log('entroooooo')
      const createdModel = await addModel(modelData).unwrap();
      console.log('createdModel', createdModel);
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
      handleSelect(createdModel.id, createdModel.name);
    } catch (err) {
      setSnackbar({ open: true, message: err?.data?.message || 'Failed to create model or associate evaluators' });
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (isModelNode) {
    return (
      <>
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {!selectedModel && <UploadButton
            ref={uploadButtonRef}
            buttonTitle={selectedModel ? selectedModel.name : 'Create a Model'}
            onSubmit={handleModelCreated}
            onSecondarySubmit={addDataset}
            FormComponent={CreateModelForm}
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              textTransform: 'none',
              cursor: selectEnabled ? 'pointer' : 'default',
              backgroundColor: 'transparent',
            }}
          />}
          {selectedModel && (
            <Button
              size="small"
              variant="text"
              fullWidth
              onClick={() => setIsEditOpen(true)}
              sx={{ minWidth: 0, px: 1,
                backgroundColor: 'rgba(117,120,255, 0.2)',
                borderColor: 'transparent',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                },
               }}
            >
              Edit {selectedModel.name}
            </Button>
          )}
        </Box>
        {selectedModel && (
          <EditModelForm
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            model={selectedModel}
            onSubmit={() => setIsEditOpen(false)}
          />
        )}
      </>
    );
  }

    return (
      <>
        <Box sx={{ mt: 1 }}>
          <UploadButton
            buttonTitle={selectedModel ? selectedModel.name : 'Create a Model'}
            onSubmit={handleModelCreated}
            onSecondarySubmit={addDataset}
            FormComponent={CreateModelForm}
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              textTransform: 'none',
              cursor: selectEnabled ? 'pointer' : 'default',
              backgroundColor: 'transparent',
            }}
          />
        </Box>
      </>
    );

};
