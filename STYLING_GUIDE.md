# Styling Guide - Nativewind & Inline Styles

## Overview

The app uses a **hybrid approach**:
- **Inline styles** for layout (flexbox, positioning)
- **Theme constants** for colors
- **Nativewind ready** for future Tailwind utility classes

## Current Styling Pattern

### 1. Colors - Always Use Theme Constants

**DO:**
```tsx
import { Colors } from '@/constants/theme';
const { colors } = useColorScheme();

<View style={{ backgroundColor: colors.primary }}>
```

**DON'T:**
```tsx
<View style={{ backgroundColor: '#6B5FFF' }}>
```

### 2. Layout - Inline Flexbox Styles

```tsx
// Row layout
<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>

// Column layout (default)
<View style={{ gap: 12, paddingHorizontal: 20 }}>

// Centered
<View style={{ justifyContent: 'center', alignItems: 'center' }}>

// Fill space
<View style={{ flex: 1 }}>
```

### 3. Spacing - Use Consistent Values

```tsx
// Standard padding
paddingHorizontal: 20,  // Main horizontal padding
paddingVertical: 16,    // Main vertical padding
padding: 12,            // Card/inner padding

// Standard gaps
gap: 12,    // Section spacing
gap: 8,     // Item spacing
```

### 4. Border Radius - Size Based

```tsx
borderRadius: 12,   // Cards, large buttons
borderRadius: 10,   // Icon containers
borderRadius: 8,    // Smaller elements
borderRadius: 4,    // Minimal borders
```

## Common Patterns

### Card Component

```tsx
<View
  style={{
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  }}
>
  {/* content */}
</View>
```

### Button - Primary

```tsx
<TouchableOpacity
  style={{
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Text style={{ color: '#fff', fontWeight: '600' }}>Click me</Text>
</TouchableOpacity>
```

### Button - Secondary

```tsx
<TouchableOpacity
  style={{
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <ThemedText style={{ fontWeight: '600' }}>Click me</ThemedText>
</TouchableOpacity>
```

### Icon Container

```tsx
<View
  style={{
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary + '20',  // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <MaterialIcons name="icon-name" size={20} color={colors.primary} />
</View>
```

### Grid Layout (4 columns)

```tsx
<View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  }}
>
  {items.map(item => (
    <View
      key={item.id}
      style={{
        width: '23%',  // 4 columns with gap
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: colors.card,
      }}
    >
      {/* content */}
    </View>
  ))}
</View>
```

### Header with Action

```tsx
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
  }}
>
  <View>
    <ThemedText style={{ fontSize: 28, fontWeight: '700' }}>Title</ThemedText>
    <ThemedText style={{ color: colors.darkGray, marginTop: 4 }}>Subtitle</ThemedText>
  </View>
  <TouchableOpacity>
    <MaterialIcons name="settings" size={24} color={colors.primary} />
  </TouchableOpacity>
</View>
```

## Color Usage

### Status Colors
```tsx
// Success state
backgroundColor: colors.success

// Warning state
backgroundColor: colors.warning

// Error/Alert
backgroundColor: colors.error

// Disabled/Neutral
backgroundColor: colors.lightGray
```

### Tracking Category Colors
```tsx
// Get color from tracking item
const trackingColors = {
  sleep: colors.sleep,
  water: colors.water,
  meals: colors.meals,
  activity: colors.activity,
  stress: colors.stress,
  mood: colors.mood,
  symptoms: colors.symptoms,
  medicine: colors.medicine,
}

// Use with opacity
backgroundColor: colors.primary + '20'  // 20% opacity
backgroundColor: colors.primary + '40'  // 40% opacity
```

## Font Weights

```tsx
fontWeight: '700'  // Bold (section headers)
fontWeight: '600'  // Semi-bold (labels)
fontWeight: '500'  // Medium (body emphasis)
fontWeight: '400'  // Regular (default body text)
```

## Shadows (iOS/Android)

```tsx
// Card shadow
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,

// Strong shadow (FAB)
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 8,
elevation: 8,
```

## Opacity Technique

For semi-transparent backgrounds:
```tsx
// 20% opacity (lighter)
backgroundColor: colors.primary + '20'

// 40% opacity (medium)
backgroundColor: colors.primary + '40'

// 60% opacity (darker)
backgroundColor: colors.primary + '60'

// 80% opacity (very dark)
backgroundColor: colors.primary + '80'
```

Note: This appends hex alpha value. `'20'` = 32 in decimal = ~12% opacity in hex terms, but typically used as shown above.

## Text Styling

```tsx
// Large header
style={{ fontSize: 28, fontWeight: '700', marginBottom: 4 }}

// Section header
style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}

// Body text
style={{ fontSize: 14, color: colors.text }}

// Small text
style={{ fontSize: 12, color: colors.darkGray }}

// Extra small
style={{ fontSize: 11, color: colors.mediumGray }}
```

## Responsive Layout Tips

### Mobile-First Widths
```tsx
// Full width with padding
width: '100%',
paddingHorizontal: 20,

// Half width (for 2-column)
width: '48%',

// Quarter width (for 4-column)
width: '23%',  // 25% minus gap allowance

// Flex grow
flex: 1,
```

### Aspect Ratios
```tsx
// Square items
aspectRatio: 1

// 16:9
aspectRatio: 16 / 9

// 3:2
aspectRatio: 1.5
```

## Common Layout Bugs & Fixes

### Content Overflowing
```tsx
// ❌ Content hidden under tab bar
<View style={{ paddingBottom: 0 }}>

// ✅ Add bottom padding
<ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
```

### Misaligned Items
```tsx
// ❌ Items not aligned
<View style={{ gap: 12 }}>

// ✅ Proper flex alignment
<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
```

### Overlapping Elements
```tsx
// ❌ FAB overlapping content
<View style={{ position: 'absolute', bottom: 0 }}>

// ✅ Position with proper spacing
<View style={{ position: 'absolute', bottom: 90, right: 20 }}>
```

## Migrating to Nativewind (Future)

When ready to use Tailwind utilities:

```tsx
// Before (inline styles)
<View style={{ flex: 1, backgroundColor: colors.primary, paddingHorizontal: 20 }}>

// After (nativewind)
<View className="flex-1 bg-primary px-5">

// Mixed (hybrid - during transition)
<View style={{ flex: 1 }} className="bg-primary px-5">
```

## Theme Constants Reference

```typescript
// From theme.ts
Colors.light / Colors.dark {
  text: string
  background: string
  primary: string
  success: string
  warning: string
  error: string
  danger: string
  card: string
  border: string
  lightGray: string
  mediumGray: string
  darkGray: string
  // Tracking colors...
  sleep: string
  water: string
  meals: string
  activity: string
  stress: string
  mood: string
  symptoms: string
  medicine: string
}
```

---

**Use this guide as reference when styling new components. Keep it consistent!**

