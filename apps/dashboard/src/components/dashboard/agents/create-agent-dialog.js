/**
 * Create Agent Dialog Component
 * 
 * A dialog interface for creating new agents or updating existing ones.
 * Provides a form for entering agent details with support for both creation
 * and editing modes.
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  CircularProgress,
  Backdrop,
} from '@mui/material';

/**
 * CreateAgentDialog Component
 * 
 * A dialog component that provides a form for creating new agents or
 * updating existing ones. Includes fields for agent name and description,
 * with support for loading states and form validation.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Callback function when dialog is closed
 * @param {Function} props.onCreate - Callback function when form is submitted
 * @param {Object} [props.initialData] - Initial data for the form in edit mode
 * @param {boolean} [props.isEdit=false] - Whether the dialog is in edit mode
 * @param {boolean} [props.isLoading=false] - Whether the form is in a loading state
 * @returns {JSX.Element} The create agent dialog component
 */
export const CreateAgentDialog = ({ open, onClose, onCreate, initialData, isEdit, isLoading }) => {
  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
  });

  // Initialize form with initial data when provided
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  /**
   * Handles changes to form input fields
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission
   * @param {React.FormEvent} event - The form submission event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    onCreate(formData);
    if (!isEdit) {
      setFormData({ name: '', description: '' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Loading overlay */}
      <Backdrop
        open={isLoading}
        sx={{
          position: 'absolute',
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
      >
        <CircularProgress color="primary" />
      </Backdrop>

      {/* Agent creation/editing form */}
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Update Agent' : 'Create New Agent'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Agent name input */}
            <TextField
              autoFocus
              name="name"
              label="Agent Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            {/* Agent description input */}
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          {/* Cancel button */}
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}
            sx={{
              backgroundImage: 'none',  // Remove gradient
              backgroundColor: 'primary.main',  // Use solid color
              '&:hover': {
                backgroundImage: 'none',
                backgroundColor: 'primary.light',
              },
            }}

          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 