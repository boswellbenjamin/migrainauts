import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons } from '@expo/vector-icons';
import NotificationService from '@/lib/services/notification-service';
import { NotificationData } from '@/lib/types/notifications';

export default function NotificationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'warnings' | 'reminders' | 'insights'>('all');

  const loadNotifications = () => {
    const allNotifications = NotificationService.getAllNotifications();
    setNotifications(allNotifications);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    await NotificationService.markAllAsRead();
    loadNotifications();
  };

  const handleDeleteNotification = async (id: string) => {
    await NotificationService.deleteNotification(id);
    loadNotifications();
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;

    const filterMap = {
      warnings: ['predictive_warning', 'early_pattern', 'weather_warning'],
      reminders: ['check_in', 'tracking_reminder'],
      insights: ['positive_reinforcement'],
    };

    return notifications.filter(n => filterMap[filter].includes(n.type));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'predictive_warning':
        return 'warning';
      case 'early_pattern':
        return 'lightbulb';
      case 'positive_reinforcement':
        return 'celebration';
      case 'check_in':
        return 'notification-important';
      case 'tracking_reminder':
        return 'edit-note';
      case 'weather_warning':
        return 'cloud';
      default:
        return 'notifications';
    }
  };

  const getIconColor = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText className="text-2xl font-bold flex-1">Notifications</ThemedText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={handleMarkAllRead}
              disabled={unreadCount === 0}
              style={{
                opacity: unreadCount === 0 ? 0.5 : 1,
              }}
            >
              <MaterialIcons name="done-all" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/notification-settings')}>
              <MaterialIcons name="settings" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        {unreadCount > 0 && (
          <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {unreadCount} unread
          </ThemedText>
        )}

        {/* Filter Tabs */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
          {(['all', 'warnings', 'reminders', 'insights'] as const).map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2 rounded-full ${
                filter === f
                  ? 'bg-teal-500'
                  : 'bg-gray-100 dark:bg-slate-700'
              }`}
            >
              <ThemedText
                className={`text-sm font-medium ${
                  filter === f ? 'text-white' : ''
                }`}
              >
                {f === 'all' && 'All'}
                {f === 'warnings' && 'Warnings'}
                {f === 'reminders' && 'Reminders'}
                {f === 'insights' && 'Insights'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <MaterialIcons name="notifications-none" size={64} color={colors.mediumGray} />
            <ThemedText className="mt-4 text-gray-500">Inga notifikationer</ThemedText>
          </View>
        ) : (
          filteredNotifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              onPress={() => router.push(`/notification-detail?id=${notification.id}`)}
              className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 py-4"
              style={{
                backgroundColor: notification.read ? colors.card : colors.background,
              }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  {/* Icon */}
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: getIconColor(notification.priority) + '20',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <MaterialIcons
                      name={getIcon(notification.type) as any}
                      size={22}
                      color={getIconColor(notification.priority)}
                    />
                  </View>

                  {/* Content */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <ThemedText className="text-base font-semibold flex-1">
                        {notification.title}
                      </ThemedText>
                      {!notification.read && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: colors.primary,
                            marginLeft: 8,
                          }}
                        />
                      )}
                    </View>
                    <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.body}
                    </ThemedText>
                    <ThemedText className="text-xs text-gray-500">
                      {formatTime(notification.sentTime || notification.scheduledTime)}
                    </ThemedText>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDeleteNotification(notification.id)}
                    style={{ padding: 4, marginLeft: 8 }}
                  >
                    <MaterialIcons name="close" size={18} color={colors.darkGray} />
                  </TouchableOpacity>
                </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
