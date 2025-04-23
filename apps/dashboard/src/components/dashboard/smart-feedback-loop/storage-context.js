'use client';

import * as React from 'react';
import { useDeleteKpiMutation } from '@/services/kpiService';

function noop() {
  return undefined;
}

export const StorageContext = React.createContext({
  items: new Map(),
  setCurrentItemId: noop,
  setEditItem: noop,
  deleteItem: noop,
  favoriteItem: noop,
});

export function StorageProvider({ children, items: initialItems = [] }) {
  const [items, setItems] = React.useState(new Map());
  const [currentItemId, setCurrentItemId] = React.useState();
  const [editItem, setEditItem] = React.useState();
  const [deleteKpi] = useDeleteKpiMutation();

  React.useEffect(() => {
    setItems(new Map(initialItems.map((item) => [item.id, item])));
  }, [initialItems]);

  const handleDeleteItem = React.useCallback(
    (itemId) => {
      const item = items.get(itemId);
      // Item might no longer exist
      if (!item) {
        return;
      }
      // Delete item
      deleteKpi(itemId);
    },
    [items]
  );

  const handleFavoriteItem = React.useCallback(
    (itemId, value) => {
      const item = items.get(itemId);

      // Item might no longer exist
      if (!item) {
        return;
      }

      const updatedItems = new Map(items);

      // Update item
      updatedItems.set(itemId, { ...item, isFavorite: value });

      // Dispatch update
      setItems(updatedItems);
    },
    [items]
  );

  return (
    <StorageContext.Provider
      value={{
        items,
        currentItemId,
        setCurrentItemId,
        editItem,
        setEditItem,
        deleteItem: handleDeleteItem,
        favoriteItem: handleFavoriteItem,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export const StorageConsumer = StorageContext.Consumer;
