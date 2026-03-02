import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'MOOD_ENTRIES';

// moodsData object shape: { 'YYYY-MM-DD': { entries: [...] } }

export async function getMoodsByMonth(year, month) {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return {};
    const all = JSON.parse(json);
    const prefix = `${year}-${String(month).padStart(2, '0')}-`;
    return Object.keys(all)
      .filter((k) => k.startsWith(prefix))
      .reduce((res, k) => {
        res[k] = all[k];
        return res;
      }, {});
  } catch (e) {
    console.warn('failed to read moods', e);
    return {};
  }
}

export async function getMoodEntry(dateStr) {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return null;
  const all = JSON.parse(json);
  return all[dateStr] || null;
}

export async function deleteMoodEntry(dateStr, entryId) {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    const all = json ? JSON.parse(json) : {};
    const day = all[dateStr];
    if (!day) return false;
    day.entries = day.entries.filter((e) => e.id !== entryId);
    if (day.entries.length === 0) {
      delete all[dateStr];
    } else {
      all[dateStr] = day;
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch (e) {
    console.warn('failed to delete entry', e);
    return false;
  }
}
