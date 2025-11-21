import React, { useState } from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  Text,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

interface DayData {
  date: Date;
  hasMigraine: boolean;
  trackedItems: number;
}

interface TrackingItem {
  id: string;
  label: string;
  icon: string;
  iconFamily: 'material' | 'community';
  color: keyof typeof Colors.light;
  tracked: boolean;
  value?: string;
}

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [refreshing, setRefreshing] = useState(false);

  const [trackingData, setTrackingData] = useState<TrackingItem[]>([
    { id: 'sleep', label: 'Sleep', icon: 'nights-stay', iconFamily: 'material', color: 'sleep', tracked: true, value: '7h 30m' },
    { id: 'water', label: 'Water', icon: 'water-drop', iconFamily: 'community', color: 'water', tracked: false },
    { id: 'meals', label: 'Meals', icon: 'silverware-fork-knife', iconFamily: 'community', color: 'meals', tracked: true, value: 'Breakfast, Lunch' },
    { id: 'activity', label: 'Activity', icon: 'directions-run', iconFamily: 'material', color: 'activity', tracked: false },
    { id: 'stress', label: 'Stress', icon: 'flash-on', iconFamily: 'material', color: 'stress', tracked: true, value: 'Medium' },
    { id: 'mood', label: 'Mood', icon: 'sentiment-satisfied', iconFamily: 'material', color: 'mood', tracked: false },
    { id: 'symptoms', label: 'Symptoms', icon: 'warning', iconFamily: 'material', color: 'symptoms', tracked: false },
    { id: 'medicine', label: 'Medicine', icon: 'pill', iconFamily: 'community', color: 'medicine', tracked: false },
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
    setTrackingData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, tracked: !item.tracked } : item
      )
    );
  };

  const Icon = ({ name, family, color, size = 24 }: any) => {
    const IconComponent = family === 'material' ? MaterialIcons : MaterialCommunityIcons;
    return <IconComponent name={name} size={size} color={color} />;
  };

  const trackedCount = trackingData.filter(item => item.tracked).length;

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <ThemedText style={{ fontSize: 28, fontWeight: '700', marginBottom: 4 }}>
              Migrainauts
            </ThemedText>
            <ThemedText style={{ color: colors.darkGray, fontSize: 14 }}>
              Track your journey
            </ThemedText>
          </View>
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.lightGray,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="notifications-none" size={24} color={colors.primary} />
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.error,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Day Selector - Horizontal Scroll */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
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
                  style={{
                    backgroundColor: isToday ? colors.primary : colors.card,
                    borderColor: isToday ? colors.primary : colors.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    width: 60,
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: isToday ? '#fff' : colors.darkGray }}>
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      marginVertical: 4,
                      color: isToday ? '#fff' : colors.text,
                    }}
                  >
                    {day.date.getDate()}
                  </Text>
                  {day.hasMigraine && (
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: isToday ? '#fff' : colors.error,
                        marginTop: 2,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Today&apos;s Overview
          </ThemedText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Stat Card 1 */}
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: colors.success + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name="calendar-today" size={20} color={colors.success} />
              </View>
              <ThemedText style={{ fontSize: 12, color: colors.darkGray, marginTop: 8 }}>
                Days since
              </ThemedText>
              <ThemedText style={{ fontSize: 24, fontWeight: '700', marginTop: 4 }}>
                12
              </ThemedText>
            </View>

            {/* Stat Card 2 */}
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: colors.warning + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name="trending-down" size={20} color={colors.warning} />
              </View>
              <ThemedText style={{ fontSize: 12, color: colors.darkGray, marginTop: 8 }}>
                This month
              </ThemedText>
              <ThemedText style={{ fontSize: 24, fontWeight: '700', marginTop: 4 }}>
                3
              </ThemedText>
            </View>

            {/* Stat Card 3 */}
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: colors.primary + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name="fire" size={20} color={colors.primary} />
              </View>
              <ThemedText style={{ fontSize: 12, color: colors.darkGray, marginTop: 8 }}>
                Streak
              </ThemedText>
              <ThemedText style={{ fontSize: 24, fontWeight: '700', marginTop: 4 }}>
                12d
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Tracking Grid */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>
            Quick Track ({trackedCount}/8)
          </ThemedText>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            {trackingData.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleTracking(item.id)}
                activeOpacity={0.7}
                style={{
                  width: '23%',
                  aspectRatio: 1,
                  backgroundColor: item.tracked ? colors[item.color] + '20' : colors.lightGray,
                  borderColor: item.tracked ? colors[item.color] : colors.border,
                  borderWidth: item.tracked ? 1.5 : 1,
                  borderRadius: 12,
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: item.tracked ? colors[item.color] : colors.mediumGray,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <Icon
                    name={item.icon}
                    family={item.iconFamily}
                    color={item.tracked ? '#fff' : colors.darkGray}
                    size={22}
                  />
                </View>
                <ThemedText style={{ fontSize: 11, fontWeight: '600', textAlign: 'center' }}>
                  {item.label}
                </ThemedText>
                {item.tracked && item.value && (
                  <ThemedText style={{ fontSize: 9, color: colors.darkGray, marginTop: 2, textAlign: 'center' }}>
                    {item.value}
                  </ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Insights */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Pattern Insights
          </ThemedText>
          <View
            style={{
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary,
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <MaterialIcons name="lightbulb" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '600', fontSize: 13, marginBottom: 4 }}>
                Stress + Skipped Meals = Risk
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: colors.darkGray, lineHeight: 18 }}>
                You&apos;re 80% more likely to get migraines when stressed without eating regularly.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Top Trigger */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <ThemedText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
            Top Trigger
          </ThemedText>
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                backgroundColor: colors.stress + '20',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialIcons name="flash-on" size={24} color={colors.stress} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '600', fontSize: 16 }}>Stress</ThemedText>
              <ThemedText style={{ color: colors.darkGray, fontSize: 12, marginTop: 2 }}>
                67% of your migraines
              </ThemedText>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
          </View>
        </View>
      </ScrollView>

      {/* FAB - Log Migraine */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 90,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.error,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
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
