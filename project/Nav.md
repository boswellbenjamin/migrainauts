# Navigation & UX

## Bottom Tab Bar (Huvudnavigation)

### Layout
- [ ] Alltid synlig längst ner
- [ ] 4-5 tabs beroende på design
- [ ] iOS/Android native känna

### Tabs (vänster till höger):

**1. Hem (Dashboard)**
- [ ] Ikon: hus
- [ ] Label: "Hem"
- [ ] Badge: antal nya insikter

**2. Tracking**
- [ ] Ikon: checklista eller plus
- [ ] Label: "Spåra"
- [ ] Direkt till quick tracking grid

**3. Center FAB (Floating Action Button)**
- [ ] Stor röd cirkel button
- [ ] Ikon: warning / headache icon
- [ ] Höjd över tab bar
- [ ] Label: "Migrän" (optional, kan vara icon-only)
- [ ] Quick access till "Logga migrän"

**4. Insikter (Mönsteranalys)**
- [ ] Ikon: graf / chart
- [ ] Label: "Mönster"
- [ ] Badge: nya upptäckta mönster

**5. Profil**
- [ ] Ikon: person
- [ ] Label: "Profil"
- [ ] Notifikationsdot om action needed

### Alternativ Layout (utan FAB):
- Tab 1: Hem
- Tab 2: Tracking
- Tab 3: Logga (center, emphasized)
- Tab 4: Insikter
- Tab 5: Profil

## Top Navigation (Per Screen)

### Standard Header
- [ ] Tillbaka knapp (vänster)
- [ ] Titel (center eller vänster-aligned)
- [ ] Action buttons (höger)
  - Dela
  - Inställningar
  - Filter
  - Sök

### Dashboard Header
- [ ] App logo/namn
- [ ] Notifikationsikon (höger)
- [ ] Inställningar ikon (höger)

### Tracking/Logg Header
- [ ] "Avbryt" (vänster)
- [ ] Progress indicator (dots eller bar)
- [ ] "Spara" / "Nästa" (höger)

### Modal Headers
- [ ] "Stäng" X (höger)
- [ ] Titel (center)
- [ ] Drag handle (om swipe-to-dismiss)

## Gestures & Interactions

### Standardgester
- [ ] Swipe höger → tillbaka
- [ ] Pull-to-refresh på listor
- [ ] Long press för kontext-meny
- [ ] Swipe på list items för actions (delete, edit)
- [ ] Pinch to zoom på grafer
- [ ] Tap outside modal → stäng

### Specifika Interactions
- [ ] Tracking buttons:
  - Tap → quick add
  - Long press → detailed add
- [ ] Timeline scroll:
  - Horizontal scroll för dagar
  - Vertical scroll för detaljer
- [ ] Calendar:
  - Swipe för nästa/förra månad
  - Tap för dag-detaljer

## Övergångar & Animationer

### Skärmövergångar
- [ ] Fade in/out för modals
- [ ] Slide från höger för push navigation
- [ ] Slide från botten för sheets
- [ ] Hero animations för bilder

### Micro-interactions
- [ ] Button press feedback (haptic + visual)
- [ ] Success checkmark animation
- [ ] Loading skeletons
- [ ] Progress bars
- [ ] Confetti för achievements
- [ ] Pulse på notifikationsbadge

### Smooth Animations
- [ ] 300ms standard duration
- [ ] Ease-in-out för de flesta
- [ ] Spring för bouncy effects
- [ ] No animation vid "reducerad motion" setting

## Onboarding Navigation
- [ ] Linear flow (kan inte hoppa över steg)
- [ ] Progress dots/bar längst upp
- [ ] "Nästa" alltid synlig
- [ ] "Hoppa över" för optional steg
- [ ] "Tillbaka" för att korrigera

## Deep Linking & Notifications
- [ ] Notifikations-tap → relevant screen
- [ ] Dela länk → specifik migrän eller mönster
- [ ] Widget tap → relevant sektion
- [ ] Siri shortcut → direkt till funktion

## Error States & Empty States

### Error States
- [ ] Network error → "Ingen uppkoppling" med retry
- [ ] Data error → "Något gick fel" med support kontakt
- [ ] Permission denied → förklaring + inställnings länk

### Empty States
- [ ] Inga migrän loggade än
  - Illustrativ bild
  - Uppmuntrande text
  - "Logga din första" CTA
- [ ] Ingen data för mönster
  - "Vi behöver mer data"
  - Progress (X/14 dagar)
  - Tips för tracking
- [ ] Inga notifikationer
  - "Allt lugnt!" meddelande
  - Ikon

## Accessibility Navigation

### Screen Reader Support
- [ ] Alla interaktiva element har labels
- [ ] Logisk tab-ordning
- [ ] Announced när skärm ändras
- [ ] Landmarks för sektioner

### Keyboard Navigation (om relevant)
- [ ] Tab mellan element
- [ ] Enter för action
- [ ] Esc för stäng
- [ ] Arrow keys för listor

### Alternative Navigation
- [ ] Stor text mode → simplified navigation
- [ ] Voice control support
- [ ] Switch control support

## Loading States

### Initial Load
- [ ] Splash screen (max 2s)
- [ ] Skeleton screens medan data laddar
- [ ] Aldrig blank white screen

### Partial Loads
- [ ] Shimmer effect på loading content
- [ ] "Laddar..." indikator
- [ ] Timeout after 10s med error

### Infinite Scroll
- [ ] Spinner längst ner
- [ ] "Laddar mer..." text
- [ ] "Slut på data" när färdig