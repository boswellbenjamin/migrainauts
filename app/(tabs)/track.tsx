import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
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
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ThemedText type="title">Quick Track</ThemedText>
        <ThemedText style={{ color: colors.darkGray, marginTop: 4 }}>
          Log your daily activities
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.content}>
          {categories.map(category => (
            <View key={category.id} style={{ marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
                style={[
                  styles.categoryHeader,
                  {
                    backgroundColor: colors.card,
                    borderBottomColor: colors.border,
                    borderBottomWidth: expandedCategory === category.id ? 1 : 0,
                  },
                ]}
              >
                <MaterialIcons name={category.icon as any} size={24} color={colors.primary} />
                <ThemedText style={{ flex: 1, fontWeight: '600', marginLeft: 12 }}>
                  {category.label}
                </ThemedText>
                <MaterialIcons
                  name={expandedCategory === category.id ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={colors.darkGray}
                />
              </TouchableOpacity>

              {expandedCategory === category.id && (
                <View style={[styles.categoryItems, { backgroundColor: colors.card }]}>
                  {category.items.map((item, index) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.item,
                        {
                          borderBottomColor: colors.border,
                          borderBottomWidth: index < category.items.length - 1 ? 1 : 0,
                        },
                      ]}
                    >
                      <ThemedText>{item}</ThemedText>
                      <MaterialIcons name="add" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  categoryItems: {
    borderRadius: 12,
    marginTop: -4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
});

