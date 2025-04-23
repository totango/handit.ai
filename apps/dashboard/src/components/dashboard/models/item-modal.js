/**
 * @fileoverview ItemModal component for displaying and editing model details
 * Provides a modal interface for viewing and modifying model information
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
import { Chip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Star as StarIcon } from '@phosphor-icons/react/dist/ssr/Star';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { dayjs } from '@/lib/dayjs';
import { DropDownDescriptionSelector } from '@/components/core/DropDownDescriptionSelector';
import { Option } from '@/components/core/option';
import { aiProblemTypes, modelTypes, providers } from '@/constants/models';

import { DatasetsInput } from './datasets-input';

const typeOptions = ['percentage', 'numeric'];

/**
 * Header component for the modal
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - Model data
 * @param {boolean} props.editMode - Whether in edit mode
 * @param {Function} props.toggleEditMode - Function to toggle edit mode
 * @param {Function} props.onFavorite - Function to handle favorite toggle
 * @param {Function} props.onClose - Function to handle modal close
 * @param {Function} props.onChange - Function to handle input changes
 * @returns {JSX.Element} Rendered header component
 */
function Header({ item, editMode, toggleEditMode, onFavorite, onClose, onChange }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        borderBottom: '1px solid var(--mui-palette-divider)',
        flex: '0 0 auto',
        justifyContent: 'space-between',
        p: 3,
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <IconButton onClick={() => onFavorite?.(item.id, !item.isFavorite)}>
          <StarIcon color="var(--mui-palette-warning-main)" weight={item.isFavorite ? 'fill' : undefined} />
        </IconButton>
        {editMode ? (
          <TextField variant="outlined" name="name" value={item.name} onChange={onChange} />
        ) : (
          <>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="h6">({item.slug})</Typography>
          </>
        )}
      </Stack>
      <IconButton onClick={onClose}>
        <XIcon />
      </IconButton>
    </Stack>
  );
}

/**
 * DetailsSection component for displaying and editing model details
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.editableItem - Model data being edited
 * @param {boolean} props.editMode - Whether in edit mode
 * @param {Function} props.handleChange - Function to handle input changes
 * @param {Array<Object>} [props.existingDatasets=[]] - Available datasets
 * @param {boolean} props.showDatasetInput - Whether to show dataset input
 * @param {Function} props.setShowDatasetInput - Function to toggle dataset input
 * @returns {JSX.Element} Rendered details section
 */
