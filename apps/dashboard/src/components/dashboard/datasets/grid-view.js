/**
 * @fileoverview GridView component for displaying datasets in a grid layout
 * Provides a responsive grid view of dataset items with card-based display
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';

import { ItemCard } from './item-card';
import { StorageContext } from './storage-context';

/**
 * GridView component for displaying datasets in a grid layout
 * @component
 * @returns {JSX.Element} Rendered grid view component
 * 
 * @description
 * This component provides:
 * - A responsive grid layout for dataset items
 * - Card-based display of items
 * - Integration with StorageContext for state management
 * - Support for item actions (delete, favorite, edit)
 */
export function GridView() {
  // Get context values for managing items
  const {
    items,
    deleteItem: onItemDelete,
    favoriteItem: onItemFavorite,
    setCurrentItemId,
    setEditItem,
  } = React.useContext(StorageContext);

  /**
   * Handles opening an item
   * @param {string} itemId - ID of the item to open
   */
  const onOpen = (itemId) => {
    setCurrentItemId(itemId);
  };

  /**
   * Handles menu update action for an item
   * @param {string} itemId - ID of the item to update
   */
  const onMenuUpdate = (itemId) => {
    setEditItem(true);
    setCurrentItemId(itemId);
  };

  return (
    <Box
      sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}
    >
      {Array.from(items.values()).map((item) => (
        <ItemCard
          item={item}
          key={item.id}
          onDelete={onItemDelete}
          onFavorite={onItemFavorite}
          onOpen={onOpen}
          onMenuUpdate={onMenuUpdate}
        />
      ))}
    </Box>
  );
}
