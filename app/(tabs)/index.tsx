import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useData } from "@/lib/context/DataContext";
import { generateDailyInsight, generateDetailedInsights } from "@/lib/api/replicate";

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
  const [showAIDetails, setShowAIDetails] = useState(false);
  const [dailyInsight, setDailyInsight] = useState<string>("Loading insight...");
  const [detailedInsight, setDetailedInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [loadingDetailedInsight, setLoadingDetailedInsight] = useState(false);
  const dayScrollRef = useRef<ScrollView>(null);

  // Get real data from context
  const { dayData, migraines, loading, error, refreshData } = useData();

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

  // Use real data from context - show last 30 days
  const days = React.useMemo(() => {
    if (!dayData || dayData.length === 0) {
      // Fallback to mock data while loading
      const daysArray: DayData[] = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        daysArray.push({
          date,
          hasMigraine: false,
          trackedItems: 0,
        });
      }
      return daysArray;
    }
    // Get last 30 days of real data
    return dayData.slice(-30).map((day) => ({
      date: new Date(day.date),
      hasMigraine: day.hasMigraine,
      trackedItems: day.trackedCount,
    }));
  }, [dayData]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  // Load AI insight when data is available
  React.useEffect(() => {
    console.log("Dashboard - Data check:", {
      dayDataLength: dayData?.length,
      migrainesLength: migraines?.length,
      loadingInsight
    });

    if (dayData && dayData.length > 0 && migraines && migraines.length > 0 && loadingInsight) {
      console.log("Generating daily insight...");
      setLoadingInsight(false);
      generateDailyInsight(dayData, migraines)
        .then(insight => {
          console.log("Insight received:", insight.substring(0, 100));
          setDailyInsight(insight);
        })
        .catch(err => {
          console.error("Error generating insight:", err);
          setDailyInsight("Track your patterns to receive personalized insights!");
        });
    } else if (!loadingInsight) {
      // If data is not available but we're not loading, show a message
      if (!migraines || migraines.length === 0) {
        setDailyInsight("Start tracking to receive personalized insights!");
      }
    }
  }, [dayData, migraines, loadingInsight]);

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

  // Calculate real statistics
  const stats = React.useMemo(() => {
    if (!migraines || migraines.length === 0) {
      return { daysSinceLast: 0, thisMonth: 0, topTrigger: "None", topTriggerPercent: 0 };
    }

    const lastMigraine = migraines[migraines.length - 1];
    const daysSinceLast = Math.floor(
      (new Date().getTime() - new Date(lastMigraine.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    const now = new Date();
    const thisMonth = migraines.filter(m => {
      const date = new Date(m.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    // Count triggers
    const triggerCounts = new Map<string, number>();
    migraines.forEach(m => {
      m.triggers.forEach(t => {
        triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
      });
    });

    const topTrigger = Array.from(triggerCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    const topTriggerText = topTrigger ? topTrigger[0] : "None";
    const topTriggerPercent = topTrigger
      ? Math.round((topTrigger[1] / migraines.length) * 100)
      : 0;

    return { daysSinceLast, thisMonth, topTrigger: topTriggerText, topTriggerPercent };
  }, [migraines]);

  // Show loading state
  if (loading) {
    return (
      <ThemedView className="flex-1 bg-white dark:bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText className="mt-4 text-gray-600 dark:text-gray-400">
          Loading your data...
        </ThemedText>
      </ThemedView>
    );
  }

  // Show error state
  if (error) {
    return (
      <ThemedView className="flex-1 bg-white dark:bg-slate-900 justify-center items-center px-5">
        <MaterialIcons name="error-outline" size={48} color={colors.error} />
        <ThemedText className="mt-4 text-center text-gray-600 dark:text-gray-400">
          {error}
        </ThemedText>
        <TouchableOpacity
          onPress={refreshData}
          className="mt-4 px-6 py-3 rounded-xl bg-primary"
        >
          <ThemedText className="text-white font-semibold">Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-white dark:bg-slate-900">
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
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
            ref={dayScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentContainerStyle={{ gap: 8 }}
            onContentSizeChange={() => {
              // Scroll to the end (today's date)
              dayScrollRef.current?.scrollToEnd({ animated: false });
            }}
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

        {/* AI Daily Coach */}
        <View className="px-5 mb-7">
          <View
            style={{
              backgroundColor: colors.primary + "15",
              borderColor: colors.primary + "40",
            }}
            className="border rounded-2xl p-4"
          >
            <View className="flex-row items-start gap-3 mb-3">
              <View
                style={{ backgroundColor: colors.primary }}
                className="w-10 h-10 rounded-full justify-center items-center flex-shrink-0"
              >
                <MaterialIcons name="psychology" size={22} color="#fff" />
              </View>
              <View className="flex-1">
                <ThemedText className="font-semibold text-sm mb-1">
                  Today&apos;s Focus
                </ThemedText>
                <ThemedText className="text-xs text-gray-600 dark:text-gray-400 leading-5">
                  {dailyInsight}
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              className="flex-row items-center gap-1 self-start"
              onPress={async () => {
                setShowAIDetails(true);
                if (!detailedInsight && !loadingDetailedInsight && dayData && migraines) {
                  setLoadingDetailedInsight(true);
                  try {
                    const detailed = await generateDetailedInsights(dayData, migraines);
                    setDetailedInsight(detailed);
                  } catch (error) {
                    console.error("Error loading detailed insights:", error);
                    setDetailedInsight("Unable to load detailed insights. Please try again later.");
                  } finally {
                    setLoadingDetailedInsight(false);
                  }
                }
              }}
            >
              <ThemedText
                style={{ color: colors.primary }}
                className="text-xs font-semibold"
              >
                Read more
              </ThemedText>
              <MaterialIcons name="arrow-forward" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tracking List */}
        <View className="px-5 mb-7">
          <ThemedText className="text-base font-semibold mb-4">
            Quick Track ({trackedCount}/8)
          </ThemedText>

          <View className="gap-2">
            {trackingData.map((item) => (
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

        {/* Stats Section */}
        <View className="px-5 mb-7">
          <ThemedText className="text-base font-semibold mb-3">
            Your Progress
          </ThemedText>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <View className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 justify-center items-center mb-2">
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color={colors.success}
                />
              </View>
              <ThemedText className="text-2xl font-bold">{stats.daysSinceLast}</ThemedText>
              <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Days since last
              </ThemedText>
            </View>

            <View className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
              <View className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 justify-center items-center mb-2">
                <MaterialIcons
                  name="trending-down"
                  size={20}
                  color={colors.warning}
                />
              </View>
              <ThemedText className="text-2xl font-bold">{stats.thisMonth}</ThemedText>
              <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                This month
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
                {stats.topTrigger}
              </ThemedText>
              <ThemedText className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                {stats.topTriggerPercent}% of your migraines
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
        <MaterialCommunityIcons name="head-alert" size={32} color="#fff" />
      </TouchableOpacity>

      {/* AI Details Modal */}
      <Modal
        visible={showAIDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAIDetails(false)}
      >
        <ThemedView className="flex-1 bg-white dark:bg-slate-900">
          {/* Modal Header */}
          <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
            <View className="flex-row justify-between items-center">
              <ThemedText className="text-2xl font-bold">
                Today&apos;s AI Insights
              </ThemedText>
              <TouchableOpacity
                onPress={() => setShowAIDetails(false)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 justify-center items-center"
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* AI Generated Detailed Insights */}
            <View className="px-5 py-6">
              {loadingDetailedInsight ? (
                <View className="py-12 items-center">
                  <ActivityIndicator size="large" color={colors.primary} />
                  <ThemedText className="mt-4 text-gray-600 dark:text-gray-400">
                    Analyzing your patterns...
                  </ThemedText>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: colors.primary + "15",
                    borderColor: colors.primary + "40",
                  }}
                  className="border rounded-2xl p-5"
                >
                  <View className="flex-row items-start gap-3 mb-4">
                    <View
                      style={{ backgroundColor: colors.primary }}
                      className="w-12 h-12 rounded-full justify-center items-center flex-shrink-0"
                    >
                      <MaterialIcons name="psychology" size={26} color="#fff" />
                    </View>
                    <View className="flex-1">
                      <ThemedText className="font-bold text-lg mb-4">
                        AI Analysis
                      </ThemedText>
                      {detailedInsight ? (
                        detailedInsight.split('\n').map((line, index) => {
                          // Skip empty lines
                          if (!line.trim()) return null;

                          // Remove all markdown formatting
                          let cleanLine = line
                            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
                            .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
                            .replace(/__(.*?)__/g, '$1')     // Remove __bold__
                            .replace(/_(.*?)_/g, '$1');      // Remove _italic_

                          // Handle headers (lines starting with ##, ###, or numbers like 1., 2.)
                          if (line.match(/^#+\s/) || line.match(/^\d+\.\s/)) {
                            const text = cleanLine.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '');
                            return (
                              <ThemedText
                                key={index}
                                className="font-bold text-base mb-2 mt-4"
                              >
                                {text}
                              </ThemedText>
                            );
                          }

                          // Handle bullet points (lines starting with -, *, or •)
                          if (line.match(/^[-*•]\s/)) {
                            const text = cleanLine.replace(/^[-*•]\s*/, '');
                            return (
                              <View key={index} className="flex-row mb-2 ml-2">
                                <ThemedText className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                                  •
                                </ThemedText>
                                <ThemedText className="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-6">
                                  {text}
                                </ThemedText>
                              </View>
                            );
                          }

                          // Regular paragraphs
                          return (
                            <ThemedText
                              key={index}
                              className="text-sm text-gray-700 dark:text-gray-300 leading-6 mb-3"
                            >
                              {cleanLine}
                            </ThemedText>
                          );
                        })
                      ) : (
                        <ThemedText className="text-sm text-gray-700 dark:text-gray-300">
                          Loading detailed insights...
                        </ThemedText>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>

          </ScrollView>
        </ThemedView>
      </Modal>
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
        backgroundColor: item.tracked ? colors[item.color] + "20" : undefined,
        borderColor: item.tracked ? colors[item.color] : colors.border,
        borderWidth: 1,
      }}
      className={`${
        item.tracked
          ? ""
          : "bg-white dark:bg-slate-800"
      } rounded-xl p-3 flex-row items-center gap-3`}
    >
      {/* Icon */}
      <View
        style={{
          backgroundColor: item.tracked
            ? colors[item.color]
            : colors.mediumGray + "40",
        }}
        className="w-11 h-11 rounded-lg justify-center items-center flex-shrink-0"
      >
        <Icon
          name={item.icon}
          family={item.iconFamily}
          color={item.tracked ? "#fff" : colors.darkGray}
          size={22}
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        <ThemedText className="text-sm font-semibold">
          {item.label}
        </ThemedText>
        {item.tracked && item.value && (
          <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {item.value}
          </ThemedText>
        )}
        {!item.tracked && (
          <ThemedText className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Not tracked
          </ThemedText>
        )}
      </View>

      {/* Checkmark or Arrow */}
      {item.tracked ? (
        <MaterialIcons name="check-circle" size={20} color={colors[item.color]} />
      ) : (
        <MaterialIcons name="chevron-right" size={20} color={colors.mediumGray} />
      )}
    </TouchableOpacity>
  );
}
