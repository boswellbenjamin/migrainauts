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
      title: '🔔 Testnotifikation',
      body: 'Detta är en testnotifikation från Migrainauts',
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
          <ThemedText className="text-2xl font-bold">Notifikationsinställningar</ThemedText>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Master Toggle */}
        <View className="mt-6 mb-2">
          <SettingRow
            icon="notifications"
            title="Notifikationer"
            description="Aktivera eller inaktivera alla notifikationer"
            value={settings.enabled}
            onValueChange={(value) => updateSetting('enabled', value)}
          />
        </View>

        {/* Notification Types */}
        <View className="mt-6">
          <ThemedText className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-5 mb-2">
            NOTIFIKATIONSTYPER
          </ThemedText>

          <SettingRow
            icon="warning"
            title="Prediktiva varningar"
            description="Varningar när ett migränmönster upptäcks"
            value={settings.predictiveWarnings}
            onValueChange={(value) => updateSetting('predictiveWarnings', value)}
          />

          <SettingRow
            icon="lightbulb"
            title="Tidiga mönster"
            description="Notifikationer om tidiga tecken på migrän"
            value={settings.earlyPatterns}
            onValueChange={(value) => updateSetting('earlyPatterns', value)}
          />

          <SettingRow
            icon="celebration"
            title="Positiv förstärkning"
            description="Uppmuntran när du bryter negativa mönster"
            value={settings.positiveReinforcement}
            onValueChange={(value) => updateSetting('positiveReinforcement', value)}
          />

          <SettingRow
            icon="notification-important"
            title="Check-in påminnelser"
            description="Påminnelser om att uppdatera din data"
            value={settings.checkInReminders}
            onValueChange={(value) => updateSetting('checkInReminders', value)}
          />

          <SettingRow
            icon="edit-note"
            title="Tracking påminnelser"
            description="Påminnelser om missade trackings"
            value={settings.trackingReminders}
            onValueChange={(value) => updateSetting('trackingReminders', value)}
          />

          <SettingRow
            icon="cloud"
            title="Vädervarningar"
            description="Notifikationer om väderförändringar som kan påverka dig"
            value={settings.weatherWarnings}
            onValueChange={(value) => updateSetting('weatherWarnings', value)}
          />
        </View>

        {/* Check-in Frequency */}
        <View className="mt-6">
          <ThemedText className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-5 mb-2">
            CHECK-IN FREKVENS
          </ThemedText>

          <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 py-4">
            <ThemedText className="text-base font-semibold mb-3">Antal gånger per dag</ThemedText>
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
            TYST LÄGE
          </ThemedText>

          <SettingRow
            icon="do-not-disturb"
            title="Aktivera tyst läge"
            description="Stör ej under vissa timmar (kritiska varningar tillåts)"
            value={settings.doNotDisturbEnabled}
            onValueChange={(value) => updateSetting('doNotDisturbEnabled', value)}
          />

          {settings.doNotDisturbEnabled && (
            <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 py-4">
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Från
                  </ThemedText>
                  <View className="bg-gray-100 dark:bg-slate-700 rounded-xl p-3">
                    <ThemedText className="text-center font-semibold">
                      {settings.doNotDisturbStart || '22:00'}
                    </ThemedText>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Till
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
            AVANCERAT
          </ThemedText>

          <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 py-4">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <ThemedText className="text-base font-semibold mb-1">
                  Max notifikationer per dag
                </ThemedText>
                <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                  Begränsa antalet notifikationer
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
              Skicka testnotifikation
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
              <ThemedText className="text-sm font-semibold flex-1">Om notifikationer</ThemedText>
            </View>
            <ThemedText className="text-xs text-gray-600 dark:text-gray-400 leading-5">
              Migrainauts använder AI för att analysera dina mönster och skicka personliga notifikationer.
              Våra prediktiva varningar kan hjälpa dig att förebygga migrän genom att upptäcka mönster tidigt.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
