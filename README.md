# Migrainauts - Migraine Tracking App

A clean, professional, and user-friendly mobile application for tracking migraine patterns, triggers, and symptoms. Built with React Native, Expo, and TypeScript.

## 🎯 Project Overview

Migrainauts is a comprehensive migraine tracking application designed to help users understand their migraine patterns through data-driven insights and AI-powered recommendations. The app focuses on:

- **Quick Tracking**: Log daily health metrics in seconds
- **Pattern Recognition**: AI analyzes your data to identify triggers
- **Predictive Alerts**: Get warnings before migraines are likely to occur
- **Detailed Logging**: Comprehensive migraine logging with severity, symptoms, and triggers
- **AI Chat Assistant**: Ask questions about your data and get personalized insights

## 🏗️ Project Structure

```
migrainauts/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation setup
│   │   ├── index.tsx            # Dashboard (home screen)
│   │   ├── track.tsx            # Quick tracking screen
│   │   ├── insights.tsx         # Pattern analysis screen
│   │   ├── chat.tsx             # AI assistant screen
│   │   ├── profile.tsx          # User profile & settings
│   │   └── log-migraine.tsx     # Detailed migraine logging
│   ├── _layout.tsx
│   └── modal.tsx
├── components/
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
│       └── ...
├── constants/
│   └── theme.ts                 # Color palette & design tokens
├── hooks/
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
└── assets/
    └── images/
```

## 🎨 Design System

### Color Palette

**Primary Colors:**
- Primary Purple: `#6B5FFF`
- Success Green: `#10B981`
- Warning Orange: `#F59E0B`
- Error Red: `#EF4444`
- Danger: `#DC2626`

**Tracking Categories (each has unique color):**
- Sleep: `#3B82F6` (Blue)
- Water: `#06B6D4` (Cyan)
- Meals: `#8B5CF6` (Purple)
- Activity: `#EC4899` (Pink)
- Stress: `#EF4444` (Red)
- Mood: `#F59E0B` (Yellow)
- Symptoms: `#DC2626` (Dark Red)
- Medicine: `#A855F7` (Violet)

### Design Principles

1. **UX First**: Every component prioritizes user experience
2. **Clean & Professional**: Minimal but purposeful design
3. **Playful**: Subtle animations and interactions keep users engaged
4. **Minimal Emoji**: Only essential icons, no excessive emoji use
5. **Consistent Spacing**: 8px and 16px base units for rhythm
6. **Accessible**: Readable contrast, clear touch targets (min 44x44pt)

## 📱 Screens

### 1. Dashboard (Home)
- **Day Selector**: Horizontal scroll through past 30 days
- **Today's Stats**: Days since migraine, migraines this month, streak
- **Quick Track Grid**: 8 quick-access tracking items (2x4 grid)
- **Pattern Insights**: AI-generated insights about user patterns
- **Top Trigger**: Visual card showing user's primary migraine trigger
- **FAB Button**: Red floating action button to log migraines

### 2. Quick Track
- **Category-based Tracking**: Organized by categories (Vitals, Lifestyle, Nutrition, Symptoms)
- **Expandable Categories**: Tap to reveal specific tracking items
- **Flexible Logging**: Quick tap or long press for detailed entry

### 3. Pattern Analysis (Insights)
- **Time Period Selector**: Week / Month / Year
- **Calendar Heatmap**: Visual calendar showing migraine intensity
- **Top Triggers**: Ranked list with percentage correlations
- **Key Insights**: AI-powered pattern discoveries

### 4. AI Chat Assistant
- **Conversational Interface**: Chat UI with user (right, blue) and AI (left, gray) messages
- **Quick Reply Buttons**: Pre-suggested questions for first-time users
- **Natural Conversation**: Asks about data, triggers, and recommendations

### 5. User Profile
- **Profile Information**: Name, age, migraine history
- **Quick Stats**: Migraines, days tracked, current streak
- **Personal Settings**: Notifications, appearance, language
- **Data Management**: Export, backup, clear data options
- **Support**: FAQ, bug reports, about page

### 6. Log Migraine (Modal)
**5-Step Flow:**
1. **Confirm**: Are you having a migraine now?
2. **Time**: When did it start?
3. **Intensity**: Rate severity (1-10)
4. **Symptoms**: Select symptoms (multi-select)
5. **Success**: Confirmation with summary

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or Expo Go app on phone)

### Installation

