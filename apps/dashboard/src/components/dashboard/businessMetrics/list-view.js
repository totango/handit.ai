/**
 * @fileoverview ListView component for displaying business metrics in a table format
 * Provides a tabular view of business metrics with sorting and interaction capabilities
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { ItemRow } from './item-row';
import { StorageContext } from './storage-context';

/**
 * ListView component for displaying business metrics in a table format
 * @component
 * @returns {JSX.Element} Rendered table view of business metrics
 * 
 * @description
 * This component renders a table view of business metrics items with the following features:
 * - Responsive table layout with fixed column widths
 * - Support for item actions (delete, favorite, edit)
 * - Integration with StorageContext for state management
 */
export function ListView() {
  // Get context values for managing items
  const {
    items,
    deleteItem: onItemDelete,
    favoriteItem: onItemFavorite,
    setCurrentItemId,
    setEditItem,
  } = React.useContext(StorageContext);

  /**
   * Handles menu update action for an item
   * @param {string} itemId - ID of the item to update
   */
  const onMenuUpdate = (itemId) => {
    setEditItem(true);
    setCurrentItemId(itemId);
  };

  return (
    <Box sx={{ mx: -3, my: -6 }}>
      <Box sx={{ overflowX: 'auto', px: 3 }}>
        <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 24px' }}>
          {/* Hidden table header for maintaining column widths */}
          <TableHead sx={{ visibility: 'collapse' }}>
            <TableRow>
              <TableCell sx={{ width: '250px', minWidth: '250px', maxWidth: '250px' }} />
              <TableCell sx={{ width: '150px', minWidth: '150px', maxWidth: '150px' }} />
              <TableCell sx={{ width: '150px', minWidth: '150px', maxWidth: '150px' }} />
              <TableCell sx={{ width: '75px', minWidth: '75px', maxWidth: '75px' }} />
              <TableCell sx={{ width: '75px', minWidth: '75px', maxWidth: '75px' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(items.values()).map((item) => (
              <ItemRow
                item={item}
                key={item.id}
                onDelete={onItemDelete}
                onFavorite={onItemFavorite}
                onOpen={setCurrentItemId}
                onMenuUpdate={onMenuUpdate}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
