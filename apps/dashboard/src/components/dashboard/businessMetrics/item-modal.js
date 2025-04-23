/**
 * @fileoverview ItemModal component for displaying and editing KPI details
 * Provides a modal dialog for viewing and editing KPI information
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
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
import { Star as StarIcon } from '@phosphor-icons/react/dist/ssr/Star';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { dayjs } from '@/lib/dayjs';

/**
 * Available KPI type options
 * @type {Array<string>}
 */
const typeOptions = ['percentage', 'numeric'];

/**
 * Header component for the item modal
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - KPI item data
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
 * Details section component for displaying and editing KPI details
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.editableItem - Current editable item data
 * @param {boolean} props.editMode - Whether the section is in edit mode
 * @param {Function} props.handleChange - Function to handle input changes
 * @returns {JSX.Element} Rendered details section
 */
function DetailsSection({ editableItem, editMode, handleChange }) {
  return (
    <Grid container spacing={3} sx={{ px: 3, py: 2 }}>
      {/* Description */}
      <Grid sm={4} xs={12}>
        <Typography color="text.secondary" variant="body2">
          Description
        </Typography>
      </Grid>
      <Grid sm={8} xs={12}>
        {editMode ? (
          <TextField
            variant="outlined"
            name="description"
            value={editableItem.description}
            onChange={handleChange}
            fullWidth
            multiline // This makes the TextField a text area
            rows={3} // Specifies the number of visible rows
          />
        ) : (
          <Typography variant="body2">{editableItem.description}</Typography>
        )}
      </Grid>

      {/* Current Value */}
      <Grid sm={4} xs={12}>
        <Typography color="text.secondary" variant="body2">
          KPI Current Value
        </Typography>
      </Grid>
      <Grid sm={8} xs={12}>
        {editMode ? (
          <TextField
            variant="outlined"
            name="currentValue"
            value={editableItem.currentValue}
            onChange={handleChange}
            fullWidth
          />
        ) : (
          <Typography variant="body2">{editableItem.currentValue || 'Not defined'}</Typography>
        )}
      </Grid>

      {/* Target Value */}
      <Grid sm={4} xs={12}>
        <Typography color="text.secondary" variant="body2">
          KPI Target Value
        </Typography>
      </Grid>
      <Grid sm={8} xs={12}>
        {editMode ? (
          <TextField variant="outlined" name="target" value={editableItem.target} onChange={handleChange} fullWidth />
        ) : (
          <Typography variant="body2">{editableItem.target || 'Not defined'}</Typography>
        )}
      </Grid>

      {/* Type */}
      <Grid sm={4} xs={12}>
        <Typography color="text.secondary" variant="body2">
          KPI Type
        </Typography>
      </Grid>
      <Grid sm={8} xs={12}>
        {editMode ? (
          <FormControl fullWidth>
            <Select labelId="type-label" name="type" value={editableItem.type || ''} onChange={handleChange}>
              {typeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2">{editableItem.type || 'Numeric'}</Typography>
        )}
      </Grid>

      {/* Target Date */}
      <Grid sm={4} xs={12}>
        <Typography color="text.secondary" variant="body2">
          KPI Target Date
        </Typography>
      </Grid>
      <Grid sm={8} xs={12}>
        {editMode ? (
          <TextField
            type="datetime-local"
            variant="outlined"
            name="targetDate"
            value={editableItem.targetDate ? dayjs(editableItem.targetDate).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={handleChange}
            fullWidth
          />
        ) : (
          <Typography variant="body2">
            {editableItem.targetDate ? dayjs(editableItem.targetDate).format('MMM D, YYYY hh:mm A') : undefined}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

/**
 * Actions component for the item modal
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.editableItem - Current editable item data
 * @param {boolean} props.editMode - Whether the modal is in edit mode
 * @param {Function} props.handleSave - Function to handle save action
 * @param {Function} props.toggleEditMode - Function to toggle edit mode
 * @param {Function} props.onDelete - Function to handle delete action
 * @returns {JSX.Element} Rendered actions component
 */
function Actions({ editableItem, editMode, handleSave, toggleEditMode, onDelete }) {
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
        {/* Created At */}
        <Grid sm={4} xs={12}>
          <Typography color="text.secondary" variant="body2">
            Created At
          </Typography>
        </Grid>
        <Grid sm={8} xs={12}>
          <Typography variant="body2">
            {editableItem.createdAt ? dayjs(editableItem.createdAt).format('MMM D, YYYY hh:mm A') : undefined}
          </Typography>
        </Grid>

        {/* Modified At */}
        <Grid sm={4} xs={12}>
          <Typography color="text.secondary" variant="body2">
            Modified At
          </Typography>
        </Grid>
        <Grid sm={8} xs={12}>
          <Typography variant="body2">
            {editableItem.updatedAt ? dayjs(editableItem.updatedAt).format('MMM D, YYYY hh:mm A') : undefined}
          </Typography>
        </Grid>

        <>
          <Grid sm={4} xs={12}>
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
      </Grid>

      {/* Save/Cancel Buttons */}
      {editMode && (
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={toggleEditMode} variant="outlined" color="secondary">
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
 * ItemModal component for displaying and editing KPI details
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - KPI item data
 * @param {Function} props.onClose - Function to handle modal close
 * @param {Function} props.onDelete - Function to handle item deletion
 * @param {Function} props.onUpdate - Function to handle item update
 * @param {Function} props.onFavorite - Function to handle favorite toggle
 * @param {boolean} [props.open=false] - Whether the modal is open
 * @param {boolean} [props.initialEditMode=false] - Initial edit mode state
 * @returns {JSX.Element} Rendered modal component
 * 
 * @description
 * This component provides:
 * - A modal dialog for viewing and editing KPI details
 * - Form fields for all KPI properties
 * - Actions for editing, deleting, and favoriting KPIs
 * - Timestamp display for creation and modification dates
 */
export function ItemModal({ item, onClose, onDelete, onUpdate, onFavorite, open = false, initialEditMode = false }) {
  // Edit mode state
  const [editMode, setEditMode] = useState(initialEditMode);

  // Form state
  const [editableItem, setEditableItem] = useState(item);

  /**
   * Handles input changes in edit mode
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
   * Toggles edit mode
   */
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (editMode) {
      // If exiting edit mode, reset the form state to the original item
      setEditableItem(item);
    }
  };

  /**
   * Handles save action
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
          <DetailsSection editableItem={editableItem} editMode={editMode} handleChange={handleChange} />
          <Actions
            editableItem={editableItem}
            editMode={editMode}
            handleSave={handleSave}
            toggleEditMode={toggleEditMode}
            onDelete={() => onDelete?.(item.id)}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
