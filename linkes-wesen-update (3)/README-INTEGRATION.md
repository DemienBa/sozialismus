# Das Linke Wesen - Integration Guide

## Ordnerstruktur

```
linkes-wesen-update/
├── data/
│   ├── knoten.json       # 90 Knoten (18 Achsen × 5 Stufen)
│   ├── literatur.json    # Literatur-Empfehlungen pro Strömung
│   └── personen.json     # 35 Denker*innen mit Profilen
├── generator/
│   ├── app-updated-core.js      # Neue Engine + Parameter
│   └── generator-wesen-button.js # "Zum Wesen" Button
├── wesen/
│   ├── wesen-url-integration.js  # URL-Parameter empfangen
│   └── wesen-personen-modul.js   # Personen-Anzeige
├── ARCHITEKTUR-BEREINIGT.md      # Referenz-Dokument
└── GENERATOR-UPDATE.js           # Backup der Engine-Änderungen
```

---

## 1. GENERATOR INTEGRATION

### 1.1 Parameter erweitern (app.js)

Finde in `app.js` das Array `PARAMETER_L2_BASE` und ersetze es komplett mit dem aus `generator/app-updated-core.js`.

Das neue Array hat 18 Parameter statt 15:
- A1-A5 (Strategie) — A5 BÜNDNIS ist neu
- B1-B3 (Ökonomie)
- C1-C3 (Gesellschaft)
- D1-D3 (Kultur)
- E1-E2 (Praxis)
- F1-F2 (Methode) — F1 TECHNOLOGIE und F2 MITTEL sind neu

### 1.2 Theoretiker erweitern (app.js)

Finde `SOZIALISMUS_ENGINE.theoretiker` und ersetze mit der neuen Version.

Neue Theoretiker:
- Nick Srnicek, Aaron Bastani (Post-Kapitalismus)
- Ivan Illich (Technik-Skepsis)
- Chantal Mouffe (Bündnispolitik)
- Kohei Saito (Degrowth-Kommunismus)
- Herbert Marcuse, Bini Adamczak

### 1.3 Strömungen erweitern (app.js)

Finde `SOZIALISMUS_ENGINE.stroemungen` und ersetze komplett.

Jede Strömung hat jetzt:
```javascript
{
  name: "...",
  id: "...",           // für URL
  wesenKnoten: [...],  // Array von Knoten-IDs
  wesenEtage: "...",   // Etage im Haus
  literaturKey: "..."  // Key für literatur.json
}
```

Neue Strömung: `Post-Kapitalismus`

### 1.4 Spannungen erweitern (app.js)

Finde `SOZIALISMUS_ENGINE.spannungen` und ersetze.

Neue Spannungen:
- Akzelerationismus vs. Ökologie
- Militanz vs. Spiritualität
- Breite Bündnisse vs. Zentralismus
- Low-Tech vs. Post-Work

### 1.5 Wesen-Button einfügen

In der Ergebnis-Komponente (wo das Quiz-Ergebnis angezeigt wird), füge ein:

```jsx
// Nach dem Theoretiker-Bereich
<div className="wesen-integration">
  <h4>Vertiefe deine Position</h4>
  <p>Erkunde die theoretischen Grundlagen im interaktiven Netzwerk.</p>
  <a 
    href={generateWesenURL(ergebnis)} 
    target="_blank" 
    className="wesen-button"
  >
    <span>🏠</span>
    <span>Im Haus der Ideen erkunden</span>
    <span>→</span>
  </a>
</div>
```

Die Funktion `generateWesenURL` ist in `generator/generator-wesen-button.js`.

### 1.6 CSS hinzufügen

Das CSS für den Button steht als Kommentar in `generator-wesen-button.js`.
Kopiere es in dein Stylesheet.

---

## 2. WESEN INTEGRATION

### 2.1 JavaScript einbinden (index.html)

Füge vor dem schließenden `</body>` Tag ein:

```html
<script src="./wesen-url-integration.js"></script>
<script src="./wesen-personen-modul.js"></script>
```

Oder kopiere den Code direkt in den bestehenden `<script>`-Block.

### 2.2 Knoten data-Attribute

Stelle sicher, dass jeder Knoten im HTML ein Attribut hat:

```html
<div class="knoten" data-knoten-id="A1-3">...</div>
```

### 2.3 Personen in Knoten-Detail anzeigen

In der Funktion, die das Knoten-Detail-Panel rendert, füge ein:

```javascript
// Personen für diesen Knoten laden
const personen = await getPersonenFuerKnoten(knotenId);
const personenHTML = renderPersonenListe(personen, knotenId);

// Im Detail-Panel anzeigen
detailPanel.innerHTML += `
  <div class="knoten-bewohner">
    <h4>Bewohner*innen</h4>
    ${personenHTML}
  </div>
`;
```

### 2.4 CSS hinzufügen

Das CSS steht als Kommentar am Ende beider `.js` Dateien.
Kopiere es in den `<style>`-Block von `index.html`.

---

## 3. DATEN EINBINDEN

### 3.1 data-Ordner

Kopiere den `data/`-Ordner neben deine HTML-Dateien:

```
dein-projekt/
├── index.html (Generator)
├── wesen/
│   └── index.html
├── data/
│   ├── knoten.json
│   ├── literatur.json
│   └── personen.json
```

### 3.2 Daten laden (optional inline)

Falls du die Daten nicht per fetch laden willst, kannst du sie auch inline einbinden:

```html
<script>
const PERSONEN_DATA = { "personen": [...] };
const KNOTEN_DATA = { "knoten": [...] };
const LITERATUR_DATA = { "archetypen": {...} };
</script>
```

---

## 4. URL-FLOW

So funktioniert die Weiterleitung:

1. User macht Quiz im Generator
2. Ergebnis hat `wesenKnoten: ["A3-5", "B2-5", "A4-5"]`
3. User klickt "Im Haus erkunden"
4. URL: `/wesen/?stroemung=anarcho-kommunismus&knoten=A3-5,B2-5,A4-5&etage=1.%20Stock`
5. Wesen liest URL-Parameter
6. Zeigt Willkommens-Modal
7. Hebt Knoten hervor

---

## 5. CHECKLISTE

### Generator
- [ ] PARAMETER_L2_BASE ersetzt (18 Parameter)
- [ ] theoretiker ersetzt (27 Einträge)
- [ ] stroemungen ersetzt (11 Einträge mit wesenKnoten)
- [ ] spannungen ersetzt (12 Einträge)
- [ ] generateWesenURL() Funktion eingefügt
- [ ] Wesen-Button in Ergebnis eingefügt
- [ ] CSS hinzugefügt

### Wesen
- [ ] wesen-url-integration.js eingebunden
- [ ] wesen-personen-modul.js eingebunden
- [ ] data-knoten-id Attribute an Knoten
- [ ] Personen-Anzeige in Knoten-Detail
- [ ] CSS hinzugefügt

### Daten
- [ ] data/knoten.json vorhanden
- [ ] data/personen.json vorhanden
- [ ] data/literatur.json vorhanden

---

## Fragen?

Die Dateien enthalten ausführliche Kommentare. 
Bei Problemen: Schau in die Browser-Konsole (F12).
