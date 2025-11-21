import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import NotificationService from '../services/notification-service';
import PatternDetectionService from '../services/pattern-detection';
import { useData } from '../context/DataContext';

export function useNotifications() {
  const { migraines, dayData } = useData();
  const appState = useRef(AppState.currentState);
  const checkInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize notifications
  useEffect(() => {
    const init = async () => {
      const hasPermission = await NotificationService.initialize();
      if (!hasPermission) {
        console.warn('Notification permissions not granted');
      }
    };

    init();
  }, []);

  // Check for patterns regularly
  const checkPatterns = async () => {
    if (migraines.length === 0 || dayData.length === 0) {
      return;
    }

    try {
      // Analyze patterns
      const patterns = PatternDetectionService.analyzePatterns(migraines, dayData);

      if (patterns.length === 0) {
        console.log('No patterns found yet');
        return;
      }

      // Get current day
      const today = new Date();
      const currentDay = dayData.find(d => {
        const dDate = new Date(d.date);
        return dDate.toDateString() === today.toDateString();
      });

      if (!currentDay) {
        console.log('No data for today yet');
        return;
      }

      // Check for predictive warnings and early patterns
      await PatternDetectionService.checkForPatterns(currentDay, patterns, migraines);

      // Check for positive reinforcement (once per day)
      const now = new Date();
      if (now.getHours() === 20) {
        // Check at 8 PM
        await PatternDetectionService.checkForPositiveReinforcement(
          currentDay,
          patterns,
          migraines
        );
      }
    } catch (error) {
      console.error('Error checking patterns:', error);
    }
  };

  // Check patterns when app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        checkPatterns();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [migraines, dayData]);

  // Check patterns every hour
  useEffect(() => {
    // Set up interval to check every hour (skip initial check to avoid startup notification)
    checkInterval.current = setInterval(() => {
      checkPatterns();
    }, 60 * 60 * 1000); // 1 hour

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [migraines, dayData]);

  // NOTE: Removed notification received listener since we send immediate notifications
  // The notification service already adds them to the center when sendNotification is called

  // Handle notification tap
  useEffect(() => {
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const notificationId = response.notification.request.content.data.notificationId;
      if (notificationId) {
        // Mark as read
        NotificationService.markAsRead(notificationId as string);
      }
    });

    return () => responseSubscription.remove();
  }, []);

  return {
    checkPatterns,
  };
}
