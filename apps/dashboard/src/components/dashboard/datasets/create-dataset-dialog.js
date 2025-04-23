/**
 * @fileoverview CreateDatasetDialog component for managing dataset creation
 * Provides a dialog interface for creating new datasets with form handling
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
import { Autocomplete, Box, Chip, Grid, InputAdornment, OutlinedInput, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { X as XIcon } from '@phosphor-icons/react';

import { dayjs } from '@/lib/dayjs';
import { Option } from '@/components/core/option';
import { datasetTypes } from '@/constants/datasets';

import { CreateDatasetForm } from './create-dataset-form';

/**
 * CreateDatasetDialog component for managing dataset creation
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to handle dialog close
 * @param {boolean} [props.open=false] - Whether the dialog is open
 * @param {Function} props.onSubmit - Function to handle form submission
 * @returns {JSX.Element} Rendered dialog component
 * 
 * @description
 * This component provides:
 * - A dialog interface for dataset creation
 * - Form integration for dataset details
 * - Close and submit handling
 */
export function CreateDatasetDialog({ onClose, open = false, onSubmit }) {
  // State to manage form fields
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [version, setVersion] = useState('');
  const [datasetCreationDate, setDatasetCreationDate] = useState(dayjs());

  const handleSubmit = () => {
    const modelData = {
      name,
      url,
      description,
      type,
      version,
      datasetCreationDate,
    };

    onSubmit(modelData); // Pass the form data to the parent component or API

    // Optional: Clear form or close the dialog
    setName('');
    setUrl('');
    setType('');
    setVersion('');
    setDescription('');
    setDatasetCreationDate(dayjs());
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <Box sx={{ px: 1, border: '1px solid var(--mui-palette-divider)' }}>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
          <Typography variant="h6">Create your Dataset</Typography>
          <IconButton onClick={onClose}>
            <XIcon />
          </IconButton>
        </Stack>
      </Box>
      <CreateDatasetForm onSubmit={onSubmit} onClose={onClose} />
    </Dialog>
  );
}
