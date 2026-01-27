# 🏠 LINKESWESEN - FINALE STRUKTUR (identisch Server & Lokal)

## 📂 ORDNER-STRUKTUR:

```
linkeswesen/
│
├── index.html                         ← Generator Einstieg
│
├── js/
│   └── app.js                         ← Generator (React)
│
├── css/
│   └── style.css                      ← Generator Styles
│
├── data/                              ← Generator Daten
│   ├── layer1.json
│   ├── layer2.json
│   ├── analysen-layer1.json
│   ├── analysen-layer2.json
│   ├── analysen-layer3.json
│   └── literatur.json
│
├── haus/                              ← DAS WESEN (Hauptordner)
│   ├── index.html
│   ├── js/
│   │   ├── app.js
│   │   ├── mediathek.js
│   │   ├── grundlagen.js
│   │   └── navigation.js
│   ├── css/
│   │   ├── base.css
│   │   ├── navigation.css
│   │   ├── ansichten.css
│   │   ├── responsive.css
│   │   └── grundlagen.css
│   └── data/
│       ├── knoten_content_26.json
│       ├── personen.json
│       ├── ressourcen.json
│       ├── satzbausteine.json
│       ├── zimmer_beschreibungen.json
│       ├── mediathek.json
│       └── grundlagen.json
│
└── linkes-wesen-26/                   ← Umleitung (für URLs)
    └── index.html                     ← Leitet zu /haus/ um

```

---

## 🔄 WARUM "linkes-wesen-26" ALS UMLEITUNG?

Generator erstellt URLs wie:
```
https://linkeswesen.de/linkes-wesen-26/index.html?profil=...
```

Die `linkes-wesen-26/index.html` leitet dann automatisch weiter zu:
```
https://linkeswesen.de/haus/index.html?profil=...
```

So bleiben alte Links funktionsfähig!

---

## ✅ VORTEILE:

- ✅ Identische Struktur lokal & Server
- ✅ Alle Links funktionieren
- ✅ Alte URLs funktionieren weiterhin
- ✅ Klare Trennung: Generator / Wesen

---

## 🚀 STARTEN:

```bash
cd linkeswesen
python -m http.server 5500
```

Browser: http://127.0.0.1:5500/

---

## 🔗 URLs:

- **Generator:** http://127.0.0.1:5500/
- **Wesen direkt:** http://127.0.0.1:5500/haus/
- **Via Umleitung:** http://127.0.0.1:5500/linkes-wesen-26/

Alle funktionieren! 🎉
