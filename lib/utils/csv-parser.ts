import Papa from "papaparse";
import { MigrainEvent, TrackingEntry, DayData, AnyTrackingEntry } from "../types";

interface CSVRow {
  created_on: string;
  time: string;
  type: string;
  date: string;
  intensity: string;
  symptoms: string;
  triggers: string;
  tookMedication: string;
  medicationWorked: string;
  "foodIntake.hadBreakfast": string;
  "foodIntake.hadLunch": string;
  "foodIntake.hadDinner": string;
  "foodIntake.breakfastTime": string;
  "foodIntake.lunchTime": string;
  "foodIntake.dinnerTime": string;
  "stressLevel.value": string;
  "mood.value": string;
  predictedLabel: string;
  duration_m: string;
  level: string;
  [key: string]: string;
}

// Helper to parse JSON-like string from CSV
function parseJSONField(field: string | undefined): any[] {
  if (!field || field === "") return [];
  try {
    // Replace single quotes with double quotes for valid JSON
    const normalized = field.replace(/'/g, '"').replace(/True/g, "true").replace(/False/g, "false");
    return JSON.parse(normalized);
  } catch {
    return [];
  }
}

// Parse migraine events
function parseMigraineEvent(row: CSVRow): MigrainEvent | null {
  if (row.type !== "headache" || !row.date || !row.intensity) return null;

  const symptomsData = parseJSONField(row.symptoms);
  const triggersData = parseJSONField(row.triggers);

  const symptoms = symptomsData
    .filter((s: any) => s.isChecked)
    .map((s: any) => s.name_en || s.label);

  const triggers = triggersData
    .filter((t: any) => t.isChecked)
    .map((t: any) => t.name_en || t.label);

  return {
    id: `${row.created_on || row.time}`,
    date: new Date(parseInt(row.time)),
    startTime: new Date(parseInt(row.time)).toTimeString().slice(0, 5),
    severity: parseInt(row.intensity) >= 3 ? "severe" : parseInt(row.intensity) === 2 ? "moderate" : "mild",
    symptoms,
    triggers,
    medicationTaken: row.tookMedication === "1.0" ? ["Medication taken"] : undefined,
    duration: row.duration_m ? parseFloat(row.duration_m) : undefined,
  };
}

// Parse activity tracking
function parseActivityEntry(row: CSVRow): TrackingEntry | null {
  if (row.type !== "activity" || !row.time) return null;

  const activityType = row.predictedLabel || row.level;
  if (!activityType) return null;

  return {
    id: `${row.created_on || row.time}`,
    date: new Date(parseInt(row.time)),
    type: "activity",
    tracked: true,
    value: activityType,
    timestamp: new Date(parseInt(row.created_on || row.time)),
  };
}

// Parse stress tracking
function parseStressEntry(row: CSVRow): TrackingEntry | null {
  if (row.type !== "stress" || !row.time) return null;

  const stressValue = parseFloat(row["stressLevel.value"] || "0");
  if (stressValue === 0) return null;

  return {
    id: `${row.created_on || row.time}`,
    date: new Date(parseInt(row.time)),
    type: "stress",
    tracked: true,
    value: stressValue > 7 ? "high" : stressValue > 4 ? "medium" : "low",
    timestamp: new Date(parseInt(row.created_on || row.time)),
  };
}

// Parse food intake
function parseFoodEntry(row: CSVRow): TrackingEntry | null {
  if (row.type !== "daily-record") return null;

  const hadBreakfast = row["foodIntake.hadBreakfast"] === "True";
  const hadLunch = row["foodIntake.hadLunch"] === "True";
  const hadDinner = row["foodIntake.hadDinner"] === "True";

  if (!hadBreakfast && !hadLunch && !hadDinner) return null;

  const meals = [];
  if (hadBreakfast) meals.push("Breakfast");
  if (hadLunch) meals.push("Lunch");
  if (hadDinner) meals.push("Dinner");

  return {
    id: `${row.created_on || row.time}`,
    date: new Date(parseInt(row.time)),
    type: "meals",
    tracked: true,
    value: meals.join(", "),
    timestamp: new Date(parseInt(row.created_on || row.time)),
  };
}

// Main parser function
export async function parseCSVData(csvText: string): Promise<{
  migraines: MigrainEvent[];
  trackingEntries: AnyTrackingEntry[];
  dayData: DayData[];
}> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const migraines: MigrainEvent[] = [];
        const trackingEntries: AnyTrackingEntry[] = [];

        results.data.forEach((row) => {
          // Parse migraines
          const migraine = parseMigraineEvent(row);
          if (migraine) migraines.push(migraine);

          // Parse tracking data
          const activity = parseActivityEntry(row);
          if (activity) trackingEntries.push(activity as any);

          const stress = parseStressEntry(row);
          if (stress) trackingEntries.push(stress as any);

          const food = parseFoodEntry(row);
          if (food) trackingEntries.push(food as any);
        });

        // Group data by day
        const dayMap = new Map<string, DayData>();

        // Add migraines to day map
        migraines.forEach((migraine) => {
          const dateKey = migraine.date.toISOString().split("T")[0];
          if (!dayMap.has(dateKey)) {
            dayMap.set(dateKey, {
              date: new Date(dateKey),
              hasMigraine: false,
              trackingEntries: [],
              trackedCount: 0,
            });
          }
          const day = dayMap.get(dateKey)!;
          day.hasMigraine = true;
          day.migraineEvent = migraine;
        });

        // Add tracking entries to day map
        trackingEntries.forEach((entry) => {
          const dateKey = entry.date.toISOString().split("T")[0];
          if (!dayMap.has(dateKey)) {
            dayMap.set(dateKey, {
              date: new Date(dateKey),
              hasMigraine: false,
              trackingEntries: [],
              trackedCount: 0,
            });
          }
          const day = dayMap.get(dateKey)!;
          day.trackingEntries.push(entry);
          day.trackedCount = day.trackingEntries.length;
        });

        const dayData = Array.from(dayMap.values()).sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        );

        resolve({ migraines, trackingEntries, dayData });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
