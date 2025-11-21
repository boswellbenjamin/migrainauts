import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons } from '@expo/vector-icons';
import NotificationService from '@/lib/services/notification-service';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = () => {
      const count = NotificationService.getUnreadCount();
      setUnreadCount(count);
    };

    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const profileInfo = [
    { label: 'Name', value: 'Alex Johnson' },
    { label: 'Age', value: '28' },
    { label: 'Migraines for', value: '8 years' },
  ];

  const settings = [
    { id: 'notif', label: 'Notifications', value: notifications, onChange: setNotifications },
    { id: 'dark', label: 'Dark Mode', value: darkMode, onChange: setDarkMode },
  ];

  const settingsSections = [
    {
      title: 'App Settings',
      items: [
        { icon: 'notifications', label: 'Notifications', subtitle: 'Manage alerts and reminders', route: '/notification-settings' },
        { icon: 'dark-mode', label: 'Appearance', subtitle: 'Light / Dark mode' },
        { icon: 'language', label: 'Language', subtitle: 'English' },
        { icon: 'accessibility', label: 'Accessibility', subtitle: 'Text size, contrast' },
      ],
    },
    {
      title: 'Data',
      items: [
        { icon: 'file-download', label: 'Export Data', subtitle: 'PDF, CSV' },
        { icon: 'delete-outline', label: 'Clear Data', subtitle: 'Remove all tracking' },
        { icon: 'cloud-upload', label: 'Backup', subtitle: 'Last backup: today' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'FAQ', subtitle: 'Common questions' },
        { icon: 'bug-report', label: 'Report Bug', subtitle: 'Help us improve' },
        { icon: 'info', label: 'About', subtitle: 'Version 1.0.0' },
      ],
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <ThemedText className="text-3xl font-bold mb-1">
              Profile
            </ThemedText>
            <ThemedText className="text-gray-600 dark:text-gray-400 text-sm">
              Manage your account
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={{ position: 'relative' }}
          >
            <MaterialIcons name="notifications" size={28} color={colors.text} />
            {unreadCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: colors.error,
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                }}
              >
                <ThemedText style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary + '20' },
            ]}
          >
            <MaterialIcons name="person" size={48} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <ThemedText type="subtitle">Alex Johnson</ThemedText>
            <ThemedText style={{ color: colors.darkGray, fontSize: 12, marginTop: 4 }}>
              Tracking since Jan 2024
            </ThemedText>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
            Personal Info
          </ThemedText>
          {profileInfo.map((info, index) => (
            <View
              key={index}
              style={[
                styles.infoRow,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderBottomWidth: index < profileInfo.length - 1 ? 1 : 0,
                },
              ]}
            >
              <ThemedText style={{ color: colors.darkGray }}>{info.label}</ThemedText>
              <ThemedText style={{ fontWeight: '600' }}>{info.value}</ThemedText>
            </View>
          ))}
        </View>

        {/* Quick Toggles */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
            Preferences
          </ThemedText>
          {settings.map((setting) => (
            <View
              key={setting.id}
              style={[
                styles.infoRow,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <ThemedText style={{ fontWeight: '500' }}>{setting.label}</ThemedText>
              <Switch value={setting.value} onValueChange={setting.onChange} />
            </View>
          ))}
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
              {section.title}
            </ThemedText>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                onPress={() => {
                  if ((item as any).route) {
                    router.push((item as any).route);
                  }
                }}
                style={[
                  styles.settingRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderBottomWidth:
                      itemIndex < section.items.length - 1 ? 1 : 0,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <MaterialIcons name={item.icon as any} size={20} color={colors.primary} />
                    <ThemedText style={{ fontWeight: '500' }}>{item.label}</ThemedText>
                  </View>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: colors.darkGray,
                      marginTop: 4,
                      marginLeft: 32,
                    }}
                  >
                    {item.subtitle}
                  </ThemedText>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.darkGray} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.error + '20',
              borderColor: colors.error,
            },
          ]}
        >
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <ThemedText style={{ color: colors.error, fontWeight: '600', marginLeft: 8 }}>
            Log Out
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
});

