import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DayData {
  date: Date;
  hasMigraine: boolean;
  trackedItems: number;
}

interface TrackingItem {
  id: string;
  label: string;
  icon: string;
  iconFamily: "material" | "community";
  color: keyof typeof Colors.light;
  tracked: boolean;
  value?: string;
}

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [refreshing, setRefreshing] = useState(false);

  const [trackingData, setTrackingData] = useState<TrackingItem[]>([
    {
      id: "sleep",
      label: "Sleep",
      icon: "nights-stay",
      iconFamily: "material",
      color: "sleep",
      tracked: true,
      value: "7h 30m",
    },
    {
      id: "water",
      label: "Water",
      icon: "water-drop",
      iconFamily: "community",
      color: "water",
      tracked: false,
    },
    {
      id: "meals",
      label: "Meals",
      icon: "silverware-fork-knife",
      iconFamily: "community",
      color: "meals",
      tracked: true,
      value: "Breakfast, Lunch",
    },
    {
      id: "activity",
      label: "Activity",
      icon: "directions-run",
      iconFamily: "material",
      color: "activity",
      tracked: false,
    },
    {
      id: "stress",
      label: "Stress",
      icon: "flash-on",
      iconFamily: "material",
      color: "stress",
      tracked: true,
      value: "Medium",
    },
    {
      id: "mood",
      label: "Mood",
      icon: "sentiment-satisfied",
      iconFamily: "material",
      color: "mood",
      tracked: false,
    },
    {
      id: "symptoms",
      label: "Symptoms",
      icon: "warning",
      iconFamily: "material",
      color: "symptoms",
      tracked: false,
    },
    {
      id: "medicine",
      label: "Medicine",
      icon: "pill",
      iconFamily: "community",
      color: "medicine",
      tracked: false,
    },
  ]);

  // Generate last 30 days
  const generateDays = () => {
    const days: DayData[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        hasMigraine: Math.random() > 0.7,
        trackedItems: Math.floor(Math.random() * 8),
      });
    }
    return days;
  };

  const days = generateDays();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const toggleTracking = (id: string) => {
    setTrackingData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, tracked: !item.tracked } : item
      )
    );
  };

  const Icon = ({ name, family, color, size = 24 }: any) => {
    const IconComponent =
      family === "material" ? MaterialIcons : MaterialCommunityIcons;
    return <IconComponent name={name} size={size} color={color} />;
  };

  const trackedCount = trackingData.filter((item) => item.tracked).length;

  return (
    <ThemedView className="flex-1 bg-white dark:bg-slate-900">
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-3 pb-4">
        <View className="flex-row justify-between items-start">
          <View>
            <ThemedText className="text-3xl font-bold mb-1">
              Migrainauts
            </ThemedText>
            <ThemedText className="text-gray-600 dark:text-gray-400 text-sm">
              Track your journey
            </ThemedText>
          </View>
          <TouchableOpacity
            className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-slate-700 justify-center items-center"
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="notifications-none"
              size={24}
              color={colors.primary}
            />
            <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Day Selector */}
        <View className="px-5 py-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={{ gap: 8 }}
          >
            {days.map((day, index) => {
              const isToday = index === days.length - 1;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  className={`${
                    isToday
                      ? "bg-primary border-primary"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  } border rounded-xl w-15 h-20 justify-center items-center py-2`}
                >
                  <Text
                    className={`text-xs ${
                      isToday
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {day.date
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .slice(0, 1)}
                  </Text>
                  <Text
                    className={`text-base font-semibold my-1 ${
                      isToday ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {day.date.getDate()}
                  </Text>
                  {day.hasMigraine && (
                    <View
                      className={`w-1.5 h-1.5 rounded-full ${
                        isToday ? "bg-white" : "bg-red-500"
                      } mt-0.5`}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View className="px-5 mb-7">
          <ThemedText className="text-base font-semibold mb-3">
            Today&apos;s Overview
          </ThemedText>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3">
              <View className="w-9 h-9 rounded-lg bg-green-500 bg-opacity-20 justify-center items-center">
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color={colors.success}
                />
              </View>
              <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Days since
              </ThemedText>
              <ThemedText className="text-2xl font-bold mt-1">12</ThemedText>
            </View>

            <View className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3">
              <View className="w-9 h-9 rounded-lg bg-amber-500 bg-opacity-20 justify-center items-center">
                <MaterialIcons
                  name="trending-down"
                  size={20}
                  color={colors.warning}
                />
              </View>
              <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                This month
              </ThemedText>
              <ThemedText className="text-2xl font-bold mt-1">3</ThemedText>
            </View>

            <View className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3">
              <View className="w-9 h-9 rounded-lg bg-purple-500 bg-opacity-20 justify-center items-center">
                <MaterialCommunityIcons
                  name="fire"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Streak
              </ThemedText>
              <ThemedText className="text-2xl font-bold mt-1">12d</ThemedText>
            </View>
          </View>
        </View>

        {/* Tracking Grid */}
        <View className="px-5 mb-7">
          <ThemedText className="text-base font-semibold mb-4">
            Quick Track ({trackedCount}/8)
          </ThemedText>

          <View>
            {/* Row 1 */}
            <View className="flex-row gap-3 mb-3">
              {trackingData.slice(0, 2).map((item) => (
                <TrackingCard
                  key={item.id}
                  item={item}
                  colors={colors}
                  onToggle={() => toggleTracking(item.id)}
                  Icon={Icon}
                />
              ))}
            </View>

            {/* Row 2 */}
            <View className="flex-row gap-3 mb-3">
              {trackingData.slice(2, 4).map((item) => (
                <TrackingCard
                  key={item.id}
                  item={item}
                  colors={colors}
                  onToggle={() => toggleTracking(item.id)}
                  Icon={Icon}
                />
              ))}
            </View>

            {/* Row 3 */}
            <View className="flex-row gap-3 mb-3">
              {trackingData.slice(4, 6).map((item) => (
                <TrackingCard
                  key={item.id}
                  item={item}
                  colors={colors}
                  onToggle={() => toggleTracking(item.id)}
                  Icon={Icon}
                />
              ))}
            </View>

            {/* Row 4 */}
            <View className="flex-row gap-3">
              {trackingData.slice(6, 8).map((item) => (
                <TrackingCard
                  key={item.id}
                  item={item}
                  colors={colors}
                  onToggle={() => toggleTracking(item.id)}
                  Icon={Icon}
                />
              ))}
            </View>
          </View>
        </View>

        {/* AI Insights */}
        <View className="px-5 mb-7">
          <ThemedText className="text-base font-semibold mb-3">
            Pattern Insights
          </ThemedText>
          <View
            style={{
              backgroundColor: colors.primary + "10",
              borderColor: colors.primary,
            }}
            className="border rounded-xl p-3 flex-row items-start gap-3"
          >
            <View
              style={{ backgroundColor: colors.primary }}
              className="w-10 h-10 rounded-lg justify-center items-center flex-shrink-0"
            >
              <MaterialIcons name="lightbulb" size={20} color="#fff" />
            </View>
            <View className="flex-1">
              <ThemedText className="font-semibold text-sm mb-1">
                Stress + Skipped Meals = Risk
              </ThemedText>
              <ThemedText className="text-xs text-gray-600 dark:text-gray-400 leading-5">
                You&apos;re 80% more likely to get migraines when stressed
                without eating regularly.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Top Trigger */}
        <View className="px-5 mb-7">
          <ThemedText className="text-base font-semibold mb-3">
            Top Trigger
          </ThemedText>
          <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex-row items-center gap-3">
            <View
              style={{ backgroundColor: colors.stress + "20" }}
              className="w-12 h-12 rounded-lg justify-center items-center"
            >
              <MaterialIcons name="flash-on" size={24} color={colors.stress} />
            </View>
            <View className="flex-1">
              <ThemedText className="font-semibold text-base">
                Stress
              </ThemedText>
              <ThemedText className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                67% of your migraines
              </ThemedText>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.primary}
            />
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-24 right-5 w-15 h-15 rounded-full bg-red-500 justify-center items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.9}
      >
        <MaterialCommunityIcons name="headache" size={32} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

// Tracking Card Component
function TrackingCard({ item, colors, onToggle, Icon }: any) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={{
        flex: 1,
        backgroundColor: item.tracked ? colors[item.color] + "20" : undefined,
        borderColor: item.tracked ? colors[item.color] : undefined,
        borderWidth: item.tracked ? 1.5 : 1,
        minHeight: 120,
      }}
      className={`${
        item.tracked
          ? "border-opacity-50"
          : "bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-700"
      } rounded-xl p-3 justify-center items-center`}
    >
      <View
        style={{
          backgroundColor: item.tracked
            ? colors[item.color]
            : colors.mediumGray,
        }}
        className="w-11 h-11 rounded-lg justify-center items-center mb-2"
      >
        <Icon
          name={item.icon}
          family={item.iconFamily}
          color={item.tracked ? "#fff" : colors.darkGray}
          size={24}
        />
      </View>
      <ThemedText className="text-xs font-semibold text-center">
        {item.label}
      </ThemedText>
      {item.tracked && item.value && (
        <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
          {item.value}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}
