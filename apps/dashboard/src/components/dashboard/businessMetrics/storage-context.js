/**
 * @fileoverview Storage context for managing business metrics items
 * Provides state management and operations for business metrics items
 */

'use client';

import * as React from 'react';
import { useDeleteKpiMutation } from '@/services/kpiService';

/**
 * No-operation function used as a placeholder for context methods
 * @returns {undefined}
 */
function noop() {
  return undefined;
}

/**
 * React context for managing business metrics storage
 * @type {React.Context<{
 *   items: Map<string, Object>,
 *   setCurrentItemId: (id: string) => void,
 *   setEditItem: (value: boolean) => void,
 *   deleteItem: (id: string) => void,
 *   favoriteItem: (id: string, value: boolean) => void
 * }>}
 */
export const StorageContext = React.createContext({
  items: new Map(),
  setCurrentItemId: noop,
  setEditItem: noop,
  deleteItem: noop,
  favoriteItem: noop,
});

/**
 * Provider component for StorageContext
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array<Object>} [props.items=[]] - Initial items to populate the storage
 * @returns {JSX.Element} Context provider component
 * 
 * @description
 * This provider component manages:
 * - Storage of business metrics items
 * - Current item selection
 * - Edit mode state
 * - Item deletion
 * - Item favoriting
 */
export function StorageProvider({ children, items: initialItems = [] }) {
  // State for storing items in a Map
  const [items, setItems] = React.useState(new Map());
  // State for tracking the currently selected item
  const [currentItemId, setCurrentItemId] = React.useState();
  // State for tracking edit mode
  const [editItem, setEditItem] = React.useState();
  // Mutation hook for deleting KPIs
  const [deleteKpi] = useDeleteKpiMutation();

  // Initialize items from props
  React.useEffect(() => {
    setItems(new Map(initialItems.map((item) => [item.id, item])));
  }, [initialItems]);

  /**
   * Handles item deletion
   * @param {string} itemId - ID of the item to delete
   */
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

  /**
   * Handles toggling item favorite status
   * @param {string} itemId - ID of the item to update
   * @param {boolean} value - New favorite status
   */
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

/**
 * Consumer component for StorageContext
 * @type {React.Consumer<{
 *   items: Map<string, Object>,
 *   setCurrentItemId: (id: string) => void,
 *   setEditItem: (value: boolean) => void,
 *   deleteItem: (id: string) => void,
 *   favoriteItem: (id: string, value: boolean) => void
 * }>}
 */
export const StorageConsumer = StorageContext.Consumer;
