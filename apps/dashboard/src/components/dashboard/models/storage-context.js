/**
 * @fileoverview StorageContext for managing model state and operations
 * Provides a context for model management including CRUD operations and state
 */

'use client';

import * as React from 'react';
import { useDeleteModelsMutation } from '@/services/modelsService';

/**
 * No-operation function for default context values
 * @returns {undefined}
 */
function noop() {
  return undefined;
}

/**
 * StorageContext for managing model state and operations
 * @type {React.Context<{
 *   items: Map<string, Object>,
 *   setCurrentItemId: Function,
 *   setEditItem: Function,
 *   deleteItem: Function,
 *   favoriteItem: Function
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
 * StorageProvider component for managing model state and operations
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array<Object>} [props.items=[]] - Initial model items
 * @returns {JSX.Element} Context provider component
 * 
 * @description
 * This component provides:
 * - Model state management
 * - CRUD operations for models
 * - Favorite toggle functionality
 * - Current item selection
 * - Edit mode management
 */
export function StorageProvider({ children, items: initialItems = [] }) {
  // State management
  const [items, setItems] = React.useState(new Map());
  const [currentItemId, setCurrentItemId] = React.useState();
  const [editItem, setEditItem] = React.useState();
  const [deleteModel] = useDeleteModelsMutation();

  // Initialize items from props
  React.useEffect(() => {
    setItems(new Map(initialItems.map((item) => [item.id, item])));
  }, [initialItems]);

  /**
   * Handles model deletion
   * @param {string} itemId - ID of the model to delete
   */
  const handleDeleteItem = React.useCallback(
    (itemId) => {
      const item = items.get(itemId);
      // Item might no longer exist
      if (!item) {
        return;
      }
      // Delete item
      deleteModel(itemId);
    },
    [items]
  );

  /**
   * Handles toggling model favorite status
   * @param {string} itemId - ID of the model to update
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
 * StorageConsumer component for consuming the StorageContext
 * @type {React.Consumer<{
 *   items: Map<string, Object>,
 *   setCurrentItemId: Function,
 *   setEditItem: Function,
 *   deleteItem: Function,
 *   favoriteItem: Function
 * }>}
 */
export const StorageConsumer = StorageContext.Consumer;
