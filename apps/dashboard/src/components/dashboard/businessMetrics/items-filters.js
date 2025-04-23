/**
 * @fileoverview ItemsFilters component for filtering and sorting business metrics items
 * Provides search functionality, sorting options, and view mode toggling
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
 * ItemsFilters component for managing business metrics filtering and sorting
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.filters={}] - Current filter state
 * @param {string} [props.filters.query] - Search query string
 * @param {string} [props.sortDir='desc'] - Sort direction ('asc' or 'desc')
 * @param {string} [props.view='grid'] - View mode ('grid' or 'list')
 * @returns {JSX.Element} Rendered component
 */
export function ItemsFilters({ filters = {}, sortDir = 'desc', view = 'grid' }) {
  const router = useRouter();

  // State for search query input
  const [query, setQuery] = React.useState(filters.query ?? '');

  // Update query state when filters prop changes
  React.useEffect(() => {
    setQuery(filters.query ?? '');
  }, [filters]);

  /**
   * Updates URL search parameters with new filters and sort direction
   * @param {Object} newFilters - New filter state
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

      router.push(`${paths.dashboard.businessMetrics}?${searchParams.toString()}`);
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
   * Handles view mode changes (grid/list)
   * @param {string} value - New view mode
   */
  const handleViewChange = React.useCallback(
    (value) => {
      if (value) {
        router.push(`${paths.dashboard.businessMetrics}?view=${value}`);
      }
    },
    [router]
  );

  return (
    <Card>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}>
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
        <Select name="sort" onChange={handleSortChange} sx={{ maxWidth: '100%', width: '120px' }} value={sortDir}>
          <Option value="desc">Newest</Option>
          <Option value="asc">Oldest</Option>
        </Select>
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
