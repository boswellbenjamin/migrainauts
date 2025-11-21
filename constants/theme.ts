/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0891B2"; // Primary teal (migraine-safe)
const tintColorDark = "#06B6D4";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FAFBFD",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    // Migraine app specific
    primary: "#2596BE",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    danger: "#DC2626",
    card: "#FFFFFF",
    border: "#E5E7EB",
    lightGray: "#F3F4F6",
    mediumGray: "#D1D5DB",
    darkGray: "#6B7280",
    // Tracking colors
    sleep: "#3B82F6",
    water: "#06B6D4",
    meals: "#8B5CF6",
    activity: "#EC4899",
    stress: "#EF4444",
    mood: "#F59E0B",
    symptoms: "#DC2626",
    medicine: "#A855F7",
  },
  dark: {
    text: "#ECEDEE",
    background: "#0F1419",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // Migraine app specific
    primary: "#06B6D4",
    success: "#059669",
    warning: "#D97706",
    error: "#F87171",
    danger: "#EF4444",
    card: "#1F2937",
    border: "#374151",
    lightGray: "#2D3748",
    mediumGray: "#4B5563",
    darkGray: "#9CA3AF",
    // Tracking colors
    sleep: "#60A5FA",
    water: "#22D3EE",
    meals: "#A78BFA",
    activity: "#F472B6",
    stress: "#F87171",
    mood: "#FBBF24",
    symptoms: "#F87171",
    medicine: "#C084FC",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
