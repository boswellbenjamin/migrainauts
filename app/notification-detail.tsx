import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import NotificationService from "@/lib/services/notification-service";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function NotificationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const notification = NotificationService.getNotification(id);

  useEffect(() => {
    if (notification && !notification.read) {
      NotificationService.markAsRead(id);
    }
  }, [id, notification]);

  if (!notification) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialIcons
          name="notifications-off"
          size={64}
          color={colors.mediumGray}
        />
        <ThemedText className="mt-4 text-gray-500">
          Notifikation hittades inte
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-teal-500 px-6 py-3 rounded-xl"
        >
          <ThemedText className="text-white font-semibold">
            Gå tillbaka
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const getIcon = () => {
    switch (notification.type) {
      case "predictive_warning":
        return "warning";
      case "early_pattern":
        return "lightbulb";
      case "positive_reinforcement":
        return "celebration";
      case "check_in":
        return "notification-important";
      case "tracking_reminder":
        return "edit-note";
      case "weather_warning":
        return "cloud";
      default:
        return "notifications";
    }
  };

  const getIconColor = () => {
    switch (notification.priority) {
      case "critical":
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-5 pt-14 pb-4">
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 12 }}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText className="text-2xl font-bold flex-1">
            Notifikation
          </ThemedText>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        {/* Icon and Title */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: getIconColor() + "20",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MaterialIcons
              name={getIcon() as any}
              size={40}
              color={getIconColor()}
            />
          </View>
          <ThemedText className="text-2xl font-bold text-center mb-2">
            {notification.title}
          </ThemedText>
          <ThemedText className="text-base text-gray-600 dark:text-gray-400 text-center">
            {notification.body}
          </ThemedText>
        </View>

        {/* Details */}
        {notification.details && (
          <>
            {/* Explanation */}
            {notification.details.explanation && (
              <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
                <ThemedText className="text-base leading-6">
                  {notification.details.explanation}
                </ThemedText>
              </View>
            )}

            {/* Timeline */}
            {notification.details.timeline &&
              notification.details.timeline.length > 0 && (
                <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
                  <ThemedText className="text-lg font-semibold mb-4">
                    Your day so far
                  </ThemedText>
                  {notification.details.timeline.map((item, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: "row", marginBottom: 12 }}
                    >
                      <View style={{ marginRight: 12, alignItems: "center" }}>
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: item.isNormal
                              ? colors.primary
                              : "#ef4444",
                          }}
                        />
                        {index < notification.details!.timeline!.length - 1 && (
                          <View
                            style={{
                              width: 2,
                              flex: 1,
                              backgroundColor: colors.border,
                              marginVertical: 4,
                            }}
                          />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <ThemedText className="text-sm font-semibold">
                          {item.time}
                        </ThemedText>
                        <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                          {item.activity}
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                </View>
              )}

            {/* Triggers */}
            {notification.details.triggers &&
              notification.details.triggers.length > 0 && (
                <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
                  <ThemedText className="text-lg font-semibold mb-4">
                    Factors
                  </ThemedText>
                  {notification.details.triggers.map((trigger, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: trigger.active
                          ? "#fef3c7"
                          : colors.lightGray,
                        borderRadius: 8,
                      }}
                    >
                      <MaterialIcons
                        name={trigger.active ? "check-circle" : "cancel"}
                        size={20}
                        color={trigger.active ? "#f59e0b" : colors.mediumGray}
                        style={{ marginRight: 8 }}
                      />
                      <ThemedText className="text-sm flex-1">
                        {trigger.name}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}

            {/* Actions */}
            {notification.details.actions &&
              notification.details.actions.length > 0 && (
                <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
                  <ThemedText className="text-lg font-semibold mb-4">
                    Recommended actions
                  </ThemedText>
                  {notification.details.actions.map((action, index) => (
                    <TouchableOpacity
                      key={action.id}
                      className={`p-4 rounded-xl mb-3 ${
                        action.type === "primary"
                          ? "bg-teal-500"
                          : "bg-gray-100 dark:bg-slate-700"
                      }`}
                      style={{
                        borderWidth: action.type === "secondary" ? 1 : 0,
                        borderColor: colors.border,
                      }}
                    >
                      <ThemedText
                        className={`text-center font-semibold ${
                          action.type === "primary" ? "text-white" : ""
                        }`}
                      >
                        {action.title}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            {/* Confidence */}
            {notification.details.confidence !== undefined && (
              <View className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 mb-4">
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <ThemedText className="text-sm font-semibold">
                    Confidence level
                  </ThemedText>
                  <ThemedText className="text-sm font-semibold">
                    {Math.round(notification.details.confidence * 100)}%
                  </ThemedText>
                </View>
                <View
                  style={{
                    height: 8,
                    backgroundColor: colors.lightGray,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${notification.details.confidence * 100}%`,
                      backgroundColor: colors.primary,
                    }}
                  />
                </View>
                <ThemedText className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Based on {notification.details.dataPoints?.length || 0} data
                  points
                </ThemedText>
              </View>
            )}

            {/* Data Points */}
            {notification.details.dataPoints &&
              notification.details.dataPoints.length > 0 && (
                <View className="bg-gray-100 dark:bg-slate-700/50 rounded-xl p-4">
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <MaterialIcons
                      name="info"
                      size={16}
                      color={colors.darkGray}
                      style={{ marginRight: 6 }}
                    />
                    <ThemedText className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      Why am I seeing this?
                    </ThemedText>
                  </View>
                  {notification.details.dataPoints.map((point, index) => (
                    <ThemedText
                      key={index}
                      className="text-xs text-gray-600 dark:text-gray-400 mb-1"
                    >
                      • {point}
                    </ThemedText>
                  ))}
                </View>
              )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
