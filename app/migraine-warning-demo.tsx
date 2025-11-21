import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons } from '@expo/vector-icons';

export default function MigraineWarningDemoScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText className="text-2xl font-bold flex-1">Migraine Warning</ThemedText>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
      >
        {/* Icon and Title */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#ef4444' + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <MaterialIcons name="warning" size={40} color="#ef4444" />
          </View>
          <ThemedText className="text-2xl font-bold text-center mb-2">
            ⚠️ Migraine Risk Detected
          </ThemedText>
          <ThemedText className="text-base text-gray-600 dark:text-gray-400 text-center">
            You're following your usual Saturday pattern - migraine expected in 3 hours
          </ThemedText>
        </View>

        {/* Explanation */}
        <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
          <ThemedText className="text-base leading-6">
            On Saturdays at 12:00 you usually get migraines when you haven't been active in the morning and have drunk little water. Today you're following the same pattern.
          </ThemedText>
        </View>

        {/* Timeline */}
        <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
          <ThemedText className="text-lg font-semibold mb-4">Your day so far</ThemedText>

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <View style={{ marginRight: 12, alignItems: 'center' }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                }}
              />
              <View
                style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: colors.border,
                  marginVertical: 4,
                }}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 8 }}>
              <ThemedText className="text-sm font-semibold">07:00</ThemedText>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                Woke up - 6.5h sleep
              </ThemedText>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <View style={{ marginRight: 12, alignItems: 'center' }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary,
                }}
              />
              <View
                style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: colors.border,
                  marginVertical: 4,
                }}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 8 }}>
              <ThemedText className="text-sm font-semibold">08:00</ThemedText>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                Breakfast - coffee and sandwich
              </ThemedText>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <View style={{ marginRight: 12, alignItems: 'center' }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#ef4444',
                }}
              />
              <View
                style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: colors.border,
                  marginVertical: 4,
                }}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 8 }}>
              <ThemedText className="text-sm font-semibold">09:00</ThemedText>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                No activity ⚠️
              </ThemedText>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <View style={{ marginRight: 12, alignItems: 'center' }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#ef4444',
                }}
              />
              <View
                style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: colors.border,
                  marginVertical: 4,
                }}
              />
            </View>
            <View style={{ flex: 1, marginBottom: 8 }}>
              <ThemedText className="text-sm font-semibold">10:00</ThemedText>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                Still no activity ⚠️
              </ThemedText>
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ marginRight: 12, alignItems: 'center' }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#ef4444',
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText className="text-sm font-semibold">11:00</ThemedText>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                Little water drunk (1 glass) ⚠️
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Triggers */}
        <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
          <ThemedText className="text-lg font-semibold mb-4">Factors</ThemedText>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#fef3c7',
              borderRadius: 8,
            }}
          >
            <MaterialIcons
              name="check-circle"
              size={20}
              color="#f59e0b"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-sm flex-1">Low activity</ThemedText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#fef3c7',
              borderRadius: 8,
            }}
          >
            <MaterialIcons
              name="check-circle"
              size={20}
              color="#f59e0b"
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-sm flex-1">Little water</ThemedText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: colors.lightGray,
              borderRadius: 8,
            }}
          >
            <MaterialIcons
              name="cancel"
              size={20}
              color={colors.mediumGray}
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-sm flex-1">Poor sleep</ThemedText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: colors.lightGray,
              borderRadius: 8,
            }}
          >
            <MaterialIcons
              name="cancel"
              size={20}
              color={colors.mediumGray}
              style={{ marginRight: 8 }}
            />
            <ThemedText className="text-sm flex-1">High stress</ThemedText>
          </View>
        </View>

        {/* Actions */}
        <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
          <ThemedText className="text-lg font-semibold mb-4">Recommended Actions</ThemedText>

          <TouchableOpacity
            className="p-4 rounded-xl mb-3 bg-teal-500"
          >
            <ThemedText className="text-center font-semibold text-white">
              Take a 20 minute walk now
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 rounded-xl mb-3 bg-gray-100 dark:bg-slate-700"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ThemedText className="text-center font-semibold">
              Drink 2 glasses of water
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 rounded-xl mb-3 bg-gray-100 dark:bg-slate-700"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ThemedText className="text-center font-semibold">
              Take preventive medication
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 rounded-xl bg-gray-100 dark:bg-slate-700"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ThemedText className="text-center font-semibold">
              Use Relivia device
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Confidence */}
        <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <ThemedText className="text-sm font-semibold">Confidence Level</ThemedText>
            <ThemedText className="text-sm font-semibold">85%</ThemedText>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: colors.lightGray,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: '85%',
                backgroundColor: colors.primary,
              }}
            />
          </View>
          <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Based on 4 data points
          </ThemedText>
        </View>

        {/* Why am I seeing this */}
        <View className="bg-gray-100 dark:bg-slate-700/50 rounded-xl p-4">
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
            <MaterialIcons name="info" size={16} color={colors.darkGray} style={{ marginRight: 6 }} />
            <ThemedText className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Why am I seeing this?
            </ThemedText>
          </View>
          <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            • Previous events: 4 times
          </ThemedText>
          <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            • Expected time: in 3 hours
          </ThemedText>
          <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            • Active factor: you haven't been active
          </ThemedText>
          <ThemedText className="text-xs text-gray-600 dark:text-gray-400">
            • Active factor: you've drunk little water
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}
