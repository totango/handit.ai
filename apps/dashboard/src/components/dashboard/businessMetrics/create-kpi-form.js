/**
 * @fileoverview CreateKpiForm component for creating new KPIs
 * Provides a form dialog for entering KPI details and creating new KPIs
 */

'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Grid, Radio, RadioGroup } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { X as XIcon } from '@phosphor-icons/react';

import { dayjs } from '@/lib/dayjs';

/**
 * Available KPI types with their labels
 * @type {Array<{label: string, value: string}>}
 */
const kpiTypes = [
  { label: 'Numeric', value: 'numeric' },
  { label: 'Percentage', value: 'percentage' },
];

/**
 * CreateKpiForm component for creating new KPIs
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to handle dialog close
 * @param {boolean} [props.open=false] - Whether the dialog is open
 * @param {Function} props.onSubmit - Function to handle form submission
 * @returns {JSX.Element} Rendered form dialog component
 * 
 * @description
 * This component provides:
 * - A form dialog for creating new KPIs
 * - Input fields for all KPI properties
 * - KPI type selection
 * - Target date picker
 * - Form validation and submission handling
 */
export function CreateKpiForm({ onClose, open = false, onSubmit }) {
  // Form state management
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [targetDate, setTargetDate] = useState(dayjs());
  const [currentValue, setCurrentValue] = useState('');
  const [type, setType] = useState('');

  /**
   * Handles form submission
   * Collects form data and calls onSubmit callback
   */
  const handleSubmit = () => {
    const kpiData = {
      name,
      description,
      target,
      targetDate,
      currentValue,
      type,
    };

    onSubmit(kpiData); // Pass the form data to the parent component or API

    // Reset form state
    setName('');
    setDescription('');
    setTarget('');
    setTargetDate(dayjs());
    setCurrentValue('');
    setType('');
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      {/* Dialog header */}
      <Box sx={{ px: 1, border: '1px solid var(--mui-palette-divider)' }}>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
          <Typography variant="h6">Create your KPI</Typography>
          <IconButton onClick={onClose}>
            <XIcon />
          </IconButton>
        </Stack>
      </Box>
      <DialogContent>
        <Stack divider={<Divider />} spacing={3} sx={{ px: 1, py: 3 }}>
          <Stack spacing={3}>
            {/* KPI Name input */}
            <FormControl>
              <InputLabel>KPI Name</InputLabel>
              <OutlinedInput
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)} // Update name state
              />
            </FormControl>

            {/* Description input */}
            <FormControl>
              <InputLabel>Description</InputLabel>
              <OutlinedInput
                name="description"
                value={description}
                multiline // This makes the TextField a text area
                rows={3}
                onChange={(e) => setDescription(e.target.value)} // Update description state
              />
            </FormControl>

            {/* Current Value input */}
            <FormControl>
              <InputLabel>KPI Current Value</InputLabel>
              <OutlinedInput
                name="currentValue"
                value={currentValue}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value))} // Update currentValue state
              />
            </FormControl>

            {/* KPI Type selection */}
            <RadioGroup
              defaultValue="numeric"
              name="kpiType"
              row
              sx={{ mb: 1 }}
              onChange={(e) => setType(e.target.value)}
            >
              {kpiTypes.map((kpiType) => (
                <FormControlLabel control={<Radio />} key={kpiType.value} label={kpiType.label} value={kpiType.value} />
              ))}
            </RadioGroup>

            {/* Target Value and Date inputs */}
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid sm={5.8} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>KPI target value</InputLabel>
                  <OutlinedInput
                    name="firstName"
                    value={target}
                    onChange={(e) => setTarget(parseFloat(e.target.value))}
                  />
                </FormControl>
              </Grid>
              <Grid sm={5.8} xs={12}>
                <DateTimePicker
                  format="MMM D, YYYY hh:mm A"
                  label="KPI Target Date"
                  value={targetDate}
                  onChange={(newValue) => setTargetDate(newValue)} // Update targetDate state
                />
              </Grid>
            </Grid>
          </Stack>

          {/* Action buttons */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button color="secondary" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Confirm
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
