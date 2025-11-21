# Dashboard Layout Reference

## Screen Structure

```
┌─────────────────────────────────────┐
│  HEADER                             │
│  Migrainauts          🔔 [badge]   │
│  Track your journey                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  DAY SELECTOR (horizontal scroll)   │
│  [S][M][T][W]►[TH]←[F][Sa][Su]...   │
│   20  21  22  23   [24]  25  26      │
│             ●           (today)      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  TODAY'S OVERVIEW                   │
│  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │  12  │  │  3   │  │ 12d  │      │
│  │ Days │  │Month │  │Streak│      │
│  │ since│  │      │  │      │      │
│  └──────┘  └──────┘  └──────┘      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  QUICK TRACK (8/8)                  │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐              │
│  │⏤ │ │💧│ │🍽 │ │🏃│              │
│  │Sl│ │Wt│ │Ml│ │Ac│              │
│  │7h│ │  │ │Br│ │  │              │
│  └──┘ └──┘ └──┘ └──┘              │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐              │
│  │⚡│ │😐│ │⚠ │ │💊│              │
│  │St│ │Md│ │Sm│ │Mc│              │
│  │Md│ │  │ │  │ │  │              │
│  └──┘ └──┘ └──┘ └──┘              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  PATTERN INSIGHTS                   │
│  ┌────────────────────────────────┐ │
│  │ 💡 Stress + Skipped Meals...  │ │
│  │ You're 80% more likely...     │ │
│  │ when stressed without eating. │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  TOP TRIGGER                        │
│  ┌──┬──────────────────────────┬──┐ │
│  │⚡│ Stress                   │→ │ │
│  │  │ 67% of your migraines    │  │ │
│  └──┴──────────────────────────┴──┘ │
└─────────────────────────────────────┘

                    ┌─────┐
                    │  ⊕  │  ← FAB Button
                    │ Log │    (red, fixed)
                    │Mg   │
                    └─────┘

┌─────────────────────────────────────┐
│ TAB BAR                             │
│ 🏠  ✓  📊  💬  👤               │
│ Home Track Patterns Chat Profile    │
└─────────────────────────────────────┘
```

## Color Mapping

### Tracking Items
```
Sleep    → Blue (#3B82F6)
Water    → Cyan (#06B6D4)
Meals    → Purple (#8B5CF6)
Activity → Pink (#EC4899)
Stress   → Red (#EF4444)
Mood     → Yellow (#F59E0B)
Symptoms → Dark Red (#DC2626)
Medicine → Violet (#A855F7)
```

### Element Colors
```
Primary Button/Active    → Purple (#6B5FFF)
Success/Positive        → Green (#10B981)
Warning/Caution         → Orange (#F59E0B)
Error/Danger            → Red (#EF4444)
Card Background         → White (light) / Dark Gray (dark)
Border                  → Light Gray (#E5E7EB)
Text Primary            → Dark Gray (#11181C light / #ECEDEE dark)
Text Secondary          → Medium Gray (#6B7280)
```

## Component Heights (approx.)

```
Header              : 60px
Day Selector        : 100px (scroll horizontal)
Stats Section       : 120px
Quick Track Grid    : 280px (4 rows × 2)
Insights Card       : 100px
Top Trigger Card    : 80px
Tab Bar             : 70px
```

## Spacing System

```
Horizontal Padding  : 20px (from edges)
Vertical Gap        : 12px (between sections)
Card Padding        : 12-16px
Border Radius       : 8-12px
Icon Size           : 20-24px
Touch Target Min    : 44×44px
```

## Interactive Elements

- **Day Cards**: Tap to select, highlight when selected
- **Tracking Items**: Tap to toggle tracked state (color change + icon update)
- **Cards**: Tap for more details (future)
- **FAB Button**: Tap to open log migraine wizard
- **Pull-to-refresh**: Drag down to refresh data

## Visual States

### Tracking Item States

**Untracked (Grayed out):**
```
┌──┐
│+ │ ← Plus icon, gray background
│  │
└──┘
```

**Tracked (Colored):**
```
┌──┐
│✓ │ ← Checkmark, colored background
│📝│ ← With value shown
└──┘
```

### Day Card States

**Previous day:**
```
┌────┐
│ M  │
│ 15 │ ← Gray background
│    │
└────┘
```

**Today:**
```
┌────┐
│ W  │
│ 17 │ ← Purple background, white text
│    │
└────┘
```

**With migraine:**
```
┌────┐
│ T  │
│ 16 │
│ ●  │ ← Red dot indicator
└────┘
```

## Typography

```
Title (Header)      : 28px, Bold (700)
Subtitle (Section)  : 16px, Semi-Bold (600)
Body                : 14px, Regular (400)
Small               : 12px, Regular (400)
Micro               : 11px, Regular (400)
```

## Responsive Behavior

- **Horizontal**: All sections use full width with 20px padding
- **Vertical**: Scrollable content with 40px bottom padding (for FAB)
- **Day Selector**: Horizontal scroll, items don't wrap
- **Quick Track**: Wraps to 4 columns on standard phones
- **Screens**: Optimized for iPhone 12 and up (375px-400px width)

---

**This layout ensures clean, professional appearance with clear information hierarchy.**

