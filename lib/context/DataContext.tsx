import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MigrainEvent, DayData, AnyTrackingEntry, UserProfile } from "../types";
import * as Storage from "../storage";
import { sampleMigraines, generateSampleDayData } from "../../data/mock/sample-data";

interface DataContextType {
  migraines: MigrainEvent[];
  dayData: DayData[];
  trackingEntries: AnyTrackingEntry[];
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addMigraine: (migraine: MigrainEvent) => Promise<void>;
  addTrackingEntry: (entry: AnyTrackingEntry) => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [migraines, setMigraines] = useState<MigrainEvent[]>([]);
  const [dayData, setDayData] = useState<DayData[]>([]);
  const [trackingEntries, setTrackingEntries] = useState<AnyTrackingEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load CSV data on first launch
  const loadCSVData = async () => {
    try {
      // Check if data is already loaded
      const dataLoaded = await Storage.isDataLoaded();
      if (dataLoaded) {
        console.log("Data already loaded from CSV, skipping...");
        return;
      }

      console.log("Loading sample migraine data...");

      // Use sample data based on CSV structure
      const migraines = sampleMigraines;
      const dayData = generateSampleDayData();
      const trackingEntries = dayData.flatMap(d => d.trackingEntries);

      console.log(`Loaded ${migraines.length} migraines, ${trackingEntries.length} tracking entries, ${dayData.length} days`);
      console.log("First migraine:", migraines[0]);
      console.log("Last migraine:", migraines[migraines.length - 1]);

      // Save to storage
      await Storage.saveMigraines(migraines);
      await Storage.saveTrackingEntries(trackingEntries);
      await Storage.saveDayData(dayData);
      await Storage.setDataLoaded(true);

      console.log("Sample data loaded successfully!");
    } catch (error) {
      console.error("Error loading CSV data:", error);
      throw error;
    }
  };

  // Load data from storage
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First time: load CSV data
      await loadCSVData();

      // Load from storage
      const [loadedMigraines, loadedTracking, loadedDayData, loadedProfile] = await Promise.all([
        Storage.loadMigraines(),
        Storage.loadTrackingEntries(),
        Storage.loadDayData(),
        Storage.loadUserProfile(),
      ]);

      setMigraines(loadedMigraines);
      setTrackingEntries(loadedTracking);
      setDayData(loadedDayData);
      setUserProfile(loadedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Add migraine
  const addMigraine = async (migraine: MigrainEvent) => {
    await Storage.addMigraine(migraine);
    setMigraines((prev) => [...prev, migraine]);

    // Update day data
    const updatedDayData = await Storage.loadDayData();
    setDayData(updatedDayData);
  };

  // Add tracking entry
  const addTrackingEntry = async (entry: AnyTrackingEntry) => {
    await Storage.addTrackingEntry(entry);
    setTrackingEntries((prev) => [...prev, entry]);

    // Update day data
    const updatedDayData = await Storage.loadDayData();
    setDayData(updatedDayData);
  };

  // Update user profile
  const updateUserProfile = async (profile: UserProfile) => {
    await Storage.saveUserProfile(profile);
    setUserProfile(profile);
  };

  // Refresh data
  const refreshData = async () => {
    await loadData();
  };

  // Force reload data (clear cache and reload)
  const forceReloadData = async () => {
    console.log("Force reloading data - clearing storage...");
    await Storage.setDataLoaded(false);
    await loadData();
  };

  // On mount, check if we need to force reload
  React.useEffect(() => {
    const checkData = async () => {
      const loaded = await Storage.isDataLoaded();
      const migrainesCount = (await Storage.loadMigraines()).length;

      if (loaded && migrainesCount === 0) {
        console.log("Data marked as loaded but empty - forcing reload");
        await forceReloadData();
      }
    };
    checkData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        migraines,
        dayData,
        trackingEntries,
        userProfile,
        loading,
        error,
        refreshData,
        addMigraine,
        addTrackingEntry,
        updateUserProfile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