function DetailsSection({
  editableItem,
  editMode,
  handleChange,
  existingDatasets = [],
  showDatasetInput,
  setShowDatasetInput,
}) {
  const readableProvider = providers.find((provider) => provider.value === editableItem?.provider)?.label || '';
  const readableType = modelTypes.find((type) => type.value === editableItem?.type)?.label || '';
  const readableAiProblemType = aiProblemTypes.find((type) => type.value === editableItem?.problemType)?.label || '';
  const datasets = editableItem?.datasets || [];

  return (
    <Grid container spacing={3} sx={{ px: 3, py: 2 }}>
      {/* Model URL */}
      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2">
          Model URL
        </Typography>
      </Grid>
      <Grid sm={9} xs={12}>
        {editMode ? (
          <TextField variant="outlined" name="url" value={editableItem.url} onChange={handleChange} fullWidth />
        ) : (
          <Typography variant="body2">{editableItem.url || 'Not defined'}</Typography>
        )}
      </Grid>

      {/* Description */}
      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2">
          Description
        </Typography>
      </Grid>
      <Grid sm={9} xs={12}>
        {editMode ? (
          <TextField
            variant="outlined"
            name="description"
            value={editableItem.description}
            onChange={handleChange}
            fullWidth
            multiline // This makes the TextField a text area
            rows={2} // Specifies the number of visible rows
          />
        ) : (
          <Typography variant="body2">{editableItem.description}</Typography>
        )}
      </Grid>

      {/* Datasets */}
      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
          Datasets
        </Typography>
      </Grid>
      <Grid sm={9} xs={12}>
        {editMode || showDatasetInput ? (
          <DatasetsInput
            datasets={datasets}
            handleDatasetChange={handleChange}
            existingDatasets={existingDatasets}
            showCreateButton={false}
            showLabel={false}
          />
        ) : (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            {datasets.map((dataset) => (
              <Chip key={dataset.id} label={dataset.name} size="small" variant="soft" />
            ))}
            <IconButton onClick={() => setShowDatasetInput(true)}>
              <PlusIcon />
            </IconButton>
          </Stack>
        )}
      </Grid>

      {/* Model Type */}
      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2">
          Model type
        </Typography>
      </Grid>
      <Grid sm={9} xs={12}>
        {editMode ? (
          <DropDownDescriptionSelector
            labelName={'type'}
            placeholder={'Select your model type'}
            type={editableItem.type}
            handleChange={handleChange}
            typesOptions={modelTypes}
          />
        ) : (
          <Typography variant="body2">{readableType || 'Not defined'}</Typography>
        )}
      </Grid>

      {/* AI Problem Type */}
      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2">
          AI problem type
        </Typography>
      </Grid>
      <Grid sm={9} xs={12}>
        {editMode ? (
          <DropDownDescriptionSelector
            labelName={'problemType'}
            placeholder={'Select the AI model type'}
            type={editableItem.problemType}
            handleChange={handleChange}
            typesOptions={aiProblemTypes}
          />
        ) : (
          <Typography variant="body2">{readableAiProblemType || 'Not defined'}</Typography>
        )}
      </Grid>

      {/* Provider */}
      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2">
          Provider
        </Typography>
      </Grid>
      <Grid sm={9} xs={12}>
        {editMode ? (
          <FormControl fullWidth>
            <Select
              defaultValue={editableItem.provider || ''}
              name="provider"
              onChange={handleChange} // Update provider state
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: '9vmax', // Limit the height to 200px, adjust as needed
                  },
                },
              }}
            >
              <Option value="">Select a provider</Option>
              {providers.data?.map((provider) => (
                <Option key={provider.value} value={provider.value}>
                  {provider.label}
                </Option>
              ))}
              <Option value="other">Other</Option>
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2">{readableProvider || 'Not defined'}</Typography>
        )}
      </Grid>
    </Grid>
  );
}

/**
 * Actions component for model operations and timestamps
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.editableItem - Model data being edited
 * @param {boolean} props.editMode - Whether in edit mode
 * @param {Function} props.handleSave - Function to handle save action
 * @param {Function} props.toggleEditMode - Function to toggle edit mode
 * @param {Function} props.cancelEditMode - Function to cancel edit mode
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {Function} props.handleChange - Function to handle input changes
 * @param {boolean} props.showDatasetInput - Whether to show dataset input
 * @returns {JSX.Element} Rendered actions component
 */