```bash
# Navigate to project directory
cd migrainauts

# Install dependencies
npm install

# Start the dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### First Time Setup

1. Start the app - you'll see the Dashboard
2. Tap the red FAB button to log your first migraine
3. Follow the 5-step wizard to complete logging
4. Explore the other tabs to familiarize yourself with the features
5. Visit Profile to customize preferences

## 🔄 Navigation

**Bottom Tab Bar (5 Tabs):**
1. **Home** - Dashboard with daily overview
2. **Track** - Quick logging interface
3. **Patterns** - Analytics and insights
4. **Chat** - AI assistant
5. **Profile** - Settings and profile management

**Modal Flows:**
- Tap FAB button → Log Migraine wizard (5 steps)
- Various settings screens accessible from Profile tab

## 💡 Key Features

### Dashboard
- ✅ Day selector with migraine indicators
- ✅ Quick stats cards (days since migraine, monthly count, streak)
- ✅ 8-item quick track grid with visual feedback
- ✅ AI insights panel
- ✅ Top trigger card
- ✅ Pull-to-refresh functionality
- ✅ Red FAB for migraine logging

### Quick Track
- ✅ Category-based organization
- ✅ Expandable/collapsible categories
- ✅ One-tap quick logging
- ✅ Long-press for detailed entry

### Insights
- ✅ Calendar heatmap visualization
- ✅ Top triggers with percentages
- ✅ Time period selector (week/month/year)
- ✅ AI pattern detection

### Chat
- ✅ Conversational message interface
- ✅ Quick reply suggestions
- ✅ Simulated AI responses (ready for Claude API integration)

### Profile
- ✅ User information display
- ✅ Quick stats overview
- ✅ Preference toggles (notifications, dark mode)
- ✅ Settings organized in sections
- ✅ Data export/backup options

## 🔮 Future Features

Based on the Obsidian vault specifications:

- [ ] Voice input for AI chat
- [ ] Migraine Rewind (48-hour timeline analysis)
- [ ] Community features (stories, tips, Q&A)
- [ ] Calendar integration (Google Calendar, iCloud)
- [ ] Weather integration (SMHI/OpenWeather)
- [ ] Gamification (badges, achievements, challenges)
- [ ] Apple Watch & Wear OS apps
- [ ] Smart notifications & AI predictions
- [ ] Educational library/wiki
- [ ] Advanced analytics (PDF reports, trends)

## 🎨 Styling Guide

### Component Patterns

**Cards:**
```tsx
style={[
  styles.card,
  { 
    backgroundColor: colors.card,
    borderColor: colors.border 
  }
]}
```

**Buttons:**
- Primary (CTA): `backgroundColor: colors.primary`
- Secondary: `backgroundColor: colors.card, borderColor: colors.border`
- Danger: `backgroundColor: colors.error`

**Typography:**
- Title: `type="title"` (fontSize: 28, fontWeight: '700')
- Subtitle: `type="subtitle"` (fontSize: 16, fontWeight: '600')
- Body: Default (fontSize: 14)
- Small: `fontSize: 12`

## 📦 Dependencies

Key packages:
- `expo-router` - Navigation
- `react-native-reanimated` - Animations
- `expo-haptics` - Haptic feedback
- `@expo/vector-icons` - Material Icons

## 🔐 State Management (Future)

Currently using React `useState` hooks. For scaling, consider:
- Redux Toolkit + Redux Persist
- Zustand
- React Context API

## 💾 Data Storage (Future)

Currently using mock data. For production:
- SQLite (local storage)
- Firebase Firestore (cloud sync)
- Realm (offline-first)

## 🤖 AI Integration (Future)

Ready for integration with:
- Claude API (Anthropic)
- GPT-4 (OpenAI)
- Mistral API

System prompt template already prepared in Obsidian vault.

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📝 Git Workflow

```bash
# Feature branch
git checkout -b feature/feature-name

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/feature-name
```

## 🚨 Known Limitations

- Mock data only (no backend yet)
- AI chat is simulated (needs API integration)
- No offline persistence yet
- No image/voice storage
- No cross-device sync yet

## 📞 Support

For questions or issues:
1. Check the FAQ in Profile → Settings
2. Create a GitHub issue
3. Contact the development team

## 📄 License

[Your License Here]

## 👥 Team

Built for Hackathon 2025 by the Migrainauts team

---

**Happy tracking! Let's help people understand their migraines better. 🧠💜**
