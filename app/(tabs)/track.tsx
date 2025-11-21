import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TrackScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'vitals',
      label: 'Vitals',
      icon: 'heart-pulse',
      iconFamily: 'community' as const,
      color: '#ef4444',
      bgColor: '#fee2e2',
      items: [
        { name: 'Sleep', icon: 'sleep', iconFamily: 'community' },
        { name: 'Water', icon: 'water', iconFamily: 'community' },
        { name: 'Heart Rate', icon: 'heart-pulse', iconFamily: 'community' },
      ],
    },
    {
      id: 'lifestyle',
      label: 'Lifestyle',
      icon: 'run',
      iconFamily: 'community' as const,
      color: '#3b82f6',
      bgColor: '#dbeafe',
      items: [
        { name: 'Exercise', icon: 'dumbbell', iconFamily: 'community' },
        { name: 'Stress Level', icon: 'emoticon-stressed', iconFamily: 'community' },
        { name: 'Meditation', icon: 'meditation', iconFamily: 'community' },
      ],
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: 'food-apple',
      iconFamily: 'community' as const,
      color: '#10b981',
      bgColor: '#d1fae5',
      items: [
        { name: 'Breakfast', icon: 'coffee', iconFamily: 'community' },
        { name: 'Lunch', icon: 'food', iconFamily: 'community' },
        { name: 'Dinner', icon: 'silverware-fork-knife', iconFamily: 'community' },
        { name: 'Snacks', icon: 'food-apple', iconFamily: 'community' },
      ],
    },
    {
      id: 'symptoms',
      label: 'Symptoms',
      icon: 'alert-circle',
      iconFamily: 'community' as const,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      items: [
        { name: 'Pain Level', icon: 'flash', iconFamily: 'community' },
        { name: 'Nausea', icon: 'emoticon-sick', iconFamily: 'community' },
        { name: 'Light Sensitivity', icon: 'weather-sunny', iconFamily: 'community' },
        { name: 'Sound Sensitivity', icon: 'volume-high', iconFamily: 'community' },
      ],
    },
  ];

  const IconComponent = ({ iconFamily, name, size, color }: any) => {
    return iconFamily === 'community' ? (
      <MaterialCommunityIcons name={name} size={size} color={color} />
    ) : (
      <MaterialIcons name={name} size={size} color={color} />
    );
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <ThemedText className="text-3xl font-bold mb-1">
          Quick Track
        </ThemedText>
        <ThemedText className="text-gray-600 dark:text-gray-400 text-sm">
          Log your daily activities
        </ThemedText>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20, paddingTop: 20 }}
      >
        {categories.map(category => (
          <View key={category.id} className="mb-4">
            <TouchableOpacity
              onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4"
              style={{
                borderWidth: 1,
                borderColor: expandedCategory === category.id ? category.color : colors.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4 flex-1">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{
                      backgroundColor: colorScheme === 'dark' ? category.color + '30' : category.bgColor
                    }}
                  >
                    <IconComponent
                      iconFamily={category.iconFamily}
                      name={category.icon}
                      size={24}
                      color={category.color}
                    />
                  </View>
                  <View className="flex-1">
                    <ThemedText className="text-lg font-semibold">{category.label}</ThemedText>
                    <ThemedText className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {category.items.length} items
                    </ThemedText>
                  </View>
                </View>
                <MaterialIcons
                  name={expandedCategory === category.id ? 'expand-less' : 'expand-more'}
                  size={28}
                  color={category.color}
                />
              </View>
            </TouchableOpacity>

            {expandedCategory === category.id && (
              <View
                className="bg-white dark:bg-slate-800 rounded-2xl mt-2 overflow-hidden"
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                {category.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.name}
                    className="flex-row items-center justify-between p-4"
                    style={{
                      borderBottomWidth: index < category.items.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                    }}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{
                          backgroundColor: colorScheme === 'dark' ? category.color + '20' : category.bgColor
                        }}
                      >
                        <IconComponent
                          iconFamily={item.iconFamily}
                          name={item.icon}
                          size={20}
                          color={category.color}
                        />
                      </View>
                      <ThemedText className="text-base font-medium">{item.name}</ThemedText>
                    </View>
                    <View
                      className="w-9 h-9 rounded-lg items-center justify-center"
                      style={{ backgroundColor: category.color }}
                    >
                      <MaterialIcons name="add" size={22} color="white" />
                    </View>
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
