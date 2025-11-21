import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons } from '@expo/vector-icons';
import NotificationService from '@/lib/services/notification-service';
import { NotificationSettings } from '@/lib/types/notifications';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [settings, setSettings] = useState<NotificationSettings>(
    NotificationService.getSettings()
  );

  const updateSetting = async <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await NotificationService.saveSettings(newSettings);
  };

  const sendTestNotification = async () => {
    await NotificationService.sendNotification({
      type: 'check_in',
      priority: 'medium',
      title: '🔔 Test Notification',
      body: 'This is a test notification from Migrainauts',
    });
  };

  const SettingRow = ({
    icon,
    title,
    description,
    value,
    onValueChange,
  }: {
    icon: string;
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 py-4">
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons name={icon as any} size={24} color={colors.primary} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <ThemedText className="text-base font-semibold mb-1">{title}</ThemedText>
          {description && (
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </ThemedText>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.lightGray, true: colors.primary + '80' }}
          thumbColor={value ? colors.primary : colors.mediumGray}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText className="text-2xl font-bold">Notification Settings</ThemedText>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Master Toggle */}
        <View className="mt-6 mb-2">
          <SettingRow
            icon="notifications"
            title="Notifications"
            description="Enable or disable all notifications"
            value={settings.enabled}
            onValueChange={(value) => updateSetting('enabled', value)}
          />
        </View>

        {/* Notification Types */}
        <View className="mt-6">
          <ThemedText className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-5 mb-2">
            NOTIFICATION TYPES
          </ThemedText>

          <SettingRow
            icon="warning"
            title="Predictive Warnings"
            description="Alerts when a migraine pattern is detected"
            value={settings.predictiveWarnings}
            onValueChange={(value) => updateSetting('predictiveWarnings', value)}
          />

          <SettingRow
            icon="lightbulb"
            title="Early Patterns"
            description="Notifications about early signs of migraines"
            value={settings.earlyPatterns}
            onValueChange={(value) => updateSetting('earlyPatterns', value)}
          />

          <SettingRow
            icon="celebration"
            title="Positive Reinforcement"
            description="Encouragement when you break negative patterns"
            value={settings.positiveReinforcement}
            onValueChange={(value) => updateSetting('positiveReinforcement', value)}
          />

          <SettingRow
            icon="notification-important"
            title="Check-in Reminders"
            description="Reminders to update your data"
            value={settings.checkInReminders}
            onValueChange={(value) => updateSetting('checkInReminders', value)}
          />

          <SettingRow
            icon="edit-note"
            title="Tracking Reminders"
            description="Reminders about missed tracking"
            value={settings.trackingReminders}
            onValueChange={(value) => updateSetting('trackingReminders', value)}
          />

          <SettingRow
            icon="cloud"
            title="Weather Warnings"
            description="Notifications about weather changes that could affect you"
            value={settings.weatherWarnings}
            onValueChange={(value) => updateSetting('weatherWarnings', value)}
          />
        </View>

        {/* Check-in Frequency */}
        <View className="mt-6">
          <ThemedText className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-5 mb-2">
            CHECK-IN FREQUENCY
          </ThemedText>

          <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 py-4">
            <ThemedText className="text-base font-semibold mb-3">Times per day</ThemedText>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[1, 2, 3].map(freq => (
                <TouchableOpacity
                  key={freq}
                  onPress={() => updateSetting('checkInFrequency', freq as 1 | 2 | 3)}
                  className={`flex-1 py-3 rounded-xl border-2 ${
                    settings.checkInFrequency === freq
                      ? 'bg-teal-500 border-teal-500'
                      : 'border-gray-300 dark:border-slate-600'
                  }`}
                >
                  <ThemedText
                    className={`text-center font-semibold ${
                      settings.checkInFrequency === freq ? 'text-white' : ''
                    }`}
                  >
                    {freq}x
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Do Not Disturb */}
        <View className="mt-6">
          <ThemedText className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-5 mb-2">
            DO NOT DISTURB
          </ThemedText>

          <SettingRow
            icon="do-not-disturb"
            title="Enable Do Not Disturb"
            description="No notifications during certain hours (critical alerts allowed)"
            value={settings.doNotDisturbEnabled}
            onValueChange={(value) => updateSetting('doNotDisturbEnabled', value)}
          />

          {settings.doNotDisturbEnabled && (
            <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 py-4">
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    From
                  </ThemedText>
                  <View className="bg-gray-100 dark:bg-slate-700 rounded-xl p-3">
                    <ThemedText className="text-center font-semibold">
                      {settings.doNotDisturbStart || '22:00'}
                    </ThemedText>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    To
                  </ThemedText>
                  <View className="bg-gray-100 dark:bg-slate-700 rounded-xl p-3">
                    <ThemedText className="text-center font-semibold">
                      {settings.doNotDisturbEnd || '07:00'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Max Notifications */}
        <View className="mt-6 mb-6">
          <ThemedText className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-5 mb-2">
            ADVANCED
          </ThemedText>

          <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 py-4">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <ThemedText className="text-base font-semibold mb-1">
                  Max notifications per day
                </ThemedText>
                <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                  Limit the number of notifications
                </ThemedText>
              </View>
              <View className="bg-gray-100 dark:bg-slate-700 rounded-xl px-4 py-2">
                <ThemedText className="font-semibold">{settings.maxNotificationsPerDay}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Test Notification */}
        <View className="px-5 mb-8">
          <TouchableOpacity
            onPress={sendTestNotification}
            className="bg-teal-500 rounded-xl p-4"
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          >
            <MaterialIcons name="send" size={20} color="white" style={{ marginRight: 8 }} />
            <ThemedText className="text-white font-semibold text-base">
              Send Test Notification
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Explanation */}
        <View className="px-5 mb-8">
          <View className="bg-gray-100 dark:bg-slate-700/50 rounded-xl p-4">
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <MaterialIcons
                name="info"
                size={20}
                color={colors.primary}
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <ThemedText className="text-sm font-semibold flex-1">About Notifications</ThemedText>
            </View>
            <ThemedText className="text-xs text-gray-600 dark:text-gray-400 leading-5">
              Migrainauts uses AI to analyze your patterns and send personalized notifications.
              Our predictive warnings can help you prevent migraines by detecting patterns early.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
