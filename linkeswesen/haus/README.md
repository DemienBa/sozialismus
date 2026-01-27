# 🏛️ DAS LINKE WESEN - Modulare Version

**Stand:** 27. Januar 2026  
**Version:** 2.0 (Modular)

---

## 📦 WAS IST DAS?

Dies ist die **modularisierte Version** des Linken Wesens. Die vorher monolithische HTML-Datei (23.000 Zeilen!) wurde aufgeteilt in:

- **Saubere HTML-Struktur** (index.html, nur ~60 Zeilen)
- **Separate CSS-Dateien** (4 Module, insgesamt ~10.000 Zeilen)
- **Modulares JavaScript** (app.js + navigation.js)
- **Externe Daten** (grundlagen.json)

---

## 📂 STRUKTUR

```
linkes-wesen-FINAL/
├── index.html                  # Haupt-HTML (minimalistisch!)
│
├── css/
│   ├── base.css               # Variablen, Reset, Basis-Styles
│   ├── navigation.css         # Linsen-Palette, Menü
│   ├── ansichten.css          # Alle Ansichten (Wesen, Karte, etc.)
│   └── responsive.css         # Media Queries
│
├── js/
│   ├── app.js                 # Haupt-JavaScript
│   └── navigation.js          # Navigation-Funktionen
│
└── data/
    └── grundlagen.json        # Essays-Daten
```

---

## 🚀 LOKAL TESTEN

### **Option 1: Python HTTP Server** (Empfohlen!)
```bash
cd linkes-wesen-FINAL
python3 -m http.server 8000
```
Dann öffne: http://localhost:8000

### **Option 2: Direkt im Browser**
Einfach `index.html` doppelklicken - **ABER:** Manche Features funktionieren nur mit Server!

### **Option 3: Live Server (VS Code)**
1. Öffne den Ordner in VS Code
2. Installiere Extension "Live Server"
3. Rechtsklick auf index.html → "Open with Live Server"

---

## 📤 AUF SERVER HOCHLADEN

### **Mit SCP:**
```bash
scp -r linkes-wesen-FINAL/* user@linkeswesen.de:/var/www/linkeswesen/v2/
```

### **Mit FTP/SFTP:**
Kopiere den kompletten `linkes-wesen-FINAL` Ordner in dein Web-Verzeichnis.

### **WICHTIG:**
- Behalte die Ordnerstruktur bei!
- CSS/JS müssen in `css/` und `js/` liegen
- Relative Pfade sind wichtig

---

## ✅ CHECKLISTE: FUNKTIONIERT ALLES?

Nach dem Hochladen teste:

- [ ] **Navigation:** Linsen-Palette öffnet/schließt
- [ ] **Ansichten:** Alle 7 Ansichten funktionieren
  - [ ] Wesen (3D-Kugel)
  - [ ] Liste (Alphabetisch)
  - [ ] Karte (2D-Kompass)
  - [ ] Haus (WG-Metapher)
  - [ ] Netzwerk, Stammbaum, Ökosystem
- [ ] **Grundlagen:** Essays öffnen sich
- [ ] **Mediathek:** Ressourcen werden angezeigt
- [ ] **Personen:** Denker*innen-Profile öffnen
- [ ] **Filter:** Epochen-Filter funktioniert
- [ ] **Responsive:** Mobile-Ansicht OK

---

## 🐛 DEBUGGING

### **JavaScript-Fehler in der Konsole?**
Öffne Browser DevTools (F12) → Console

Häufige Fehler:
- **"Failed to load resource"** → Pfad stimmt nicht
- **"Unexpected token"** → Syntax-Fehler in JS
- **"Cannot read property"** → Daten fehlen

### **CSS lädt nicht?**
1. Prüfe Netzwerk-Tab (F12)
2. Sind die CSS-Dateien wirklich hochgeladen?
3. Server liefert korrekten MIME-Type? (`text/css`)

### **Funktionen fehlen?**
Manche Funktionen sind noch nicht modularisiert. Diese stehen noch in `app.js` und müssen eventuell separat geladen werden.

---

## 🔄 ZURÜCK ZUR ALTEN VERSION

Falls etwas nicht funktioniert:

```bash
# Backup ist hier:
/mnt/user-data/outputs/archive/backup_20260127_084228/

# Oder einfach die alte Datei wieder hochladen:
mediathek_FIXED_FINAL.html
```

**KEIN DATENVERLUST!** Alles ist gesichert! 🛡️

---

## 🎯 NÄCHSTE SCHRITTE (Phase 2)

- [ ] **Glossar einfügen** (100+ Begriffe)
- [ ] **Essays vervollständigen** (40 lange Texte)
- [ ] **Suchfunktion** über alles
- [ ] **ES6-Module** statt inline JS
- [ ] **Service Worker** (Offline-Fähigkeit)
- [ ] **PWA** (als App installierbar)

---

## 💡 HINWEISE

### **Performance:**
Die modulare Version lädt **schneller**, weil:
- Browser CSS/JS parallel laden kann
- Caching besser funktioniert
- Nur geänderte Dateien neu geladen werden

### **Wartung:**
Code ist jetzt **viel einfacher** zu warten:
- CSS-Bug? Nur eine Datei öffnen
- Neue Ansicht? Nur `ansichten.css` ändern
- Neue Navigation? Nur `navigation.js` anfassen

### **Debugging:**
Fehler sind **leichter zu finden**:
- Browser zeigt exakte Datei + Zeile
- Kleinere Dateien = schneller gefunden
- Source Maps möglich (später)

---

## 🙏 CREDITS

**Entwicklung:** Demien + Claude  
**Datum:** 2026-01-27  
**Lizenz:** Noch zu klären ;)

---

## 📞 SUPPORT

Bei Fragen oder Problemen:
- Backup wiederherstellen (siehe oben)
- Debug-Logs in Console checken
- Mir Bescheid sagen!

**Viel Erfolg mit der neuen Version! 🚀**
