Dashboarden ska innehålla en "rulllista" på dagar, samt vilken dag det är idag, användaren ska endast kunna se dagar bakåt i tiden.

Onboarding med hur många gånger om dagen användaren vill göra en "check in?", 2-3 gånger per dag?
Snabblänkar för att kunna tracka saker, såsom symptom, sömn osv, innan användaren trackat, är det en grå ikon, med ett "+", när användaren har trackat får hen visuel feedback baserat på vad som är trackat.

# Dashboard (Huvudskärm)

## Header
- [ ] App-logotyp/namn
- [ ] Notifikationsikon med badge (antal olästa)
- [ ] Inställningar ikon (kugghjul)

## Dagslista Sektion
- [ ] Horisontell scrollbar med dagar
- [ ] Endast dagar bakåt i tiden synliga
- [ ] Idag markerad med färg/border
- [ ] Varje dagkort visar:
  - Datum (t.ex. "20 Nov")
  - Migränstatus (röd prick om migrän inträffade)
  - Tracking status (liten indikator på hur mycket som trackats)
- [ ] Smooth scroll-fysik
- [ ] "Dagens datum" sticky header när man scrollar
## Snabbspårning Grid
### Layout
- [ ] 2x4 grid med stora, tappbara kort
### Tracking Knappar (i ordning):
1. **Sömn**
   - [ ] Ikon: måne
   - [ ] Text: "Sömn"
   - [ ] Otrackat: grå + "+" ikon
   - [ ] Trackat: blå med checkmark + "7h 30m" eller kvalitet

2. **Vatten**
   - [ ] Ikon: vattendroppe
   - [ ] Text: "Vatten"
   - [ ] Otrackat: grå + "+"
   - [ ] Trackat: cyan med "6 glas" eller liknande

3. **Måltider**
   - [ ] Ikon: bestick
   - [ ] Text: "Mat"
   - [ ] Otrackat: grå + "+"
   - [ ] Trackat: grön med "Frukost, Lunch" eller liknande

4. **Motion**
   - [ ] Ikon: löpande figur
   - [ ] Text: "Aktivitet"
   - [ ] Otrackat: grå + "+"
   - [ ] Trackat: orange med "30 min promenad"

5. **Stress**
   - [ ] Ikon: blixt/hjärna
   - [ ] Text: "Stress"
   - [ ] Otrackat: grå + "+"
   - [ ] Trackat: färg baserat på nivå + "Låg/Medel/Hög"

6. **Humör**
   - [ ] Ikon: emoji-ansikte
   - [ ] Text: "Humör"
   - [ ] Otrackat: grå + "+"
   - [ ] Trackat: färgad emoji (😊😐😢)

7. **Symptom**
   - [ ] Ikon: varningstriangel
   - [ ] Text: "Symptom"
   - [ ] Otrackat: grå + "+"
   - [ ] Trackat: röd/gul med antal symptom

8. **Medicin**
   - [ ] Ikon: piller
   - [ ] Text: "Medicin"
   - [ ] Otrackat: grå + "+"
   - [ ] Trackat: lila med medicin namn

### Interaktioner
- [ ] Quick tap → markera som "klar" med standardvärde
- [ ] Långtryck → öppna detaljerad input
- [ ] Haptic feedback vid tracking
- [ ] Smooth animation från grå till färg

## Insikter Kort
- [ ] "Dina mönster" rubrik
- [ ] AI-genererad insikt av veckan (1-2 meningar)
- [ ] Visuell indikator (ikon eller liten graf)
- [ ] Konfidensnivå: "Baserat på X dagar data"
- [ ] "Visa full analys" knapp → går till Mönsteranalys

## Statistik Översikt
### Små kort i rad eller grid:
- [ ] **Dagar sedan migrän**
  - Stor siffra
  - "Senaste: 15 Nov"
  
- [ ] **Migrän denna månad**
  - Antal med jämförelse: "3 (-2 från förra månaden)"
  - Färgkodad: grön om minskning, röd om ökning

- [ ] **Vanligaste trigger**
  - Ikon + namn
  - "Stress (67%)"

- [ ] **Tracking streak**
  - "🔥 12 dagar i rad!"
  - Motiverande meddelande
## Snabbknappar (Floating/Fixed)
- [ ] Stor röd knapp: "Jag har migrän" (alltid synlig)
- [ ] Position: höger nedre hörn, floating action button
## Pull-to-Refresh
- [ ] Dra ner för att uppdatera data
- [ ] Loading animation
- [ ] Bekräftelse när uppdaterad