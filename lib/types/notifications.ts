// Notification types for Migrainauts app

export type NotificationType =
  | "predictive_warning"
  | "early_pattern"
  | "positive_reinforcement"
  | "check_in"
  | "tracking_reminder"
  | "weather_warning";

export type NotificationPriority = "low" | "medium" | "high" | "critical";

export interface NotificationAction {
  id: string;
  title: string;
  icon?: string;
  type: "primary" | "secondary" | "dismiss";
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  scheduledTime?: Date;
  sentTime?: Date;
  read: boolean;

  // Detail information
  details?: {
    explanation: string;
    confidence: number; // 0-1
    dataPoints: string[];
    timeline?: {
      time: string;
      activity: string;
      isNormal: boolean;
    }[];
    triggers?: {
      name: string;
      active: boolean;
    }[];
    actions?: NotificationAction[];
  };

  // Pattern-specific data
  patternData?: {
    dayOfWeek?: string;
    timeOfDay?: string;
    activityLevel?: string;
    factors: string[];
  };
}

export interface NotificationSettings {
  enabled: boolean;
  predictiveWarnings: boolean;
  earlyPatterns: boolean;
  positiveReinforcement: boolean;
  checkInReminders: boolean;
  trackingReminders: boolean;
  weatherWarnings: boolean;

  // Quiet hours
  doNotDisturbEnabled: boolean;
  doNotDisturbStart?: string; // HH:mm format
  doNotDisturbEnd?: string;

  // Frequency
  checkInFrequency: 1 | 2 | 3; // times per day
  maxNotificationsPerDay: number;
}
