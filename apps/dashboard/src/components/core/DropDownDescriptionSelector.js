/**
 * Dropdown Description Selector Component
 * 
 * A specialized dropdown component that displays options with both labels
 * and descriptions. Built on Material-UI's Select component, it provides
 * a rich selection interface with detailed option information and a custom
 * "Other" option.
 */

import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

/**
 * Dropdown Description Selector Component
 * 
 * Renders a dropdown menu where each option displays both a label and a
 * description. Supports custom placeholder text and includes a default
 * "Other" option for cases not covered by the provided options.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.title] - Label text for the dropdown
 * @param {string} props.labelName - Name attribute for the select input
 * @param {string} props.type - Currently selected value
 * @param {Function} props.handleChange - Change handler for selection
 * @param {string} props.placeholder - Placeholder text when no option is selected
 * @param {Array<{value: string, label: string, description: string}>} props.typesOptions - Available options with labels and descriptions
 * @returns {JSX.Element} A dropdown selector with descriptive options
 */
export const DropDownDescriptionSelector = ({ title, labelName, type, handleChange, placeholder, typesOptions }) => {
  return (
    <FormControl fullWidth>
      {/* Optional title label */}
      {title && <InputLabel>{title}</InputLabel>}
      <Select
        value={type}
        name={labelName}
        onChange={handleChange}
        sx={{ height: '2.5vmax' }}
        MenuProps={{
          PaperProps: {
            style: { maxHeight: '11vmax' }, // Keep this for the menu height
          },
        }}
        renderValue={(selected) => {
          // Handle empty selection
          if (!selected) {
            return <span>{placeholder}</span>;
          }
          // Find and display selected option
          const selectedType = typesOptions.find((model) => model.value === selected);
          return selectedType ? selectedType.label : 'Other';
        }}
      >
        {/* Map through provided options */}
        {typesOptions.map((type) => (
          <MenuItem key={type.value} value={type.value} sx={{ mr: 1, py: 0.6 }}>
            <div>
              {/* Option label */}
              <Typography variant="body2" fontWeight="bold">
                {type.label}
              </Typography>
              {/* Option description */}
              <Typography variant="body2" color="textSecondary">
                {type.description}
              </Typography>
            </div>
          </MenuItem>
        ))}

        {/* Default "Other" option */}
        <MenuItem value="other">
          <Box display="block">
            <Typography variant="body2" fontWeight="bold">
              Other
            </Typography>
            <Typography variant="body2" fontWeight="textSecondary">
              Select this if the your option is not listed
            </Typography>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};
