// Core data types for Migrainauts app

export type MigraineSeverity = "mild" | "moderate" | "severe";
export type TrackingType = "sleep" | "water" | "meals" | "activity" | "stress" | "mood" | "symptoms" | "medicine";
export type StressLevel = "low" | "medium" | "high";
export type MoodLevel = "great" | "good" | "okay" | "bad" | "terrible";

// Migraine Event
export interface MigrainEvent {
  id: string;
  date: Date;
  startTime: string; // HH:mm format
  endTime?: string;
  severity: MigraineSeverity;
  symptoms: string[];
  triggers: string[];
  medicationTaken?: string[];
  notes?: string;
  location?: string; // where the pain is located
  duration?: number; // in minutes
}

// Daily Tracking Entry
export interface TrackingEntry {
  id: string;
  date: Date;
  type: TrackingType;
  tracked: boolean;
  value?: string | number;
  timestamp: Date;
}

// Sleep Tracking
export interface SleepEntry extends Omit<TrackingEntry, "type"> {
  type: "sleep";
  hours?: number;
  quality?: "poor" | "fair" | "good" | "excellent";
  bedtime?: string;
  wakeTime?: string;
}

// Water Tracking
export interface WaterEntry extends Omit<TrackingEntry, "type"> {
  type: "water";
  glasses?: number;
  liters?: number;
}

// Meal Tracking
export interface MealEntry extends Omit<TrackingEntry, "type"> {
  type: "meals";
  meals: Array<{
    time: string;
    type: "breakfast" | "lunch" | "dinner" | "snack";
    description?: string;
  }>;
}

// Activity Tracking
export interface ActivityEntry extends Omit<TrackingEntry, "type"> {
  type: "activity";
  activityType?: string;
  duration?: number; // minutes
  intensity?: "light" | "moderate" | "intense";
}

// Stress Tracking
export interface StressEntry extends Omit<TrackingEntry, "type"> {
  type: "stress";
  level: StressLevel;
  triggers?: string[];
}

// Mood Tracking
export interface MoodEntry extends Omit<TrackingEntry, "type"> {
  type: "mood";
  level: MoodLevel;
  notes?: string;
}

// Symptoms Tracking
export interface SymptomEntry extends Omit<TrackingEntry, "type"> {
  type: "symptoms";
  symptoms: string[];
  severity?: "mild" | "moderate" | "severe";
}

// Medicine Tracking
export interface MedicineEntry extends Omit<TrackingEntry, "type"> {
  type: "medicine";
  medicineName: string;
  dosage?: string;
  time: string;
  effectiveness?: 1 | 2 | 3 | 4 | 5; // 1-5 rating
}

// Union type for all tracking entries
export type AnyTrackingEntry =
  | SleepEntry
  | WaterEntry
  | MealEntry
  | ActivityEntry
  | StressEntry
  | MoodEntry
  | SymptomEntry
  | MedicineEntry;

// Day Summary
export interface DayData {
  date: Date;
  hasMigraine: boolean;
  migraineEvent?: MigrainEvent;
  trackingEntries: AnyTrackingEntry[];
  trackedCount: number;
}

// User Profile
export interface UserProfile {
  id: string;
  createdAt: Date;
  onboardingCompleted: boolean;
  checkInFrequency?: 1 | 2 | 3; // times per day
  notifications: {
    enabled: boolean;
    checkInReminders: boolean;
    patternAlerts: boolean;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    weatherTracking: boolean;
    language: string;
  };
}

// AI Insight
export interface AIInsight {
  id: string;
  date: Date;
  type: "daily" | "weekly" | "pattern" | "warning" | "success";
  title: string;
  content: string;
  priority: "low" | "medium" | "high";
  actionable?: boolean;
  actions?: string[];
  confidence?: number; // 0-1
  basedOnDays?: number;
}

// Pattern Analysis
export interface Pattern {
  id: string;
  type: "trigger" | "timing" | "cascade" | "prevention";
  description: string;
  confidence: number; // 0-1
  occurrences: number;
  factors: string[];
  recommendation?: string;
}

// Statistics
export interface MigraineStats {
  period: "week" | "month" | "year" | "all";
  totalMigraines: number;
  averagePerMonth: number;
  daysSinceLastMigraine: number;
  mostCommonTriggers: Array<{ trigger: string; percentage: number }>;
  mostCommonTime?: string;
  mostCommonDay?: string;
  averageDuration?: number;
  trend: "improving" | "stable" | "worsening";
}
