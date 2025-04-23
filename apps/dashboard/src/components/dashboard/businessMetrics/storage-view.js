/**
 * @fileoverview StorageView component for displaying business metrics in different view modes
 * Provides grid and list views with item management capabilities
 */

'use client';

import * as React from 'react';
import { useDeleteKpiMutation, useUpdateKpiMutation } from '@/services/kpiService';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GridView } from './grid-view';
import { ItemModal } from './item-modal';
import { ListView } from './list-view';
import { StorageContext } from './storage-context';

/**
 * StorageView component for displaying business metrics in grid or list format
 * @component
 * @param {Object} props - Component props
 * @param {string} props.view - View mode ('grid' or 'list')
 * @returns {JSX.Element} Rendered storage view component
 * 
 * @description
 * This component provides:
 * - Toggle between grid and list views
 * - Item management (update, delete, favorite)
 * - Empty state handling
 * - Modal for item details and editing
 */
export function StorageView({ view }) {
  // Get context values for managing items
  const { currentItemId, items, favoriteItem, setCurrentItemId, editItem, setEditItem } =
    React.useContext(StorageContext);

  // Mutation hooks for KPI operations
  const [updateKpi, { isLoading: isUpdatingKpi, error: updateKpiError }] = useUpdateKpiMutation();
  const [deleteKpi, { isLoading: isDeletingKpi, error: deleteKpiError }] = useDeleteKpiMutation();

  // Get current item if an ID is selected
  const currentItem = currentItemId ? items.get(currentItemId) : undefined;

  return (
    <React.Fragment>
      {/* Render grid or list view based on view prop */}
      {items.size ? (
        <React.Fragment>{view === 'grid' ? <GridView /> : <ListView />}</React.Fragment>
      ) : (
        // Empty state message
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No items found
          </Typography>
        </Box>
      )}
      {/* Item modal for viewing/editing item details */}
      {currentItem ? (
        <ItemModal
          item={currentItem}
          onClose={() => {
            setCurrentItemId(undefined);
            setEditItem(false);
          }}
          onDelete={(itemId) => {
            setCurrentItemId(undefined);
            deleteKpi(itemId);
          }}
          onUpdate={(itemId) => {
            updateKpi(itemId);
          }}
          onFavorite={favoriteItem}
          initialEditMode={editItem}
          open
        />
      ) : null}
    </React.Fragment>
  );
}
