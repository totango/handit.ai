/**
 * Filter Button Components
 * 
 * A set of components for implementing filter functionality in the application.
 * Includes a context provider, button components, and a popover component for
 * filter controls. Supports both dialog and popover-based filter interfaces.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MinusCircle as MinusCircleIcon } from '@phosphor-icons/react/dist/ssr/MinusCircle';
import { PlusCircle as PlusCircleIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';

import { usePopover } from '@/hooks/use-popover';

/**
 * No-operation function used as a default context value
 */
function noop(..._) {
  // Do nothing
}

/**
 * Filter Context
 * 
 * React context for managing filter state and operations.
 * Provides access to the filter's anchor element, open state,
 * and callback functions for applying and closing filters.
 */
export const FilterContext = React.createContext({
  anchorEl: null,
  onApply: noop,
  onClose: noop,
  open: false,
  value: undefined,
});

/**
 * Hook for accessing the filter context
 * 
 * @returns {Object} The filter context value
 * @throws {Error} If used outside of a FilterProvider
 */
export function useFilterContext() {
  const context = React.useContext(FilterContext);

  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }

  return context;
}

/**
 * Filter Button Dialog Component
 * 
 * A button component that opens a dialog for filter controls.
 * Supports displaying the current filter value and provides
 * a delete option when a filter is active.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.displayValue] - The current filter value to display
 * @param {string} props.label - The filter label
 * @param {Function} [props.onFilterApply] - Callback when filter is applied
 * @param {Function} [props.onFilterDelete] - Callback when filter is deleted
 * @param {React.ReactNode} props.dialog - The dialog component to render
 * @param {string|number|boolean} [props.value] - The current filter value
 * @returns {JSX.Element} A filter button with dialog support
 */
export function FilterButtonDialog({ displayValue, label, onFilterApply, onFilterDelete, dialog, value }) {
  const { anchorRef, handleOpen, handleClose, open } = usePopover();

  // Handle filter application
  const handleApply = React.useCallback(
    (newValue) => {
      handleClose();
      onFilterApply?.(newValue);
    },
    [handleClose, onFilterApply]
  );

  return (
    <FilterContext.Provider
      value={{ anchorEl: anchorRef.current, onApply: handleApply, onClose: handleClose, open, value }}
    >
      <Button
        color="secondary"
        onClick={handleOpen}
        startIcon={
          value ? (
            // Delete filter button
            <Box
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onFilterDelete?.();
              }}
              onKeyUp={(event) => {
                event.stopPropagation();
                event.preventDefault();

                if (event.key === 'Enter' || event.key === ' ') {
                  onFilterDelete?.();
                }
              }}
              role="button"
              sx={{ display: 'flex' }}
              tabIndex={0}
            >
              <MinusCircleIcon />
            </Box>
          ) : (
            // Add filter button
            <PlusCircleIcon />
          )
        }
        variant="outlined"
      >
        <span>
          {label}
          {displayValue ? (
            <React.Fragment>
              :{' '}
              <Box component="span" sx={{ color: 'var(--mui-palette-primary-main)' }}>
                {displayValue}
              </Box>
            </React.Fragment>
          ) : null}
        </span>
      </Button>
      {dialog}
    </FilterContext.Provider>
  );
}

/**
 * Filter Button Component
 * 
 * A button component that opens a popover for filter controls.
 * Similar to FilterButtonDialog but uses a popover instead of a dialog.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.displayValue] - The current filter value to display
 * @param {string} props.label - The filter label
 * @param {Function} [props.onFilterApply] - Callback when filter is applied
 * @param {Function} [props.onFilterDelete] - Callback when filter is deleted
 * @param {React.ReactNode} props.popover - The popover component to render
 * @param {string|number|boolean} [props.value] - The current filter value
 * @returns {JSX.Element} A filter button with popover support
 */
export function FilterButton({ displayValue, label, onFilterApply, onFilterDelete, popover, value }) {
  const { anchorRef, handleOpen, handleClose, open } = usePopover();

  // Handle filter application
  const handleApply = React.useCallback(
    (newValue) => {
      handleClose();
      onFilterApply?.(newValue);
    },
    [handleClose, onFilterApply]
  );

  return (
    <FilterContext.Provider
      value={{ anchorEl: anchorRef.current, onApply: handleApply, onClose: handleClose, open, value }}
    >
      <Button
        color="secondary"
        onClick={handleOpen}
        ref={anchorRef}
        startIcon={
          value ? (
            // Delete filter button
            <Box
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onFilterDelete?.();
              }}
              onKeyUp={(event) => {
                event.stopPropagation();
                event.preventDefault();

                if (event.key === 'Enter' || event.key === ' ') {
                  onFilterDelete?.();
                }
              }}
              role="button"
              sx={{ display: 'flex' }}
              tabIndex={0}
            >
              <MinusCircleIcon />
            </Box>
          ) : (
            // Add filter button
            <PlusCircleIcon />
          )
        }
        variant="outlined"
      >
        <span>
          {label}
          {displayValue ? (
            <React.Fragment>
              :{' '}
              <Box component="span" sx={{ color: 'var(--mui-palette-primary-main)' }}>
                {displayValue}
              </Box>
            </React.Fragment>
          ) : null}
        </span>
      </Button>
      {popover}
    </FilterContext.Provider>
  );
}

/**
 * Filter Popover Component
 * 
 * A popover component for displaying filter controls.
 * Provides a consistent layout for filter content with a title
 * and customizable children.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The filter controls to display
 * @param {string} props.title - The popover title
 * @param {Function} props.onClose - Callback when popover is closed
 * @param {HTMLElement} props.anchorEl - The element to anchor the popover to
 * @param {boolean} props.open - Whether the popover is open
 * @returns {JSX.Element} A popover for filter controls
 */
export function FilterPopover({ children, title, onClose, anchorEl, open }) {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(anchorEl && open)}
      sx={{ '& .MuiPopover-paper': { mt: '4px', width: '280px' } }}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="subtitle2">{title}</Typography>
        {children}
      </Stack>
    </Popover>
  );
}
