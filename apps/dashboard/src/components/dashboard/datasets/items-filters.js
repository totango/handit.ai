/**
 * @fileoverview ItemsFilters component for managing dataset list filtering and view options
 * Provides search, sorting, and view mode controls for dataset items
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Rows as RowsIcon } from '@phosphor-icons/react/dist/ssr/Rows';
import { SquaresFour as SquaresFourIcon } from '@phosphor-icons/react/dist/ssr/SquaresFour';

import { paths } from '@/paths';
import { Option } from '@/components/core/option';

/**
 * ItemsFilters component for managing dataset list filtering and view options
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.filters={}] - Current filter values
 * @param {string} [props.sortDir='desc'] - Current sort direction ('asc' or 'desc')
 * @param {string} [props.view='grid'] - Current view mode ('grid' or 'list')
 * @returns {JSX.Element} Rendered filters component
 * 
 * @description
 * This component provides:
 * - Search functionality for datasets
 * - Sort direction control (newest/oldest)
 * - View mode toggle (grid/list)
 * - URL-based state management
 * - Keyboard navigation support
 */
export function ItemsFilters({ filters = {}, sortDir = 'desc', view = 'grid' }) {
  const router = useRouter();

  // Search query state
  const [query, setQuery] = React.useState(filters.query ?? '');

  // Update query state when filters change
  React.useEffect(() => {
    setQuery(filters.query ?? '');
  }, [filters]);

  /**
   * Updates URL search parameters with new filter values
   * @param {Object} newFilters - New filter values
   * @param {string} newSortDir - New sort direction
   */
  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      // Keep the view mode
      if (view) {
        searchParams.set('view', view);
      }

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.query) {
        searchParams.set('query', newFilters.query);
      }

      router.push(`${paths.dashboard.datasets}?${searchParams.toString()}`);
    },
    [router, view]
  );

  /**
   * Handles search query input changes
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event
   */
  const handleQueryChange = React.useCallback((event) => {
    setQuery(event.target.value);
  }, []);

  /**
   * Applies the current search query
   */
  const handleQueryApply = React.useCallback(() => {
    updateSearchParams({ ...filters, query }, sortDir);
  }, [updateSearchParams, filters, query, sortDir]);

  /**
   * Handles sort direction changes
   * @param {React.ChangeEvent<HTMLSelectElement>} event - Select change event
   */
  const handleSortChange = React.useCallback(
    (event) => {
      updateSearchParams(filters, event.target.value);
    },
    [updateSearchParams, filters]
  );

  /**
   * Handles view mode changes
   * @param {string} value - New view mode ('grid' or 'list')
   */
  const handleViewChange = React.useCallback(
    (value) => {
      if (value) {
        router.push(`${paths.dashboard.datasets}?view=${value}`);
      }
    },
    [router]
  );

  return (
    <Card>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}>
        {/* Search input */}
        <OutlinedInput
          name="name"
          onChange={handleQueryChange}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              handleQueryApply();
            }
          }}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ flex: '1 1 auto' }}
        />

        {/* Sort direction select */}
        <Select name="sort" onChange={handleSortChange} sx={{ maxWidth: '100%', width: '120px' }} value={sortDir}>
          <Option value="desc">Newest</Option>
          <Option value="asc">Oldest</Option>
        </Select>

        {/* View mode toggle */}
        <ToggleButtonGroup
          color="primary"
          exclusive
          onChange={(_, value) => {
            handleViewChange(value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              handleViewChange(view === 'grid' ? 'list' : 'grid');
            }
          }}
          tabIndex={0}
          value={view}
        >
          <ToggleButton value="grid">
            <SquaresFourIcon />
          </ToggleButton>
          <ToggleButton value="list">
            <RowsIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Card>
  );
}
