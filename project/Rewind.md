# Migraine Rewind

## Trigger
- [ ] "Rewind" knapp på varje migränlogg
- [ ] Auto-prompt efter att loggat migrän: "Vill du se vad som ledde till detta?"

## Loading Screen
- [ ] "Analyserar dina senaste 48 timmarna..." text
- [ ] Animerad timeline som "spolas bakåt"
- [ ] Progress indicator
- [ ] "Använder AI för mönsterigenkänning"

## Huvudvy: Timeline Visualization
### Layout
- [ ] Vertikal timeline från 48h innan till migränstart
- [ ] Tidsmarkeringar på vänster sida
- [ ] Dagens övergång tydligt markerad

### Data Lanes (Horisontella spår)
1. **Aktivitet**
   - [ ] Färgkodade block
   - [ ] Sitting, Walking, Exercise, Sleep
   - [ ] Icons för varje aktivitet
   - [ ] Längd på varje aktivitet

2. **Stress Level**
   - [ ] Line graph overlay
   - [ ] Färgskala: grön → gul → röd
   - [ ] Stress events markerade

3. **Mat & Dryck**
   - [ ] Punkter på timeline
   - [ ] Icons: frukost, lunch, middag, snacks
   - [ ] Röda markeringar för skippad måltid
   - [ ] Vattenintag bars

4. **Sömn**
   - [ ] Block för sömnperioder
   - [ ] Kvalitet (färg/pattern)
   - [ ] Längd markerad

5. **Väder (om tillgängligt)**
   - [ ] Lufttryck line graph
   - [ ] Temperatur
   - [ ] Nederbördskänslighet

6. **Symptom/Varningar**
   - [ ] Gula varningspunkter för prodrome symptom
   - [ ] "Nackspänning", "Trötthet", etc.

### Interaktivitet
- [ ] Pinch to zoom
- [ ] Tap på event → visa detaljer i popup
- [ ] Scroll för att se hela perioden
- [ ] "Hoppa till" knappar (48h, 24h, 12h, Start)

## AI Analys Panel
### Narrativ Förklaring
- [ ] Text som "berättar historien"
- [ ] Exempel:
```
  "48 timmar innan din migrän:
  
  Onsdag kl 10:00 - Du hade en normal morgon med frukost 
  och motion.
  
  Onsdag kl 14:00 - Stress nivåerna steg under 
  eftermiddagen. Du satt i 4 timmar utan paus.
  
  Onsdag kl 19:00 - Du skippade middagen. Detta är en 
  av dina identifierade triggers.
  
  Torsdag kl 06:00 - Dålig sömnkvalitet (5h). Kombination 
  av dålig sömn + skippad måltid förekommer i 80% av dina 
  migrän.
  
  Torsdag kl 12:00 - Nackspänning rapporterad. Typiskt 
  prodrome symptom för dig.
  
  Torsdag kl 15:00 - Migrän började."
```
- [ ] Viktiga events highlighted i text
- [ ] Läs upp-funktion (text-to-speech)

### Critical Moments
- [ ] "Vändpunkter" markerade
- [ ] "Detta var troligen utlösaren" callout
- [ ] Kombinationer av faktorer highlighted
- [ ] "Interventionsmöjligheter" - när kunde det ha förebyggts

### Pattern Match
- [ ] "Liknar migrän från [datum]" om samma mönster
- [ ] Visar tidigare liknande cases
- [ ] Success rate av olika interventioner i liknande fall

## "Vad Kunde Jag Ha Gjort?"
- [ ] Konkreta åtgärdsförslag med timing:
```
  Onsdag 19:00 - Åt middag istället för att skippa
  Onsdag 21:00 - Tag en 20 min promenad för att sänka stress
  Onsdag 22:00 - Gå och lägg dig tidigare
  Torsdag 12:00 - Vid nackspänning, ta förebyggande medicin
```
- [ ] Sannolikheten att varje åtgärd hade hjälpt
- [ ] "Prova detta nästa gång" save-funktion

## Dela & Spara
### Funktioner
- [ ] "Spara som PDF" för läkare
- [ ] "Dela anonymt" till community
- [ ] "Lägg till anteckningar" text field
- [ ] Export till hälsojournal (om integrerat)

### PDF Innehåll
- [ ] Timeline visualization
- [ ] AI-analys text
- [ ] Alla data points
- [ ] Jämförelse med tidigare migrän
- [ ] Medicinsk layout

## Bottom Actions
- [ ] "Förstått" - stäng och spara insikter
- [ ] "Ställ in påminnelser" - skapa preventiva påminnelser baserat på mönster
- [ ] "Se liknande migrän" - jämför med andra cases