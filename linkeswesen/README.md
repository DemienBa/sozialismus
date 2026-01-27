# 🏗️ LINKESWESEN - SAUBERE STRUKTUR

## 📂 STRUKTUR (identisch lokal & Server):

```
linkeswesen/
├── index.html                         ← Generator Einstieg
├── js/
│   └── app.js                         ← Generator React App
├── css/
│   └── style.css                      ← Generator CSS (fehlt noch!)
└── linkes-wesen-26/                   ← Das Wesen
    ├── index.html
    ├── js/
    │   └── app.js                     ← Wesen App
    ├── css/
    │   ├── base.css
    │   ├── navigation.css
    │   ├── ansichten.css
    │   ├── responsive.css
    │   └── grundlagen.css
    └── data/
        ├── knoten_content_26.json
        ├── personen.js
        ├── ressourcen.json
        ├── satzbausteine.json
        ├── zimmer_beschreibungen.json
        ├── mediathek.json (923 Medien!)
        └── grundlagen.json (41 Essays)
```

---

## ✅ FERTIGE FEATURES:

### **Generator:**
- ✅ Layer 1: 20 Grundfragen
- ✅ Layer 2: 26 Achsen
- ✅ Layer 3: Analyse + Archetyp
- ✅ Layer 4: Literaturempfehlungen
- ✅ URL-Parameter Empfang für Profil-Vorausfüllung

### **Wesen:**
- ✅ 26-Achsen-Kompass mit 130 Positionen
- ✅ Hausansicht mit 12 Zimmern
- ✅ Profil-System mit Generator-Verknüpfung
- ✅ Mediathek mit 923 Büchern/Filmen/Serien
- ✅ Grundlagen mit 41 Essays (2 vollständig)
- ✅ 209 Personen-Datenbank
- ✅ Ressourcen-System

### **Verbindungen:**
- ✅ Generator → Wesen (mit Profil-URL-Parametern)
- ✅ Wesen → Generator ("Im Generator öffnen" Button)
- ✅ Bidirektionale Profil-Übertragung

---

## 🚀 LOKAL STARTEN:

```bash
cd linkeswesen
python -m http.server 5500
```

Browser: http://127.0.0.1:5500/

---

## 📤 AUF SERVER DEPLOYEN:

1. Kompletten `linkeswesen/` Ordner hochladen nach `/var/www/`
2. Fertig! Struktur ist identisch.

---

## ⚠️ FEHLT NOCH:

- `css/style.css` für Generator (vom Server kopieren)
- Restliche 39 Essay-Texte in grundlagen.json
- Social Media Modul
- Kompost Modul

---

## 🔧 ENTWICKLUNG:

Alle Pfade sind relativ und funktionieren identisch lokal & auf Server.
Keine Anpassungen nötig!
