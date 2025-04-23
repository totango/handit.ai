/**
 * @fileoverview DatasetsInput component for managing dataset selection
 * Provides an autocomplete input for selecting and managing datasets with creation capability
 */

'use client';

import * as React from 'react';
import { useGetDatasetsQuery } from '@/services/datasetsService';
import { Autocomplete, Chip, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';

/**
 * DatasetsInput component for managing dataset selection
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} [props.datasets=[]] - Currently selected datasets
 * @param {Function} props.handleDatasetChange - Function to handle dataset selection changes
 * @param {boolean} [props.showLabel=true] - Whether to show the input label
 * @param {boolean} [props.showCreateButton=true] - Whether to show the create button
 * @param {Function} props.onCreateDataset - Function to handle dataset creation
 * @returns {JSX.Element} Rendered input component
 * 
 * @description
 * This component provides:
 * - Autocomplete input for dataset selection
 * - Multiple dataset selection with chips
 * - Dataset filtering to prevent duplicates
 * - Create dataset button integration
 * - Custom styling for input and chips
 */
export function DatasetsInput({
  datasets = [],
  handleDatasetChange,
  showLabel = true,
  showCreateButton = true,
  onCreateDataset,
}) {
  // Fetch available datasets
  const { data: initialDatasets, error, isLoading } = useGetDatasetsQuery();
  const existingDatasets = initialDatasets || [];

  // Filter out already selected datasets
  const availableDatasets = existingDatasets.filter(
    (dataset) => !datasets.some((selectedDataset) => selectedDataset.id === dataset.id)
  );

  return (
    <Stack>
      <FormControl fullWidth>
        <Autocomplete
          multiple
          freeSolo
          disableClearable
          options={availableDatasets} // Filtered datasets as options
          getOptionLabel={(option) => option.name || ''} // Extract label from dataset objects
          value={datasets}
          onChange={handleDatasetChange} // Update datasets on selection
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip variant="outlined" label={option.name} {...getTagProps({ index })} key={option.id} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={showLabel ? 'Datasets' : null}
              name={'datasets'}
              InputProps={{
                ...params.InputProps,
                // Custom start adornment for chips
                startAdornment: (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      overflowY: 'auto',
                    }}
                  >
                    {params.InputProps.startAdornment}
                  </div>
                ),
                // Custom end adornment for create button
                endAdornment: (
                  <InputAdornment
                    sx={{
                      flex: 1,
                      justifyContent: 'end',
                      position: 'absolute',
                      right: 0,
                      transform: 'translateY(-50%)',
                      margin: '8px',
                      marginLeft: '20px',
                      display: showCreateButton ? 'inline-flex' : 'none',
                    }}
                  >
                    <Button
                      color="primary"
                      sx={{ marginRight: 0, px: 1, whiteSpace: 'nowrap' }}
                      onClick={onCreateDataset}
                    >
                      Create
                    </Button>
                  </InputAdornment>
                ),
              }}
              // Custom styling for input and chips
              sx={{
                '& .MuiOutlinedInput-root': {
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                },
                '& .MuiInputBase-input': {
                  flexGrow: 1, // Ensure input grows with space
                },
              }}
            />
          )}
        />
      </FormControl>
    </Stack>
  );
}
