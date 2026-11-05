// This is the only file that reads or writes AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pocketvault_items';

export async function loadItems() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === null) return [];

    const items = JSON.parse(saved);
    if (!Array.isArray(items)) throw new Error('Saved items must be an array.');
    return items;
  } catch (error) {
    console.warn('Could not load PocketVault items:', error);
    return [];
  }
}

export async function saveItems(items) {
  try {
    if (!Array.isArray(items)) throw new Error('Items must be an array.');
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Could not save PocketVault items:', error);
  }
}
