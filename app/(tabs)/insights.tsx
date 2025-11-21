import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useData } from "@/lib/context/DataContext";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function InsightsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { migraines, dayData } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");

  const periods = [
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
  ] as const;

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <ThemedText className="text-3xl font-bold mb-1">
          Your Patterns
        </ThemedText>
        <ThemedText className="text-gray-600 dark:text-gray-400 text-sm">
          Understand your migraine triggers
        </ThemedText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Period Selector */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingVertical: 16,
            gap: 8,
          }}
        >
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              onPress={() => setSelectedPeriod(period.id)}
              style={{
                flex: 1,
                backgroundColor:
                  selectedPeriod === period.id ? colors.primary : colors.card,
                borderColor:
                  selectedPeriod === period.id ? colors.primary : colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingVertical: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText
                style={{
                  color: selectedPeriod === period.id ? "#fff" : colors.text,
                  fontWeight: "600",
                }}
              >
                {period.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Top Triggers */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText
              style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}
            >
              Top Triggers
            </ThemedText>
            {(() => {
              const triggerCounts = new Map<string, number>();
              migraines?.forEach((m) => {
                m.triggers.forEach((t) => {
                  triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
                });
              });

              const topTriggers = Array.from(triggerCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([trigger, count]) => ({
                  trigger,
                  percentage: Math.round(
                    (count / (migraines?.length || 1)) * 100
                  ),
                  color: "stress" as const,
                }));

              if (topTriggers.length === 0) {
                return (
                  <ThemedText style={{ color: colors.darkGray }}>
                    No trigger data yet. Start logging migraines to see
                    patterns!
                  </ThemedText>
                );
              }

              return topTriggers.map((item, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: colors.error + "10",
                    borderColor: colors.error + "40",
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: "600" }}>
                      ⚠️ {item.trigger}
                    </ThemedText>
                    <View
                      style={{
                        backgroundColor: colors.lightGray,
                        height: 6,
                        borderRadius: 3,
                        marginTop: 8,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: `${item.percentage}%`,
                          height: "100%",
                          backgroundColor: colors.error,
                          borderRadius: 3,
                        }}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontWeight: "700",
                      color: colors.error,
                      marginLeft: 12,
                      fontSize: 16,
                    }}
                  >
                    +{item.percentage}%
                  </Text>
                </View>
              ));
            })()}
          </View>

          {/* Protective Factors */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText
              style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}
            >
              Protective Factors
            </ThemedText>
            {(() => {
              // Analyze days without migraines to find protective patterns
              const noMigraineDays =
                dayData?.filter((day) => !day.hasMigraine) || [];

              if (noMigraineDays.length === 0) {
                return (
                  <ThemedText style={{ color: colors.darkGray }}>
                    Keep tracking to identify what helps you stay migraine-free!
                  </ThemedText>
                );
              }

              // Count positive patterns on migraine-free days
              const protectivePatterns = [
                {
                  name: "Good Sleep",
                  emoji: "😴",
                  predicate: (day: any) =>
                    day.trackingEntries?.some(
                      (e: any) => e.type === "sleep" && e.tracked
                    ),
                },
                {
                  name: "Regular Meals",
                  emoji: "🍽️",
                  predicate: (day: any) =>
                    day.trackingEntries?.some(
                      (e: any) => e.type === "meals" && e.tracked
                    ),
                },
                {
                  name: "Low Stress",
                  emoji: "😌",
                  predicate: (day: any) =>
                    day.trackingEntries?.some(
                      (e: any) => e.type === "stress" && e.value === "low"
                    ),
                },
                {
                  name: "Hydration",
                  emoji: "💧",
                  predicate: (day: any) =>
                    day.trackingEntries?.some(
                      (e: any) => e.type === "water" && e.tracked
                    ),
                },
              ];

              const protectiveFactors = protectivePatterns
                .map((pattern) => ({
                  ...pattern,
                  count: noMigraineDays.filter(pattern.predicate).length,
                }))
                .filter((p) => p.count > 0)
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

              if (protectiveFactors.length === 0) {
                return (
                  <ThemedText style={{ color: colors.darkGray }}>
                    Track more details to identify protective patterns!
                  </ThemedText>
                );
              }

              return protectiveFactors.map((factor, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: colors.success + "10",
                    borderColor: colors.success + "40",
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: "600" }}>
                      ✓ {factor.name}
                    </ThemedText>
                    <View
                      style={{
                        backgroundColor: colors.lightGray,
                        height: 6,
                        borderRadius: 3,
                        marginTop: 8,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: `${Math.min(
                            (factor.count / noMigraineDays.length) * 100,
                            100
                          )}%`,
                          height: "100%",
                          backgroundColor: colors.success,
                          borderRadius: 3,
                        }}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontWeight: "700",
                      color: colors.success,
                      marginLeft: 12,
                      fontSize: 16,
                    }}
                  >
                    -{Math.round((factor.count / noMigraineDays.length) * 100)}%
                  </Text>
                </View>
              ));
            })()}
          </View>

          {/* Pattern Analysis Insight */}
          {(() => {
            const triggerCounts = new Map<string, number>();
            migraines?.forEach((m) => {
              m.triggers.forEach((t) => {
                triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
              });
            });

            const topTrigger = Array.from(triggerCounts.entries()).sort(
              (a, b) => b[1] - a[1]
            )[0];

            if (!topTrigger || !migraines || migraines.length === 0) {
              return (
                <View
                  style={{
                    backgroundColor: colors.primary + "10",
                    borderColor: colors.primary,
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 12,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <MaterialIcons
                    name="lightbulb"
                    size={24}
                    color={colors.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: "600", marginBottom: 4 }}>
                      Start Tracking
                    </ThemedText>
                    <ThemedText
                      style={{ color: colors.darkGray, fontSize: 12 }}
                    >
                      Log your migraines to discover patterns and triggers
                    </ThemedText>
                  </View>
                </View>
              );
            }

            const triggerPercentage = Math.round(
              (topTrigger[1] / migraines.length) * 100
            );

            // Get top protective factor
            const noMigraineDays =
              dayData?.filter((day) => !day.hasMigraine) || [];
            const protectivePatterns = [
              {
                name: "Good Sleep",
                predicate: (day: any) =>
                  day.trackingEntries?.some(
                    (e: any) => e.type === "sleep" && e.tracked
                  ),
              },
              {
                name: "Regular Meals",
                predicate: (day: any) =>
                  day.trackingEntries?.some(
                    (e: any) => e.type === "meals" && e.tracked
                  ),
              },
              {
                name: "Low Stress",
                predicate: (day: any) =>
                  day.trackingEntries?.some(
                    (e: any) => e.type === "stress" && e.value === "low"
                  ),
              },
            ];

            const topProtective = protectivePatterns
              .map((pattern) => ({
                ...pattern,
                count: noMigraineDays.filter(pattern.predicate).length,
              }))
              .sort((a, b) => b.count - a.count)[0];

            const protectivePercentage = topProtective
              ? Math.round((topProtective.count / noMigraineDays.length) * 100)
              : 0;

            const insight =
              topProtective && protectivePercentage > 0
                ? `⚠️ ${topTrigger[0]} causes +${triggerPercentage}% of your migraines. ✓ ${topProtective.name} reduces risk by -${protectivePercentage}%. Try combining trigger management with protective habits.`
                : `⚠️ ${topTrigger[0]} is your top trigger, affecting +${triggerPercentage}% of your migraines. Focus on managing this to reduce migraine frequency.`;

            return (
              <View
                style={{
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary,
                  borderWidth: 1,
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <ThemedText
                  style={{ fontWeight: "600", marginBottom: 6, fontSize: 16 }}
                >
                  Pattern Analysis
                </ThemedText>
                <ThemedText
                  style={{
                    color: colors.darkGray,
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                >
                  {insight}
                </ThemedText>
              </View>
            );
          })()}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
