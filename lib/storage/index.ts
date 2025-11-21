import AsyncStorage from "@react-native-async-storage/async-storage";
import { MigrainEvent, DayData, UserProfile, AnyTrackingEntry } from "../types";

const KEYS = {
  MIGRAINES: "@migrainauts:migraines",
  TRACKING: "@migrainauts:tracking",
  DAY_DATA: "@migrainauts:dayData",
  USER_PROFILE: "@migrainauts:userProfile",
  DATA_LOADED: "@migrainauts:dataLoaded",
};

// Generic storage functions
async function saveData<T>(key: string, data: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
}

async function loadData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return null;
  }
}

// Migraine functions
export async function saveMigraines(migraines: MigrainEvent[]): Promise<void> {
  await saveData(KEYS.MIGRAINES, migraines);
}

export async function loadMigraines(): Promise<MigrainEvent[]> {
  const data = await loadData<MigrainEvent[]>(KEYS.MIGRAINES);
  return data || [];
}

export async function addMigraine(migraine: MigrainEvent): Promise<void> {
  const migraines = await loadMigraines();
  migraines.push(migraine);
  await saveMigraines(migraines);
}

// Tracking functions
export async function saveTrackingEntries(entries: AnyTrackingEntry[]): Promise<void> {
  await saveData(KEYS.TRACKING, entries);
}

export async function loadTrackingEntries(): Promise<AnyTrackingEntry[]> {
  const data = await loadData<AnyTrackingEntry[]>(KEYS.TRACKING);
  return data || [];
}

export async function addTrackingEntry(entry: AnyTrackingEntry): Promise<void> {
  const entries = await loadTrackingEntries();
  entries.push(entry);
  await saveTrackingEntries(entries);
}

// Day data functions
export async function saveDayData(dayData: DayData[]): Promise<void> {
  await saveData(KEYS.DAY_DATA, dayData);
}

export async function loadDayData(): Promise<DayData[]> {
  const data = await loadData<DayData[]>(KEYS.DAY_DATA);
  return data || [];
}

// User profile functions
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await saveData(KEYS.USER_PROFILE, profile);
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  return await loadData<UserProfile>(KEYS.USER_PROFILE);
}

// Data initialization flag
export async function setDataLoaded(loaded: boolean): Promise<void> {
  await saveData(KEYS.DATA_LOADED, loaded);
}

export async function isDataLoaded(): Promise<boolean> {
  const loaded = await loadData<boolean>(KEYS.DATA_LOADED);
  return loaded || false;
}

// Clear all data (for testing)
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (error) {
    console.error("Error clearing data:", error);
  }
}

// Get data for specific date range
export async function getDayDataForRange(
  startDate: Date,
  endDate: Date
): Promise<DayData[]> {
  const allDayData = await loadDayData();
  return allDayData.filter((day) => {
    const dayDate = new Date(day.date);
    return dayDate >= startDate && dayDate <= endDate;
  });
}

// Get last N days of data
export async function getLastNDays(n: number): Promise<DayData[]> {
  const allDayData = await loadDayData();
  return allDayData.slice(-n);
}
