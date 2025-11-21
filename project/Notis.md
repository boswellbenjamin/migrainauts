Tanken med notiser är att den ska vara AI-genererad, om möjligt. Nedan kommer ett use-case.

Jag (användare av appen), trackar all min data, jag får oftast migrän på lördagar kl 12 när jag ej varit aktiv under förmiddagen som exempel. Om appen då ser att jag följer samma mönster som när jag brukar få migrän, så får jag en notis på telefonen, med "migrän kan komma", eller liknande. När jag går in på notisen får jag mer information, exempelvis, "På lördagar, kl12 brukar du få migrän när du ej varit aktiv under förmiddagen, för att bryta detta mönster rekommenderar vi att gå på en promenad eller annan aktivitet".

Kanske notiser liknande denna? 
![[Pasted image 20251120205707.png]]
# AI-Notifikationer

## Typer av Notifikationer

### 1. Prediktiv Varning (Hög Prioritet)
**Titel:** "⚠️ Migränrisk upptäckt"
**Text:** "Ditt vanliga mönster för lördagar formar sig..."
**Tid:** Skickas 2-4 timmar innan förväntad migrän

**Detail Screen:**
- [ ] Stor varningsikon (animerad)
- [ ] Tid och datum
- [ ] **Förklaring:** 
```
  "På lördagar kl 12:00 brukar du få migrän när du inte 
  varit aktiv under förmiddagen. Idag följer du samma mönster."
```
- [ ] **Visuell timeline:** Visa dagens aktivitet vs vanligt mönster
- [ ] **Handlingsförslag (3-5 st):**
  - "Gå på en 20 minuters promenad nu"
  - "Drick 2 glas vatten"
  - "Ta en förebyggande medicin"
  - "Använd Relief aHead enheten"
  - "Undvik starka ljus nästa timme"
- [ ] Knappar:
  - "Jag fixar det!" (dismiss + bekräfta åtgärd)
  - "Sätt påminnelse om 30 min"
  - "Ignorera denna gång"

### 2. Tidigt Mönster (Medel Prioritet)
**Titel:** "💡 Mönster formar sig"
**Text:** "3 av 4 faktorer som brukar leda till migrän är aktiva"
**Tid:** Skickas 6-8 timmar innan

**Detail Screen:**
- [ ] Info-ikon
- [ ] Progress bar av triggers (3/4 aktiva)
- [ ] Lista triggers som är aktiva
- [ ] Mild rekommendation
- [ ] "Håll koll" eller "Förstått" knappar

### 3. Positiv Förstärkning (Låg Prioritet)
**Titel:** "🎉 Bra jobbat!"
**Text:** "Du bröt ditt vanliga lördagsmönster"
**Tid:** När mönster bryts framgångsrikt

**Detail Screen:**
- [ ] Firande animation/konfetti
- [ ] "Vad gjorde du annorlunda?"
- [ ] Spara som framgångshistorik
- [ ] Delningsknapp (anonymt till community)

### 4. Check-in Påminnelse
**Titel:** "🔔 Dags för check-in"
**Text:** "Hur mår du just nu?"
**Tid:** Enligt användarens schema (2-3x/dag)

### 5. Glömt att Tracka
**Titel:** "📝 Du har missat en tracking"
**Text:** "Sömn inte loggad idag"
**Tid:** 2 timmar efter vanlig tid

### 6. Väder Varning (Om aktiverat)
**Titel:** "🌧️ Väderförändring"
**Text:** "Lufttrycket sjunker snabbt - en av dina triggers"
**Tid:** När väderförändring upptäcks

## Notifikations Center
- [ ] Lista alla notifikationer (senaste först)
- [ ] Olästa markerade
- [ ] Swipe för att ta bort
- [ ] Kategoriserad vy: "Varningar", "Påminnelser", "Insikter"
- [ ] "Markera alla som lästa" knapp
- [ ] Sökfunktion

## Notifikations Inställningar
- [ ] On/off toggle för varje typ
- [ ] Tyst läge (Do Not Disturb timmar)
- [ ] Prioritetsnivåer (kritisk, viktig, info)
- [ ] Testnotis knapp
- [ ] "Förklara notifikationslogik" info

## "Varför Ser Jag Detta?" Explainer
- [ ] Tillgänglig på varje notis
- [ ] Förklarar AI-logiken
- [ ] Visar data som användes
- [ ] Konfidensnivå
- [ ] "Rapportera fel" om notisen är fel