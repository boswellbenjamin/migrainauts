import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
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
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.card, borderBottomColor: colors.border, borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 16 }}>
        <ThemedText style={{ fontSize: 24, fontWeight: '700' }}>Your Patterns</ThemedText>
        <ThemedText style={{ color: colors.darkGray, fontSize: 14, marginTop: 4 }}>Understand your migraine triggers</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Period Selector */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, gap: 8 }}>
          {periods.map(period => (
            <TouchableOpacity key={period.id} onPress={() => setSelectedPeriod(period.id)} style={{ flex: 1, backgroundColor: selectedPeriod === period.id ? colors.primary : colors.card, borderColor: selectedPeriod === period.id ? colors.primary : colors.border, borderWidth: 1, borderRadius: 8, paddingVertical: 8, justifyContent: 'center', alignItems: 'center' }}>
              <ThemedText style={{ color: selectedPeriod === period.id ? '#fff' : colors.text, fontWeight: '600' }}>
                {period.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {/* Heatmap */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Calendar Overview</ThemedText>
            <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {Array(30)
                  .fill(0)
                  .map((_, i) => {
                    const intensity = Math.random();
                    let bgColor = colors.success;
                    if (intensity > 0.7) bgColor = colors.error;
                    else if (intensity > 0.4) bgColor = colors.warning;

                    return (
                      <View key={i} style={{ width: '9.33%', aspectRatio: 1, backgroundColor: Math.random() > 0.8 ? bgColor + '60' : colors.lightGray, borderRadius: 4 }} />
                    );
                  })}
              </View>
            </View>
          </View>

          {/* Top Triggers */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Top Triggers</ThemedText>
            {[
              { trigger: 'Stress', percentage: 67, color: 'stress' as const },
              { trigger: 'Sleep Deprivation', percentage: 54, color: 'sleep' as const },
              { trigger: 'Weather Changes', percentage: 42, color: 'warning' as const },
              { trigger: 'Caffeine', percentage: 31, color: 'meals' as const },
            ].map((item, i) => (
              <View key={i} style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontWeight: '600' }}>{item.trigger}</ThemedText>
                  <View style={{ backgroundColor: colors.lightGray, height: 6, borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
                    <View style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: colors[item.color], borderRadius: 3 }} />
                  </View>
                </View>
                <Text style={{ fontWeight: '700', color: colors.primary, marginLeft: 12 }}>{item.percentage}%</Text>
              </View>
            ))}
          </View>

          {/* Insights */}
          <View>
            <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Key Insights</ThemedText>
            <View style={{ backgroundColor: colors.primary + '10', borderColor: colors.primary, borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <MaterialIcons name="lightbulb" size={24} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontWeight: '600', marginBottom: 4 }}>Pattern Found</ThemedText>
                <ThemedText style={{ color: colors.darkGray, fontSize: 12 }}>Stress combined with irregular sleep increases migraine risk by 80%</ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
