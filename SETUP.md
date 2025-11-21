# Migrainauts - Setup & Development Guide

## ✅ What's Been Set Up

### Core Infrastructure
- ✅ React Native + Expo project structure
- ✅ TypeScript configuration
- ✅ Nativewind (Tailwind CSS for React Native)
- ✅ Color system & theme constants
- ✅ Bottom tab navigation (5 tabs)

### Screens Implemented
1. **Dashboard (Home)** - Main overview screen with:
   - Header with notification badge
   - Horizontal day selector (last 30 days with migraine indicators)
   - 3 stat cards (days since migraine, monthly count, streak)
   - 8-item quick track grid (2x4) with color coding
   - AI pattern insights card
   - Top trigger card
   - Red FAB button for logging migraines
   - Pull-to-refresh functionality

2. **Quick Track** - Collapsible category-based tracking
   - Vitals, Lifestyle, Nutrition, Symptoms categories
   - Expandable list items

3. **Pattern Analysis (Insights)** - Analytics dashboard
   - Time period selector (week/month/year)
   - Calendar heatmap visualization
   - Top triggers with percentage bars
   - AI insights panel

4. **AI Chat** - Conversational interface
   - User/AI message bubbles
   - Quick reply suggestions
   - Ready for Claude API integration

5. **User Profile** - Account management
   - Profile info display
   - Quick stats (migraines, days tracked, streak)
   - Settings with toggles
   - Data management options

### Design System
- **Color Palette**: 8 primary colors + 8 tracking category colors
- **Spacing**: Consistent 8px/16px base units
- **Typography**: Title, Subtitle, Body, Small text styles
- **Components**: Cards, buttons, tracking items with consistent styling
- **Accessibility**: Proper contrast ratios, 44x44pt min touch targets

### Technology Stack
```
React Native 0.81.5
Expo Router 6.0.15
TypeScript 5.9
Nativewind 4
Tailwind CSS
React Navigation 7
Expo Haptics (for haptic feedback)
@expo/vector-icons (Material Icons + Community Icons)
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Check for lint issues
npm run lint
```

## 📁 Project Structure

```
migrainauts/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation
│   │   ├── index.tsx            # Dashboard ✅
│   │   ├── track.tsx            # Quick track ✅
│   │   ├── insights.tsx         # Analytics ✅
│   │   ├── chat.tsx             # AI chat ✅
│   │   ├── profile.tsx          # Profile ✅
│   │   ├── log-migraine.tsx     # Migraine wizard (ready)
│   │   └── explore.tsx          # Placeholder
│   ├── _layout.tsx              # Root layout
│   └── modal.tsx                # Modal template
├── components/                  # Reusable components
├── constants/
│   └── theme.ts                 # Colors & design tokens ✅
├── hooks/                       # Custom hooks
├── global.css                   # Tailwind CSS entry ✅
├── tailwind.config.js           # Tailwind configuration ✅
└── package.json
```

## 🎨 Design Tokens (theme.ts)

### Primary Colors
- **Primary Purple**: `#6B5FFF` - Main brand color
- **Success Green**: `#10B981` - Positive indicators
- **Warning Orange**: `#F59E0B` - Caution/attention
- **Error Red**: `#EF4444` - Errors & danger
- **Dark Red**: `#DC2626` - Critical states

### Tracking Category Colors
Each tracking item has its own color:
- Sleep: `#3B82F6` (Blue)
- Water: `#06B6D4` (Cyan)
- Meals: `#8B5CF6` (Purple)
- Activity: `#EC4899` (Pink)
- Stress: `#EF4444` (Red)
- Mood: `#F59E0B` (Yellow)
- Symptoms: `#DC2626` (Dark Red)
- Medicine: `#A855F7` (Violet)

## 🎯 Key Features Implemented

### Dashboard
- ✅ Responsive layout with proper spacing
- ✅ Day selector with smooth scrolling
- ✅ Color-coded tracking grid
- ✅ Visual feedback on tracked items
- ✅ Stats displayed in cards
- ✅ AI insights panel
- ✅ Top trigger visualization
- ✅ FAB button for primary action
- ✅ Pull-to-refresh

### Navigation
- ✅ 5-tab bottom bar navigation
- ✅ Active/inactive tab styling
- ✅ Badge on chat tab (notification indicator)
- ✅ Proper haptic feedback on tap

### Styling
- ✅ Light & dark mode support
- ✅ Consistent color usage
- ✅ Proper contrast ratios
- ✅ Clean borders & spacing
- ✅ Professional appearance

## 📦 Nativewind Setup

Nativewind has been installed and configured to work with React Native:

```javascript
// tailwind.config.js - Custom color palette added
// global.css - Tailwind directives imported
// App now supports @apply and Tailwind classes
```

### Using Nativewind (for future styling)

Instead of inline styles, you can use Tailwind utility classes:

```tsx
<View className="flex-1 bg-slate-100 p-4">
  <Text className="text-lg font-bold text-slate-900">Hello</Text>
</View>
```

## 🔄 State Management

Currently using React `useState` hooks. For production, consider:
- Redux Toolkit + Redux Persist
- Zustand
- Jotai
- Recoil

## 💾 Data Persistence (Future)

Currently using mock data. Plan for:
- SQLite (local storage)
- Firebase Firestore (cloud sync)
- AsyncStorage (simple key-value)

## 🤖 AI Integration (Next Steps)

The app is ready for Claude API integration:

1. Create `services/ai.ts`:
```typescript
import Anthropic from "@anthropic-ai/sdk";

export async function chatWithAI(message: string) {
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      { role: "user", content: message }
    ]
  });
  return response;
}
```

2. Update chat.tsx to use the service

## 🧪 Testing

All lint checks pass ✅

```bash
npm run lint  # No errors
```

## 📝 Code Quality

- ✅ TypeScript strict mode enabled
- ✅ ESLint rules configured
- ✅ No unused imports
- ✅ Consistent code style
- ✅ Proper component exports

## 🎯 Next Tasks

1. **Log Migraine Screen**: Complete the 5-step wizard
2. **Data Integration**: Connect to backend API
3. **AI Chat**: Integrate Claude API
4. **Push Notifications**: Implement predictive alerts
5. **Calendar Integration**: Sync with Google/Apple Calendar
6. **Health App Integration**: Connect to Apple Health/Google Fit

## 🚨 Known Limitations

- Mock data only (no persistence)
- AI chat is simulated
- No backend integration yet
- Limited image/voice support

## 📞 Troubleshooting

### Build issues?
```bash
npm install
npm run lint
```

### Device not detected?
```bash
npm start
# Then press 'i' for iOS or 'a' for Android in the terminal
```

### Want to reset?
```bash
npm run reset-project
```

---

**Ready to start developing! The dashboard is complete and visually polished. 🚀**

