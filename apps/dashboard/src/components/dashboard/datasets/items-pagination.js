/**
 * @fileoverview ItemsPagination component for managing dataset list pagination
 * Provides pagination controls for dataset items with fixed page size
 */

'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

/**
 * No-operation function for handling pagination events
 * @returns {undefined}
 */
function noop() {
  return undefined;
}

/**
 * ItemsPagination component for managing dataset list pagination
 * @component
 * @param {Object} props - Component props
 * @param {number} props.count - Total number of items
 * @param {number} props.page - Current page number
 * @returns {JSX.Element} Rendered pagination component
 * 
 * @description
 * This component provides:
 * - Pagination controls for dataset items
 * - Fixed page size of 10 items
 * - Page size options (5, 10, 25)
 * - Integration with Material-UI TablePagination
 */
export function ItemsPagination({ count, page }) {
  return (
    <TablePagination
      component="div"
      count={count}
      onPageChange={noop}
      onRowsPerPageChange={noop}
      page={page}
      rowsPerPage={10}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
