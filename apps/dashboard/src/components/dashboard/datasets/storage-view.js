/**
 * @fileoverview StorageView component for displaying dataset storage interface
 * Provides a view container for datasets with grid/list views and item modal
 */

'use client';

import * as React from 'react';
import { useUpdateDatasetsMutation } from '@/services/datasetsService';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GridView } from './grid-view';
import { ItemModal } from './item-modal';
import { ListView } from './list-view';
import { StorageContext } from './storage-context';

/**
 * StorageView component for displaying dataset storage interface
 * @component
 * @param {Object} props - Component props
 * @param {string} props.view - Current view mode ('grid' or 'list')
 * @returns {JSX.Element} Rendered storage view component
 * 
 * @description
 * This component provides:
 * - Conditional rendering of grid or list view
 * - Empty state handling
 * - Item modal for viewing/editing datasets
 * - Integration with StorageContext for state management
 * - Dataset update functionality
 */
export function StorageView({ view }) {
  // Get context values for managing items
  const { currentItemId, items, favoriteItem, setCurrentItemId, editItem, setEditItem, deleteItem } =
    React.useContext(StorageContext);

  // Dataset update mutation
  const [updateDataset, { isLoading: isUpdatingDataset, error: updateDatasetError }] = useUpdateDatasetsMutation();

  // Get current item if an ID is selected
  const currentItem = currentItemId ? items.get(currentItemId) : undefined;

  return (
    <React.Fragment>
      {/* Conditional rendering of grid or list view */}
      {items.size ? (
        <React.Fragment>{view === 'grid' ? <GridView /> : <ListView />}</React.Fragment>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No items found
          </Typography>
        </Box>
      )}

      {/* Item modal for viewing/editing datasets */}
      {currentItem ? (
        <ItemModal
          item={currentItem}
          onClose={() => {
            setCurrentItemId(undefined);
            setEditItem(false);
          }}
          onDelete={(itemId) => {
            setCurrentItemId(undefined);
            deleteItem(itemId);
          }}
          onUpdate={(itemId) => {
            updateDataset(itemId);
          }}
          onFavorite={favoriteItem}
          initialEditMode={editItem}
          open
        />
      ) : null}
    </React.Fragment>
  );
}
