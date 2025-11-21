import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons } from '@expo/vector-icons';

export default function TrackScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'vitals',
      label: 'Vitals',
      icon: 'favorite',
      items: ['Sleep', 'Water', 'Heart Rate'],
    },
    {
      id: 'lifestyle',
      label: 'Lifestyle',
      icon: 'fitness-center',
      items: ['Exercise', 'Stress Level', 'Meditation'],
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: 'restaurant',
      items: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    },
    {
      id: 'symptoms',
      label: 'Symptoms',
      icon: 'warning',
      items: ['Pain', 'Nausea', 'Sensitivity'],
    },
  ];

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.card, borderBottomColor: colors.border, borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 16 }}>
        <ThemedText style={{ fontSize: 24, fontWeight: '700' }}>Quick Track</ThemedText>
        <ThemedText style={{ color: colors.darkGray, fontSize: 14, marginTop: 4 }}>Log your daily activities</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20, paddingTop: 16 }}>
        {categories.map(category => (
          <View key={category.id} style={{ marginBottom: 12 }}>
            <TouchableOpacity onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)} style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                <MaterialIcons name={category.icon as any} size={24} color={colors.primary} />
                <ThemedText style={{ fontWeight: '600', flex: 1 }}>{category.label}</ThemedText>
              </View>
              <MaterialIcons name={expandedCategory === category.id ? 'expand-less' : 'expand-more'} size={24} color={colors.darkGray} />
            </TouchableOpacity>

            {expandedCategory === category.id && (
              <View style={{ backgroundColor: colors.card, borderLeftColor: colors.border, borderRightColor: colors.border, borderBottomColor: colors.border, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                {category.items.map((item, index) => (
                  <TouchableOpacity key={item} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderBottomColor: colors.border, borderBottomWidth: index < category.items.length - 1 ? 1 : 0 }}>
                    <ThemedText>{item}</ThemedText>
                    <MaterialIcons name="add" size={20} color={colors.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
