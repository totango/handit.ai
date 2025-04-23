/**
 * @fileoverview ItemModal component for displaying and editing dataset details
 * Provides a modal interface for viewing and modifying dataset information
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Star as StarIcon } from '@phosphor-icons/react/dist/ssr/Star';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { dayjs } from '@/lib/dayjs';
import { Option } from '@/components/core/option';
import { datasetTypes } from '@/constants/datasets';
import { modelTypes, providers } from '@/constants/models';

const typeOptions = ['percentage', 'numeric'];

/**
 * Header component for the modal
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - Dataset item data
 * @param {boolean} props.editMode - Whether the modal is in edit mode
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
          <Typography variant="h6">{item.name}</Typography>
        )}
      </Stack>
      <IconButton onClick={onClose}>
        <XIcon />
      </IconButton>
    </Stack>
  );
}

/**
 * DetailsSection component for displaying dataset details
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.editableItem - Current editable dataset item
 * @param {boolean} props.editMode - Whether the modal is in edit mode
 * @param {Function} props.handleChange - Function to handle input changes
 * @returns {JSX.Element} Rendered details section component
 */
function DetailsSection({ editableItem, editMode, handleChange }) {
  const readableType = datasetTypes.find((type) => type.value === editableItem?.type)?.label || '';

  return (
    <Grid container spacing={3} sx={{ px: 3, py: 2 }}>
      {/* Current Value */}
      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2">
          Dataset URL
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

      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2">
          Version
        </Typography>
      </Grid>
      <Grid sm={9} xs={12}>
        {editMode ? (
          <TextField variant="outlined" name="version" value={editableItem.version} onChange={handleChange} fullWidth />
        ) : (
          <Typography variant="body2">{editableItem?.version || 'Not defined'}</Typography>
        )}
      </Grid>

      {/* Current Value */}
      <Grid sm={3} xs={12}>
        <Typography color="text.secondary" variant="body2">
          Dataset type
        </Typography>
      </Grid>
      <Grid sm={9} xs={12}>
        {editMode ? (
          <FormControl fullWidth>
            <Select
              defaultValue={editableItem.type || ''}
              name="type"
              onChange={handleChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: '11vmax', // Limit the height to 200px, adjust as needed
                  },
                },
              }}
            >
              <Option value="">Select your dataset type</Option>
              {datasetTypes.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
              <Option value="other">Other</Option>
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2">{readableType || 'Not defined'}</Typography>
        )}
      </Grid>
    </Grid>
  );
}

/**
 * Actions component for handling dataset actions and timestamps
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.editableItem - Current editable dataset item
 * @param {boolean} props.editMode - Whether the modal is in edit mode
 * @param {Function} props.handleSave - Function to handle save action
 * @param {Function} props.toggleEditMode - Function to toggle edit mode
 * @param {Function} props.cancelEditMode - Function to cancel edit mode
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {Function} props.handleChange - Function to handle input changes
 * @returns {JSX.Element} Rendered actions component
 */
function Actions({ editableItem, editMode, handleSave, toggleEditMode, cancelEditMode, onDelete, handleChange }) {
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
        {/* Target Date */}
        <Grid sm={3} xs={12}>
          <Typography color="text.secondary" variant="body2">
            Dataset created At
          </Typography>
        </Grid>
        <Grid sm={9} xs={12}>
          {editMode ? (
            <TextField
              type="datetime-local"
              variant="outlined"
              name="datasetCreationDate"
              value={
                editableItem.datasetCreationDate
                  ? dayjs(editableItem.datasetCreationDate).format('YYYY-MM-DDTHH:mm')
                  : ''
              }
              onChange={handleChange}
              fullWidth
            />
          ) : (
            <Typography variant="body2">
              {editableItem.datasetCreationDate
                ? dayjs(editableItem.datasetCreationDate).format('MMM D, YYYY hh:mm A')
                : undefined}
            </Typography>
          )}
        </Grid>

        {/* Modified At */}
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

      {/* Action Buttons */}
      {/* Save/Cancel Buttons */}
      {editMode && (
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
 * ItemModal component for displaying and editing dataset details
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - Dataset item data
 * @param {Function} props.onClose - Function to handle modal close
 * @param {Array} [props.existingDatasets=[]] - List of existing datasets
 * @param {Function} props.onDelete - Function to handle dataset deletion
 * @param {Function} props.onUpdate - Function to handle dataset updates
 * @param {Function} props.onFavorite - Function to handle favorite toggle
 * @param {boolean} [props.open=false] - Whether the modal is open
 * @param {boolean} [props.initialEditMode=false] - Initial edit mode state
 * @returns {JSX.Element} Rendered modal component
 * 
 * @description
 * This component provides:
 * - A modal interface for viewing dataset details
 * - Edit mode for modifying dataset information
 * - Form validation and submission
 * - Timestamp display and management
 * - Action handling (delete, favorite, edit)
 */
export function ItemModal({
  item,
  onClose,
  // TODO: fetch datasets from the api
  existingDatasets = [],
  onDelete,
  onUpdate,
  onFavorite,
  open = false,
  initialEditMode = false,
}) {
  // Edit mode state
  const [editMode, setEditMode] = useState(initialEditMode);

  // Form state
  const [editableItem, setEditableItem] = useState(item);

  /**
   * Handles input changes in the form
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableItem({
      ...editableItem,
      [name]: value,
    });
  };

  /**
   * Toggles edit mode and resets form state if exiting edit mode
   */
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (editMode) {
      // If exiting edit mode, reset the form state to the original item
      setEditableItem(item);
    }
  };

  /**
   * Cancels edit mode and resets form state
   */
  const cancelEditMode = () => {
    setEditMode(false);
  };

  /**
   * Handles saving changes to the dataset
   */
  const handleSave = () => {
    onUpdate?.(editableItem);
    setEditMode(false);
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
          />
          <Actions
            editableItem={editableItem}
            editMode={editMode}
            handleSave={handleSave}
            handleChange={handleChange}
            toggleEditMode={toggleEditMode}
            cancelEditMode={cancelEditMode}
            onDelete={() => onDelete?.(item.id)}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
