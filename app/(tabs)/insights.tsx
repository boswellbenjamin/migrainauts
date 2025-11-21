import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons } from '@expo/vector-icons';

export default function InsightsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const periods = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ] as const;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ThemedText type="title">Your Patterns</ThemedText>
        <ThemedText style={{ color: colors.darkGray, marginTop: 4 }}>
          Understand your migraine triggers
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map(period => (
            <TouchableOpacity
              key={period.id}
              onPress={() => setSelectedPeriod(period.id)}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    selectedPeriod === period.id ? colors.primary : colors.card,
                  borderColor:
                    selectedPeriod === period.id ? colors.primary : colors.border,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: selectedPeriod === period.id ? '#fff' : colors.text,
                  fontWeight: '600',
                }}
              >
                {period.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {/* Heatmap Placeholder */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
              Calendar Overview
            </ThemedText>
            <View
              style={[
                styles.heatmapContainer,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.heatmapGrid}>
                {Array(30)
                  .fill(0)
                  .map((_, i) => {
                    const intensity = Math.random();
                    let bgColor = colors.success;
                    if (intensity > 0.7) bgColor = colors.error;
                    else if (intensity > 0.4) bgColor = colors.warning;

                    return (
                      <View
                        key={i}
                        style={[
                          styles.heatmapCell,
                          {
                            backgroundColor:
                              Math.random() > 0.8
                                ? bgColor + '60'
                                : colors.lightGray,
                          },
                        ]}
                      />
                    );
                  })}
              </View>
            </View>
          </View>

          {/* Top Triggers */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
              Top Triggers
            </ThemedText>
            {[
              { trigger: 'Stress', percentage: 67, color: 'stress' as const },
              { trigger: 'Sleep Deprivation', percentage: 54, color: 'sleep' as const },
              { trigger: 'Weather Changes', percentage: 42, color: 'warning' as const },
              { trigger: 'Caffeine', percentage: 31, color: 'meal' as const },
            ].map((item, i) => (
              <View
                key={i}
                style={[
                  styles.triggerItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontWeight: '600' }}>{item.trigger}</ThemedText>
                  <View
                    style={[
                      styles.triggerBar,
                      { backgroundColor: colors.lightGray },
                    ]}
                  >
                    <View
                      style={[
                        styles.triggerFill,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: colors[item.color] || colors.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text
                  style={{
                    fontWeight: '700',
                    color: colors.primary,
                    marginLeft: 12,
                  }}
                >
                  {item.percentage}%
                </Text>
              </View>
            ))}
          </View>

          {/* Insights */}
          <View>
            <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
              Key Insights
            </ThemedText>
            <View
              style={[
                styles.insightCard,
                {
                  backgroundColor: colors.primary + '10',
                  borderColor: colors.primary,
                },
              ]}
            >
              <MaterialIcons name="lightbulb" size={24} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ThemedText style={{ fontWeight: '600', marginBottom: 4 }}>
                  Pattern Found
                </ThemedText>
                <ThemedText style={{ color: colors.darkGray, fontSize: 12 }}>
                  Stress combined with irregular sleep increases migraine risk by 80%
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  heatmapContainer: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  heatmapCell: {
    width: '9.33%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  triggerItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  triggerBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  triggerFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
});

