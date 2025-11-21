# AI Chat Assistent

## Placering
- [ ] Egen tab i bottom navigation (ikon: chat bubble)
- [ ] Badge: om AI har nya meddelanden
- [ ] Alternativ: Floating bubble på dashboard

## Chat Interface
- [ ] Standard chat UI (user höger blå, AI vänster grå)
- [ ] Text input + mikrofon knapp längst ner
- [ ] "Tänker..." typing indicator
- [ ] Avatar för AI
- [ ] Timestamp vid long-press

## Vad AI Kan Svara På

### Datadrivna Frågor
- "När hade jag senaste migrän?"
- "Hur många migrän denna månad?"
- "Vad är min vanligaste trigger?"
- "Varför fick jag migrän igår?"
→ AI hämtar faktisk data och svarar med siffror

### Mönster & Insikter
- "Finns det något mönster?"
- "Vad händer oftast innan migrän?"
- "Har väder påverkan på mig?"
→ AI analyserar i realtid och förklarar

### Prediktiv Hjälp
- "Kommer jag få migrän idag?"
- "Är jag i riskzonen?"
- "Vad ska jag göra för att undvika migrän?"
→ Risk score + preventiva tips

### Tracking via Chat
- "Logga migrän"
- "Jag åt pasta till lunch"
- "Sov dåligt i natt"
→ AI loggar conversationally

### Utbildning
- "Vad är aura?"
- "Förklara triggers"
→ Educational svar

### Motiverande Support
- "Jag är så trött på migrän..."
→ Empatiskt svar + visa progress

## Features

### Quick Replies
- [ ] Föreslagna frågor som knappar:
  - "Hur mår jag?"
  - "Dagens riskanalys"
  - "Senaste mönster"

### Rich Content
- [ ] Mini charts inline i chat
- [ ] Kort (migrändetaljer, patterns)
- [ ] Länkar till andra screens ("Visa mer →")

### Voice
- [ ] Speech-to-text input
- [ ] Text-to-speech output
- [ ] "Läs upp" knapp på AI svar

### Minne
- [ ] Kommer ihåg konversation (inom session)
- [ ] Förstår uppföljningsfrågor
- [ ] "Ny konversation" knapp för fresh start

## Säkerhet & Begränsningar

**AI gör INTE:**
- ❌ Medicinsk diagnos
- ❌ Förskriver medicin
- ❌ Ersätter läkare

**Disclaimer vid första användning:**
"Jag är en AI som hjälper dig förstå dina mönster. Jag är inte läkare. Vid allvarliga symptom, kontakta vårdgivare."

## Teknisk (för Hackathon)

### Bygg:
- [ ] Chat UI (messages + input)
- [ ] API: `/api/chat` → Claude API
- [ ] System prompt med user data som kontext
- [ ] 5-10 demo-frågor som fungerar bra

### System Prompt (exempel):
```
Du är migränassistent. Användarens data:
- Senaste migrän: 15 Nov
- Vanligaste trigger: Stress (67%)
- Migrän denna månad: 3

Regler:
- Var empatisk och hjälpsam
- Ge aldrig diagnos
- Basera svar på faktisk data
- Håll svar korta (2-4 meningar)
```

### Demo Flow:
1. "När hade jag senaste migrän?" → svarar med data
2. "Varför?" → mönsteranalys
3. "Vad ska jag göra idag?" → preventiv rådgivning

## UI Details

### Välkomst (tom chat):
"Hej! Jag kan hjälpa dig:
- Förstå dina mönster
- Svara på frågor om din data  
- Ge preventiva råd

Vad kan jag hjälpa dig med?"

### Inställningar
- [ ] AI Chat on/off
- [ ] Ton: Formell/Casual
- [ ] Radera historik