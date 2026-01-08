# SOZIALISMUS-IDEEN-WIKI: Konzept

## Die Vision

Ein navigierbares Wissenssystem, das:
1. Das gesamte Spektrum linker Theorie systematisch erfasst
2. Zu jeder Position passende Ressourcen (Bücher, Videos, Artikel) liefert
3. "Weiße Flecken" sichtbar macht – Kombinationen ohne Theorie
4. Verbindungen zwischen Denker*innen und Positionen zeigt

---

## Der 15-dimensionale Raum

Jede der 15 Dimensionen (A1-E3) hat 5 Stufen. Das ergibt theoretisch 5^15 = 30 Milliarden Kombinationen.

**Aber:** Die meisten Kombinationen sind entweder:
- Logisch inkonsistent (z.B. A3=1 "Staat nutzen" + B2=5 "Selbstverwaltung")
- Historisch nie vertreten worden
- Praktisch identisch mit anderen

**Realistisch:** Es gibt vielleicht 50-200 "kohärente Positionen" die historisch vertreten wurden.

---

## Datenstruktur: Position → Ressourcen

```json
{
  "positionen": [
    {
      "id": "anti-staat-selbstverwaltung",
      "name": "Anarchistische Selbstverwaltung",
      "koordinaten": {
        "A3": [4, 5],  // Staat überwinden
        "B2": [4, 5],  // Selbstverwaltung
        "E2": [4, 5]   // Dezentral
      },
      "beschreibung": "Direkte Demokratie ohne Staat, Selbstorganisation in Kommunen und Betrieben",
      "ressourcen": {
        "einstieg": [
          {
            "typ": "buch",
            "titel": "Anarchie! Idee, Geschichte, Perspektiven",
            "autor": "Horst Stowasser",
            "jahr": 2007,
            "sprache": "de",
            "schwierigkeit": 1,
            "url": "https://..."
          }
        ],
        "vertiefung": [...],
        "klassiker": [...],
        "videos": [...],
        "podcasts": [...]
      },
      "vertreter": ["Bakunin", "Kropotkin", "Bookchin", "Graeber"],
      "historische_beispiele": ["Spanien 1936", "Rojava", "Zapatistas"],
      "verwandt_mit": ["raetekommunismus", "munizipalismus"],
      "spannung_mit": ["marxismus-leninismus", "reformsozialismus"]
    }
  ]
}
```

---

## Systematische Erfassung: Die Achsen

### Achse 1: STAAT (A3)
| Stufe | Position | Hauptvertreter | Schlüsselwerke |
|-------|----------|----------------|----------------|
| 1 | Staat als Hauptinstrument | Lassalle, Kautsky | "Erfurter Programm" |
| 2 | Staat erobern & nutzen | Lenin, Gramsci | "Staat und Revolution" |
| 3 | Pragmatisch/Gemischt | Poulantzas | "Staatstheorie" |
| 4 | Staat transformieren/überwinden | Holloway | "Die Welt verändern ohne die Macht zu übernehmen" |
| 5 | Staat sofort überwinden | Bakunin, Kropotkin | "Gegenseitige Hilfe" |

### Achse 2: EIGENTUM (B2)
| Stufe | Position | Hauptvertreter | Schlüsselwerke |
|-------|----------|----------------|----------------|
| 1 | Staatseigentum zentral | Lenin, Stalin | "Ökonomische Probleme des Sozialismus" |
| 2 | Öffentliches Eigentum | Klassische Sozialdemokratie | |
| 3 | Gemischte Formen | Marktsozialist*innen | Nove "Economics of Feasible Socialism" |
| 4 | Genossenschaften/Commons | Ostrom, Helfrich | "Die Welt der Commons" |
| 5 | Reine Selbstverwaltung | Pannekoek, Räte | "Arbeiterräte" |

### Achse 3: ARBEIT (B3)
| Stufe | Position | Hauptvertreter | Schlüsselwerke |
|-------|----------|----------------|----------------|
| 1 | Produktivkraft-Entwicklung | Orthodox-Marxistisch | |
| 2 | Befreite Arbeit | Früher Marx | "Ökonomisch-philosophische Manuskripte" |
| 3 | Gute Arbeit für alle | Gewerkschaftlich | |
| 4 | Arbeitszeitverkürzung radikal | Gorz | "Kritik der ökonomischen Vernunft" |
| 5 | Post-Work/Überwindung | Weeks, Srnicek | "The Problem with Work", "Inventing the Future" |

