/**
 * MultiSelect Component
 * 
 * A reusable multi-select dropdown component built with Material-UI.
 * Allows users to select multiple options from a dropdown menu, with
 * visual feedback for selected items and a clean interface for managing
 * selections.
 */

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';

import { usePopover } from '@/hooks/use-popover';

/**
 * MultiSelect Component
 * 
 * Renders a button that opens a dropdown menu with multiple selectable options.
 * Maintains a list of selected values and provides callbacks for selection changes.
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - The label text to display on the button
 * @param {Function} [props.onChange] - Callback function when selections change
 * @param {Array<{label: string, value: any}>} props.options - Array of options to display
 * @param {Array<any>} [props.value=[]] - Array of currently selected values
 * @returns {JSX.Element} The multi-select component
 */
export function MultiSelect({ label, onChange, options, value = [] }) {
  // Initialize popover state and handlers
  const popover = usePopover();

  /**
   * Handles changes to the selected values
   * 
   * @param {any} v - The value to add or remove
   * @param {boolean} checked - Whether the value should be added (true) or removed (false)
   */
  const handleValueChange = React.useCallback(
    (v, checked) => {
      let updateValue = [...value];

      if (checked) {
        // Add the value to the selection
        updateValue.push(v);
      } else {
        // Remove the value from the selection
        updateValue = updateValue.filter((item) => item !== v);
      }

      // Notify parent component of the change
      onChange?.(updateValue);
    },
    [onChange, value]
  );

  return (
    <React.Fragment>
      {/* Trigger button with dropdown icon */}
      <Button
        color="secondary"
        endIcon={<CaretDownIcon />}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{ '& .MuiButton-endIcon svg': { fontSize: 'var(--icon-fontSize-sm)' } }}
      >
        {label}
      </Button>

      {/* Dropdown menu with selectable options */}
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        slotProps={{ paper: { sx: { width: '250px' } } }}
      >
        {options.map((option) => {
          const selected = value.includes(option.value);

          return (
            <MenuItem
              key={option.label}
              onClick={() => {
                handleValueChange(option.value, !selected);
              }}
              selected={selected}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Menu>
    </React.Fragment>
  );
}
