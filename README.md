# Sozialismus-Generator V5

Ein interaktives Tool zur politischen Selbstverortung und Erkundung sozialistischer Strömungen.

**Live Demo:** [GitHub Pages Link hier einfügen]

## Features

- **Layer 1:** "Wie links bist du?" – 17 Fragen zu politischen Grundhaltungen
- **Layer 2:** "Welcher Sozialismus?" – 15 theoretische Fragen, Zuordnung zu 16 Archetypen
- **Layer 3:** "Parteiprogramm-Check" – Vergleich mit dem Erfurter Programm der Linken

### Neu in V5: Offline-Modus

**Alle vier Layer funktionieren jetzt ohne KI-Anfrage:**
- **Layer 1:** "Wie links bist du?" → 5 Kategorien
- **Layer 2:** "Welcher Sozialismus?" → 16 Archetypen
- **Layer 3:** "Parteiprogramm-Check" → 3 Kategorien + Spannungsfelder
- **Layer 4:** "Dein Leseplan" → Literatur passend zu deinem Archetyp

Nur der **Antrags-Generator** in Layer 3 nutzt noch Groq (Llama 3.3 70B) für individuell generierte Anträge.

## Die 16 Sozialismus-Archetypen

| # | Archetyp | Kernidee |
|---|----------|----------|
| 1 | Orthodoxer Marxismus-Leninismus | Avantgarde-Partei, Planwirtschaft |
| 2 | Libertärer Sozialismus | Herrschaftsfreiheit, Selbstverwaltung |
| 3 | Rätekommunismus | Arbeiterräte, gegen alle Apparate |
| 4 | Ökosozialismus | Klimakrise + Kapitalismuskritik |
| 5 | Feministischer Sozialismus | Patriarchat + Kapitalismus verwoben |
| 6 | Demokratischer Sozialismus | Parlamentarischer Weg, Reformen |
| 7 | Postkapitalismus | Automatisierung, Post-Work |
| 8 | Buen Vivir | Indigene Konzepte, Harmonie |
| 9 | Autonomer Marxismus | Multitude, Bewegungen |
| 10 | Libertärer Munizipalismus | Kommune, Konföderation |
| 11 | Trotzkismus | Permanente Revolution, International |
| 12 | Commons-Bewegung | Gemeingüter, solidarische Ökonomie |
| 13 | Eurokommunismus | Demokratisch, Hegemonie |
| 14 | Maoismus | Volkskrieg, Bauern |
| 15 | Reformsozialismus | Schrittweiser Umbau |
| 16 | Revolutionärer Syndikalismus | Generalstreik, Gewerkschaft |

## Technisches

### Matching-Algorithmus

Jeder Archetyp hat einen **Idealvektor** (15 Parameter, Werte 1-5) und **Gewichtungen** (1-3).

```javascript
// Gewichtete quadratische Distanz
for (param in ideal) {
  diff = |userValue - idealValue|
  distance += weight * (diff * diff)
}
// Archetyp mit niedrigster Distanz gewinnt
```

Siehe `docs/gewichtungen-erklaerung.md` für Details zu allen 16 Archetypen.

### Dateien

```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── data/
│   ├── layer1.json          # Parameter-Details Layer 1
│   ├── layer2.json          # Parameter-Details Layer 2
│   ├── analysen-layer1.json # 5 Offline-Analysen (sehr links → eher rechts)
│   ├── analysen-layer2.json # 16 Archetypen mit Idealvektoren
│   ├── analysen-layer3.json # Programm-Vergleich mit Spannungsfeldern
│   └── literatur.json       # Bücher, Videos, Podcasts pro Archetyp
├── docs/
│   ├── gewichtungen-erklaerung.md
│   └── archetypen-framework.md
└── wiki/
    ├── achse-A3-staat.json
    ├── achse-B2-besitz.json
    ├── achse-B3-arbeit.json
    ├── achse-C2-natur.json
    ├── kartographie-uebersicht.md
    └── freie-bibliotheken.md
```

### Lokales Testen

```bash
# Beliebiger lokaler Server, z.B.:
python -m http.server 8000
# oder
npx serve
```

Dann öffne `http://localhost:8000`

## Credits

- **Konzept & Entwicklung:** Demien Bartók
- **KI-Unterstützung:** Claude (Anthropic), Groq (Llama 3.3)
- **Für:** Die Linke, Kreisverband Halle

## Lizenz

MIT – Frei verwendbar, auch für andere Parteien/Organisationen.

---

*Hinweis: Groq ≠ Grok. Groq ist ein unabhängiges KI-Unternehmen, nicht verwandt mit Elon Musks xAI.*
