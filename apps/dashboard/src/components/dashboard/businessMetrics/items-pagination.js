/**
 * @fileoverview ItemsPagination component for handling pagination of business metrics items
 * Provides a pagination interface with configurable page size options
 */

'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

/**
 * No-operation function used as a placeholder for pagination event handlers
 * @returns {undefined}
 */
function noop() {
  return undefined;
}

/**
 * ItemsPagination component for displaying and managing pagination of business metrics
 * @component
 * @param {Object} props - Component props
 * @param {number} props.count - Total number of items
 * @param {number} props.page - Current page number (0-based)
 * @returns {JSX.Element} Rendered pagination component
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
