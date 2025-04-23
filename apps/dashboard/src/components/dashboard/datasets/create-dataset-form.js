/**
 * @fileoverview CreateDatasetForm component for dataset creation
 * Provides a form interface for entering dataset details and metadata
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
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { X as XIcon } from '@phosphor-icons/react';

import { dayjs } from '@/lib/dayjs';
import { Option } from '@/components/core/option';
import { datasetTypes } from '@/constants/datasets';

/**
 * CreateDatasetForm component for dataset creation
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to handle form close
 * @param {Function} props.onSubmit - Function to handle form submission
 * @returns {JSX.Element} Rendered form component
 * 
 * @description
 * This component provides:
 * - Form fields for dataset details
 * - Dataset type selection
 * - File upload handling
 * - Form validation and submission
 */
export function CreateDatasetForm({ onClose, onSubmit }) {
  // State to manage form fields
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [version, setVersion] = useState('');
  const [datasetCreationDate, setDatasetCreationDate] = useState(dayjs());

  /**
   * Handles form submission
   * Collects form data and calls onSubmit callback
   */
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

    // Reset form state
    setName('');
    setUrl('');
    setType('');
    setVersion('');
    setDescription('');
    setDatasetCreationDate(dayjs());
    onClose();
  };

  return (
    <>
      <DialogContent>
        <Stack spacing={3} sx={{ px: 1, py: 2 }}>
          <Stack spacing={3}>
            <Stack direction={'row'} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Dataset Name</InputLabel>
                <OutlinedInput
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Update name state
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Dataset Url</InputLabel>
                <OutlinedInput
                  name="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)} // Update url state
                />
              </FormControl>
            </Stack>
            <FormControl>
              <InputLabel>Description</InputLabel>
              <OutlinedInput
                name="description"
                value={description}
                multiline // This makes the TextField a text area
                rows={2}
                onChange={(e) => setDescription(e.target.value)} // Update description state
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Model type</InputLabel>
              <Select
                defaultValue=""
                name="type"
                onChange={(e) => setType(e.target.value)}
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

            {/* Row with Provider and Model Creation Date */}
            <Stack direction={'row'} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Version</InputLabel>
                <OutlinedInput
                  name="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)} // Update url state
                />
              </FormControl>

              <FormControl fullWidth>
                <DateTimePicker
                  fullWidth
                  format="MMM D, YYYY hh:mm A"
                  label="Dataset creation date"
                  value={datasetCreationDate}
                  onChange={(newValue) => setDatasetCreationDate(newValue)}
                />
              </FormControl>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
            <Button color="secondary" variant="outlined" onClick={onClose} sx={{ width: '9vmax' }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ width: '9vmax' }}>
              Confirm
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </>
  );
}