function Actions({
  editableItem,
  editMode,
  handleSave,
  toggleEditMode,
  cancelEditMode,
  onDelete,
  handleChange,
  showDatasetInput,
}) {
  return (
    <Stack
      sx={{
        borderTop: '1px solid var(--mui-palette-divider)',
        flex: '0 0 auto',
        justifyContent: 'space-between',
        py: 4,
        mx: 3,
      }}
    >
      <Grid alignItems="center" container spacing={3}>
        {/* Creation Date */}
        <Grid sm={3} xs={12}>
          <Typography color="text.secondary" variant="body2">
            Model created At
          </Typography>
        </Grid>
        <Grid sm={9} xs={12}>
          {editMode ? (
            <TextField
              type="datetime-local"
              variant="outlined"
              name="modelCreationDate"
              value={
                editableItem.modelCreationDate ? dayjs(editableItem.modelCreationDate).format('YYYY-MM-DDTHH:mm') : ''
              }
              onChange={handleChange}
              fullWidth
            />
          ) : (
            <Typography variant="body2">
              {editableItem.modelCreationDate
                ? dayjs(editableItem.modelCreationDate).format('MMM D, YYYY hh:mm A')
                : undefined}
            </Typography>
          )}
        </Grid>

        {/* Modified Date */}
        <Grid sm={3} xs={12}>
          <Typography color="text.secondary" variant="body2">
            Modified At
          </Typography>
        </Grid>
        <Grid sm={9} xs={12}>
          <Typography variant="body2">
            {editableItem.updatedAt ? dayjs(editableItem.updatedAt).format('MMM D, YYYY hh:mm A') : undefined}
          </Typography>
        </Grid>

        {/* Action Buttons */}
        {!editMode && (
          <>
            <Grid sm={3} xs={12}>
              <Typography color="text.secondary" variant="body2">
                Actions
              </Typography>
            </Grid>
            <Grid sm={1} xs={4}>
              <IconButton onClick={toggleEditMode}>
                <PencilSimpleIcon />
              </IconButton>
            </Grid>
            <Grid sm={1} xs={4}>
              <IconButton
                color="error"
                onClick={() => {
                  onDelete?.(editableItem.id);
                }}
              >
                <TrashIcon />
              </IconButton>
            </Grid>
          </>
        )}
      </Grid>

      {/* Save/Cancel Buttons */}
      {(editMode || showDatasetInput) && (
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button onClick={cancelEditMode} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

/**
 * ItemModal component for displaying and editing model details
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - Model data to display
 * @param {Function} props.onClose - Function to handle modal close
 * @param {Array<Object>} [props.existingDatasets=[]] - Available datasets
 * @param {Function} props.onDelete - Function to handle model deletion
 * @param {Function} props.onUpdate - Function to handle model updates
 * @param {Function} props.onFavorite - Function to handle favorite toggle
 * @param {boolean} [props.open=false] - Whether the modal is open
 * @param {boolean} [props.initialEditMode=false] - Initial edit mode state
 * @returns {JSX.Element} Rendered modal component
 * 
 * @description
 * This component provides:
 * - Modal interface for model details
 * - Edit mode for updating model information
 * - Dataset management
 * - Timestamp display and editing
 * - Favorite toggle functionality
 * - Delete and update operations
 */
export function ItemModal({
  item,
  onClose,
  existingDatasets = [],
  onDelete,
  onUpdate,
  onFavorite,
  open = false,
  initialEditMode = false,
}) {
  // State management
  const [editMode, setEditMode] = useState(initialEditMode);
  const [editableItem, setEditableItem] = useState(item);
  const [showDatasetInput, setShowDatasetInput] = useState(false);

  /**
   * Handles input changes in edit mode
   * @param {Event} e - Change event
   * @param {*} finalValue - Final value for dataset changes
   */
  const handleChange = (e, finalValue) => {
    const { name, value } = e.target;
    setEditableItem({
      ...editableItem,
      [name || 'datasets']: value || finalValue,
    });
  };

  /**
   * Toggles edit mode and resets form state if exiting
   */
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (editMode) {
      setEditableItem(item);
    }
  };

  /**
   * Cancels edit mode and dataset input
   */
  const cancelEditMode = () => {
    setShowDatasetInput(false);
    setEditMode(false);
  };

  /**
   * Handles saving changes to the model
   */
  const handleSave = () => {
    const datasetIds = editableItem?.datasets?.map((dataset) => dataset.id) || [];
    onUpdate?.({ ...editableItem, datasetIds });
    cancelEditMode();
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiDialog-container': { justifyContent: 'flex-end' },
        '& .MuiDialog-paper': { height: '100%', width: '100%' },
      }}
    >
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, p: 0 }}>
        <Stack direction="column" spacing={2} sx={{ flex: '1 1 auto', overflowY: 'auto' }}>
          <Header
            item={editableItem}
            editMode={editMode}
            toggleEditMode={toggleEditMode}
            onFavorite={onFavorite}
            onClose={onClose}
            onChange={handleChange}
          />
          <DetailsSection
            editableItem={editableItem}
            editMode={editMode}
            handleChange={handleChange}
            datasets={item.datasets}
            existingDatasets={existingDatasets}
            showDatasetInput={showDatasetInput}
            setShowDatasetInput={setShowDatasetInput}
          />
          <Actions
            editableItem={editableItem}
            editMode={editMode}
            handleSave={handleSave}
            handleChange={handleChange}
            toggleEditMode={toggleEditMode}
            cancelEditMode={cancelEditMode}
            onDelete={() => onDelete?.(item.id)}
            showDatasetInput={showDatasetInput}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