### Achse 4: NATUR (C2)
| Stufe | Position | Hauptvertreter | Schlüsselwerke |
|-------|----------|----------------|----------------|
| 1 | Natur als Ressource | Produktivistischer Marxismus | |
| 2 | Umweltschutz instrumentell | | |
| 3 | Sozial-ökologisch | | |
| 4 | Ökosozialismus | Foster, Saito | "Marx's Ecology", "Degrowth Communism" |
| 5 | Rechte der Natur | Buen Vivir, Deep Ecology | Acosta "Buen Vivir" |

### Achse 5: FEMINISMUS (C1)
| Stufe | Position | Hauptvertreter | Schlüsselwerke |
|-------|----------|----------------|----------------|
| 1 | Klasse zuerst | Orthodox-marxistisch | |
| 2 | Frauenfrage als Teil | Zetkin, Kollontai | |
| 3 | Dual Systems | | |
| 4 | Materialistischer Feminismus | Federici | "Caliban und die Hexe" |
| 5 | Vollständig intersektional | Combahee River, Davis | "Schwarzer Feminismus" |

---

## Weiße Flecken: Wo fehlt Theorie?

### Potentiell untertheoritisierte Kombinationen:

1. **Spiritueller Rätekommunismus** (D3=5 + B2=5 + A3=5)
   - Gibt es das? Mystischer Anarchismus vielleicht?
   
2. **Post-Work Leninismus** (B3=5 + A3=2 + E3=1)
   - Automatisierung + Avantgarde-Partei?
   
3. **Nationaler Ökosozialismus** (C2=5 + C3=1)
   - Degrowth im einen Land?
   
4. **Reformistischer Anarchismus** (A1=1 + A3=5)
   - Logisch schwierig, aber: Gradualistische Staats-Erosion?

### Forschungsfragen:
- Welche Kombinationen wurden NIE vertreten?
- Welche KÖNNTEN kohärent sein, haben aber keine Literatur?
- Wo gibt es Lücken die gefüllt werden könnten?

---

## Navigations-Ideen

### 1. Positions-Finder
"Ich glaube X über den Staat und Y über Eigentum → Diese Denker*innen könnten dich interessieren"

### 2. Literatur-Radar
"Zu deiner Position gibt es 12 Bücher auf Deutsch, 45 auf Englisch, 3 Videos"

### 3. Streitgespräch-Generator
"Du (A3=5) vs. Leninist (A3=2): Die historische Debatte zwischen Bakunin und Marx"

### 4. Lücken-Explorer
"Deine Kombination ist ungewöhnlich. Vielleicht bist du Pionier*in?"

### 5. Lernpfad
"Von Einsteiger zu Experte: Diese 5 Bücher in dieser Reihenfolge"

---

## Technische Umsetzung

### Phase 1: Datensammlung
- Systematisch für jede Achse Literatur sammeln
- Mit Schwierigkeitsgrad, Sprache, Verfügbarkeit
- Verknüpfung mit Koordinaten

### Phase 2: Positions-Cluster
- Die 16 Archetypen als Ausgangspunkt
- Erweitern auf ~50-100 feinere Positionen
- Überlappungen und Grenzen definieren

### Phase 3: Interface
- Slider → Literatur-Empfehlungen
- "Wer denkt wie ich?" Feature
- "Was fehlt noch?" Feature

### Phase 4: Community
- Nutzer*innen können Ressourcen hinzufügen
- Bewertungen, Kommentare
- Lokale Lesekreis-Vernetzung

---

## Erste Schritte

1. **Kern-Bibliothek aufbauen**
   - 10 Schlüsselwerke pro Achse
   - Mit klaren Koordinaten versehen

2. **Verbindungs-Matrix**
   - Welche Achsen hängen logisch zusammen?
   - Welche Kombinationen sind inkonsistent?

3. **Test mit echten Nutzer*innen**
   - Partei-Bildungsarbeit
   - Feedback: Was fehlt? Was ist falsch?

---

## Offene Fragen

1. Wie granular? 5 Stufen oder mehr?
2. Wie mit Widersprüchen innerhalb einer Strömung umgehen?
3. Wie historischen Wandel abbilden? (Marx 1844 ≠ Marx 1867)
4. Wie mit Primär- vs. Sekundärliteratur umgehen?
5. Wie Zugänglichkeit sicherstellen? (Sprache, Paywall, Schwierigkeit)
