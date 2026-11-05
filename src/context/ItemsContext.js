// Shares purchases between screens and saves changes through the storage service.
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { loadItems, saveItems } from '../services/storage';
import { calculateExpiryDate } from '../utils/warranty';

const ItemsContext = createContext(null);

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // Keep quick consecutive changes current, and write them to storage in order.
  const currentItems = useRef([]);
  const saveQueue = useRef(Promise.resolve());
  const idCounter = useRef(0);

  useEffect(() => {
    let active = true;

    async function restoreItems() {
      const savedItems = await loadItems();
      if (active) {
        currentItems.current = savedItems;
        setItems(savedItems);
        setLoading(false);
      }
    }

    restoreItems();
    return () => { active = false; };
  }, []);

  function saveChanges(nextItems) {
    currentItems.current = nextItems;
    setItems(nextItems);
    // Save only changes, not the initial empty state while loading.
    saveQueue.current = saveQueue.current.then(() => saveItems(nextItems));
  }

  function addItem(data) {
    if (loading) return null;
    idCounter.current += 1;
    const newItem = {
      id: `${Date.now()}-${idCounter.current}-${Math.random().toString(36).slice(2, 8)}`,
      name: data.name,
      brand: data.brand ?? '',
      category: CATEGORIES.includes(data.category) ? data.category : 'Other',
      store: data.store ?? '',
      purchaseDate: data.purchaseDate,
      warrantyMonths: data.warrantyMonths,
      expiryDate: calculateExpiryDate(data.purchaseDate, data.warrantyMonths),
      invoiceUri: data.invoiceUri ?? null,
      notes: data.notes ?? '',
      notificationIds: [],
      createdAt: new Date().toISOString(),
    };
    if (data.price !== undefined) newItem.price = data.price;

    saveChanges([...currentItems.current, newItem]);
    return newItem;
  }

  function updateItem(id, changes) {
    if (loading) return null;
    const item = currentItems.current.find((entry) => entry.id === id);
    if (!item) return null;

    const updatedItem = {
      ...item,
      ...changes,
      id: item.id,
      createdAt: item.createdAt,
      notificationIds: item.notificationIds,
    };
    if (!CATEGORIES.includes(updatedItem.category)) updatedItem.category = 'Other';
    // Always derive expiry from the final dates, even if changes contains expiryDate.
    updatedItem.expiryDate = calculateExpiryDate(
      updatedItem.purchaseDate,
      updatedItem.warrantyMonths,
    );
    saveChanges(currentItems.current.map((entry) => entry.id === id ? updatedItem : entry));
    return updatedItem;
  }

  function deleteItem(id) {
    if (loading) return;
    saveChanges(currentItems.current.filter((item) => item.id !== id));
  }

  function getItemById(id) {
    return currentItems.current.find((item) => item.id === id);
  }

  return (
    <ItemsContext.Provider value={{ items, loading, addItem, updateItem, deleteItem, getItemById }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) throw new Error('useItems must be used inside ItemsProvider.');
  return context;
}
