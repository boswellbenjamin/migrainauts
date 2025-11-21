import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ReliviaScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [isPaired, setIsPaired] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handlePairDevice = async () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsPaired(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleBrowseShop = () => {
    console.log('Browse shop pressed');
  };

  if (isPaired) {
    return (
      <ThemedView className="flex-1">
        {/* Header */}
        <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <ThemedText className="text-3xl font-bold mb-1">
                Relivia
              </ThemedText>
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-green-500" />
                <ThemedText className="text-gray-600 dark:text-gray-400 text-sm">
                  Connected
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setIsPaired(false)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 items-center justify-center"
            >
              <MaterialIcons name="bluetooth-disabled" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Battery Card */}
          <View
            className="rounded-3xl p-6 mb-5"
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <ThemedText className="text-white/70 text-sm uppercase tracking-widest font-semibold">
                Battery Status
              </ThemedText>
              <MaterialIcons name="battery-charging-full" size={28} color="white" />
            </View>
            <ThemedText className="text-white text-6xl font-bold mb-2">
              87%
            </ThemedText>
            <ThemedText className="text-white/80 text-base">
              Approximately 12 sessions remaining
            </ThemedText>
          </View>

          {/* Stats Grid */}
          <View className="flex-row gap-3 mb-5">
            <View
              className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-3">
                <MaterialCommunityIcons name="calendar-week" size={24} color="#3b82f6" />
              </View>
              <ThemedText className="text-4xl font-bold mb-1" style={{ color: colors.primary }}>
                12
              </ThemedText>
              <ThemedText className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sessions This Week
              </ThemedText>
            </View>

            <View
              className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 items-center justify-center mb-3">
                <MaterialIcons name="timer" size={24} color="#a855f7" />
              </View>
              <ThemedText className="text-4xl font-bold mb-1" style={{ color: colors.primary }}>
                18
              </ThemedText>
              <ThemedText className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Avg Minutes
              </ThemedText>
            </View>
          </View>

          {/* Treatment Types */}
          <View
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-5"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <ThemedText className="text-sm uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 mb-4">
              Treatment Breakdown
            </ThemedText>

            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 items-center justify-center">
                  <MaterialCommunityIcons name="lightning-bolt" size={22} color="#ef4444" />
                </View>
                <View>
                  <ThemedText className="text-base font-semibold">Acute Treatment</ThemedText>
                  <ThemedText className="text-xs text-gray-500 dark:text-gray-400">During attacks</ThemedText>
                </View>
              </View>
              <ThemedText className="text-3xl font-bold" style={{ color: colors.primary }}>8</ThemedText>
            </View>

            <View className="h-px bg-gray-200 dark:bg-slate-700 my-4" />

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 items-center justify-center">
                  <MaterialIcons name="shield" size={22} color="#10b981" />
                </View>
                <View>
                  <ThemedText className="text-base font-semibold">Preventive</ThemedText>
                  <ThemedText className="text-xs text-gray-500 dark:text-gray-400">Daily routine</ThemedText>
                </View>
              </View>
              <ThemedText className="text-3xl font-bold" style={{ color: colors.primary }}>4</ThemedText>
            </View>
          </View>

          {/* Effectiveness */}
          <View
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-5"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <ThemedText className="text-sm uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 mb-5">
              Treatment Effectiveness
            </ThemedText>

            <View className="mb-5">
              <View className="flex-row items-center justify-between mb-2">
                <ThemedText className="text-base font-medium">Symptom Relief</ThemedText>
                <ThemedText className="text-2xl font-bold" style={{ color: colors.primary }}>78%</ThemedText>
              </View>
              <View className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ width: '78%', backgroundColor: colors.primary }}
                />
              </View>
            </View>

            <View>
              <View className="flex-row items-center justify-between mb-2">
                <ThemedText className="text-base font-medium">Frequency Reduction</ThemedText>
                <ThemedText className="text-2xl font-bold" style={{ color: colors.primary }}>65%</ThemedText>
              </View>
              <View className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{ width: '65%', backgroundColor: colors.primary }}
                />
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <ThemedText className="text-sm uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 mb-3">
            Quick Actions
          </ThemedText>

          <TouchableOpacity
            className="rounded-2xl p-5 mb-3"
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <MaterialIcons name="play-circle-filled" size={28} color="white" />
                </View>
                <View>
                  <ThemedText className="text-white text-lg font-bold">Start Treatment</ThemedText>
                  <ThemedText className="text-white/80 text-sm">Begin acute session</ThemedText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={28} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-3"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
                  <MaterialIcons name="schedule" size={24} color="#3b82f6" />
                </View>
                <View>
                  <ThemedText className="text-base font-semibold">Schedule Preventive</ThemedText>
                  <ThemedText className="text-xs text-gray-500 dark:text-gray-400">Set daily routine</ThemedText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white dark:bg-slate-800 rounded-2xl p-5"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 items-center justify-center">
                  <MaterialIcons name="settings" size={24} color={colors.text} />
                </View>
                <View>
                  <ThemedText className="text-base font-semibold">Device Settings</ThemedText>
                  <ThemedText className="text-xs text-gray-500 dark:text-gray-400">Customize experience</ThemedText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    );
  }

  // Unpaired state - Product showcase
  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <ThemedText className="text-3xl font-bold mb-1">
          Relivia
        </ThemedText>
        <ThemedText className="text-gray-600 dark:text-gray-400 text-sm">
          Intelligent nerve stimulation for migraine
        </ThemedText>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="px-5 pt-8 pb-6">
          <View className="items-center mb-6">
            <View
              className="w-24 h-24 rounded-3xl items-center justify-center mb-4"
              style={{
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <MaterialIcons name="sensors" size={48} color="white" />
            </View>
          </View>

          <ThemedText className="text-4xl font-bold text-center mb-3">
            Relivia
          </ThemedText>
          <ThemedText className="text-xl text-center mb-6 font-medium" style={{ color: colors.primary }}>
            Personal. Preventive. Predictive.
          </ThemedText>
        </View>

        {/* Description Card */}
        <View className="px-5 mb-6">
          <View
            className="bg-white dark:bg-slate-800 rounded-3xl p-6"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <ThemedText className="text-lg leading-7 text-gray-700 dark:text-gray-300 mb-4 font-medium">
              Relivia is an intelligent nerve stimulation device that helps you take real control of your migraine.
            </ThemedText>
            <ThemedText className="text-base leading-7 text-gray-600 dark:text-gray-400">
              Gentle stimulation of the trigeminal nerve can relieve acute attacks and prevent new ones. But where other solutions stop, our intelligence begins.
            </ThemedText>
          </View>
        </View>

        {/* Features Grid */}
        <View className="px-5 mb-6">
          <ThemedText className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
            Adapts to You
          </ThemedText>

          <View className="gap-3">
            <View
              className="bg-white dark:bg-slate-800 rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-start gap-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <MaterialCommunityIcons name="lightning-bolt" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-base font-bold mb-1">
                    Acute and preventive treatment in one
                  </ThemedText>
                  <ThemedText className="text-sm text-gray-500 dark:text-gray-400">
                    Relief when you need it, protection when you don't
                  </ThemedText>
                </View>
              </View>
            </View>

            <View
              className="bg-white dark:bg-slate-800 rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-start gap-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <MaterialCommunityIcons name="brain" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-base font-bold mb-1">
                    Individually adapted neurostimulation
                  </ThemedText>
                  <ThemedText className="text-sm text-gray-500 dark:text-gray-400">
                    AI learns your patterns for personalized care
                  </ThemedText>
                </View>
              </View>
            </View>

            <View
              className="bg-white dark:bg-slate-800 rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-start gap-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <MaterialCommunityIcons name="hand-okay" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-base font-bold mb-1">
                    Discreet, portable, and easy to use
                  </ThemedText>
                  <ThemedText className="text-sm text-gray-500 dark:text-gray-400">
                    Fits seamlessly into your daily life
                  </ThemedText>
                </View>
              </View>
            </View>

            <View
              className="bg-white dark:bg-slate-800 rounded-2xl p-5"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-start gap-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <MaterialCommunityIcons name="shield-check" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-base font-bold mb-1">
                    For people with migraine who want to take control
                  </ThemedText>
                  <ThemedText className="text-sm text-gray-500 dark:text-gray-400">
                    Empower yourself with intelligent technology
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            onPress={handlePairDevice}
            disabled={isConnecting}
            className="rounded-2xl p-5 mb-3"
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 8,
              opacity: isConnecting ? 0.7 : 1,
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center gap-3">
              {isConnecting ? (
                <>
                  <ActivityIndicator color="white" size="small" />
                  <ThemedText className="text-white text-lg font-bold">
                    Connecting to Device...
                  </ThemedText>
                </>
              ) : (
                <>
                  <MaterialIcons name="bluetooth" size={24} color="white" />
                  <ThemedText className="text-white text-lg font-bold">
                    Pair Your Device
                  </ThemedText>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBrowseShop}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: colors.card,
              borderWidth: 2,
              borderColor: colors.primary,
            }}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center gap-3">
              <MaterialIcons name="shopping-bag" size={24} color={colors.primary} />
              <ThemedText className="text-lg font-bold" style={{ color: colors.primary }}>
                Browse Shop
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View className="mx-5 mb-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4">
          <View className="flex-row items-start gap-3">
            <MaterialIcons name="info-outline" size={18} color={colors.text} style={{ marginTop: 1, opacity: 0.6 }} />
            <ThemedText className="flex-1 text-xs text-gray-500 dark:text-gray-400 leading-5">
              Prototype under development. Final product may differ in appearance.
            </ThemedText>
          </View>
        </View>

        {/* Bottom tagline */}
        <View className="px-8 pb-6">
          <ThemedText className="text-center text-xl font-bold text-gray-700 dark:text-gray-300 leading-8">
            More than a product—
          </ThemedText>
          <ThemedText className="text-center text-xl font-bold leading-8" style={{ color: colors.primary }}>
            a new way to live with migraine
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
