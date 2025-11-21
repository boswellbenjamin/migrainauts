# Migrainauts Setup Guide

## What We Just Built

You now have a complete data layer and AI integration for your migraine tracking app! Here's what's ready:

### ✅ Completed

1. **Data Layer Structure**
   - TypeScript types for all data models ([lib/types/index.ts](lib/types/index.ts))
   - AsyncStorage utilities for data persistence ([lib/storage/index.ts](lib/storage/index.ts))
   - CSV parser to load your event_dump.csv data ([lib/utils/csv-parser.ts](lib/utils/csv-parser.ts))
   - React Context for global data access ([lib/context/DataContext.tsx](lib/context/DataContext.tsx))

2. **Real Data Integration**
   - Your CSV file (8,146 rows) is now being parsed
   - Extracts: migraine events, activity tracking, stress levels, food intake
   - Dashboard now uses real data instead of mock data
   - Migraine indicators (red dots) now show actual migraine days

3. **AI Integration (Replicate)**
   - AI service setup ([lib/api/replicate.ts](lib/api/replicate.ts))
   - Functions for:
     - Daily insights generation
     - Pattern analysis
     - AI chat assistant
   - Mock responses included for demo without API key

4. **Dashboard Updates**
   - Connected to real data via `useData()` hook
   - Loading and error states
   - Pull-to-refresh with real data
   - Shows actual migraine history

### 📦 Installed Packages

- `papaparse` - CSV parsing
- `@react-native-async-storage/async-storage` - Data persistence
- `replicate` - AI integration (already installed)

## Next Steps

### 1. Test the App

```bash
npm start
```

The app will:
1. Load your CSV data on first launch
2. Parse 8,146 rows of event data
3. Store it in AsyncStorage
4. Display real migraine days in the calendar

### 2. Add Replicate API Key (Optional)

If you want real AI instead of mock responses:

1. Get an API token from https://replicate.com/account/api-tokens
2. Create a `.env` file:
```bash
cp .env.example .env
```
3. Add your token:
```
EXPO_PUBLIC_REPLICATE_API_TOKEN=r8_your_token_here
```

### 3. What's Available Now

#### In Any Component:
```typescript
import { useData } from "@/lib/context/DataContext";

function MyComponent() {
  const {
    migraines,           // All migraine events
    dayData,             // Daily summaries
    trackingEntries,     // All tracking data
    loading,             // Loading state
    error,               // Error state
    refreshData,         // Refresh function
    addMigraine,         // Add new migraine
    addTrackingEntry,    // Add tracking entry
  } = useData();
}
```

#### For AI Features:
```typescript
import { generateDailyInsight, chatWithAI } from "@/lib/api/replicate";

// Generate daily insight
const insight = await generateDailyInsight(dayData, migraines);

// Chat with AI
const response = await chatWithAI(userMessage, history, {
  migraines,
  dayData,
});
```

### 4. Your Data Structure

The CSV has been parsed into:

**Migraine Events** (type: `MigrainEvent`)
- Date, time, severity
- Symptoms (e.g., "Pulsating pain", "Nausea")
- Triggers (e.g., "Heat", "Stress", "Sleep deprivation")
- Medication info

**Tracking Data** (type: `AnyTrackingEntry`)
- Activity (walking, sitting, cycling, etc.)
- Stress levels (low/medium/high)
- Food intake (breakfast, lunch, dinner)

**Day Summaries** (type: `DayData`)
- Has migraine? (boolean)
- All tracking entries for that day
- Count of tracked items

### 5. Potential Issues & Fixes

**Issue: CSV not loading**
- The app tries to load the CSV as an asset
- If it fails, check the console for errors
- Alternative: We can load it differently (from bundle, or pre-process it)

**Issue: Type errors**
- Run: `npm run lint` to check
- Types are all defined in `lib/types/index.ts`

**Issue: Data not persisting**
- AsyncStorage should work automatically
- Check console for storage errors
- Can clear data: Import `clearAllData()` from `lib/storage`

### 6. What to Build Next

Now that you have real data, you can:

1. **Update the Chat Screen** - Connect to AI assistant
2. **Build Patterns Screen** - Show migraine patterns from real data
3. **Enhance Tracking** - Save new tracking entries to storage
4. **Add Statistics** - Calculate real stats from your data:
   - Days since last migraine
   - Most common triggers
   - Migraine frequency trends

## File Structure

```
lib/
├── types/
│   └── index.ts          # All TypeScript types
├── storage/
│   └── index.ts          # AsyncStorage functions
├── context/
│   └── DataContext.tsx   # React Context provider
├── api/
│   └── replicate.ts      # AI integration
└── utils/
    └── csv-parser.ts     # CSV parsing logic

data/
└── mock/
    └── event_dump.csv    # Your data (8,146 rows)

app/
├── _layout.tsx           # Wrapped with DataProvider
└── (tabs)/
    └── index.tsx         # Updated dashboard with real data
```

## Testing Checklist

- [ ] App starts without errors
- [ ] Loading screen appears briefly
- [ ] Dashboard shows real migraine days (red dots)
- [ ] Pull-to-refresh works
- [ ] Console shows: "Loaded X migraines, Y tracking entries"
- [ ] Days with migraines show red dots
- [ ] Calendar shows last 30 days

## Need Help?

- Check the console for errors
- Data loading happens in `DataContext.tsx` line 49-78
- CSV parsing logic in `csv-parser.ts`
- Dashboard rendering in `index.tsx` line 115-137

## Summary

You're now set up with:
- ✅ Real data loaded from your CSV
- ✅ Data persistence with AsyncStorage
- ✅ AI integration ready (with mock fallback)
- ✅ Dashboard showing real migraine history
- ✅ Type-safe data models throughout

The hard part is done! Now you can focus on building features with real data.
