// Sample data based on the CSV structure
import { MigrainEvent, DayData, AnyTrackingEntry } from "../../lib/types";

// Sample migraine events from the CSV
export const sampleMigraines: MigrainEvent[] = [
  {
    id: "1660404891648",
    date: new Date("2022-08-13"),
    startTime: "14:00",
    severity: "severe",
    symptoms: [
      "Pulsating pain",
      "Nausea",
      "Exhausted feeling",
      "Reduced concentration",
      "Reduced memory"
    ],
    triggers: ["Heat"],
    medicationTaken: ["Medication taken"],
    duration: 180,
  },
  {
    id: "1660551036928",
    date: new Date("2022-08-15"),
    startTime: "11:30",
    severity: "moderate",
    symptoms: [
      "Nausea",
      "Reduced interest in daily activities",
      "Fatigue"
    ],
    triggers: ["Sleep deprivation"],
    medicationTaken: ["Medication taken"],
    duration: 120,
  },
  {
    id: "1660592062464",
    date: new Date("2022-08-15"),
    startTime: "18:00",
    severity: "moderate",
    symptoms: [
      "Quick to be irritated"
    ],
    triggers: ["Stress"],
    medicationTaken: [],
    duration: 90,
  },
  {
    id: "1660645801984",
    date: new Date("2022-08-16"),
    startTime: "15:30",
    severity: "moderate",
    symptoms: [
      "Pulsating pain",
      "Fatigue"
    ],
    triggers: ["Heat"],
    medicationTaken: ["Medication taken"],
    duration: 150,
  },
  {
    id: "1660675555328",
    date: new Date("2022-08-16"),
    startTime: "22:00",
    severity: "moderate",
    symptoms: [],
    triggers: [],
    medicationTaken: [],
    duration: 60,
  },
];

// Generate day data for the last 30 days with some having migraines
export function generateSampleDayData(): DayData[] {
  const days: DayData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Find if there's a migraine on this day
    const migraine = sampleMigraines.find(
      m => m.date.toDateString() === date.toDateString()
    );

    // Generate some random tracking entries
    const trackingEntries: AnyTrackingEntry[] = [];

    // Add sleep tracking
    if (Math.random() > 0.3) {
      trackingEntries.push({
        id: `sleep-${date.getTime()}`,
        date: date,
        type: "sleep",
        tracked: true,
        value: `${6 + Math.floor(Math.random() * 3)}h`,
        timestamp: date,
      } as any);
    }

    // Add meal tracking
    if (Math.random() > 0.2) {
      const meals = [];
      if (Math.random() > 0.2) meals.push("Breakfast");
      if (Math.random() > 0.1) meals.push("Lunch");
      if (Math.random() > 0.3) meals.push("Dinner");

      if (meals.length > 0) {
        trackingEntries.push({
          id: `meals-${date.getTime()}`,
          date: date,
          type: "meals",
          tracked: true,
          value: meals.join(", "),
          timestamp: date,
        } as any);
      }
    }

    // Add stress tracking
    if (Math.random() > 0.4) {
      const levels = ["low", "medium", "high"];
      trackingEntries.push({
        id: `stress-${date.getTime()}`,
        date: date,
        type: "stress",
        tracked: true,
        value: levels[Math.floor(Math.random() * levels.length)],
        timestamp: date,
      } as any);
    }

    days.push({
      date,
      hasMigraine: !!migraine,
      migraineEvent: migraine,
      trackingEntries,
      trackedCount: trackingEntries.length,
    });
  }

  return days;
}

// Calculate statistics from the sample data
export function calculateStats() {
  const dayData = generateSampleDayData();
  const migraines = sampleMigraines;

  const lastMigraine = migraines[migraines.length - 1];
  const daysSinceLastMigraine = Math.floor(
    (new Date().getTime() - lastMigraine.date.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Count triggers
  const triggerCounts = new Map<string, number>();
  migraines.forEach(m => {
    m.triggers.forEach(t => {
      triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
    });
  });

  const topTriggers = Array.from(triggerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trigger, count]) => ({
      trigger,
      percentage: Math.round((count / migraines.length) * 100),
    }));

  return {
    totalMigraines: migraines.length,
    daysSinceLastMigraine,
    thisMonth: migraines.filter(m => {
      const now = new Date();
      return m.date.getMonth() === now.getMonth() && m.date.getFullYear() === now.getFullYear();
    }).length,
    topTriggers,
  };
}
