import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationData, NotificationSettings, NotificationType } from '../types/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = '@migrainauts_notifications';
const NOTIFICATION_SETTINGS_KEY = '@migrainauts_notification_settings';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Keep for backwards compatibility
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private notifications: NotificationData[] = [];
  private settings: NotificationSettings = {
    enabled: true,
    predictiveWarnings: true,
    earlyPatterns: true,
    positiveReinforcement: true,
    checkInReminders: true,
    trackingReminders: true,
    weatherWarnings: true,
    doNotDisturbEnabled: false,
    checkInFrequency: 2,
    maxNotificationsPerDay: 10,
  };

  private constructor() {
    this.loadNotifications();
    this.loadSettings();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize and request permissions
  async initialize(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push notification permissions');
      return false;
    }

    // Set up notification channels for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('high-priority', {
        name: 'High Priority Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default Notifications',
        importance: Notifications.AndroidImportance.DEFAULT,
      });

      await Notifications.setNotificationChannelAsync('low-priority', {
        name: 'Low Priority',
        importance: Notifications.AndroidImportance.LOW,
      });
    }

    return true;
  }

  // Load notifications from storage
  private async loadNotifications(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored, (key, value) => {
          if (key === 'scheduledTime' || key === 'sentTime') {
            return value ? new Date(value) : undefined;
          }
          return value;
        });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  // Save notifications to storage
  private async saveNotifications(): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  // Load settings
  private async loadSettings(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (stored) {
        this.settings = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  // Save settings
  async saveSettings(settings: NotificationSettings): Promise<void> {
    this.settings = settings;
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Get current settings
  getSettings(): NotificationSettings {
    return this.settings;
  }

  // Check if notifications are allowed based on settings
  private shouldSendNotification(type: NotificationType): boolean {
    if (!this.settings.enabled) return false;

    // Check Do Not Disturb
    if (this.settings.doNotDisturbEnabled && this.settings.doNotDisturbStart && this.settings.doNotDisturbEnd) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      if (currentTime >= this.settings.doNotDisturbStart && currentTime <= this.settings.doNotDisturbEnd) {
        // Allow critical notifications during DND
        if (type !== 'predictive_warning') {
          return false;
        }
      }
    }

    // Check type-specific settings
    switch (type) {
      case 'predictive_warning':
        return this.settings.predictiveWarnings;
      case 'early_pattern':
        return this.settings.earlyPatterns;
      case 'positive_reinforcement':
        return this.settings.positiveReinforcement;
      case 'check_in':
        return this.settings.checkInReminders;
      case 'tracking_reminder':
        return this.settings.trackingReminders;
      case 'weather_warning':
        return this.settings.weatherWarnings;
      default:
        return true;
    }
  }

  // Schedule a notification
  async scheduleNotification(notification: Omit<NotificationData, 'id' | 'sentTime' | 'read'>): Promise<string> {
    if (!this.shouldSendNotification(notification.type)) {
      console.log(`Notification type ${notification.type} is disabled`);
      return '';
    }

    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const channelId = this.getChannelId(notification.priority);

    try {
      const trigger = notification.scheduledTime
        ? { date: notification.scheduledTime }
        : null;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: { notificationId: id, ...notification },
          sound: notification.priority === 'high' || notification.priority === 'critical',
          priority: notification.priority === 'critical' ? Notifications.AndroidNotificationPriority.MAX : Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
        identifier: id,
      });

      // Only add to notification center if it's immediate (no scheduled time)
      // Scheduled notifications will be added when they're received
      if (!notification.scheduledTime) {
        const newNotification: NotificationData = {
          ...notification,
          id,
          read: false,
          sentTime: new Date(),
        };

        this.notifications.unshift(newNotification);
        await this.saveNotifications();
      }

      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  }

  // Send immediate notification
  async sendNotification(notification: Omit<NotificationData, 'id' | 'sentTime' | 'read'>): Promise<string> {
    return this.scheduleNotification({
      ...notification,
      scheduledTime: undefined,
    });
  }

  // Get channel ID based on priority
  private getChannelId(priority: string): string {
    if (Platform.OS !== 'android') return 'default';

    switch (priority) {
      case 'critical':
      case 'high':
        return 'high-priority';
      case 'low':
        return 'low-priority';
      default:
        return 'default';
    }
  }

  // Get all notifications
  getAllNotifications(): NotificationData[] {
    return this.notifications;
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark as read
  async markAsRead(id: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      await this.saveNotifications();
    }
  }

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => n.read = true);
    await this.saveNotifications();
  }

  // Delete notification
  async deleteNotification(id: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== id);
    await this.saveNotifications();

    // Cancel scheduled notification
    await Notifications.cancelScheduledNotificationAsync(id);
  }

  // Clear all notifications
  async clearAll(): Promise<void> {
    this.notifications = [];
    await this.saveNotifications();
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get notification by ID
  getNotification(id: string): NotificationData | undefined {
    return this.notifications.find(n => n.id === id);
  }
}

export default NotificationService.getInstance();
