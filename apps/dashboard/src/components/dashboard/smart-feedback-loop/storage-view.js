'use client';

import * as React from 'react';
import { useDeleteKpiMutation, useUpdateKpiMutation } from '@/services/kpiService';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GridView } from './grid-view';
import { ItemModal } from './item-modal';
import { ListView } from './list-view';
import { StorageContext } from './storage-context';

export function StorageView({ view }) {
  const { currentItemId, items, favoriteItem, setCurrentItemId, editItem, setEditItem } =
    React.useContext(StorageContext);
  const [updateKpi, { isLoading: isUpdatingKpi, error: updateKpiError }] = useUpdateKpiMutation();
  const [deleteKpi, { isLoading: isDeletingKpi, error: deleteKpiError }] = useDeleteKpiMutation();
  const currentItem = currentItemId ? items.get(currentItemId) : undefined;

  return (
    <React.Fragment>
      {items.size ? (
        <React.Fragment>{view === 'grid' ? <GridView /> : <ListView />}</React.Fragment>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No items found
          </Typography>
        </Box>
      )}
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
