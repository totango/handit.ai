/**
 * @fileoverview GridView component for displaying models in a responsive grid layout
 * Provides a grid-based view of model cards with actions for each model
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';

import { ItemCard } from './item-card';
import { StorageContext } from './storage-context';

/**
 * GridView component for displaying models in a responsive grid layout
 * @component
 * @returns {JSX.Element} Rendered grid component
 * 
 * @description
 * This component provides:
 * - Responsive grid layout for model cards
 * - Integration with StorageContext for model management
 * - Actions for each model (open, update, delete, favorite)
 * - Automatic grid column adjustment based on screen size
 */
export function GridView() {
  // Get model management functions from context
  const {
    items,
    deleteItem: onItemDelete,
    favoriteItem: onItemFavorite,
    setCurrentItemId,
    setEditItem,
  } = React.useContext(StorageContext);

  /**
   * Handles opening a model's details
   * @param {string} itemId - ID of the model to open
   */
  const onOpen = (itemId) => {
    setCurrentItemId(itemId);
  };

  /**
   * Handles opening the model update menu
   * @param {string} itemId - ID of the model to update
   */
  const onMenuUpdate = (itemId) => {
    setEditItem(true);
    setCurrentItemId(itemId);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 4,
        // Responsive grid columns:
        // - 1 column on extra small screens
        // - 2 columns on small screens
        // - 3 columns on medium and larger screens
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        }
      }}
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
