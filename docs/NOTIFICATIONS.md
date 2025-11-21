# AI Notifications System

Migrainauts features an intelligent notification system that uses AI-powered pattern detection to help users prevent migraines before they occur.

## Features

### 6 Types of Notifications

1. **Predictive Warning** - High Priority
   - Sent 2-4 hours before expected migraine
   - Based on detected patterns (day, time, conditions)
   - Includes actionable suggestions
   - Shows confidence level and data points

2. **Early Pattern** - Medium Priority
   - Sent 6-8 hours before potential migraine
   - Alerts when 3/4 trigger factors are active
   - Progress bar showing active triggers

3. **Positive Reinforcement** - Low Priority
   - Sent when user breaks usual pattern successfully
   - Encourages continued good behavior
   - Can be shared anonymously

4. **Check-in Reminder**
   - Customizable frequency (1-3x per day)
   - Reminds user to update data

5. **Tracking Reminder**
   - Sent 2 hours after usual tracking time
   - Specific to missed tracking type

6. **Weather Warning**
   - Alerts on barometric pressure changes
   - Only if weather tracking is enabled

## Pattern Detection

The system analyzes:
- **Day of Week**: Specific days when migraines occur
- **Time of Day**: Morning, afternoon, evening, night
- **Activity Level**: Low activity before migraine
- **Sleep Quality**: Poor sleep correlation
- **Water Intake**: Dehydration patterns
- **Stress Levels**: High stress periods

### Confidence Scoring

Pattern confidence is calculated based on:
- Number of occurrences (max weight at 5+)
- Consistency of conditions across events
- Minimum 30% confidence required to notify

## Notification Screens

### Notification Center (`/notifications`)
- List view with filters (All, Warnings, Reminders, Insights)
- Unread count badge
- Swipe to delete
- Pull to refresh
- Mark all as read

### Notification Detail (`/notification-detail`)
- Full explanation of why notification was sent
- Timeline visualization
- Active trigger factors
- Recommended actions (clickable)
- Confidence level with progress bar
- "Why am I seeing this?" explainer

### Notification Settings (`/notification-settings`)
- Master on/off toggle
- Individual notification type toggles
- Check-in frequency selector
- Do Not Disturb hours
- Max notifications per day
- Test notification button

## Usage

### For Users

1. **Enable Notifications**: Go to Profile > Notifications to configure
2. **Review Patterns**: The app learns from your data automatically
3. **Act on Warnings**: When you receive a predictive warning, follow suggested actions
4. **Track Results**: Log whether the warning was accurate

### For Developers

```typescript
import NotificationService from '@/lib/services/notification-service';
import PatternDetectionService from '@/lib/services/pattern-detection';

// Initialize notifications
await NotificationService.initialize();

// Analyze patterns
const patterns = PatternDetectionService.analyzePatterns(migraines, dayData);

// Check for warnings
await PatternDetectionService.checkForPatterns(currentDay, patterns, migraines);

// Send custom notification
await NotificationService.sendNotification({
  type: 'check_in',
  priority: 'medium',
  title: 'Time to check in',
  body: 'How are you feeling?',
});
```

## Files Structure

```
lib/
  types/
    notifications.ts          # Notification type definitions
  services/
    notification-service.ts   # Core notification service
    pattern-detection.ts      # AI pattern analysis
  hooks/
    useNotifications.ts       # React hook for notifications

app/
  notifications.tsx           # Notification center screen
  notification-detail.tsx     # Notification detail view
  notification-settings.tsx   # Settings screen
```

## Settings Storage

All notification settings and history are stored locally using AsyncStorage:
- `@migrainauts_notifications` - Notification history
- `@migrainauts_notification_settings` - User preferences

## Privacy

- All pattern detection runs locally on device
- No notification data is sent to external servers
- Users can clear all notification history at any time
- Notifications respect Do Not Disturb settings

## Future Enhancements

- [ ] Weather API integration for real-time pressure alerts
- [ ] Machine learning model for improved pattern detection
- [ ] Notification effectiveness tracking
- [ ] Community pattern sharing (anonymized)
- [ ] Integration with Relivia device for automatic prevention
