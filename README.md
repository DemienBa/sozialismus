# 🚩 DAS LINKE WESEN

Interaktive Plattform zur Exploration sozialistischer Ideologien mit 26-Achsen-Kompass, Mediathek und politischem Generator.

## 📂 Struktur

```
linkeswesen/
├── index.html              # Generator-Einstieg
├── js/app.js               # Generator React-App
├── css/style.css           # Generator Styling
├── data/                   # Generator-Daten
│
├── haus/                   # Das Wesen (Hauptanwendung)
│   ├── index.html          # Monolithische App (23k Zeilen)
│   └── data/               # Wesen-Daten (Kompass, Mediathek, Essays)
│
└── linkes-wesen-26/        # URL-Umleitung für Kompatibilität
    └── index.html
```

## 🚀 Lokaler Start

```bash
cd linkeswesen
python -m http.server 5500
```

Browser: `http://localhost:5500/`

## 🌐 GitHub Deployment

### Schritt 1: Repository erstellen
```bash
cd linkeswesen
git init
git add .
git commit -m "Initial commit: Sozialismus-Generator + Linkes Wesen"
```

### Schritt 2: Zu GitHub pushen
```bash
git remote add origin https://github.com/DEIN-USERNAME/linkeswesen.git
git branch -M main
git push -u origin main
```

### Schritt 3: GitHub Pages aktivieren
1. Repository → Settings → Pages
2. Source: `main` branch, `/` (root)
3. Save

**Fertig!** URL: `https://DEIN-USERNAME.github.io/linkeswesen/`

## 📊 Komponenten

### Generator
- Layer 1: 20 Grundfragen
- Layer 2: 26-Achsen-Kompass  
- Layer 3: Archetyp + Literatur

### Das Wesen
- 26-Achsen-Kompass (130 Positionen)
- Mediathek (923 Medien)
- Grundlagen (41 Essays)
- Personen (209 Denker*innen)

## 🔗 URLs

- Generator: `/`
- Wesen: `/haus/`
- Umleitung: `/linkes-wesen-26/`

---

**Für den demokratischen Sozialismus** 🚩
