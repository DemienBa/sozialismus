
// ERROR HANDLER
window.onerror = function(msg, url, line, col, error) {
  alert('FEHLER in Zeile ' + line + ':\n' + msg);
  console.error('Fehler:', msg, 'Zeile:', line);
  return false;
};

// ══════════════════════════════════════════════════════════════════════
// DATEN: KNOTEN (extern geladen)
// ══════════════════════════════════════════════════════════════════════

let knotenData = {};
let knotenDataLoaded = false;

console.log('🔄 Linkes Wesen 26-Achsen startet...');

// Lade Knoten-Daten aus externer JSON
async function loadKnotenData() {
  console.log('🔄 Lade Knoten-Daten...');
  
  try {
    // Versuche verschiedene Pfade
    const paths = [
      'data/knoten_content_26.json',
      './data/knoten_content_26.json',
      'data/knoten_content_26.json',
      'knoten_content_26.json'
    ];
    
    let data = null;
    let loadedPath = null;
    
    for (const path of paths) {
      try {
        console.log(`   Versuche: ${path}`);
        const response = await fetch(path);
        if (response.ok) {
          data = await response.json();
          loadedPath = path;
          break;
        } else {
          console.log(`   ✗ ${path}: Status ${response.status}`);
        }
      } catch (e) {
        console.log(`   ✗ ${path}: ${e.message}`);
        continue;
      }
    }
    
    if (data) {
      knotenData = data;
      knotenDataLoaded = true;
      console.log(`✅ ${Object.keys(knotenData).length} Knoten geladen von: ${loadedPath}`);
      
      // Initialisiere Ansichten die Knoten-Daten brauchen
      console.log('🔄 Initialisiere Ansichten...');
      
      try {
        if (typeof initNetzwerk === 'function') {
          initNetzwerk();
          console.log('   ✓ Netzwerk initialisiert');
        }
      } catch(e) { console.error('   ✗ Netzwerk:', e); }
      
      try {
        if (typeof initListe === 'function') {
          initListe();
          console.log('   ✓ Liste initialisiert');
        }
      } catch(e) { console.error('   ✗ Liste:', e); }
      
      try {
        if (typeof initKarte === 'function') {
          initKarte();
          console.log('   ✓ Karte initialisiert');
        }
      } catch(e) { console.error('   ✗ Karte:', e); }
      
      try {
        if (typeof initStammbaum === 'function') {
          initStammbaum();
          console.log('   ✓ Stammbaum initialisiert');
        }
      } catch(e) { console.error('   ✗ Stammbaum:', e); }
      
      try {
        if (typeof initOekosystem === 'function') {
          initOekosystem();
          console.log('   ✓ Ökosystem initialisiert');
        }
      } catch(e) { console.error('   ✗ Ökosystem:', e); }
      
      try {
        if (typeof initChemie === 'function') {
          initChemie();
          console.log('   ✓ Chemie initialisiert');
        }
      } catch(e) { console.error('   ✗ Chemie:', e); }
      
      // Stats aktualisieren
      const statsEl = document.getElementById('stats');
      if (statsEl) {
        statsEl.textContent = `${Object.keys(knotenData).length} Positionen · 26 Achsen`;
      }
      
      console.log('✅ Linkes Wesen bereit!');
    } else {
      console.error('❌ Keine Knoten-Daten gefunden!');
      console.error('   Stelle sicher dass knoten_content_26.json im data/-Ordner liegt.');
      console.error('   Ordnerstruktur sollte sein:');
      console.error('   📁 linkes-wesen-26/');
      console.error('   ├── index.html');
      console.error('   └── 📁 data/');
      console.error('       └── knoten_content_26.json');
    }
  } catch (error) {
    console.error('❌ Fehler beim Laden:', error);
  }
}

// Lade Zimmer-Beschreibungen
async function loadZimmerBeschreibungen() {
  try {
    const paths = [
      'data/zimmer_beschreibungen.json',
      './data/zimmer_beschreibungen.json'
    ];
    
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          // Extrahiere die zimmer-Daten aus der JSON-Struktur
          window.zimmerBeschreibungen = data.zimmer || data;
          window.stockwerkBeschreibungen = data.stockwerke || {};
          console.log(`✅ Zimmer-Beschreibungen geladen: ${Object.keys(window.zimmerBeschreibungen).length} Zimmer`);
          return;
        }
      } catch (e) {
        continue;
      }
    }
    console.warn('⚠ Zimmer-Beschreibungen nicht gefunden');
  } catch (error) {
    console.error('Fehler beim Laden der Zimmer-Beschreibungen:', error);
  }
}

// Lade Ressourcen-Datenbank
async function loadRessourcen() {
  try {
    const paths = [
      'data/ressourcen.json',
      './data/ressourcen.json'
    ];
    
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          window.ressourcenData = data.ressourcen || [];
          console.log(`✅ Ressourcen geladen: ${window.ressourcenData.length} Einträge`);
          return;
        }
      } catch (e) {
        continue;
      }
    }
    console.warn('⚠ Ressourcen nicht gefunden');
    window.ressourcenData = [];
  } catch (error) {
    console.error('Fehler beim Laden der Ressourcen:', error);
    window.ressourcenData = [];
  }
}

// Finde passende Ressourcen für eine Achse/Position/Handlungstyp
function findeRessourcen(achse, position, handlungstyp, tags = []) {
  if (!window.ressourcenData || window.ressourcenData.length === 0) return [];
  
  return window.ressourcenData.filter(r => {
    // Achse muss passen (wenn angegeben)
    if (achse && r.achsen && !r.achsen.includes(achse)) return false;
    
    // Position muss im Array sein (wenn angegeben)
    // WICHTIG: position ist eine Zahl (1-5), r.positionen ist ein Array
    if (position && r.positionen && !r.positionen.includes(parseInt(position))) return false;
    
    // Handlungstyp muss passen (wenn angegeben)
    if (handlungstyp && r.handlungstypen && !r.handlungstypen.includes(handlungstyp)) return false;
    
    // Mindestens ein Tag muss übereinstimmen (wenn Tags angegeben)
    if (tags.length > 0 && r.tags) {
      const hatPassendenTag = tags.some(t => r.tags.includes(t));
      if (!hatPassendenTag) return false;
    }
    
    return true;
  });
}

// Lade Satzbausteine für intelligente Textgenerierung
async function loadSatzbausteine() {
  try {
    const paths = [
      'data/satzbausteine.json',
      './data/satzbausteine.json'
    ];
    
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          window.satzbausteine = data;
          console.log(`✅ Satzbausteine geladen: ${Object.keys(data.positionen || {}).length} Positionen`);
          return;
        }
      } catch (e) {
        continue;
      }
    }
    console.warn('⚠ Satzbausteine nicht gefunden');
    window.satzbausteine = null;
  } catch (error) {
    console.error('Fehler beim Laden der Satzbausteine:', error);
    window.satzbausteine = null;
  }
}

// Starte Laden wenn DOM bereit
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadKnotenData();
    loadZimmerBeschreibungen();
    loadRessourcen();
    loadSatzbausteine();
    // Personen NICHT hier laden - wird später nach Netzwerk-Init geladen
  });
} else {
  // DOM ist schon bereit - kurz warten damit alle Skripte geladen sind
  setTimeout(() => {
    loadKnotenData();
    loadZimmerBeschreibungen();
    loadRessourcen();
    loadSatzbausteine();
    // Personen NICHT hier laden - wird später nach Netzwerk-Init geladen
  }, 100);
}

// Globale Zustandsvariablen (früh definiert, damit alle Funktionen darauf zugreifen können)
let aktiveAnsicht = 'wesen';
let aktiveFilter = new Set();
let epocheWert = 2025;
let personSpheresCreated = false; // Flag ob Personen-Sphären schon erstellt wurden

// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// DIE 26 ACHSEN - Definition für das neue System
// ═══════════════════════════════════════════════════════════════

window.achsenMeta = {
  '00': { id: '00', name: 'Reform/Revolution', kurzname: 'Strategie', pol_0: 'Revolution', pol_1: 'Reform', stockwerk: 'dachgeschoss', pole: ['Revolution', 'Hegemonie', 'Doppelstrategie', 'Strukturref.', 'Strikte Reform'] },
  '01': { id: '01', name: 'Eigentum', kurzname: 'Eigentum', pol_0: 'Staatsbesitz', pol_1: 'Commons', stockwerk: 'erdgeschoss', pole: ['Staatsbesitz', 'Öffentlich', 'Plurale Formen', 'Genossenschaften', 'Commons'] },
  '02': { id: '02', name: 'Planung', kurzname: 'Planung', pol_0: 'Vollplanung', pol_1: 'Reg. Markt', stockwerk: 'erdgeschoss', pole: ['Vollplanung', 'Demokrat. Plan', 'Marktsozialismus', 'Gemischt', 'Reg. Markt'] },
  '03': { id: '03', name: 'Sozialstaat', kurzname: 'Soziales', pol_0: 'BGE', pol_1: 'Aktivierend', stockwerk: 'erster_stock', pole: ['BGE', 'Sanktionsfrei', 'Garantiert', 'Modernisiert', 'Aktivierend'] },
  '04': { id: '04', name: 'Steuern', kurzname: 'Steuern', pol_0: 'Radikal', pol_1: 'Moderat', stockwerk: 'erster_stock', pole: ['Radikal', 'Vermögensst.', 'Progressiv', 'Moderat', 'Niedrig'] },
  '05': { id: '05', name: 'Wohnen', kurzname: 'Wohnen', pol_0: 'Enteignung', pol_1: 'Markt', stockwerk: 'erdgeschoss', pole: ['Dekommodifiz.', 'Öffentlich', 'Mietregulierung', 'Mehr bauen', 'Markt'] },
  '06': { id: '06', name: 'Gesundheit', kurzname: 'Gesundheit', pol_0: 'Öffentlich', pol_1: 'Privat', stockwerk: 'erster_stock', pole: ['Voll öffentlich', 'Bürgerversich.', 'Krankenkasse', 'Wettbewerb', 'Privat'] },
  '07': { id: '07', name: 'Bildung', kurzname: 'Bildung', pol_0: 'Radikal', pol_1: 'Vielfalt', stockwerk: 'erster_stock', pole: ['Radikal demokr.', 'Gesamtschule', 'Kostenlos', 'Reform', 'Vielfalt'] },
  '08': { id: '08', name: 'Ökologie', kurzname: 'Ökologie', pol_0: 'Ökomodernismus', pol_1: 'Tiefenökologie', stockwerk: 'souterrain', pole: ['Ökomodernismus', 'Grüner Soz.', 'Ökosozialismus', 'Degrowth', 'Tiefenökologie'] },
  '09': { id: '09', name: 'Feminismus', kurzname: 'Feminismus', pol_0: 'Klassenfem.', pol_1: 'Radikal', stockwerk: 'souterrain', pole: ['Klassenfem.', 'Sozialist.', 'Reprod.-Theorie', 'Intersekt.', 'Radikal'] },
  '10': { id: '10', name: 'Antirassismus', kurzname: 'Antira', pol_0: 'Klassenkampf', pol_1: 'Eigenständig', stockwerk: 'souterrain', pole: ['Klassenkampf', 'Klasse+Anti', 'Strukturell', 'Dekolonial', 'Eigenständig'] },
  '11': { id: '11', name: 'Technologie', kurzname: 'Tech', pol_0: 'Skepsis', pol_1: 'Akzeleration', stockwerk: 'souterrain', pole: ['Tech-Skepsis', 'Demokratisieren', 'Aneignen', 'Optimismus', 'Akzeleration'] },
  '12': { id: '12', name: 'Demokratie', kurzname: 'Demokratie', pol_0: 'Rätedemokratie', pol_1: 'Parlament', stockwerk: 'erster_stock', pole: ['Rätedemokratie', 'Basisdemo', 'Radikal', 'Erweitert', 'Parlament'] },
  '13': { id: '13', name: 'Aktionsformen', kurzname: 'Aktion', pol_0: 'Militanz', pol_1: 'Legal', stockwerk: 'keller', pole: ['Militanz', 'Direkte Aktion', 'Ziv. Ungehorsam', 'Symbolisch', 'Nur legal'] },
  '14': { id: '14', name: 'Kulturkampf', kurzname: 'Kultur', pol_0: 'Klasse zuerst', pol_1: 'Identität', stockwerk: 'dachgeschoss', pole: ['Klasse zuerst', 'Klasse+', 'Verbindend', 'Intersekt.', 'Identität'] },
  '15': { id: '15', name: 'EU', kurzname: 'EU', pol_0: 'Lexit', pol_1: 'Föd. Europa', stockwerk: 'keller', pole: ['Lexit', 'Dagegen kämpfen', 'Demokratisieren', 'Soziales Europa', 'Föd. Europa'] },
  '16': { id: '16', name: 'Arbeit', kurzname: 'Arbeit', pol_0: 'Vollbesch.', pol_1: 'Post-Work', stockwerk: 'erdgeschoss', pole: ['Vollbesch.', 'Gute Arbeit', 'AZ-Verkürzung', 'Grundeinkommen', 'Post-Work'] },
  '17': { id: '17', name: 'Wachstum', kurzname: 'Wachstum', pol_0: 'Degrowth', pol_1: 'Grün. Wachstum', stockwerk: 'dachgeschoss', pole: ['Degrowth', 'Post-Wachstum', 'Selektiv', 'Nachhaltig', 'Grün. Wachstum'] },
  '18': { id: '18', name: 'Nahost', kurzname: 'Nahost', pol_0: 'Pro-Palästina', pol_1: 'Pro-Israel', stockwerk: 'keller', pole: ['Pro-Palästina', 'Pal.-solidarisch', 'Völkerrecht', 'Israel-solid.', 'Pro-Israel'] },
  '19': { id: '19', name: 'Migration', kurzname: 'Migration', pol_0: 'Link. Nation.', pol_1: 'No Border', stockwerk: 'keller', pole: ['Link. Nation.', 'International', 'Proletarisch', 'Antiimperial.', 'No Border'] },
  '20': { id: '20', name: 'Digitalität', kurzname: 'Digital', pol_0: 'Commons', pol_1: 'Regulierung', stockwerk: 'erdgeschoss', pole: ['Dig. Commons', 'Plattform-Soz.', 'Starke Regul.', 'Datensouverän.', 'Lib. Regulierung'] },
  '21': { id: '21', name: 'Care', kurzname: 'Care', pol_0: 'Vergesellsch.', pol_1: 'Familie', stockwerk: 'souterrain', pole: ['Vergesellsch.', 'Öffentlich', 'Aufwerten', 'Flexibel', 'Familie'] },
  '22': { id: '22', name: 'Land/Stadt', kurzname: 'Land/Stadt', pol_0: 'Dezentral', pol_1: 'Urban', stockwerk: 'keller', pole: ['Dezentral', 'Gleichwertig', 'Beide stärken', 'Städte progressiv', 'Urban'] },
  '23': { id: '23', name: 'Geschichte', kurzname: 'Geschichte', pol_0: 'Kritisch', pol_1: 'Verteidigen', stockwerk: 'dachgeschoss', pole: ['Kritisch', 'Differenziert', 'Pragmatisch', 'Gegen Angriffe', 'Verteidigen'] },
  '24': { id: '24', name: 'Geopolitik', kurzname: 'Geopolitik', pol_0: 'Anti-West', pol_1: 'Pro-West', stockwerk: 'dachgeschoss', pole: ['Anti-Hegemonie', 'Alle Imperien', 'Antimilitarist.', 'Demokratien', 'Pro-West'] },
  '25': { id: '25', name: 'Spiritualität', kurzname: 'Zukunft', pol_0: 'Pessimismus', pol_1: 'Utopie', stockwerk: 'dachgeschoss', pole: ['Pessimismus', 'Krit. Realismus', 'Dialektisch', 'Revolutionär', 'Utopie'] }
};

window.stockwerke = {
  dachgeschoss: { name: 'Dachgeschoss', untertitel: 'Visionen & Strategie', icon: '🏔️', achsen: ['00', '17', '14', '23', '24', '25'], farbe: '#7c4dff' },
  erster_stock: { name: 'Erster Stock', untertitel: 'Staat & Demokratie', icon: '🏛️', achsen: ['03', '04', '06', '07', '12'], farbe: '#2196F3' },
  erdgeschoss: { name: 'Erdgeschoss', untertitel: 'Ökonomie & Eigentum', icon: '🏠', achsen: ['01', '02', '05', '16', '20'], farbe: '#E53935' },
  souterrain: { name: 'Souterrain', untertitel: 'Gesellschaft & Natur', icon: '🌍', achsen: ['08', '09', '10', '11', '21'], farbe: '#4CAF50' },
  keller: { name: 'Keller', untertitel: 'Praxis & Internationale', icon: '🔧', achsen: ['13', '15', '18', '19', '22'], farbe: '#FF9800' }
};

// Alle 26 Achsen als Array
window.ACHSEN_26 = [
  { id: '00', name: 'Reform/Revolution', stockwerk: 'dachgeschoss' },
  { id: '01', name: 'Eigentum', stockwerk: 'erdgeschoss' },
  { id: '02', name: 'Planung', stockwerk: 'erdgeschoss' },
  { id: '03', name: 'Sozialstaat', stockwerk: 'erster_stock' },
  { id: '04', name: 'Steuern', stockwerk: 'erster_stock' },
  { id: '05', name: 'Wohnen', stockwerk: 'erdgeschoss' },
  { id: '06', name: 'Gesundheit', stockwerk: 'erster_stock' },
  { id: '07', name: 'Bildung', stockwerk: 'erster_stock' },
  { id: '08', name: 'Ökologie', stockwerk: 'souterrain' },
  { id: '09', name: 'Feminismus', stockwerk: 'souterrain' },
  { id: '10', name: 'Antirassismus', stockwerk: 'souterrain' },
  { id: '11', name: 'Technologie', stockwerk: 'souterrain' },
  { id: '12', name: 'Demokratie', stockwerk: 'erster_stock' },
  { id: '13', name: 'Aktionsformen', stockwerk: 'keller' },
  { id: '14', name: 'Kulturkampf', stockwerk: 'dachgeschoss' },
  { id: '15', name: 'EU', stockwerk: 'keller' },
  { id: '16', name: 'Arbeit', stockwerk: 'erdgeschoss' },
  { id: '17', name: 'Wachstum', stockwerk: 'dachgeschoss' },
  { id: '18', name: 'Nahost', stockwerk: 'keller' },
  { id: '19', name: 'Migration', stockwerk: 'keller' },
  { id: '20', name: 'Digitalität', stockwerk: 'erdgeschoss' },
  { id: '21', name: 'Care', stockwerk: 'souterrain' },
  { id: '22', name: 'Land/Stadt', stockwerk: 'keller' },
  { id: '23', name: 'Geschichte', stockwerk: 'dachgeschoss' },
  { id: '24', name: 'Geopolitik', stockwerk: 'dachgeschoss' },
  { id: '25', name: 'Spiritualität', stockwerk: 'dachgeschoss' }
];

console.log('✓ 26-Achsen-System geladen');



// ═══════════════════════════════════════════════════════════════
// ARCHETYPEN mit 26-Achsen-Profilen
// ═══════════════════════════════════════════════════════════════
window.archetypen = {
  marxismus_leninismus: { 
    name: "Orthodoxer Marxismus-Leninismus", 
    icon: "☭", 
    slogan: "Alle Macht den Räten!", 
    farbe: "#B71C1C",
    ideal: {'00':0.8, '01':0.9, '02':0.9, '03':0.6, '04':0.8, '05':0.8, '06':0.8, '07':0.6, '08':0.5, '09':0.4, '10':0.5, '11':0.5, '12':0.7, '13':0.6, '14':0.2, '15':0.3, '16':0.4, '17':0.5, '18':0.3, '19':0.6, '20':0.6, '21':0.5, '22':0.5, '23':0.7, '24':0.3, '25':0.1}
  },
  libertaerer_sozialismus: { 
    name: "Libertärer Sozialismus", 
    icon: "Ⓐ", 
    slogan: "Keine Götter, keine Herren!", 
    farbe: "#212121",
    ideal: {'00':0.8, '01':0.9, '02':0.4, '03':0.8, '04':0.7, '05':0.9, '06':0.8, '07':0.9, '08':0.8, '09':0.8, '10':0.8, '11':0.4, '12':0.9, '13':0.7, '14':0.5, '15':0.2, '16':0.8, '17':0.8, '18':0.4, '19':0.9, '20':0.7, '21':0.8, '22':0.3, '23':0.6, '24':0.2, '25':0.5}
  },
  raetekommunismus: { 
    name: "Rätekommunismus", 
    icon: "⚙️", 
    slogan: "Die Befreiung ist das Werk der Arbeiter selbst!", 
    farbe: "#C62828",
    ideal: {'00':0.9, '01':0.9, '02':0.7, '03':0.7, '04':0.8, '05':0.8, '06':0.8, '07':0.7, '08':0.6, '09':0.5, '10':0.6, '11':0.5, '12':0.9, '13':0.6, '14':0.3, '15':0.2, '16':0.6, '17':0.6, '18':0.4, '19':0.7, '20':0.6, '21':0.6, '22':0.4, '23':0.5, '24':0.3, '25':0.2}
  },
  oekosozialismus: { 
    name: "Ökosozialismus", 
    icon: "🌍", 
    slogan: "System Change, Not Climate Change!", 
    farbe: "#2E7D32",
    ideal: {'00':0.7, '01':0.8, '02':0.6, '03':0.7, '04':0.8, '05':0.8, '06':0.7, '07':0.7, '08':0.95, '09':0.7, '10':0.7, '11':0.4, '12':0.7, '13':0.6, '14':0.5, '15':0.4, '16':0.8, '17':0.9, '18':0.5, '19':0.7, '20':0.5, '21':0.8, '22':0.3, '23':0.6, '24':0.4, '25':0.5}
  },
  feministischer_sozialismus: { 
    name: "Feministischer Sozialismus", 
    icon: "♀", 
    slogan: "Das Private ist politisch!", 
    farbe: "#7B1FA2",
    ideal: {'00':0.6, '01':0.7, '02':0.5, '03':0.8, '04':0.7, '05':0.7, '06':0.8, '07':0.8, '08':0.7, '09':0.95, '10':0.8, '11':0.5, '12':0.7, '13':0.5, '14':0.7, '15':0.5, '16':0.8, '17':0.7, '18':0.5, '19':0.8, '20':0.6, '21':0.95, '22':0.5, '23':0.7, '24':0.5, '25':0.5}
  },
  demokratischer_sozialismus: { 
    name: "Demokratischer Sozialismus", 
    icon: "🌹", 
    slogan: "Sozialismus ist radikale Demokratie!", 
    farbe: "#E91E63",
    ideal: {'00':0.3, '01':0.5, '02':0.4, '03':0.7, '04':0.6, '05':0.6, '06':0.7, '07':0.6, '08':0.6, '09':0.6, '10':0.6, '11':0.6, '12':0.6, '13':0.3, '14':0.5, '15':0.7, '16':0.5, '17':0.5, '18':0.5, '19':0.6, '20':0.6, '21':0.6, '22':0.5, '23':0.5, '24':0.6, '25':0.5}
  },
  autonomismus: { 
    name: "Autonomer Sozialismus", 
    icon: "🏴", 
    slogan: "Wir sind überall!", 
    farbe: "#37474F",
    ideal: {'00':0.8, '01':0.8, '02':0.3, '03':0.7, '04':0.7, '05':0.9, '06':0.7, '07':0.8, '08':0.8, '09':0.8, '10':0.8, '11':0.4, '12':0.8, '13':0.8, '14':0.6, '15':0.2, '16':0.8, '17':0.8, '18':0.4, '19':0.9, '20':0.6, '21':0.8, '22':0.4, '23':0.6, '24':0.3, '25':0.4}
  },
  municipalismus: { 
    name: "Libertärer Kommunalismus", 
    icon: "🌻", 
    slogan: "Denke global, handle lokal!", 
    farbe: "#8BC34A",
    ideal: {'00':0.7, '01':0.8, '02':0.4, '03':0.7, '04':0.7, '05':0.9, '06':0.7, '07':0.8, '08':0.9, '09':0.7, '10':0.7, '11':0.4, '12':0.9, '13':0.5, '14':0.5, '15':0.2, '16':0.7, '17':0.8, '18':0.5, '19':0.7, '20':0.5, '21':0.8, '22':0.2, '23':0.5, '24':0.3, '25':0.6}
  },
  buen_vivir: { 
    name: "Postkolonialer Sozialismus", 
    icon: "✊🏾", 
    slogan: "Hasta la victoria siempre!", 
    farbe: "#795548",
    ideal: {'00':0.7, '01':0.8, '02':0.5, '03':0.7, '04':0.8, '05':0.8, '06':0.7, '07':0.7, '08':0.8, '09':0.7, '10':0.95, '11':0.4, '12':0.7, '13':0.7, '14':0.6, '15':0.3, '16':0.7, '17':0.7, '18':0.3, '19':0.9, '20':0.5, '21':0.7, '22':0.4, '23':0.8, '24':0.2, '25':0.7}
  },
  eurokommunismus: { 
    name: "Reformorientierter Sozialismus", 
    icon: "📜", 
    slogan: "Der Weg ist das Ziel!", 
    farbe: "#FF7043",
    ideal: {'00':0.2, '01':0.4, '02':0.4, '03':0.6, '04':0.5, '05':0.5, '06':0.6, '07':0.5, '08':0.5, '09':0.5, '10':0.5, '11':0.6, '12':0.5, '13':0.2, '14':0.5, '15':0.7, '16':0.4, '17':0.4, '18':0.5, '19':0.5, '20':0.6, '21':0.5, '22':0.5, '23':0.4, '24':0.7, '25':0.5}
  },
  postwachstum: {
    name: "Postwachstums-Sozialismus",
    icon: "🌱",
    slogan: "Weniger ist mehr!",
    farbe: "#4CAF50",
    ideal: {'00':0.5, '01':0.7, '02':0.5, '03':0.8, '04':0.7, '05':0.8, '06':0.7, '07':0.7, '08':0.9, '09':0.7, '10':0.6, '11':0.3, '12':0.7, '13':0.4, '14':0.5, '15':0.4, '16':0.9, '17':0.95, '18':0.5, '19':0.6, '20':0.4, '21':0.8, '22':0.3, '23':0.6, '24':0.4, '25':0.6}
  },
  care_revolution: {
    name: "Care-Revolutionär*in",
    icon: "💜",
    slogan: "Sorge ist politisch!",
    farbe: "#9C27B0",
    ideal: {'00':0.6, '01':0.7, '02':0.5, '03':0.9, '04':0.7, '05':0.8, '06':0.9, '07':0.8, '08':0.7, '09':0.9, '10':0.7, '11':0.5, '12':0.7, '13':0.4, '14':0.6, '15':0.5, '16':0.8, '17':0.7, '18':0.5, '19':0.8, '20':0.5, '21':0.95, '22':0.5, '23':0.6, '24':0.5, '25':0.5}
  }
};


// ═══════════════════════════════════════════════════════════════
// // ══════════════════════════════════════════════════════════════════════
// STAMMBAUM: Genealogie der Ideen
// ══════════════════════════════════════════════════════════════════════

const stammbaumData = {
  epochen: [
    { id: "aufklaerung", name: "Aufklärung", zeit: "1750-1800", farbe: "#FFE082", y: 0,
      beschreibung: "Die Wurzeln: Vernunft, Fortschritt, Gleichheit" },
    { id: "fruehsozialismus", name: "Utopischer Sozialismus", zeit: "1800-1848", farbe: "#A5D6A7", y: 1,
      beschreibung: "Die Träumer: Saint-Simon, Fourier, Owen" },
    { id: "klassiker", name: "Wissenschaftlicher Sozialismus", zeit: "1848-1890", farbe: "#E53935", y: 2,
      beschreibung: "Marx und Engels systematisieren die Kritik" },
    { id: "zweite_int", name: "Zweite Internationale", zeit: "1889-1914", farbe: "#EF5350", y: 3,
      beschreibung: "Massenparteien und der große Streit" },
    { id: "revolution", name: "Revolutionszeit", zeit: "1917-1945", farbe: "#D32F2F", y: 4,
      beschreibung: "Revolutionen, Faschismus, Weltkriege" },
    { id: "nachkrieg", name: "Nachkriegslinke", zeit: "1945-1989", farbe: "#7986CB", y: 5,
      beschreibung: "Kalter Krieg, 68er, Befreiungsbewegungen" },
    { id: "gegenwart", name: "Gegenwart", zeit: "1989-heute", farbe: "#4FC3F7", y: 6,
      beschreibung: "Nach dem Fall der Mauer: Klimakrise, Prekarität" }
  ],
  
  stroemungen: [
    // Aufklärung
    { id: "rousseau", name: "Rousseau", epoche: "aufklaerung", x: -0.5, 
      kernidee: "Der Mensch ist gut, die Gesellschaft verdirbt ihn",
      leben: "1712-1778", werke: ["Gesellschaftsvertrag", "Émile"] },
    { id: "kant", name: "Kant", epoche: "aufklaerung", x: 0.5,
      kernidee: "Aufklärung ist der Ausgang aus selbstverschuldeter Unmündigkeit",
      leben: "1724-1804", werke: ["Kritik der reinen Vernunft"] },
    { id: "smith", name: "Adam Smith", epoche: "aufklaerung", x: 1.5,
      kernidee: "Arbeitswerttheorie, unsichtbare Hand",
      leben: "1723-1790", werke: ["Wealth of Nations"] },
    { id: "hegel", name: "Hegel", epoche: "aufklaerung", x: 0, wichtig: true,
      kernidee: "Dialektik: These, Antithese, Synthese",
      leben: "1770-1831", werke: ["Phänomenologie des Geistes"] },
    { id: "paine", name: "Thomas Paine", epoche: "aufklaerung", x: -1,
      kernidee: "Menschenrechte, Volkssouveränität",
      leben: "1737-1809", werke: ["Rights of Man"] },
    
    // Frühsozialismus  
    { id: "saint-simon", name: "Saint-Simon", epoche: "fruehsozialismus", x: -1,
      kernidee: "Die Industrie soll von Produzenten gelenkt werden",
      leben: "1760-1825", werke: ["Nouveau Christianisme"] },
    { id: "fourier", name: "Fourier", epoche: "fruehsozialismus", x: 0,
      kernidee: "Phalanstères: Leidenschaft statt Zwang",
      leben: "1772-1837", werke: ["Theorie der vier Bewegungen"] },
    { id: "owen", name: "Robert Owen", epoche: "fruehsozialismus", x: 0.8,
      kernidee: "New Harmony: Modellkommunen beweisen Möglichkeit",
      leben: "1771-1858", werke: ["A New View of Society"] },
    { id: "proudhon", name: "Proudhon", epoche: "fruehsozialismus", x: 2, wichtig: true,
      kernidee: "Eigentum ist Diebstahl, Mutualism",
      leben: "1809-1865", werke: ["Was ist Eigentum?"] },
    { id: "blanqui", name: "Blanqui", epoche: "fruehsozialismus", x: 1.5,
      kernidee: "Revolutionärer Putschismus, Diktatur der Minderheit",
      leben: "1805-1881", werke: ["Instruktion für den Aufstand"] },
    { id: "weitling", name: "Weitling", epoche: "fruehsozialismus", x: -0.5,
      kernidee: "Handwerker-Kommunismus, christlicher Sozialismus",
      leben: "1808-1871", werke: ["Garantien der Harmonie"] },
      
    // Klassiker
    { id: "marx", name: "Karl Marx", epoche: "klassiker", x: 0, wichtig: true,
      kernidee: "Historischer Materialismus, Mehrwert, Klassenkampf",
      leben: "1818-1883", werke: ["Das Kapital", "Kommunistisches Manifest", "Grundrisse"] },
    { id: "engels", name: "Friedrich Engels", epoche: "klassiker", x: 0.4,
      kernidee: "Dialektik der Natur, Ursprung der Familie",
      leben: "1820-1895", werke: ["Anti-Dühring", "Ursprung der Familie"] },
    { id: "bakunin", name: "Michail Bakunin", epoche: "klassiker", x: 2, wichtig: true,
      kernidee: "Alle Staaten sind Unterdrücker, Freiheit durch Zerstörung",
      leben: "1814-1876", werke: ["Gott und der Staat", "Staatlichkeit und Anarchie"] },
    { id: "kropotkin", name: "Kropotkin", epoche: "klassiker", x: 2.4,
      kernidee: "Gegenseitige Hilfe als Evolutionsprinzip",
      leben: "1842-1921", werke: ["Gegenseitige Hilfe", "Die Eroberung des Brotes"] },
    { id: "lassalle", name: "Lassalle", epoche: "klassiker", x: -1,
      kernidee: "Allgemeiner Deutscher Arbeiterverein, Staatssozialismus",
      leben: "1825-1864", werke: ["Arbeiterprogramm"] },
    { id: "dietzgen", name: "Dietzgen", epoche: "klassiker", x: 0.2,
      kernidee: "Proletarische Philosophie",
      leben: "1828-1888", werke: ["Das Wesen der menschlichen Kopfarbeit"] },
      
    // Zweite Internationale
    { id: "kautsky", name: "Kautsky", epoche: "zweite_int", x: -1,
      kernidee: "Orthodoxer Marxismus, Erfurt-Programm",
      leben: "1854-1938", werke: ["Die Agrarfrage", "Der Weg zur Macht"] },
    { id: "bernstein", name: "Bernstein", epoche: "zweite_int", x: -2,
      kernidee: "Revisionismus: Evolution statt Revolution",
      leben: "1850-1932", werke: ["Die Voraussetzungen des Sozialismus"] },
    { id: "luxemburg", name: "Rosa Luxemburg", epoche: "zweite_int", x: 0.5, wichtig: true,
      kernidee: "Massenstreik, Spontaneität, Freiheit der Andersdenkenden",
      leben: "1871-1919", werke: ["Akkumulation des Kapitals", "Sozialreform oder Revolution"] },
    { id: "bebel", name: "August Bebel", epoche: "zweite_int", x: -1.5,
      kernidee: "Die Frau und der Sozialismus",
      leben: "1840-1913", werke: ["Die Frau und der Sozialismus"] },
    { id: "zetkin", name: "Clara Zetkin", epoche: "zweite_int", x: -0.5,
      kernidee: "Proletarischer Feminismus, Internationaler Frauentag",
      leben: "1857-1933", werke: ["Die Arbeiterinnen- und Frauenfrage"] },
    { id: "jaures", name: "Jean Jaurès", epoche: "zweite_int", x: -1.8,
      kernidee: "Sozialistischer Humanismus, Pazifismus",
      leben: "1859-1914", werke: ["Histoire socialiste"] },
    { id: "sorel", name: "Georges Sorel", epoche: "zweite_int", x: 1.5,
      kernidee: "Mythos des Generalstreiks, revolutionäre Gewalt",
      leben: "1847-1922", werke: ["Über die Gewalt"] },
    { id: "plechanow", name: "Plechanow", epoche: "zweite_int", x: -0.8,
      kernidee: "Vater des russischen Marxismus",
      leben: "1856-1918", werke: ["Die Entwicklung der monistischen Geschichtsauffassung"] },
    { id: "liebknecht_w", name: "W. Liebknecht", epoche: "zweite_int", x: -1.3,
      kernidee: "Mitgründer SPD, Kriegsgegner",
      leben: "1826-1900", werke: [] },
    { id: "mehring", name: "Franz Mehring", epoche: "zweite_int", x: -0.3,
      kernidee: "Marxistischer Historiker und Kritiker",
      leben: "1846-1919", werke: ["Karl Marx. Geschichte seines Lebens"] },
    { id: "malatesta", name: "Errico Malatesta", epoche: "zweite_int", x: 2.2,
      kernidee: "Anarchistischer Kommunismus, Gradualismus",
      leben: "1853-1932", werke: ["L'Anarchia"] },
      
    // Revolutionszeit
    { id: "lenin", name: "Lenin", epoche: "revolution", x: -0.5, wichtig: true,
      kernidee: "Avantgarde-Partei, Imperialismus, Staat und Revolution",
      leben: "1870-1924", werke: ["Was tun?", "Staat und Revolution", "Imperialismus"] },
    { id: "trotzki", name: "Leo Trotzki", epoche: "revolution", x: 0,
      kernidee: "Permanente Revolution, Kritik der Bürokratie",
      leben: "1879-1940", werke: ["Die permanente Revolution", "Verratene Revolution"] },
    { id: "stalin", name: "Stalin", epoche: "revolution", x: -1.5,
      kernidee: "Sozialismus in einem Land, Planwirtschaft",
      leben: "1878-1953", werke: ["Über dialektischen und historischen Materialismus"] },
    { id: "gramsci", name: "Antonio Gramsci", epoche: "revolution", x: 0.5, wichtig: true,
      kernidee: "Hegemonie, organische Intellektuelle, Stellungskrieg",
      leben: "1891-1937", werke: ["Gefängnishefte"] },
    { id: "lukacs", name: "Georg Lukács", epoche: "revolution", x: 0.3,
      kernidee: "Verdinglichung, Totalität, Geschichte und Klassenbewusstsein",
      leben: "1885-1971", werke: ["Geschichte und Klassenbewusstsein"] },
    { id: "korsch", name: "Karl Korsch", epoche: "revolution", x: 0.7,
      kernidee: "Marxismus und Philosophie, Rätekommunismus",
      leben: "1886-1961", werke: ["Marxismus und Philosophie"] },
    { id: "mao", name: "Mao Zedong", epoche: "revolution", x: -1,
      kernidee: "Bauernrevolution, Widerspruchslehre, Kulturrevolution",
      leben: "1893-1976", werke: ["Über den Widerspruch", "Über die Praxis"] },
    { id: "goldman", name: "Emma Goldman", epoche: "revolution", x: 2, wichtig: true,
      kernidee: "Anarcha-Feminismus, freie Liebe, direkte Aktion",
      leben: "1869-1940", werke: ["Anarchism and Other Essays", "Living My Life"] },
    { id: "cnt", name: "CNT-FAI", epoche: "revolution", x: 2.5,
      kernidee: "Anarchosyndikalismus, Spanische Revolution",
      leben: "1910-1939", werke: [] },
    { id: "liebknecht_k", name: "Karl Liebknecht", epoche: "revolution", x: 0.2,
      kernidee: "Spartakusbund, Der Hauptfeind steht im eigenen Land",
      leben: "1871-1919", werke: ["Militarismus und Antimilitarismus"] },
    { id: "pannekoek", name: "Anton Pannekoek", epoche: "revolution", x: 0.8,
      kernidee: "Rätekommunismus, Arbeiterräte",
      leben: "1873-1960", werke: ["Arbeiterräte"] },
    { id: "bloch", name: "Ernst Bloch", epoche: "revolution", x: 0.4, wichtig: true,
      kernidee: "Prinzip Hoffnung, konkrete Utopie",
      leben: "1885-1977", werke: ["Das Prinzip Hoffnung", "Geist der Utopie"] },
    { id: "benjamin", name: "Walter Benjamin", epoche: "revolution", x: 0.6, wichtig: true,
      kernidee: "Geschichtsphilosophie, Aura, dialektisches Bild",
      leben: "1892-1940", werke: ["Über den Begriff der Geschichte", "Das Kunstwerk..."] },
    { id: "kollontai", name: "Alexandra Kollontai", epoche: "revolution", x: -0.3,
      kernidee: "Kommunistischer Feminismus, freie Liebe",
      leben: "1872-1952", werke: ["Die neue Moral und die Arbeiterklasse"] },
    { id: "mariategui", name: "Mariátegui", epoche: "revolution", x: -0.8,
      kernidee: "Indigener Marxismus, Lateinamerikanischer Sozialismus",
      leben: "1894-1930", werke: ["Sieben Essays zur Interpretation der peruanischen Wirklichkeit"] },
    { id: "ho", name: "Ho Chi Minh", epoche: "revolution", x: -1.2,
      kernidee: "Antikolonialer Kommunismus",
      leben: "1890-1969", werke: ["Der Weg der Revolution"] },
    { id: "cabral", name: "Amílcar Cabral", epoche: "revolution", x: 1.3,
      kernidee: "Nationale Befreiung, Kultur als Widerstand",
      leben: "1924-1973", werke: ["Die Waffe der Theorie"] },
      
    // Nachkrieg
    { id: "adorno", name: "Theodor W. Adorno", epoche: "nachkrieg", x: 0, wichtig: true,
      kernidee: "Dialektik der Aufklärung, Kulturindustrie, Negative Dialektik",
      leben: "1903-1969", werke: ["Negative Dialektik", "Dialektik der Aufklärung"] },
    { id: "horkheimer", name: "Max Horkheimer", epoche: "nachkrieg", x: -0.3,
      kernidee: "Kritische Theorie, Instrumentelle Vernunft",
      leben: "1895-1973", werke: ["Kritik der instrumentellen Vernunft"] },
    { id: "marcuse", name: "Herbert Marcuse", epoche: "nachkrieg", x: 0.5, wichtig: true,
      kernidee: "Der eindimensionale Mensch, Große Verweigerung, Eros",
      leben: "1898-1979", werke: ["Der eindimensionale Mensch", "Triebstruktur und Gesellschaft"] },
    { id: "beauvoir", name: "Simone de Beauvoir", epoche: "nachkrieg", x: 1, wichtig: true,
      kernidee: "Man wird nicht als Frau geboren, sondern dazu gemacht",
      leben: "1908-1986", werke: ["Das andere Geschlecht"] },
    { id: "fanon", name: "Frantz Fanon", epoche: "nachkrieg", x: 1.5, wichtig: true,
      kernidee: "Die Verdammten dieser Erde, Entkolonialisierung durch Gewalt",
      leben: "1925-1961", werke: ["Die Verdammten dieser Erde", "Schwarze Haut, weiße Masken"] },
    { id: "che", name: "Che Guevara", epoche: "nachkrieg", x: -1,
      kernidee: "Fokismus, der Neue Mensch, internationalistischer Kampf",
      leben: "1928-1967", werke: ["Guerillakrieg", "Der neue Mensch"] },
    { id: "althusser", name: "Louis Althusser", epoche: "nachkrieg", x: -0.5,
      kernidee: "Ideologische Staatsapparate, epistemologischer Bruch",
      leben: "1918-1990", werke: ["Für Marx", "Ideologie und ideologische Staatsapparate"] },
    { id: "poulantzas", name: "Nicos Poulantzas", epoche: "nachkrieg", x: -0.7,
      kernidee: "Relationale Staatstheorie, strukturaler Marxismus",
      leben: "1936-1979", werke: ["Staatstheorie"] },
    { id: "bookchin", name: "Murray Bookchin", epoche: "nachkrieg", x: 2, wichtig: true,
      kernidee: "Soziale Ökologie, libertärer Kommunalismus",
      leben: "1921-2006", werke: ["Die Ökologie der Freiheit"] },
    { id: "davis", name: "Angela Davis", epoche: "nachkrieg", x: 1.2, wichtig: true,
      kernidee: "Gefängnis-industrieller Komplex, Intersektionalität",
      leben: "1944-", werke: ["Are Prisons Obsolete?", "Women, Race & Class"] },
    { id: "james_clr", name: "C.L.R. James", epoche: "nachkrieg", x: 0.8,
      kernidee: "Schwarzer Marxismus, Die schwarzen Jakobiner",
      leben: "1901-1989", werke: ["Die schwarzen Jakobiner"] },
    { id: "fromm", name: "Erich Fromm", epoche: "nachkrieg", x: 0.3,
      kernidee: "Humanistischer Marxismus, Haben oder Sein",
      leben: "1900-1980", werke: ["Haben oder Sein", "Die Furcht vor der Freiheit"] },
    { id: "sartre", name: "Jean-Paul Sartre", epoche: "nachkrieg", x: 0.6,
      kernidee: "Existentialistischer Marxismus",
      leben: "1905-1980", werke: ["Kritik der dialektischen Vernunft"] },
    { id: "mandel", name: "Ernest Mandel", epoche: "nachkrieg", x: -0.8,
      kernidee: "Spätkapitalismus, lange Wellen",
      leben: "1923-1995", werke: ["Der Spätkapitalismus"] },
    { id: "debord", name: "Guy Debord", epoche: "nachkrieg", x: 1.8,
      kernidee: "Die Gesellschaft des Spektakels, Situationismus",
      leben: "1931-1994", werke: ["Die Gesellschaft des Spektakels"] },
    { id: "gorz", name: "André Gorz", epoche: "nachkrieg", x: 1.3,
      kernidee: "Ökosozialismus, Kritik der Arbeit",
      leben: "1923-2007", werke: ["Kritik der ökonomischen Vernunft"] },
    { id: "illich", name: "Ivan Illich", epoche: "nachkrieg", x: 1.6,
      kernidee: "Entschulung, Konvivialität, Werkzeugkritik",
      leben: "1926-2002", werke: ["Entschulung der Gesellschaft"] },
    { id: "freire", name: "Paulo Freire", epoche: "nachkrieg", x: 1.4,
      kernidee: "Pädagogik der Unterdrückten, dialogische Bildung",
      leben: "1921-1997", werke: ["Pädagogik der Unterdrückten"] },
    { id: "nkrumah", name: "Kwame Nkrumah", epoche: "nachkrieg", x: -1.2,
      kernidee: "Panafrikanismus, Neokolonialismus",
      leben: "1909-1972", werke: ["Neokolonialismus"] },
    { id: "sankara", name: "Thomas Sankara", epoche: "nachkrieg", x: -1.4,
      kernidee: "Afrikanischer Sozialismus, Anti-Imperialismus",
      leben: "1949-1987", werke: ["Women's Liberation and the African Freedom Struggle"] },
    { id: "hooks", name: "bell hooks", epoche: "nachkrieg", x: 1.1,
      kernidee: "Intersektionaler Feminismus, Liebe als politische Praxis",
      leben: "1952-2021", werke: ["Ain't I a Woman", "All About Love"] },
      
    // Gegenwart
    { id: "zizek", name: "Slavoj Žižek", epoche: "gegenwart", x: 0,
      kernidee: "Lacan + Marx, Ideologiekritik durch Populärkultur",
      leben: "1949-", werke: ["Das fragile Absolute", "Parallaxe"] },
    { id: "badiou", name: "Alain Badiou", epoche: "gegenwart", x: -0.5,
      kernidee: "Kommunistische Hypothese, Ereignis, Treue",
      leben: "1937-", werke: ["Das Sein und das Ereignis", "Die kommunistische Hypothese"] },
    { id: "harvey", name: "David Harvey", epoche: "gegenwart", x: 0.3, wichtig: true,
      kernidee: "Räumliche Dimension des Kapitalismus, Akkumulation durch Enteignung",
      leben: "1935-", werke: ["Die Grenzen des Kapitalismus", "Marx' Kapital lesen"] },
    { id: "fraser", name: "Nancy Fraser", epoche: "gegenwart", x: 0.8, wichtig: true,
      kernidee: "Anerkennung und Umverteilung, Kapitalismus kannibalisiert Lebensgrundlagen",
      leben: "1947-", werke: ["Der Allesfresser"] },
    { id: "fisher", name: "Mark Fisher", epoche: "gegenwart", x: 0.5,
      kernidee: "Kapitalistischer Realismus, Hauntology, langsame Abschaffung der Zukunft",
      leben: "1968-2017", werke: ["Kapitalistischer Realismus", "Ghosts of My Life"] },
    { id: "graeber", name: "David Graeber", epoche: "gegenwart", x: 2, wichtig: true,
      kernidee: "Bullshit Jobs, Schulden, Basisdemokratie, Anarchist Anthropology",
      leben: "1961-2020", werke: ["Schulden", "Bullshit Jobs", "Anfänge"] },
    { id: "federici", name: "Silvia Federici", epoche: "gegenwart", x: 1.5, wichtig: true,
      kernidee: "Hexenverbrennung und primitive Akkumulation, Care-Arbeit",
      leben: "1942-", werke: ["Caliban und die Hexe", "Revolution at Point Zero"] },
    { id: "saito", name: "Kohei Saito", epoche: "gegenwart", x: 0.2,
      kernidee: "Marx im Anthropozän, Degrowth-Kommunismus",
      leben: "1987-", werke: ["Systemsturz", "Marx in the Anthropocene"] },
    { id: "ocalan", name: "Abdullah Öcalan", epoche: "gegenwart", x: 2.3, wichtig: true,
      kernidee: "Demokratischer Konföderalismus, Jineolojî, Rojava-Modell",
      leben: "1949-", werke: ["Demokratischer Konföderalismus"] },
    { id: "mouffe", name: "Chantal Mouffe", epoche: "gegenwart", x: -0.3,
      kernidee: "Agonistischer Pluralismus, Linkspopulismus",
      leben: "1943-", werke: ["Für einen linken Populismus"] },
    { id: "laclau", name: "Ernesto Laclau", epoche: "gegenwart", x: -0.4,
      kernidee: "Hegemonie und radikale Demokratie, Populismus",
      leben: "1935-2014", werke: ["Hegemonie und radikale Demokratie"] },
    { id: "butler", name: "Judith Butler", epoche: "gegenwart", x: 1.2, wichtig: true,
      kernidee: "Performativität des Geschlechts, Queere Theorie",
      leben: "1956-", werke: ["Das Unbehagen der Geschlechter", "Körper von Gewicht"] },
    { id: "spivak", name: "Gayatri Spivak", epoche: "gegenwart", x: 1.4,
      kernidee: "Subalternität, Can the Subaltern Speak?",
      leben: "1942-", werke: ["Can the Subaltern Speak?"] },
    { id: "jameson", name: "Fredric Jameson", epoche: "gegenwart", x: 0.4,
      kernidee: "Postmodernismus als Kulturlogik des Spätkapitalismus",
      leben: "1934-", werke: ["Postmodernism"] },
    { id: "streeck", name: "Wolfgang Streeck", epoche: "gegenwart", x: -0.2,
      kernidee: "Gekaufte Zeit, Ende des demokratischen Kapitalismus",
      leben: "1946-", werke: ["Gekaufte Zeit"] },
    { id: "piketty", name: "Thomas Piketty", epoche: "gegenwart", x: -0.8,
      kernidee: "Kapitaldynamik, r > g, Ungleichheit",
      leben: "1971-", werke: ["Das Kapital im 21. Jahrhundert"] },
    { id: "varoufakis", name: "Yanis Varoufakis", epoche: "gegenwart", x: -0.6,
      kernidee: "Progressiver Internationalismus, DiEM25",
      leben: "1961-", werke: ["Die ganze Geschichte"] },
    { id: "dean", name: "Jodi Dean", epoche: "gegenwart", x: -0.4,
      kernidee: "Kommunismus als Horizont, Partei neu denken",
      leben: "1962-", werke: ["The Communist Horizon"] },
    { id: "srnicek", name: "Nick Srnicek", epoche: "gegenwart", x: 0.7,
      kernidee: "Plattform-Kapitalismus, Left Accelerationism",
      leben: "1982-", werke: ["Platform Capitalism", "Inventing the Future"] },
    { id: "bastani", name: "Aaron Bastani", epoche: "gegenwart", x: 0.9,
      kernidee: "Fully Automated Luxury Communism",
      leben: "1983-", werke: ["Fully Automated Luxury Communism"] },
    { id: "malm", name: "Andreas Malm", epoche: "gegenwart", x: 1.0,
      kernidee: "Fossiles Kapital, Klimaaktivismus",
      leben: "1977-", werke: ["Fossil Capital", "How to Blow Up a Pipeline"] },
    { id: "brown", name: "Wendy Brown", epoche: "gegenwart", x: 0.6,
      kernidee: "Neoliberalismus als Entdemokratisierung",
      leben: "1955-", werke: ["Die schleichende Revolution"] }
  ],
  
  verbindungen: [
    // Aufklärung intern
    { von: "kant", zu: "hegel", typ: "einfluss" },
    { von: "rousseau", zu: "hegel", typ: "einfluss" },
    
    // Aufklärung → Frühsozialismus
    { von: "rousseau", zu: "saint-simon", typ: "einfluss" },
    { von: "rousseau", zu: "proudhon", typ: "einfluss" },
    { von: "smith", zu: "marx", typ: "einfluss" },
    { von: "hegel", zu: "marx", typ: "einfluss" },
    { von: "hegel", zu: "bakunin", typ: "einfluss" },
    
    // Frühsozialismus intern
    { von: "saint-simon", zu: "fourier", typ: "einfluss" },
    { von: "blanqui", zu: "marx", typ: "einfluss" },
    
    // Frühsozialismus → Klassiker
    { von: "saint-simon", zu: "marx", typ: "einfluss" },
    { von: "fourier", zu: "marx", typ: "einfluss" },
    { von: "proudhon", zu: "marx", typ: "konflikt" },
    { von: "proudhon", zu: "bakunin", typ: "einfluss" },
    { von: "weitling", zu: "marx", typ: "einfluss" },
    
    // Klassiker intern
    { von: "marx", zu: "engels", typ: "einfluss" },
    { von: "marx", zu: "bakunin", typ: "konflikt" },
    { von: "bakunin", zu: "kropotkin", typ: "einfluss" },
    { von: "marx", zu: "lassalle", typ: "konflikt" },
    
    // Klassiker → Zweite Internationale
    { von: "marx", zu: "kautsky", typ: "einfluss" },
    { von: "marx", zu: "bernstein", typ: "einfluss" },
    { von: "marx", zu: "luxemburg", typ: "einfluss" },
    { von: "marx", zu: "bebel", typ: "einfluss" },
    { von: "marx", zu: "plechanow", typ: "einfluss" },
    { von: "marx", zu: "mehring", typ: "einfluss" },
    { von: "engels", zu: "kautsky", typ: "einfluss" },
    { von: "engels", zu: "bebel", typ: "einfluss" },
    { von: "kautsky", zu: "bernstein", typ: "konflikt" },
    { von: "luxemburg", zu: "bernstein", typ: "konflikt" },
    { von: "luxemburg", zu: "kautsky", typ: "konflikt" },
    { von: "kropotkin", zu: "sorel", typ: "einfluss" },
    { von: "kropotkin", zu: "malatesta", typ: "einfluss" },
    { von: "bakunin", zu: "malatesta", typ: "einfluss" },
    
    // Zweite Internationale → Revolution
    { von: "luxemburg", zu: "lenin", typ: "konflikt" },
    { von: "luxemburg", zu: "gramsci", typ: "einfluss" },
    { von: "luxemburg", zu: "liebknecht_k", typ: "einfluss" },
    { von: "kautsky", zu: "lenin", typ: "konflikt" },
    { von: "plechanow", zu: "lenin", typ: "einfluss" },
    { von: "lenin", zu: "trotzki", typ: "einfluss" },
    { von: "lenin", zu: "stalin", typ: "einfluss" },
    { von: "trotzki", zu: "stalin", typ: "konflikt" },
    { von: "lenin", zu: "mao", typ: "einfluss" },
    { von: "lenin", zu: "ho", typ: "einfluss" },
    { von: "marx", zu: "lukacs", typ: "einfluss" },
    { von: "hegel", zu: "lukacs", typ: "einfluss" },
    { von: "lukacs", zu: "gramsci", typ: "einfluss" },
    { von: "lukacs", zu: "korsch", typ: "einfluss" },
    { von: "goldman", zu: "cnt", typ: "einfluss" },
    { von: "bakunin", zu: "cnt", typ: "einfluss" },
    { von: "luxemburg", zu: "pannekoek", typ: "einfluss" },
    { von: "korsch", zu: "pannekoek", typ: "einfluss" },
    { von: "zetkin", zu: "kollontai", typ: "einfluss" },
    { von: "marx", zu: "bloch", typ: "einfluss" },
    { von: "lukacs", zu: "benjamin", typ: "einfluss" },
    { von: "bloch", zu: "benjamin", typ: "einfluss" },
    { von: "marx", zu: "mariategui", typ: "einfluss" },
    { von: "fanon", zu: "cabral", typ: "einfluss" },
    
    // Revolution → Nachkrieg
    { von: "lukacs", zu: "adorno", typ: "einfluss" },
    { von: "lukacs", zu: "horkheimer", typ: "einfluss" },
    { von: "benjamin", zu: "adorno", typ: "einfluss" },
    { von: "gramsci", zu: "althusser", typ: "einfluss" },
    { von: "marx", zu: "althusser", typ: "einfluss" },
    { von: "adorno", zu: "marcuse", typ: "einfluss" },
    { von: "horkheimer", zu: "marcuse", typ: "einfluss" },
    { von: "fanon", zu: "davis", typ: "einfluss" },
    { von: "che", zu: "fanon", typ: "einfluss" },
    { von: "mao", zu: "che", typ: "einfluss" },
    { von: "althusser", zu: "poulantzas", typ: "einfluss" },
    { von: "kropotkin", zu: "bookchin", typ: "einfluss" },
    { von: "marx", zu: "fromm", typ: "einfluss" },
    { von: "beauvoir", zu: "davis", typ: "einfluss" },
    { von: "beauvoir", zu: "hooks", typ: "einfluss" },
    { von: "sartre", zu: "fanon", typ: "einfluss" },
    { von: "lukacs", zu: "debord", typ: "einfluss" },
    { von: "marcuse", zu: "debord", typ: "einfluss" },
    { von: "james_clr", zu: "davis", typ: "einfluss" },
    { von: "freire", zu: "hooks", typ: "einfluss" },
    { von: "fanon", zu: "nkrumah", typ: "einfluss" },
    { von: "nkrumah", zu: "sankara", typ: "einfluss" },
    { von: "gorz", zu: "illich", typ: "einfluss" },
    { von: "marcuse", zu: "gorz", typ: "einfluss" },
    
    // Nachkrieg → Gegenwart
    { von: "althusser", zu: "badiou", typ: "einfluss" },
    { von: "althusser", zu: "zizek", typ: "einfluss" },
    { von: "gramsci", zu: "harvey", typ: "einfluss" },
    { von: "gramsci", zu: "mouffe", typ: "einfluss" },
    { von: "gramsci", zu: "laclau", typ: "einfluss" },
    { von: "adorno", zu: "fisher", typ: "einfluss" },
    { von: "marcuse", zu: "fisher", typ: "einfluss" },
    { von: "debord", zu: "fisher", typ: "einfluss" },
    { von: "davis", zu: "fraser", typ: "einfluss" },
    { von: "federici", zu: "fraser", typ: "einfluss" },
    { von: "hooks", zu: "fraser", typ: "einfluss" },
    { von: "marx", zu: "saito", typ: "einfluss" },
    { von: "gorz", zu: "saito", typ: "einfluss" },
    { von: "graeber", zu: "ocalan", typ: "einfluss" },
    { von: "bookchin", zu: "ocalan", typ: "einfluss" },
    { von: "beauvoir", zu: "butler", typ: "einfluss" },
    { von: "althusser", zu: "butler", typ: "einfluss" },
    { von: "gramsci", zu: "spivak", typ: "einfluss" },
    { von: "fanon", zu: "spivak", typ: "einfluss" },
    { von: "althusser", zu: "jameson", typ: "einfluss" },
    { von: "lukacs", zu: "jameson", typ: "einfluss" },
    { von: "poulantzas", zu: "streeck", typ: "einfluss" },
    { von: "harvey", zu: "streeck", typ: "einfluss" },
    { von: "marx", zu: "piketty", typ: "einfluss" },
    { von: "gramsci", zu: "dean", typ: "einfluss" },
    { von: "badiou", zu: "dean", typ: "einfluss" },
    { von: "fisher", zu: "srnicek", typ: "einfluss" },
    { von: "srnicek", zu: "bastani", typ: "einfluss" },
    { von: "marx", zu: "malm", typ: "einfluss" },
    { von: "gorz", zu: "malm", typ: "einfluss" },
    { von: "althusser", zu: "brown", typ: "einfluss" },
    { von: "federici", zu: "butler", typ: "einfluss" },
    { von: "mouffe", zu: "laclau", typ: "einfluss" },
    { von: "mandel", zu: "harvey", typ: "einfluss" },
    { von: "mandel", zu: "jameson", typ: "einfluss" }
  ]
};


// ══════════════════════════════════════════════════════════════════════
// DATEN: VERBINDUNGEN
// ══════════════════════════════════════════════════════════════════════

const verbindungenData = [
  // ═══════════════════════════════════════════════════════════════════
  // A1: REFORM/REVOLUTION - Spektrum verbinden
  // ═══════════════════════════════════════════════════════════════════
  { "von": "00-1", "zu": "00-2", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Strikte Reform nah an radikaler Reform" },
  { "von": "00-2", "zu": "00-3", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Radikale Reform nah an Doppelstrategie" },
  { "von": "00-2", "zu": "00-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Radikale Reform nah an Prozess" },
  { "von": "00-3", "zu": "00-4", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Luxemburg: Doppelstrategie als Prozess" },
  { "von": "00-4", "zu": "00-5", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Prozess kann in Aufstand münden" },
  { "von": "00-1", "zu": "00-5", "typ": "debatte", "staerke": 0.10, "beschreibung": "Reform vs. Revolution - Grundkonflikt" },
  { "von": "00-1", "zu": "00-1", "typ": "affinitaet", "staerke": 0.95, "beschreibung": "Strikte Reform + Gradualismus" },
  { "von": "00-5", "zu": "00-5", "typ": "affinitaet", "staerke": 0.95, "beschreibung": "Sofortige Revolution + Bruch" },
  { "von": "00-3", "zu": "12-3", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Doppelstrategie + Staat als Terrain" },
  { "von": "00-2", "zu": "17-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Radikale Reform baut reale Utopien" },
  { "von": "00-4", "zu": "00-4", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Revolutionärer Prozess ist rupturell" },

  // ═══════════════════════════════════════════════════════════════════
  // A2: SUBJEKT - Spektrum verbinden
  // ═══════════════════════════════════════════════════════════════════
  { "von": "09-1", "zu": "09-2", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Industrieproletariat ist Kern der Klasse" },
  { "von": "09-2", "zu": "09-3", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Klassensubjekt erweitert sich" },
  { "von": "09-3", "zu": "09-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Erweiterte Klasse nah an Multitude" },
  { "von": "09-4", "zu": "09-5", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Multitude nah an Prozesssubjekt" },
  { "von": "09-1", "zu": "09-5", "typ": "debatte", "staerke": 0.25, "beschreibung": "Festes vs. fluides Subjekt" },
  { "von": "09-2", "zu": "09-4", "typ": "debatte", "staerke": 0.50, "beschreibung": "Klasse vs. Multitude" },
  { "von": "09-1", "zu": "16-1", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Industrieproletariat + Vollbeschäftigung" },
  { "von": "09-3", "zu": "16-4", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Prekariat braucht Grundeinkommen" },

  // ═══════════════════════════════════════════════════════════════════
  // A3: STAAT
  // ═══════════════════════════════════════════════════════════════════
  { "von": "12-1", "zu": "12-2", "typ": "affinitaet", "staerke": 0.50, "beschreibung": "Beide nutzen den Staat, aber anders" },
  { "von": "12-2", "zu": "12-3", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Poulantzas korrigiert Lenin" },
  { "von": "12-3", "zu": "12-4", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Terrain-Kämpfe können zu Exodus führen" },
  { "von": "12-4", "zu": "12-5", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Autonomismus nah an Anarchismus" },
  { "von": "12-5", "zu": "01-5", "typ": "affinitaet", "staerke": 0.95, "beschreibung": "Anarchismus + Selbstverwaltung" },
  { "von": "12-5", "zu": "07-5", "typ": "affinitaet", "staerke": 0.90, "beschreibung": "Anarchismus + Basisbildung" },
  { "von": "12-5", "zu": "12-2", "typ": "debatte", "staerke": 0.20, "beschreibung": "Bakunin vs. Marx" },
  { "von": "12-5", "zu": "12-1", "typ": "debatte", "staerke": 0.10, "beschreibung": "Anarchismus vs. Etatismus" },
  { "von": "12-5", "zu": "08-5", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Bookchin: Anarchismus + Sozialökologie" },
  { "von": "12-5", "zu": "22-2", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Anarchismus + Föderalismus" },
  { "von": "12-2", "zu": "07-1", "typ": "affinitaet", "staerke": 0.90, "beschreibung": "Leninismus + Avantgarde" },
  { "von": "12-2", "zu": "00-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Leninismus + Revolution" },
  { "von": "12-2", "zu": "09-2", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Leninismus + Klassensubjekt" },
  { "von": "12-2", "zu": "02-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Leninismus + Zentralplanung" },
  { "von": "12-2", "zu": "01-1", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Leninismus + Verstaatlichung" },
  { "von": "12-2", "zu": "07-2", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Leninismus + Kaderschulung" },
  { "von": "12-2", "zu": "22-1", "typ": "affinitaet", "staerke": 0.90, "beschreibung": "Leninismus + Zentralismus" },
  { "von": "12-1", "zu": "00-1", "typ": "affinitaet", "staerke": 0.90, "beschreibung": "Etatismus + Reform" },
  { "von": "12-1", "zu": "02-2", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Etatismus + regulierter Markt" },
  { "von": "12-1", "zu": "01-2", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Etatismus + öffentliches Eigentum" },
  { "von": "12-3", "zu": "22-3", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Staat als Terrain + Mehrebenen-Kämpfe" },
  { "von": "12-4", "zu": "01-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Autonomismus + Selbstverwaltung" },
  { "von": "12-4", "zu": "00-2", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Autonomismus + interstitielle Strategie" },

  // ═══════════════════════════════════════════════════════════════════
  // B1: MARKT/PLAN
  // ═══════════════════════════════════════════════════════════════════
  { "von": "02-1", "zu": "02-2", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Marktsozialismus nah an Regulierung" },
  { "von": "02-2", "zu": "02-3", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Regulierter Markt nah an Mischsystem" },
  { "von": "02-3", "zu": "02-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Mischsystem nah an demokratischer Planung" },
  { "von": "02-4", "zu": "02-5", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Demokratische vs. zentrale Planung" },
  { "von": "02-1", "zu": "02-5", "typ": "debatte", "staerke": 0.20, "beschreibung": "Markt vs. Plan - Grundkonflikt" },
  { "von": "02-1", "zu": "01-4", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Marktsozialismus + Genossenschaften" },
  { "von": "02-5", "zu": "01-1", "typ": "affinitaet", "staerke": 0.90, "beschreibung": "Zentralplanung + Verstaatlichung" },
  { "von": "02-4", "zu": "01-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Demokratische Planung + Selbstverwaltung" },
  { "von": "02-3", "zu": "01-3", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Mischsystem + gemischte Eigentumsformen" },
  { "von": "02-2", "zu": "08-2", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Regulierter Markt ermöglicht grünes Wachstum" },

  // ═══════════════════════════════════════════════════════════════════
  // B2: BESITZ
  // ═══════════════════════════════════════════════════════════════════
  { "von": "01-1", "zu": "01-2", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Verstaatlichung nah an öffentlichem Eigentum" },
  { "von": "01-2", "zu": "01-3", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Öffentliches Eigentum nah an Mischformen" },
  { "von": "01-3", "zu": "01-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Mischformen enthalten Genossenschaften" },
  { "von": "01-4", "zu": "01-5", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Genossenschaften nah an Selbstverwaltung" },
  { "von": "01-1", "zu": "01-5", "typ": "debatte", "staerke": 0.30, "beschreibung": "Verstaatlichung vs. Selbstverwaltung" },
  { "von": "01-2", "zu": "12-1", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Öffentliches Eigentum + Etatismus" },
  { "von": "01-3", "zu": "17-4", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Mischformen als reale Utopie" },

  // ═══════════════════════════════════════════════════════════════════
  // B3: ARBEIT
  // ═══════════════════════════════════════════════════════════════════
  { "von": "16-1", "zu": "16-2", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Vollbeschäftigung braucht gute Arbeit" },
  { "von": "16-2", "zu": "16-3", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Gute Arbeit heißt auch weniger Arbeit" },
  { "von": "16-3", "zu": "16-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Arbeitszeitverkürzung + Grundeinkommen" },
  { "von": "16-4", "zu": "16-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Grundeinkommen nah an Post-Work" },
  { "von": "16-1", "zu": "16-5", "typ": "debatte", "staerke": 0.20, "beschreibung": "Vollbeschäftigung vs. Post-Work" },
  { "von": "16-5", "zu": "08-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Post-Work + Ökosozialismus (Degrowth)" },
  { "von": "16-2", "zu": "09-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Gute Arbeit muss Care-Arbeit einschließen" },
  { "von": "16-3", "zu": "08-4", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Weniger arbeiten = weniger produzieren" },

  // ═══════════════════════════════════════════════════════════════════
  // C1: FEMINISMUS
  // ═══════════════════════════════════════════════════════════════════
  { "von": "09-1", "zu": "09-2", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Klassenprimat nah an sozialistischem Feminismus" },
  { "von": "09-2", "zu": "09-3", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Sozialistischer Feminismus öffnet für Intersektionalität" },
  { "von": "09-3", "zu": "09-4", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Intersektionalität sieht Care-Arbeit" },
  { "von": "09-4", "zu": "09-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Care-Revolution nah an Radikalfeminismus" },
  { "von": "09-1", "zu": "09-5", "typ": "debatte", "staerke": 0.30, "beschreibung": "Nebenwiderspruch-Debatte" },
  { "von": "09-1", "zu": "09-2", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Klassenprimat + Klassensubjekt" },
  { "von": "09-2", "zu": "09-2", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Sozialistischer Feminismus bleibt bei Klasse" },
  { "von": "09-3", "zu": "09-4", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Intersektionalität + Multitude" },
  { "von": "09-5", "zu": "09-4", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Radikalfeminismus + Multitude" },
  { "von": "09-5", "zu": "16-5", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Care-Kritik + Post-Work" },
  { "von": "09-4", "zu": "16-5", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Care-Revolution + Post-Work" },

  // ═══════════════════════════════════════════════════════════════════
  // C2: NATUR
  // ═══════════════════════════════════════════════════════════════════
  { "von": "08-1", "zu": "08-2", "typ": "affinitaet", "staerke": 0.55, "beschreibung": "Produktivismus glaubt an grüne Technik" },
  { "von": "08-2", "zu": "08-3", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Grünes Wachstum + Nachhaltigkeit" },
  { "von": "08-3", "zu": "08-4", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Nachhaltigkeit kann zu Ökosozialismus führen" },
  { "von": "08-4", "zu": "08-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Ökosozialismus nah an Naturrechte" },
  { "von": "08-1", "zu": "08-4", "typ": "debatte", "staerke": 0.20, "beschreibung": "Produktivismus vs. Ökosozialismus" },
  { "von": "08-2", "zu": "08-4", "typ": "debatte", "staerke": 0.40, "beschreibung": "Grünes Wachstum vs. Degrowth" },
  { "von": "08-5", "zu": "12-5", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Bookchin: Sozialökologie + Anarchismus" },
  { "von": "08-5", "zu": "22-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Naturrechte + Kommunalismus" },
  { "von": "08-1", "zu": "02-5", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Produktivismus + Zentralplanung" },
  { "von": "08-3", "zu": "02-2", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Nachhaltige Entwicklung braucht Regulierung" },

  // ═══════════════════════════════════════════════════════════════════
  // C3: INTERNATIONAL
  // ═══════════════════════════════════════════════════════════════════
  { "von": "24-1", "zu": "24-2", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Nationaler Weg kann regional werden" },
  { "von": "24-2", "zu": "24-3", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Regional ist schon international" },
  { "von": "24-3", "zu": "24-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Internationalismus nah an permanenter Revolution" },
  { "von": "24-4", "zu": "24-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Permanente Revolution nah an global" },
  { "von": "24-1", "zu": "24-5", "typ": "debatte", "staerke": 0.15, "beschreibung": "National vs. Global - Stalin vs. Trotzki" },
  { "von": "24-3", "zu": "09-2", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Internationalismus + Klassensubjekt" },
  { "von": "24-5", "zu": "09-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Globale Multitude" },
  { "von": "24-1", "zu": "22-1", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Nationaler Weg + Zentralismus" },
  { "von": "24-2", "zu": "22-2", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Regionale Bündnisse + Föderalismus" },

  // ═══════════════════════════════════════════════════════════════════
  // D1: UTOPIE
  // ═══════════════════════════════════════════════════════════════════
  { "von": "17-1", "zu": "17-2", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Anti-Utopismus nah an negativer Utopie" },
  { "von": "17-2", "zu": "17-3", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Negation kann Prozess werden" },
  { "von": "17-3", "zu": "17-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Prozess findet reale Utopien" },
  { "von": "17-4", "zu": "17-5", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Reale Utopien können konkret werden" },
  { "von": "17-1", "zu": "17-5", "typ": "debatte", "staerke": 0.20, "beschreibung": "Anti-Utopismus vs. konkrete Utopie" },
  { "von": "17-2", "zu": "25-1", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Negative Utopie + strenger Materialismus" },
  { "von": "17-4", "zu": "00-2", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Reale Utopien + interstitielle Strategie" },
  { "von": "17-4", "zu": "00-2", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Reale Utopien durch radikale Reformen" },
  { "von": "17-5", "zu": "02-4", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Konkrete Utopie + demokratische Planung" },

  // ═══════════════════════════════════════════════════════════════════
  // D2: TRANSFORMATION
  // ═══════════════════════════════════════════════════════════════════
  { "von": "00-1", "zu": "00-2", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Reform kann interstitiell sein" },
  { "von": "00-2", "zu": "00-3", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Interstitiell braucht manchmal Staat" },
  { "von": "00-3", "zu": "00-4", "typ": "affinitaet", "staerke": 0.55, "beschreibung": "Symbiotisch kann rupturell werden" },
  { "von": "00-4", "zu": "00-5", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Rupturell nah an Revolution" },
  { "von": "00-1", "zu": "00-5", "typ": "debatte", "staerke": 0.15, "beschreibung": "Reform vs. Revolution" },
  { "von": "00-2", "zu": "12-4", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Interstitiell + Autonomismus" },
  { "von": "00-3", "zu": "12-3", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Symbiotisch + Staat als Terrain" },
  { "von": "00-3", "zu": "12-1", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Symbiotisch nutzt Etatismus" },
  { "von": "00-4", "zu": "00-4", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Rupturell + revolutionärer Prozess" },
  { "von": "00-4", "zu": "06-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Rupturell braucht Bewegungen" },

  // ═══════════════════════════════════════════════════════════════════
  // D3: SPIRITUALITÄT
  // ═══════════════════════════════════════════════════════════════════
  { "von": "25-1", "zu": "25-2", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Materialismus akzeptiert Humanismus" },
  { "von": "25-2", "zu": "25-3", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Humanismus ist offen" },
  { "von": "25-3", "zu": "25-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Offenheit ermöglicht Befreiungstheologie" },
  { "von": "25-4", "zu": "25-5", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Befreiungstheologie nah an spirituellem Sozialismus" },
  { "von": "25-1", "zu": "25-5", "typ": "debatte", "staerke": 0.20, "beschreibung": "Materialismus vs. Spiritualität" },
  { "von": "25-4", "zu": "24-3", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Befreiungstheologie + Internationalismus" },
  { "von": "25-5", "zu": "12-5", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Landauer: Spiritueller Anarchismus" },
  { "von": "25-1", "zu": "09-2", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Materialismus + Klassensubjekt" },
  { "von": "25-3", "zu": "06-3", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Offenheit ermöglicht breite Bündnisse" },

  // ═══════════════════════════════════════════════════════════════════
  // E1: BÜNDNISSE
  // ═══════════════════════════════════════════════════════════════════
  { "von": "06-1", "zu": "06-2", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Klassenreinheit kann Klassenbündnis werden" },
  { "von": "06-2", "zu": "06-3", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Klassenbündnis kann breiter werden" },
  { "von": "06-3", "zu": "06-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Breite Bündnisse werden bewegungsorientiert" },
  { "von": "06-4", "zu": "06-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Bewegungen werden Netzwerke" },
  { "von": "06-1", "zu": "06-5", "typ": "debatte", "staerke": 0.20, "beschreibung": "Klassenreinheit vs. Netzwerk" },
  { "von": "06-2", "zu": "09-2", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Klassenbündnis + Klassensubjekt" },
  { "von": "06-3", "zu": "09-4", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Breite Bündnisse + Multitude" },
  { "von": "06-5", "zu": "09-4", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Netzwerk + Multitude" },
  { "von": "06-4", "zu": "09-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Bewegungsorientiert + Multitude" },
  { "von": "06-1", "zu": "09-1", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Klassenreinheit + Industrieproletariat" },

  // ═══════════════════════════════════════════════════════════════════
  // E2: EBENEN
  // ═══════════════════════════════════════════════════════════════════
  { "von": "22-1", "zu": "22-2", "typ": "debatte", "staerke": 0.40, "beschreibung": "Zentralismus vs. Föderalismus" },
  { "von": "22-2", "zu": "22-3", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Föderalismus ist Mehrebenen" },
  { "von": "22-3", "zu": "22-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Mehrebenen betont Kommune" },
  { "von": "22-4", "zu": "22-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Kommunalismus ist basisdemokratisch" },
  { "von": "22-1", "zu": "22-5", "typ": "debatte", "staerke": 0.15, "beschreibung": "Zentralismus vs. Basisdemokratie" },
  { "von": "22-1", "zu": "12-2", "typ": "affinitaet", "staerke": 0.90, "beschreibung": "Zentralismus + Leninismus" },
  { "von": "22-4", "zu": "12-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Kommunalismus + Anarchismus" },
  { "von": "22-4", "zu": "08-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Kommunalismus + Sozialökologie" },
  { "von": "22-5", "zu": "01-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Basisdemokratie + Selbstverwaltung" },
  { "von": "22-2", "zu": "12-5", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Föderalismus + Anarchismus" },
  { "von": "22-3", "zu": "12-3", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Mehrebenen + Staat als Terrain" },

  // ═══════════════════════════════════════════════════════════════════
  // E3: BILDUNG
  // ═══════════════════════════════════════════════════════════════════
  { "von": "07-1", "zu": "07-2", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Avantgarde macht Kaderschulung" },
  { "von": "07-2", "zu": "07-3", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Kaderschulung kann offener werden" },
  { "von": "07-3", "zu": "07-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Politische Bildung trifft Bewegungslernen" },
  { "von": "07-4", "zu": "07-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Bewegungslernen ist Basisbildung" },
  { "von": "07-1", "zu": "07-5", "typ": "debatte", "staerke": 0.20, "beschreibung": "Avantgarde vs. Basisbildung" },
  { "von": "07-2", "zu": "12-2", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Kaderschulung + Leninismus" },
  { "von": "07-2", "zu": "22-1", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Kaderschulung + Zentralismus" },
  { "von": "07-5", "zu": "12-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Basisbildung + Anarchismus" },
  { "von": "07-3", "zu": "25-3", "typ": "affinitaet", "staerke": 0.55, "beschreibung": "Politische Bildung ist offen" },
  { "von": "07-4", "zu": "06-4", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Bewegungslernen + Bewegungsorientiert" },

  // ═══════════════════════════════════════════════════════════════════
  // CROSS-ACHSEN (die spannenden)
  // ═══════════════════════════════════════════════════════════════════
  { "von": "01-5", "zu": "07-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Selbstverwaltung + Basisbildung" },
  { "von": "09-5", "zu": "09-2", "typ": "debatte", "staerke": 0.40, "beschreibung": "Nebenwiderspruch-Debatte" },
  { "von": "16-3", "zu": "17-4", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "4-Tage-Woche als reale Utopie" },
  { "von": "06-3", "zu": "09-3", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Breite Bündnisse brauchen Intersektionalität" },

  // ═══════════════════════════════════════════════════════════════════
  // F1: TECHNOLOGIE - Spektrum verbinden
  // ═══════════════════════════════════════════════════════════════════
  { "von": "XX-1", "zu": "XX-2", "typ": "affinitaet", "staerke": 0.75, "beschreibung": "Neo-Luddismus nah an Technologie-Skepsis" },
  { "von": "XX-2", "zu": "XX-3", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Skepsis kann zu kritischer Aneignung werden" },
  { "von": "XX-3", "zu": "XX-4", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Kritische Aneignung teilt Modernismus mit Akzelerationismus" },
  { "von": "XX-4", "zu": "XX-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Akzelerationismus mündet in FALC" },
  { "von": "XX-1", "zu": "XX-5", "typ": "debatte", "staerke": 0.20, "beschreibung": "Technologie ablehnen vs. maximieren" },
  { "von": "XX-3", "zu": "01-4", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Platform Cooperativism = Plattform + Genossenschaft" },
  { "von": "XX-5", "zu": "16-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "FALC braucht Post-Work" },

  // ═══════════════════════════════════════════════════════════════════
  // F2: DEMOKRATIEFORM - Spektrum verbinden
  // ═══════════════════════════════════════════════════════════════════
  { "von": "XX-1", "zu": "XX-2", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Avantgarde praktiziert demokratischen Zentralismus" },
  { "von": "XX-2", "zu": "XX-3", "typ": "affinitaet", "staerke": 0.50, "beschreibung": "Zentralismus vs. Repräsentation - Spannung" },
  { "von": "XX-3", "zu": "XX-4", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Repräsentation kann zu Räten radikalisiert werden" },
  { "von": "XX-4", "zu": "XX-5", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Räte nahe an Basisdemokratie" },
  { "von": "XX-1", "zu": "XX-5", "typ": "debatte", "staerke": 0.15, "beschreibung": "Avantgarde vs. Basisdemokratie - Grundkonflikt" },
  { "von": "XX-1", "zu": "12-1", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Avantgarde + starker Staat" },
  { "von": "XX-5", "zu": "12-5", "typ": "affinitaet", "staerke": 0.85, "beschreibung": "Basisdemokratie + Anti-Etatismus" },

  // ═══════════════════════════════════════════════════════════════════
  // F3: GEWALT & MITTEL - Spektrum verbinden
  // ═══════════════════════════════════════════════════════════════════
  { "von": "XX-1", "zu": "XX-2", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Pazifismus nahe an gewaltfreiem Widerstand" },
  { "von": "XX-2", "zu": "XX-3", "typ": "affinitaet", "staerke": 0.60, "beschreibung": "Gewaltfreiheit kann zu taktischer Flexibilität werden" },
  { "von": "XX-3", "zu": "XX-4", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Flexibilität öffnet Tür zu Militanz" },
  { "von": "XX-4", "zu": "XX-5", "typ": "affinitaet", "staerke": 0.70, "beschreibung": "Militanz kann zu bewaffnetem Kampf eskalieren" },
  { "von": "XX-1", "zu": "XX-5", "typ": "debatte", "staerke": 0.10, "beschreibung": "Pazifismus vs. bewaffneter Kampf - absoluter Gegensatz" },
  { "von": "XX-5", "zu": "00-5", "typ": "affinitaet", "staerke": 0.80, "beschreibung": "Bewaffneter Kampf + Revolution" },
  { "von": "XX-2", "zu": "00-2", "typ": "affinitaet", "staerke": 0.65, "beschreibung": "Gewaltfreier Widerstand + radikale Reform" }
];

// ══════════════════════════════════════════════════════════════════════
// DATEN: DEBATTEN
// ══════════════════════════════════════════════════════════════════════

const debattenData = [
  {
    "id": "marx-bakunin",
    "titel": "Staat erobern oder zerschlagen?",
    "frage": "Kann der Staat ein Werkzeug der Befreiung sein – oder ist er immer Herrschaft?",
    "seite_a": {
      "position": "Der Arbeiterstaat ist notwendig",
      "argumente": ["Ohne Staatsmacht keine Enteignung möglich", "Der Staat stirbt ab nach Sieg", "Anarchismus ist unpraktisch"]
    },
    "seite_b": {
      "position": "Jeder Staat ist Unterdrückung",
      "argumente": ["Wer den Staat erobert, wird von ihm erobert", "Der Staat stirbt nie ab", "Freiheit nicht durch Unfreiheit"]
    },
    "historisch": { "wann": "1872", "anlass": "Spaltung der Ersten Internationale", "ausgang": "Marx setzt sich durch, Bakunin ausgeschlossen" },
    "texte": [
      { "titel": "Staatlichkeit und Anarchie", "autor": "Bakunin", "url": "https://theanarchistlibrary.org/library/mikhail-bakunin-statism-and-anarchy" },
      { "titel": "Staat und Revolution", "autor": "Lenin", "url": "https://www.marxists.org/deutsch/archiv/lenin/1917/staatrev/index.htm" }
    ]
  },
  {
    "id": "reform-revolution",
    "titel": "Reform oder Revolution?",
    "frage": "Können wir den Kapitalismus Schritt für Schritt überwinden – oder braucht es einen Bruch?",
    "seite_a": {
      "position": "Der Weg ist alles",
      "argumente": ["Revolution führt zu Terror", "Demokratie ermöglicht Wandel", "Arbeiterklasse nicht bereit"]
    },
    "seite_b": {
      "position": "Kein gradueller Übergang möglich",
      "argumente": ["Herrschende geben nie freiwillig auf", "Reformen werden zurückgenommen", "System nicht reformierbar"]
    },
    "historisch": { "wann": "1899", "anlass": "Bernstein-Debatte in der SPD", "ausgang": "Revolutionäre Rhetorik, reformistische Praxis" },
    "texte": [
      { "titel": "Sozialreform oder Revolution?", "autor": "Luxemburg", "url": "https://www.marxists.org/deutsch/archiv/luxemburg/1899/sozam/index.htm" },
      { "titel": "Die Voraussetzungen des Sozialismus", "autor": "Bernstein", "url": "https://www.marxists.org/deutsch/archiv/bernstein/1899/voraus/index.html" }
    ]
  },
  {
    "id": "markt-plan",
    "titel": "Markt oder Plan?",
    "frage": "Wie koordinieren wir eine sozialistische Wirtschaft?",
    "seite_a": {
      "position": "Sozialismus braucht Markt",
      "argumente": ["Preise transportieren Information", "Planung führt zu Bürokratie", "Genossenschaften können konkurrieren"]
    },
    "seite_b": {
      "position": "Markt ist das Problem",
      "argumente": ["Markt erzeugt Ungleichheit", "Rationale Planung ist effizienter", "Bedürfnisse statt Profit"]
    },
    "historisch": { "wann": "1920-1940", "anlass": "Sozialistische Kalkulationsdebatte", "ausgang": "Beide Seiten beanspruchen Sieg" },
    "texte": []
  },
  {
    "id": "klasse-multitude",
    "titel": "Wer macht Geschichte?",
    "frage": "Ist die Arbeiterklasse DAS revolutionäre Subjekt – oder gibt es viele Kämpfe?",
    "seite_a": {
      "position": "Die Arbeiterklasse",
      "argumente": ["Nur sie kann Produktion lahmlegen", "Andere Kämpfe sind sekundär", "Identitätspolitik spaltet"]
    },
    "seite_b": {
      "position": "Viele Subjekte",
      "argumente": ["'Die' Arbeiterklasse gibt es nicht mehr", "Feminismus etc. keine Nebenwidersprüche", "Multitude reicher als Klasse"]
    },
    "historisch": { "wann": "1970er-heute", "anlass": "Neue Soziale Bewegungen", "ausgang": "Offen" },
    "texte": []
  },
  {
    "id": "national-global",
    "titel": "Sozialismus in einem Land oder Weltrevolution?",
    "frage": "Kann Sozialismus in einer kapitalistischen Welt überleben – oder muss er sich ausbreiten?",
    "seite_a": {
      "position": "Sozialismus in einem Land möglich",
      "argumente": ["Nicht auf Weltrevolution warten", "Aufbau hier und jetzt", "Ausstrahlung durch Erfolg"]
    },
    "seite_b": {
      "position": "Revolution muss international werden",
      "argumente": ["Isolation führt zu Deformation", "Kapital ist global", "Permanente Revolution nötig"]
    },
    "historisch": { "wann": "1924-1927", "anlass": "Stalin vs. Trotzki", "ausgang": "Stalin setzt sich durch, Trotzki verbannt" },
    "texte": [
      { "titel": "Die permanente Revolution", "autor": "Trotzki", "url": "https://www.marxists.org/deutsch/archiv/trotzki/1930/permrev/index.htm" }
    ]
  },
  {
    "id": "organisation",
    "titel": "Zentralismus oder Basisdemokratie?",
    "frage": "Wie organisieren wir uns, um zu gewinnen – von oben oder von unten?",
    "seite_a": {
      "position": "Demokratischer Zentralismus",
      "argumente": ["Einheitliches Handeln nötig gegen starken Gegner", "Diskussion ja, aber dann geschlossenes Auftreten", "Dezentralismus ist Schwäche"]
    },
    "seite_b": {
      "position": "Basisdemokratie",
      "argumente": ["Zentralismus führt zu Bürokratie und Diktatur", "Befreiung muss von unten kommen", "Mittel müssen dem Ziel entsprechen"]
    },
    "historisch": { "wann": "1903-heute", "anlass": "Bolschewiki vs. Menschewiki und viele Folgekonflikte", "ausgang": "Zentralismus hat oft gesiegt, aber nie dauerhaft überzeugt" },
    "texte": []
  }
];


// ══════════════════════════════════════════════════════════════════════
// GLOBALE FILTER-DATEN
// ══════════════════════════════════════════════════════════════════════

// Temperatur-Cache für alle Positionen
const temperaturCache = {};

function berechneTemperaturen() {
  Object.values(knotenData).forEach(k => {
    let temp = 0;
    let debatten = 0;
    
    verbindungenData.forEach(v => {
      if (v.von === k.id || v.zu === k.id) {
        temp += v.staerke * 10;
        if (v.typ === 'debatte') debatten++;
      }
    });
    
    const heisseThemen = ['Ökosozialismus', 'Post-Work', 'Grundeinkommen', 'Intersektionalität', 'Multitude', 'Care-Revolution', 'Degrowth', 'Feminismus', 'Antirassismus'];
    if (heisseThemen.some(t => k.name.includes(t))) {
      temp += 20;
    }
    
    temp += debatten * 10;
    temperaturCache[k.id] = Math.min(100, temp);
  });
}

// Epochen-Zuordnung (26 Achsen)
function getEpocheForPosition(id) {
  const knoten = knotenData[id];
  if (!knoten) return 2000;
  
  const achse = knoten.achse;
  // Epochen nach Thema gruppiert
  if (achse === '00') return 1900; // Reform/Revolution - Grunddebatte
  if (achse === '01') return 1920; // Eigentum - frühe Sozialismusdebatte
  if (achse === '02') return 1930; // Planung - Planwirtschaftsdebatte
  if (achse === '03') return 1970; // Sozialstaat
  if (achse === '04') return 1960; // Steuern
  if (achse === '05') return 1970; // Wohnen
  if (achse === '06') return 1980; // Gesundheit
  if (achse === '07') return 1960; // Bildung
  if (achse === '08') return 1970; // Ökologie
  if (achse === '09') return 1970; // Feminismus
  if (achse === '10') return 1990; // Antirassismus
  if (achse === '11') return 2000; // Technologie
  if (achse === '12') return 1920; // Demokratie
  if (achse === '13') return 1960; // Aktionsformen
  if (achse === '14') return 2010; // Kulturkampf
  if (achse === '15') return 1990; // EU
  if (achse === '16') return 1970; // Arbeit
  if (achse === '17') return 2000; // Wachstum
  if (achse === '18') return 2000; // Nahost
  if (achse === '19') return 2015; // Migration
  if (achse === '20') return 2010; // Digitalität
  if (achse === '21') return 2010; // Care
  if (achse === '22') return 1970; // Land/Stadt
  if (achse === '23') return 1990; // Geschichte
  if (achse === '24') return 2000; // Geopolitik
  if (achse === '25') return 1970; // Spiritualität
  return 1970;
}

// Temperaturen beim Laden berechnen
berechneTemperaturen();

// ══════════════════════════════════════════════════════════════════════
// FILTER-FUNKTIONEN FÜR ANSICHTEN
// ══════════════════════════════════════════════════════════════════════

let personenObjekte = [];

function applyFiltersToNetzwerk(filter, epoche) {
  if (!nodeObjects || Object.keys(nodeObjects).length === 0) return;
  
  const hasFieber = filter.has('fieber');
  const hasPersonen = filter.has('personen');
  const hasEpoche = filter.has('epoche');
  const hasDebatten = filter.has('debatten');
  
  const getFieberFarbe = (temp) => {
    if (temp >= 60) return 0xf44336;
    if (temp >= 40) return 0xFF9800;
    if (temp >= 20) return 0x4CAF50;
    return 0x2196F3;
  };
  
  const achsenFarben = {
    '0': 0xE53935, '1': 0x4CAF50, '2': 0x2196F3,
    '00': 0xE53935, '01': 0xF44336, '02': 0xE91E63, '03': 0x9C27B0,
    '04': 0x673AB7, '05': 0x3F51B5, '06': 0x2196F3, '07': 0x03A9F4,
    '08': 0x00BCD4, '09': 0x009688, '10': 0x4CAF50, '11': 0x8BC34A,
    '12': 0xCDDC39, '13': 0xFFEB3B, '14': 0xFFC107, '15': 0xFF9800,
    '16': 0xFF5722, '17': 0x795548, '18': 0x9E9E9E, '19': 0x607D8B,
    '20': 0xE91E63, '21': 0x9C27B0, '22': 0x673AB7, '23': 0x3F51B5,
    '24': 0x2196F3, '25': 0x00BCD4
  };
  
  // Knoten aktualisieren
  nodes3d.forEach(node => {
    const sphere = nodeObjects[node.id];
    if (!sphere) return;
    
    // Epochen-Filter
    if (hasEpoche) {
      const entstehung = getEpocheForPosition(node.id);
      const sichtbar = entstehung <= epoche;
      sphere.visible = sichtbar;
    } else {
      sphere.visible = true;
    }
    
    // Fieber-Filter (Skalierung)
    if (hasFieber && sphere.visible) {
      const temp = temperaturCache[node.id] || 0;
      const scale = 0.8 + (temp / 100) * 0.8;
      sphere.scale.set(scale, scale, scale);
    } else {
      sphere.scale.set(1, 1, 1);
    }
  });
  
  // Personen-Sphären aktualisieren
  if (window.personSpheres3d) {
    console.log('🔍 DEBUG: Updating person spheres:', {
      total: window.personSpheres3d.length,
      hasPersonen,
      hasEpoche,
      epoche: epoche
    });
    
    let visibleCount = 0;
    
    window.personSpheres3d.forEach((sphere, index) => {
      // Personen-Filter - Grundsichtbarkeit
      if (!hasPersonen) {
        sphere.visible = false;
        return;
      }
      
      // Wenn Personen-Filter AN, dann weitere Filter prüfen
      sphere.visible = true;
      
      // Epochen-Filter für Personen
      if (hasEpoche) {
        const geboren = sphere.userData.geboren;
        if (geboren) {
          // Robustere Parsing - auch "1818-05-05" Format
          let jahr;
          if (typeof geboren === 'string') {
            const match = geboren.match(/(\d{4})/);
            jahr = match ? parseInt(match[1]) : null;
          } else {
            jahr = parseInt(geboren);
          }
          
          if (jahr) {
            // Person ist sichtbar wenn in/vor dieser Epoche geboren
            const sichtbar = jahr <= epoche;
            sphere.visible = sichtbar;
            
            if (sichtbar) visibleCount++;
            
            // Debug für erste 5 Personen
            if (index < 5) {
              console.log(`  ${sphere.userData.name}: geboren=${jahr}, epoche=${epoche}, sichtbar=${sichtbar}`);
            }
          } else {
            // Fehlerhafte Parsing - zeige an
            if (index < 5) {
              console.log(`  ${sphere.userData.name}: geboren="${geboren}" (parsing failed)`);
            }
            sphere.visible = true; // Fallback: sichtbar
            visibleCount++;
          }
        } else {
          // Ohne Geburtsjahr: immer sichtbar
          if (index < 5) {
            console.log(`  ${sphere.userData.name}: kein Geburtsjahr`);
          }
          sphere.visible = true;
          visibleCount++;
        }
      } else {
        visibleCount++;
      }
      
      // LOD: Label-Sichtbarkeit basierend auf Kamera-Distanz
      if (sphere.visible && camera) {
        const distance = camera.position.distanceTo(sphere.position);
        // Bei großer Distanz: Textur ausblenden (weiße Kugel bleibt)
        if (distance > 600) {
          // Weit weg: nur weiße Kugel ohne Label
          sphere.material.opacity = 0.6;
          sphere.material.transparent = true;
          sphere.scale.set(0.6, 0.6, 0.6);
        } else if (distance > 400) {
          // Mittlere Distanz: halbtransparentes Label
          sphere.material.opacity = 0.8;
          sphere.material.transparent = true;
          sphere.scale.set(0.8, 0.8, 0.8);
        } else {
          // Nah: volle Sichtbarkeit
          sphere.material.opacity = 1.0;
          sphere.material.transparent = false;
          sphere.scale.set(1, 1, 1);
        }
      }
    });
    
    console.log(`✅ Person sphere update complete. Sichtbar: ${visibleCount}/${window.personSpheres3d.length}`);
  }
  
  // Verbindungen aktualisieren
  if (linkObjects) {
    linkObjects.forEach(line => {
      if (!line.userData.link) return;
      
      const sourceVisible = nodeObjects[line.userData.source]?.visible ?? true;
      const targetVisible = nodeObjects[line.userData.target]?.visible ?? true;
      line.visible = sourceVisible && targetVisible;
      
      // Debatten-Filter
      if (hasDebatten && line.visible) {
        if (line.userData.link.typ === 'debatte') {
          line.material.opacity = 1.0;
          line.material.color.setHex(0xFF5722);
        } else {
          line.material.opacity = 0.1;
        }
      } else if (line.visible) {
        const link = line.userData.link;
        if (link.typ === 'debatte') {
          line.material.opacity = 0.6;
          line.material.color.setHex(0xFF9800);
        } else if (link.staerke > 0.8) {
          line.material.opacity = 0.8;
          line.material.color.setHex(0x4CAF50);
        } else {
          line.material.opacity = 0.3 + link.staerke * 0.4;
          line.material.color.setHex(0x555555);
        }
      }
    });
  }
  
  // Personen einblenden
  if (hasPersonen) {
    if (personenObjekte.length === 0) {
      erstellePersonenImNetzwerk();
    }
    personenObjekte.forEach(p => p.visible = true);
  } else {
    personenObjekte.forEach(p => p.visible = false);
  }
}

function erstellePersonenImNetzwerk() {
  if (!scene) return;
  
  nodes3d.forEach(node => {
    const knoten = knotenData[node.id];
    if (!knoten || !knoten.bewohner) return;
    
    const bewohner = [
      ...(knoten.bewohner.klassiker || []),
      ...(knoten.bewohner.zeitgenossen || [])
    ];
    
    if (bewohner.length === 0) return;
    
    bewohner.slice(0, 5).forEach((name, i) => {
      const winkel = (i / Math.min(bewohner.length, 5)) * Math.PI * 2;
      const radius = 25;
      
      const geometry = new THREE.SphereGeometry(4, 8, 8);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      sphere.position.set(
        node.x + Math.cos(winkel) * radius,
        node.y + Math.sin(winkel) * radius,
        node.z
      );
      
      sphere.userData = { type: 'person', name: name, position: node.id };
      sphere.visible = false;
      scene.add(sphere);
      personenObjekte.push(sphere);
    });
  });
}

function applyFiltersToListe(filter, epoche) {
  // Einfach die neue alphabetische Liste aufrufen
  // TODO: Filter-Funktionalität später wieder einbauen
  initListe();
}

function applyFiltersToKarte(filter, epoche) {
  // Einfach die neue 2D-Karte aufrufen
  // TODO: Filter-Funktionalität später wieder einbauen
  initKarte();
}

// ══════════════════════════════════════════════════════════════════════
// NETZWERK (3D)
// ══════════════════════════════════════════════════════════════════════

let scene, camera, renderer;
let nodeObjects = {};
let linkObjects = [];
let nodes3d = [];
let links3d = [];

function initNetzwerk() {
  const container = document.getElementById('netzwerk-container');
  const canvas = document.getElementById('netzwerk3d');
  
  if (!container || !canvas) {
    console.error('Netzwerk: Container oder Canvas nicht gefunden');
    return;
  }
  
  // Warte auf Container-Größe
  let width = container.offsetWidth || container.clientWidth;
  let height = container.offsetHeight || container.clientHeight;
  
  // Falls immer noch 0, berechne aus Window
  if (width <= 0) {
    width = window.innerWidth - 80;
  }
  if (height <= 0) {
    height = window.innerHeight - 60;
  }
  
  // Canvas explizit setzen
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  
  // Camera
  camera = new THREE.PerspectiveCamera(60, width / height, 1, 5000);
  camera.position.z = 800;
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Rotation Control
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let hoveredNode = null;
  let draggedNode = null;
  let dragPlane = new THREE.Plane();
  let mouseMovedWhileDragging = false; // Track ob Maus bewegt wurde
  
  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0 && !hoveredNode) {
      isDragging = true;
      mouseMovedWhileDragging = false; // Reset
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });
  
  canvas.addEventListener('mousemove', (e) => {
    if (isDragging && !draggedNode) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      // Track Bewegung
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        mouseMovedWhileDragging = true;
      }
      
      targetRotation.y += deltaX * 0.005;
      targetRotation.x += deltaY * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });
  
  canvas.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('mouseleave', () => { isDragging = false; });
  
  // ═══════════════════════════════════════════════════════════════
  // TOUCH EVENTS FÜR MOBILE
  // ═══════════════════════════════════════════════════════════════
  let touchStartDistance = 0;
  let initialCameraZ = camera.position.z;
  let lastTouchPos = { x: 0, y: 0 };
  let isTouching = false;
  let touchHintShown = false;
  
  // Touch-Hinweis anzeigen
  function showTouchHint() {
    if (touchHintShown) return;
    touchHintShown = true;
    
    let hint = document.querySelector('.touch-hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'touch-hint';
      hint.textContent = '👆 Wischen zum Drehen · 🤏 Pinch zum Zoomen';
      document.body.appendChild(hint);
    }
    hint.classList.add('visible');
    setTimeout(() => hint.classList.remove('visible'), 3000);
  }
  
  // Touch Start
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showTouchHint();
    
    if (e.touches.length === 1) {
      // Ein Finger - Drehen
      isTouching = true;
      lastTouchPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      // Zwei Finger - Zoom vorbereiten
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistance = Math.sqrt(dx * dx + dy * dy);
      initialCameraZ = camera.position.z;
    }
  }, { passive: false });
  
  // Touch Move
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isTouching) {
      // Ein Finger - Drehen
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchPos.x;
      const deltaY = touch.clientY - lastTouchPos.y;
      
      targetRotation.y += deltaX * 0.008;
      targetRotation.x += deltaY * 0.008;
      
      lastTouchPos = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2 && touchStartDistance > 0) {
      // Zwei Finger - Zoom (Pinch)
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      
      const scale = touchStartDistance / currentDistance;
      camera.position.z = Math.max(50, Math.min(2000, initialCameraZ * scale)); // Näher ranzoomen
    }
  }, { passive: false });
  
  // Touch End
  canvas.addEventListener('touchend', (e) => {
    isTouching = false;
    if (e.touches.length < 2) {
      touchStartDistance = 0;
    }
    if (e.touches.length === 1) {
      lastTouchPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isTouching = true;
    }
  });
  
  canvas.addEventListener('touchcancel', () => {
    isTouching = false;
    touchStartDistance = 0;
  });
  
  // Zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.5;
    camera.position.z = Math.max(50, Math.min(2000, camera.position.z)); // Näher ranzoomen erlauben
  });
  
  // Daten vorbereiten
  nodes3d = Object.values(knotenData).map(k => ({
    id: k.id,
    name: k.name,
    achse: k.achse,
    position: k.position,
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 600,
    z: (Math.random() - 0.5) * 600,
    vx: 0, vy: 0, vz: 0
  }));
  
    
  links3d = verbindungenData.map(v => ({
    source: v.von,
    target: v.zu,
    typ: v.typ,
    staerke: v.staerke,
    beschreibung: v.beschreibung
  }));
  
  // Knoten erstellen - mit Textur-Beschriftung auf der Kugel
  const achsenFarben = {
    '0': 0xE53935, '1': 0x4CAF50, '2': 0x2196F3,
    '00': 0xE53935, '01': 0xF44336, '02': 0xE91E63, '03': 0x9C27B0,
    '04': 0x673AB7, '05': 0x3F51B5, '06': 0x2196F3, '07': 0x03A9F4,
    '08': 0x00BCD4, '09': 0x009688, '10': 0x4CAF50, '11': 0x8BC34A,
    '12': 0xCDDC39, '13': 0xFFEB3B, '14': 0xFFC107, '15': 0xFF9800,
    '16': 0xFF5722, '17': 0x795548, '18': 0x9E9E9E, '19': 0x607D8B,
    '20': 0xE91E63, '21': 0x9C27B0, '22': 0x673AB7, '23': 0x3F51B5,
    '24': 0x2196F3, '25': 0x00BCD4
  };
  
  // Funktion: Textur mit Text für Kugel erstellen
  function createLabeledSphereTexture(name, baseColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Hintergrund mit Achsen-Farbe
    const hexColor = '#' + baseColor.toString(16).padStart(6, '0');
    ctx.fillStyle = hexColor;
    ctx.fillRect(0, 0, 512, 256);
    
    // Leichter Gradient für 3D-Effekt
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, 'rgba(255,255,255,0.2)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    
    // Text umbrechen
    function wrapText(text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      words.forEach(word => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);
      return lines;
    }
    
    // Text-Konfiguration - kleine Schrift
    const maxWidth = 460;
    const maxLines = 3;
    let fontSize = 19;
    let lines = [];
    
    // Schriftgröße anpassen bis es passt
    while (fontSize >= 10) {
      ctx.font = `bold ${fontSize}px Arial`;
      lines = wrapText(name, maxWidth);
      if (lines.length <= maxLines) break;
      fontSize -= 2;
    }
    
    // Falls immer noch zu viele Zeilen, kürzen
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].slice(0, -3) + '…';
    }
    
    // Text zeichnen
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = (256 - totalHeight) / 2 + lineHeight / 2;
    
    lines.forEach((line, i) => {
      const y = startY + i * lineHeight;
      // Schatten
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText(line, 258, y + 2);
      // Haupttext
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line, 256, y);
    });
    
    return new THREE.CanvasTexture(canvas);
  }
  
  nodes3d.forEach(node => {
    const farbe = achsenFarben[node.achse] || achsenFarben[node.achse[0]] || 0xffffff;
    
    // Kugel mit Textur-Label
    const texture = createLabeledSphereTexture(node.name, farbe);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const nodeGeometry = new THREE.SphereGeometry(12, 32, 32);
    const sphere = new THREE.Mesh(nodeGeometry, material);
    sphere.position.set(node.x, node.y, node.z);
    
    // WICHTIG: Initial-Rotation damit Text nach vorne zeigt
    sphere.rotation.y = Math.PI; // 180° damit Text zur Kamera zeigt
    
    sphere.userData = { id: node.id, name: node.name, typ: 'knoten' };
    scene.add(sphere);
    nodeObjects[node.id] = sphere;
  });
  
  window.personSpheres3d = [];
  // ═══════════════════════════════════════════════════════════════
  // Verbindungen erstellen
  links3d.forEach(link => {
    const sourceNode = nodes3d.find(n => n.id === link.source);
    const targetNode = nodes3d.find(n => n.id === link.target);
    if (!sourceNode || !targetNode) return;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      sourceNode.x, sourceNode.y, sourceNode.z,
      targetNode.x, targetNode.y, targetNode.z
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    let color, opacity;
    if (link.typ === 'debatte') {
      color = 0xFF9800;
      opacity = 0.6;
    } else if (link.staerke > 0.8) {
      color = 0x4CAF50;
      opacity = 0.8;
    } else {
      color = 0x555555;
      opacity = 0.3 + link.staerke * 0.4;
    }
    
    const material = new THREE.LineBasicMaterial({ 
      color: color, 
      transparent: true, 
      opacity: opacity,
      linewidth: 1 + link.staerke * 2
    });
    
    const line = new THREE.Line(geometry, material);
    line.userData = { source: link.source, target: link.target, link: link };
    scene.add(line);
    linkObjects.push(line);
  });
  
  // Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    if (draggedNode) {
      raycaster.setFromCamera(mouse, camera);
      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane, intersect);
      if (intersect) {
        const node = nodes3d.find(n => n.id === draggedNode.userData.id);
        if (node) {
          node.x = intersect.x;
          node.y = intersect.y;
          node.z = intersect.z;
        }
      }
    } else {
      raycaster.setFromCamera(mouse, camera);
      // Kombiniere Knoten und Personen für Hover-Detection
      const allSpheres = Object.values(nodeObjects).filter(o => o.type === 'Mesh');
      if (window.personSpheres3d) {
        allSpheres.push(...window.personSpheres3d.filter(s => s.visible));
      }
      const intersects = raycaster.intersectObjects(allSpheres);
      
      if (intersects.length > 0) {
        const newHovered = intersects[0].object;
        if (hoveredNode !== newHovered) {
          if (hoveredNode) hoveredNode.scale.set(1, 1, 1);
          hoveredNode = newHovered;
          hoveredNode.scale.set(1.2, 1.2, 1.2);
          canvas.style.cursor = 'pointer';
        }
      } else {
        if (hoveredNode) {
          hoveredNode.scale.set(1, 1, 1);
          hoveredNode = null;
        }
        canvas.style.cursor = 'grab';
      }
    }
  });
  
  canvas.addEventListener('mousedown', (e) => {
    if (hoveredNode && e.button === 0) {
      // DEAKTIVIERT: Knoten-Dragging (war zu störend)
      // draggedNode = hoveredNode;
      // canvas.style.cursor = 'grabbing';
    }
  });
  
  canvas.addEventListener('mouseup', (e) => {
    if (draggedNode) {
      nodes3d.forEach(n => {
        const obj = nodeObjects[n.id];
        obj.scale.set(1, 1, 1);
      });
      
      draggedNode = null;
      canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }
  });
  
  canvas.addEventListener('click', (e) => {
    // Nur öffnen wenn NICHT gedragged wurde
    if (hoveredNode && !draggedNode && !mouseMovedWhileDragging) {
      const userData = hoveredNode.userData;
      if (userData.typ === 'person') {
        // Person anzeigen
        showPerson(userData.id);
      } else {
        // Knoten anzeigen
        showKnoten(userData.id);
      }
    }
  });
  
  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    
    simulate3D();
    
    scene.rotation.y += (targetRotation.y - scene.rotation.y) * 0.1;
    scene.rotation.x += (targetRotation.x - scene.rotation.x) * 0.1;
    
    nodes3d.forEach(node => {
      const sphere = nodeObjects[node.id];
      if (sphere) {
        sphere.position.set(node.x, node.y, node.z);
        
        // BILLBOARD-EFFEKT: Kompensiere Scene-Rotation (diesmal OHNE Negation auf Y)
        sphere.rotation.x = -scene.rotation.x;
        sphere.rotation.y = scene.rotation.y; // OHNE Minus!
        sphere.rotation.z = 0;
      }
    });
    
    linkObjects.forEach(line => {
      const sourceNode = nodes3d.find(n => n.id === line.userData.source);
      const targetNode = nodes3d.find(n => n.id === line.userData.target);
      if (sourceNode && targetNode) {
        const positions = line.geometry.attributes.position.array;
        positions[0] = sourceNode.x; positions[1] = sourceNode.y; positions[2] = sourceNode.z;
        positions[3] = targetNode.x; positions[4] = targetNode.y; positions[5] = targetNode.z;
        line.geometry.attributes.position.needsUpdate = true;
      }
    });
    
    // BILLBOARD-EFFEKT: Personen-Sphären immer zur Kamera drehen
    if (window.personSpheres3d) {
      window.personSpheres3d.forEach(sphere => {
        if (sphere.visible) {
          // Kompensiere Scene-Rotation (Y OHNE Negation, X MIT Negation)
          sphere.rotation.x = -scene.rotation.x;
          sphere.rotation.y = scene.rotation.y; // OHNE Minus!
          sphere.rotation.z = 0;
        }
      });
    }
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Loading-Text entfernen
  const loadingEl = document.getElementById('netzwerk-loading');
  if (loadingEl) loadingEl.style.display = 'none';
  
    
  window.addEventListener('resize', () => {
    let w = container.clientWidth || container.offsetWidth;
    let h = container.clientHeight || container.offsetHeight;
    if (w <= 0) w = window.innerWidth - 80;
    if (h <= 0) h = window.innerHeight - 60;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

function simulate3D() {
  const alpha = 0.02;
  const repulsion = 3000;
  const attraction = 0.01;
  const centerForce = 0.001;
  
  for (let i = 0; i < nodes3d.length; i++) {
    for (let j = i + 1; j < nodes3d.length; j++) {
      const a = nodes3d[i];
      const b = nodes3d[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const force = repulsion / (dist * dist);
      
      const fx = (dx / dist) * force * alpha;
      const fy = (dy / dist) * force * alpha;
      const fz = (dz / dist) * force * alpha;
      
      a.vx -= fx; a.vy -= fy; a.vz -= fz;
      b.vx += fx; b.vy += fy; b.vz += fz;
    }
  }
  
  links3d.forEach(link => {
    const source = nodes3d.find(n => n.id === link.source);
    const target = nodes3d.find(n => n.id === link.target);
    if (!source || !target) return;
    
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dz = target.z - source.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    
    const targetDist = 100 - link.staerke * 50;
    const force = (dist - targetDist) * attraction * link.staerke;
    
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    const fz = (dz / dist) * force;
    
    source.vx += fx; source.vy += fy; source.vz += fz;
    target.vx -= fx; target.vy -= fy; target.vz -= fz;
  });
  
  nodes3d.forEach(node => {
    node.vx -= node.x * centerForce;
    node.vy -= node.y * centerForce;
    node.vz -= node.z * centerForce;
  });
  
  nodes3d.forEach(node => {
    node.vx *= 0.9; node.vy *= 0.9; node.vz *= 0.9;
    node.x += node.vx; node.y += node.vy; node.z += node.vz;
  });
  
  if (Math.random() < 0.01) {
    const randomNode = nodes3d[Math.floor(Math.random() * nodes3d.length)];
    randomNode.vx += (Math.random() - 0.5) * 3;
    randomNode.vy += (Math.random() - 0.5) * 3;
    randomNode.vz += (Math.random() - 0.5) * 3;
  }
}

function showReaktion(idA, idB) {
  const a = knotenData[idA];
  const b = knotenData[idB];
  if (!a || !b) return;
  
  const analyse = analysiereVerbindung(idA, idB);
  const synthese = generiereSynthese(a, b, analyse);
  
  const panel = document.getElementById('detail-panel');
  panel.innerHTML = `
    <button class="close-btn" onclick="closePanel()">×</button>
    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
      <h1 style="font-size: 1.2rem; color: #E53935; margin: 0;">${a.name}</h1>
      <span style="font-size: 1.5rem; color: #666;">⟷</span>
      <h1 style="font-size: 1.2rem; color: #E53935; margin: 0;">${b.name}</h1>
    </div>
    
    <section>
      <h2>Verbindung</h2>
      ${analyse.direkteVerbindung ? `
        <div style="background: #2a2a2a; padding: 1rem; border-radius: 4px; border-left: 3px solid ${analyse.direkteVerbindung.typ === 'debatte' ? '#FF9800' : '#4CAF50'};">
          <strong>${analyse.direkteVerbindung.typ === 'debatte' ? '⚔️ Debatte' : '🤝 Affinität'}</strong>
          <p style="margin: 0.5rem 0 0 0; color: #aaa;">${analyse.direkteVerbindung.beschreibung || ''}</p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem;">Stärke: ${Math.round(analyse.direkteVerbindung.staerke * 100)}%</p>
        </div>
      ` : `
        <div style="background: #2a2a2a; padding: 1rem; border-radius: 4px; border-left: 3px solid #666;">
          <strong>Keine direkte Verbindung dokumentiert</strong>
          ${analyse.pfad ? `<p style="margin: 0.5rem 0 0 0; color: #888; font-size: 0.85rem;">
            Pfad: ${analyse.pfad.map(id => knotenData[id]?.name || id).join(' → ')}
          </p>` : ''}
        </div>
      `}
    </section>
    
    ${analyse.gemeinsameNachbarn.length > 0 ? `
    <section>
      <h2>Gemeinsame Nachbarn</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${analyse.gemeinsameNachbarn.map(n => `
          <span onclick="showReaktion('${idA}', '${n.id}')" 
                style="background: #333; padding: 0.3rem 0.6rem; border-radius: 3px; cursor: pointer; font-size: 0.85rem;">
            ${n.name}
          </span>
        `).join('')}
      </div>
    </section>
    ` : ''}
    
    <section>
      <h2>Synthese / Spannung</h2>
      <p style="line-height: 1.6;">${synthese.text}</p>
      ${synthese.frage ? `
        <div style="background: #2a2a2a; padding: 0.75rem; border-left: 3px solid #FF9800; margin-top: 1rem; font-style: italic; color: #aaa;">
          ${synthese.frage}
        </div>
      ` : ''}
    </section>
    
    <div style="margin-top: 2rem; display: flex; gap: 0.5rem;">
      <button onclick="showKnoten('${idA}')" style="flex: 1; background: #333; border: none; color: #fff; padding: 0.75rem; cursor: pointer; border-radius: 4px;">
        → ${a.name}
      </button>
      <button onclick="showKnoten('${idB}')" style="flex: 1; background: #333; border: none; color: #fff; padding: 0.75rem; cursor: pointer; border-radius: 4px;">
        → ${b.name}
      </button>
    </div>
  `;
  panel.classList.add('open');
}

// ═══════════════════════════════════════════════════════════════
// PERSONEN-SPHÄREN: On-Demand Erstellung beim Filter-Klick
// ═══════════════════════════════════════════════════════════════

function createPersonSpheres() {
  // Prüfe ob Netzwerk existiert
  if (!scene || !nodes3d || !nodeObjects) {
    console.error('❌ Netzwerk nicht initialisiert');
    return;
  }
  
  // Prüfe ob PersonenData geladen
  if (!personenData || personenData.length === 0) {
    console.warn('⏳ PersonenData noch nicht geladen, lade jetzt...');
    loadPersonenData().then(() => createPersonSpheres());
    return;
  }
  
  console.log(`🎨 Erstelle ${personenData.length} Personen-Sphären...`);
  
  // Hilfsfunktion: Textur für Personen-Label (AUSSEN definiert!)
  function createPersonLabelTexture(name) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Weißer Hintergrund
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 256);
    
    // Nur Nachname
    const parts = name.split(' ');
    const nachname = parts[parts.length - 1] || name; // Fallback auf ganzen Namen
    const displayName = nachname.length > 12 ? nachname.substring(0, 10) + '…' : nachname;
    
    // KLEINERE Schrift für mehr Lesbarkeit bei vielen Kugeln
    ctx.font = 'bold 42px Arial'; // 42px statt 64px
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Schwarzer Schatten für Kontrast
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText(displayName, 258, 130);
    ctx.fillText(displayName, 254, 130);
    ctx.fillText(displayName, 256, 132);
    ctx.fillText(displayName, 256, 126);
    
    // Haupttext schwarz
    ctx.fillStyle = '#000000';
    ctx.fillText(displayName, 256, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    // KEINE Textur-Rotation mehr
    
    return texture;
  }
  
  const personSpheres = [];
  let added = 0;
  let textureErrors = 0;
  
  personenData.forEach((person, index) => {
    try {
      // Finde zugehörige Position
      const hauptzimmer = person.hauptzimmer || [];
      let erstePosition = hauptzimmer[0];
      
      // Falls keine Hauptzimmer: Zufällige Position wählen
      if (!erstePosition || !nodeObjects[erstePosition]) {
        const allePositionen = Object.keys(nodeObjects);
        erstePosition = allePositionen[Math.floor(Math.random() * allePositionen.length)];
      }
      
      const basisKnoten = nodes3d.find(n => n.id === erstePosition);
      if (!basisKnoten) return;
      
      // MEHR ABSTAND zwischen Kugeln (größerer Radius)
      const angle = Math.random() * Math.PI * 2;
      const distance = 35 + Math.random() * 25; // 35-60 statt 20-35
      const x = basisKnoten.x + Math.cos(angle) * distance;
      const y = basisKnoten.y + Math.sin(angle) * distance;
      const z = basisKnoten.z + (Math.random() - 0.5) * 50; // mehr Tiefe
      
      // Erstelle Textur
      const texture = createPersonLabelTexture(person.name);
      
      if (!texture) {
        console.warn(`Textur-Fehler für ${person.name}`);
        textureErrors++;
        return;
      }
      
      // Kugel mit Label-Textur
      const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: false
      });
      
      const geometry = new THREE.SphereGeometry(8, 32, 32); // Etwas größer
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, z);
      
      // WICHTIG: Initial-Rotation damit Text nach vorne zeigt
      sphere.rotation.y = Math.PI; // 180° damit Text zur Kamera zeigt
      
      sphere.userData = {
        typ: 'person',
        id: person.id,
        name: person.name,
        geboren: person.geboren,
        gestorben: person.gestorben
      };
      
      sphere.visible = false; // Standardmäßig unsichtbar
      scene.add(sphere);
      personSpheres.push(sphere);
      added++;
    } catch (err) {
      console.error(`Fehler bei Person ${person.name}:`, err);
    }
  });
  
  window.personSpheres3d = personSpheres;
  personSpheresCreated = true;
  
  console.log(`✅ ${added} Personen-Sphären erstellt (${textureErrors} Fehler)`);
  
  // Filter sofort anwenden
  applyFiltersToNetzwerk(aktiveFilter, epocheWert);
}

function initListe() {
  console.log('📋 initListe gestartet - ALPHABETISCHE LISTE');
  const container = document.getElementById('liste-container');
  
  if (!container) {
    console.error('❌ liste-container nicht gefunden!');
    return;
  }
  
  // Container leeren und neu aufbauen
  container.innerHTML = '';
  container.style.cssText = 'display: block; padding: 2rem; overflow-y: auto; background: #1a1a1a; flex: 1;';
  
  // Header
  const header = document.createElement('div');
  header.style.cssText = 'text-align: center; margin-bottom: 2rem;';
  header.innerHTML = `
    <h2 style="font-size: 1.5rem; font-weight: 300; color: #f5f5f5; margin-bottom: 0.5rem;">📋 Alphabetisches Verzeichnis</h2>
    <p style="color: #888; font-size: 0.9rem;">Alle Positionen, Personen und Begriffe des linken Denkens</p>
  `;
  container.appendChild(header);
  
  // Sammle alle Einträge (Positionen + Personen)
  const alleEintraege = [];
  
  // Positionen hinzufügen
  Object.values(knotenData).forEach(k => {
    alleEintraege.push({
      typ: 'position',
      name: k.name,
      id: k.id,
      achse: k.achse,
      beschreibung: k.beschreibung
    });
  });
  
  // Personen hinzufügen
  if (typeof personenData !== 'undefined') {
    personenData.forEach(p => {
      alleEintraege.push({
        typ: 'person',
        name: p.name,
        id: p.id,
        beschreibung: p.kurz || ''
      });
    });
  }
  
  // Hilfsfunktion: Nachname extrahieren
  function getNachname(name) {
    // Entferne Lebensdaten und Präfixe
    const clean = name.replace(/\s*\(.*?\)\s*/g, '').trim();
    const parts = clean.split(' ');
    
    // Sonderbehandlung für "von", "de", "van" etc.
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i].toLowerCase();
      // Wenn es kein Präfix ist, ist es der Nachname
      if (!['von', 'de', 'van', 'der', 'den', 'zu', 'del', 'di', 'da'].includes(part)) {
        return parts.slice(i).join(' '); // Ab hier ist Nachname (inkl. Präfixe davor)
      }
    }
    return parts[parts.length - 1]; // Fallback: letztes Wort
  }
  
  // Hilfsfunktion: Name umdrehen zu "Nachname, Vorname"
  function formatPersonName(name) {
    const clean = name.replace(/\s*\(.*?\)\s*/g, '').trim();
    const parts = clean.split(' ');
    
    if (parts.length === 1) return name; // Nur ein Wort
    
    // Finde wo Nachname beginnt (vor "von", "de" etc.)
    let nachnameStart = parts.length - 1;
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i].toLowerCase();
      if (['von', 'de', 'van', 'der', 'den', 'zu', 'del', 'di', 'da'].includes(part)) {
        nachnameStart = i;
      }
    }
    
    const vorname = parts.slice(0, nachnameStart).join(' ');
    const nachname = parts.slice(nachnameStart).join(' ');
    
    return `${nachname}, ${vorname}`;
  }
  
  // Füge Display-Namen hinzu für Personen
  alleEintraege.forEach(eintrag => {
    if (eintrag.typ === 'person') {
      eintrag.displayName = formatPersonName(eintrag.name);
    } else {
      eintrag.displayName = eintrag.name;
    }
  });
  
  // Nach Nachname sortieren (aber Positionen nach erstem Buchstaben)
  alleEintraege.sort((a, b) => {
    if (a.typ === 'person' && b.typ === 'person') {
      const nachnameA = getNachname(a.name);
      const nachnameB = getNachname(b.name);
      return nachnameA.localeCompare(nachnameB, 'de');
    } else if (a.typ === 'position' && b.typ === 'position') {
      return a.name.localeCompare(b.name, 'de');
    } else {
      // Mische Personen und Positionen alphabetisch
      const keyA = a.typ === 'person' ? getNachname(a.name) : a.name;
      const keyB = b.typ === 'person' ? getNachname(b.name) : b.name;
      return keyA.localeCompare(keyB, 'de');
    }
  });
  
  // Liste erstellen
  const liste = document.createElement('div');
  liste.style.cssText = 'max-width: 900px; margin: 0 auto;';
  
  let aktuellerBuchstabe = '';
  
  alleEintraege.forEach(eintrag => {
    // Für Personen: Nachname verwenden, für Positionen: ganzer Name
    let ersterbuchstabe;
    if (eintrag.typ === 'person') {
      const nachname = getNachname(eintrag.name);
      ersterbuchstabe = nachname[0].toUpperCase();
    } else {
      ersterbuchstabe = eintrag.name[0].toUpperCase();
    }
    
    // Buchstaben-Überschrift
    if (ersterbuchstabe !== aktuellerBuchstabe) {
      aktuellerBuchstabe = ersterbuchstabe;
      const buchstabenHeader = document.createElement('div');
      buchstabenHeader.style.cssText = 'font-size: 1.5rem; font-weight: bold; color: #E53935; margin-top: 2rem; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #333;';
      buchstabenHeader.textContent = aktuellerBuchstabe;
      liste.appendChild(buchstabenHeader);
    }
    
    // Eintrag
    const item = document.createElement('div');
    item.style.cssText = 'padding: 0.75rem 1rem; margin-bottom: 0.5rem; background: #222; border-left: 3px solid ' + (eintrag.typ === 'position' ? '#E53935' : '#2196F3') + '; border-radius: 4px; cursor: pointer; transition: all 0.2s;';
    
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
        <span style="font-size: 1rem; font-weight: 500; color: #f5f5f5;">${eintrag.displayName}</span>
        <span style="font-size: 0.7rem; padding: 0.2rem 0.5rem; background: ${eintrag.typ === 'position' ? '#E53935' : '#2196F3'}; color: #fff; border-radius: 3px;">${eintrag.typ === 'position' ? 'POSITION' : 'PERSON'}</span>
      </div>
      ${eintrag.beschreibung ? `<div style="font-size: 0.85rem; color: #aaa; line-height: 1.4;">${eintrag.beschreibung.substring(0, 120)}${eintrag.beschreibung.length > 120 ? '...' : ''}</div>` : ''}
    `;
    
    item.onmouseover = () => { item.style.background = '#2a2a2a'; item.style.transform = 'translateX(5px)'; };
    item.onmouseout = () => { item.style.background = '#222'; item.style.transform = 'translateX(0)'; };
    
    if (eintrag.typ === 'position') {
      item.onclick = () => showKnoten(eintrag.id);
    } else {
      item.onclick = () => searchPerson(eintrag.name);
    }
    
    liste.appendChild(item);
  });
  
  container.appendChild(liste);
  console.log('✅ Alphabetische Liste erstellt:', alleEintraege.length, 'Einträge');
}

function initDebatten() {
  const container = document.getElementById('debatten-container');
  debattenData.forEach(d => {
    const card = document.createElement('div');
    card.className = 'debatte-card';
    card.innerHTML = `
      <h2>${d.titel}</h2>
      <p class="frage">${d.frage}</p>
      <div class="debatte-seiten">
        <div class="debatte-seite a">
          <h4>🔴 ${d.seite_a.position}</h4>
          <ul>${d.seite_a.argumente.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>
        <div class="debatte-seite b">
          <h4>🔵 ${d.seite_b.position}</h4>
          <ul>${d.seite_b.argumente.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>
      </div>
      ${d.historisch ? `<div class="debatte-historisch"><strong>${d.historisch.wann}:</strong> ${d.historisch.anlass}<br><strong>Ausgang:</strong> ${d.historisch.ausgang}</div>` : ''}
      ${d.texte?.length ? `<div class="debatte-texte"><strong>Texte:</strong> ${d.texte.map(t => `<a href="${t.url}" target="_blank">${t.autor}</a>`).join(' · ')}</div>` : ''}
    `;
    container.appendChild(card);
  });
}

function showKnoten(id) {
  const k = knotenData[id];
  if (!k) return;
  
  const verbindungen = verbindungenData
    .filter(v => v.von === id || v.zu === id)
    .map(v => ({
      ...v,
      ziel: v.von === id ? v.zu : v.von,
      zielName: knotenData[v.von === id ? v.zu : v.von]?.name
    }))
    .filter(v => v.zielName); // Nur gültige Verbindungen (mit existierendem Ziel)
  
  // Helper: Namen klickbar machen
  const linkifyName = (name) => {
    const cleanName = name.replace(/\s*\(\d{4}.*?\)\s*/g, '').trim();
    return `<span class="person-link" onclick="searchPerson('${cleanName.replace(/'/g, "\\'")}')">${name}</span>`;
  };
  
  document.getElementById('detail-content').innerHTML = `
    <span class="achse-tag">${k.achse}-${k.position}</span>
    <h2>${k.name}</h2>
    <p class="beschreibung">${k.beschreibung}</p>
    ${k.zitate?.length ? `<h3>💬 Stimmen</h3>${k.zitate.map(z => `<div class="zitat">"${z.text}"<div class="zitat-autor">— <span class="person-link" onclick="searchPerson('${z.autor.replace(/'/g, "\\'")}')">${z.autor}</span>${z.quelle ? `, ${z.quelle}` : ''}${z.jahr ? ` (${z.jahr})` : ''}</div></div>`).join('')}` : ''}
    ${k.bewohner?.klassiker?.length ? `<h3>🏛️ Klassiker</h3><div class="bewohner">${k.bewohner.klassiker.map(b => linkifyName(b)).join('')}</div>` : ''}
    ${k.bewohner?.zeitgenossen?.length ? `<h3>👤 Zeitgenossen</h3><div class="bewohner">${k.bewohner.zeitgenossen.map(b => linkifyName(b)).join('')}</div>` : ''}
    ${k.literatur?.length ? `<h3>📚 Literatur</h3>${k.literatur.map(l => `<div class="literatur-item"><div class="titel">${l.titel}${l.frei ? '<span class="frei-tag">FREI</span>' : ''}</div><div class="autor">${l.autor}${l.jahr ? ` (${l.jahr})` : ''}</div>${l.notiz ? `<div style="font-size:0.8rem;color:#aaa;margin:0.3rem 0">${l.notiz}</div>` : ''}${l.url ? `<a href="${l.url}" target="_blank">→ Lesen</a>` : ''}</div>`).join('')}` : ''}
    ${k.praxis?.length ? `<h3>✊ Praxis</h3>${k.praxis.map(p => `<div class="literatur-item"><div class="titel">${p.name}</div><div class="autor">${p.ort}, ${p.zeit}</div><div style="font-size:0.85rem;color:#aaa;margin-top:0.3rem">${p.beschreibung}</div></div>`).join('')}` : ''}
    ${verbindungen.length ? `<h3>🔗 Verbindungen</h3><div class="verbindungen">${verbindungen.map(v => `<span class="verbindung ${v.staerke > 0.8 ? 'stark' : ''} ${v.typ === 'debatte' ? 'debatte' : ''}" onclick="showKnoten('${v.ziel}')" title="${v.beschreibung || ''}">${v.zielName}</span>`).join('')}</div>` : ''}
    ${k.fragen?.length ? `<h3>❓ Offene Fragen</h3><ul style="list-style:none;font-size:0.9rem;color:#aaa">${k.fragen.map(f => `<li style="margin-bottom:0.5rem">• ${f}</li>`).join('')}</ul>` : ''}
    ${k.atmosphaere ? `<h3>🌫️ Atmosphäre</h3><div class="atmosphaere"><strong>Stimmung:</strong> ${k.atmosphaere.stimmung}<br><strong>Geräusche:</strong> ${k.atmosphaere.geraeusche}<br><strong>Geruch:</strong> ${k.atmosphaere.geruch}</div>` : ''}
  `;
  const panel = document.getElementById('detail-panel');
  panel.classList.add('open');
  
  // Scroll Panel nach oben
  panel.scrollTop = 0;
  document.getElementById('detail-content').scrollTop = 0;
}

// Person suchen und alle ihre Positionen zeigen
function searchPerson(name) {
  // Erst in personenData suchen (reichhaltige Daten)
  const cleanName = name.replace(/\s*\(\d{4}.*?\)\s*/g, '').replace(/\s*\(\*\d{4}\)\s*/g, '').trim().toLowerCase();
  
  // Mehrere Matching-Strategien
  const personInDb = personenData.find(p => {
    const pName = p.name.toLowerCase();
    // Exakter Match
    if (pName === cleanName) return true;
    // Enthält (für Teilnamen)
    if (pName.includes(cleanName) || cleanName.includes(pName)) return true;
    // Nachname-Match (letztes Wort)
    const nachname = cleanName.split(' ').pop();
    if (nachname.length > 3 && pName.includes(nachname)) return true;
    return false;
  });
  
  if (personInDb) {
    // Person gefunden in personenData -> zeige reichhaltige Ansicht
    showPerson(personInDb.id);
    return;
  }
  
  // Fallback: Finde alle Knoten wo diese Person vorkommt
  const gefunden = [];
  Object.values(knotenData).forEach(k => {
    const alleNamen = [
      ...(k.bewohner?.klassiker || []),
      ...(k.bewohner?.zeitgenossen || []),
      ...(k.zitate?.map(z => z.autor) || [])
    ];
    if (alleNamen.some(n => n.includes(name) || name.includes(n.replace(/\s*\(\d{4}.*?\)\s*/g, '').trim()))) {
      gefunden.push(k);
    }
  });
  
  if (gefunden.length === 1) {
    showKnoten(gefunden[0].id);
  } else if (gefunden.length > 1) {
    // Zeige Auswahl
    const detailContent = document.getElementById('detail-content');
    const detailPanel = document.getElementById('detail-panel');
    if (detailContent && detailPanel) {
      detailContent.innerHTML = `
        <h2>🔍 ${name}</h2>
        <p style="color: var(--text-secondary)">Diese Person findet sich in ${gefunden.length} Positionen:</p>
        <div class="verbindungen" style="margin-top: 1rem">
          ${gefunden.map(k => `<span class="verbindung" onclick="showKnoten('${k.id}')">${k.name} (${k.achse})</span>`).join('')}
        </div>
      `;
      detailPanel.classList.add('open');
    }
  } else {
    // Nicht gefunden - zeige Info
    const detailContent = document.getElementById('detail-content');
    const detailPanel = document.getElementById('detail-panel');
    if (detailContent && detailPanel) {
      detailContent.innerHTML = `
        <h2>👤 ${name}</h2>
        <p style="color: var(--text-secondary)">Noch keine detaillierten Informationen zu dieser Person.</p>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 1rem;">Diese Person wird in Zukunft mit Biografie, Werken und Beziehungen zu anderen Denkern ergänzt.</p>
      `;
      detailPanel.classList.add('open');
    }
  }
}

function closePanel() {
  const panel = document.getElementById('detail-panel');
  if (panel) {
    panel.classList.remove('open');
  }
}

// ══════════════════════════════════════════════════════════════════════
// SUCHE
// ══════════════════════════════════════════════════════════════════════

function globalSearch(query) {
  if (!query || query.length < 2) return;
  
  const q = query.toLowerCase();
  const results = {
    positionen: [],
    personen: [],
    zitate: [],
    stammbaum: []
  };
  
  // Positionen durchsuchen
  Object.values(knotenData).forEach(k => {
    if (k.name.toLowerCase().includes(q) || 
        k.beschreibung.toLowerCase().includes(q) ||
        (k.bewohner?.klassiker || []).some(b => b.toLowerCase().includes(q)) ||
        (k.bewohner?.zeitgenossen || []).some(b => b.toLowerCase().includes(q))) {
      results.positionen.push(k);
    }
    
    // Zitate durchsuchen
    (k.zitate || []).forEach(z => {
      if (z.text.toLowerCase().includes(q) || z.autor.toLowerCase().includes(q)) {
        results.zitate.push({ ...z, position: k });
      }
    });
  });
  
  // Stammbaum durchsuchen
  stammbaumData.stroemungen.forEach(s => {
    if (s.name.toLowerCase().includes(q) || 
        s.kernidee.toLowerCase().includes(q) ||
        (s.werke || []).some(w => w.toLowerCase().includes(q))) {
      results.stammbaum.push(s);
    }
  });
  
  // Ergebnisse anzeigen
  showSearchResults(query, results);
}

function showSearchResults(query, results) {
  const total = results.positionen.length + results.zitate.length + results.stammbaum.length;
  
  let html = `
    <h2>🔍 "${query}"</h2>
    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${total} Ergebnisse</p>
  `;
  
  if (results.positionen.length) {
    html += `
      <h3>📍 Positionen (${results.positionen.length})</h3>
      <div class="verbindungen" style="margin-bottom: 1.5rem;">
        ${results.positionen.slice(0, 10).map(p => 
          `<span class="verbindung" onclick="showKnoten('${p.id}')">${p.name} <small style="opacity:0.6">(${p.achse})</small></span>`
        ).join('')}
        ${results.positionen.length > 10 ? `<span style="color:#888;font-size:0.8rem;">...und ${results.positionen.length - 10} mehr</span>` : ''}
      </div>
    `;
  }
  
  if (results.stammbaum.length) {
    html += `
      <h3>👤 Denker*innen (${results.stammbaum.length})</h3>
      <div class="verbindungen" style="margin-bottom: 1.5rem;">
        ${results.stammbaum.slice(0, 10).map(s => 
          `<span class="verbindung" onclick="showStammbaumPerson('${s.id}')">${s.name} <small style="opacity:0.6">(${s.leben || ''})</small></span>`
        ).join('')}
        ${results.stammbaum.length > 10 ? `<span style="color:#888;font-size:0.8rem;">...und ${results.stammbaum.length - 10} mehr</span>` : ''}
      </div>
    `;
  }
  
  if (results.zitate.length) {
    html += `
      <h3>💬 Zitate (${results.zitate.length})</h3>
      <div style="margin-bottom: 1.5rem;">
        ${results.zitate.slice(0, 5).map(z => `
          <div class="zitat" style="cursor:pointer;" onclick="showKnoten('${z.position.id}')">
            "${z.text.substring(0, 100)}${z.text.length > 100 ? '...' : ''}"
            <div class="zitat-autor">— ${z.autor}</div>
          </div>
        `).join('')}
        ${results.zitate.length > 5 ? `<p style="color:#888;font-size:0.8rem;">...und ${results.zitate.length - 5} mehr</p>` : ''}
      </div>
    `;
  }
  
  if (total === 0) {
    html += `<p style="color: var(--text-secondary);">Keine Ergebnisse gefunden.</p>`;
  }
  
  document.getElementById('detail-content').innerHTML = html;
  document.getElementById('detail-panel').classList.add('open');
}

// Stats - wird aktualisiert wenn knotenData geladen ist
document.getElementById('stats').textContent = `Lade Daten...`;

// Init - ALLE Initialisierungen erfolgen nach dem Laden von knotenData (siehe fetch oben)

// ══════════════════════════════════════════════════════════════════════
// KARTE
// ══════════════════════════════════════════════════════════════════════

function initKarte() {
  console.log('🗺️ initKarte gestartet - 2D POLITISCHER KOMPASS');
  const container = document.getElementById('karte-container');
  if (!container) {
    console.error('❌ karte-container nicht gefunden!');
    return;
  }
  
  container.innerHTML = '';
  container.style.cssText = 'display: block; padding: 2rem; overflow-y: auto; background: #1a1a1a; flex: 1;';
  
  // Y-Positionen: Klasse (0) bis Identität (5)
  const yPositionen = {
    // 00: Reform/Revolution - stark klassenkämpferisch
    '00-0': 0, '00-1': 0, '00-2': 0, '00-3': 1, '00-4': 1, '00-5': 1,
    
    // 01: Eigentum - ökonomisch, klassenkämpferisch
    '01-0': 0, '01-1': 0, '01-2': 0, '01-3': 1, '01-4': 1, '01-5': 1,
    
    // 02: Planung - ökonomisch, klassenkämpferisch
    '02-0': 0, '02-1': 0, '02-2': 0, '02-3': 1, '02-4': 1, '02-5': 2,
    
    // 03: Sozialstaat - klassisch sozialdemokratisch
    '03-0': 1, '03-1': 1, '03-2': 1, '03-3': 1, '03-4': 2, '03-5': 2,
    
    // 04: Steuern - Umverteilung, klassenkämpferisch
    '04-0': 1, '04-1': 1, '04-2': 1, '04-3': 1, '04-4': 1, '04-5': 0,
    
    // 05: Wohnen - materielle Frage, eher Klasse
    '05-0': 1, '05-1': 1, '05-2': 1, '05-3': 2, '05-4': 2, '05-5': 0,
    
    // 06: Gesundheit - materielle Frage, eher Klasse
    '06-0': 1, '06-1': 1, '06-2': 1, '06-3': 2, '06-4': 2, '06-5': 0,
    
    // 07: Bildung - kann beides sein
    '07-0': 1, '07-1': 2, '07-2': 2, '07-3': 3, '07-4': 3, '07-5': 1,
    
    // 08: Ökologie - postmateriell, eher identitär
    '08-0': 2, '08-1': 3, '08-2': 3, '08-3': 4, '08-4': 4, '08-5': 1,
    
    // 09: Feminismus - identitätspolitisch
    '09-0': 4, '09-1': 4, '09-2': 4, '09-3': 5, '09-4': 5, '09-5': 5,
    
    // 10: Antirassismus - identitätspolitisch
    '10-0': 4, '10-1': 4, '10-2': 4, '10-3': 5, '10-4': 5, '10-5': 5,
    
    // 11: Technologie - neutral, leicht Klasse
    '11-0': 2, '11-1': 2, '11-2': 2, '11-3': 3, '11-4': 1, '11-5': 0,
    
    // 12: Demokratieform - politisch, kann beides
    '12-0': 1, '12-1': 1, '12-2': 2, '12-3': 3, '12-4': 3, '12-5': 4,
    
    // 13: Aktionsformen - kann beides
    '13-0': 1, '13-1': 1, '13-2': 2, '13-3': 3, '13-4': 3, '13-5': 4,
    
    // 14: Kulturkampf - identitätspolitisch
    '14-0': 3, '14-1': 4, '14-2': 4, '14-3': 4, '14-4': 5, '14-5': 5,
    
    // 15: EU - eher klassenkämpferisch (Ökonomie)
    '15-0': 1, '15-1': 1, '15-2': 2, '15-3': 2, '15-4': 3, '15-5': 3,
    
    // 16: Arbeit - klassisch klassenkämpferisch
    '16-0': 0, '16-1': 0, '16-2': 1, '16-3': 1, '16-4': 2, '16-5': 2,
    
    // 17: Wachstum - ökologisch, postmateriell
    '17-0': 2, '17-1': 3, '17-2': 3, '17-3': 4, '17-4': 4, '17-5': 3,
    
    // 18: Nahost - kann beides sein
    '18-0': 2, '18-1': 2, '18-2': 2, '18-3': 3, '18-4': 4, '18-5': 4,
    
    // 19: Migration - identitätspolitisch
    '19-0': 1, '19-1': 2, '19-2': 3, '19-3': 4, '19-4': 4, '19-5': 3,
    
    // 20: Digitalität - neutral
    '20-0': 2, '20-1': 3, '20-2': 3, '20-3': 3, '20-4': 2, '20-5': 1,
    
    // 21: Care - feministisch, identitätspolitisch
    '21-0': 3, '21-1': 4, '21-2': 4, '21-3': 4, '21-4': 5, '21-5': 4,
    
    // 22: Stadt/Land - postmateriell
    '22-0': 2, '22-1': 3, '22-2': 3, '22-3': 3, '22-4': 3, '22-5': 2,
    
    // 23: Geschichte - kann beides
    '23-0': 2, '23-1': 2, '23-2': 3, '23-3': 3, '23-4': 4, '23-5': 4,
    
    // 24: Geopolitik - anti-imperialistisch, eher Klasse
    '24-0': 1, '24-1': 1, '24-2': 1, '24-3': 2, '24-4': 3, '24-5': 3,
    
    // 25: Spiritualität - postmateriell, identitär
    '25-0': 3, '25-1': 3, '25-2': 3, '25-3': 4, '25-4': 4, '25-5': 4
  };
  
  // Header
  const header = document.createElement('div');
  header.style.cssText = 'text-align: center; margin-bottom: 2rem;';
  header.innerHTML = `
    <h2 style="font-size: 1.5rem; font-weight: 300; color: #f5f5f5; margin-bottom: 0.5rem;">🗺️ Politischer Kompass der Linken</h2>
    <p style="color: #888; font-size: 0.9rem;">Reform ↔ Revolution × Klasse ↔ Identität</p>
  `;
  container.appendChild(header);
  
  // Legende
  const legende = document.createElement('div');
  legende.style.cssText = 'display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap;';
  legende.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(229,57,53,0.15); border-radius: 8px;">
      <div style="width: 14px; height: 14px; background: rgba(229,57,53,0.85); border-radius: 3px;"></div>
      <span style="font-size: 0.8rem; color: #aaa;">Reform + Klasse</span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(136,14,79,0.15); border-radius: 8px;">
      <div style="width: 14px; height: 14px; background: rgba(136,14,79,0.85); border-radius: 3px;"></div>
      <span style="font-size: 0.8rem; color: #aaa;">Revolution + Klasse</span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(76,175,80,0.15); border-radius: 8px;">
      <div style="width: 14px; height: 14px; background: rgba(76,175,80,0.85); border-radius: 3px;"></div>
      <span style="font-size: 0.8rem; color: #aaa;">Reform + Identität</span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(156,39,176,0.15); border-radius: 8px;">
      <div style="width: 14px; height: 14px; background: rgba(156,39,176,0.85); border-radius: 3px;"></div>
      <span style="font-size: 0.8rem; color: #aaa;">Revolution + Identität</span>
    </div>
  `;
  container.appendChild(legende);
  
  // Canvas für 2D-Karte
  const canvasWrapper = document.createElement('div');
  canvasWrapper.style.cssText = 'max-width: 1000px; margin: 0 auto; position: relative; background: #222; border-radius: 12px; padding: 3rem; border: 1px solid #333;';
  
  const canvas = document.createElement('div');
  canvas.style.cssText = 'width: 100%; height: 600px; position: relative; background: linear-gradient(to right, rgba(76,175,80,0.05) 0%, rgba(229,57,53,0.05) 100%);';
  
  // Achsenbeschriftungen - einfach und klar ohne Pfeile
  canvas.innerHTML = `
    <!-- X-Achse -->
    <div style="position: absolute; left: 0; bottom: -2rem; font-size: 0.9rem; color: #aaa; font-weight: 500;">Reform</div>
    <div style="position: absolute; right: 0; bottom: -2rem; font-size: 0.9rem; color: #aaa; font-weight: 500;">Revolution</div>
    <!-- Y-Achse -->
    <div style="position: absolute; left: -3.5rem; top: 0; font-size: 0.9rem; color: #aaa; transform: rotate(-90deg); transform-origin: right; font-weight: 500;">Klasse</div>
    <div style="position: absolute; left: -3.5rem; bottom: 0; font-size: 0.9rem; color: #aaa; transform: rotate(-90deg); transform-origin: right; font-weight: 500;">Identität</div>
    <!-- Mittellinien - durchsichtig für weniger visuelle Verwirrung -->
    <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.05);"></div>
    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255,255,255,0.05);"></div>
  `;
  
  // Positionen platzieren
  // Detect mobile
  const isMobile = window.innerWidth <= 768;
  
  Object.values(knotenData).forEach(knoten => {
    const xPos = knoten.position; // 0-5
    const yPos = yPositionen[knoten.id] || 3; // 0-5
    
    // Noch größerer Jitter für Grundposition: ±12% Zufallsabweichung (bleibt fix)
    const jitterX = (Math.random() - 0.5) * 24; // -12% bis +12%
    const jitterY = (Math.random() - 0.5) * 24;
    
    // In Prozent umrechnen - dies ist die FESTE Grundposition
    const baseX = (xPos / 5) * 100 + jitterX;
    const baseY = (yPos / 5) * 100 + jitterY;
    
    // Bewegungsradius: ±16% um die Grundposition herum
    const movementRadius = 16;
    
    // Zufällige Werte für organische Animation innerhalb des Radius
    const animDuration = 4 + Math.random() * 6; // 4-10 Sekunden
    const animDelay = Math.random() * 3; // 0-3 Sekunden Verzögerung
    
    // Bewegungspunkte innerhalb des Radius (elliptische Bahn)
    const angle1 = Math.random() * 360;
    const angle2 = (angle1 + 90 + Math.random() * 90) % 360; // 90-180° weiter
    const angle3 = (angle1 + 180 + Math.random() * 90) % 360; // 180-270° weiter
    const angle4 = (angle1 + 270 + Math.random() * 90) % 360; // 270-360° weiter
    
    const dist1 = Math.random() * movementRadius;
    const dist2 = Math.random() * movementRadius;
    const dist3 = Math.random() * movementRadius;
    const dist4 = Math.random() * movementRadius;
    
    const moveX1 = Math.cos(angle1 * Math.PI / 180) * dist1;
    const moveY1 = Math.sin(angle1 * Math.PI / 180) * dist1;
    const moveX2 = Math.cos(angle2 * Math.PI / 180) * dist2;
    const moveY2 = Math.sin(angle2 * Math.PI / 180) * dist2;
    const moveX3 = Math.cos(angle3 * Math.PI / 180) * dist3;
    const moveY3 = Math.sin(angle3 * Math.PI / 180) * dist3;
    const moveX4 = Math.cos(angle4 * Math.PI / 180) * dist4;
    const moveY4 = Math.sin(angle4 * Math.PI / 180) * dist4;
    
    // Farbe basierend auf Quadrant - deutlich unterschiedliche Farben
    let bgColor;
    if (xPos <= 2.5 && yPos <= 2.5) {
      // Reform + Klasse → Rot (Sozialdemokratie)
      bgColor = 'rgba(229, 57, 53, 0.85)';
    } else if (xPos > 2.5 && yPos <= 2.5) {
      // Revolution + Klasse → Dunkelrot/Bordeaux (ML, Kommunismus)
      bgColor = 'rgba(136, 14, 79, 0.85)';
    } else if (xPos <= 2.5 && yPos > 2.5) {
      // Reform + Identität → Grün (Progressive, Ökologie)
      bgColor = 'rgba(76, 175, 80, 0.85)';
    } else {
      // Revolution + Identität → Lila/Magenta (Queer-Anarchismus)
      bgColor = 'rgba(156, 39, 176, 0.85)';
    }
    
    // Kurzname für Mobile (max 12 Zeichen)
    const shortName = knoten.name.length > 12 ? knoten.name.substring(0, 10) + '.' : knoten.name;
    
    const punkt = document.createElement('div');
    punkt.className = 'kompass-punkt';
    punkt.dataset.id = knoten.id;
    punkt.dataset.name = knoten.name;
    
    // CSS Animation für organische Bewegung - definierter Radius
    const keyframeName = `flow-${Math.random().toString(36).substr(2, 9)}`;
    
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes ${keyframeName} {
        0% { 
          transform: translate(-50%, -50%); 
        }
        25% { 
          transform: translate(calc(-50% + ${moveX1}%), calc(-50% + ${moveY1}%)); 
        }
        50% { 
          transform: translate(calc(-50% + ${moveX2}%), calc(-50% + ${moveY2}%)); 
        }
        75% { 
          transform: translate(calc(-50% + ${moveX3}%), calc(-50% + ${moveY3}%)); 
        }
        90% { 
          transform: translate(calc(-50% + ${moveX4}%), calc(-50% + ${moveY4}%)); 
        }
        100% { 
          transform: translate(-50%, -50%); 
        }
      }
    `;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    
    if (isMobile) {
      // Mobile: Größerer Punkt mit Kurznamen
      punkt.style.cssText = `
        position: absolute;
        left: ${baseX}%;
        top: ${baseY}%;
        background: ${bgColor};
        border: 2px solid rgba(255,255,255,0.5);
        padding: 0.5rem 0.7rem;
        border-radius: 8px;
        font-size: 0.7rem;
        color: #fff;
        cursor: pointer;
        white-space: nowrap;
        z-index: 1;
        font-weight: 500;
        animation: ${keyframeName} ${animDuration}s ease-in-out ${animDelay}s infinite;
      `;
      punkt.textContent = shortName;
    } else {
      // Desktop: Größerer Punkt ohne Text (16px statt 12px)
      punkt.style.cssText = `
        position: absolute;
        left: ${baseX}%;
        top: ${baseY}%;
        background: ${bgColor};
        border: 2px solid rgba(255,255,255,0.4);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1;
        animation: ${keyframeName} ${animDuration}s ease-in-out ${animDelay}s infinite;
      `;
    }
    
    // Tooltip für Hover/Tap
    const tooltip = document.createElement('div');
    tooltip.className = 'kompass-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      left: 50%;
      top: -40px;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.9);
      color: #fff;
      padding: 0.5rem 0.8rem;
      border-radius: 6px;
      font-size: 0.75rem;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 100;
      border: 1px solid ${bgColor};
    `;
    tooltip.textContent = knoten.name;
    punkt.appendChild(tooltip);
    
    // Desktop: Hover
    if (!isMobile) {
      punkt.onmouseover = () => {
        // Animation läuft weiter, kein Pause mehr
        punkt.style.zIndex = '10';
        punkt.style.filter = 'brightness(1.3)';
        tooltip.style.opacity = '1';
      };
      punkt.onmouseout = () => {
        punkt.style.zIndex = '1';
        punkt.style.filter = 'brightness(1)';
        tooltip.style.opacity = '0';
      };
      punkt.onclick = () => showKnoten(knoten.id);
    } else {
      // Mobile: Tap für Tooltip, zweiter Tap für Detail
      let tapped = false;
      punkt.onclick = (e) => {
        e.stopPropagation();
        if (tapped) {
          // Zweiter Tap → Detail öffnen
          showKnoten(knoten.id);
        } else {
          // Erster Tap → Tooltip zeigen
          // Alle anderen Tooltips schließen
          document.querySelectorAll('.kompass-tooltip').forEach(t => t.style.opacity = '0');
          document.querySelectorAll('.kompass-punkt').forEach(p => p.style.zIndex = '1');
          
          tooltip.style.opacity = '1';
          punkt.style.zIndex = '10';
          tapped = true;
          
          // Nach 3 Sekunden automatisch schließen
          setTimeout(() => {
            tooltip.style.opacity = '0';
            punkt.style.zIndex = '1';
            tapped = false;
          }, 3000);
        }
      };
    }
    
    canvas.appendChild(punkt);
  });
  
  // Mobile: Tap außerhalb schließt alle Tooltips
  if (isMobile) {
    canvas.onclick = () => {
      document.querySelectorAll('.kompass-tooltip').forEach(t => t.style.opacity = '0');
      document.querySelectorAll('.kompass-punkt').forEach(p => p.style.zIndex = '1');
    };
  }
  
  canvasWrapper.appendChild(canvas);
  container.appendChild(canvasWrapper);
  
  console.log('✅ Politischer Kompass erstellt');
}
  
  // Achsen-Definition

// ══════════════════════════════════════════════════════════════════════
// ZEITLEISTE
// ══════════════════════════════════════════════════════════════════════

function initZeitleiste() {
  const container = document.getElementById('zeitleiste-container');
  
  // Wenn personenData noch nicht geladen, erst laden
  if (!personenData || personenData.length === 0) {
    container.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 200px; color: var(--text-muted);">
        <div>⏳ Lade Zeitleisten-Daten...</div>
      </div>
    `;
    loadPersonenData().then(() => {
      initZeitleiste(); // Erneut aufrufen nach dem Laden
    });
    return;
  }
  
  // Sammle alle historischen Ereignisse
  const ereignisse = [];
  
  // === WICHTIGE HISTORISCHE MEILENSTEINE ===
  const meilensteine = [
    { jahr: 1789, typ: 'praxis', titel: 'Französische Revolution', beschreibung: 'Beginn der modernen politischen Linken', kontext: '00-1' },
    { jahr: 1848, typ: 'text', titel: 'Kommunistisches Manifest', beschreibung: 'Marx & Engels veröffentlichen das Manifest', kontext: '00-1' },
    { jahr: 1864, typ: 'praxis', titel: 'Erste Internationale', beschreibung: 'Gründung der Internationalen Arbeiterassoziation in London', kontext: '00-3' },
    { jahr: 1871, typ: 'praxis', titel: 'Pariser Kommune', beschreibung: '72 Tage Arbeiterregierung in Paris', kontext: '13-5' },
    { jahr: 1889, typ: 'praxis', titel: 'Zweite Internationale', beschreibung: 'Gründung der Sozialistischen Internationale', kontext: '00-2' },
    { jahr: 1891, typ: 'text', titel: 'Erfurter Programm', beschreibung: 'Programm der SPD, marxistisch geprägt', kontext: '00-2' },
    { jahr: 1905, typ: 'praxis', titel: 'Russische Revolution 1905', beschreibung: 'Erste russische Revolution, Entstehung der Sowjets', kontext: '13-5' },
    { jahr: 1914, typ: 'praxis', titel: 'Burgfrieden', beschreibung: 'SPD stimmt für Kriegskredite - Spaltung der Linken', kontext: '00-2' },
    { jahr: 1917, typ: 'praxis', titel: 'Oktoberrevolution', beschreibung: 'Bolschewiki übernehmen die Macht in Russland', kontext: '00-1' },
    { jahr: 1918, typ: 'praxis', titel: 'Novemberrevolution', beschreibung: 'Revolution in Deutschland, Ende des Kaiserreichs', kontext: '00-3' },
    { jahr: 1919, typ: 'praxis', titel: 'Räterepublik Bayern', beschreibung: 'Kurzlebige Räterepublik in München', kontext: '13-5' },
    { jahr: 1919, typ: 'praxis', titel: 'Dritte Internationale', beschreibung: 'Gründung der Komintern in Moskau', kontext: '00-1' },
    { jahr: 1923, typ: 'text', titel: 'Geschichte und Klassenbewusstsein', beschreibung: 'Lukács begründet den westlichen Marxismus', kontext: '00-3' },
    { jahr: 1929, typ: 'praxis', titel: 'Weltwirtschaftskrise', beschreibung: 'Beginn der Großen Depression', kontext: '02-2' },
    { jahr: 1936, typ: 'praxis', titel: 'Spanischer Bürgerkrieg', beschreibung: 'Anarchistische Kollektive in Katalonien', kontext: '02-5' },
    { jahr: 1944, typ: 'text', titel: 'Dialektik der Aufklärung', beschreibung: 'Horkheimer & Adorno: Kritische Theorie', kontext: '00-3' },
    { jahr: 1949, typ: 'text', titel: 'Das zweite Geschlecht', beschreibung: 'Simone de Beauvoir begründet modernen Feminismus', kontext: '10-5' },
    { jahr: 1956, typ: 'praxis', titel: 'Ungarnaufstand', beschreibung: 'Arbeiterräte gegen stalinistische Herrschaft', kontext: '13-5' },
    { jahr: 1959, typ: 'text', titel: 'Godesberger Programm', beschreibung: 'SPD verabschiedet sich vom Marxismus', kontext: '00-4' },
    { jahr: 1962, typ: 'text', titel: 'Strukturwandel der Öffentlichkeit', beschreibung: 'Habermas: Kritische Theorie weiterentwickelt', kontext: '13-3' },
    { jahr: 1967, typ: 'praxis', titel: '2. Juni', beschreibung: 'Benno Ohnesorg erschossen - Beginn der 68er', kontext: '14-4' },
    { jahr: 1968, typ: 'praxis', titel: 'Mai 68', beschreibung: 'Generalstreik und Studentenrevolte in Frankreich', kontext: '14-5' },
    { jahr: 1968, typ: 'praxis', titel: 'Prager Frühling', beschreibung: 'Reformversuch in der ČSSR, von UdSSR niedergeschlagen', kontext: '13-4' },
    { jahr: 1972, typ: 'text', titel: 'Grenzen des Wachstums', beschreibung: 'Club of Rome: Beginn der Ökologiedebatte', kontext: '18-5' },
    { jahr: 1977, typ: 'praxis', titel: 'Deutscher Herbst', beschreibung: 'Höhepunkt des RAF-Terrors und staatlicher Repression', kontext: '14-4' },
    { jahr: 1979, typ: 'praxis', titel: 'Grüne Partei gegründet', beschreibung: 'Aus Umwelt- und Friedensbewegung entsteht neue Partei', kontext: '09-4' },
    { jahr: 1980, typ: 'text', titel: 'Tausend Plateaus', beschreibung: 'Deleuze & Guattari: Poststrukturalismus', kontext: '00-3' },
    { jahr: 1989, typ: 'praxis', titel: 'Fall der Mauer', beschreibung: 'Ende des Staatssozialismus in Europa', kontext: '00-2' },
    { jahr: 1994, typ: 'praxis', titel: 'Zapatistas', beschreibung: 'EZLN-Aufstand in Chiapas', kontext: '25-5' },
    { jahr: 1999, typ: 'praxis', titel: 'Seattle-Proteste', beschreibung: 'Geburtsstunde der Antiglobalisierungsbewegung', kontext: '14-4' },
    { jahr: 2001, typ: 'praxis', titel: 'Weltsozialforum', beschreibung: '"Eine andere Welt ist möglich" - Porto Alegre', kontext: '25-5' },
    { jahr: 2008, typ: 'praxis', titel: 'Finanzkrise', beschreibung: 'Globale Bankenkrise erschüttert Neoliberalismus', kontext: '02-3' },
    { jahr: 2011, typ: 'praxis', titel: 'Occupy Wall Street', beschreibung: '"We are the 99%" - Protestbewegung gegen Ungleichheit', kontext: '05-4' },
    { jahr: 2015, typ: 'praxis', titel: 'Syriza an der Macht', beschreibung: 'Linkspartei regiert in Griechenland', kontext: '00-3' },
    { jahr: 2016, typ: 'praxis', titel: 'Sanders-Kampagne', beschreibung: '"Democratic Socialism" wird Mainstream in USA', kontext: '00-4' },
    { jahr: 2018, typ: 'praxis', titel: 'Gilets Jaunes', beschreibung: 'Gelbwesten-Proteste in Frankreich', kontext: '14-3' },
    { jahr: 2019, typ: 'praxis', titel: 'Fridays for Future', beschreibung: 'Globale Klimastreiks der Jugend', kontext: '09-5' },
    { jahr: 2020, typ: 'praxis', titel: 'Black Lives Matter', beschreibung: 'Massenproteste nach George Floyds Tod', kontext: '11-5' },
    { jahr: 2021, typ: 'praxis', titel: 'Amazon-Gewerkschaft', beschreibung: 'Erste erfolgreiche Gewerkschaftsgründung bei Amazon (USA)', kontext: '17-3' },
    { jahr: 2022, typ: 'praxis', titel: 'Letzte Generation', beschreibung: 'Klimaaktivismus mit zivilem Ungehorsam', kontext: '14-3' }
  ];
  
  ereignisse.push(...meilensteine);
  
  // === PERSONEN AUS PERSONEN-DATENBANK ===
  // (enthält strukturierte Daten inkl. Zeitgenossen)
  if (personenData && personenData.length > 0) {
    personenData.forEach(person => {
      if (person.geboren) {
        const jahr = typeof person.geboren === 'string' ? parseInt(person.geboren) : person.geboren;
        if (jahr && !isNaN(jahr)) {
          // Finde zugehörigen Knoten für Kontext
          // 1. Priorität: hauptzimmer aus personen.json
          let kontext = person.hauptzimmer?.[0] || null;
          
          // 2. Fallback: Suche in knotenData Bewohnern
          if (!kontext) {
            for (const [id, k] of Object.entries(knotenData)) {
              const alleBewohner = [...(k.bewohner?.klassiker || []), ...(k.bewohner?.zeitgenossen || [])];
              if (alleBewohner.some(b => b.toLowerCase().includes(person.name.split(' ').pop().toLowerCase()))) {
                kontext = id;
                break;
              }
            }
          }
          
          // 3. Default
          if (!kontext) kontext = '00-3';
          
          ereignisse.push({
            jahr: jahr,
            typ: 'geburt',
            titel: `${person.name} geboren`,
            beschreibung: person.kurzbio || person.kurz || `${person.kategorie || 'Linke/r Denker/in'}`,
            kontext: kontext
          });
        }
      }
    });
  }
  
  Object.values(knotenData).forEach(k => {
    // Klassiker mit Lebensdaten (Fallback falls nicht in personenData)
    k.bewohner?.klassiker?.forEach(person => {
      const match = person.match(/\((\d{4})-(\d{4})\)/);
      if (match) {
        const name = person.replace(/\s*\([^)]*\)/, '');
        // Nur hinzufügen wenn nicht schon aus personenData
        if (!ereignisse.some(e => e.titel === `${name} geboren`)) {
          ereignisse.push({
            jahr: parseInt(match[1]),
            typ: 'geburt',
            titel: `${name} geboren`,
            beschreibung: `Klassiker für: ${k.name}`,
            kontext: k.id
          });
        }
      }
    });
    
    // Praxis-Beispiele
    k.praxis?.forEach(p => {
      const match = p.zeit.match(/(\d{4})/);
      if (match) {
        ereignisse.push({
          jahr: parseInt(match[1]),
          typ: 'praxis',
          titel: p.name,
          beschreibung: p.beschreibung,
          ort: p.ort,
          kontext: k.id
        });
      }
    });
    
    // Literatur
    k.literatur?.forEach(l => {
      if (l.jahr) {
        ereignisse.push({
          jahr: typeof l.jahr === 'string' ? parseInt(l.jahr) : l.jahr,
          typ: 'text',
          titel: `"${l.titel}"`,
          beschreibung: `von ${l.autor}`,
          kontext: k.id
        });
      }
    });
  });
  
  // Sortieren nach Jahr
  ereignisse.sort((a, b) => a.jahr - b.jahr);
  
  // Duplikate entfernen (nach Titel)
  const seen = new Set();
  const unique = ereignisse.filter(e => {
    if (seen.has(e.titel)) return false;
    seen.add(e.titel);
    return true;
  });
  
  const icons = { praxis: '✊', text: '📖', geburt: '👤' };
  const typLabels = { praxis: 'Praxis', text: 'Werk', geburt: 'Person' };
  
  let html = `
    <div class="zeitleiste-header">
      <h2>⏳ Geschichte des linken Denkens</h2>
      <p>${unique.length} Ereignisse von ${unique[0]?.jahr || '?'} bis ${unique[unique.length-1]?.jahr || '?'}</p>
    </div>
    
    <div class="zeitleiste-filter">
      <button class="zeitleiste-filter-btn active" data-filter="alle">Alle</button>
      <button class="zeitleiste-filter-btn" data-filter="praxis">✊ Praxis</button>
      <button class="zeitleiste-filter-btn" data-filter="text">📖 Werke</button>
      <button class="zeitleiste-filter-btn" data-filter="geburt">👤 Personen</button>
    </div>
    
    <div class="zeitleiste-wrapper">
  `;
  
  let lastEpoche = '';
  
  // Zeige alle Ereignisse (keine Begrenzung mehr)
  unique.forEach(e => {
    // Epochen-Marker einfügen
    let epoche = '';
    if (e.jahr < 1800) epoche = '🕯️ Aufklärung & Vorläufer';
    else if (e.jahr < 1848) epoche = '🌱 Frühsozialismus (1800-1848)';
    else if (e.jahr < 1890) epoche = '📕 Klassischer Marxismus (1848-1890)';
    else if (e.jahr < 1914) epoche = '🏭 Zweite Internationale (1890-1914)';
    else if (e.jahr < 1945) epoche = '⚔️ Revolutionen & Krisen (1914-1945)';
    else if (e.jahr < 1968) epoche = '🌐 Nachkriegszeit (1945-1968)';
    else if (e.jahr < 1990) epoche = '✊ Neue Linke (1968-1990)';
    else if (e.jahr < 2008) epoche = '🌍 Post-Mauerfall (1990-2008)';
    else epoche = '🔥 Gegenwart (seit 2008)';
    
    if (epoche !== lastEpoche) {
      html += `<div class="zeitleiste-epoche"><span class="zeitleiste-epoche-label">${epoche}</span></div>`;
      lastEpoche = epoche;
    }
    
    html += `
      <div class="zeitleiste-item" data-typ="${e.typ}" data-kontext="${e.kontext}">
        <div class="zeitleiste-jahr">${e.jahr}</div>
        <div class="zeitleiste-inline">
          <span class="zeitleiste-icon">${icons[e.typ]}</span>
          <span class="zeitleiste-titel">${e.titel}</span>
        </div>
        <div class="zeitleiste-details">
          ${e.beschreibung}
          ${e.ort ? `<div class="ort">📍 ${e.ort}</div>` : ''}
          <div class="mehr-btn" onclick="event.stopPropagation(); showKnoten('${e.kontext}')">→ Mehr erfahren</div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  // Klick auf Item toggelt Details
  container.querySelectorAll('.zeitleiste-item').forEach(item => {
    item.onclick = (e) => {
      if (e.target.classList.contains('mehr-btn')) return;
      item.classList.toggle('expanded');
    };
  });
  
  // Filter-Buttons aktivieren
  container.querySelectorAll('.zeitleiste-filter-btn').forEach(btn => {
    btn.onclick = () => {
      container.querySelectorAll('.zeitleiste-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      container.querySelectorAll('.zeitleiste-item').forEach(item => {
        if (filter === 'alle' || item.dataset.typ === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    };
  });
}

// ══════════════════════════════════════════════════════════════════════
// BIBLIOTHEK
// ══════════════════════════════════════════════════════════════════════

function initBibliothek() {
  const container = document.getElementById('bibliothek-container');
  
  // Sammle alle Literatur
  const buecher = [];
  
  Object.values(knotenData).forEach(k => {
    k.literatur?.forEach(l => {
      buecher.push({
        ...l,
        kontext: k.name,
        kontextId: k.id
      });
    });
  });
  
  // Sortieren: Frei zuerst, dann nach Schwierigkeit
  const frei = buecher.filter(b => b.frei).sort((a, b) => (a.schwierigkeit || 3) - (b.schwierigkeit || 3));
  const nichtFrei = buecher.filter(b => !b.frei).sort((a, b) => (a.schwierigkeit || 3) - (b.schwierigkeit || 3));
  
  let html = '<div class="bibliothek-wrapper">';
  
  html += '<div class="bibliothek-section">';
  html += `<h2>📖 Frei verfügbar (${frei.length} Texte)</h2>`;
  frei.forEach(b => {
    const sterne = '★'.repeat(b.schwierigkeit || 1) + '☆'.repeat(5 - (b.schwierigkeit || 1));
    html += `
      <div class="buch-item" onclick="showKnoten('${b.kontextId}')" style="cursor: pointer;">
        <div class="buch-info">
          <div class="titel">${b.titel}</div>
          <div class="autor">${b.autor}${b.jahr ? ` (${b.jahr})` : ''}</div>
          <div class="kontext">→ ${b.kontext}</div>
          ${b.notiz ? `<div class="kontext" style="color: #4CAF50;">${b.notiz}</div>` : ''}
        </div>
        <div class="buch-meta">
          <div style="color: #888;">${sterne}</div>
          ${b.url ? `<a href="${b.url}" target="_blank" onclick="event.stopPropagation();">Lesen →</a>` : ''}
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  html += '<div class="bibliothek-section">';
  html += `<h2>📚 Weitere Literatur (${nichtFrei.length} Texte)</h2>`;
  nichtFrei.forEach(b => {
    const sterne = '★'.repeat(b.schwierigkeit || 1) + '☆'.repeat(5 - (b.schwierigkeit || 1));
    html += `
      <div class="buch-item" onclick="showKnoten('${b.kontextId}')" style="cursor: pointer;">
        <div class="buch-info">
          <div class="titel">${b.titel}</div>
          <div class="autor">${b.autor}${b.jahr ? ` (${b.jahr})` : ''}</div>
          <div class="kontext">→ ${b.kontext}</div>
        </div>
        <div class="buch-meta">
          <div style="color: #888;">${sterne}</div>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  html += '</div>';
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// PRAXIS
// ══════════════════════════════════════════════════════════════════════

function initPraxis() {
  const container = document.getElementById('praxis-container');
  
  // Sammle alle Praxis-Beispiele
  const beispiele = [];
  
  Object.values(knotenData).forEach(k => {
    k.praxis?.forEach(p => {
      beispiele.push({
        ...p,
        kontext: k.name,
        kontextId: k.id
      });
    });
  });
  
  // Sortieren nach Zeit (neueste zuerst)
  beispiele.sort((a, b) => {
    const jahrA = parseInt(a.zeit.match(/(\d{4})/)?.[1] || 0);
    const jahrB = parseInt(b.zeit.match(/(\d{4})/)?.[1] || 0);
    return jahrB - jahrA;
  });
  
  let html = '<div class="praxis-wrapper">';
  html += `<h2 style="color: #4CAF50; margin-bottom: 1.5rem;">✊ ${beispiele.length} Praxis-Beispiele</h2>`;
  html += '<div class="praxis-grid">';
  
  beispiele.forEach(p => {
    html += `
      <div class="praxis-card" onclick="showKnoten('${p.kontextId}')" style="cursor: pointer;">
        <h3>${p.name}</h3>
        <div class="meta">${p.ort} · ${p.zeit}</div>
        <div class="beschreibung">${p.beschreibung}</div>
        <div class="kontext">→ ${p.kontext}</div>
      </div>
    `;
  });
  
  html += '</div></div>';
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// FRAGEN
// ══════════════════════════════════════════════════════════════════════

function initFragen() {
  const container = document.getElementById('fragen-container');
  if (!container) return;
  
  // Sammle alle Fragen und gruppiere nach Thema
  const fragenNachThema = {};
  const themenIcons = {
    'Strategie': '⚔️',
    'Ökonomie': '💰',
    'Gesellschaft': '🏛️',
    'Ökologie': '🌿',
    'International': '🌍',
    'Geschichte': '📜',
    'Praxis': '✊',
    'Sonstiges': '❓'
  };
  
  // Achsen zu Themen zuordnen
  const achseZuThema = {
    '00': 'Strategie', '12': 'Strategie', '13': 'Strategie',
    '01': 'Ökonomie', '02': 'Ökonomie', '03': 'Ökonomie', '04': 'Ökonomie', '05': 'Ökonomie', '06': 'Ökonomie', '16': 'Ökonomie', '20': 'Ökonomie',
    '07': 'Gesellschaft', '09': 'Gesellschaft', '10': 'Gesellschaft', '14': 'Gesellschaft', '21': 'Gesellschaft', '25': 'Gesellschaft',
    '08': 'Ökologie', '17': 'Ökologie', '22': 'Ökologie',
    '11': 'Gesellschaft',
    '15': 'International', '18': 'International', '19': 'International', '24': 'International',
    '23': 'Geschichte'
  };
  
  Object.values(knotenData).forEach(k => {
    if (!k.fragen || k.fragen.length === 0) return;
    
    const achse = k.id?.split('-')[0] || '00';
    const thema = achseZuThema[achse] || 'Sonstiges';
    
    if (!fragenNachThema[thema]) {
      fragenNachThema[thema] = [];
    }
    
    k.fragen.forEach(f => {
      fragenNachThema[thema].push({
        frage: f,
        kontext: k.name,
        kontextId: k.id,
        achse: achse
      });
    });
  });
  
  // Zähle Gesamtfragen
  let gesamtFragen = 0;
  Object.values(fragenNachThema).forEach(arr => gesamtFragen += arr.length);
  
  // Sortiere Themen
  const themenReihenfolge = ['Strategie', 'Ökonomie', 'Gesellschaft', 'Ökologie', 'International', 'Geschichte', 'Praxis', 'Sonstiges'];
  
  let html = '<div class="fragen-wrapper">';
  
  // Header
  html += `
    <div class="fragen-header">
      <h2>❓ Die offenen Fragen</h2>
      <p>${gesamtFragen} Fragen, auf die das linke Denken noch ringt</p>
    </div>
  `;
  
  // Intro
  html += `
    <div class="fragen-intro">
      <p>Keine fertigen Antworten, sondern lebendige Debatten. Klicke auf eine Frage, um den Kontext zu erkunden. 
      <em>Bald: Diskutiere mit anderen direkt hier im Wesen.</em></p>
    </div>
  `;
  
  // Filter-Buttons
  html += '<div class="fragen-filter">';
  html += `<button class="fragen-filter-btn active" onclick="filterFragen('alle')">Alle (${gesamtFragen})</button>`;
  themenReihenfolge.forEach(thema => {
    if (fragenNachThema[thema] && fragenNachThema[thema].length > 0) {
      const icon = themenIcons[thema] || '❓';
      html += `<button class="fragen-filter-btn" onclick="filterFragen('${thema}')">${icon} ${thema} (${fragenNachThema[thema].length})</button>`;
    }
  });
  html += '</div>';
  
  // Fragen nach Thema im Grid
  html += '<div id="fragen-liste">';
  themenReihenfolge.forEach(thema => {
    if (!fragenNachThema[thema] || fragenNachThema[thema].length === 0) return;
    
    const icon = themenIcons[thema] || '❓';
    const fragen = fragenNachThema[thema];
    
    // Mische die Fragen pro Thema
    fragen.sort(() => Math.random() - 0.5);
    
    html += `
      <div class="fragen-kategorie" data-thema="${thema}">
        <div class="fragen-kategorie-header">
          <span style="font-size: 1.2rem;">${icon}</span>
          <h3>${thema}</h3>
          <span class="fragen-kategorie-count">${fragen.length}</span>
        </div>
        <div class="fragen-grid">
    `;
    
    fragen.forEach((f, i) => {
      html += `
        <div class="frage-item" onclick="showKnoten('${f.kontextId}')">
          <div class="frage">${f.frage}</div>
          <div class="kontext">${f.kontext}</div>
          <div class="frage-meta">
            <span class="frage-tag">${thema}</span>
            <button class="frage-diskussion-btn" onclick="event.stopPropagation(); zeigeDiskussionHinweis()" title="Diskussion (bald verfügbar)">
              💬 0
            </button>
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
  });
  html += '</div>';
  
  // Zukunfts-Hinweis
  html += `
    <div class="fragen-zukunft">
      <h4>🔮 Coming Soon: Diskussionsforen</h4>
      <p>Bald kannst du dich hier registrieren und direkt bei jeder Frage mitdiskutieren. 
      Das Linke Wesen wird ein Ort für echten Austausch – Wissen teilen, Positionen schärfen, Menschen verbinden.</p>
    </div>
  `;
  
  html += '</div>';
  container.innerHTML = html;
}

// Fragen-Filter
let aktiverFragenFilter = 'alle';

function filterFragen(thema) {
  aktiverFragenFilter = thema;
  
  // Buttons aktualisieren
  document.querySelectorAll('.fragen-filter-btn').forEach(btn => {
    const btnText = btn.textContent.toLowerCase();
    const isActive = thema === 'alle' ? btnText.includes('alle') : btnText.includes(thema.toLowerCase());
    btn.classList.toggle('active', isActive);
  });
  
  // Kategorien zeigen/verstecken
  document.querySelectorAll('.fragen-kategorie').forEach(kat => {
    if (thema === 'alle') {
      kat.style.display = 'block';
    } else {
      kat.style.display = kat.dataset.thema === thema ? 'block' : 'none';
    }
  });
}

// Platzhalter für zukünftige Diskussionsfunktion
function zeigeDiskussionHinweis() {
  alert('💬 Diskussionsforen kommen bald!\n\nHier wirst du dich mit anderen austauschen können – direkt bei jeder Frage.');
}

// ══════════════════════════════════════════════════════════════════════
// ZUFALL
// ══════════════════════════════════════════════════════════════════════

function initZufall() {
  // Nur Container vorbereiten, KEIN automatisches Popup mehr
  // showRandomKnoten wird nur noch manuell via Button aufgerufen
}

// Prüft ob Mobile
function isMobile() {
  return window.innerWidth <= 600;
}

function zeigeZufall() {
  // Wähle zufälligen Knoten
  const ids = Object.keys(knotenData);
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  
  if (isMobile()) {
    // MOBILE: Nur Info-Panel wechseln, Ansicht bleibt
    showKnoten(randomId);
  } else {
    // DESKTOP: Ansicht + Info-Panel wechseln
    const ansichten = ['netzwerk', 'liste', 'chemie', 'stammbaum', 'oekosystem', 'karte', 'zeitleiste'];
    const zufallsAnsicht = ansichten[Math.floor(Math.random() * ansichten.length)];
    
    setAnsicht(zufallsAnsicht);
    
    setTimeout(() => {
      showKnoten(randomId);
      
      // Spezielle Aktionen je nach Ansicht
      if (zufallsAnsicht === 'netzwerk' && nodeObjects[randomId]) {
        const node = nodeObjects[randomId];
        const targetPos = node.position.clone();
        animateCameraTo(targetPos);
      }
    }, 200);
  }
}

function animateCameraTo(targetPos) {
  if (!camera) return;
  
  const startPos = camera.position.clone();
  const endPos = targetPos.clone();
  endPos.z += 200; // Etwas Abstand
  
  let progress = 0;
  const duration = 1000;
  const startTime = Date.now();
  
  function animate() {
    progress = Math.min(1, (Date.now() - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out
    
    camera.position.x = startPos.x + (endPos.x - startPos.x) * eased;
    camera.position.y = startPos.y + (endPos.y - startPos.y) * eased;
    camera.position.z = startPos.z + (endPos.z - startPos.z) * eased;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  animate();
}

function showRandomKnoten() {
  const container = document.getElementById('zufall-container');
  const ids = Object.keys(knotenData);
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  const k = knotenData[randomId];
  
  const zitat = k.zitate?.[0];
  
  let html = `
    <div class="zufall-card">
      <button class="zufall-close" onclick="closeZufall()">×</button>
      <div class="achse">${k.achse}-${k.position}</div>
      <h2>${k.name}</h2>
      <p class="beschreibung">${k.beschreibung}</p>
      ${zitat ? `
        <div class="zitat">
          "${zitat.text}"
          <div style="font-size: 0.8rem; color: #888; margin-top: 0.5rem; font-style: normal;">— ${zitat.autor}</div>
        </div>
      ` : ''}
      <button class="zufall-btn" onclick="showRandomKnoten()">🎲 Nächster Zufall</button>
      <button class="zufall-btn secondary" onclick="showKnoten('${k.id}')">Details →</button>
    </div>
  `;
  
  container.innerHTML = html;
}

// Schließt das Zufall-Fenster und kehrt zur vorherigen Ansicht zurück
function closeZufall() {
  const container = document.getElementById('zufall-container');
  container.innerHTML = '';
  // Zurück zur letzten Ansicht oder Default
  if (aktiveAnsicht === 'zufall' || !aktiveAnsicht) {
    setAnsicht('wesen');
  }
}

// ══════════════════════════════════════════════════════════════════════
// MEIN KOSMOS
// ══════════════════════════════════════════════════════════════════════

let userVektor = {};

function initKosmos() {
  const container = document.getElementById('kosmos-container');
  
  const achsen = window.ACHSEN_26 || [
    { id: '00', name: 'Reform/Revolution' },
    { id: '01', name: 'Eigentum' },
    { id: '02', name: 'Planung' },
    { id: '03', name: 'Sozialstaat' },
    { id: '04', name: 'Steuern' },
    { id: '05', name: 'Wohnen' },
    { id: '06', name: 'Gesundheit' },
    { id: '07', name: 'Bildung' },
    { id: '08', name: 'Ökologie' },
    { id: '09', name: 'Feminismus' },
    { id: '10', name: 'Antirassismus' },
    { id: '11', name: 'Technologie' },
    { id: '12', name: 'Demokratie' },
    { id: '13', name: 'Aktionsformen' },
    { id: '14', name: 'Kulturkampf' },
    { id: '15', name: 'EU' },
    { id: '16', name: 'Arbeit' },
    { id: '17', name: 'Wachstum' },
    { id: '18', name: 'Nahost' },
    { id: '19', name: 'Migration' },
    { id: '20', name: 'Digitalität' },
    { id: '21', name: 'Care' },
    { id: '22', name: 'Land/Stadt' },
    { id: '23', name: 'Geschichte' },
    { id: '24', name: 'Geopolitik' },
    { id: '25', name: 'Spiritualität' }
  ];
  
  let html = '<div class="kosmos-wrapper">';
  html += `
    <div class="kosmos-intro">
      <h2>🧭 Wo stehst du?</h2>
      <p>Bewege die Regler, um deine Position zu finden. Dann zeigen wir dir deine Nachbarn.</p>
    </div>
  `;
  
  achsen.forEach(a => {
    userVektor[a.id] = 3; // Default: Mitte
    html += `
      <div class="kosmos-slider-group">
        <label>
          <span>${a.name}</span>
          <span class="achse-name">${a.id}</span>
        </label>
        <input type="range" min="1" max="5" value="3" id="slider-${a.id}" oninput="updateKosmos()">
        <div class="labels">
          <span>${a.links}</span>
          <span>${a.rechts}</span>
        </div>
      </div>
    `;
  });
  
  html += '<div id="kosmos-result" class="kosmos-result" style="display: none;"></div>';
  html += '</div>';
  
  container.innerHTML = html;
}

function updateKosmos() {
  // Lese alle Slider-Werte
  Object.keys(userVektor).forEach(id => {
    const slider = document.getElementById(`slider-${id}`);
    if (slider) userVektor[id] = parseInt(slider.value);
  });
  
  // Berechne Distanz zu allen Knoten
  const distanzen = [];
  
  Object.values(knotenData).forEach(k => {
    const achse = k.achse;
    if (userVektor[achse] !== undefined) {
      const distanz = Math.abs(userVektor[achse] - k.position);
      distanzen.push({
        id: k.id,
        name: k.name,
        distanz: distanz,
        achse: achse
      });
    }
  });
  
  // Sortieren nach Distanz
  distanzen.sort((a, b) => a.distanz - b.distanz);
  
  // Zeige Ergebnis
  const resultDiv = document.getElementById('kosmos-result');
  resultDiv.style.display = 'block';
  
  const nahe = distanzen.filter(d => d.distanz === 0);
  const nah = distanzen.filter(d => d.distanz === 1);
  const mittel = distanzen.filter(d => d.distanz === 2);
  
  let html = '<h3>Deine Position im Haus</h3>';
  
  if (nahe.length) {
    html += '<p style="color: #4CAF50; margin: 0.5rem 0;">🎯 Genau hier stehst du:</p>';
    html += '<div class="kosmos-nachbarn">';
    nahe.forEach(d => {
      html += `<span class="kosmos-nachbar" onclick="showKnoten('${d.id}')" style="background: #4CAF50; color: #fff;">${d.name}</span>`;
    });
    html += '</div>';
  }
  
  if (nah.length) {
    html += '<p style="color: #aaa; margin: 1rem 0 0.5rem;">📍 Direkte Nachbarn:</p>';
    html += '<div class="kosmos-nachbarn">';
    nah.slice(0, 10).forEach(d => {
      html += `<span class="kosmos-nachbar" onclick="showKnoten('${d.id}')">${d.name}</span>`;
    });
    html += '</div>';
  }
  
  if (mittel.length) {
    html += '<p style="color: #666; margin: 1rem 0 0.5rem;">🔭 In Sichtweite:</p>';
    html += '<div class="kosmos-nachbarn">';
    mittel.slice(0, 8).forEach(d => {
      html += `<span class="kosmos-nachbar" onclick="showKnoten('${d.id}')" style="opacity: 0.7;">${d.name}</span>`;
    });
    html += '</div>';
  }
  
  resultDiv.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// WG: Das Haus als bewohnter Raum
// ══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// HAUS-STRUKTUR mit 26 ACHSEN - GLOBAL definiert (vor initWG)
// ═══════════════════════════════════════════════════════════════

window.hausStruktur = [
  {
    name: "Dachgeschoss",
    icon: "🏔️",
    untertitel: "Visionen & Strategie",
    beschreibung: "Hier wird geträumt, in die Ferne geschaut, das Unmögliche gedacht.",
    zimmer: [
      { achse: "00", name: "Strategiezimmer", beschreibung: "Reform oder Revolution?", einbringen: "Diskutiere Strategien und entwickle Aktionspläne." },
      { achse: "17", name: "Wachstumsdebatte", beschreibung: "Degrowth oder grünes Wachstum?", einbringen: "Denke über Wirtschaftsmodelle jenseits des Wachstums nach." },
      { achse: "24", name: "Geopolitik-Karte", beschreibung: "Wie positionieren wir uns international?", einbringen: "Analysiere globale Machtverhältnisse." },
      { achse: "25", name: "Sinn-Raum", beschreibung: "Was trägt uns?", einbringen: "Erkunde die spirituellen und emotionalen Dimensionen." },
      { achse: "23", name: "Geschichte-Archiv", beschreibung: "Wie gehen wir mit unserer Geschichte um?", einbringen: "Lerne aus Erfolgen und Fehlern der Vergangenheit." },
      { achse: "14", name: "Kulturkampf-Arena", beschreibung: "Klasse oder Identität?", einbringen: "Verbinde verschiedene Kämpfe strategisch." }
    ]
  },
  {
    name: "Erster Stock",
    icon: "🏛️",
    untertitel: "Staat & Demokratie",
    beschreibung: "Hier wird geplant, debattiert, institutionell gedacht.",
    zimmer: [
      { achse: "12", name: "Demokratie-Labor", beschreibung: "Räte oder Parlament?", einbringen: "Experimentiere mit demokratischen Formen." },
      { achse: "03", name: "Sozialstaat-Büro", beschreibung: "Grundeinkommen oder Aktivierung?", einbringen: "Entwickle soziale Sicherungskonzepte." },
      { achse: "04", name: "Steuerkammer", beschreibung: "Wie verteilen wir um?", einbringen: "Kämpfe für gerechte Besteuerung." },
      { achse: "07", name: "Bildungswerkstatt", beschreibung: "Wie soll Bildung aussehen?", einbringen: "Entwickle emanzipatorische Bildungskonzepte." },
      { achse: "06", name: "Gesundheitszentrum", beschreibung: "Gesundheit als Ware oder Recht?", einbringen: "Kämpfe für ein solidarisches Gesundheitssystem." }
    ]
  },
  {
    name: "Erdgeschoss",
    icon: "🏭",
    untertitel: "Ökonomie & Eigentum",
    beschreibung: "Hier wird produziert, verteilt, gestritten ums Materielle.",
    zimmer: [
      { achse: "01", name: "Eigentumskammer", beschreibung: "Wem gehören die Produktionsmittel?", einbringen: "Erforsche und erprobe neue Eigentumsformen." },
      { achse: "02", name: "Planungsküche", beschreibung: "Markt oder Plan?", einbringen: "Entwickle konkrete Wirtschaftsmodelle." },
      { achse: "05", name: "Wohnzimmer", beschreibung: "Wohnen als Ware oder Recht?", einbringen: "Kämpfe gegen Spekulation und Verdrängung." },
      { achse: "16", name: "Arbeitswerkstatt", beschreibung: "Wie wollen wir arbeiten?", einbringen: "Streite für bessere Arbeitsbedingungen." },
      { achse: "20", name: "Digitalraum", beschreibung: "Wem gehört das Internet?", einbringen: "Entwickle Alternativen zu Big Tech." }
    ]
  },
  {
    name: "Souterrain",
    icon: "🌍",
    untertitel: "Gesellschaft & Natur",
    beschreibung: "Hier werden die Fundamente gelegt, die Wurzeln gepflegt.",
    zimmer: [
      { achse: "09", name: "Feminismus-Salon", beschreibung: "Geschlecht und Klasse?", einbringen: "Verbinde verschiedene Kämpfe und Perspektiven." },
      { achse: "10", name: "Antirassismus-Zentrum", beschreibung: "Wie bekämpfen wir Rassismus?", einbringen: "Entwickle dekoloniale Praxis." },
      { achse: "21", name: "Care-Küche", beschreibung: "Wer sorgt für wen?", einbringen: "Mache unsichtbare Arbeit sichtbar." },
      { achse: "08", name: "Öko-Gewächshaus", beschreibung: "Mensch und Natur?", einbringen: "Entwickle ökosozialistische Praxis." },
      { achse: "11", name: "Tech-Labor", beschreibung: "Technologie befreien oder bremsen?", einbringen: "Gestalte Technologie demokratisch." }
    ]
  },
  {
    name: "Keller",
    icon: "🔧",
    untertitel: "Praxis & Internationale",
    beschreibung: "Hier wird es konkret. Hier passiert es.",
    zimmer: [
      { achse: "13", name: "Aktionszentrale", beschreibung: "Welche Mittel sind legitim?", einbringen: "Plane und führe Aktionen durch." },
      { achse: "15", name: "Europa-Büro", beschreibung: "Lexit oder Reform?", einbringen: "Entwickle europäische Strategien." },
      { achse: "18", name: "Nahost-Zimmer", beschreibung: "Wie positionieren wir uns?", einbringen: "Informiere dich und beziehe Position." },
      { achse: "19", name: "Migrations-Portal", beschreibung: "Offene Grenzen?", einbringen: "Unterstütze Geflüchtete praktisch." },
      { achse: "22", name: "Land-Stadt-Karte", beschreibung: "Zentral oder dezentral?", einbringen: "Verbinde urbane und ländliche Kämpfe." }
    ]
  }
];

// Globale achsenMeta falls noch nicht definiert
if (!window.achsenMeta) {
  window.achsenMeta = {
    '00': { pole: ['Revolution', 'Hegemonie', 'Doppelstrategie', 'Strukturref.', 'Strikte Reform'] },
    '01': { pole: ['Staatsbesitz', 'Öffentlich', 'Plurale Formen', 'Genossenschaften', 'Commons'] },
    '02': { pole: ['Vollplanung', 'Demokrat. Plan', 'Marktsozialismus', 'Gemischt', 'Reg. Markt'] },
    '03': { pole: ['BGE', 'Sanktionsfrei', 'Garantiert', 'Modernisiert', 'Aktivierend'] },
    '04': { pole: ['Radikal', 'Vermögensst.', 'Progressiv', 'Moderat', 'Niedrig'] },
    '05': { pole: ['Dekommodifiz.', 'Öffentlich', 'Mietregulierung', 'Mehr bauen', 'Markt'] },
    '06': { pole: ['Voll öffentlich', 'Bürgerversich.', 'Krankenkasse', 'Wettbewerb', 'Privat'] },
    '07': { pole: ['Radikal demokr.', 'Gesamtschule', 'Kostenlos', 'Reform', 'Vielfalt'] },
    '08': { pole: ['Ökomodernismus', 'Grüner Soz.', 'Ökosozialismus', 'Degrowth', 'Tiefenökologie'] },
    '09': { pole: ['Klassenfem.', 'Sozialist.', 'Reprod.-Theorie', 'Intersekt.', 'Radikal'] },
    '10': { pole: ['Klassenkampf', 'Klasse+Anti', 'Strukturell', 'Dekolonial', 'Eigenständig'] },
    '11': { pole: ['Tech-Skepsis', 'Demokratisieren', 'Aneignen', 'Optimismus', 'Akzeleration'] },
    '12': { pole: ['Rätedemokratie', 'Basisdemo', 'Radikal', 'Erweitert', 'Parlament'] },
    '13': { pole: ['Militanz', 'Direkte Aktion', 'Ziv. Ungehorsam', 'Symbolisch', 'Nur legal'] },
    '14': { pole: ['Klasse zuerst', 'Klasse+', 'Verbindend', 'Intersekt.', 'Identität'] },
    '15': { pole: ['Lexit', 'Dagegen kämpfen', 'Demokratisieren', 'Soziales Europa', 'Föd. Europa'] },
    '16': { pole: ['Vollbesch.', 'Gute Arbeit', 'AZ-Verkürzung', 'Grundeinkommen', 'Post-Work'] },
    '17': { pole: ['Degrowth', 'Post-Wachstum', 'Selektiv', 'Nachhaltig', 'Grün. Wachstum'] },
    '18': { pole: ['Pro-Palästina', 'Pal.-solidarisch', 'Völkerrecht', 'Israel-solid.', 'Pro-Israel'] },
    '19': { pole: ['Link. Nation.', 'International', 'Proletarisch', 'Antiimperial.', 'No Border'] },
    '20': { pole: ['Dig. Commons', 'Plattform-Soz.', 'Starke Regul.', 'Datensouverän.', 'Lib. Regulierung'] },
    '21': { pole: ['Vergesellsch.', 'Öffentlich', 'Aufwerten', 'Flexibel', 'Familie'] },
    '22': { pole: ['Dezentral', 'Gleichwertig', 'Beide stärken', 'Städte progressiv', 'Urban'] },
    '23': { pole: ['Kritisch', 'Differenziert', 'Pragmatisch', 'Gegen Angriffe', 'Verteidigen'] },
    '24': { pole: ['Anti-Hegemonie', 'Alle Imperien', 'Antimilitarist.', 'Demokratien', 'Pro-West'] },
    '25': { pole: ['Pessimismus', 'Krit. Realismus', 'Dialektisch', 'Revolutionär', 'Utopie'] }
  };
}

function initWG() {
  const container = document.getElementById('wg-container');
  
  
  // ═══════════════════════════════════════════════════════════════
  // SPANNUNGSFELDER: Welche Achsen erzeugen interessante Debatten? (26 Achsen)
  // ═══════════════════════════════════════════════════════════════
  
  window.spannungsFelder = {
    '00': {
      name: "Reform vs. Revolution",
      fragen: [
        "Kann man den Kapitalismus von innen überwinden, oder braucht es einen Bruch?",
        "Sind Wahlen ein Weg zur Transformation oder eine Sackgasse?",
        "Wie viel Kompromiss verträgt radikale Politik?"
      ]
    },
    '01': {
      name: "Eigentum neu denken",
      fragen: [
        "Was gehört allen – und wie verwalten wir es?",
        "Staatseigentum oder Commons: Was ist sozialistischer?",
        "Kann Eigentum überhaupt abgeschafft werden?"
      ]
    },
    '02': {
      name: "Markt oder Plan?",
      fragen: [
        "Wer entscheidet, was produziert wird – und wie?",
        "Kann demokratische Planung funktionieren ohne Bürokratie?",
        "Gibt es einen Sozialismus mit Markt?"
      ]
    },
    '03': {
      name: "Soziale Sicherung",
      fragen: [
        "Grundeinkommen für alle oder Arbeit für alle?",
        "Befreit oder diszipliniert der Sozialstaat?",
        "Wer verdient Unterstützung – und wer entscheidet das?"
      ]
    },
    '04': {
      name: "Steuern & Umverteilung",
      fragen: [
        "Wie viel Umverteilung ist gerecht?",
        "Reichen Steuern aus oder brauchen wir Enteignung?",
        "Besteuern wir Einkommen oder Vermögen?"
      ]
    },
    '05': {
      name: "Wohnungsfrage",
      fragen: [
        "Wohnen als Menschenrecht – wie setzen wir das um?",
        "Enteignung, Mietendeckel oder mehr bauen?",
        "Wem gehört die Stadt?"
      ]
    },
    '06': {
      name: "Gesundheit für alle",
      fragen: [
        "Gesundheit als Ware oder als Commons?",
        "Eine Versicherung für alle oder Wahlfreiheit?",
        "Wer pflegt uns – und unter welchen Bedingungen?"
      ]
    },
    '07': {
      name: "Bildung neu denken",
      fragen: [
        "Selektion oder gemeinsames Lernen?",
        "Was ist Bildung – Qualifikation oder Emanzipation?",
        "Wer bestimmt, was gelehrt wird?"
      ]
    },
    '08': {
      name: "Ökologie & Sozialismus",
      fragen: [
        "Kann es grünes Wachstum geben – oder brauchen wir Degrowth?",
        "Wie verteilen wir die Kosten der ökologischen Transformation gerecht?",
        "Haben Tiere und Natur eigene Rechte?"
      ]
    },
    '09': {
      name: "Feminismus & Klasse",
      fragen: [
        "Ist Patriarchat ein Nebenwiderspruch?",
        "Können Männer Feministen sein – und was bedeutet das?",
        "Was kommt zuerst: Klassenkampf oder Geschlechterkampf?"
      ]
    },
    '10': {
      name: "Antirassismus",
      fragen: [
        "Struktureller Rassismus oder individuelle Vorurteile?",
        "Brauchen wir Reparationen für koloniales Unrecht?",
        "Wie verbinden wir Antirassismus und Klassenkampf?"
      ]
    },
    '11': {
      name: "Technologie & Befreiung",
      fragen: [
        "Befreit uns Technologie – oder versklavt sie uns?",
        "Wem gehören die Algorithmen?",
        "Automatisierung: Chance oder Bedrohung?"
      ]
    },
    '12': {
      name: "Demokratie: Wie viel?",
      fragen: [
        "Räte oder Parlament?",
        "Kann Demokratie in der Wirtschaft funktionieren?",
        "Wer darf mitentscheiden – und worüber?"
      ]
    },
    '13': {
      name: "Mittel & Gewalt",
      fragen: [
        "Heiligt der Zweck die Mittel?",
        "Ist Gewalt gegen Sachen auch Gewalt?",
        "Wie radikal darf Widerstand sein?"
      ]
    },
    '14': {
      name: "Klasse oder Identität?",
      fragen: [
        "Verbindet uns Klasse oder teilen uns Identitäten?",
        "Wer sind die 99% – und wer spricht für sie?",
        "Ist Kulturkampf Ablenkung vom Klassenkampf?"
      ]
    },
    '15': {
      name: "Europa: Reform oder Exit?",
      fragen: [
        "Kann man die EU von links reformieren?",
        "Lexit: Befreiung oder nationalistischer Rückfall?",
        "Wie sieht ein sozialistisches Europa aus?"
      ]
    },
    '16': {
      name: "Zukunft der Arbeit",
      fragen: [
        "Weniger arbeiten oder besser arbeiten?",
        "Ist eine Welt ohne Lohnarbeit möglich?",
        "Wer macht die Drecksarbeit in der Utopie?"
      ]
    },
    '17': {
      name: "Wachstum: Ja oder Nein?",
      fragen: [
        "Kann Sozialismus ohne Wachstum funktionieren?",
        "Degrowth im Norden, Entwicklung im Süden?",
        "Was wächst – und was schrumpft?"
      ]
    },
    '18': {
      name: "Nahostkonflikt",
      fragen: [
        "Solidarität mit wem – und wogegen?",
        "Kann man Israel kritisieren ohne antisemitisch zu sein?",
        "Ein Staat, zwei Staaten oder keine Staaten?"
      ]
    },
    '19': {
      name: "Migration & Grenzen",
      fragen: [
        "Offene Grenzen oder regulierte Migration?",
        "Drückt Migration die Löhne – oder ist das ein Mythos?",
        "Wer ist das Volk – und wer gehört dazu?"
      ]
    },
    '20': {
      name: "Digitale Zukunft",
      fragen: [
        "Wem gehören unsere Daten?",
        "Vergesellschaften wir die Plattformen?",
        "Wie viel Überwachung verträgt eine freie Gesellschaft?"
      ]
    },
    '21': {
      name: "Care-Arbeit",
      fragen: [
        "Wer sorgt für wen – und wer bezahlt dafür?",
        "Vergesellschaften wir Care – oder werten wir sie auf?",
        "Ist Care weiblich – und muss das so sein?"
      ]
    },
    '22': {
      name: "Stadt & Land",
      fragen: [
        "Zentralisierung oder Dezentralisierung?",
        "Wer lebt auf dem Land – und warum?",
        "Gibt es linke Antworten auf ländliche Abwanderung?"
      ]
    },
    '23': {
      name: "Geschichte der Linken",
      fragen: [
        "Was lernen wir aus dem Scheitern des Realsozialismus?",
        "Können wir unsere Geschichte kritisch sehen ohne sie zu verleugnen?",
        "Welche Traditionen tragen – und welche belasten?"
      ]
    },
    '24': {
      name: "Geopolitik",
      fragen: [
        "Hauptfeind im eigenen Land oder gemeinsam gegen Autokratien?",
        "NATO raus – aber was dann?",
        "Kann es linken Patriotismus geben?"
      ]
    },
    '25': {
      name: "Spiritualität & Politik",
      fragen: [
        "Hat Sozialismus eine spirituelle Dimension?",
        "Können religiöse Menschen gute Sozialist*innen sein?",
        "Braucht Widerstand innere Transformation?"
      ]
    }
  };
  
  // WG-Namen für zufällige Zuweisung
  window.wgNamen = [
    { name: "Rote Flora", icon: "🌺" },
    { name: "Barrikade", icon: "🚧" },
    { name: "Treibhaus", icon: "🌱" },
    { name: "Salon Rosa", icon: "🌹" },
    { name: "Freiraum", icon: "🏴" },
    { name: "Kollektiv", icon: "⚙️" },
    { name: "Utopia", icon: "✨" },
    { name: "Commune", icon: "🤝" }
  ];
  
  // ═══════════════════════════════════════════════════════════════
  // HAUS-STRUKTUR (für Funktional-Modus)
  // ═══════════════════════════════════════════════════════════════
  
  
  // Initial rendern
  renderHaus('erkunden');
}

// ═══════════════════════════════════════════════════════════════
// HAUPT-RENDER: Zwei Modi
// ═══════════════════════════════════════════════════════════════

function renderHaus(modus, noScroll = false) {
  // Schließe Info-Panel falls offen
  closePanel();
  
  const container = document.getElementById('wg-container');
  const profil = generatorProfil || konfigAuswahl || {};
  const archetyp = generatorArchetyp || null;
  
  let html = '';
  
  // Header mit 4 Tabs
  html += `
    <div class="haus-header">
      <h2>🏠 Das Haus des linken Denkens</h2>
      <div class="haus-tabs">
        <button class="haus-tab ${modus === 'erkunden' ? 'active' : ''}" onclick="renderHaus('erkunden')">🚪 Erkunden</button>
        <button class="haus-tab ${modus === 'profil' ? 'active' : ''}" onclick="renderHaus('profil')">🎯 Mein Profil</button>
        <button class="haus-tab ${modus === 'definition' ? 'active' : ''}" onclick="renderHaus('definition')">🔴 Mein Sozialismus</button>
        <button class="haus-tab ${modus === 'wg' ? 'active' : ''}" onclick="renderHaus('wg')">📺 Talkshow</button>
      </div>
    </div>
  `;
  
  // Inhalt je nach Modus
  if (modus === 'erkunden' || modus === 'funktional') {
    html += renderErkundenModus(profil);
  } else if (modus === 'profil') {
    html += renderMeinProfilModus(profil, archetyp);
  } else if (modus === 'definition') {
    html += renderMeinSozialismusModus(profil);
  } else if (modus === 'wg') {
    html += renderWGModus(archetyp);
  }
  
  container.innerHTML = html;
  
  // Scrolle nur wenn nicht noScroll
  if (!noScroll) {
    // Scrolle zum Anfang des Containers (Dach)
    container.scrollTop = 0;
    
    // Scrolle auch die Seite nach oben wenn nötig
    const containerTop = container.getBoundingClientRect().top + window.pageYOffset;
    if (window.pageYOffset > containerTop - 100) {
      window.scrollTo({ top: containerTop - 100, behavior: 'smooth' });
    }
  }
  
  // Nach dem Rendern: Drag & Drop initialisieren wenn Definition-Tab
  if (modus === 'definition') {
    initDefinitionDragDrop();
  }
}

// ═══════════════════════════════════════════════════════════════
// ERKUNDEN-MODUS: Das Haus durchstöbern (ohne persönliches Profil nötig)
// ═══════════════════════════════════════════════════════════════

function renderErkundenModus(profil) {
  const hatProfil = Object.keys(profil).length > 0;
  
  let html = '';
  
  html += `
    <div class="haus-gebaeude">
  `;
  
  window.hausStruktur.forEach(etage => {
    const hatAktive = etage.zimmer.some(z => profil[z.achse] !== undefined);
    
    html += `
      <div class="haus-etage ${hatAktive ? 'aktiv' : ''}">
        <div class="etage-header">
          <span class="etage-icon">${etage.icon}</span>
          <div class="etage-info">
            <h3>${etage.name}</h3>
            <span class="etage-untertitel">${etage.untertitel}</span>
          </div>
        </div>
        <div class="etage-zimmer">
    `;
    
    etage.zimmer.forEach(zimmer => {
      const achse = zimmer.achse;
      const meinePos = profil[achse];
      const meta = window.achsenMeta[achse] || { pole: ['1','2','3','4','5'] };
      
      // Sammle Bewohner-Daten für Button
      const bewohnerByPos = { grau: [], gelb: [], gruen: [] };
      const personMaxPos = {}; // Track höchste Position pro Person
      
      // Erst alle Positionen sammeln und höchste Position tracken
      for (let pos = 1; pos <= 5; pos++) {
        const knotenId = `${achse}-${pos}`;
        const knoten = knotenData[knotenId];
        if (knoten && knoten.bewohner) {
          const klassiker = knoten.bewohner.klassiker || [];
          const zeitgenossen = knoten.bewohner.zeitgenossen || [];
          const alleBewohner = [...klassiker, ...zeitgenossen];
          
          alleBewohner.forEach(name => {
            // Speichere nur höchste Position
            if (!personMaxPos[name] || pos > personMaxPos[name]) {
              personMaxPos[name] = pos;
            }
          });
        }
      }
      
      // Dann Personen in die richtige Farbe einordnen (basierend auf höchster Position)
      // NEUTRALE Farbcodierung: Blau (1) / Gelb (2-3) / Orange (4-5)
      // KEINE moralische Wertung mehr, nur visuelle Gruppierung
      Object.entries(personMaxPos).forEach(([name, pos]) => {
        if (pos >= 4) {
          // Position 4-5: Orange
          bewohnerByPos.gruen.push({ name, pos });
        } else if (pos >= 2) {
          // Position 2-3: Gelb
          bewohnerByPos.gelb.push({ name, pos });
        } else {
          // Position 1: Blau
          bewohnerByPos.grau.push({ name, pos });
        }
      });
      
      // Sortiere alphabetisch
      const uniqueGruen = bewohnerByPos.gruen.sort((a, b) => a.name.localeCompare(b.name));
      const uniqueGelb = bewohnerByPos.gelb.sort((a, b) => a.name.localeCompare(b.name));
      const uniqueGrau = bewohnerByPos.grau.sort((a, b) => a.name.localeCompare(b.name));
      
      const totalCount = uniqueGruen.length + uniqueGelb.length + uniqueGrau.length;
      
      // Erstelle JSON-Daten für Modal (escapte für HTML-Attribut)
      const bewohnerData = JSON.stringify({
        zimmer: zimmer.name,
        achse: achse,
        gruen: uniqueGruen,
        gelb: uniqueGelb,
        grau: uniqueGrau
      }).replace(/"/g, '&quot;');
      
      // Render Zimmer mit Split-Buttons
      html += `
        <div class="haus-zimmer ${meinePos ? 'meine-position' : ''}" data-achse="${achse}" data-bewohner="${totalCount}">
          <div class="zimmer-kopf">
            <span class="zimmer-achse">${achse}</span>
            <span class="zimmer-name">${zimmer.name}</span>
          </div>
          <div class="zimmer-actions">
            <button class="zimmer-action-btn zimmer-btn" onclick="event.stopPropagation(); zeigeZimmerDetail('${achse}')">
              <span class="btn-icon">📖</span>
              <span class="btn-label">Zimmer<br>betreten</span>
            </button>
            ${totalCount > 0 ? `
              <button class="zimmer-action-btn bewohner-btn" onclick="event.stopPropagation(); openBewohnerModal(${bewohnerData})">
                <span class="btn-icon">👤</span>
                <span class="btn-label">${totalCount}<br>Bewohner*in${totalCount === 1 ? '' : 'nen'}</span>
                <div class="btn-dots">
                  ${uniqueGruen.length > 0 ? `<span class="dot gruen">●</span>` : ''}
                  ${uniqueGelb.length > 0 ? `<span class="dot gelb">●</span>` : ''}
                  ${uniqueGrau.length > 0 ? `<span class="dot grau">●</span>` : ''}
                </div>
              </button>
            ` : `
              <button class="zimmer-action-btn bewohner-btn disabled" disabled>
                <span class="btn-icon">👤</span>
                <span class="btn-label">Keine<br>Bewohner</span>
              </button>
            `}
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  return html;
}

// ═══════════════════════════════════════════════════════════════
// HAUS-ANSICHT: Switch zwischen Zimmer und Bewohner
// ═══════════════════════════════════════════════════════════════

window.hausAnsichtsModus = 'zimmer';

function switchHausAnsicht(modus) {
  window.hausAnsichtsModus = modus;
  renderHaus('erkunden');
}

// Modal für Bewohner-Liste
function openBewohnerModal(data) {
  const modal = document.getElementById('bewohner-modal') || createBewohnerModal();
  const title = modal.querySelector('.modal-title');
  const content = modal.querySelector('.modal-content-inner');
  
  title.textContent = `${data.zimmer} (Achse ${data.achse})`;
  
  let html = '';
  
  // NEUTRALE Labels ohne moralische Wertung
  const labelOrange = 'Position 4-5';
  const labelGelb = 'Position 2-3';
  const labelBlau = 'Position 1';
  
  // Orange (Position 4-5) zuerst
  if (data.gruen && data.gruen.length > 0) {
    html += `
      <div class="bewohner-section orange">
        <h3>🟠 ${labelOrange} (${data.gruen.length} ${data.gruen.length === 1 ? 'Person' : 'Personen'})</h3>
        <div class="bewohner-grid">
          ${data.gruen.map(b => `
            <span class="bewohner-chip orange" onclick="searchPerson('${b.name.replace(/'/g, "\\'")}'); closeBewohnerModal();" title="Position ${b.pos}">
              ${b.name}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Gelb (Position 2-3)
  if (data.gelb && data.gelb.length > 0) {
    html += `
      <div class="bewohner-section gelb">
        <h3>🟡 ${labelGelb} (${data.gelb.length} ${data.gelb.length === 1 ? 'Person' : 'Personen'})</h3>
        <div class="bewohner-grid">
          ${data.gelb.map(b => `
            <span class="bewohner-chip gelb" onclick="searchPerson('${b.name.replace(/'/g, "\\'")}'); closeBewohnerModal();" title="Position ${b.pos}">
              ${b.name}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Blau (Position 1)
  if (data.grau && data.grau.length > 0) {
    html += `
      <div class="bewohner-section blau">
        <h3>🔵 ${labelBlau} (${data.grau.length} ${data.grau.length === 1 ? 'Person' : 'Personen'})</h3>
        <div class="bewohner-grid">
          ${data.grau.map(b => `
            <span class="bewohner-chip blau" onclick="searchPerson('${b.name.replace(/'/g, "\\'")}'); closeBewohnerModal();" title="Position ${b.pos}">
              ${b.name}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  content.innerHTML = html;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeBewohnerModal() {
  const modal = document.getElementById('bewohner-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function createBewohnerModal() {
  const modal = document.createElement('div');
  modal.id = 'bewohner-modal';
  modal.className = 'bewohner-modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeBewohnerModal()"></div>
    <div class="modal-box">
      <div class="modal-header">
        <h2 class="modal-title"></h2>
        <button class="modal-close" onclick="closeBewohnerModal()">✕</button>
      </div>
      <div class="modal-content-inner"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

// ═══════════════════════════════════════════════════════════════
// WG-MODUS: Talkshow
// ═══════════════════════════════════════════════════════════════

// Globale Variable für Talkshow-Modus
window.talkshowModus = 'personen'; // 'personen' oder 'archetypen'

function renderWGModus(userArchetyp) {
  const archetypen = window.archetypen;
  const modus = window.talkshowModus || 'personen';
  
  let html = '';
  
  // Header mit Modus-Umschalter
  html += `
    <div class="talkshow-header">
      <div class="talkshow-logo">📺</div>
      <div class="talkshow-titel">
        <h2>Talkshow-Generator</h2>
        <p>Historische Begegnungen, die nie stattfanden</p>
      </div>
    </div>
    
    <div class="talkshow-modus-switch">
      <button class="modus-btn ${modus === 'personen' ? 'active' : ''}" onclick="switchTalkshowModus('personen')">
        👤 Historische Personen
      </button>
      <button class="modus-btn ${modus === 'archetypen' ? 'active' : ''}" onclick="switchTalkshowModus('archetypen')">
        🎭 Idealtypische Strömungen
      </button>
    </div>
  `;
  
  if (modus === 'personen') {
    html += renderPersonenTalkshow();
  } else {
    html += renderArchetypenTalkshow(userArchetyp, archetypen);
  }
  
  // Zukunfts-Teaser
  html += `
    <div class="talkshow-zukunft">
      <span>🔜</span>
      <div>
        <strong>Bald: KI-gestützte Debatten</strong>
        <p>Die Personen antworten dynamisch. Du kannst Fragen stellen. Eine KI simuliert ihre Positionen.</p>
      </div>
    </div>
  `;
  
  return html;
}

function switchTalkshowModus(modus) {
  window.talkshowModus = modus;
  renderHaus('wg');
}

// ═══════════════════════════════════════════════════════════════
// PERSONEN-TALKSHOW: Echte historische Figuren
// ═══════════════════════════════════════════════════════════════

function sammelAllePersonen() {
  const personen = [];
  const gesehen = new Set();
  
  Object.entries(knotenData).forEach(([knotenId, knoten]) => {
    const achse = knoten.achse;
    const position = knoten.position;
    const positionsName = knoten.name;
    
    // Klassiker
    (knoten.bewohner?.klassiker || []).forEach(person => {
      const name = person.replace(/\s*\([^)]*\)/, '').trim();
      const match = person.match(/\((\d{4})-(\d{4}|\?|heute)\)/);
      const lebensdaten = match ? `${match[1]}-${match[2]}` : null;
      
      if (!gesehen.has(name.toLowerCase())) {
        gesehen.add(name.toLowerCase());
        personen.push({
          name,
          lebensdaten,
          typ: 'klassiker',
          positionen: [{ achse, position, knotenId, positionsName }],
          icon: '🏛️'
        });
      } else {
        // Position hinzufügen wenn Person schon existiert
        const existing = personen.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (existing && !existing.positionen.some(p => p.knotenId === knotenId)) {
          existing.positionen.push({ achse, position, knotenId, positionsName });
        }
      }
    });
    
    // Zeitgenossen
    (knoten.bewohner?.zeitgenossen || []).forEach(person => {
      const name = person.replace(/\s*\([^)]*\)/, '').trim();
      
      if (!gesehen.has(name.toLowerCase())) {
        gesehen.add(name.toLowerCase());
        personen.push({
          name,
          typ: 'zeitgenosse',
          positionen: [{ achse, position, knotenId, positionsName }],
          icon: '👤'
        });
      } else {
        const existing = personen.find(p => p.name.toLowerCase() === name.toLowerCase());
        if (existing && !existing.positionen.some(p => p.knotenId === knotenId)) {
          existing.positionen.push({ achse, position, knotenId, positionsName });
        }
      }
    });
  });
  
  return personen;
}

function waehleTalkshowGaeste(anzahl = 4) {
  const allePersonen = sammelAllePersonen();
  
  // Filtere Personen mit mindestens einer Position
  const mitPositionen = allePersonen.filter(p => p.positionen.length > 0);
  
  if (mitPositionen.length < anzahl) {
    return mitPositionen;
  }
  
  // Strategie: Wähle Personen mit verschiedenen Positionen für Spannung
  const gaeste = [];
  const verwendeteAchsen = new Set();
  
  // Mische zufällig
  const gemischt = [...mitPositionen].sort(() => Math.random() - 0.5);
  
  // Versuche, Personen von verschiedenen Achsen zu wählen
  for (const person of gemischt) {
    if (gaeste.length >= anzahl) break;
    
    const neueAchse = person.positionen.some(p => !verwendeteAchsen.has(p.achse));
    
    if (neueAchse || gaeste.length < 2) {
      gaeste.push(person);
      person.positionen.forEach(p => verwendeteAchsen.add(p.achse));
    }
  }
  
  // Falls nicht genug, fülle auf
  while (gaeste.length < anzahl && gaeste.length < gemischt.length) {
    const rest = gemischt.filter(p => !gaeste.includes(p));
    if (rest.length > 0) {
      gaeste.push(rest[0]);
    } else {
      break;
    }
  }
  
  return gaeste;
}

function findeSpannungenPersonen(gaeste) {
  const spannungen = [];
  const achsenMeta = window.achsenMeta || {};
  const spannungsFelder = window.spannungsFelder || {};
  
  // Sammle alle Achsen-Positionen der Gäste
  const achsenPositionen = {};
  
  gaeste.forEach(gast => {
    gast.positionen.forEach(pos => {
      if (!achsenPositionen[pos.achse]) {
        achsenPositionen[pos.achse] = [];
      }
      achsenPositionen[pos.achse].push({
        person: gast,
        position: pos.position,
        positionsName: pos.positionsName
      });
    });
  });
  
  // Finde Achsen mit mehreren Gästen (= potenzielle Debatte)
  Object.entries(achsenPositionen).forEach(([achse, eintraege]) => {
    if (eintraege.length >= 2) {
      // Sortiere nach Position
      eintraege.sort((a, b) => a.position - b.position);
      
      const min = eintraege[0];
      const max = eintraege[eintraege.length - 1];
      const diff = max.position - min.position;
      
      if (diff >= 1) {
        spannungen.push({
          achse,
          name: achsenMeta[achse]?.name || spannungsFelder[achse]?.name || `Achse ${achse}`,
          diff,
          pole: [min, max],
          alleBeteiligt: eintraege,
          fragen: spannungsFelder[achse]?.fragen || [`Wie positioniert ihr euch auf der ${achse}-Achse?`]
        });
      }
    }
  });
  
  // Sortiere nach Spannung (größte Differenz zuerst)
  spannungen.sort((a, b) => b.diff - a.diff);
  
  return spannungen;
}

function renderPersonenTalkshow() {
  // Wähle Gäste
  const gaeste = waehleTalkshowGaeste(4);
  window.aktuelleTalkshowGaeste = gaeste;
  
  // Finde Spannungen
  const spannungen = findeSpannungenPersonen(gaeste);
  window.aktuelleTalkshowSpannungen = spannungen;
  
  // Farben für Personen
  const farben = ['#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA', '#00ACC1'];
  gaeste.forEach((g, i) => g.farbe = farben[i % farben.length]);
  
  let html = '';
  
  // Gäste-Vorstellung
  html += `
    <div class="talkshow-gaeste personen">
      <div class="gaeste-label">🎤 Heute zu Gast:</div>
      <div class="gaeste-reihe">
        ${gaeste.map(g => `
          <div class="gast-karte person" style="--accent: ${g.farbe}">
            <div class="gast-icon">${g.icon}</div>
            <div class="gast-name">${g.name}</div>
            <div class="gast-zeit">${g.lebensdaten || g.typ === 'zeitgenosse' ? '(zeitgenössisch)' : ''}</div>
            <div class="gast-positionen">
              ${g.positionen.slice(0, 2).map(p => `<span class="position-tag">${p.positionsName}</span>`).join('')}
              ${g.positionen.length > 2 ? `<span class="position-more">+${g.positionen.length - 2}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <button class="talkshow-neu-btn" onclick="renderHaus('wg')">🎲 Neue Runde</button>
    </div>
  `;
  
  // Spannungsfelder / Debatten-Themen
  if (spannungen.length > 0) {
    html += `
      <div class="talkshow-spannungen">
        <h3>⚡ Potenzielle Streitpunkte</h3>
        <div class="spannungen-liste">
          ${spannungen.slice(0, 3).map((s, i) => `
            <div class="spannung-karte" data-index="${i}">
              <div class="spannung-header">
                <span class="spannung-achse">${s.achse}</span>
                <span class="spannung-name">${s.name}</span>
                <span class="spannung-diff" title="Positionsdifferenz">${s.diff} Stufen</span>
              </div>
              <div class="spannung-pole">
                <div class="pol links" style="--accent: ${s.pole[0].person.farbe}">
                  <span class="pol-person">${s.pole[0].person.name}</span>
                  <span class="pol-position">${s.pole[0].positionsName}</span>
                </div>
                <div class="pol-vs">vs.</div>
                <div class="pol rechts" style="--accent: ${s.pole[1].person.farbe}">
                  <span class="pol-person">${s.pole[1].person.name}</span>
                  <span class="pol-position">${s.pole[1].positionsName}</span>
                </div>
              </div>
              <div class="spannung-frage">
                🎙️ "${s.fragen[Math.floor(Math.random() * s.fragen.length)]}"
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="talkshow-harmonie">
        <p>🕊️ Diese Runde hat wenige direkte Berührungspunkte – aber vielleicht ergeben sich unerwartete Allianzen?</p>
      </div>
    `;
  }
  
  // Debatte starten
  html += `
    <div class="talkshow-start">
      <button class="debatte-starten-btn" onclick="zeigePersonenDebatte()">
        🎬 Debatte simulieren
      </button>
      <p class="debatte-hinweis">Die Positionen werden aus dem Linken Wesen abgeleitet. Bald: KI-generierte Antworten!</p>
    </div>
  `;
  
  return html;
}

// ═══════════════════════════════════════════════════════════════
// ARCHETYPEN-TALKSHOW (bisherige Version)
// ═══════════════════════════════════════════════════════════════

function renderArchetypenTalkshow(userArchetyp, archetypen) {
  // Alle Archetyp-IDs
  const alleArchetypen = Object.keys(archetypen);
  
  // Mische und wähle 4 Gäste
  const gemischt = [...alleArchetypen].sort(() => Math.random() - 0.5);
  const gaeste = gemischt.slice(0, 4);
  
  // Falls User-Archetyp dabei ist, entfernen
  if (userArchetyp && gaeste.includes(userArchetyp)) {
    const idx = gaeste.indexOf(userArchetyp);
    gaeste[idx] = gemischt.find(a => !gaeste.includes(a) && a !== userArchetyp);
  }
  
  // Global speichern
  window.aktuelleGaeste = gaeste;
  window.userArchetyp = userArchetyp;
  
  const userArchetypInfo = userArchetyp ? archetypen[userArchetyp] : null;
  
  let html = '';
  
  // Gäste-Vorstellung
  html += `
    <div class="talkshow-gaeste">
      <div class="gaeste-label">🎤 Heute zu Gast:</div>
      <div class="gaeste-reihe">
        ${gaeste.map(id => {
          const g = archetypen[id];
          return `
            <div class="gast-karte" style="--accent: ${g.farbe}">
              <div class="gast-icon">${g.icon}</div>
              <div class="gast-name">${g.name}</div>
              <div class="gast-slogan">"${g.slogan}"</div>
            </div>
          `;
        }).join('')}
      </div>
      <button class="talkshow-neu-btn" onclick="renderHaus('wg')">🎲 Neue Gäste</button>
    </div>
  `;
  
  // User-Einschaltung
  if (userArchetypInfo) {
    html += `
      <div class="talkshow-user">
        <div class="user-badge" style="--accent: ${userArchetypInfo.farbe}">
          <span class="user-icon">${userArchetypInfo.icon}</span>
          <div class="user-info">
            <span class="user-label">Du als:</span>
            <span class="user-name">${userArchetypInfo.name}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Debatte starten
  html += `
    <div class="talkshow-start">
      <button class="debatte-starten-btn" onclick="zeigeTalkshow()">
        🎬 Debatte starten
      </button>
    </div>
  `;
  
  return html;
}

// ═══════════════════════════════════════════════════════════════
// ZIMMER-DETAIL Popup
// ═══════════════════════════════════════════════════════════════

function zeigeZimmerDetail(achse) {
  const zimmer = window.hausStruktur
    .flatMap(e => e.zimmer)
    .find(z => z.achse === achse);
  
  if (!zimmer) return;
  
  const profil = generatorProfil || konfigAuswahl || {};
  const meinePos = profil[achse];
  const meta = window.achsenMeta[achse];
  
  // Neue Beschreibungen und Handlungen laden (wenn vorhanden)
  const zimmerInfo = window.zimmerBeschreibungen?.[achse] || {};
  
  // Handlungen aus zimmerInfo extrahieren
  const handlungen = zimmerInfo.handlungen || {};
  
  // Atmosphäre-Text zusammenbauen
  let atmosphaereText = '';
  if (zimmerInfo.atmosphaere) {
    if (typeof zimmerInfo.atmosphaere === 'string') {
      atmosphaereText = zimmerInfo.atmosphaere;
    } else if (zimmerInfo.atmosphaere.stimmung) {
      const atm = zimmerInfo.atmosphaere;
      atmosphaereText = [atm.stimmung, atm.geraeusche, atm.geruch].filter(Boolean).join(' · ');
    }
  }
  
  // Zimmer-Header mit atmosphärischer Beschreibung
  const beschreibungHtml = zimmerInfo.beschreibung ? `
    <div class="zimmer-atmosphaere">
      <p class="zimmer-beschreibung-lang">${zimmerInfo.beschreibung}</p>
      ${atmosphaereText ? `<p class="zimmer-stimmung"><em>${atmosphaereText}</em></p>` : ''}
      ${zimmerInfo.zitat ? `<div class="zimmer-zitat"><blockquote>${zimmerInfo.zitat}</blockquote></div>` : ''}
    </div>
  ` : `<p class="zimmer-frage">${zimmer.beschreibung}</p>`;
  
  // Typische Bewohner*innen
  const bewohnerHtml = zimmerInfo.typische_bewohner?.length ? `
    <div class="zimmer-bewohner">
      <span class="bewohner-label">👥 Hier triffst du:</span>
      <span class="bewohner-liste">${zimmerInfo.typische_bewohner.join(' · ')}</span>
    </div>
  ` : '';
  
  // Meine Position
  let posText = '';
  let positionDetails = '';
  
  if (meinePos) {
    const knotenId = `${achse}-${meinePos}`;
    const knoten = knotenData[knotenId];
    
    posText = `
      <div class="zimmer-meine-pos">
        <div class="pos-header">
          <span class="pos-label">Deine Position:</span>
          <span class="pos-nummer">${meinePos}</span>
          <span class="pos-name">${knoten?.name || meta?.pole[meinePos-1] || ''}</span>
        </div>
      </div>
    `;
    
    if (knoten) {
      positionDetails = `
        <div class="position-details">
          <p class="position-beschreibung">${knoten.beschreibung || ''}</p>
          
          ${knoten.zitate?.length ? `
            <div class="position-zitat">
              <span class="zitat-icon">💬</span>
              <blockquote>"${knoten.zitate[0].text}"</blockquote>
              <cite>— ${knoten.zitate[0].autor}</cite>
            </div>
          ` : ''}
          
          <button class="position-mehr-btn" onclick="event.stopPropagation(); this.closest('.zimmer-detail-overlay').remove(); showKnoten('${knotenId}');">
            📖 Mehr erfahren
          </button>
        </div>
      `;
    }
  }
  
  // Alle 5 Positionen des Zimmers zeigen - KLICKBAR zur Filterung
  const spektrumHtml = `
    <div class="zimmer-spektrum-detail">
      <div class="spektrum-label-links">${meta?.pole[0] || '1'}</div>
      <div class="spektrum-positionen">
        ${[1,2,3,4,5].map(pos => {
          const knotenId = `${achse}-${pos}`;
          const knoten = knotenData[knotenId];
          const istMeins = meinePos === pos;
          return `
            <div class="spektrum-pos-detail ${istMeins ? 'meine' : ''}" 
                 data-pos="${pos}"
                 onclick="event.stopPropagation(); filterZimmerHandlungen('${achse}', ${pos});"
                 title="Klicke für Handlungsvorschläge zu: ${knoten?.name || pos}">
              <span class="pos-num">${pos}</span>
              <span class="pos-title">${knoten?.name || ''}</span>
              ${istMeins ? '<span class="pos-marker">●</span>' : ''}
            </div>
          `;
        }).join('')}
      </div>
      <div class="spektrum-label-rechts">${meta?.pole[4] || '5'}</div>
    </div>
    <p class="spektrum-hinweis">👆 Klicke auf eine Position, um passende Handlungsvorschläge zu sehen</p>
  `;
  
  // Handlungen-Sektion - initial alle oder basierend auf eigener Position
  const initialPos = meinePos || null;
  const handlungenHtml = renderHandlungenFuerPosition(achse, handlungen, initialPos, zimmer);
  
  const html = `
    <div class="zimmer-detail-overlay" onclick="this.remove()">
      <div class="zimmer-detail-popup" onclick="event.stopPropagation()">
        <button class="zimmer-detail-close" onclick="this.parentElement.parentElement.remove()">×</button>
        
        <div class="zimmer-detail-header">
          <span class="zimmer-achse-badge">${zimmer.achse}</span>
          <h3>${zimmer.name}</h3>
          ${zimmerInfo.funktion ? `<span class="zimmer-funktion">${zimmerInfo.funktion}</span>` : ''}
        </div>
        
        ${beschreibungHtml}
        ${bewohnerHtml}
        
        ${spektrumHtml}
        
        ${posText}
        ${positionDetails}
        
        ${handlungenHtml}
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
}

// Rendert Handlungen für eine spezifische Position (oder alle wenn pos=null)
function renderHandlungenFuerPosition(achse, handlungen, pos, zimmer) {
  if (!handlungen || Object.keys(handlungen).length === 0) {
    return `
      <div class="zimmer-einbringen">
        <h4>💡 Wie du dich einbringen kannst:</h4>
        <p>${zimmer?.einbringen || 'Erkunde die verschiedenen Positionen!'}</p>
      </div>
    `;
  }
  
  // Mapping: Position 1-5 zu den Keys in zimmer_beschreibungen
  // position_0 = radikal links (Position 5)
  // position_05 = Mitte (Position 3)  
  // position_1 = moderat/rechts (Position 1)
  const positionKeyMap = {
    1: 'position_1',
    2: 'position_1',  // Näher an moderat
    3: 'position_05',
    4: 'position_0',  // Näher an radikal
    5: 'position_0'
  };
  
  const knotenId = pos ? `${achse}-${pos}` : null;
  const knoten = pos ? knotenData[knotenId] : null;
  const posName = knoten?.name || (pos ? `Position ${pos}` : 'Alle Positionen');
  
  // Wenn Position gewählt: nur deren Handlungen (mit Mapping), sonst alle
  let posHandlungen;
  const posKey = pos ? positionKeyMap[pos] : null;
  
  if (pos && posKey && handlungen[posKey]) {
    posHandlungen = handlungen[posKey];
  } else if (pos) {
    // Position hat keine spezifischen Handlungen
    return `
      <div class="zimmer-handlungen" id="handlungen-container">
        <h4>🔥 Handlungen für: ${posName}</h4>
        <p class="handlungen-leer">Für diese Position sind noch keine spezifischen Handlungsvorschläge hinterlegt.</p>
        <button class="handlungen-alle-btn" onclick="filterZimmerHandlungen('${achse}', null)">
          Alle Handlungen anzeigen
        </button>
      </div>
    `;
  } else {
    // Alle sammeln (aus position_0, position_05, position_1)
    posHandlungen = { privat: [], lokal: [], vernetzt: [], global: [] };
    Object.values(handlungen).forEach(h => {
      // h kann {name, privat, lokal, vernetzt, global} sein
      if (Array.isArray(h.privat)) posHandlungen.privat.push(...h.privat);
      if (Array.isArray(h.lokal)) posHandlungen.lokal.push(...h.lokal);
      if (Array.isArray(h.vernetzt)) posHandlungen.vernetzt.push(...h.vernetzt);
      if (Array.isArray(h.global)) posHandlungen.global.push(...h.global);
    });
    // Deduplizieren
    posHandlungen.privat = [...new Set(posHandlungen.privat)];
    posHandlungen.lokal = [...new Set(posHandlungen.lokal)];
    posHandlungen.vernetzt = [...new Set(posHandlungen.vernetzt)];
    posHandlungen.global = [...new Set(posHandlungen.global)];
  }
  
  const hatHandlungen = posHandlungen.privat?.length || posHandlungen.lokal?.length || 
                        posHandlungen.vernetzt?.length || posHandlungen.global?.length;
  
  // Finde passende Ressourcen für diese Achse/Position
  const ressourcenPrivat = findeRessourcen(achse, pos, 'privat');
  const ressourcenLokal = findeRessourcen(achse, pos, 'lokal');
  const ressourcenVernetzt = findeRessourcen(achse, pos, 'vernetzt');
  const ressourcenGlobal = findeRessourcen(achse, pos, 'global');
  
  // Render-Helper für Ressourcen-Links
  const renderRessourcenLinks = (ressourcen) => {
    if (!ressourcen || ressourcen.length === 0) return '';
    return `
      <div class="ressourcen-links">
        ${ressourcen.map(r => `
          <a href="${r.url}" target="_blank" class="ressource-link" title="${r.beschreibung || r.name}">
            <span class="ressource-typ">${getTypIcon(r.typ)}</span>
            <span class="ressource-name">${r.name}</span>
          </a>
        `).join('')}
      </div>
    `;
  };
  
  // Typ-Icons
  const getTypIcon = (typ) => {
    const icons = {
      'organisation': '🏛️',
      'gewerkschaft': '🏭',
      'bewegung': '✊',
      'kampagne': '📢',
      'medien': '📰',
      'bildung': '📚',
      'vernetzung': '🔗',
      'beratung': '💬',
      'plattform': '🌐'
    };
    return icons[typ] || '📌';
  };
  
  if (!hatHandlungen && ressourcenLokal.length === 0 && ressourcenVernetzt.length === 0) {
    return `
      <div class="zimmer-handlungen" id="handlungen-container">
        <h4>🔥 Handlungen für: ${posName}</h4>
        <p class="handlungen-leer">Keine Handlungsvorschläge verfügbar.</p>
      </div>
    `;
  }
  
  return `
    <div class="zimmer-handlungen" id="handlungen-container">
      <h4>🔥 ${pos ? `Handlungen für: ${posName}` : 'Was du hier tun kannst'}</h4>
      ${pos ? `<button class="handlungen-alle-btn" onclick="filterZimmerHandlungen('${achse}', null)">← Alle anzeigen</button>` : ''}
      
      ${posHandlungen.privat?.length || ressourcenPrivat.length ? `
        <div class="handlungen-kategorie offen">
          <div class="handlungen-header" onclick="this.parentElement.classList.toggle('offen')">
            <span class="handlungen-icon">🏠</span>
            <span class="handlungen-titel">Für dich selbst</span>
            <span class="handlungen-count">${posHandlungen.privat?.length || 0}</span>
            <span class="handlungen-toggle">▼</span>
          </div>
          <div class="handlungen-liste">
            ${(posHandlungen.privat || []).map(h => `<div class="handlung-item">• ${h}</div>`).join('')}
            ${renderRessourcenLinks(ressourcenPrivat)}
          </div>
        </div>
      ` : ''}
      
      ${posHandlungen.lokal?.length || ressourcenLokal.length ? `
        <div class="handlungen-kategorie offen">
          <div class="handlungen-header" onclick="this.parentElement.classList.toggle('offen')">
            <span class="handlungen-icon">📍</span>
            <span class="handlungen-titel">Vor Ort</span>
            <span class="handlungen-count">${posHandlungen.lokal?.length || 0}</span>
            <span class="handlungen-toggle">▼</span>
          </div>
          <div class="handlungen-liste">
            ${(posHandlungen.lokal || []).map(h => `<div class="handlung-item">• ${h}</div>`).join('')}
            ${renderRessourcenLinks(ressourcenLokal)}
          </div>
        </div>
      ` : ''}
      
      ${posHandlungen.vernetzt?.length || ressourcenVernetzt.length ? `
        <div class="handlungen-kategorie offen">
          <div class="handlungen-header" onclick="this.parentElement.classList.toggle('offen')">
            <span class="handlungen-icon">🤝</span>
            <span class="handlungen-titel">Vernetzung</span>
            <span class="handlungen-count">${posHandlungen.vernetzt?.length || 0}</span>
            <span class="handlungen-toggle">▼</span>
          </div>
          <div class="handlungen-liste">
            ${(posHandlungen.vernetzt || []).map(h => `<div class="handlung-item">• ${h}</div>`).join('')}
            ${renderRessourcenLinks(ressourcenVernetzt)}
          </div>
        </div>
      ` : ''}
      
      ${posHandlungen.global?.length || ressourcenGlobal.length ? `
        <div class="handlungen-kategorie offen">
          <div class="handlungen-header" onclick="this.parentElement.classList.toggle('offen')">
            <span class="handlungen-icon">🌍</span>
            <span class="handlungen-titel">Global</span>
            <span class="handlungen-count">${posHandlungen.global?.length || 0}</span>
            <span class="handlungen-toggle">▼</span>
          </div>
          <div class="handlungen-liste">
            ${(posHandlungen.global || []).map(h => `<div class="handlung-item">• ${h}</div>`).join('')}
            ${renderRessourcenLinks(ressourcenGlobal)}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Filtert Handlungen nach gewählter Position
function filterZimmerHandlungen(achse, pos) {
  const zimmerInfo = window.zimmerBeschreibungen?.[achse] || {};
  const handlungen = zimmerInfo.handlungen || {};
  const zimmer = window.hausStruktur?.flatMap(e => e.zimmer).find(z => z.achse === achse);
  
  // Update Handlungen-Container
  const container = document.getElementById('handlungen-container');
  if (container) {
    container.outerHTML = renderHandlungenFuerPosition(achse, handlungen, pos, zimmer);
  }
  
  // Markiere aktive Position im Spektrum
  document.querySelectorAll('.spektrum-pos-detail').forEach(el => {
    el.classList.remove('aktiv');
    if (pos && el.dataset.pos == pos) {
      el.classList.add('aktiv');
    }
  });
}

// Detail-Ansicht für einzelne Aufgabe
function zeigeAufgabeDetail(achse, kategorie, aufgabeName) {
  const aufgaben = window.aufgabenData?.[achse]?.[kategorie]?.ideen || [];
  const aufgabe = aufgaben.find(a => a.name === aufgabeName);
  
  if (!aufgabe) return;
  
  const kategorieIcons = { lokal: '📍', vernetzung: '🤝', theorie: '📚' };
  const kategorieTitel = { lokal: 'Vor Ort', vernetzung: 'Vernetzung', theorie: 'Theorie' };
  
  // Zusätzliche Infos je nach Aufgabe
  let extraHtml = '';
  
  if (aufgabe.zeitrahmen) {
    extraHtml += `<div class="aufgabe-meta"><span class="meta-icon">⏱️</span> ${aufgabe.zeitrahmen}</div>`;
  }
  if (aufgabe.ressourcen?.length) {
    extraHtml += `<div class="aufgabe-meta"><span class="meta-icon">🔗</span> ${aufgabe.ressourcen.join(', ')}</div>`;
  }
  if (aufgabe.kontakte?.length) {
    extraHtml += `<div class="aufgabe-meta"><span class="meta-icon">👥</span> ${aufgabe.kontakte.join(', ')}</div>`;
  }
  if (aufgabe.beispiele?.length) {
    extraHtml += `<div class="aufgabe-meta"><span class="meta-icon">💡</span> Beispiele: ${aufgabe.beispiele.join(', ')}</div>`;
  }
  if (aufgabe.texte?.length) {
    extraHtml += `
      <div class="aufgabe-texte">
        <span class="texte-label">📖 Leseempfehlungen:</span>
        <ul>
          ${aufgabe.texte.map(t => `
            <li>
              <strong>${t.titel}</strong>
              ${t.autor ? ` – ${t.autor}` : ''}
              ${t.jahr ? ` (${t.jahr})` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  if (aufgabe.schritte?.length) {
    extraHtml += `
      <div class="aufgabe-schritte">
        <span class="schritte-label">📋 Schritte:</span>
        <ol>
          ${aufgabe.schritte.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
    `;
  }
  
  const html = `
    <div class="aufgabe-detail-overlay" onclick="this.remove()">
      <div class="aufgabe-detail-popup" onclick="event.stopPropagation()">
        <button class="aufgabe-detail-close" onclick="this.parentElement.parentElement.remove()">×</button>
        
        <div class="aufgabe-detail-header">
          <span class="aufgabe-kategorie-badge">${kategorieIcons[kategorie]} ${kategorieTitel[kategorie]}</span>
          <h3>${aufgabe.name}</h3>
        </div>
        
        <p class="aufgabe-beschreibung">${aufgabe.beschreibung || ''}</p>
        
        ${extraHtml}
        
        <button class="aufgabe-zurueck-btn" onclick="this.closest('.aufgabe-detail-overlay').remove()">
          ← Zurück zum Zimmer
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
}

// ═══════════════════════════════════════════════════════════════
// MEIN SOZIALISMUS - Persönliche Definition
// ═══════════════════════════════════════════════════════════════

// Globaler State für die Definition
let meineSozialismusDefinition = {
  kern: [],      // Unverzichtbar
  wichtig: [],   // Gehört dazu
  relevant: [],  // Spielt eine Rolle
  eigeneTexte: {}, // Eigene Formulierungen pro Position
  freitext: ''   // Direkter Text
};

// ═══════════════════════════════════════════════════════════════
// MEIN PROFIL MODUS: Kombiniert Konfigurator + Empfehlungen + Definition
// ═══════════════════════════════════════════════════════════════

function renderMeinProfilModus(profil, archetyp) {
  const hatProfil = Object.keys(profil).length > 0;
  const achsenMeta = window.achsenMeta;
  
  let html = `<div class="mein-profil-container">`;
  
  // ═══════════════════════════════════════════════════════════════
  // SEKTION 1: Profil-Übersicht / Achsen-Auswahl
  // ═══════════════════════════════════════════════════════════════
  
  if (hatProfil) {
    // Kompakte Profil-Anzeige mit Bearbeiten-Option
    html += `
      <div class="profil-header-card">
        <div class="profil-header-top">
          <div class="profil-icon">🎯</div>
          <div class="profil-info">
            <h3>Dein Profil</h3>
            ${archetyp ? `<span class="profil-archetyp">${archetyp}</span>` : ''}
          </div>
          <button class="profil-edit-btn" onclick="toggleProfilEditor()">✏️ Bearbeiten</button>
        </div>
        
        <div class="profil-kompakt" id="profil-kompakt">
          ${renderProfilKompakt(profil)}
        </div>
        
        <div class="profil-editor hidden" id="profil-editor">
          ${renderProfilEditor(profil)}
        </div>
        
        <div class="profil-actions">
          <button class="profil-action-btn" onclick="generiereProfilUrl()">🔗 Meine URL</button>
          <button class="profil-action-btn secondary" onclick="window.open('../?layer=2', '_blank')">🎲 Im Generator öffnen</button>
        </div>
      </div>
    `;
  } else {
    // Kein Profil: Einladung zum Ausfüllen
    html += `
      <div class="profil-header-card leer">
        <div class="profil-leer-content">
          <div class="profil-leer-icon">🎯</div>
          <h3>Wo stehst du?</h3>
          <p>Erstelle dein persönliches Profil, um passende Empfehlungen zu erhalten und deinen Platz im Haus zu finden.</p>
          <div class="profil-start-options">
            <button type="button" class="profil-start-btn primary" onclick="document.getElementById('profil-editor').classList.toggle('hidden');">
              🎛️ Schnell-Profil erstellen
            </button>
            <a href="../?layer=2" class="profil-start-btn secondary">
              🎲 Ausführlich im Generator
            </a>
          </div>
        </div>
        
        <div class="profil-editor hidden" id="profil-editor">
          ${renderProfilEditor(profil)}
        </div>
      </div>
    `;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // SEKTION 2: Hier wirst du gebraucht (wenn Profil vorhanden)
  // TODO: Später für Social-Media-Features reaktivieren
  // ═══════════════════════════════════════════════════════════════
  
  // if (hatProfil) {
  //   html += renderDeinPlatz(profil, archetyp);
  // }
  
  html += `</div>`; // Ende mein-profil-container
  
  return html;
}

// ═══════════════════════════════════════════════════════════════
// MEIN SOZIALISMUS MODUS - Eigener Tab
// ═══════════════════════════════════════════════════════════════

function renderMeinSozialismusModus(profil) {
  const hatProfil = Object.keys(profil).length > 0;
  
  // Lade gespeicherte Definition aus localStorage
  const gespeichert = localStorage.getItem('meinSozialismus');
  if (gespeichert) {
    try {
      meineSozialismusDefinition = JSON.parse(gespeichert);
    } catch(e) {}
  }
  
  // Wenn noch keine Definition aber Profil vorhanden: initialisiere aus Profil
  if (meineSozialismusDefinition.kern.length === 0 && 
      meineSozialismusDefinition.wichtig.length === 0 && 
      meineSozialismusDefinition.relevant.length === 0 && hatProfil) {
    initDefinitionAusProfil(profil);
  }
  
  const hatItems = meineSozialismusDefinition.kern.length > 0 || 
                   meineSozialismusDefinition.wichtig.length > 0 || 
                   meineSozialismusDefinition.relevant.length > 0;
  
  let html = `
    <div class="mein-sozialismus-container">
      <div class="ms-header">
        <h2>🔴 Mein Sozialismus</h2>
        <p>Definiere, was Sozialismus für dich bedeutet. Sortiere, gewichte und formuliere in deinen eigenen Worten.</p>
      </div>
      
      ${!hatItems && hatProfil ? `
        <div class="ms-quickstart-gross">
          <p>Du hast <strong>${Object.keys(profil).length} Positionen</strong> in deinem Profil gewählt.</p>
          <button type="button" class="ms-quickstart-btn-gross" onclick="uebernehmeProfil()">
            ⚡ Positionen aus Profil übernehmen
          </button>
        </div>
      ` : ''}
      
      ${!hatItems && !hatProfil ? `
        <div class="ms-empty-gross">
          <div class="ms-empty-icon">📝</div>
          <p>Erstelle zuerst ein <a href="#" onclick="renderHaus('profil'); return false;">Profil</a>, oder füge manuell Positionen hinzu.</p>
        </div>
      ` : ''}
      
      <div class="ms-main-grid">
        <!-- Linke Seite: Kategorien -->
        <div class="ms-kategorien-seite">
          <div class="ms-kat-gross" data-kategorie="kern">
            <div class="ms-kat-header-gross">
              <span class="ms-kat-icon-gross">🔥</span>
              <div>
                <h4>Unverzichtbar</h4>
                <span>Das ist der Kern meines Sozialismus</span>
              </div>
              <span class="ms-kat-count-gross">${meineSozialismusDefinition.kern.length}</span>
            </div>
            <div class="ms-dropzone-gross" data-kategorie="kern">
              ${renderDefinitionItemsGross('kern')}
            </div>
          </div>
          
          <div class="ms-kat-gross" data-kategorie="wichtig">
            <div class="ms-kat-header-gross">
              <span class="ms-kat-icon-gross">💡</span>
              <div>
                <h4>Wichtig</h4>
                <span>Gehört für mich dazu</span>
              </div>
              <span class="ms-kat-count-gross">${meineSozialismusDefinition.wichtig.length}</span>
            </div>
            <div class="ms-dropzone-gross" data-kategorie="wichtig">
              ${renderDefinitionItemsGross('wichtig')}
            </div>
          </div>
          
          <div class="ms-kat-gross" data-kategorie="relevant">
            <div class="ms-kat-header-gross">
              <span class="ms-kat-icon-gross">📎</span>
              <div>
                <h4>Auch relevant</h4>
                <span>Spielt eine Rolle</span>
              </div>
              <span class="ms-kat-count-gross">${meineSozialismusDefinition.relevant.length}</span>
            </div>
            <div class="ms-dropzone-gross" data-kategorie="relevant">
              ${renderDefinitionItemsGross('relevant')}
            </div>
          </div>
          
          <div class="ms-add-buttons">
            <button type="button" class="ms-add-btn-gross" onclick="zeigePositionAuswahl()">
              ➕ Position hinzufügen
            </button>
            <button type="button" class="ms-add-btn-gross secondary" onclick="zeigeEigenenPunktDialog()">
              ✏️ Eigener Punkt
            </button>
          </div>
        </div>
        
        <!-- Rechte Seite: Vorschau & Export -->
        <div class="ms-vorschau-seite">
          <div class="ms-vorschau-gross">
            <div class="ms-vorschau-header-gross">
              <h4>📜 Deine Definition</h4>
              <button type="button" class="ms-edit-btn" onclick="toggleFreitextEditor()">✏️ Bearbeiten</button>
            </div>
            <div class="ms-vorschau-content" id="ms-vorschau-text">
              ${generiereDefinitionsText()}
            </div>
            <div class="ms-freitext-editor" id="ms-freitext-editor" style="display:none;">
              <textarea id="ms-freitext-textarea" placeholder="Schreibe deine Definition in eigenen Worten...">${meineSozialismusDefinition.freitext || ''}</textarea>
              <div class="ms-freitext-buttons">
                <button type="button" class="ms-btn-gross primary" onclick="speichereFreitext()">✓ Übernehmen</button>
                <button type="button" class="ms-btn-gross" onclick="toggleFreitextEditor()">Abbrechen</button>
              </div>
            </div>
          </div>
          
          ${hatItems ? `
            <div class="ms-export-gross">
              <h4>📤 Teilen & Exportieren</h4>
              <div class="ms-export-buttons">
                <button type="button" class="ms-export-btn-gross" onclick="exportAlsBild()">🖼️ Als Bild</button>
                <button type="button" class="ms-export-btn-gross" onclick="exportAlsTxt()">📄 Als TXT</button>
                <button type="button" class="ms-export-btn-gross" onclick="kopiereDefinition()">📋 Text kopieren</button>
                <button type="button" class="ms-export-btn-gross" onclick="zeigeShareDialog()">📤 Teilen</button>
              </div>
            </div>
            
            <div class="ms-actions-gross">
              <button type="button" class="ms-reset-btn" onclick="resetDefinition()">🗑️ Zurücksetzen</button>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  return html;
}

// Items für großen Modus rendern
function renderDefinitionItemsGross(kategorie) {
  const items = meineSozialismusDefinition[kategorie] || [];
  const eigeneTexte = meineSozialismusDefinition.eigeneTexte || {};
  
  if (items.length === 0) {
    return '<div class="ms-dropzone-leer-gross">Ziehe Positionen hierher oder klicke "Position hinzufügen"</div>';
  }
  
  return items.map((item, index) => `
    <div class="ms-item-gross" data-id="${item.id}" data-kategorie="${kategorie}">
      <div class="ms-item-content-gross">
        <span class="ms-item-label-gross">${eigeneTexte[item.id] ? `"${eigeneTexte[item.id]}"` : item.label}</span>
        <span class="ms-item-zimmer-gross">${item.zimmer || ''}</span>
      </div>
      <div class="ms-item-btns-gross">
        <button type="button" onclick="bewegeItemHoch('${item.id}', '${kategorie}')" title="Wichtiger">▲</button>
        <button type="button" onclick="bewegeItemRunter('${item.id}', '${kategorie}')" title="Weniger wichtig">▼</button>
        <button type="button" onclick="bearbeitePosition('${item.id}')" title="Eigene Formulierung">✏️</button>
        <button type="button" onclick="entfernePosition('${item.id}', '${kategorie}')" title="Entfernen">×</button>
      </div>
    </div>
  `).join('');
}

// Kompakte Darstellung des Profils (nur ausgefüllte Achsen)
function renderProfilKompakt(profil) {
  const achsen = Object.entries(profil);
  if (achsen.length === 0) return '<p class="profil-leer-text">Noch keine Positionen gewählt</p>';
  
  let html = '<div class="profil-chips">';
  achsen.forEach(([achse, wert]) => {
    const meta = window.achsenMeta[achse];
    const polName = meta?.pole[wert - 1] || wert;
    html += `<span class="profil-chip" onclick="showKnoten('${achse}-${wert}')">${achse}: ${polName}</span>`;
  });
  html += '</div>';
  return html;
}

// Editor für Profil-Bearbeitung (verbessert mit Beschreibungen)
function renderProfilEditor(profil) {
  const achsenMeta = window.achsenMeta || {};
  const achsenListe = Object.entries(achsenMeta).map(([id, meta]) => ({
    id,
    name: meta.kurzname || meta.name || id,
    pole: meta.pole || ['1','2','3','4','5']
  })).sort((a, b) => a.id.localeCompare(b.id));
  
  if (achsenListe.length === 0) {
    return `<p style="color: #888; padding: 1rem;">Lade Achsen-Daten...</p>`;
  }
  
  const links = achsenListe.slice(0, 13);
  const rechts = achsenListe.slice(13);
  const anzahl = Object.keys(profil).length;
  
  let html = `
    <div class="spe-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;padding-bottom:0.5rem;border-bottom:1px solid #333;">
      <span style="font-size:0.85rem;color:#999;">🎛️ Schnell-Profil</span>
      <span id="spe-counter" style="font-size:0.7rem;color:#666;background:#1a1a1a;padding:0.2rem 0.5rem;border-radius:10px;">${anzahl}/26 gewählt</span>
    </div>
    <div class="spe-grid">
      <div class="spe-column">${renderSpeColumn(links, profil)}</div>
      <div class="spe-column">${renderSpeColumn(rechts, profil)}</div>
    </div>
    <div class="spe-footer" style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid #333;">
      <button type="button" onclick="speichereProfilUndRender()" style="padding:0.4rem 0.8rem;background:#C62828;border:none;color:#fff;font-size:0.75rem;border-radius:6px;cursor:pointer;">✓ Speichern</button>
      <button type="button" onclick="toggleProfilEditor()" style="padding:0.4rem 0.8rem;background:#2a2a2a;border:1px solid #444;color:#ccc;font-size:0.75rem;border-radius:6px;cursor:pointer;">✕ Schließen</button>
      <button type="button" onclick="resetProfil()" style="padding:0.4rem 0.8rem;background:#2a2a2a;border:1px solid #444;color:#ccc;font-size:0.75rem;border-radius:6px;cursor:pointer;">🗑️ Reset</button>
    </div>
  `;
  return html;
}

function renderSpeColumn(achsen, profil) {
  return achsen.map(achse => {
    const wert = profil[achse.id] || 0;
    const pole = achse.pole || ['1','2','3','4','5'];
    const btns = [1,2,3,4,5].map(n => {
      const label = (pole[n-1] || n).toString().substring(0, 9);
      const sel = wert === n;
      const style = sel 
        ? 'flex:1;padding:0.35rem 0.1rem;background:#C62828;border:1px solid #C62828;color:#fff;font-size:0.6rem;border-radius:4px;cursor:pointer;text-align:center;'
        : 'flex:1;padding:0.35rem 0.1rem;background:#1e1e2e;border:1px solid #333;color:#777;font-size:0.6rem;border-radius:4px;cursor:pointer;text-align:center;';
      return `<button type="button" class="spe-btn ${sel ? 'sel' : ''}" data-achse="${achse.id}" data-pos="${n}" onclick="updateProfilPosition('${achse.id}', ${n})" style="${style}" title="${pole[n-1] || n}">${label}</button>`;
    }).join('');
    
    const rowBg = wert > 0 ? 'background:rgba(198,40,40,0.08);' : '';
    return `
      <div class="spe-row" data-achse="${achse.id}" style="padding:0.4rem 0.5rem;border-radius:5px;margin-bottom:0.35rem;${rowBg}">
        <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.3rem;">
          <span style="font-size:0.55rem;color:#555;background:#111;padding:0.1rem 0.3rem;border-radius:3px;font-weight:600;">${achse.id}</span>
          <span style="font-size:0.75rem;color:#aaa;">${achse.name}</span>
        </div>
        <div style="display:flex;gap:3px;">${btns}</div>
      </div>
    `;
  }).join('');
}

// Profil zurücksetzen
function resetProfil() {
  if (confirm('Wirklich alle Positionen löschen?')) {
    konfigAuswahl = {};
    generatorProfil = {};
    renderHaus('profil');
  }
}

// Toggle für Profil-Editor
function toggleProfilEditor() {
  const kompakt = document.getElementById('profil-kompakt');
  const editor = document.getElementById('profil-editor');
  
  if (kompakt) kompakt.classList.toggle('hidden');
  if (editor) editor.classList.toggle('hidden');
}

// Position im Profil aktualisieren
function updateProfilPosition(achse, pos) {
  if (!konfigAuswahl) konfigAuswahl = {};
  konfigAuswahl[achse] = pos;
  
  if (generatorProfil) {
    generatorProfil[achse] = pos;
  }
  
  // Update alle Buttons in dieser Achse
  document.querySelectorAll(`.spe-btn[data-achse="${achse}"]`).forEach(btn => {
    const btnPos = parseInt(btn.dataset.pos);
    if (btnPos === pos) {
      btn.style.background = '#C62828';
      btn.style.borderColor = '#C62828';
      btn.style.color = '#fff';
      btn.classList.add('sel');
    } else {
      btn.style.background = '#1e1e2e';
      btn.style.borderColor = '#333';
      btn.style.color = '#777';
      btn.classList.remove('sel');
    }
  });
  
  // Update Row Background
  document.querySelectorAll(`.spe-row[data-achse="${achse}"]`).forEach(row => {
    row.style.background = 'rgba(198,40,40,0.08)';
  });
  
  // Counter aktualisieren
  const counter = document.getElementById('spe-counter');
  if (counter) {
    counter.textContent = `${Object.keys(konfigAuswahl).length}/26 gewählt`;
  }
}

// Profil speichern und Ansicht neu rendern
function speichereProfilUndRender() {
  // konfigAuswahl ist bereits aktualisiert
  generatorProfil = { ...konfigAuswahl };
  renderHaus('profil');
}

// URL mit Profil generieren
function generiereProfilUrl() {
  const profil = generatorProfil || konfigAuswahl || {};
  if (Object.keys(profil).length === 0) {
    alert('Erstelle zuerst ein Profil!');
    return;
  }
  
  // Profil zu URL-Parameter konvertieren
  const profilString = Object.entries(profil)
    .map(([achse, wert]) => `${achse}:${wert}`)
    .join(',');
  
  const baseUrl = window.location.origin + window.location.pathname;
  const url = `${baseUrl}?profil=${profilString}`;
  
  // Kopieren und Feedback
  navigator.clipboard.writeText(url).then(() => {
    alert('✓ URL kopiert!\n\nDiese URL enthält dein komplettes Profil. Speichere sie als Lesezeichen oder teile sie.');
  }).catch(() => {
    prompt('Kopiere diese URL:', url);
  });
}

// Interne Version von renderMeinSozialismus - vollständig und kompakt
function renderMeinSozialismusIntern(profil) {
  const hatProfil = Object.keys(profil).length > 0;
  
  // Lade gespeicherte Definition aus localStorage
  const gespeichert = localStorage.getItem('meinSozialismus');
  if (gespeichert) {
    try {
      meineSozialismusDefinition = JSON.parse(gespeichert);
    } catch(e) {}
  }
  
  // Wenn noch keine Definition aber Profil vorhanden: initialisiere aus Profil
  if (meineSozialismusDefinition.kern.length === 0 && 
      meineSozialismusDefinition.wichtig.length === 0 && 
      meineSozialismusDefinition.relevant.length === 0 && hatProfil) {
    initDefinitionAusProfil(profil);
  }
  
  const hatItems = meineSozialismusDefinition.kern.length > 0 || 
                   meineSozialismusDefinition.wichtig.length > 0 || 
                   meineSozialismusDefinition.relevant.length > 0;
  
  let html = `
    <div class="ms-section kompakt">
      <div class="ms-section-header">
        <h3>🔴 Mein Sozialismus</h3>
        ${hatItems ? '' : '<p>Definiere, was Sozialismus für dich bedeutet</p>'}
      </div>
      
      ${!hatItems && hatProfil ? `
        <div class="ms-quickstart">
          <p>Du hast ${Object.keys(profil).length} Positionen in deinem Profil.</p>
          <button type="button" class="ms-quickstart-btn" onclick="uebernehmeProfil()">
            ⚡ Aus Profil übernehmen
          </button>
        </div>
      ` : ''}
      
      ${!hatItems && !hatProfil ? `
        <div class="ms-empty-hint">
          <p>Erstelle zuerst ein Profil oben, oder füge manuell Positionen hinzu.</p>
        </div>
      ` : ''}
      
      <div class="ms-editor kompakt">
        <div class="ms-kategorien-kompakt">
          
          <!-- KERN -->
          <div class="ms-kat-kompakt" data-kategorie="kern">
            <div class="ms-kat-header-kompakt">
              <span class="ms-kat-icon">🔥</span>
              <span class="ms-kat-titel">Unverzichtbar</span>
              <span class="ms-kat-count">${meineSozialismusDefinition.kern.length}</span>
            </div>
            <div class="ms-dropzone-kompakt" data-kategorie="kern">
              ${renderDefinitionItemsKompakt('kern')}
            </div>
          </div>
          
          <!-- WICHTIG -->
          <div class="ms-kat-kompakt" data-kategorie="wichtig">
            <div class="ms-kat-header-kompakt">
              <span class="ms-kat-icon">💡</span>
              <span class="ms-kat-titel">Wichtig</span>
              <span class="ms-kat-count">${meineSozialismusDefinition.wichtig.length}</span>
            </div>
            <div class="ms-dropzone-kompakt" data-kategorie="wichtig">
              ${renderDefinitionItemsKompakt('wichtig')}
            </div>
          </div>
          
          <!-- RELEVANT -->
          <div class="ms-kat-kompakt" data-kategorie="relevant">
            <div class="ms-kat-header-kompakt">
              <span class="ms-kat-icon">📎</span>
              <span class="ms-kat-titel">Relevant</span>
              <span class="ms-kat-count">${meineSozialismusDefinition.relevant.length}</span>
            </div>
            <div class="ms-dropzone-kompakt" data-kategorie="relevant">
              ${renderDefinitionItemsKompakt('relevant')}
            </div>
          </div>
          
        </div>
        
        <!-- Kompakte Buttons -->
        <div class="ms-actions-kompakt">
          <button type="button" class="ms-btn-sm" onclick="zeigePositionAuswahl()" title="Position hinzufügen">➕</button>
          <button type="button" class="ms-btn-sm" onclick="zeigeEigenenPunktDialog()" title="Eigener Punkt">✏️</button>
          ${hatItems ? `<button type="button" class="ms-btn-sm" onclick="resetDefinition()" title="Zurücksetzen">🗑️</button>` : ''}
        </div>
      </div>
      
      ${hatItems ? `
        <!-- Live-Vorschau -->
        <div class="ms-vorschau-kompakt">
          <div class="ms-vorschau-header-kompakt">
            <span>📜 Deine Definition</span>
            <button type="button" class="ms-btn-sm" onclick="toggleFreitextEditor()" title="Bearbeiten">✏️</button>
          </div>
          <div class="ms-vorschau-text-kompakt" id="ms-vorschau-text">
            ${generiereDefinitionsText()}
          </div>
          <div class="ms-freitext-editor" id="ms-freitext-editor" style="display:none;">
            <textarea id="ms-freitext-textarea" placeholder="Schreibe deine Definition in eigenen Worten...">${meineSozialismusDefinition.freitext || ''}</textarea>
            <button type="button" class="ms-btn-sm primary" onclick="speichereFreitext()">✓</button>
          </div>
        </div>
        
        <!-- Export-Buttons -->
        <div class="ms-export-kompakt">
          <button type="button" class="ms-export-btn" onclick="exportAlsBild()" title="Als Bild speichern">🖼️ Bild</button>
          <button type="button" class="ms-export-btn" onclick="kopiereDefinition()" title="Text kopieren">📋 Text</button>
          <button type="button" class="ms-export-btn" onclick="zeigeShareDialog()" title="Teilen">📤 Teilen</button>
        </div>
      ` : ''}
    </div>
  `;
  
  return html;
}

// Kompakte Items rendern
function renderDefinitionItemsKompakt(kategorie) {
  const items = meineSozialismusDefinition[kategorie] || [];
  
  if (items.length === 0) {
    return '<div class="ms-dropzone-leer">—</div>';
  }
  
  return items.map((item, index) => `
    <div class="ms-item-kompakt" data-id="${item.id}" data-kategorie="${kategorie}">
      <span class="ms-item-label-kompakt" title="${item.zimmer}: ${item.label}">${item.label}</span>
      <div class="ms-item-btns">
        <button type="button" class="ms-item-btn" onclick="bewegeItemHoch('${item.id}', '${kategorie}')" title="Wichtiger">▲</button>
        <button type="button" class="ms-item-btn" onclick="bewegeItemRunter('${item.id}', '${kategorie}')" title="Weniger wichtig">▼</button>
        <button type="button" class="ms-item-btn" onclick="bearbeitePosition('${item.id}')" title="Bearbeiten">✏️</button>
        <button type="button" class="ms-item-btn" onclick="entfernePosition('${item.id}', '${kategorie}')" title="Entfernen">×</button>
      </div>
    </div>
  `).join('');
}

// Item nach oben bewegen (wichtiger machen)
function bewegeItemHoch(id, kategorie) {
  const kategorien = ['kern', 'wichtig', 'relevant'];
  const idx = kategorien.indexOf(kategorie);
  if (idx <= 0) return; // Schon in höchster Kategorie
  
  const item = meineSozialismusDefinition[kategorie].find(i => i.id === id);
  if (!item) return;
  
  meineSozialismusDefinition[kategorie] = meineSozialismusDefinition[kategorie].filter(i => i.id !== id);
  meineSozialismusDefinition[kategorien[idx - 1]].push(item);
  
  speichereDefinitionLokal();
  renderHaus('definition', true);
}

// Item nach unten bewegen (weniger wichtig machen)
function bewegeItemRunter(id, kategorie) {
  const kategorien = ['kern', 'wichtig', 'relevant'];
  const idx = kategorien.indexOf(kategorie);
  if (idx >= kategorien.length - 1) return; // Schon in niedrigster Kategorie
  
  const item = meineSozialismusDefinition[kategorie].find(i => i.id === id);
  if (!item) return;
  
  meineSozialismusDefinition[kategorie] = meineSozialismusDefinition[kategorie].filter(i => i.id !== id);
  meineSozialismusDefinition[kategorien[idx + 1]].push(item);
  
  speichereDefinitionLokal();
  renderHaus('definition', true);
}

// Profil übernehmen
function uebernehmeProfil() {
  const profil = generatorProfil || konfigAuswahl || {};
  if (Object.keys(profil).length === 0) {
    alert('Kein Profil vorhanden!');
    return;
  }
  initDefinitionAusProfil(profil);
  speichereDefinitionLokal();
  renderHaus('definition');
}

// Share-Dialog
function zeigeShareDialog() {
  const text = getDefinitionPlainText();
  const url = window.location.href;
  
  const html = `
    <div class="ms-share-overlay" onclick="this.remove()">
      <div class="ms-share-popup" onclick="event.stopPropagation()">
        <button type="button" class="ms-popup-close" onclick="this.parentElement.parentElement.remove()">×</button>
        <h4>📤 Definition teilen</h4>
        
        <div class="ms-share-buttons">
          <a href="https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}" target="_blank" class="ms-share-btn facebook">
            <span>📘</span> Facebook
          </a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" class="ms-share-btn linkedin">
            <span>💼</span> LinkedIn
          </a>
          <a href="https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}" target="_blank" class="ms-share-btn whatsapp">
            <span>💬</span> WhatsApp
          </a>
          <a href="https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}" target="_blank" class="ms-share-btn telegram">
            <span>✈️</span> Telegram
          </a>
          <a href="https://social.bund.de/share?text=${encodeURIComponent(text)}" target="_blank" class="ms-share-btn mastodon">
            <span>🐘</span> Mastodon
          </a>
          <a href="mailto:?subject=${encodeURIComponent('Mein Sozialismus')}&body=${encodeURIComponent(text + '\n\n' + url)}" class="ms-share-btn email">
            <span>✉️</span> E-Mail
          </a>
        </div>
        
        <div class="ms-share-copy">
          <textarea readonly id="ms-share-text">${text}</textarea>
          <button type="button" onclick="navigator.clipboard.writeText(document.getElementById('ms-share-text').value); this.textContent='✓ Kopiert!'">📋 Kopieren</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
}

// Plaintext für Share
function getDefinitionPlainText() {
  const { kern, wichtig, relevant, freitext, eigeneTexte } = meineSozialismusDefinition;
  const sb = window.satzbausteine;
  
  if (freitext && freitext.trim()) {
    return freitext + '\n\n#MeinSozialismus #LinkesWesen';
  }
  
  let text = '🔴 MEIN SOZIALISMUS\n\n';
  
  // Nutze Satzbausteine wenn verfügbar
  const getSatz = (item) => {
    if (eigeneTexte[item.id]) return eigeneTexte[item.id];
    if (sb?.positionen?.[item.id]?.satz) return sb.positionen[item.id].satz;
    return item.label || 'unbekannt';
  };
  
  const getKurz = (item) => {
    if (eigeneTexte[item.id]) return eigeneTexte[item.id];
    if (sb?.positionen?.[item.id]?.kurzform) return sb.positionen[item.id].kurzform;
    return item.label || 'unbekannt';
  };
  
  if (kern.length > 0) {
    text += '🔥 Unverzichtbar:\n';
    kern.forEach(k => {
      text += `• ${getSatz(k)}\n`;
    });
    text += '\n';
  }
  
  if (wichtig.length > 0) {
    text += '💡 Wichtig:\n';
    wichtig.forEach(w => {
      text += `• ${getSatz(w)}\n`;
    });
    text += '\n';
  }
  
  if (relevant.length > 0) {
    text += '📎 Auch relevant: ';
    text += relevant.map(r => getKurz(r)).join(', ');
    text += '\n\n';
  }
  
  text += '#MeinSozialismus #LinkesWesen';
  
  return text;
}

// Als Bild exportieren
function exportAlsBild() {
  const vorschau = document.getElementById('ms-vorschau-text');
  if (!vorschau) {
    alert('Keine Definition zum Exportieren!');
    return;
  }
  
  // Erstelle Canvas für Bild
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const width = 800;
  const padding = 40;
  const lineHeight = 28;
  const maxLineWidth = width - padding * 2;
  
  // Helper für Satzbausteine
  const sb = window.satzbausteine;
  const { kern, wichtig, relevant, freitext, eigeneTexte } = meineSozialismusDefinition;
  
  const getSatz = (item) => {
    if (eigeneTexte[item.id]) return eigeneTexte[item.id];
    if (sb?.positionen?.[item.id]?.satz) return sb.positionen[item.id].satz;
    return item.label || 'unbekannt';
  };
  
  const getKurz = (item) => {
    if (eigeneTexte[item.id]) return eigeneTexte[item.id];
    if (sb?.positionen?.[item.id]?.kurzform) return sb.positionen[item.id].kurzform;
    return item.label || 'unbekannt';
  };
  
  // Text vorbereiten
  let lines = [];
  
  lines.push({ text: '🔴 MEIN SOZIALISMUS', style: 'title' });
  lines.push({ text: '', style: 'space' });
  
  if (freitext && freitext.trim()) {
    const freitextLines = freitext.split('\n');
    freitextLines.forEach(l => lines.push({ text: l, style: 'body' }));
  } else {
    if (kern.length > 0) {
      lines.push({ text: '🔥 Unverzichtbar:', style: 'category' });
      kern.forEach(k => lines.push({ text: '   • ' + getSatz(k), style: 'item' }));
      lines.push({ text: '', style: 'space' });
    }
    if (wichtig.length > 0) {
      lines.push({ text: '💡 Wichtig:', style: 'category' });
      wichtig.forEach(w => lines.push({ text: '   • ' + getSatz(w), style: 'item' }));
      lines.push({ text: '', style: 'space' });
    }
    if (relevant.length > 0) {
      lines.push({ text: '📎 Auch relevant:', style: 'category' });
      const relevantText = relevant.map(r => getKurz(r)).join(', ');
      lines.push({ text: '   ' + relevantText, style: 'item' });
    }
  }
  
  lines.push({ text: '', style: 'space' });
  lines.push({ text: 'linkes-wesen.de', style: 'footer' });
  
  // Canvas-Größe berechnen
  const height = padding * 2 + lines.length * lineHeight + 20;
  canvas.width = width;
  canvas.height = height;
  
  // Hintergrund
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);
  
  // Roter Akzent
  ctx.fillStyle = '#E53935';
  ctx.fillRect(0, 0, 6, height);
  
  // Text rendern
  let y = padding;
  lines.forEach(line => {
    if (line.style === 'space') {
      y += lineHeight * 0.5;
      return;
    }
    
    if (line.style === 'title') {
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
    } else if (line.style === 'category') {
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillStyle = '#E53935';
    } else if (line.style === 'item') {
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillStyle = '#cccccc';
    } else if (line.style === 'footer') {
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillStyle = '#666666';
    } else {
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillStyle = '#cccccc';
    }
    
    ctx.fillText(line.text, padding, y);
    y += lineHeight;
  });
  
  // Download
  const link = document.createElement('a');
  link.download = 'mein-sozialismus.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Als TXT exportieren (Download)
function exportAlsTxt() {
  const { kern, wichtig, relevant, freitext, eigeneTexte } = meineSozialismusDefinition;
  
  // Prüfe ob es etwas zu exportieren gibt
  if (kern.length === 0 && wichtig.length === 0 && relevant.length === 0 && !freitext) {
    alert('Keine Definition zum Exportieren!');
    return;
  }
  
  const sb = window.satzbausteine;
  
  const getSatz = (item) => {
    if (eigeneTexte[item.id]) return eigeneTexte[item.id];
    if (sb?.positionen?.[item.id]?.satz) return sb.positionen[item.id].satz;
    return item.label || 'unbekannt';
  };
  
  const getKurz = (item) => {
    if (eigeneTexte[item.id]) return eigeneTexte[item.id];
    if (sb?.positionen?.[item.id]?.kurzform) return sb.positionen[item.id].kurzform;
    return item.label || 'unbekannt';
  };
  
  // Text generieren
  let text = '══════════════════════════════════════════\n';
  text += '           🔴 MEIN SOZIALISMUS\n';
  text += '══════════════════════════════════════════\n\n';
  
  // Wenn Freitext vorhanden, diesen verwenden
  if (freitext && freitext.trim()) {
    text += freitext.trim() + '\n\n';
  } else {
    // Sonst strukturierte Version
    if (kern.length > 0) {
      text += '🔥 UNVERZICHTBAR\n';
      text += '──────────────────────────────────────────\n';
      kern.forEach(k => {
        text += `• ${getSatz(k)}\n`;
      });
      text += '\n';
    }
    
    if (wichtig.length > 0) {
      text += '💡 WICHTIG\n';
      text += '──────────────────────────────────────────\n';
      wichtig.forEach(w => {
        text += `• ${getSatz(w)}\n`;
      });
      text += '\n';
    }
    
    if (relevant.length > 0) {
      text += '📎 AUCH RELEVANT\n';
      text += '──────────────────────────────────────────\n';
      text += relevant.map(r => getKurz(r)).join(', ') + '\n\n';
    }
  }
  
  text += '──────────────────────────────────────────\n';
  text += 'Erstellt mit: Das Linke Wesen\n';
  text += 'linkes-wesen.de\n';
  text += '#MeinSozialismus #LinkesWesen\n';
  
  // Als Datei herunterladen
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mein-sozialismus.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderMeinSozialismus(profil) {
  const hatProfil = Object.keys(profil).length > 0;
  const achsenMeta = window.achsenMeta;
  
  // Lade gespeicherte Definition aus localStorage
  const gespeichert = localStorage.getItem('meinSozialismus');
  if (gespeichert) {
    try {
      meineSozialismusDefinition = JSON.parse(gespeichert);
    } catch(e) {}
  }
  
  // Wenn noch keine Definition aber Profil vorhanden: initialisiere aus Profil
  if (meineSozialismusDefinition.kern.length === 0 && hatProfil) {
    initDefinitionAusProfil(profil);
  }
  
  let html = `
    <div class="mein-sozialismus-container">
      <div class="ms-intro">
        <h3>🔴 Definiere deinen Sozialismus</h3>
        <p>Was bedeutet Sozialismus für dich? Gewichte deine Positionen, formuliere sie in deinen Worten, 
           füge eigene Punkte hinzu. Am Ende steht deine ganz persönliche Definition.</p>
      </div>
      
      <div class="ms-editor">
        <div class="ms-kategorien">
          
          <!-- KERN -->
          <div class="ms-kategorie" data-kategorie="kern">
            <div class="ms-kategorie-header">
              <span class="ms-kategorie-icon">🔥</span>
              <div>
                <h4>Unverzichtbar</h4>
                <span class="ms-kategorie-info">Das ist der Kern meines Sozialismus</span>
              </div>
            </div>
            <div class="ms-dropzone" data-kategorie="kern">
              ${renderDefinitionItems('kern')}
              <div class="ms-dropzone-hint">Ziehe Positionen hierher</div>
            </div>
          </div>
          
          <!-- WICHTIG -->
          <div class="ms-kategorie" data-kategorie="wichtig">
            <div class="ms-kategorie-header">
              <span class="ms-kategorie-icon">💡</span>
              <div>
                <h4>Wichtig</h4>
                <span class="ms-kategorie-info">Gehört für mich dazu</span>
              </div>
            </div>
            <div class="ms-dropzone" data-kategorie="wichtig">
              ${renderDefinitionItems('wichtig')}
              <div class="ms-dropzone-hint">Ziehe Positionen hierher</div>
            </div>
          </div>
          
          <!-- RELEVANT -->
          <div class="ms-kategorie" data-kategorie="relevant">
            <div class="ms-kategorie-header">
              <span class="ms-kategorie-icon">📎</span>
              <div>
                <h4>Auch relevant</h4>
                <span class="ms-kategorie-info">Spielt eine Rolle</span>
              </div>
            </div>
            <div class="ms-dropzone" data-kategorie="relevant">
              ${renderDefinitionItems('relevant')}
              <div class="ms-dropzone-hint">Ziehe Positionen hierher</div>
            </div>
          </div>
          
        </div>
        
        <!-- Hinzufügen -->
        <div class="ms-hinzufuegen">
          <button class="ms-add-btn" onclick="zeigePositionAuswahl()">
            ➕ Position aus dem Wesen hinzufügen
          </button>
          <button class="ms-add-custom-btn" onclick="zeigeEigenenPunktDialog()">
            ✏️ Eigenen Punkt hinzufügen
          </button>
        </div>
      </div>
      
      <!-- Live-Vorschau der Definition -->
      <div class="ms-vorschau">
        <div class="ms-vorschau-header">
          <h4>📜 Deine Definition</h4>
          <button class="ms-edit-text-btn" onclick="toggleFreitextEditor()">✏️ Direkt bearbeiten</button>
        </div>
        <div class="ms-vorschau-text" id="ms-vorschau-text">
          ${generiereDefinitionsText()}
        </div>
        <div class="ms-freitext-editor" id="ms-freitext-editor" style="display:none;">
          <textarea id="ms-freitext-textarea" placeholder="Schreibe deine Definition in eigenen Worten...">${meineSozialismusDefinition.freitext || ''}</textarea>
          <button class="ms-save-freitext" onclick="speichereFreitext()">Übernehmen</button>
        </div>
      </div>
      
      <!-- Aktionen -->
      <div class="ms-aktionen">
        <button class="ms-btn-primary" onclick="teileDefinition()">
          🔗 Teilen
        </button>
        <button class="ms-btn-secondary" onclick="kopiereDefinition()">
          📋 Kopieren
        </button>
        <button class="ms-btn-secondary" onclick="speichereDefinition()">
          💾 Speichern
        </button>
        <button class="ms-btn-danger" onclick="resetDefinition()">
          🔄 Zurücksetzen
        </button>
      </div>
      
    </div>
  `;
  
  return html;
}

// Initialisiert Definition aus Generator-Profil
function initDefinitionAusProfil(profil) {
  const achsenMeta = window.achsenMeta;
  const items = [];
  
  Object.entries(profil).forEach(([achse, pos]) => {
    const knotenId = `${achse}-${pos}`;
    const knoten = knotenData[knotenId];
    const meta = achsenMeta[achse];
    const zimmer = window.hausStruktur
      .flatMap(e => e.zimmer)
      .find(z => z.achse === achse);
    
    items.push({
      id: knotenId,
      achse: achse,
      position: pos,
      label: knoten?.name || meta?.pole[pos-1] || `Position ${pos}`,
      zimmer: zimmer?.name || achse,
      quelle: 'generator'
    });
  });
  
  // Verteile auf Kategorien basierend auf Extremheit
  items.forEach(item => {
    const extremheit = Math.abs(item.position - 3);
    if (extremheit >= 2) {
      meineSozialismusDefinition.kern.push(item);
    } else if (extremheit >= 1) {
      meineSozialismusDefinition.wichtig.push(item);
    } else {
      meineSozialismusDefinition.relevant.push(item);
    }
  });
}

// Rendert die Items einer Kategorie
function renderDefinitionItems(kategorie) {
  const items = meineSozialismusDefinition[kategorie] || [];
  
  if (items.length === 0) return '';
  
  return items.map((item, index) => `
    <div class="ms-item" draggable="true" data-id="${item.id}" data-kategorie="${kategorie}" data-index="${index}">
      <div class="ms-item-drag">⋮⋮</div>
      <div class="ms-item-content">
        <div class="ms-item-header">
          <span class="ms-item-achse">${item.achse}</span>
          <span class="ms-item-label">${item.label}</span>
          ${item.quelle === 'custom' ? '<span class="ms-item-custom">✏️</span>' : ''}
        </div>
        ${meineSozialismusDefinition.eigeneTexte[item.id] ? 
          `<div class="ms-item-eigentext">"${meineSozialismusDefinition.eigeneTexte[item.id]}"</div>` : 
          `<div class="ms-item-zimmer">${item.zimmer}</div>`
        }
      </div>
      <div class="ms-item-actions">
        <button class="ms-item-edit" onclick="bearbeitePosition('${item.id}')" title="Eigene Formulierung">✏️</button>
        <button class="ms-item-remove" onclick="entfernePosition('${item.id}', '${kategorie}')" title="Entfernen">×</button>
      </div>
    </div>
  `).join('');
}

// Generiert den Definitions-Text
function generiereDefinitionsText() {
  const { kern, wichtig, relevant, freitext, eigeneTexte } = meineSozialismusDefinition;
  
  // Wenn Freitext vorhanden, diesen verwenden
  if (freitext && freitext.trim()) {
    return `<p>${freitext}</p>`;
  }
  
  // Wenn keine Items, Hinweis zeigen
  if (kern.length === 0 && wichtig.length === 0 && relevant.length === 0) {
    return '<p class="ms-vorschau-leer">Füge Positionen hinzu, um deine Definition zu erstellen...</p>';
  }
  
  // Versuche intelligente Generierung
  if (window.satzbausteine) {
    return generiereDefinitionsTextIntelligent();
  }
  
  // Fallback auf einfache Version
  return generiereDefinitionsTextEinfach();
}

// Einfache Fallback-Version
function generiereDefinitionsTextEinfach() {
  const { kern, wichtig, relevant, eigeneTexte } = meineSozialismusDefinition;
  
  let text = '<p><strong>Sozialismus heißt für mich:</strong></p><p>';
  
  if (kern.length > 0) {
    const kernTexte = kern.map(k => eigeneTexte[k.id] || k.label.toLowerCase());
    text += `Vor allem ${kernTexte.join(' und ')}. `;
  }
  
  if (wichtig.length > 0) {
    const wichtigTexte = wichtig.map(w => eigeneTexte[w.id] || w.label.toLowerCase());
    text += `Dazu gehört für mich ${wichtigTexte.join(', ')}. `;
  }
  
  if (relevant.length > 0) {
    const relevantTexte = relevant.map(r => eigeneTexte[r.id] || r.label.toLowerCase());
    text += `Auch ${relevantTexte.join(' und ')} ${relevant.length === 1 ? 'spielt' : 'spielen'} eine Rolle.`;
  }
  
  text += '</p>';
  return text;
}

// Strukturierte Übersicht statt Fließtext-Generierung
function generiereDefinitionsTextIntelligent() {
  const { kern, wichtig, relevant, eigeneTexte } = meineSozialismusDefinition;
  const sb = window.satzbausteine;
  
  // Helper: Normalisiere ID
  const normalizeId = (id) => {
    if (!id) return null;
    const parts = id.split('-');
    if (parts.length !== 2) return id;
    return `${parts[0].padStart(2, '0')}-${parts[1]}`;
  };
  
  // Helper: Hole Label (nutzt Satzbausteine für bessere Kurzform)
  const getLabel = (item) => {
    if (eigeneTexte[item.id]) return `"${eigeneTexte[item.id]}"`;
    const id = normalizeId(item.id);
    const baustein = sb?.positionen?.[id];
    return baustein?.kurzform || item.label || 'unbekannt';
  };
  
  const hatItems = kern.length > 0 || wichtig.length > 0 || relevant.length > 0;
  
  if (!hatItems) {
    return '<p class="ms-vorschau-leer">Füge Positionen hinzu, um deine Definition zu erstellen...</p>';
  }
  
  let html = '<div class="ms-uebersicht">';
  
  // Kern
  if (kern.length > 0) {
    html += '<div class="ms-uebersicht-kat kern">';
    html += '<span class="ms-uebersicht-icon">🔥</span>';
    html += '<span class="ms-uebersicht-label">Unverzichtbar:</span>';
    html += '<span class="ms-uebersicht-items">' + kern.map(getLabel).join(' · ') + '</span>';
    html += '</div>';
  }
  
  // Wichtig
  if (wichtig.length > 0) {
    html += '<div class="ms-uebersicht-kat wichtig">';
    html += '<span class="ms-uebersicht-icon">💡</span>';
    html += '<span class="ms-uebersicht-label">Wichtig:</span>';
    html += '<span class="ms-uebersicht-items">' + wichtig.map(getLabel).join(' · ') + '</span>';
    html += '</div>';
  }
  
  // Relevant
  if (relevant.length > 0) {
    html += '<div class="ms-uebersicht-kat relevant">';
    html += '<span class="ms-uebersicht-icon">📎</span>';
    html += '<span class="ms-uebersicht-label">Relevant:</span>';
    html += '<span class="ms-uebersicht-items">' + relevant.map(getLabel).join(' · ') + '</span>';
    html += '</div>';
  }
  
  html += '</div>';
  
  // Einladung zum Selbstschreiben
  html += '<p class="ms-schreib-einladung">✏️ <em>Klicke auf "Bearbeiten" um deine eigene Formulierung zu schreiben</em></p>';
  
  return html;
}

// Drag & Drop initialisieren
function initDefinitionDragDrop() {
  const items = document.querySelectorAll('.ms-item');
  const dropzones = document.querySelectorAll('.ms-dropzone');
  
  items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({
        id: item.dataset.id,
        kategorie: item.dataset.kategorie,
        index: item.dataset.index
      }));
      item.classList.add('dragging');
    });
    
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });
  });
  
  dropzones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });
    
    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });
    
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const neueKategorie = zone.dataset.kategorie;
      
      bewegePosition(data.id, data.kategorie, neueKategorie);
    });
  });
}

// Position zwischen Kategorien bewegen
function bewegePosition(id, vonKategorie, nachKategorie) {
  if (vonKategorie === nachKategorie) return;
  
  const item = meineSozialismusDefinition[vonKategorie].find(i => i.id === id);
  if (!item) return;
  
  // Entfernen aus alter Kategorie
  meineSozialismusDefinition[vonKategorie] = meineSozialismusDefinition[vonKategorie].filter(i => i.id !== id);
  
  // Hinzufügen zu neuer Kategorie
  meineSozialismusDefinition[nachKategorie].push(item);
  
  // Speichern und neu rendern
  speichereDefinitionLokal();
  renderHaus('definition');
}

// Position entfernen
function entfernePosition(id, kategorie) {
  meineSozialismusDefinition[kategorie] = meineSozialismusDefinition[kategorie].filter(i => i.id !== id);
  delete meineSozialismusDefinition.eigeneTexte[id];
  speichereDefinitionLokal();
  renderHaus('definition');
}

// Eigene Formulierung bearbeiten
function bearbeitePosition(id) {
  const aktuellerText = meineSozialismusDefinition.eigeneTexte[id] || '';
  
  const html = `
    <div class="ms-edit-overlay" onclick="this.remove()">
      <div class="ms-edit-popup" onclick="event.stopPropagation()">
        <h4>✏️ Eigene Formulierung</h4>
        <p>Wie würdest du diese Position in eigenen Worten beschreiben?</p>
        <textarea id="ms-edit-textarea" placeholder="z.B. 'Kein Sozialismus ohne Klimagerechtigkeit'">${aktuellerText}</textarea>
        <div class="ms-edit-buttons">
          <button onclick="speichereEigeneFormulierung('${id}')">Speichern</button>
          <button class="secondary" onclick="this.closest('.ms-edit-overlay').remove()">Abbrechen</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('ms-edit-textarea').focus();
}

function speichereEigeneFormulierung(id) {
  const text = document.getElementById('ms-edit-textarea').value.trim();
  if (text) {
    meineSozialismusDefinition.eigeneTexte[id] = text;
  } else {
    delete meineSozialismusDefinition.eigeneTexte[id];
  }
  speichereDefinitionLokal();
  document.querySelector('.ms-edit-overlay').remove();
  renderHaus('definition');
}

// Position aus dem Wesen hinzufügen
function zeigePositionAuswahl() {
  const achsenMeta = window.achsenMeta;
  const hausStruktur = window.hausStruktur;
  const sb = window.satzbausteine;
  
  // Sammle bereits vorhandene IDs
  const vorhandeneIds = new Set([
    ...meineSozialismusDefinition.kern.map(i => i.id),
    ...meineSozialismusDefinition.wichtig.map(i => i.id),
    ...meineSozialismusDefinition.relevant.map(i => i.id)
  ]);
  
  // Baue Optionen pro Stockwerk
  let optionen = '';
  hausStruktur.forEach(etage => {
    optionen += `
      <div class="ms-auswahl-etage">
        <div class="ms-auswahl-etage-header">${etage.icon} ${etage.name}</div>
        <div class="ms-auswahl-zimmer-grid">
    `;
    
    etage.zimmer.forEach(zimmer => {
      const meta = achsenMeta[zimmer.achse];
      
      optionen += `
        <div class="ms-auswahl-zimmer-card">
          <div class="ms-auswahl-zimmer-header">
            <span class="ms-auswahl-achse-id">${zimmer.achse}</span>
            <span class="ms-auswahl-zimmer-name">${zimmer.name}</span>
          </div>
          <div class="ms-auswahl-pos-liste">
      `;
      
      [1,2,3,4,5].forEach(pos => {
        const knotenId = `${zimmer.achse}-${pos}`;
        const knoten = knotenData[knotenId];
        const baustein = sb?.positionen?.[knotenId];
        const schonVorhanden = vorhandeneIds.has(knotenId);
        const label = baustein?.kurzform || knoten?.name || meta?.pole?.[pos-1] || `Pos ${pos}`;
        
        optionen += `
          <label class="ms-auswahl-pos-item ${schonVorhanden ? 'vorhanden' : ''}">
            <input type="checkbox" 
                   data-achse="${zimmer.achse}" 
                   data-pos="${pos}" 
                   data-label="${label}"
                   data-zimmer="${zimmer.name}"
                   ${schonVorhanden ? 'checked disabled' : ''}>
            <span class="ms-auswahl-pos-num">${pos}</span>
            <span class="ms-auswahl-pos-label">${label}</span>
          </label>
        `;
      });
      
      optionen += `
          </div>
        </div>
      `;
    });
    
    optionen += `
        </div>
      </div>
    `;
  });
  
  const html = `
    <div class="ms-auswahl-overlay" onclick="if(event.target === this) this.remove()">
      <div class="ms-auswahl-popup-neu">
        <div class="ms-auswahl-header">
          <h4>➕ Positionen hinzufügen</h4>
          <button type="button" class="ms-auswahl-close" onclick="this.closest('.ms-auswahl-overlay').remove()">×</button>
        </div>
        <p class="ms-auswahl-hint">Wähle beliebig viele Positionen aus. Bereits hinzugefügte sind markiert.</p>
        
        <div class="ms-auswahl-liste-neu">
          ${optionen}
        </div>
        
        <div class="ms-auswahl-footer">
          <span class="ms-auswahl-count">0 ausgewählt</span>
          <div class="ms-auswahl-btns">
            <button type="button" class="ms-auswahl-btn secondary" onclick="this.closest('.ms-auswahl-overlay').remove()">Abbrechen</button>
            <button type="button" class="ms-auswahl-btn primary" onclick="fuegeAusgewaehlteHinzu()">Hinzufügen</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
  
  // Event-Listener für Zähler
  const overlay = document.querySelector('.ms-auswahl-overlay');
  const countEl = overlay.querySelector('.ms-auswahl-count');
  overlay.querySelectorAll('input[type="checkbox"]:not(:disabled)').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = overlay.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)').length;
      countEl.textContent = `${checked} ausgewählt`;
    });
  });
}

// Füge alle ausgewählten Positionen hinzu
function fuegeAusgewaehlteHinzu() {
  const overlay = document.querySelector('.ms-auswahl-overlay');
  const checkboxes = overlay.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)');
  
  if (checkboxes.length === 0) {
    overlay.remove();
    return;
  }
  
  checkboxes.forEach(cb => {
    const achse = cb.dataset.achse;
    const pos = parseInt(cb.dataset.pos);
    const label = cb.dataset.label;
    const zimmer = cb.dataset.zimmer;
    const knotenId = `${achse}-${pos}`;
    
    const item = {
      id: knotenId,
      achse: achse,
      position: pos,
      label: label,
      zimmer: zimmer,
      quelle: 'manuell'
    };
    
    // Standardmäßig zu "relevant" hinzufügen
    meineSozialismusDefinition.relevant.push(item);
  });
  
  speichereDefinitionLokal();
  overlay.remove();
  renderHaus('definition');
}

// Alte Funktion für Kompatibilität (wird nicht mehr verwendet)
function fuegePositionHinzu(achse, pos) {
  const knotenId = `${achse}-${pos}`;
  const knoten = knotenData[knotenId];
  const meta = window.achsenMeta[achse];
  const zimmer = window.hausStruktur
    .flatMap(e => e.zimmer)
    .find(z => z.achse === achse);
  
  const item = {
    id: knotenId,
    achse: achse,
    position: pos,
    label: knoten?.name || meta?.pole[pos-1] || `Position ${pos}`,
    zimmer: zimmer?.name || achse,
    quelle: 'manuell'
  };
  
  meineSozialismusDefinition.relevant.push(item);
  speichereDefinitionLokal();
  renderHaus('definition');
}

// Eigenen Punkt hinzufügen
function zeigeEigenenPunktDialog() {
  const html = `
    <div class="ms-edit-overlay" onclick="this.remove()">
      <div class="ms-edit-popup" onclick="event.stopPropagation()">
        <h4>✏️ Eigenen Punkt hinzufügen</h4>
        <p>Füge einen Aspekt hinzu, der nicht im Wesen vorkommt:</p>
        <input type="text" id="ms-custom-label" placeholder="Kurzer Titel (z.B. 'Radikale Demokratie')">
        <textarea id="ms-custom-text" placeholder="Beschreibung (optional)"></textarea>
        <div class="ms-edit-buttons">
          <button onclick="fuegeEigenenPunktHinzu()">Hinzufügen</button>
          <button class="secondary" onclick="this.closest('.ms-edit-overlay').remove()">Abbrechen</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('ms-custom-label').focus();
}

function fuegeEigenenPunktHinzu() {
  const label = document.getElementById('ms-custom-label').value.trim();
  const text = document.getElementById('ms-custom-text').value.trim();
  
  if (!label) {
    alert('Bitte gib einen Titel ein.');
    return;
  }
  
  const id = 'custom-' + Date.now();
  
  const item = {
    id: id,
    achse: '✏️',
    position: 0,
    label: label,
    zimmer: 'Eigener Punkt',
    quelle: 'custom'
  };
  
  meineSozialismusDefinition.relevant.push(item);
  if (text) {
    meineSozialismusDefinition.eigeneTexte[id] = text;
  }
  
  speichereDefinitionLokal();
  document.querySelector('.ms-edit-overlay').remove();
  renderHaus('definition');
}

// Freitext-Editor
function toggleFreitextEditor() {
  const editor = document.getElementById('ms-freitext-editor');
  const vorschau = document.getElementById('ms-vorschau-text');
  const textarea = document.getElementById('ms-freitext-textarea');
  
  if (editor.style.display === 'none') {
    editor.style.display = 'block';
    vorschau.style.display = 'none';
    
    // Wenn noch kein Freitext, aber Positionen vorhanden: vorfüllen
    if (!meineSozialismusDefinition.freitext || meineSozialismusDefinition.freitext.trim() === '') {
      textarea.value = generiereVorlageText();
    } else {
      textarea.value = meineSozialismusDefinition.freitext;
    }
    textarea.focus();
  } else {
    editor.style.display = 'none';
    vorschau.style.display = 'block';
  }
}

// Generiere Vorlage-Text aus Positionen für den Freitext-Editor
function generiereVorlageText() {
  const { kern, wichtig, relevant, eigeneTexte } = meineSozialismusDefinition;
  const sb = window.satzbausteine;
  
  const normalizeId = (id) => {
    if (!id) return null;
    const parts = id.split('-');
    if (parts.length !== 2) return id;
    return `${parts[0].padStart(2, '0')}-${parts[1]}`;
  };
  
  const getLabel = (item) => {
    if (eigeneTexte[item.id]) return eigeneTexte[item.id];
    const id = normalizeId(item.id);
    const baustein = sb?.positionen?.[id];
    return baustein?.kurzform || item.label || 'unbekannt';
  };
  
  let text = 'Sozialismus heißt für mich:\n\n';
  
  if (kern.length > 0) {
    text += 'Unverzichtbar: ' + kern.map(getLabel).join(', ') + '\n\n';
  }
  
  if (wichtig.length > 0) {
    text += 'Wichtig: ' + wichtig.map(getLabel).join(', ') + '\n\n';
  }
  
  if (relevant.length > 0) {
    text += 'Relevant: ' + relevant.map(getLabel).join(', ') + '\n\n';
  }
  
  text += '// Bearbeite diesen Text nach deinen Vorstellungen...';
  
  return text;
}

function speichereFreitext() {
  meineSozialismusDefinition.freitext = document.getElementById('ms-freitext-textarea').value;
  speichereDefinitionLokal();
  toggleFreitextEditor();
  document.getElementById('ms-vorschau-text').innerHTML = generiereDefinitionsText();
}

// Speichern, Teilen, Kopieren
function speichereDefinitionLokal() {
  localStorage.setItem('meinSozialismus', JSON.stringify(meineSozialismusDefinition));
  // Update Vorschau wenn vorhanden
  const vorschau = document.getElementById('ms-vorschau-text');
  if (vorschau) {
    vorschau.innerHTML = generiereDefinitionsText();
  }
}

function speichereDefinition() {
  speichereDefinitionLokal();
  
  // Kurze Bestätigung
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '✓ Gespeichert!';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }, 1500);
}

function kopiereDefinition() {
  const text = document.getElementById('ms-vorschau-text').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Kopiert!';
    setTimeout(() => btn.innerHTML = originalText, 1500);
  });
}

function teileDefinition() {
  // URL mit Definition generieren
  const encoded = btoa(encodeURIComponent(JSON.stringify(meineSozialismusDefinition)));
  const url = `${window.location.origin}${window.location.pathname}?ansicht=wg&tab=definition&def=${encoded}`;
  
  navigator.clipboard.writeText(url).then(() => {
    alert('Link kopiert! Du kannst ihn jetzt teilen.');
  });
}

function resetDefinition() {
  if (confirm('Möchtest du deine Definition wirklich zurücksetzen?')) {
    meineSozialismusDefinition = {
      kern: [],
      wichtig: [],
      relevant: [],
      eigeneTexte: {},
      freitext: ''
    };
    localStorage.removeItem('meinSozialismus');
    
    // Neu initialisieren aus Profil
    const profil = generatorProfil || konfigAuswahl || {};
    if (Object.keys(profil).length > 0) {
      initDefinitionAusProfil(profil);
    }
    
    renderHaus('definition');
  }
}

// Legacy-Funktionen
function switchWGTyp(typ) { renderHaus(typ); }
function regenerateChaosWG() { renderHaus('wg'); }
function renderWGHaus(modus) { renderHaus(modus || 'funktional'); }

// ═══════════════════════════════════════════════════════════════
// PERSONEN-DEBATTE ANZEIGEN
// ═══════════════════════════════════════════════════════════════

function zeigePersonenDebatte() {
  const gaeste = window.aktuelleTalkshowGaeste;
  const spannungen = window.aktuelleTalkshowSpannungen;
  
  if (!gaeste || gaeste.length < 2) {
    alert('Nicht genug Gäste für eine Debatte!');
    return;
  }
  
  // Generiere Statements basierend auf Positionen
  function generierePersonenStatement(person, achse, position) {
    // Versuche, ein passendes Statement aus den Knoten-Daten zu generieren
    const knotenId = `${achse}-${position}`;
    const knoten = knotenData[knotenId];
    
    if (knoten) {
      // Nutze Beschreibung oder Kernaussage des Knotens
      if (knoten.zitate && knoten.zitate.length > 0) {
        const zitat = knoten.zitate[Math.floor(Math.random() * knoten.zitate.length)];
        return zitat.text || zitat;
      }
      if (knoten.beschreibung) {
        return knoten.beschreibung.split('.')[0] + '.';
      }
      return `Als Vertreter*in von "${knoten.name}" sage ich: Diese Position ist zentral für ein emanzipatorisches Projekt.`;
    }
    
    return `Meine Position auf dieser Achse ist klar: Wir müssen hier konsequent sein.`;
  }
  
  let html = `
    <div class="talkshow-overlay" onclick="this.remove()">
      <div class="talkshow-popup" onclick="event.stopPropagation()" style="max-width: 700px;">
        <button class="talkshow-close" onclick="this.parentElement.parentElement.remove()">×</button>
        
        <div class="talkshow-popup-header">
          <span class="talkshow-popup-logo">📺</span>
          <div>
            <h3>Historische Begegnung</h3>
            <p>${gaeste.map(g => g.name.split(' ').pop()).join(' · ')}</p>
          </div>
        </div>
        
        <div style="padding: 1.25rem;">
  `;
  
  // Zeige Debatten zu den Spannungsfeldern
  if (spannungen.length > 0) {
    spannungen.slice(0, 3).forEach((spannung, i) => {
      html += `
        <div class="debatte-runde">
          <div class="debatte-runde-header">
            <span class="debatte-runde-nummer">${i + 1}</span>
            <span class="debatte-runde-thema">${spannung.name}</span>
          </div>
          
          <div class="spannung-frage" style="margin-bottom: 1rem;">
            🎙️ "${spannung.fragen[Math.floor(Math.random() * spannung.fragen.length)]}"
          </div>
      `;
      
      // Statements der beteiligten Personen
      spannung.alleBeteiligt.forEach(eintrag => {
        const statement = generierePersonenStatement(eintrag.person, spannung.achse, eintrag.position);
        html += `
          <div class="debatte-aussage" style="--accent: ${eintrag.person.farbe}">
            <span class="debatte-aussage-icon">${eintrag.person.icon}</span>
            <div class="debatte-aussage-content">
              <span class="debatte-aussage-name">${eintrag.person.name}</span>
              <p class="debatte-aussage-text">"${statement}"</p>
              <span class="debatte-aussage-position">→ ${eintrag.positionsName}</span>
            </div>
          </div>
        `;
      });
      
      html += `</div>`;
    });
  } else {
    // Keine direkten Spannungen - zeige allgemeine Positionen
    html += `
      <div class="debatte-runde">
        <div class="debatte-runde-header">
          <span class="debatte-runde-nummer">1</span>
          <span class="debatte-runde-thema">Vorstellungsrunde</span>
        </div>
    `;
    
    gaeste.forEach(gast => {
      const erstePosition = gast.positionen[0];
      html += `
        <div class="debatte-aussage" style="--accent: ${gast.farbe}">
          <span class="debatte-aussage-icon">${gast.icon}</span>
          <div class="debatte-aussage-content">
            <span class="debatte-aussage-name">${gast.name}</span>
            <p class="debatte-aussage-text">"Ich stehe für ${erstePosition.positionsName}."</p>
            <span class="debatte-aussage-position">Achse ${erstePosition.achse}</span>
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  // KI-Platzhalter für zukünftige dynamische Debatten
  html += `
    <div class="ki-platzhalter">
      <div class="ki-platzhalter-icon">🤖</div>
      <p><strong>Bald: KI-gestützte Debatte</strong></p>
      <p>Die Personen werden dynamisch antworten. Du kannst eigene Fragen stellen.</p>
    </div>
  `;
  
  // Gemeinsamkeiten suchen
  const gemeinsameAchsen = [];
  const achsenSet = {};
  gaeste.forEach(g => {
    g.positionen.forEach(p => {
      if (!achsenSet[p.achse]) achsenSet[p.achse] = new Set();
      achsenSet[p.achse].add(g.name);
    });
  });
  
  Object.entries(achsenSet).forEach(([achse, personen]) => {
    if (personen.size >= 2) {
      // Prüfe ob ähnliche Position
      const relevante = gaeste.filter(g => g.positionen.some(p => p.achse === achse));
      const positionen = relevante.map(g => g.positionen.find(p => p.achse === achse)?.position);
      const alleSimilar = positionen.every(p => Math.abs(p - positionen[0]) <= 1);
      
      if (alleSimilar && positionen.length >= 2) {
        const achsenName = window.achsenMeta?.[achse]?.name || `Achse ${achse}`;
        gemeinsameAchsen.push(achsenName);
      }
    }
  });
  
  if (gemeinsameAchsen.length > 0) {
    html += `
      <div style="margin-top: 1rem; padding: 1rem; background: rgba(76,175,80,0.1); border-radius: 8px;">
        <p style="color: #81C784; margin: 0;">
          <strong>🤝 Gemeinsamer Boden:</strong> ${gemeinsameAchsen.slice(0, 3).join(', ')}
        </p>
      </div>
    `;
  }
  
  html += `
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
}

// ═══════════════════════════════════════════════════════════════
// TALKSHOW ANZEIGEN (Archetypen-Version)
// ═══════════════════════════════════════════════════════════════

function zeigeTalkshow() {
  const gaeste = window.aktuelleGaeste;
  const userArchetyp = window.userArchetyp;
  const archetypen = window.archetypen;
  const spannungsFelder = window.spannungsFelder;
  
  if (!gaeste || gaeste.length < 4) return;
  
  // Hole Gäste-Daten
  const gaesteDaten = gaeste.map(id => ({
    id,
    ...archetypen[id]
  }));
  
  // Berechne Spannungen
  const achsen = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25'];
  const spannungen = [];
  
  achsen.forEach(achse => {
    const werte = gaesteDaten.map(g => g.ideal?.[achse] || 3);
    const min = Math.min(...werte);
    const max = Math.max(...werte);
    const diff = max - min;
    
    if (diff >= 2) {
      const minGast = gaesteDaten.find(g => (g.ideal?.[achse] || 3) === min);
      const maxGast = gaesteDaten.find(g => (g.ideal?.[achse] || 3) === max);
      
      spannungen.push({
        achse,
        diff,
        minGast,
        maxGast,
        feld: spannungsFelder[achse]
      });
    }
  });
  
  spannungen.sort((a, b) => b.diff - a.diff);
  const topThemen = spannungen.slice(0, 3);
  
  // Finde Gemeinsamkeiten
  const gemeinsamkeiten = findeGemeinsamkeiten(gaesteDaten, achsen);
  
  // User-Info
  const userInfo = userArchetyp ? archetypen[userArchetyp] : null;
  
  // Popup generieren
  const html = `
    <div class="talkshow-overlay" onclick="this.remove()">
      <div class="talkshow-popup" onclick="event.stopPropagation()">
        <button class="talkshow-close" onclick="this.parentElement.parentElement.remove()">×</button>
        
        <div class="talkshow-popup-header">
          <span class="talkshow-popup-logo">📺</span>
          <div>
            <h3>Talkshow-Generator</h3>
            <p>Vier Perspektiven auf die großen Fragen</p>
          </div>
        </div>
        
        <div class="talkshow-popup-gaeste">
          ${gaesteDaten.map(g => `
            <div class="popup-gast" style="--accent: ${g.farbe}">
              <span>${g.icon}</span>
              <span>${g.name.split(' ')[0]}</span>
            </div>
          `).join('')}
        </div>
        
        <!-- THEMEN / DEBATTEN -->
        ${topThemen.length > 0 ? topThemen.map((t, i) => `
          <div class="talkshow-thema">
            <div class="thema-header">
              <span class="thema-nummer">Thema ${i + 1}</span>
              <span class="thema-name">${t.feld?.name || t.achse}</span>
            </div>
            
            <div class="thema-frage">
              🎙️ "${t.feld?.fragen[Math.floor(Math.random() * t.feld.fragen.length)] || 'Wie seht ihr das?'}"
            </div>
            
            <div class="thema-statements">
              ${gaesteDaten.map(g => {
                const statement = generiereStatement(g, t.achse, t);
                return `
                  <div class="statement" style="--accent: ${g.farbe}">
                    <span class="statement-icon">${g.icon}</span>
                    <div class="statement-text">
                      <span class="statement-name">${g.name.split(' ')[0]}:</span>
                      "${statement}"
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('') : `
          <div class="talkshow-harmonie">
            <p>🕊️ Diese Runde ist überraschend einig!</p>
          </div>
        `}
        
        <!-- ABSCHLUSSRUNDE -->
        <div class="talkshow-abschluss">
          <div class="abschluss-header">
            <span>🤝</span>
            <h4>Abschlussrunde</h4>
          </div>
          
          ${gemeinsamkeiten.length > 0 ? `
            <div class="abschluss-gemeinsamkeiten">
              <p class="gem-intro">Was diese Runde verbindet:</p>
              ${gemeinsamkeiten.map(g => `<span class="gem-tag">✓ ${g}</span>`).join('')}
            </div>
          ` : ''}
          
          <div class="abschluss-frage">
            💬 "Wofür würdet ihr trotz aller Differenzen gemeinsam auf die Straße gehen?"
          </div>
          
          <div class="abschluss-note">
            💚 Linke Einheit heißt nicht Uniformität – sondern solidarisch streiten.
          </div>
        </div>
        
        <!-- USER EINSCHALTEN -->
        ${userInfo ? `
          <div class="talkshow-einschalten">
            <div class="einschalten-header">
              <span>${userInfo.icon}</span>
              <div>
                <strong>Du als ${userInfo.name}</strong>
                <p>Was würdest du zu dieser Debatte sagen?</p>
              </div>
            </div>
            <a href="mailto:info@das-linke-wesen.de?subject=Talkshow: Meine Perspektive&body=Ich bin ${encodeURIComponent(userInfo.name)} und möchte folgendes einwerfen:%0A%0A" class="einschalten-mail-btn">
              ✉️ Schreib uns deine Meinung!
            </a>
          </div>
        ` : ''}
        
        <div class="talkshow-popup-footer">
          <span>🔜 Bald: Live-Debatten mit echten Menschen</span>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
}

// ═══════════════════════════════════════════════════════════════
// STATEMENT GENERIEREN (ein Satz pro Archetyp + Achse)
// ═══════════════════════════════════════════════════════════════

function generiereStatement(gast, achse, spannung) {
  const wert = gast.ideal?.[achse] || 3;
  
  // Basis-Statements je nach Achse und Position
  const statements = {
    A1: {
      low: "Wir müssen die Menschen dort abholen, wo sie sind – mit konkreten Verbesserungen.",
      mid: "Reform und Revolution sind keine Gegensätze, sondern Etappen desselben Weges.",
      high: "Solange wir im System spielen, reproduzieren wir es – wir brauchen den Bruch."
    },
    A2: {
      low: "Die Arbeiterklasse bleibt das zentrale revolutionäre Subjekt.",
      mid: "Wir müssen verschiedene Kämpfe verbinden, ohne sie zu hierarchisieren.",
      high: "Alle Unterdrückten und das Leben selbst – das ist unser Subjekt."
    },
    A3: {
      low: "Den Staat erobern und für unsere Zwecke nutzen – das ist der Weg.",
      mid: "Der Staat ist ein umkämpftes Terrain, nicht Freund und nicht Feind.",
      high: "Jede Staatsmacht reproduziert Herrschaft – wir müssen sie auflösen."
    },
    B1: {
      low: "Märkte können sozial reguliert werden – Sozialismus braucht keine Zentralplanung.",
      mid: "Demokratische Planung und Markt müssen klug kombiniert werden.",
      high: "Nur demokratische Planung überwindet die Anarchie des Marktes."
    },
    B2: {
      low: "Öffentliches Eigentum unter staatlicher Kontrolle ist die Basis.",
      mid: "Verschiedene Eigentumsformen haben verschiedene Stärken.",
      high: "Commons und Gemeineigentum von unten – nicht Staatseigentum."
    },
    B3: {
      low: "Gute Arbeit für alle muss unser Ziel sein.",
      mid: "Arbeitszeitverkürzung bei vollem Lohnausgleich – jetzt!",
      high: "Die Befreiung von der Lohnarbeit ist das eigentliche Ziel."
    },
    C1: {
      low: "Der Klassenkampf muss Priorität haben – alles andere folgt.",
      mid: "Klasse und Geschlecht sind verwoben und müssen zusammen bekämpft werden.",
      high: "Ohne Sturz des Patriarchats kein Sozialismus – Feminismus ist zentral."
    },
    C2: {
      low: "Erst müssen wir die Produktivkräfte entwickeln, dann können wir ökologisch werden.",
      mid: "Soziale und ökologische Frage gehören zusammen.",
      high: "Die Natur hat eigene Rechte – Sozialismus muss ökozentrisch sein."
    },
    C3: {
      low: "Wir müssen erst im eigenen Land stark werden.",
      mid: "Internationale Solidarität braucht lokale Verankerung.",
      high: "Sozialismus ist global oder gar nicht – No Borders, No Nations."
    },
    D1: {
      low: "Utopien sind gefährlich – wir wissen nur, was wir nicht wollen.",
      mid: "Der Weg ist das Ziel, aber wir brauchen eine Richtung.",
      high: "Konkrete Utopien zeigen, dass eine andere Welt möglich ist."
    },
    D2: {
      low: "Schrittweise Transformation ist realistischer als Revolutionsromantik.",
      mid: "Wir brauchen Brüche und Kontinuität zugleich.",
      high: "Nur ein radikaler Bruch kann das System überwinden."
    },
    D3: {
      low: "Religion ist Opium – Sozialismus ist säkular.",
      mid: "Spiritualität kann persönlich wertvoll sein, aber Politik ist weltlich.",
      high: "Befreiung hat auch eine spirituelle Dimension."
    },
    E1: {
      low: "Klare Klassenlinie – keine Verwässerung durch liberale Bündnisse.",
      mid: "Breite Bündnisse, aber mit klarem sozialistischen Kern.",
      high: "Alle progressiven Kräfte zusammen – Massenlinie!"
    },
    E2: {
      low: "Zentrale Koordination ist für wirksamen Kampf unerlässlich.",
      mid: "Mehrebenen-Politik: lokal handeln, global denken.",
      high: "Von unten, dezentral, basisdemokratisch – das ist unsere Stärke."
    },
    E3: {
      low: "Ohne revolutionäre Theorie keine revolutionäre Praxis.",
      mid: "Theorie und Praxis müssen sich gegenseitig befruchten.",
      high: "Wir lernen im Kampf, nicht im Seminar – Praxis zuerst."
    },
    E4: {
      low: "Strikt legale Mittel – alles andere schadet der Bewegung.",
      mid: "Ziviler Ungehorsam hat seinen Platz.",
      high: "Die Frage der Mittel ist eine taktische, keine moralische."
    }
  };
  
  const achsenStatements = statements[achse];
  if (!achsenStatements) return "Das müssen wir gemeinsam diskutieren.";
  
  if (wert <= 2) return achsenStatements.low;
  if (wert >= 4) return achsenStatements.high;
  return achsenStatements.mid;
}

// Legacy-Funktion für Kompatibilität
function zeigeWGDebatte(index) { zeigeTalkshow(); }

// Finde Gemeinsamkeiten zwischen den 4 Archetypen
function findeGemeinsamkeiten(bewohnerDaten, achsen) {
  const dominated = [];
  const achsenMeta = window.achsenMeta;
  
  achsen.forEach(achse => {
    const werte = bewohnerDaten.map(b => b.ideal?.[achse] || 3);
    const min = Math.min(...werte);
    const max = Math.max(...werte);
    const durchschnitt = werte.reduce((a, b) => a + b, 0) / werte.length;
    
    // Wenn alle ähnlich (Differenz <= 1), ist das eine Gemeinsamkeit
    if (max - min <= 1) {
      const meta = achsenMeta[achse];
      if (meta) {
        const posIndex = Math.round(durchschnitt) - 1;
        const position = meta.pole[posIndex] || '';
        
        // Generiere Beschreibung basierend auf Achse und Position
        const beschreibung = generiereGemeinsamkeitsBeschreibung(achse, durchschnitt);
        if (beschreibung) {
          dominated.push(beschreibung);
        }
      }
    }
  });
  
  return dominated.slice(0, 3); // Max 3 Gemeinsamkeiten
}

function generiereGemeinsamkeitsBeschreibung(achse, wert) {
  const beschreibungen = {
    A1: wert >= 4 ? "Ihr seid euch einig: Es braucht grundlegende Veränderung" : 
        wert <= 2 ? "Ihr bevorzugt alle schrittweise Reformen" : null,
    A2: wert >= 4 ? "Ihr seht ein breites gesellschaftliches Subjekt" :
        wert <= 2 ? "Ihr fokussiert auf die Arbeiterklasse" : null,
    A3: wert >= 4 ? "Ihr seid staatskritisch" :
        wert <= 2 ? "Ihr seht den Staat als wichtiges Werkzeug" : null,
    B2: wert >= 4 ? "Ihr favorisiert Gemeineigentum und Commons" :
        wert <= 2 ? "Ihr setzt auf öffentliches Eigentum" : null,
    B3: wert >= 4 ? "Ihr wollt Arbeit radikal reduzieren oder abschaffen" :
        wert <= 2 ? "Ihr betont den Wert guter Arbeit" : null,
    C1: wert >= 4 ? "Feminismus ist für euch zentral" :
        wert <= 2 ? "Ihr priorisiert den Klassenkampf" : null,
    C2: wert >= 4 ? "Ökologie hat für euch höchste Priorität" :
        wert <= 2 ? "Ihr seht Produktion als notwendig" : null,
    C3: wert >= 4 ? "Ihr denkt global und internationalistisch" :
        wert <= 2 ? "Ihr fokussiert auf nationale Strategien" : null,
    D1: wert >= 4 ? "Ihr glaubt an konkrete Utopien" :
        wert <= 2 ? "Ihr seid skeptisch gegenüber Utopien" : null,
    E1: wert >= 4 ? "Ihr setzt auf breite Bündnisse" :
        wert <= 2 ? "Ihr bevorzugt klare Klassenlinien" : null,
    E2: wert >= 4 ? "Ihr favorisiert dezentrale Organisation" :
        wert <= 2 ? "Ihr seht Zentralismus als notwendig" : null,
    E3: wert >= 4 ? "Ihr betont Praxis und Erfahrung" :
        wert <= 2 ? "Ihr betont Theorie und Aufklärung" : null
  };
  
  return beschreibungen[achse] || null;
}

// ══════════════════════════════════════════════════════════════════════
// ÖKOSYSTEM: Positionen als Arten
// ══════════════════════════════════════════════════════════════════════

function initOekosystem() {
  const container = document.getElementById('oekosystem-container');
  
  // Klassifiziere Positionen nach "ökologischer Nische"
  const verbindungsCount = {};
  Object.keys(knotenData).forEach(id => verbindungsCount[id] = 0);
  verbindungenData.forEach(v => {
    verbindungsCount[v.von]++;
    verbindungsCount[v.zu]++;
  });
  
  // Kategorisiere
  const dominant = []; // Viele Verbindungen (>6)
  const pioneer = [];  // In Debatten verwickelt
  const symbionten = []; // Mittlere Verbindungen, keine Debatten
  const nischen = []; // Wenige Verbindungen
  const endangered = []; // Sehr wenige Verbindungen (<3)
  
  const debattenIds = new Set();
  verbindungenData.filter(v => v.typ === 'debatte').forEach(v => {
    debattenIds.add(v.von);
    debattenIds.add(v.zu);
  });
  
  Object.values(knotenData).forEach(k => {
    const count = verbindungsCount[k.id];
    const inDebatte = debattenIds.has(k.id);
    
    if (count >= 7) {
      dominant.push({ ...k, count, typ: 'dominant' });
    } else if (inDebatte) {
      pioneer.push({ ...k, count, typ: 'pioneer' });
    } else if (count >= 4) {
      symbionten.push({ ...k, count, typ: 'symbiont' });
    } else if (count <= 2) {
      endangered.push({ ...k, count, typ: 'endangered' });
    } else {
      nischen.push({ ...k, count, typ: 'nische' });
    }
  });
  
  let html = '<h2 style="color: #4CAF50; margin-bottom: 0.5rem;">🌿 Das Ökosystem des linken Denkens</h2>';
  html += '<p style="color: #888; margin-bottom: 2rem;">Positionen als Arten. Wer dominiert das Ökosystem? Wer kämpft um Ressourcen? Wer lebt in Symbiose? Wer ist vom Aussterben bedroht?</p>';
  
  const zonen = [
    { titel: '🌳 Dominante Arten', beschreibung: 'Die großen Bäume des Waldes — stark vernetzt, prägen das Ökosystem', arten: dominant, klasse: 'dominant' },
    { titel: '🔥 Pionierpflanzen', beschreibung: 'Wachsen in umkämpftem Terrain — in aktiven Debatten verwickelt', arten: pioneer, klasse: 'pioneer' },
    { titel: '🤝 Symbionten', beschreibung: 'Leben in Kooperation — gut vernetzt, ohne Konflikte', arten: symbionten, klasse: 'symbiont' },
    { titel: '🌱 Nischenarten', beschreibung: 'Spezialisiert, aber stabil — moderate Vernetzung', arten: nischen, klasse: 'nische' },
    { titel: '🦤 Gefährdete Arten', beschreibung: 'Wenig Verbindungen — drohen in Vergessenheit zu geraten', arten: endangered, klasse: 'endangered' }
  ];
  
  zonen.forEach(zone => {
    if (zone.arten.length === 0) return;
    html += `<div class="oeko-zone">
      <h3>${zone.titel} <span style="font-weight: normal; color: #666;">(${zone.arten.length})</span></h3>
      <p style="color: #666; margin-bottom: 1rem; font-size: 0.85rem;">${zone.beschreibung}</p>
      <div class="oeko-arten">`;
    
    zone.arten.sort((a, b) => b.count - a.count).forEach(art => {
      html += `<span class="oeko-art ${zone.klasse}" onclick="showKnoten('${art.id}')">${art.name} <span style="color: #666; font-size: 0.7rem;">(${art.count})</span></span>`;
    });
    
    html += '</div></div>';
  });
  
  // Nahrungsketten / Beziehungen
  html += `<div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #333;">
    <h3 style="color: #4CAF50;">🔗 Ökologische Beziehungen</h3>
    <p style="color: #666; margin: 1rem 0;">Einige bemerkenswerte Symbiosen und Konkurrenzen:</p>
    <div style="display: grid; gap: 1rem;">`;
  
  // Stärkste Affinitäten
  const starkeAffinitaeten = verbindungenData
    .filter(v => v.typ === 'affinitaet' && v.staerke >= 0.85)
    .slice(0, 5);
  
  starkeAffinitaeten.forEach(v => {
    const a = knotenData[v.von];
    const b = knotenData[v.zu];
    if (a && b) {
      html += `<div style="background: #252525; padding: 0.75rem; border-radius: 4px; border-left: 3px solid #4CAF50;">
        <strong style="color: #4CAF50;">Symbiose:</strong> ${a.name} ↔ ${b.name}
        <div style="color: #888; font-size: 0.8rem; margin-top: 0.25rem;">${v.beschreibung}</div>
      </div>`;
    }
  });
  
  html += '</div></div>';
  
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// LABOR: Chemische Reaktionen zwischen Ideen
// ══════════════════════════════════════════════════════════════════════

function initChemie() {
  const container = document.getElementById('chemie-container');
  
  // Elemente definieren basierend auf Eigenschaften
  const elemente = Object.values(knotenData).map(k => {
    // Verbindungscount
    let count = 0;
    let debattenCount = 0;
    verbindungenData.forEach(v => {
      if (v.von === k.id || v.zu === k.id) {
        count++;
        if (v.typ === 'debatte') debattenCount++;
      }
    });
    
    // Klassifizierung
    let typ = 'stabil';
    if (debattenCount >= 2) typ = 'alkali'; // Hochreaktiv
    else if (count <= 2) typ = 'edelgas'; // Reagiert kaum
    else if (count >= 6) typ = 'katalysator'; // Verbindet viele
    
    // Symbol aus ersten Buchstaben
    const words = k.name.split(/[\s-]+/);
    let symbol = words[0].substring(0, 2);
    if (words.length > 1) {
      symbol = words[0][0] + words[1][0];
    }
    symbol = symbol.toUpperCase();
    
    return { ...k, symbol, typ, count, debattenCount };
  });
  
  let html = '<h2 style="color: #FF9800; margin-bottom: 0.5rem;">⚗️ Das Labor der Ideen</h2>';
  html += '<p style="color: #888; margin-bottom: 2rem;">Positionen als chemische Elemente. Manche reagieren heftig miteinander, manche sind stabil, manche katalysieren Verbindungen.</p>';
  
  // Legende
  html += `<div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
    <span style="color: #f44336;">● Alkali (hochreaktiv, in Debatten)</span>
    <span style="color: #FF9800;">● Katalysator (verbindet viele)</span>
    <span style="color: #4CAF50;">● Stabil (ausgeglichen)</span>
    <span style="color: #9C27B0;">● Edelgas (reagiert kaum)</span>
  </div>`;
  
  // Periodensystem
  html += '<div class="periodensystem">';
  
  elemente.sort((a, b) => {
    const order = { alkali: 0, katalysator: 1, stabil: 2, edelgas: 3 };
    return order[a.typ] - order[b.typ];
  }).forEach(el => {
    html += `<div class="element ${el.typ}" onclick="showKnoten('${el.id}')" title="${el.name}">
      <div class="symbol">${el.symbol}</div>
      <div class="name">${el.name.length > 12 ? el.name.substring(0, 10) + '…' : el.name}</div>
    </div>`;
  });
  
  html += '</div>';
  
  // Reaktionsgleichungen
  html += '<div class="reaktionsgleichung">';
  html += '<h3>📜 Historische Reaktionen</h3>';
  
  const reaktionen = [
    { formel: 'Anarchismus + Leninismus → Explosion (1872)', ergebnis: 'Spaltung der Ersten Internationale, Bakunin ausgeschlossen' },
    { formel: 'Klassensubjekt + Multitude → Spannung', ergebnis: 'Hardt/Negri vs. orthodoxer Marxismus' },
    { formel: 'Reform + Revolution → Doppelstrategie', ergebnis: 'Rosa Luxemburg synthesiert beide' },
    { formel: 'Feminismus + Klassenprimat → Debatte', ergebnis: 'Haupt- vs. Nebenwiderspruch' },
    { formel: 'Anarchismus + Ökologie → Sozialökologie', ergebnis: 'Murray Bookchin, Kommunalismus' }
  ];
  
  reaktionen.forEach(r => {
    html += `<div class="reaktion">
      <div class="formel">${r.formel}</div>
      <div class="ergebnis">→ ${r.ergebnis}</div>
    </div>`;
  });
  
  html += '</div>';
  
  // Interaktiver Hinweis
  html += `<div style="margin-top: 2rem; padding: 1rem; background: #252525; border-radius: 8px; color: #888;">
    <strong style="color: #FF9800;">💡 Tipp:</strong> Gehe zum 3D-Netzwerk und ziehe zwei Elemente aufeinander, um ihre Reaktion zu analysieren.
  </div>`;
  
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// EPOCHEN: Das Haus in verschiedenen Zeiten
// ══════════════════════════════════════════════════════════════════════

function initEpochen() {
  const container = document.getElementById('zeit-container');
  
  const epochen = [
    {
      id: '1848',
      name: '1848 — Die Geburt',
      beschreibung: 'Das Jahr der Revolutionen. Marx und Engels veröffentlichen das Kommunistische Manifest. Die Arbeiterbewegung betritt die Weltbühne.',
      geboren: ["09-2", "12-2", "24-3", "00-5"],
      aktiv: [],
      geist: 'Die Welt ist jung. Alles scheint möglich. Die Fabriken rauchen, die Barrikaden brennen, die Zukunft gehört den Massen.'
    },
    {
      id: '1917',
      name: '1917 — Der Durchbruch',
      beschreibung: 'Die Russische Revolution. Zum ersten Mal ergreift die Arbeiterklasse die Macht. Hoffnung und Schrecken zugleich.',
      geboren: ["02-5", "01-1", "22-1", "07-1", "07-2"],
      aktiv: ["12-2", "09-2", "00-5", "24-4"],
      geist: 'Der Staat ist erobert. Aber was nun? Bürgerkrieg, Intervention, Mangel. Die Debatten werden härter, die Spaltungen tiefer.'
    },
    {
      id: '1968',
      name: '1968 — Die Erweiterung',
      beschreibung: 'Paris, Prag, Berkeley, Mexiko. Neue Subjekte, neue Fragen. Feminismus, Ökologie, Antirassismus betreten die Bühne.',
      geboren: ["09-3", "09-5", "12-4", "09-4", "08-4"],
      aktiv: ["12-5", "06-4", "17-3"],
      geist: 'Die alte Linke ist zu eng. Wer ist das revolutionäre Subjekt? Studenten, Frauen, Kolonisierte? Die Phantasie ergreift die Macht.'
    },
    {
      id: '1989',
      name: '1989 — Der Zusammenbruch',
      beschreibung: 'Die Mauer fällt. Der Realsozialismus endet. Triumphgeheul der Sieger, Orientierungslosigkeit der Linken.',
      geboren: ["17-4", "00-2", "01-4"],
      aktiv: ["02-1", "12-3", "25-3"],
      tot: ["02-5", "01-1", "22-1"],
      geist: 'Was bleibt? Die großen Erzählungen sind diskreditiert. Zeit für Mikropolitik, Nischen, reale Utopien im Kleinen.'
    },
    {
      id: 'heute',
      name: 'Heute — Die Suche',
      beschreibung: 'Klimakrise, Digitalisierung, neue Autoritarismen. Die alten Fragen kehren zurück, aber anders.',
      geboren: ["16-5", "08-5", "06-5"],
      aktiv: ["09-3", "08-4", "09-4", "17-4", "16-4"],
      geist: 'Das Haus ist voll, aber chaotisch. Viele Bewohner, wenig Einigkeit. Aber auch: Mehr Möglichkeiten als je zuvor. Die Suche geht weiter.'
    }
  ];
  
  let html = '<h2 style="color: #E53935; margin-bottom: 0.5rem;">🌀 Epochen des linken Denkens</h2>';
  html += '<p style="color: #888; margin-bottom: 2rem;">Dasselbe Haus in verschiedenen historischen Momenten. Wer war schon da? Wer wurde gerade geboren? Wer ist verschwunden?</p>';
  
  html += '<div class="epochen-nav">';
  epochen.forEach((ep, i) => {
    html += `<button class="epoche-btn ${i === 0 ? 'active' : ''}" onclick="showEpoche('${ep.id}')">${ep.name.split(' — ')[0]}</button>`;
  });
  html += '</div>';
  
  html += '<div id="epochen-inhalt" class="epochen-inhalt"></div>';
  
  container.innerHTML = html;
  
  // Initial erste Epoche zeigen
  window.epochenData = epochen;
  showEpoche('1848');
}

function showEpoche(id) {
  const ep = window.epochenData.find(e => e.id === id);
  if (!ep) return;
  
  // Buttons aktualisieren
  document.querySelectorAll('.epoche-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === id || btn.textContent === ep.name.split(' — ')[0]);
  });
  
  let html = `<h3>${ep.name}</h3>`;
  html += `<p>${ep.beschreibung}</p>`;
  html += `<div style="background: #1a1a1a; padding: 1rem; border-radius: 4px; margin: 1rem 0; font-style: italic; color: #888; border-left: 3px solid #E53935;">"${ep.geist}"</div>`;
  
  if (ep.geboren && ep.geboren.length > 0) {
    html += '<p style="color: #4CAF50; margin-top: 1.5rem;"><strong>🌱 In dieser Zeit geboren:</strong></p>';
    html += '<div class="epochen-knoten">';
    ep.geboren.forEach(id => {
      const k = knotenData[id];
      if (k) html += `<span class="geboren" onclick="showKnoten('${id}')">${k.name}</span>`;
    });
    html += '</div>';
  }
  
  if (ep.aktiv && ep.aktiv.length > 0) {
    html += '<p style="color: #FF9800; margin-top: 1rem;"><strong>🔥 Besonders aktiv:</strong></p>';
    html += '<div class="epochen-knoten">';
    ep.aktiv.forEach(id => {
      const k = knotenData[id];
      if (k) html += `<span class="aktiv" onclick="showKnoten('${id}')">${k.name}</span>`;
    });
    html += '</div>';
  }
  
  if (ep.tot && ep.tot.length > 0) {
    html += '<p style="color: #666; margin-top: 1rem;"><strong>💀 Diskreditiert / verschwunden:</strong></p>';
    html += '<div class="epochen-knoten">';
    ep.tot.forEach(id => {
      const k = knotenData[id];
      if (k) html += `<span class="tot" onclick="showKnoten('${id}')">${k.name}</span>`;
    });
    html += '</div>';
  }
  
  document.getElementById('epochen-inhalt').innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// STAMMBAUM: Genealogie der Ideen
// ══════════════════════════════════════════════════════════════════════

function initStammbaum() {
  const container = document.getElementById('stammbaum-container');
  
  // Ideen-Genealogie definieren
  const generationen = [
    {
      zeit: "Vorläufer (vor 1848)",
      denker: [
        { name: "Rousseau", jahre: "1712-1778", einfluss: ["12-1", "17-3"], id: null },
        { name: "Babeuf", jahre: "1760-1797", einfluss: ["00-5", "01-1"], id: null },
        { name: "Owen/Fourier", jahre: "~1800", einfluss: ["17-5", "01-4"], id: null }
      ]
    },
    {
      zeit: "Gründergeneration (1848-1890)",
      denker: [
        { name: "Marx", jahre: "1818-1883", einfluss: ["09-2", "12-2", "25-1"], id: "09-2" },
        { name: "Bakunin", jahre: "1814-1876", einfluss: ["12-5", "01-5"], id: "12-5" },
        { name: "Proudhon", jahre: "1809-1865", einfluss: ["01-4", "12-5"], id: null }
      ]
    },
    {
      zeit: "Zweite Generation (1890-1920)",
      denker: [
        { name: "Lenin", jahre: "1870-1924", einfluss: ["12-2", "07-1"], id: "12-2" },
        { name: "Luxemburg", jahre: "1871-1919", einfluss: ["00-3", "00-4"], id: "00-3" },
        { name: "Bernstein", jahre: "1850-1932", einfluss: ["00-1", "00-1"], id: "00-1" },
        { name: "Kropotkin", jahre: "1842-1921", einfluss: ["12-5", "01-5"], id: "12-5" }
      ]
    },
    {
      zeit: "Dritte Generation (1920-1968)",
      denker: [
        { name: "Gramsci", jahre: "1891-1937", einfluss: ["12-3", "07-3"], id: "12-3" },
        { name: "Adorno", jahre: "1903-1969", einfluss: ["17-2", "25-1"], id: "17-2" },
        { name: "Beauvoir", jahre: "1908-1986", einfluss: ["09-3", "09-5"], id: "09-5" },
        { name: "Fanon", jahre: "1925-1961", einfluss: ["24-3", "00-5"], id: null }
      ]
    },
    {
      zeit: "Vierte Generation (1968-2000)",
      denker: [
        { name: "Bookchin", jahre: "1921-2006", einfluss: ["08-5", "22-4"], id: "08-5" },
        { name: "Federici", jahre: "*1942", einfluss: ["09-4", "09-5"], id: "09-4" },
        { name: "E.O. Wright", jahre: "1947-2019", einfluss: ["17-4", "00-2"], id: "17-4" },
        { name: "Poulantzas", jahre: "1936-1979", einfluss: ["12-3"], id: "12-3" }
      ]
    },
    {
      zeit: "Fünfte Generation (2000-heute)",
      denker: [
        { name: "Hardt/Negri", jahre: "*1960/*1933", einfluss: ["09-4", "12-4"], id: "09-4" },
        { name: "Graeber", jahre: "1961-2020", einfluss: ["12-5", "16-5"], id: "16-5" },
        { name: "Fraser", jahre: "*1947", einfluss: ["09-3", "09-4"], id: "09-3" },
        { name: "Srnicek/Williams", jahre: "*1982/*1988", einfluss: ["16-5", "17-5"], id: "16-5" }
      ]
    }
  ];
  
  let html = `
    <div class="stammbaum-header">
      <h2>🌳 Genealogie der Ideen</h2>
      <p>Wer beeinflusste wen? Die Ahnenreihen des linken Denkens.</p>
    </div>
    <div class="stammbaum-timeline">
  `;
  
  generationen.forEach((gen, i) => {
    html += `<div class="stammbaum-epoche">`;
    html += `<div class="stammbaum-zeit">${gen.zeit}</div>`;
    html += '<div class="stammbaum-generation">';
    
    gen.denker.forEach(d => {
      const clickHandler = d.id ? `onclick="showKnoten('${d.id}')"` : '';
      const clickableClass = d.id ? 'clickable' : '';
      const einflussTags = d.einfluss.slice(0, 2).map(e => `<span class="einfluss-tag">${e}</span>`).join('');
      
      html += `<div class="stammbaum-knoten ${clickableClass}" ${clickHandler}>
        <div class="name">${d.name}</div>
        <div class="zeit">${d.jahre}</div>
        <div class="einfluss-tags">${einflussTags}</div>
      </div>`;
    });
    
    html += '</div></div>';
  });
  
  html += '</div>';
  
  html += `<div class="stammbaum-footer">
    <strong>Lesehinweis:</strong> Klickbare Namen (mit grünem Rand) führen zu Positionen im Netzwerk. Nicht alle Denker*innen sind als eigene Position erfasst — manche sind über ihre Ideen präsent.
  </div>`;
  
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// DIALOGE: Imaginäre Gespräche
// ══════════════════════════════════════════════════════════════════════

function initDialoge() {
  const container = document.getElementById('dialoge-container');
  
  const dialoge = [
    {
      titel: "Reform oder Revolution?",
      sprecher1: { name: "Rosa Luxemburg", position: "00-3" },
      sprecher2: { name: "Eduard Bernstein", position: "00-1" },
      zeilen: [
        { autor: 1, text: "Die Sozialreform ist nicht dem Endziel entgegengesetzt, aber sie ist kein Mittel zur Erreichung des Endziels. Sie ist das Endziel selbst!" },
        { autor: 2, text: "Aber der Kapitalismus bricht nicht zusammen, Rosa. Wir müssen ihn Schritt für Schritt transformieren." },
        { autor: 1, text: "Und wenn die Herrschenden diese Schritte nicht zulassen? Wenn sie die Spielregeln ändern, sobald wir zu gewinnen drohen?" },
        { autor: 2, text: "Dann haben wir die demokratischen Institutionen gestärkt, die uns schützen." },
        { autor: 1, text: "Die Institutionen der Bourgeoisie werden nie gegen die Bourgeoisie schützen. Die Doppelstrategie — Reform UND Vorbereitung auf den Bruch — das ist der Weg." }
      ]
    },
    {
      titel: "Staat zerschlagen oder besetzen?",
      sprecher1: { name: "Bakunin", position: "12-5" },
      sprecher2: { name: "Lenin", position: "12-2" },
      zeilen: [
        { autor: 2, text: "Der bürgerliche Staat muss zerschlagen werden, ja. Aber nur um durch einen proletarischen Staat ersetzt zu werden." },
        { autor: 1, text: "Ein Staat ist ein Staat! Er wird dieselben Herrschaftsstrukturen reproduzieren, egal wer ihn führt." },
        { autor: 2, text: "Der Staat stirbt ab, Michail. Er ist nur ein Werkzeug für die Übergangsperiode." },
        { autor: 1, text: "Ha! Wann ist je ein Staat freiwillig abgestorben? Die neuen Herren werden neue Gründe finden, ihre Macht zu behalten." },
        { autor: 2, text: "Ohne Staat können wir uns nicht gegen die Konterrevolution verteidigen." },
        { autor: 1, text: "Die größte Konterrevolution kommt von innen — von denen, die im Namen der Revolution herrschen." }
      ]
    },
    {
      titel: "Klasse oder Multitude?",
      sprecher1: { name: "Traditioneller Marxist", position: "09-2" },
      sprecher2: { name: "Hardt/Negri", position: "09-4" },
      zeilen: [
        { autor: 1, text: "Die Arbeiterklasse ist das revolutionäre Subjekt. Punkt. Alles andere ist kleinbürgerliche Ablenkung." },
        { autor: 2, text: "Aber wer ist heute noch 'die Arbeiterklasse'? Prekäre, Migrant*innen, Care-Arbeiter*innen, Studierende — sie alle produzieren Wert." },
        { autor: 1, text: "Und genau deshalb verschwimmt alles in eurem Begriff 'Multitude'. Wer führt? Wer organisiert?" },
        { autor: 2, text: "Niemand führt. Das ist der Punkt. Schwarmorganisation, Netzwerke, emergente Strategien." },
        { autor: 1, text: "Und deshalb scheitern eure Bewegungen. Occupy, Arabischer Frühling — viel Energie, keine dauerhafte Struktur." },
        { autor: 2, text: "Vielleicht ist 'Scheitern' das falsche Wort. Vielleicht transformieren sie die Welt auf Weisen, die eure Kategorien nicht erfassen." }
      ]
    }
  ];
  
  let html = '<h2 style="color: #2196F3; margin-bottom: 0.5rem;">🗣️ Imaginäre Dialoge</h2>';
  html += '<p style="color: #888; margin-bottom: 2rem;">Gespräche, die so nie stattfanden — aber hätten stattfinden können.</p>';
  
  dialoge.forEach(d => {
    html += '<div class="dialog-box">';
    html += `<div class="dialog-header">
      <h3 style="color: #fff; margin: 0;">${d.titel}</h3>
      <div>
        <span class="dialog-sprecher links" onclick="showKnoten('${d.sprecher1.position}')">${d.sprecher1.name}</span>
        <span style="color: #666; margin: 0 0.5rem;">vs.</span>
        <span class="dialog-sprecher rechts" onclick="showKnoten('${d.sprecher2.position}')">${d.sprecher2.name}</span>
      </div>
    </div>`;
    
    d.zeilen.forEach(z => {
      const seite = z.autor === 1 ? 'links' : 'rechts';
      const name = z.autor === 1 ? d.sprecher1.name : d.sprecher2.name;
      html += `<div class="dialog-zeile ${seite}">
        <div class="autor">${name}:</div>
        <div class="text">"${z.text}"</div>
      </div>`;
    });
    
    html += '</div>';
  });
  
  html += `<div style="margin-top: 1rem; padding: 1rem; background: #252525; border-radius: 8px; color: #888; max-width: 600px; margin-left: auto; margin-right: auto;">
    <strong style="color: #2196F3;">📝 Hinweis:</strong> Diese Dialoge sind fiktiv, aber basieren auf realen Positionen und Argumenten. Sie dienen der Veranschaulichung, nicht der historischen Dokumentation.
  </div>`;
  
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// ZITATE: Thematisch sortiert
// ══════════════════════════════════════════════════════════════════════

function initZitate() {
  const container = document.getElementById('zitate-container');
  
  // Sammle alle Zitate aus knotenData
  const alleZitate = [];
  Object.values(knotenData).forEach(k => {
    if (k.zitate && k.zitate.length > 0) {
      k.zitate.forEach(z => {
        alleZitate.push({
          text: z.text,
          autor: z.autor,
          quelle: z.quelle,
          jahr: z.jahr,
          position: k.id,
          positionName: k.name
        });
      });
    }
  });
  
  // Thematische Kategorien
  const themen = {
    "Revolution & Strategie": ["revolution", "reform", "kampf", "macht", "staat", "bewegung"],
    "Klasse & Subjekt": ["klasse", "arbeiter", "proletariat", "volk", "masse"],
    "Ökonomie & Eigentum": ["eigentum", "kapital", "produktion", "arbeit", "markt"],
    "Utopie & Vision": ["zukunft", "freiheit", "emanzipation", "befreiung", "möglich"],
    "Kritik & Negation": ["kritik", "ideologie", "herrschaft", "unterdrückung"]
  };
  
  let html = '<h2 style="color: #FF9800; margin-bottom: 0.5rem;">💬 Zitate-Sammlung</h2>';
  html += '<p style="color: #888; margin-bottom: 2rem;">Die Stimmen des linken Denkens — thematisch sortiert.</p>';
  
  // Zufällige Auswahl wenn zu viele
  const shuffled = alleZitate.sort(() => Math.random() - 0.5);
  const ausgewählt = shuffled.slice(0, 20);
  
  ausgewählt.forEach(z => {
    html += `<div class="zitat-card">
      <div class="zitat-text">"${z.text}"</div>
      <div class="zitat-quelle">
        <span class="zitat-autor" onclick="showKnoten('${z.position}')">${z.autor} → ${z.positionName}</span>
        <span>${z.quelle || ''} ${z.jahr ? '(' + z.jahr + ')' : ''}</span>
      </div>
    </div>`;
  });
  
  if (alleZitate.length === 0) {
    html += '<p style="color: #666; text-align: center;">Keine Zitate gefunden.</p>';
  }
  
  html += `<div style="margin-top: 1rem; text-align: center; color: #666;">
    ${alleZitate.length} Zitate aus ${Object.keys(knotenData).length} Positionen
    <br><button onclick="initZitate()" style="margin-top: 0.5rem; background: #333; border: none; color: #aaa; padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;">🎲 Neue Auswahl</button>
  </div>`;
  
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// KONFIGURATOR: Baue deine eigene Position
// ══════════════════════════════════════════════════════════════════════

let konfigAuswahl = {};

// Generator-Profil Variablen (werden von URL-Params oder Generator gesetzt)
let generatorProfil = null;
let generatorArchetyp = null;
let generatorName = null;
let generatorKnoten = null; // z.B. ["08-4", "16-4", "00-4"]

function initKonfigurator() {
  // Verwende die neue Render-Funktion (unterstützt sowohl Generator-Profil als auch manuellen Modus)
  renderKonfiguratorMitProfil();
}

function selectKonfig(achse, pos) {
  konfigAuswahl[achse] = pos;
  
  // Auch generatorProfil aktualisieren wenn vorhanden
  if (generatorProfil) {
    generatorProfil[achse] = pos;
  }
  
  // Komplett neu rendern mit neuer Auswahl
  renderKonfiguratorMitProfil();
}

// ══════════════════════════════════════════════════════════════════════
// FIEBERKURVE: Was ist gerade heiß?
// ══════════════════════════════════════════════════════════════════════

function initFieber() {
  const container = document.getElementById('fieber-container');
  
  // Berechne "Temperatur" basierend auf:
  // - Anzahl Verbindungen
  // - Anzahl Debatten
  // - Aktualität (geschätzt)
  
  const temperaturen = Object.values(knotenData).map(k => {
    let temp = 0;
    let debatten = 0;
    
    // Verbindungen zählen
    verbindungenData.forEach(v => {
      if (v.von === k.id || v.zu === k.id) {
        temp += v.staerke * 10;
        if (v.typ === 'debatte') debatten++;
      }
    });
    
    // Aktualitätsbonus für bestimmte Themen
    const heisseThemen = ['Ökosozialismus', 'Post-Work', 'Grundeinkommen', 'Intersektionalität', 'Multitude', 'Care-Revolution'];
    if (heisseThemen.some(t => k.name.includes(t))) {
      temp += 15;
    }
    
    // Debatten erhöhen Temperatur
    temp += debatten * 10;
    
    return { 
      id: k.id, 
      name: k.name, 
      temp: Math.min(100, temp),
      debatten: debatten
    };
  }).sort((a, b) => b.temp - a.temp);
  
  let html = '<h2 style="color: #f44336; margin-bottom: 0.5rem;">🌡️ Fieberkurve des linken Denkens</h2>';
  html += '<p style="color: #888; margin-bottom: 2rem;">Was wird gerade heiß diskutiert? Basierend auf Vernetzung und aktuellen Debatten.</p>';
  
  // Legende
  html += `<div style="display: flex; gap: 2rem; margin-bottom: 2rem; justify-content: center;">
    <span><span style="display: inline-block; width: 12px; height: 12px; background: linear-gradient(to right, #FF9800, #f44336); border-radius: 2px;"></span> Heiß (60+)</span>
    <span><span style="display: inline-block; width: 12px; height: 12px; background: linear-gradient(to right, #4CAF50, #FF9800); border-radius: 2px;"></span> Warm (30-60)</span>
    <span><span style="display: inline-block; width: 12px; height: 12px; background: linear-gradient(to right, #2196F3, #4CAF50); border-radius: 2px;"></span> Kühl (10-30)</span>
    <span><span style="display: inline-block; width: 12px; height: 12px; background: #444; border-radius: 2px;"></span> Kalt (<10)</span>
  </div>`;
  
  html += '<div class="fieber-skala">';
  
  temperaturen.slice(0, 30).forEach(t => {
    let klasse = 'tot';
    if (t.temp >= 60) klasse = 'heiss';
    else if (t.temp >= 30) klasse = 'warm';
    else if (t.temp >= 10) klasse = 'kalt';
    
    html += `<div class="fieber-zeile">
      <span class="fieber-label" onclick="showKnoten('${t.id}')">${t.name}</span>
      <div class="fieber-bar">
        <div class="fieber-fill ${klasse}" style="width: ${t.temp}%;"></div>
      </div>
      <span style="width: 40px; text-align: right; color: #666; font-size: 0.8rem;">${Math.round(t.temp)}°</span>
    </div>`;
  });
  
  html += '</div>';
  
  // Statistik
  const heiss = temperaturen.filter(t => t.temp >= 60).length;
  const kalt = temperaturen.filter(t => t.temp < 10).length;
  
  html += `<div style="margin-top: 2rem; padding: 1rem; background: #252525; border-radius: 8px; color: #888; max-width: 600px; margin-left: auto; margin-right: auto;">
    <strong style="color: #f44336;">Diagnose:</strong> ${heiss} heiße Positionen, ${kalt} kalte. 
    Die heißesten Debatten finden um Grundfragen von Subjekt, Staat und Transformation statt.
  </div>`;
  
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════
// PERSONEN-DATENBANK: Vollständige Biografien
// ══════════════════════════════════════════════════════════════════════

const personenDB = {
  // Werden geladen aus externer Quelle oder inline
};

// ══════════════════════════════════════════════════════════════════════
// SUCH-FUNKTION
// ══════════════════════════════════════════════════════════════════════

function initSuche() {
  // Such-Event-Listener
  const suchfeld = document.getElementById('suche-input');
  if (suchfeld) {
    suchfeld.addEventListener('input', debounce(function(e) {
      const query = e.target.value.trim().toLowerCase();
      if (query.length >= 2) {
        zeigeSuchergebnisse(query);
      } else {
        document.getElementById('suche-ergebnisse').innerHTML = '';
        document.getElementById('suche-ergebnisse').style.display = 'none';
      }
    }, 300));
  }
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function zeigeSuchergebnisse(query) {
  const ergebnisse = {
    positionen: [],
    personen: [],
    zitate: []
  };
  
  // Positionen durchsuchen
  Object.values(knotenData).forEach(k => {
    if (k.name.toLowerCase().includes(query) || 
        k.beschreibung.toLowerCase().includes(query)) {
      ergebnisse.positionen.push({
        id: k.id,
        name: k.name,
        achse: k.achse,
        match: k.name.toLowerCase().includes(query) ? 'name' : 'beschreibung'
      });
    }
  });
  
  // Stammbaum-Personen durchsuchen
  stammbaumData.stroemungen.forEach(s => {
    if (s.name.toLowerCase().includes(query) ||
        (s.kernidee && s.kernidee.toLowerCase().includes(query))) {
      ergebnisse.personen.push({
        id: s.id,
        name: s.name,
        epoche: s.epoche,
        kernidee: s.kernidee
      });
    }
  });
  
  // Zitate durchsuchen
  Object.values(knotenData).forEach(k => {
    if (k.zitate) {
      k.zitate.forEach(z => {
        if (z.text.toLowerCase().includes(query) ||
            z.autor.toLowerCase().includes(query)) {
          ergebnisse.zitate.push({
            text: z.text,
            autor: z.autor,
            quelle: z.quelle,
            knotenId: k.id,
            knotenName: k.name
          });
        }
      });
    }
  });
  
  // Ergebnisse anzeigen
  const container = document.getElementById('suche-ergebnisse');
  
  if (ergebnisse.positionen.length === 0 && 
      ergebnisse.personen.length === 0 && 
      ergebnisse.zitate.length === 0) {
    container.innerHTML = `<div class="suche-leer">Keine Ergebnisse für "${query}"</div>`;
    container.style.display = 'block';
    return;
  }
  
  let html = '';
  
  if (ergebnisse.positionen.length > 0) {
    html += `<div class="suche-kategorie">
      <div class="suche-kategorie-titel">📍 Positionen (${ergebnisse.positionen.length})</div>
      ${ergebnisse.positionen.slice(0, 5).map(p => `
        <div class="suche-item" onclick="showKnoten('${p.id}'); closeSuche();">
          <span class="suche-item-name">${p.name}</span>
          <span class="suche-item-meta">${p.achse}</span>
        </div>
      `).join('')}
    </div>`;
  }
  
  if (ergebnisse.personen.length > 0) {
    html += `<div class="suche-kategorie">
      <div class="suche-kategorie-titel">👤 Denker*innen (${ergebnisse.personen.length})</div>
      ${ergebnisse.personen.slice(0, 5).map(p => `
        <div class="suche-item" onclick="showStammbaumPerson('${p.id}'); closeSuche();">
          <span class="suche-item-name">${p.name}</span>
          <span class="suche-item-meta">${p.kernidee ? p.kernidee.substring(0, 50) + '...' : ''}</span>
        </div>
      `).join('')}
    </div>`;
  }
  
  if (ergebnisse.zitate.length > 0) {
    html += `<div class="suche-kategorie">
      <div class="suche-kategorie-titel">💬 Zitate (${ergebnisse.zitate.length})</div>
      ${ergebnisse.zitate.slice(0, 3).map(z => `
        <div class="suche-item" onclick="showKnoten('${z.knotenId}'); closeSuche();">
          <span class="suche-item-zitat">"${z.text.substring(0, 80)}..."</span>
          <span class="suche-item-meta">— ${z.autor}</span>
        </div>
      `).join('')}
    </div>`;
  }
  
  container.innerHTML = html;
  container.style.display = 'block';
}

function closeSuche() {
  document.getElementById('suche-ergebnisse').style.display = 'none';
  document.getElementById('suche-input').value = '';
}


function initStammbaum() {
  const container = document.getElementById('stammbaum-container');
  
  // SVG-Dimensionen
  const width = 1600;
  const marginLeft = 180;
  const marginTop = 60;
  const epocheHeight = 100;
  const personRadius = 14;
  
  // Personen pro Epoche gruppieren
  const personenProEpoche = {};
  stammbaumData.epochen.forEach(e => personenProEpoche[e.id] = []);
  stammbaumData.stroemungen.forEach(s => {
    if (personenProEpoche[s.epoche]) {
      personenProEpoche[s.epoche].push(s);
    }
  });
  
  // Höhe berechnen
  const height = marginTop + stammbaumData.epochen.length * epocheHeight + 100;
  
  // Epoche Y-Position
  const getY = (epocheId) => {
    const epoche = stammbaumData.epochen.find(e => e.id === epocheId);
    return marginTop + (epoche ? epoche.y * epocheHeight : 0) + epocheHeight / 2;
  };
  
  // Person X-Position automatisch berechnen
  const getX = (personId) => {
    const person = stammbaumData.stroemungen.find(s => s.id === personId);
    if (!person) return width / 2;
    
    const personen = personenProEpoche[person.epoche];
    const index = personen.findIndex(p => p.id === personId);
    const count = personen.length;
    
    // Verfügbare Breite
    const availableWidth = width - marginLeft - 100;
    const spacing = availableWidth / (count + 1);
    
    return marginLeft + spacing * (index + 1);
  };
  
  const getPos = (id) => {
    const s = stammbaumData.stroemungen.find(st => st.id === id);
    if (!s) return { x: width/2, y: height/2 };
    return { x: getX(s.id), y: getY(s.epoche) };
  };
  
  // SVG erstellen
  let svg = `<svg class="stammbaum-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Hintergrund-Epochen
  stammbaumData.epochen.forEach(epoche => {
    const y = marginTop + epoche.y * epocheHeight;
    svg += `
      <g class="stammbaum-epoche">
        <rect x="10" y="${y}" width="${width - 20}" height="${epocheHeight - 8}" 
              fill="${epoche.farbe}" opacity="0.1" rx="4"/>
        <text x="25" y="${y + 20}" class="stammbaum-epoche-label">${epoche.name}</text>
        <text x="25" y="${y + 35}" class="stammbaum-zeit-label">${epoche.zeit}</text>
      </g>
    `;
  });
  
  // Verbindungslinien - dünner
  stammbaumData.verbindungen.forEach(v => {
    const von = getPos(v.von);
    const zu = getPos(v.zu);
    const klasse = v.typ === 'konflikt' ? 'konflikt' : 'einfluss';
    
    // Sanfte Kurve
    const midY = (von.y + zu.y) / 2;
    const ctrlX = (von.x + zu.x) / 2;
    svg += `<path class="stammbaum-linie ${klasse}" 
                  d="M ${von.x} ${von.y} C ${von.x} ${midY}, ${zu.x} ${midY}, ${zu.x} ${zu.y}"/>`;
  });
  
  // Personen/Strömungen
  stammbaumData.stroemungen.forEach((s) => {
    const pos = getPos(s.id);
    const r = s.wichtig ? personRadius + 3 : personRadius;
    const epoche = stammbaumData.epochen.find(e => e.id === s.epoche);
    const farbe = epoche ? epoche.farbe : '#888';
    
    // Kurzer Name (max 12 Zeichen)
    const kurzName = s.name.length > 12 ? s.name.substring(0, 11) + '…' : s.name;
    
    svg += `
      <g class="stammbaum-person" onclick="showStammbaumPerson('${s.id}')" transform="translate(${pos.x}, ${pos.y})">
        <circle r="${r}" fill="${farbe}" opacity="0.9"/>
        ${s.wichtig ? `<circle r="${r + 3}" fill="none" stroke="${farbe}" stroke-width="2" opacity="0.5"/>` : ''}
        <text y="${r + 12}" class="stammbaum-label">${kurzName}</text>
      </g>
    `;
  });
  
  svg += '</svg>';
  
  // Legende
  const legende = `
    <div class="stammbaum-legende">
      <div class="stammbaum-legende-item">
        <div class="stammbaum-legende-linie" style="background: #4CAF50;"></div>
        <span>Einfluss</span>
      </div>
      <div class="stammbaum-legende-item">
        <div class="stammbaum-legende-linie" style="background: #f44336; border-style: dotted;"></div>
        <span>Konflikt</span>
      </div>
      <div class="stammbaum-legende-item">
        <span style="display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid #888;margin-right:0.5rem;"></span>
        <span>Zentrale Figur</span>
      </div>
    </div>
  `;
  
  container.innerHTML = `
    <div class="stammbaum-wrapper">
      ${svg}
    </div>
    ${legende}
  `;
}

function showEpoche(epocheId) {
  const epoche = stammbaumData.epochen.find(e => e.id === epocheId);
  if (!epoche) return;
  
  const personen = stammbaumData.stroemungen.filter(s => s.epoche === epocheId);
  
  document.getElementById('detail-content').innerHTML = `
    <span class="achse-tag" style="background: ${epoche.farbe}; color: #000;">${epoche.zeit}</span>
    <h2>${epoche.name}</h2>
    <p class="beschreibung">${epoche.beschreibung}</p>
    <h3>👤 Denker*innen dieser Epoche</h3>
    <div class="verbindungen">
      ${personen.map(p => `<span class="verbindung" onclick="showStammbaumPerson('${p.id}')">${p.name}</span>`).join('')}
    </div>
  `;
  document.getElementById('detail-panel').classList.add('open');
}

function showStammbaumPerson(personId) {
  const person = stammbaumData.stroemungen.find(s => s.id === personId);
  if (!person) return;
  
  const epoche = stammbaumData.epochen.find(e => e.id === person.epoche);
  
  // Finde Einflüsse
  const beeinflusst_von = stammbaumData.verbindungen
    .filter(v => v.zu === personId && v.typ === 'einfluss')
    .map(v => stammbaumData.stroemungen.find(s => s.id === v.von))
    .filter(Boolean);
    
  const beeinflusst = stammbaumData.verbindungen
    .filter(v => v.von === personId && v.typ === 'einfluss')
    .map(v => stammbaumData.stroemungen.find(s => s.id === v.zu))
    .filter(Boolean);
    
  const konflikte = stammbaumData.verbindungen
    .filter(v => (v.von === personId || v.zu === personId) && v.typ === 'konflikt')
    .map(v => {
      const otherId = v.von === personId ? v.zu : v.von;
      return stammbaumData.stroemungen.find(s => s.id === otherId);
    })
    .filter(Boolean);
  
  document.getElementById('detail-content').innerHTML = `
    <span class="achse-tag" style="background: ${epoche?.farbe || '#888'}; color: #000;">${epoche?.name || ''}</span>
    <h2>${person.name}</h2>
    ${person.leben ? `<p style="color: var(--text-secondary); margin-bottom: 1rem;">📅 ${person.leben}</p>` : ''}
    <p class="beschreibung">${person.kernidee}</p>
    
    ${person.werke?.length ? `
      <h3>📚 Hauptwerke</h3>
      <div class="bewohner">
        ${person.werke.map(w => `<span style="background:#2a2a2a;padding:0.3rem 0.6rem;border-radius:3px;font-size:0.85rem;">${w}</span>`).join('')}
      </div>
    ` : ''}
    
    ${beeinflusst_von.length ? `
      <h3>📥 Beeinflusst von</h3>
      <div class="verbindungen">
        ${beeinflusst_von.map(p => `<span class="verbindung" onclick="showStammbaumPerson('${p.id}')">${p.name}</span>`).join('')}
      </div>
    ` : ''}
    
    ${beeinflusst.length ? `
      <h3>📤 Hat beeinflusst</h3>
      <div class="verbindungen">
        ${beeinflusst.map(p => `<span class="verbindung" onclick="showStammbaumPerson('${p.id}')">${p.name}</span>`).join('')}
      </div>
    ` : ''}
    
    ${konflikte.length ? `
      <h3>⚔️ Konflikte mit</h3>
      <div class="verbindungen">
        ${konflikte.map(p => `<span class="verbindung debatte" onclick="showStammbaumPerson('${p.id}')">${p.name}</span>`).join('')}
      </div>
    ` : ''}
    
    <div style="margin-top: 2rem;">
      <button onclick="searchPerson('${person.name}')" style="background: var(--accent); border: none; color: #000; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
        🔍 In Positionen suchen
      </button>
    </div>
  `;
  document.getElementById('detail-panel').classList.add('open');
}

// ══════════════════════════════════════════════════════════════════════
// PERSONEN: Alle Bewohner*innen des Hauses
// ══════════════════════════════════════════════════════════════════════

let personenData = [];

// Personen-Daten aus externer JSON laden
async function loadPersonenData() {
  try {
    const response = await fetch('data/personen.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    personenData = data.personen;
    console.log(`✅ ${personenData.length} Personen geladen`);
    
    // Stats aktualisieren
    document.getElementById('stats').textContent = `${Object.keys(knotenData).length} Positionen · ${verbindungenData.length} Verbindungen · ${personenData.length} Personen`;
    
    // Personen zum Netzwerk hinzufügen falls bereits initialisiert
    if (typeof addPersonSpheresToNetwork === 'function') {
    }
  } catch (e) {
    console.error('Fehler beim Laden der Personen:', e);
    document.getElementById('stats').textContent = `${Object.keys(knotenData).length} Positionen · ${verbindungenData.length} Verbindungen · Personen: Ladefehler`;
  }
}

let personenFilter = 'alle';

function initPersonen() {
  const container = document.getElementById('personen-container');
  
  // Wenn noch keine Daten, erst laden
  if (personenData.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #888;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
        <div>Lade Personen-Daten...</div>
      </div>
    `;
    // Laden und dann erneut aufrufen
    loadPersonenData().then(() => {
      initPersonen();
    });
    return;
  }
  
  const kategorien = {
    'alle': 'Alle',
    'klassiker': '🏛️ Klassiker',
    'revolutionaer': '✊ Revolutionär',
    'frankfurt': '📚 Frankfurt',
    'feminismus': '♀️ Feminismus',
    'oekologie': '🌿 Ökologie',
    'autonomie': '🏴 Autonomie',
    'operaismus': '⚙️ Operaismus',
    'analytisch': '🧮 Analytisch',
    'zeitgenoessisch': '🔮 Zeitgenössisch',
    'postkolonial': '🌍 Postkolonial',
    'deutsch': '🇩🇪 Deutschsprachig'
  };
  
  let html = '<h2 style="color: #9C27B0; margin-bottom: 0.5rem; text-align: center;">👤 Die Bewohner*innen des Hauses</h2>';
  html += '<p style="color: #888; margin-bottom: 1.5rem; text-align: center;">Wer denkt, streitet und arbeitet hier?</p>';
  
  // Filter
  html += '<div class="personen-filter">';
  Object.entries(kategorien).forEach(([key, label]) => {
    const active = personenFilter === key ? 'active' : '';
    html += `<button class="${active}" onclick="filterPersonen('${key}')">${label}</button>`;
  });
  html += '</div>';
  
  // Grid
  html += '<div class="personen-grid">';
  
  const gefiltert = personenFilter === 'alle' 
    ? personenData 
    : personenData.filter(p => p.kategorie === personenFilter);
  
  gefiltert.forEach(p => {
    const initialen = p.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    const lebenStr = p.leben || (p.gestorben ? `${p.geboren}-${p.gestorben}` : `*${p.geboren}`);
    const lebt = p.leben ? p.leben.startsWith('*') : (p.gestorben === null);
    
    html += `<div class="person-card" onclick="showPerson('${p.id}')">
      <div class="header">
        <div class="avatar">${initialen}</div>
        <div class="info">
          <div class="name">${p.name} ${lebt ? '🟢' : ''}</div>
          <div class="leben">${lebenStr}</div>
        </div>
      </div>
      <div class="bio">${p.bio || p.kurzbio || ''}</div>
      <div class="positionen">
        ${(p.positionen || p.hauptzimmer || []).slice(0, 3).map(pos => {
          const k = knotenData[pos];
          return k ? `<span class="pos-tag" onclick="event.stopPropagation(); showKnoten('${pos}')">${k.name}</span>` : '';
        }).join('')}
      </div>
    </div>`;
  });
  
  html += '</div>';
  
  html += `<div style="margin-top: 2rem; text-align: center; color: #666;">
    ${personenData.length} Denker*innen · ${personenData.filter(p => p.leben ? p.leben.startsWith('*') : p.gestorben === null).length} leben noch
  </div>`;
  
  container.innerHTML = html;
}

function filterPersonen(kat) {
  personenFilter = kat;
  initPersonen();
}

function showPerson(id) {
  const p = personenData.find(x => x.id === id);
  if (!p) return;
  
  // Hilfsfunktion: ID zu lesbarem Namen
  const idToName = (bid) => {
    const b = personenData.find(x => x.id === bid);
    if (b) {
      return `<span style="cursor: pointer; text-decoration: underline; color: #aaa;" onclick="showPerson('${bid}')">${b.name}</span>`;
    } else {
      // ID zu lesbarem Namen konvertieren (z.B. "von_parijs" → "Von Parijs")
      const readable = bid.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return `<span style="color: #666;" title="Nicht in Datenbank">${readable}</span>`;
    }
  };
  
  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'person-overlay';
  overlay.onclick = () => { overlay.remove(); detail.remove(); };
  document.body.appendChild(overlay);
  
  // Detail
  const detail = document.createElement('div');
  detail.className = 'person-detail';
  
  // Leben-String erstellen (unterstützt beide Formate)
  const lebenStr = p.leben || (p.gestorben ? `${p.geboren}-${p.gestorben}` : `*${p.geboren}`);
  const lebt = p.leben ? p.leben.startsWith('*') : (p.gestorben === null);
  
  // Zitate HTML
  const zitateHtml = p.zitate && p.zitate.length > 0 ? `
    <h3 style="color: #FF9800; font-size: 0.9rem; margin-bottom: 0.5rem;">💬 Zitate:</h3>
    <div style="margin-bottom: 1.5rem;">
      ${p.zitate.slice(0, 2).map(z => `
        <blockquote style="border-left: 2px solid #FF9800; padding-left: 1rem; margin: 0.5rem 0; color: #ccc; font-style: italic;">
          "${z.text}"
          <footer style="color: #666; font-size: 0.8rem; font-style: normal; margin-top: 0.3rem;">— ${z.quelle}${z.jahr ? ` (${z.jahr})` : ''}</footer>
        </blockquote>
      `).join('')}
    </div>
  ` : '';
  
  // Werke HTML
  const werkeHtml = p.hauptwerke && p.hauptwerke.length > 0 ? `
    <h3 style="color: #2196F3; font-size: 0.9rem; margin-bottom: 0.5rem;">📚 Hauptwerke:</h3>
    <div style="margin-bottom: 1.5rem; color: #aaa; font-size: 0.85rem;">
      ${p.hauptwerke.slice(0, 4).map(w => `<div>• ${w.titel} (${w.jahr})</div>`).join('')}
    </div>
  ` : '';
  
  // Beeinflusst von HTML
  const beeinflusstVonHtml = p.beeinflusst_von && p.beeinflusst_von.length > 0 ? `
    <h3 style="color: #9C27B0; font-size: 0.9rem; margin-bottom: 0.5rem;">← Beeinflusst von:</h3>
    <div style="color: #888; margin-bottom: 1rem; font-size: 0.85rem;">
      ${p.beeinflusst_von.map(idToName).join(', ')}
    </div>
  ` : '';
  
  // Beeinflusste HTML
  const beeinflussteHtml = p.beeinflusst && p.beeinflusst.length > 0 ? `
    <h3 style="color: #4CAF50; font-size: 0.9rem; margin-bottom: 0.5rem;">→ Beeinflusste:</h3>
    <div style="color: #888; margin-bottom: 1rem; font-size: 0.85rem;">
      ${p.beeinflusst.map(idToName).join(', ')}
    </div>
  ` : '';
  
  // Debattierte mit HTML
  const debattenHtml = p.debattiert_mit && p.debattiert_mit.length > 0 ? `
    <h3 style="color: #f44336; font-size: 0.9rem; margin-bottom: 0.5rem;">⚔️ Debattierte mit:</h3>
    <div style="color: #888; margin-bottom: 1rem; font-size: 0.85rem;">
      ${p.debattiert_mit.map(idToName).join(', ')}
    </div>
  ` : '';
  
  // Tags HTML
  const tagsHtml = p.tags && p.tags.length > 0 ? `
    <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 1rem;">
      ${p.tags.map(t => `<span style="background: #333; color: #888; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.7rem;">#${t}</span>`).join('')}
    </div>
  ` : '';
  
  detail.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
      <div>
        <h2 style="color: #fff; margin: 0;">${p.name}</h2>
        <div style="color: #666;">${lebenStr} ${lebt ? '🟢' : ''} ${p.herkunft ? `· ${p.herkunft}` : ''}</div>
      </div>
      <button onclick="this.closest('.person-detail').remove(); document.querySelector('.person-overlay').remove();" style="background: none; border: none; color: #666; font-size: 1.5rem; cursor: pointer;">×</button>
    </div>
    
    <p style="color: #aaa; line-height: 1.6; margin-bottom: 1.5rem;">${p.bio}</p>
    
    ${zitateHtml}
    
    <h3 style="color: #E53935; font-size: 0.9rem; margin-bottom: 0.5rem;">🏠 Wohnt in:</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
      ${(p.positionen || p.hauptzimmer || []).map(pos => {
        const k = knotenData[pos];
        return k ? `<span style="background: rgba(229,57,53,0.2); color: #E53935; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;" onclick="showKnoten('${pos}'); this.closest('.person-detail').remove(); document.querySelector('.person-overlay').remove();">${k.name}</span>` : '';
      }).join('')}
    </div>
    
    ${p.besucht && p.besucht.length > 0 ? `
      <div style="color: #666; font-size: 0.8rem; margin-bottom: 1.5rem;">
        Besucht auch: ${p.besucht.map(pos => {
          const k = knotenData[pos];
          return k ? `<span style="cursor: pointer; text-decoration: underline;" onclick="showKnoten('${pos}'); this.closest('.person-detail').remove(); document.querySelector('.person-overlay').remove();">${k.name}</span>` : '';
        }).join(', ')}
      </div>
    ` : ''}
    
    ${werkeHtml}
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
      <div>${beeinflusstVonHtml}</div>
      <div>${beeinflussteHtml}</div>
    </div>
    
    ${debattenHtml}
    
    ${tagsHtml}
    
    <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #333; color: #666; font-size: 0.8rem;">
      Klicke auf Positionen oder Namen um mehr zu erfahren.
    </div>
  `;
  
  document.body.appendChild(detail);
}

// ══════════════════════════════════════════════════════════════════════
// DAS ANIMIERTE WESEN
// ══════════════════════════════════════════════════════════════════════

let wesenScene, wesenCamera, wesenRenderer, wesen;
let wesenTime = 0;
let wesenMouseX = 0, wesenMouseY = 0;

const achsenFarbenWesen = [
  new THREE.Color(0xE53935), // A - Rot
  new THREE.Color(0x4CAF50), // B - Grün
  new THREE.Color(0x2196F3), // C - Blau
  new THREE.Color(0x9C27B0), // D - Lila
  new THREE.Color(0xFF9800)  // E - Orange
];

function initWesen() {
  const container = document.getElementById('wesen-container');
  const canvas = document.getElementById('wesen-canvas');
  if (!canvas) return;
  
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight - 70;
  
  wesenScene = new THREE.Scene();
  wesenScene.background = new THREE.Color(0x0a0a0a);
  
  wesenCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  wesenCamera.position.z = 5;
  
  wesenRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  wesenRenderer.setSize(width, height);
  wesenRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Das Wesen als deformierbare Kugel
  const geometry = new THREE.IcosahedronGeometry(1.5, 4);
  geometry.userData.originalPositions = geometry.attributes.position.array.slice();
  
  const material = new THREE.MeshBasicMaterial({
    color: 0xE53935,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  
  wesen = new THREE.Mesh(geometry, material);
  wesenScene.add(wesen);
  
  // Innere Kugel
  const kernGeometry = new THREE.IcosahedronGeometry(0.8, 2);
  const kernMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const kern = new THREE.Mesh(kernGeometry, kernMaterial);
  wesen.add(kern);
  
  // Partikel
  const particleCount = 300;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 2 + Math.random() * 2;
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    
    const color = achsenFarbenWesen[Math.floor(Math.random() * 5)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.6
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  wesenScene.add(particles);
  
  // Mouse tracking
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    wesenMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    wesenMouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });
  
  // Animation
  function animateWesenLoop() {
    const container = document.getElementById('wesen-container');
    if (!container || container.classList.contains('hidden')) {
      return; // Stop wenn nicht sichtbar
    }
    
    requestAnimationFrame(animateWesenLoop);
    
    wesenTime += 0.01;
    
    // Organische Deformation
    const pos = wesen.geometry.attributes.position.array;
    const orig = wesen.geometry.userData.originalPositions;
    
    for (let i = 0; i < pos.length; i += 3) {
      const ox = orig[i], oy = orig[i + 1], oz = orig[i + 2];
      
      const noise = Math.sin(ox * 2 + wesenTime) * Math.cos(oy * 2 + wesenTime * 0.7) * Math.sin(oz * 2 + wesenTime * 0.5);
      const breathe = 1 + Math.sin(wesenTime * 0.5) * 0.05;
      const pulse = 1 + Math.sin(wesenTime * 2) * 0.02;
      
      const scale = breathe * pulse * (1 + noise * 0.15);
      
      pos[i] = ox * scale;
      pos[i + 1] = oy * scale;
      pos[i + 2] = oz * scale;
    }
    
    wesen.geometry.attributes.position.needsUpdate = true;
    
    // Rotation Richtung Maus
    wesen.rotation.y += (wesenMouseX * 0.3 - wesen.rotation.y) * 0.02;
    wesen.rotation.x += (wesenMouseY * 0.2 - wesen.rotation.x) * 0.02;
    wesen.rotation.z += 0.001;
    
    // Farbwechsel
    const colorIndex = Math.floor((wesenTime * 0.1) % 5);
    const nextColorIndex = (colorIndex + 1) % 5;
    const t = (wesenTime * 0.1) % 1;
    
    const currentColor = achsenFarbenWesen[colorIndex].clone();
    currentColor.lerp(achsenFarbenWesen[nextColorIndex], t);
    wesen.material.color = currentColor;
    
    wesenRenderer.render(wesenScene, wesenCamera);
  }
  
  // Global zugänglich machen
  window.animateWesenLoop = animateWesenLoop;
  
  animateWesenLoop();
  
  // Resize
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w && h) {
      wesenCamera.aspect = w / h;
      wesenCamera.updateProjectionMatrix();
      wesenRenderer.setSize(w, h);
    }
  });
}

// ══════════════════════════════════════════════════════════════════════
// NAVIGATION: Ansichten, Filter, Werkzeuge
// ══════════════════════════════════════════════════════════════════════

// Container für Ansichten
const ansichtContainer = ['wesen', 'netzwerk', 'karte', 'liste', 'wg', 'sozial', 'oekosystem', 'zeitleiste', 'stammbaum', 'chemie', 'grundlagen'];

// Container für Werkzeuge (eigene Ansichten)
const werkzeugContainer = ['konfigurator', 'zufall', 'fragen'];

// Alle Container
const alleContainer = [...ansichtContainer, ...werkzeugContainer, 'zeit', 'stammbaum', 'dialoge', 'zitate', 'bibliothek', 'praxis', 'fieber', 'personen', 'kosmos', 'debatten', 'mediathek'];

// Aktueller Zustand (Variablen sind oben im Script definiert)

// Ansicht wechseln
function setAnsicht(ansicht) {
  aktiveAnsicht = ansicht;
  
  // Hintergrundbild nur bei Haus-Ansicht (wg)
  document.body.classList.toggle('ansicht-wg', ansicht === 'wg');
  
  // Linsen in Palette aktualisieren
  document.querySelectorAll('.linse.ansicht').forEach(l => {
    l.classList.toggle('active', l.dataset.id === ansicht);
  });
  
  // Werkzeug-Linsen deaktivieren
  document.querySelectorAll('.linse.werkzeug').forEach(l => {
    l.classList.remove('active');
  });
  
  // Gruppen automatisch öffnen wenn Kind aktiv
  const laborAnsichten = ['stammbaum', 'oekosystem', 'netzwerk', 'chemie'];
  const archivAnsichten = ['liste', 'zeitleiste', 'personen', 'karte', 'mediathek', 'grundlagen'];
  
  const gruppeLabor = document.getElementById('gruppe-labor');
  const gruppeArchiv = document.getElementById('gruppe-archiv');
  
  if (gruppeLabor) {
    gruppeLabor.classList.toggle('open', laborAnsichten.includes(ansicht));
  }
  if (gruppeArchiv) {
    gruppeArchiv.classList.toggle('open', archivAnsichten.includes(ansicht));
  }
  
  // Container wechseln - NUR display setzen, keine Klassen
  alleContainer.forEach(c => {
    const el = document.getElementById(`${c}-container`);
    if (el) {
      if (c === ansicht) {
        el.style.display = 'block';
        el.classList.remove('hidden');
      } else {
        el.style.display = 'none';
      }
    }
  });
  
  // WICHTIG: Bei Haus-Ansicht immer renderHaus aufrufen (mit aktuellem Profil!)
  if (ansicht === 'wg') {
    renderHaus('erkunden');
  }
  
  // Zeitleiste initialisieren wenn gewählt
  if (ansicht === 'zeitleiste') {
    initZeitleiste();
  }
  
  // Personen initialisieren wenn gewählt
  if (ansicht === 'personen') {
    initPersonen();
  }
  
  // Grundlagen initialisieren wenn gewählt
  if (ansicht === 'grundlagen') {
    console.log('🧭 Grundlagen aktiviert!');
    console.log('Container:', document.getElementById('grundlagen-container'));
    console.log('grundlagenData:', grundlagenData);
    initGrundlagen();
  }
  
  // Socialist Media initialisieren wenn gewählt
  if (ansicht === 'sozial') {
    if (typeof initSozial === 'function' && socialDataLoaded) {
      initSozial();
    } else if (typeof loadSocialData === 'function' && !socialDataLoaded) {
      loadSocialData();
    }
  }
  
  // Filter anwenden
  applyFilters();
  closePanel();
  closeReaktor();
  updateActiveLinsenDisplay();
  
  // Kombinierbare Filter hervorheben
  highlightCombinable('ansicht', ansicht);
}

// Filter toggle
function toggleFilter(filter) {
    
  if (aktiveFilter.has(filter)) {
    aktiveFilter.delete(filter);
  } else {
    aktiveFilter.add(filter);
    
    // NEUE LOGIK: Personen-Sphären erstellen beim ersten Aktivieren
    if (filter === 'personen' && !personSpheresCreated) {
      createPersonSpheres();
    }
  }
  
  // Linsen in Palette aktualisieren (falls noch vorhanden)
  document.querySelectorAll('.linse.filter').forEach(l => {
    l.classList.toggle('active', aktiveFilter.has(l.dataset.id));
  });
  
  // Netzwerk-Filter-Buttons aktualisieren
  document.querySelectorAll('.netzwerk-filter-btn').forEach(btn => {
    btn.classList.toggle('active', aktiveFilter.has(btn.dataset.filter));
  });
  
  // Epoche-Slider im Netzwerk zeigen/verstecken
  const epocheSliderInline = document.getElementById('epoche-slider-inline');
  if (epocheSliderInline) {
    epocheSliderInline.style.display = aktiveFilter.has('epoche') ? 'flex' : 'none';
  }
  
  // Filter-Legenden im Netzwerk zeigen/verstecken
  const legendeFieber = document.getElementById('legende-fieber');
  const legendeKonflikte = document.getElementById('legende-konflikte');
  if (legendeFieber) {
    legendeFieber.classList.toggle('visible', aktiveFilter.has('fieber'));
  }
  if (legendeKonflikte) {
    legendeKonflikte.classList.toggle('visible', aktiveFilter.has('debatten'));
  }
  
  // Globale Filter-Info-Box aktualisieren
  updateGlobalFilterInfo();
  
  // Filter anwenden
  applyFilters();
  updateActiveLinsenDisplay();
}

// Globale Filter-Info aktualisieren
function updateGlobalFilterInfo() {
  const container = document.getElementById('filter-info-global');
  if (!container) return;
  
  const hasFieber = aktiveFilter.has('fieber');
  const hasKonflikte = aktiveFilter.has('debatten');
  const hasEpoche = aktiveFilter.has('epoche');
  const hasPersonen = aktiveFilter.has('personen');
  
  document.getElementById('filter-info-fieber').style.display = hasFieber ? 'block' : 'none';
  document.getElementById('filter-info-konflikte').style.display = hasKonflikte ? 'block' : 'none';
  
  // Container nur zeigen wenn mindestens ein Filter aktiv
  container.classList.toggle('visible', hasFieber || hasKonflikte);
}

// Filter-Bar aktualisieren
function updateFilterBar() {
  const filterBar = document.getElementById('filter-bar');
  const filterChips = document.getElementById('filter-chips');
  const epocheControl = document.getElementById('epoche-control');
  
  if (aktiveFilter.size > 0) {
    filterBar.classList.add('visible');
    
    const filterNames = {
      'personen': '👤 Personen',
      'fieber': '🌡️ Fieber',
      'debatten': '⚔️ Konflikte',
      'epoche': '🌀 Epoche'
    };
    
    filterChips.innerHTML = Array.from(aktiveFilter).map(f => `
      <span class="filter-chip">
        ${filterNames[f] || f}
        <span class="remove" onclick="toggleFilter('${f}')">×</span>
      </span>
    `).join('');
    
    // Epoche-Slider zeigen wenn aktiv
    epocheControl.classList.toggle('visible', aktiveFilter.has('epoche'));
  } else {
    filterBar.classList.remove('visible');
  }
}

// Epoche aktualisieren
function updateEpoche(wert) {
  epocheWert = parseInt(wert);
  document.getElementById('epoche-wert').textContent = epocheWert === 2025 ? 'bis heute' : `bis ${epocheWert}`;
  applyFilters();
}

// Filter auf aktuelle Ansicht anwenden
function applyFilters() {
  
  // Netzwerk
  if (aktiveAnsicht === 'netzwerk' && typeof applyFiltersToNetzwerk === 'function') {
    applyFiltersToNetzwerk(aktiveFilter, epocheWert);
  }
  
  // Liste
  if (aktiveAnsicht === 'liste' && typeof applyFiltersToListe === 'function') {
    applyFiltersToListe(aktiveFilter, epocheWert);
  }
  
  // Karte
  if (aktiveAnsicht === 'karte' && typeof applyFiltersToKarte === 'function') {
    applyFiltersToKarte(aktiveFilter, epocheWert);
  }
}

// Werkzeug öffnen
function openWerkzeug(werkzeug) {
    
  // Linsen in Palette aktualisieren
  document.querySelectorAll('.linse.ansicht').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.linse.werkzeug').forEach(l => {
    l.classList.toggle('active', l.dataset.id === werkzeug);
  });
  
  // Container wechseln
  alleContainer.forEach(c => {
    const el = document.getElementById(`${c}-container`);
    if (el) {
      const isActive = c === werkzeug;
      el.classList.toggle('hidden', !isActive);
      if (isActive) {
        el.style.display = (c === 'netzwerk' || c === 'wesen') ? 'block' : 'flex';
      } else {
        el.style.display = 'none';
      }
    }
  });
  
  // Spezielle Aktionen
  if (werkzeug === 'wesen' && window.animateWesenLoop) {
    window.animateWesenLoop();
  }
  
  // Fragen initialisieren
  if (werkzeug === 'fragen') {
    initFragen();
  }
  
  closePanel();
  updateActiveLinsenDisplay();
}

// Schließt alle Werkzeug-Container und zeigt das Netzwerk
function closeAllWerkzeuge() {
  setAnsicht('netzwerk');
}

// Event-Listener registrieren

// Ansicht-Buttons
document.querySelectorAll('.ansicht-btn').forEach(btn => {
  btn.addEventListener('click', () => setAnsicht(btn.dataset.ansicht));
});

// Filter-Buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => toggleFilter(btn.dataset.filter));
});

// Werkzeug-Buttons
document.querySelectorAll('.werkzeug-btn').forEach(btn => {
  btn.addEventListener('click', () => openWerkzeug(btn.dataset.werkzeug));
});

// Init alle Ansichten
try {
    initWesen();
  } catch(e) {
  console.error('Fehler in initWesen:', e);
}

// URL-Parameter auswerten (Generator-Verbindung)
try {
  parseUrlParams();
} catch(e) {
  console.error('Fehler in parseUrlParams:', e);
}

// HINWEIS: Alle init-Funktionen werden im fetch-Callback aufgerufen (siehe oben)
// nachdem knotenData geladen wurde

// Stats aktualisieren (wird später durch loadPersonenData aktualisiert)
document.getElementById('stats').textContent = `${Object.keys(knotenData).length} Positionen · ${verbindungenData.length} Verbindungen · Personen laden...`;

// Initiale Ansicht: Das Wesen
openWerkzeug('wesen');

// Netzwerk nach Layout-Reflow erneut initialisieren
setTimeout(() => {
  const container = document.getElementById('netzwerk-container');
  const canvas = document.getElementById('netzwerk3d');
  if (container && canvas && renderer) {
    const width = container.clientWidth || window.innerWidth - 100;
    const height = container.clientHeight || window.innerHeight - 100;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}, 100);


// ══════════════════════════════════════════════════════════════════════
// LINSEN-INTERAKTION (Spielerisches Interface)
// ══════════════════════════════════════════════════════════════════════

let floatingLinse = null; // Welche Linse schwebt gerade?
let cursorX = 0, cursorY = 0;

// Palette ein-/ausklappen
function togglePalette() {
  const palette = document.getElementById('linsen-palette');
  palette.classList.toggle('expanded');
  document.body.classList.toggle('palette-expanded');
}

// Linse-Gruppe auf-/zuklappen
function toggleGruppe(gruppe) {
  const gruppeEl = document.getElementById(`gruppe-${gruppe}`);
  if (gruppeEl) {
    gruppeEl.classList.toggle('open');
  }
}

// Kombinierbare Linsen hervorheben
function highlightCombinable(typ, id) {
  // Erst alle combinable entfernen
  document.querySelectorAll('.linse.combinable').forEach(l => l.classList.remove('combinable'));
  
  if (typ === 'ansicht') {
    // Bei Ansicht: Alle Filter sind kombinierbar
    document.querySelectorAll('.linse.filter').forEach(l => {
      if (!l.classList.contains('active')) {
        l.classList.add('combinable');
      }
    });
  } else if (typ === 'filter') {
    // Bei Filter: Andere Filter sind kombinierbar
    document.querySelectorAll('.linse.filter').forEach(l => {
      if (l.dataset.id !== id && !l.classList.contains('active')) {
        l.classList.add('combinable');
      }
    });
  }
}

// Kombinierbare Hervorhebung entfernen
function clearCombinable() {
  document.querySelectorAll('.linse.combinable').forEach(l => l.classList.remove('combinable'));
}

// Linse aufnehmen
function pickupLinse(element) {
  const typ = element.dataset.typ;
  const id = element.dataset.id;
  const icon = element.textContent.trim().split('\n')[0];
  
  // Wenn bereits eine Linse schwebt, diese zuerst anwenden
  if (floatingLinse) {
    applyFloatingLinse();
    return;
  }
  
  // Werkzeuge sofort ausführen (kein Schweben)
  if (typ === 'werkzeug') {
    executeWerkzeug(id);
    return;
  }
  
  // Linse aufnehmen
  floatingLinse = { typ, id, icon, element };
  
  // Schwebende Linse zeigen
  const floating = document.getElementById('floating-linse');
  const floatingIcon = document.getElementById('floating-icon');
  floatingIcon.textContent = icon;
  floating.className = `floating-linse visible ${typ}`;
  
  // Hinweis zeigen
  document.getElementById('linse-hint').classList.add('visible');
  
  // Element hervorheben
  element.style.opacity = '0.5';
  
  }

// Linse anwenden (Klick auf Viewport)
function applyFloatingLinse() {
  if (!floatingLinse) return;
  
  const { typ, id, element } = floatingLinse;
  
  // Glow-Effekt
  const glow = document.getElementById('viewport-glow');
  glow.style.boxShadow = typ === 'filter' 
    ? 'inset 0 0 100px 50px rgba(255, 152, 0, 0.3)'
    : 'inset 0 0 100px 50px rgba(229, 57, 53, 0.3)';
  glow.classList.add('active');
  setTimeout(() => glow.classList.remove('active'), 600);
  
  // Anwenden
  if (typ === 'ansicht') {
    setAnsicht(id);
    
    // Alle Ansicht-Linsen deaktivieren, diese aktivieren
    document.querySelectorAll('.linse.ansicht').forEach(l => l.classList.remove('active'));
    element.classList.add('active');
    
    // Kombinierbare Filter hervorheben
    highlightCombinable('ansicht', id);
  } else if (typ === 'filter') {
    toggleFilter(id);
    element.classList.toggle('active', aktiveFilter.has(id));
    
    // Epoche-Slider zeigen/verstecken
    if (id === 'epoche') {
      document.getElementById('epoche-slider-vertical').classList.toggle('visible', aktiveFilter.has('epoche'));
    }
    
    // Kombinierbare Filter hervorheben
    if (aktiveFilter.size > 0) {
      highlightCombinable('filter', id);
    } else {
      clearCombinable();
    }
  }
  
  // Schwebende Linse verstecken
  document.getElementById('floating-linse').classList.remove('visible');
  document.getElementById('linse-hint').classList.remove('visible');
  element.style.opacity = '';
  
  // Aktive Linsen aktualisieren
  updateActiveLinsenDisplay();
  
  floatingLinse = null;
  console.log('Linse angewendet:', typ, id);
}

// Linse ablegen (ESC oder Rechtsklick)
function dropLinse() {
  if (!floatingLinse) return;
  
  floatingLinse.element.style.opacity = '';
  floatingLinse = null;
  
  document.getElementById('floating-linse').classList.remove('visible');
  document.getElementById('linse-hint').classList.remove('visible');
  
  console.log('Linse abgelegt');
}

// Werkzeug ausführen
function executeWerkzeug(id) {
  console.log('Werkzeug ausführen:', id);
  
  const glow = document.getElementById('viewport-glow');
  glow.style.boxShadow = 'inset 0 0 100px 50px rgba(156, 39, 176, 0.3)';
  glow.classList.add('active');
  setTimeout(() => glow.classList.remove('active'), 600);
  
  switch(id) {
    case 'zufall':
      zeigeZufall();
      break;
    case 'konfigurator':
      openWerkzeug('konfigurator');
      break;
    case 'fragen':
      openWerkzeug('fragen');
      break;
  }
}

// Aktive Linsen-Anzeige aktualisieren
function updateActiveLinsenDisplay() {
  const container = document.getElementById('active-linsen');
  let html = '';
  
  // Aktive Ansicht
  const ansichtNames = {
    'wesen': '🔴 Das Wesen',
    'netzwerk': '🕸️ Netzwerk',
    'karte': '🗺️ Karte',
    'liste': '📋 Liste',
    'wg': '🏠 Haus',
    'sozial': '🌐 Sozial',
    'oekosystem': '🌿 Ökosystem',
    'zeitleiste': '⏳ Zeit',
    'stammbaum': '🌳 Stammbaum',
    'chemie': '🧪 Chemie'
  };
  
  if (aktiveAnsicht && ansichtNames[aktiveAnsicht]) {
    html += `<div class="active-chip ansicht">${ansichtNames[aktiveAnsicht]}</div>`;
  }
  
  // Aktive Filter
  if (aktiveFilter.size > 0) {
    html += '<span class="separator">+</span>';
    
    const filterNames = {
      'personen': '👤 Personen',
      'fieber': '🌡️ Fieber',
      'debatten': '⚔️ Konflikte',
      'epoche': '🌀 ' + epocheWert
    };
    
    aktiveFilter.forEach(f => {
      html += `<div class="active-chip filter">
        ${filterNames[f] || f}
        <span class="remove" onclick="removeFilter('${f}')">×</span>
      </div>`;
    });
  }
  
  container.innerHTML = html;
}

// Filter entfernen
function removeFilter(id) {
  aktiveFilter.delete(id);
  document.querySelector(`.linse.filter[data-id="${id}"]`)?.classList.remove('active');
  
  if (id === 'epoche') {
    document.getElementById('epoche-slider-vertical').classList.remove('visible');
  }
  
  applyFilters();
  updateActiveLinsenDisplay();
  
  // Hervorhebung aktualisieren
  if (aktiveFilter.size > 0) {
    highlightCombinable('filter', Array.from(aktiveFilter)[0]);
  } else {
    highlightCombinable('ansicht', aktiveAnsicht);
  }
}

// Epoche-Slider (vertikal)
function updateEpocheV(value) {
  epocheWert = parseInt(value);
  document.getElementById('epoche-value-v').textContent = value;
  // Sync mit Inline-Slider falls vorhanden
  const inlineRange = document.getElementById('epoche-range-inline');
  const inlineValue = document.getElementById('epoche-value-inline');
  if (inlineRange) inlineRange.value = value;
  if (inlineValue) inlineValue.textContent = value;
  applyFilters();
  updateActiveLinsenDisplay();
}

function updateEpocheInline(value) {
  epocheWert = parseInt(value);
  document.getElementById('epoche-value-inline').textContent = value;
  // Sync mit vertikalem Slider falls vorhanden
  const vRange = document.getElementById('epoche-range-v');
  const vValue = document.getElementById('epoche-value-v');
  if (vRange) vRange.value = value;
  if (vValue) vValue.textContent = value;
  applyFilters();
  updateActiveLinsenDisplay();
}

// Maus-Tracking für schwebende Linse
document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  
  if (floatingLinse) {
    const floating = document.getElementById('floating-linse');
    floating.style.left = cursorX + 'px';
    floating.style.top = cursorY + 'px';
  }
});

// Klick auf Viewport = Linse anwenden
document.addEventListener('click', (e) => {
  if (!floatingLinse) return;
  
  // Nicht anwenden wenn auf Palette geklickt
  if (e.target.closest('.linsen-palette')) return;
  if (e.target.closest('.theme-modal')) return;
  if (e.target.closest('.detail-panel')) return;
  
  applyFloatingLinse();
});

// ESC = Linse ablegen
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    dropLinse();
    closePanel();
  }
});

// Rechtsklick = Linse ablegen
document.addEventListener('contextmenu', (e) => {
  if (floatingLinse) {
    e.preventDefault();
    dropLinse();
  }
});

// Initiale Anzeige
updateActiveLinsenDisplay();
highlightCombinable('ansicht', 'netzwerk');

// Netzwerk-Container wird durch setAnsicht/openWerkzeug gesteuert
// (nicht mehr manuell sichtbar machen)

// ══════════════════════════════════════════════════════════════════════
// THEME-SYSTEM
// ══════════════════════════════════════════════════════════════════════

let currentTheme = localStorage.getItem('wesen-theme') || 'default';

function setTheme(theme) {
  // Entferne alle Theme-Klassen
  document.body.classList.remove('theme-myzel', 'theme-barrikade', 'theme-terminal', 'theme-kosmos', 'theme-ruine');
  
  // Füge neue Theme-Klasse hinzu (außer default)
  if (theme !== 'default') {
    document.body.classList.add(`theme-${theme}`);
  }
  
  // Speichern
  currentTheme = theme;
  localStorage.setItem('wesen-theme', theme);
  
  // UI aktualisieren
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
  
  // Netzwerk-Hintergrund aktualisieren falls vorhanden
  if (scene) {
    const colors = {
      'default': 0x1a1a1a,
      'myzel': 0x0a1208,
      'barrikade': 0x1a0a0a,
      'terminal': 0x0a0a0a,
      'kosmos': 0x050510,
      'ruine': 0x1a1815
    };
    scene.background = new THREE.Color(colors[theme] || 0x1a1a1a);
  }
  
  console.log('Theme gewechselt zu:', theme);
}

function openThemeModal() {
  document.getElementById('theme-modal').classList.add('open');
}

function closeThemeModal() {
  document.getElementById('theme-modal').classList.remove('open');
}

// Theme beim Laden anwenden
setTheme(currentTheme);

// ══════════════════════════════════════════════════════════════════════
// SHARE / SOCIAL MEDIA
// ══════════════════════════════════════════════════════════════════════

function getShareUrl() {
  const url = new URL(window.location.href);
  
  // Aktuelle Ansicht in URL
  url.searchParams.set('ansicht', aktiveAnsicht);
  
  // Aktive Filter
  if (aktiveFilter.size > 0) {
    url.searchParams.set('filter', Array.from(aktiveFilter).join(','));
  }
  
  // Epoche
  if (aktiveFilter.has('epoche')) {
    url.searchParams.set('epoche', epocheWert);
  }
  
  // Theme
  if (currentTheme !== 'default') {
    url.searchParams.set('theme', currentTheme);
  }
  
  return url.toString();
}

function getShareText() {
  const texte = {
    'netzwerk': '🕸️ Entdecke das Netzwerk linker Ideen',
    'karte': '🗺️ Die Landkarte des linken Denkens',
    'liste': '📋 Alle Positionen im Überblick',
    'wg': '🏠 Willkommen in der WG linker Ideen',
    'oekosystem': '🌿 Das Ökosystem politischer Positionen',
    'zeitleiste': '⏳ Die Geschichte linker Ideen',
    'wesen': '🫀 Das lebende Wesen des linken Denkens'
  };
  return texte[aktiveAnsicht] || 'Das Wesen des linken Denkens - interaktive Kartografie';
}

function openShareModal() {
  document.getElementById('share-url').value = getShareUrl();
  document.getElementById('share-modal').classList.add('open');
}

function closeShareModal() {
  document.getElementById('share-modal').classList.remove('open');
}

function copyShareUrl() {
  const input = document.getElementById('share-url');
  input.select();
  document.execCommand('copy');
  
  const feedback = document.getElementById('copy-feedback');
  feedback.style.display = 'block';
  setTimeout(() => feedback.style.display = 'none', 2000);
}

function shareToTwitter() {
  const url = encodeURIComponent(getShareUrl());
  const text = encodeURIComponent(getShareText());
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareToMastodon() {
  const text = encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`);
  window.open(`https://mastodon.social/share?text=${text}`, '_blank', 'width=600,height=400');
}

function shareToTelegram() {
  const url = encodeURIComponent(getShareUrl());
  const text = encodeURIComponent(getShareText());
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareToWhatsApp() {
  const text = encodeURIComponent(`${getShareText()}\n${getShareUrl()}`);
  window.open(`https://wa.me/?text=${text}`, '_blank', 'width=600,height=400');
}

function shareToEmail() {
  const subject = encodeURIComponent('Das Wesen des linken Denkens');
  const body = encodeURIComponent(`${getShareText()}\n\n${getShareUrl()}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function createShareImage() {
  // Canvas-Screenshot erstellen
  const mainContainer = document.querySelector('main');
  
  // Einfache Implementierung: Alert mit Hinweis
  alert('Screenshot-Funktion: Nutze die Browser-Funktion (Strg+Shift+S in Firefox) oder ein Screenshot-Tool deiner Wahl.');
  
  // TODO: Implementierung mit html2canvas Bibliothek für bessere Screenshots
}

// URL-Parameter beim Laden auswerten
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  console.log('=== parseUrlParams START ===');
  console.log('URL:', window.location.href);
  
  // Ansicht
  const ansicht = params.get('ansicht');
  if (ansicht && ['netzwerk', 'karte', 'liste', 'wg', 'oekosystem', 'zeitleiste'].includes(ansicht)) {
    setAnsicht(ansicht);
  }
  
  // Filter
  const filterParam = params.get('filter');
  if (filterParam) {
    filterParam.split(',').forEach(f => {
      if (['personen', 'fieber', 'debatten', 'epoche'].includes(f)) {
        toggleFilter(f);
      }
    });
  }
  
  // Epoche
  const epocheParam = params.get('epoche');
  if (epocheParam) {
    epocheWert = parseInt(epocheParam);
    document.getElementById('epoche-range').value = epocheWert;
    updateEpoche(epocheWert);
  }
  
  // Theme
  const themeParam = params.get('theme');
  if (themeParam) {
    setTheme(themeParam);
  }
  
  // Position
  const posParam = params.get('pos');
  if (posParam && knotenData[posParam]) {
    setTimeout(() => showKnoten(posParam), 500);
  }
  
  // === PROFIL VOM GENERATOR ===
  // Format: profil=00:5,01:3,02:3,...,25:3
  const profilParam = params.get('profil');
  if (profilParam) {
    const profil = parseGeneratorProfil(profilParam);
    console.log('Profil vom Generator:', profil);
    
    // Profil setzen für Markierungen und Konfigurator
    generatorProfil = profil;
    konfigAuswahl = { ...profil };
    
    console.log('konfigAuswahl gesetzt:', konfigAuswahl);
    
    // Konfigurator rendern
    renderKonfiguratorMitProfil();
    
    // Direkt ins Haus wechseln wenn Profil vorhanden
    setTimeout(() => {
      openWerkzeug('haus');
    }, 500);
  }
}

// Willkommens-Banner für Generator-Besucher
function showWelcomeBanner(zimmer, knoten, archetyp) {
  const banner = document.createElement('div');
  banner.id = 'welcome-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid #C62828;
      border-radius: 12px;
      padding: 1.25rem 2rem;
      z-index: 10000;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(198,40,40,0.3);
      animation: fadeInDown 0.5s ease;
    ">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 2rem;">🏠</span>
        <div style="flex: 1;">
          <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">
            Willkommen in deinem Zimmer!
          </div>
          <div style="color: #AAA; font-size: 0.9rem;">
            ${zimmer}
          </div>
          <div style="color: #888; font-size: 0.8rem; margin-top: 0.5rem;">
            Deine Positionen: ${knoten.join(' · ')}
          </div>
        </div>
        <button onclick="document.getElementById('welcome-banner').remove()" style="
          background: transparent;
          border: 1px solid #666;
          color: #AAA;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
        ">×</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
  
  // Auto-hide nach 8 Sekunden
  setTimeout(() => {
    const b = document.getElementById('welcome-banner');
    if (b) b.style.opacity = '0';
    setTimeout(() => {
      const b2 = document.getElementById('welcome-banner');
      if (b2) b2.remove();
    }, 500);
  }, 8000);
}

// Highlighte Knoten aus dem Generator
function highlightGeneratorKnoten(knotenIds) {
  // Im 2D-Modus: Rahmen hinzufügen
  knotenIds.forEach(id => {
    const el = document.querySelector(`[data-knoten-id="${id}"]`);
    if (el) {
      el.style.boxShadow = '0 0 20px rgba(198,40,40,0.8)';
      el.style.border = '2px solid #C62828';
    }
  });
  
  // NICHT automatisch Panel öffnen - User soll selbst klicken
}

// ══════════════════════════════════════════════════════════════════════
// GENERATOR-PROFIL VERARBEITUNG
// ══════════════════════════════════════════════════════════════════════

// Parse "1:3,2:4,..." ODER "A1:3,A2:4,B1:2,..." zu {00: 3, 01: 4, ...}
function parseGeneratorProfil(profilString) {
  // VEREINFACHT: Generator sendet jetzt direkt Haus-IDs (00-25)
  // Format: "00:5,01:3,02:3,...,25:3"
  
  const profil = {};
  profilString.split(',').forEach(pair => {
    const [achse, wert] = pair.split(':');
    if (achse && wert) {
      const id = achse.trim();
      // Akzeptiere sowohl "00" als auch "0" Format
      const normalizedId = id.length === 1 ? '0' + id : id;
      // Prüfe ob gültige Achsen-ID (00-25)
      const numId = parseInt(normalizedId);
      if (numId >= 0 && numId <= 25) {
        profil[normalizedId] = parseInt(wert.trim());
      } else {
        console.warn('Ungültige Achsen-ID:', id);
      }
    }
  });
  
  console.log('Profil geparst:', profil);
  console.log('Anzahl Achsen:', Object.keys(profil).length);
  return profil;
}

// Zeigt das Generator-Profil im Konfigurator
function showGeneratorProfil(profil, archetyp, name) {
  generatorProfil = profil;
  generatorArchetyp = archetyp;
  generatorName = name;
  
  // Setze die Auswahl im Konfigurator
  Object.entries(profil).forEach(([achse, wert]) => {
    konfigAuswahl[achse] = wert;
  });
  
  // Konfigurator mit Generator-Modus neu rendern
  renderKonfiguratorMitProfil();
}

// Berechnet Ähnlichkeit zwischen Profil und einem Knoten
function berechneProfilMatch(profil, knotenId) {
  const knoten = knotenData[knotenId];
  if (!knoten) return 0;
  
  // Extrahiere Achse und Position aus Knoten-ID
  // Neues Format: "01-3" (zweistellige Achse)
  let match = knotenId.match(/^(\d{2})-(\d)$/);
  if (match) {
    const achse = match[1];
    const position = parseInt(match[2]);
    if (profil[achse] !== undefined) {
      const diff = Math.abs(profil[achse] - position);
      return Math.max(0, 100 - diff * 25);
    }
    return 0;
  }
  
  // Altes Format: "00-3" (Buchstabe+Zahl)
  match = knotenId.match(/^([A-F]\d)-(\d)$/);
  if (!match) return 0;
  
  const achse = match[1];
  const position = parseInt(match[2]);
  
  // Hat das Profil einen Wert für diese Achse?
  if (profil[achse] !== undefined) {
    const diff = Math.abs(profil[achse] - position);
    return Math.max(0, 100 - diff * 25); // 0 diff = 100%, 1 diff = 75%, etc.
  }
  
  return 0;
}

// Finde alle Knoten sortiert nach Übereinstimmung mit dem Profil
function findeNachbarn(profil, limit = 10) {
  const ergebnisse = [];
  
  Object.keys(knotenData).forEach(id => {
    // Für jeden Knoten: Berechne Gesamtübereinstimmung
    // Versuche neues Format: "01-3"
    let match = id.match(/^(\d{2})-(\d)$/);
    let achse, position;
    
    if (match) {
      achse = match[1];
      position = parseInt(match[2]);
    } else {
      // Versuche altes Format: "00-3"
      match = id.match(/^([A-F]\d)-(\d)$/);
      if (!match) return;
      achse = match[1];
      position = parseInt(match[2]);
    }
    
    if (profil[achse] !== undefined) {
      const diff = Math.abs(profil[achse] - position);
      const score = 100 - diff * 25;
      
      if (score > 0) {
        ergebnisse.push({
          id,
          knoten: knotenData[id],
          achse,
          position,
          profilWert: profil[achse],
          score,
          exakt: diff === 0
        });
      }
    }
  });
  
  // Sortiere nach Score (höchste zuerst)
  ergebnisse.sort((a, b) => b.score - a.score);
  
  return ergebnisse.slice(0, limit);
}

// Rendert den Konfigurator mit dem Generator-Profil
function renderKonfiguratorMitProfil() {
  const container = document.getElementById('konfigurator-container');
  if (!container) return;
  
  const profil = generatorProfil || {};
  const archetyp = generatorArchetyp;
  const achsenMeta = window.achsenMeta || {};
  const achsenListe = Object.values(achsenMeta);
  
  const hatProfil = Object.keys(profil).length > 0;
  const aktuelleAuswahl = hatProfil ? { ...profil } : konfigAuswahl;
  const anzahlGewählt = Object.keys(aktuelleAuswahl).length;
  
  // Teile in zwei Spalten
  const linkeAchsen = achsenListe.slice(0, 13);
  const rechteAchsen = achsenListe.slice(13);
  
  let html = `
    <div class="schnellprofil-container">
      <div class="schnellprofil-header">
        <div class="schnellprofil-title">${hatProfil ? '🎯 Dein Profil' : '🎛️ Schnell-Profil'}</div>
        <div class="schnellprofil-stats">${anzahlGewählt}/26 gewählt</div>
      </div>
      
      <div class="schnellprofil-grid">
        <div class="schnellprofil-spalte">
          ${renderAchsenSpalte(linkeAchsen, aktuelleAuswahl, hatProfil)}
        </div>
        <div class="schnellprofil-spalte">
          ${renderAchsenSpalte(rechteAchsen, aktuelleAuswahl, hatProfil)}
        </div>
      </div>
      
      <div class="schnellprofil-footer">
        <button class="sp-btn primary" onclick="updateProfilURL()">🔗 URL aktualisieren</button>
        <button class="sp-btn" onclick="konfigAuswahl={}; generatorProfil=null; renderKonfiguratorMitProfil();">🔄 Reset</button>
        ${anzahlGewählt >= 3 ? `<button class="sp-btn" onclick="zeigeProfilImHaus();">🏠 Im Haus zeigen</button>` : ''}
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

function renderAchsenSpalte(achsen, auswahl, nurAnzeige) {
  let html = '';
  achsen.forEach(achse => {
    const wert = auswahl[achse.id];
    const pol0 = achse.pol_0 || '';
    const pol1 = achse.pol_1 || '';
    
    html += `
      <div class="sp-achse">
        <div class="sp-achse-label">
          <span class="sp-id">${achse.id}</span>
          <span class="sp-name">${achse.kurzname || achse.name}</span>
        </div>
        <div class="sp-pole">
          <span class="sp-pol links" title="${pol0}">${pol0.substring(0,8)}</span>
          <span class="sp-pol rechts" title="${pol1}">${pol1.substring(0,8)}</span>
        </div>
        <div class="sp-buttons">
          ${[1,2,3,4,5].map(n => `
            <button class="sp-btn-num ${wert === n ? 'selected' : ''}" 
                    onclick="selectKonfig('${achse.id}', ${n})"
                    ${nurAnzeige ? '' : ''}>
              ${n}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  });
  return html;
}

function updateProfilURL() {
  const profil = generatorProfil || konfigAuswahl;
  if (Object.keys(profil).length === 0) {
    alert('Wähle erst einige Positionen!');
    return;
  }
  
  // Konvertiere Haus-IDs (00-25) zurück zu Generator-IDs (1-26)
  const hausToGen = {};
  for (let i = 0; i < 26; i++) {
    hausToGen[i.toString().padStart(2, '0')] = (i + 1).toString();
  }
  
  const profilString = Object.entries(profil)
    .map(([achse, wert]) => `${hausToGen[achse] || achse}:${wert}`)
    .join(',');
  
  const url = new URL(window.location);
  url.searchParams.set('profil', profilString);
  
  // URL aktualisieren ohne Reload
  window.history.replaceState({}, '', url);
  
  // Kopieren
  navigator.clipboard.writeText(url.toString()).then(() => {
    alert('URL kopiert! 📋');
  }).catch(() => {
    prompt('URL kopieren:', url.toString());
  });
}

// Zeigt das Profil in der WG/Haus-Ansicht
function zeigeProfilImHaus() {
  // Zur WG-Ansicht wechseln und Funktional-Modus rendern (Default)
  setAnsicht('wg');
  
  // Kurz warten, dann rendern mit Profil
  setTimeout(() => {
    renderHaus('erkunden');
  }, 100);
}

// ═══════════════════════════════════════════════════════════════
// ZIMMER-FINDER: Personalisierte Fragen nach Archetyp
// ═══════════════════════════════════════════════════════════════

// Fragen-Texte pro Achse (generisch, für alle Archetypen)
const zimmerFinderAchsenFragen = {
  A1: {
    titel: 'Reform oder Revolution?',
    frage: 'Wie erreichst du gesellschaftliche Veränderung?',
    optionen: [
      { wert: 1, text: 'Schrittweise Reformen im bestehenden System' },
      { wert: 2, text: 'Strukturreformen, die das System verbessern' },
      { wert: 3, text: 'Doppelstrategie: Reformen nutzen, Systemwechsel vorbereiten' },
      { wert: 4, text: 'Gegen-Hegemonie aufbauen, dann transformieren' },
      { wert: 5, text: 'Revolutionärer Bruch – das System muss fallen' }
    ]
  },
  A2: {
    titel: 'Wer macht die Revolution?',
    frage: 'Wer ist das Subjekt der Veränderung?',
    optionen: [
      { wert: 1, text: 'Die industrielle Arbeiterklasse' },
      { wert: 2, text: 'Alle Lohnabhängigen gemeinsam' },
      { wert: 3, text: 'Die Multitude – alle Ausgebeuteten' },
      { wert: 4, text: 'Intersektionale Allianzen verschiedener Kämpfe' },
      { wert: 5, text: 'Alles Leben – Menschen, Tiere, Natur' }
    ]
  },
  A3: {
    titel: 'Was tun mit dem Staat?',
    frage: 'Wie stehst du zum Staat als Mittel der Veränderung?',
    optionen: [
      { wert: 1, text: 'Den Staat erobern und für uns nutzen' },
      { wert: 2, text: 'Den Staat demokratisch umbauen' },
      { wert: 3, text: 'Der Staat ist umkämpftes Terrain' },
      { wert: 4, text: 'Parallelstrukturen aufbauen, Staat ignorieren' },
      { wert: 5, text: 'Den Staat abschaffen – er ist Teil des Problems' }
    ]
  },
  A4: {
    titel: 'Wie organisieren wir uns?',
    frage: 'Welche Organisationsform bevorzugst du?',
    optionen: [
      { wert: 1, text: 'Zentralistische Kaderpartei' },
      { wert: 2, text: 'Demokratische Massenpartei' },
      { wert: 3, text: 'Bewegungspartei mit offenem Charakter' },
      { wert: 4, text: 'Lose Netzwerke und Bündnisse' },
      { wert: 5, text: 'Basisdemokratische Rätestrukturen' }
    ]
  },
  B1: {
    titel: 'Markt oder Plan?',
    frage: 'Wie soll die Wirtschaft koordiniert werden?',
    optionen: [
      { wert: 1, text: 'Regulierte Marktwirtschaft' },
      { wert: 2, text: 'Starke staatliche Steuerung mit Markt' },
      { wert: 3, text: 'Mischsystem mit verschiedenen Sektoren' },
      { wert: 4, text: 'Demokratische Planung von unten' },
      { wert: 5, text: 'Vollständige gesellschaftliche Planung' }
    ]
  },
  B2: {
    titel: 'Wem gehört was?',
    frage: 'Wie soll Eigentum organisiert sein?',
    optionen: [
      { wert: 1, text: 'Staatseigentum an Schlüsselindustrien' },
      { wert: 2, text: 'Öffentliches Eigentum mit demokratischer Kontrolle' },
      { wert: 3, text: 'Mischung verschiedener Eigentumsformen' },
      { wert: 4, text: 'Genossenschaften und Kollektive' },
      { wert: 5, text: 'Commons – Gemeineigentum ohne Staat' }
    ]
  },
  B3: {
    titel: 'Arbeit – wie viel davon?',
    frage: 'Wie stehst du zur Lohnarbeit?',
    optionen: [
      { wert: 1, text: 'Vollbeschäftigung für alle' },
      { wert: 2, text: 'Gute Arbeit mit fairen Bedingungen' },
      { wert: 3, text: 'Arbeitszeitverkürzung und Umverteilung' },
      { wert: 4, text: 'Grundeinkommen und freiwillige Arbeit' },
      { wert: 5, text: 'Post-Work: Befreiung von der Lohnarbeit' }
    ]
  },
  C1: {
    titel: 'Klasse und Geschlecht',
    frage: 'Wie verbindest du Feminismus und Klassenkampf?',
    optionen: [
      { wert: 1, text: 'Klassenkampf zuerst – Feminismus kommt danach' },
      { wert: 2, text: 'Sozialistischer Feminismus im Klassenkampf' },
      { wert: 3, text: 'Beide Kämpfe gleichwertig verbinden' },
      { wert: 4, text: 'Intersektionale Analyse aller Unterdrückung' },
      { wert: 5, text: 'Radikaler Feminismus als Basis aller Befreiung' }
    ]
  },
  C2: {
    titel: 'Mensch und Natur',
    frage: 'Wie radikal ist dein Ökologismus?',
    optionen: [
      { wert: 1, text: 'Produktivkräfte entwickeln, Natur nutzen' },
      { wert: 2, text: 'Grünes Wachstum ist möglich' },
      { wert: 3, text: 'Nachhaltigkeit durch Regulierung' },
      { wert: 4, text: 'Ökosozialismus: System Change fürs Klima' },
      { wert: 5, text: 'Eigenrechte der Natur – radikaler Ökosozialismus' }
    ]
  },
  C3: {
    titel: 'Lokal oder Global?',
    frage: 'Auf welcher Ebene kämpfst du?',
    optionen: [
      { wert: 1, text: 'National – hier können wir etwas ändern' },
      { wert: 2, text: 'Internationale Solidarität mit nationalem Fokus' },
      { wert: 3, text: 'Transnationale Kooperation und Vernetzung' },
      { wert: 4, text: 'Globale Bewegungen und Strukturen' },
      { wert: 5, text: 'No Borders – Internationalismus radikal gedacht' }
    ]
  },
  D1: {
    titel: 'Brauchen wir Utopien?',
    frage: 'Wie konkret soll das Ziel sein?',
    optionen: [
      { wert: 1, text: 'Anti-Utopismus: Kritik genügt, keine Blaupausen' },
      { wert: 2, text: 'Negative Utopie: Wissen was wir NICHT wollen' },
      { wert: 3, text: 'Der Weg ist das Ziel – prozesshaft denken' },
      { wert: 4, text: 'Real-Utopien: Machbare Alternativen entwickeln' },
      { wert: 5, text: 'Konkrete Utopie: Detaillierte Zukunftsbilder' }
    ]
  },
  D2: {
    titel: 'Wie transformieren?',
    frage: 'Wie radikal muss der Wandel sein?',
    optionen: [
      { wert: 1, text: 'Graduell – Schritt für Schritt' },
      { wert: 2, text: 'Interstitiell – Alternativen in den Nischen' },
      { wert: 3, text: 'Symbiotisch – mit dem System arbeiten' },
      { wert: 4, text: 'Rupturell – Brüche provozieren' },
      { wert: 5, text: 'Revolutionär – fundamentaler Systembruch' }
    ]
  },
  D3: {
    titel: 'Spiritualität und Politik',
    frage: 'Welche Rolle spielt Spiritualität?',
    optionen: [
      { wert: 1, text: 'Strikt säkular – Religion ist Privatsache' },
      { wert: 2, text: 'Offen für religiöse Genoss*innen' },
      { wert: 3, text: 'Verschiedene Weltanschauungen respektieren' },
      { wert: 4, text: 'Spirituelle Dimensionen in der Politik' },
      { wert: 5, text: 'Innere und äußere Transformation verbinden' }
    ]
  },
  E1: {
    titel: 'Mit wem verbünden?',
    frage: 'Wie breit sollen Bündnisse sein?',
    optionen: [
      { wert: 1, text: 'Klassenlinie halten – keine Verwässerung' },
      { wert: 2, text: 'Stabiler sozialistischer Kern' },
      { wert: 3, text: 'Breite Bündnisse mit klaren Prinzipien' },
      { wert: 4, text: 'Bewegungsübergreifende Allianzen' },
      { wert: 5, text: 'Alle gegen das System – breiteste Front' }
    ]
  },
  E2: {
    titel: 'Auf welcher Ebene?',
    frage: 'Wo setzt politisches Handeln an?',
    optionen: [
      { wert: 1, text: 'Zentral – nationale/staatliche Ebene' },
      { wert: 2, text: 'Föderal – Länder und Regionen' },
      { wert: 3, text: 'Mehrebenen – je nach Thema' },
      { wert: 4, text: 'Kommunal – die Stadt als Ausgangspunkt' },
      { wert: 5, text: 'Basisdemokratisch – von unten aufbauen' }
    ]
  },
  E3: {
    titel: 'Wie lernen wir?',
    frage: 'Theorie oder Praxis – was kommt zuerst?',
    optionen: [
      { wert: 1, text: 'Aufklärung – Wissen verbreiten' },
      { wert: 2, text: 'Theoriearbeit als Grundlage' },
      { wert: 3, text: 'Praxis-Theorie-Praxis-Zyklus' },
      { wert: 4, text: 'Lernen im Kampf – Erfahrung zählt' },
      { wert: 5, text: 'Präfiguration – die Zukunft jetzt leben' }
    ]
  },
  E4: {
    titel: 'Welche Mittel?',
    frage: 'Wie weit gehst du im Widerstand?',
    optionen: [
      { wert: 1, text: 'Strikt legal – alle Rechtswege nutzen' },
      { wert: 2, text: 'Ziviler Ungehorsam wenn nötig' },
      { wert: 3, text: 'Direkte Aktionen situativ einsetzen' },
      { wert: 4, text: 'Militante Aktionen als Option' },
      { wert: 5, text: 'Alle Mittel – die Situation entscheidet' }
    ]
  }
};

// Zimmer-Finder State
let zimmerFinderState = {
  archetyp: null,
  archetypData: null,
  fragenAchsen: [],
  aktuelleFrageIndex: 0,
  antworten: {}
};

// Finde die 4 extremsten Achsen eines Archetyps
function findeExtremeAchsen(ideal, anzahl = 4) {
  const achsenDistanzen = Object.entries(ideal).map(([achse, wert]) => ({
    achse,
    wert,
    distanz: Math.abs(wert - 3) // Distanz zur Mitte
  }));
  
  // Sortiere nach Extremheit (höchste Distanz zuerst)
  achsenDistanzen.sort((a, b) => b.distanz - a.distanz);
  
  // Nimm die extremsten
  return achsenDistanzen.slice(0, anzahl).map(a => a.achse);
}

// Startet den Zimmer-Finder
function starteZimmerFinder(archetypId) {
  const archetypen = window.archetypen;
  if (!archetypen || !archetypen[archetypId]) {
    console.error('Archetyp nicht gefunden:', archetypId);
    return;
  }
  
  const archetypData = archetypen[archetypId];
  const ideal = archetypData.ideal || {};
  
  // Finde die 4 extremsten Achsen
  const fragenAchsen = findeExtremeAchsen(ideal, 4);
  
  console.log('Zimmer-Finder gestartet für:', archetypId);
  console.log('Fragen zu Achsen:', fragenAchsen);
  
  // State initialisieren
  zimmerFinderState = {
    archetyp: archetypId,
    archetypData,
    fragenAchsen,
    aktuelleFrageIndex: 0,
    antworten: { ...ideal } // Starte mit ideal-Werten als Default
  };
  
  // UI anzeigen
  zeigeZimmerFinderPopup();
}

// Zeigt das Zimmer-Finder Popup
function zeigeZimmerFinderPopup() {
  // Entferne altes Popup falls vorhanden
  const altes = document.getElementById('zimmer-finder-popup');
  if (altes) altes.remove();
  
  const popup = document.createElement('div');
  popup.id = 'zimmer-finder-popup';
  popup.innerHTML = renderZimmerFinderInhalt();
  document.body.appendChild(popup);
}

// Rendert den aktuellen Inhalt des Zimmer-Finders
function renderZimmerFinderInhalt() {
  const { archetyp, archetypData, fragenAchsen, aktuelleFrageIndex, antworten } = zimmerFinderState;
  const istLetzteFrage = aktuelleFrageIndex >= fragenAchsen.length;
  
  let html = `
    <div class="zimmer-finder-overlay">
      <div class="zimmer-finder-modal">
  `;
  
  if (istLetzteFrage) {
    // Ergebnis anzeigen
    html += renderZimmerFinderErgebnis();
  } else {
    // Frage anzeigen
    const achse = fragenAchsen[aktuelleFrageIndex];
    const frageData = zimmerFinderAchsenFragen[achse];
    const aktuellerWert = antworten[achse] || 3;
    
    html += `
      <div class="zimmer-finder-header">
        <div class="zimmer-finder-archetyp">
          <span class="archetyp-icon">${archetypData.icon}</span>
          <span class="archetyp-name">${archetypData.name}</span>
        </div>
        <div class="zimmer-finder-progress">
          Frage ${aktuelleFrageIndex + 1} von ${fragenAchsen.length}
        </div>
      </div>
      
      <div class="zimmer-finder-frage">
        <h2>${frageData.titel}</h2>
        <p class="frage-text">${frageData.frage}</p>
        
        <div class="zimmer-finder-optionen">
          ${frageData.optionen.map(opt => `
            <label class="zf-option ${opt.wert === aktuellerWert ? 'selected' : ''}" onclick="waehleZimmerFinderOption('${achse}', ${opt.wert})">
              <span class="zf-radio ${opt.wert === aktuellerWert ? 'checked' : ''}"></span>
              <span class="zf-option-text">${opt.text}</span>
              <span class="zf-option-wert">${opt.wert}</span>
            </label>
          `).join('')}
        </div>
      </div>
      
      <div class="zimmer-finder-actions">
        ${aktuelleFrageIndex > 0 ? `
          <button class="zf-btn secondary" onclick="zimmerFinderZurueck()">← Zurück</button>
        ` : `
          <button class="zf-btn secondary" onclick="zimmerFinderUeberspringen()">Überspringen</button>
        `}
        <button class="zf-btn primary" onclick="zimmerFinderWeiter()">
          ${aktuelleFrageIndex === fragenAchsen.length - 1 ? 'Ergebnis anzeigen' : 'Weiter →'}
        </button>
      </div>
    `;
  }
  
  html += `
      </div>
    </div>
  `;
  
  return html;
}

// Rendert das Ergebnis des Zimmer-Finders
function renderZimmerFinderErgebnis() {
  const { archetyp, archetypData, antworten } = zimmerFinderState;
  
  // Berechne "Dein Platz" basierend auf den Antworten
  const platz = berechneDeinenPlatz(antworten);
  const hauptzimmer = platz?.hauptzimmer;
  const achsenMeta = window.achsenMeta;
  
  let html = `
    <div class="zimmer-finder-header ergebnis">
      <div class="zimmer-finder-archetyp">
        <span class="archetyp-icon">${archetypData.icon}</span>
        <span class="archetyp-name">${archetypData.name}</span>
      </div>
      <div class="zimmer-finder-titel">Dein Platz im Haus</div>
    </div>
    
    <div class="zimmer-finder-ergebnis">
  `;
  
  if (hauptzimmer) {
    const meta = achsenMeta[hauptzimmer.achse];
    const posName = meta?.pole[hauptzimmer.profilWert - 1] || hauptzimmer.profilWert;
    
    html += `
      <div class="zf-hauptzimmer">
        <div class="zf-badge">🔥 Hier wirst du gebraucht</div>
        <div class="zf-zimmer-header">
          <span class="zf-etage-icon">${hauptzimmer.etageIcon}</span>
          <div>
            <h3>${hauptzimmer.zimmer.name}</h3>
            <span class="zf-achse">${hauptzimmer.achse} — ${hauptzimmer.zimmer.beschreibung}</span>
          </div>
        </div>
        <div class="zf-position">
          <span class="zf-pos-label">Deine Position:</span>
          <span class="zf-pos-wert">${hauptzimmer.profilWert}</span>
          <span class="zf-pos-name">${posName}</span>
        </div>
        <div class="zf-aufgabe">
          <span class="zf-aufgabe-icon">✊</span>
          <p>${hauptzimmer.aufgabe}</p>
        </div>
      </div>
    `;
  }
  
  // Weitere Zimmer
  if (platz?.weitereZimmer?.length > 0) {
    html += `<div class="zf-weitere-titel">💡 Weitere Räume für dich:</div>`;
    html += `<div class="zf-weitere-liste">`;
    
    platz.weitereZimmer.slice(0, 3).forEach(z => {
      const meta = achsenMeta[z.achse];
      const posName = meta?.pole[z.profilWert - 1] || z.profilWert;
      
      html += `
        <div class="zf-weiteres-zimmer">
          <span class="zf-weiteres-icon">${z.etageIcon}</span>
          <div>
            <span class="zf-weiteres-name">${z.zimmer.name}</span>
            <span class="zf-weiteres-pos">Position ${z.profilWert}: ${posName}</span>
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  // Ähnliche Archetypen
  const aehnliche = findeAehnlicheArchetypen(archetyp, 3);
  if (aehnliche.length > 0) {
    html += `
      <div class="zf-wg-empfehlung">
        <div class="zf-wg-label">🤝 Du passt gut zu:</div>
        <div class="zf-wg-liste">
          ${aehnliche.map(a => `
            <span class="zf-wg-item" style="--accent: ${a.farbe}">${a.icon} ${a.name}</span>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  html += `
    </div>
    
    <div class="zimmer-finder-actions ergebnis">
      <button class="zf-btn primary gross" onclick="zimmerFinderAbschliessen()">
        🏠 Haus erkunden
      </button>
    </div>
  `;
  
  return html;
}

// Option wählen
function waehleZimmerFinderOption(achse, wert) {
  zimmerFinderState.antworten[achse] = wert;
  
  // UI aktualisieren
  const popup = document.getElementById('zimmer-finder-popup');
  if (popup) {
    popup.innerHTML = renderZimmerFinderInhalt();
  }
}

// Weiter zur nächsten Frage
function zimmerFinderWeiter() {
  zimmerFinderState.aktuelleFrageIndex++;
  
  const popup = document.getElementById('zimmer-finder-popup');
  if (popup) {
    popup.innerHTML = renderZimmerFinderInhalt();
  }
}

// Zurück zur vorherigen Frage
function zimmerFinderZurueck() {
  if (zimmerFinderState.aktuelleFrageIndex > 0) {
    zimmerFinderState.aktuelleFrageIndex--;
    
    const popup = document.getElementById('zimmer-finder-popup');
    if (popup) {
      popup.innerHTML = renderZimmerFinderInhalt();
    }
  }
}

// Überspringen (alle Archetyp-Defaults übernehmen)
function zimmerFinderUeberspringen() {
  // Direkt zum Ergebnis
  zimmerFinderState.aktuelleFrageIndex = zimmerFinderState.fragenAchsen.length;
  
  const popup = document.getElementById('zimmer-finder-popup');
  if (popup) {
    popup.innerHTML = renderZimmerFinderInhalt();
  }
}

// Abschließen und ins Haus wechseln
function zimmerFinderAbschliessen() {
  const { archetyp, antworten } = zimmerFinderState;
  
  // Profil setzen
  generatorProfil = antworten;
  generatorArchetyp = archetyp;
  
  // Popup entfernen
  const popup = document.getElementById('zimmer-finder-popup');
  if (popup) popup.remove();
  
  // Ins Haus wechseln
  setAnsicht('wg');
  renderHaus('erkunden');
}

// Berechnet das Hauptzimmer und weitere passende Zimmer basierend auf Profil
function berechneDeinenPlatz(profil) {
  if (!profil || Object.keys(profil).length === 0) return null;
  
  const hausStruktur = window.hausStruktur;
  const achsenMeta = window.achsenMeta;
  
  // Sammle alle Zimmer mit Bewertung
  const bewerteteZimmer = [];
  
  hausStruktur.forEach(etage => {
    etage.zimmer.forEach(zimmer => {
      const achse = zimmer.achse;
      const profilWert = profil[achse];
      
      if (profilWert !== undefined) {
        // Extremheit: Wie weit von der Mitte (3) entfernt?
        const distanzZurMitte = Math.abs(profilWert - 3);
        
        bewerteteZimmer.push({
          achse,
          zimmer,
          etage: etage.name,
          etageIcon: etage.icon,
          profilWert,
          extremheit: distanzZurMitte,
          richtung: profilWert > 3 ? 'progressiv' : profilWert < 3 ? 'traditionell' : 'vermittelnd',
          aufgabe: generiereAufgabe(achse, profilWert)
        });
      }
    });
  });
  
  // Finde maximale Extremheit
  const maxExtremheit = Math.max(...bewerteteZimmer.map(z => z.extremheit));
  
  // Sammle alle Zimmer mit maximaler Extremheit
  const extremsteZimmer = bewerteteZimmer.filter(z => z.extremheit === maxExtremheit);
  
  // Wähle zufällig eines der extremsten Zimmer
  const hauptzimmer = extremsteZimmer[Math.floor(Math.random() * extremsteZimmer.length)];
  
  // Sortiere restliche nach Extremheit für "weitere Zimmer"
  const weitereZimmer = bewerteteZimmer
    .filter(z => z.achse !== hauptzimmer?.achse)
    .sort((a, b) => b.extremheit - a.extremheit);
  
  return {
    hauptzimmer: hauptzimmer || null,
    weitereZimmer: weitereZimmer.slice(0, 3), // Top 3 weitere
    alleZimmer: bewerteteZimmer
  };
}

// Generiert eine persönliche Aufgabe basierend auf Achse und Position
function generiereAufgabe(achse, wert) {
  const aufgaben = {
    A1: {
      1: "Du verteidigst realistische Reformen gegen utopische Träumereien und zeigst, dass kleine Schritte zum Ziel führen.",
      2: "Du bringst pragmatische Perspektiven in revolutionäre Debatten und baust Brücken zwischen Positionen.",
      3: "Du vermittelst zwischen Reform und Revolution und hältst beide Optionen offen.",
      4: "Du treibst radikale Transformation voran und zeigst, dass Systemwechsel nötig ist.",
      5: "Du erinnerst alle daran: Ohne Bruch keine Befreiung. Du hältst die revolutionäre Perspektive wach."
    },
    A2: {
      1: "Du betonst die zentrale Rolle der Arbeiterklasse und organisierst in Betrieben.",
      2: "Du erweiterst den Blick auf alle Lohnabhängigen und verbindest verschiedene Sektoren.",
      3: "Du verbindest verschiedene Subjekte und suchst nach Gemeinsamkeiten.",
      4: "Du bringst intersektionale Perspektiven ein und zeigst Unterdrückungszusammenhänge auf.",
      5: "Du erweiterst das revolutionäre Subjekt auf alles Leben und denkst radikal inklusiv."
    },
    A3: {
      1: "Du analysierst den Staat als Werkzeug und entwickelst Strategien zu seiner Eroberung.",
      2: "Du arbeitest an konkreten Staatsreformen und demokratischen Umbaumaßnahmen.",
      3: "Du siehst den Staat als umkämpftes Terrain und navigierst klug zwischen den Positionen.",
      4: "Du baust autonome Strukturen jenseits des Staates auf und lebst Alternativen vor.",
      5: "Du erinnerst an die herrschaftliche Natur des Staates und arbeitest an seiner Überwindung."
    },
    A4: {
      1: "Du organisierst effiziente zentrale Strukturen für koordiniertes Handeln.",
      2: "Du baust Parteistrukturen auf, die Massenwirkung entfalten können.",
      3: "Du verbindest verschiedene Organisationsformen und lernst von allen.",
      4: "Du vernetzt dezentrale Initiativen und stärkst horizontale Strukturen.",
      5: "Du praktizierst und lehrst basisdemokratische Entscheidungsfindung."
    },
    B1: {
      1: "Du zeigst, wie sozial regulierte Märkte funktionieren können.",
      2: "Du entwickelst hybride Wirtschaftsmodelle mit starker Regulierung.",
      3: "Du experimentierst mit verschiedenen Koordinationsmechanismen.",
      4: "Du arbeitest an demokratischer Wirtschaftsplanung und Partizipation.",
      5: "Du entwickelst Visionen umfassender demokratischer Planung."
    },
    B2: {
      1: "Du stärkst öffentliches Eigentum und staatliche Daseinsvorsorge.",
      2: "Du entwickelst Modelle gesellschaftlichen Eigentums mit demokratischer Kontrolle.",
      3: "Du erforschst verschiedene Eigentumsformen und ihre Stärken.",
      4: "Du baust genossenschaftliche Strukturen auf und vernetzt sie.",
      5: "Du praktizierst und verbreitest Commons-basierte Wirtschaft."
    },
    B3: {
      1: "Du kämpfst für gute Arbeit für alle und gegen Arbeitslosigkeit.",
      2: "Du setzt dich für bessere Arbeitsbedingungen und Mitbestimmung ein.",
      3: "Du verbindest Arbeitskämpfe mit Arbeitszeitverkürzung.",
      4: "Du entwickelst Konzepte für ein bedingungsloses Grundeinkommen.",
      5: "Du denkst radikal über Arbeit hinaus und praktizierst Post-Work-Politik."
    },
    C1: {
      1: "Du betonst den Primat des Klassenkampfs und organisierst auf dieser Basis.",
      2: "Du verbindest Klassenpolitik mit anderen Kämpfen ohne Hierarchisierung.",
      3: "Du suchst nach Verbindungen zwischen verschiedenen Unterdrückungsformen.",
      4: "Du bringst intersektionale Analyse in alle politischen Diskussionen.",
      5: "Du machst feministischen Kampf zum Zentrum revolutionärer Politik."
    },
    C2: {
      1: "Du betonst die Notwendigkeit von Produktion und materieller Entwicklung.",
      2: "Du verbindest soziale mit ökologischen Forderungen pragmatisch.",
      3: "Du suchst nach sozial-ökologischen Win-Win-Lösungen.",
      4: "Du machst Klimagerechtigkeit zum Kern sozialistischer Politik.",
      5: "Du vertrittst Eigenrechte der Natur und radikalen Ökosozialismus."
    },
    C3: {
      1: "Du stärkst nationale Handlungsfähigkeit als Basis für Veränderung.",
      2: "Du praktizierst internationale Solidarität mit lokaler Verankerung.",
      3: "Du baust internationale Kooperationen auf praktischer Ebene.",
      4: "Du arbeitest an globalen sozialistischen Netzwerken.",
      5: "Du praktizierst und predigst Internationalismus ohne Kompromisse."
    },
    D1: {
      1: "Du warnst vor den Gefahren utopischer Entwürfe und betonst Negation.",
      2: "Du formulierst, was wir nicht wollen, ohne vorschnell Lösungen zu geben.",
      3: "Du hältst Prozess und Ziel in produktiver Spannung.",
      4: "Du entwickelst realistische Utopien, die inspirieren und orientieren.",
      5: "Du malst konkrete Bilder der befreiten Gesellschaft."
    },
    D2: {
      1: "Du entwickelst Strategien gradueller Transformation mit Geduld.",
      2: "Du baust alternative Strukturen in den Nischen des Systems.",
      3: "Du kombinierst verschiedene Transformationsstrategien klug.",
      4: "Du arbeitest auf gesellschaftliche Bruchpunkte hin.",
      5: "Du hältst die revolutionäre Perspektive eines fundamentalen Bruchs wach."
    },
    D3: {
      1: "Du betonst den säkularen Charakter linker Politik.",
      2: "Du bist offen für religiöse Genoss*innen ohne Religion zu fördern.",
      3: "Du verbindest verschiedene Weltanschauungen respektvoll.",
      4: "Du bringst spirituelle Dimensionen in politische Arbeit ein.",
      5: "Du verbindest innere und äußere Transformation radikal."
    },
    E1: {
      1: "Du hältst die klare Klassenlinie und warnst vor Verwässerung.",
      2: "Du baust einen stabilen sozialistischen Kern mit klarer Linie.",
      3: "Du suchst nach Bündnissen mit klaren Prinzipien.",
      4: "Du vernetzt verschiedene Bewegungen und findest Gemeinsamkeiten.",
      5: "Du baust die breitestmögliche Front gegen Kapital und Reaktion."
    },
    E2: {
      1: "Du koordinierst zentral für maximale Schlagkraft.",
      2: "Du baust föderale Strukturen mit klarer Arbeitsteilung.",
      3: "Du denkst und handelst auf mehreren Ebenen gleichzeitig.",
      4: "Du stärkst kommunale Selbstverwaltung und lokale Macht.",
      5: "Du praktizierst und lehrst Basisdemokratie von unten."
    },
    E3: {
      1: "Du organisierst Aufklärung und politische Bildungsarbeit.",
      2: "Du verbindest theoretische Arbeit mit Praxisreflexion.",
      3: "Du lernst aus Theorie und Praxis gleichermaßen.",
      4: "Du betonst Erfahrungswissen und gemeinsames Lernen im Kampf.",
      5: "Du lebst schon jetzt vor, wie die befreite Gesellschaft aussieht."
    },
    E4: {
      1: "Du organisierst strikt legalen Widerstand und nutzt alle Rechtswege.",
      2: "Du praktizierst zivilen Ungehorsam als legitimes Mittel.",
      3: "Du wählst Mittel situativ und begründest sie kontextabhängig.",
      4: "Du organisierst militante Aktionen wenn nötig.",
      5: "Du hältst alle Optionen offen und entscheidest taktisch."
    }
  };
  
  return aufgaben[achse]?.[wert] || "Du bringst deine einzigartige Perspektive ein.";
}

// Rendert die "Dein Platz"-Ansicht - 3 gleichwertige Zimmer
function renderDeinPlatz(profil, archetyp) {
  const platz = berechneDeinenPlatz(profil);
  if (!platz || !platz.alleZimmer || platz.alleZimmer.length === 0) return '';
  
  const achsenMeta = window.achsenMeta;
  
  // Top 3 Zimmer nach Extremheit (alle gleichwertig)
  const topZimmer = platz.alleZimmer
    .sort((a, b) => b.extremheit - a.extremheit)
    .slice(0, 3);
  
  let html = `
    <div class="dein-platz">
      <div class="dein-platz-header">
        <span class="dein-platz-icon">🔥</span>
        <div>
          <h2>Hier wirst du gebraucht</h2>
          <p>Basierend auf deinem Profil: Diese drei Bereiche passen besonders zu dir</p>
        </div>
      </div>
      
      <div class="drei-zimmer-grid">
  `;
  
  topZimmer.forEach((z, index) => {
    const meta = achsenMeta[z.achse];
    const posName = meta?.pole[z.profilWert - 1] || `Position ${z.profilWert}`;
    const knotenId = `${z.achse}-${z.profilWert}`;
    const knoten = knotenData[knotenId];
    
    html += `
      <div class="empfohlenes-zimmer" onclick="zeigeEmpfohlenesZimmer('${z.achse}', ${z.profilWert})">
        <div class="empf-zimmer-header">
          <span class="empf-zimmer-icon">${z.etageIcon}</span>
          <span class="empf-zimmer-achse">${z.achse}</span>
        </div>
        <h3 class="empf-zimmer-name">${z.zimmer.name}</h3>
        <p class="empf-zimmer-frage">${z.zimmer.beschreibung}</p>
        <div class="empf-zimmer-position">
          <span class="empf-pos-nummer">${z.profilWert}</span>
          <span class="empf-pos-name">${knoten?.name || posName}</span>
        </div>
        <div class="empf-zimmer-teaser">
          <span class="teaser-icon">✊</span>
          <span class="teaser-text">${z.aufgabe.slice(0, 80)}...</span>
        </div>
        <div class="empf-zimmer-action">
          <span>Klick für konkrete Aufgaben →</span>
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  
  return html;
}

// Zeigt Popup für empfohlenes Zimmer mit konkreten Aufgaben
function zeigeEmpfohlenesZimmer(achse, position) {
  const zimmer = window.hausStruktur
    .flatMap(e => e.zimmer)
    .find(z => z.achse === achse);
  
  if (!zimmer) return;
  
  const meta = window.achsenMeta[achse];
  const knotenId = `${achse}-${position}`;
  const knoten = knotenData[knotenId];
  const posName = knoten?.name || meta?.pole[position - 1] || `Position ${position}`;
  
  // Generiere 3 konkrete Aufgaben
  const aufgaben = generiereKonkreteAufgaben(achse, position);
  
  const html = `
    <div class="zimmer-detail-overlay" onclick="this.remove()">
      <div class="zimmer-detail-popup empfohlenes-popup" onclick="event.stopPropagation()">
        <button class="zimmer-detail-close" onclick="this.parentElement.parentElement.remove()">×</button>
        
        <div class="empf-popup-header">
          <span class="empf-popup-achse">${achse}</span>
          <h3>${zimmer.name}</h3>
        </div>
        
        <p class="empf-popup-frage">${zimmer.beschreibung}</p>
        
        <div class="empf-popup-position">
          <div class="position-marker">
            <span class="position-nummer">${position}</span>
          </div>
          <div class="position-info">
            <span class="position-name">${posName}</span>
            ${knoten?.beschreibung ? `<p class="position-beschreibung">${knoten.beschreibung}</p>` : ''}
          </div>
        </div>
        
        ${knoten?.zitate?.[0] ? `
          <div class="empf-popup-zitat">
            <span class="zitat-zeichen">"</span>
            <blockquote>${knoten.zitate[0].text}</blockquote>
            <cite>— ${knoten.zitate[0].autor}</cite>
          </div>
        ` : ''}
        
        <div class="empf-popup-aufgaben">
          <h4>✊ So kannst du dich konkret einbringen:</h4>
          <div class="aufgaben-liste">
            ${aufgaben.map((aufgabe, i) => `
              <div class="aufgabe-item">
                <span class="aufgabe-nummer">${i + 1}</span>
                <div class="aufgabe-content">
                  <strong>${aufgabe.titel}</strong>
                  <p>${aufgabe.beschreibung}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <button class="empf-popup-mehr" onclick="this.closest('.zimmer-detail-overlay').remove(); showKnoten('${knotenId}');">
          📖 Mehr über diese Position erfahren
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
}

// Generiert 3 konkrete Aufgaben für eine Position
function generiereKonkreteAufgaben(achse, position) {
  // Aufgaben-Datenbank (später durch generierte Texte ersetzen)
  const aufgabenDB = {
    A1: {
      1: [
        { titel: "Lokalpolitik stärken", beschreibung: "Engagiere dich in kommunalen Gremien und zeige, dass konkrete Verbesserungen möglich sind." },
        { titel: "Reformerfolge dokumentieren", beschreibung: "Sammle Beispiele erfolgreicher Reformen und teile sie in deinen Netzwerken." },
        { titel: "Dialog organisieren", beschreibung: "Organisiere Gesprächsrunden zwischen verschiedenen linken Strömungen über gangbare Wege." }
      ],
      2: [
        { titel: "Strukturreformen entwickeln", beschreibung: "Arbeite an Reformvorschlägen, die das System an seine Grenzen bringen." },
        { titel: "Druckmittel koordinieren", beschreibung: "Verbinde parlamentarische Arbeit mit außerparlamentarischem Druck." },
        { titel: "Reale Utopien aufbauen", beschreibung: "Unterstütze Projekte wie das Mietshäuser Syndikat oder Genossenschaften." }
      ],
      3: [
        { titel: "Strategiedebatten führen", beschreibung: "Moderiere Diskussionen über Reform und Revolution ohne Dogmatismus." },
        { titel: "Situationsanalysen erstellen", beschreibung: "Analysiere, wann welche Taktik angemessen ist." },
        { titel: "Flexibilität lehren", beschreibung: "Zeige, dass verschiedene Wege je nach Situation richtig sein können." }
      ],
      4: [
        { titel: "Krisenbewusstsein schärfen", beschreibung: "Analysiere gesellschaftliche Bruchlinien und potenzielle Kipppunkte." },
        { titel: "Revolutionäre Geschichte vermitteln", beschreibung: "Organisiere Lesekreise zu historischen Revolutionen und ihren Lehren." },
        { titel: "Gegenmacht aufbauen", beschreibung: "Stärke Strukturen, die im Ernstfall handlungsfähig sind." }
      ],
      5: [
        { titel: "Radikale Perspektive wachhalten", beschreibung: "Erinnere in reformistischen Kontexten an die Notwendigkeit grundlegender Veränderung." },
        { titel: "Historische Momente analysieren", beschreibung: "Studiere revolutionäre Situationen und ihre Bedingungen." },
        { titel: "Militanz reflektieren", beschreibung: "Diskutiere die Frage politischer Gewalt offen und differenziert." }
      ]
    },
    // Weitere Achsen...
    B1: {
      1: [
        { titel: "Soziale Marktwirtschaft verteidigen", beschreibung: "Argumentiere für regulierte Märkte mit starkem Sozialstaat." },
        { titel: "Genossenschaftsmodelle fördern", beschreibung: "Unterstütze marktwirtschaftliche Alternativen wie Genossenschaften." },
        { titel: "Konsument*innen organisieren", beschreibung: "Baue Verbraucher*innennetzwerke für ethischen Konsum auf." }
      ],
      3: [
        { titel: "Hybridmodelle entwickeln", beschreibung: "Experimentiere mit Kombinationen aus Plan und Markt." },
        { titel: "Partizipative Planung testen", beschreibung: "Initiiere lokale Experimente mit demokratischer Wirtschaftsplanung." },
        { titel: "Wirtschaftsdemokratie stärken", beschreibung: "Kämpfe für mehr Mitbestimmung in Betrieben und Branchen." }
      ],
      5: [
        { titel: "Planwirtschaft erforschen", beschreibung: "Studiere historische und theoretische Modelle demokratischer Planung." },
        { titel: "Digitale Planungstools entwickeln", beschreibung: "Arbeite an technischen Lösungen für dezentrale Koordination." },
        { titel: "Bedarfserhebung organisieren", beschreibung: "Entwickle Methoden, um gesellschaftliche Bedürfnisse demokratisch zu erfassen." }
      ]
    },
    C2: {
      1: [
        { titel: "Produktivkräfte entwickeln", beschreibung: "Argumentiere für technischen Fortschritt als Basis für Befreiung." },
        { titel: "Arbeitsplätze sichern", beschreibung: "Verbinde ökologische Forderungen mit Beschäftigungsperspektiven." },
        { titel: "Modernisierung vorantreiben", beschreibung: "Setze dich für ökologische Industriepolitik ein." }
      ],
      3: [
        { titel: "Win-Win-Lösungen finden", beschreibung: "Entwickle Konzepte, die Soziales und Ökologisches verbinden." },
        { titel: "Just Transition organisieren", beschreibung: "Kämpfe für gerechte Übergänge in betroffenen Branchen." },
        { titel: "Klimabewegung verbinden", beschreibung: "Baue Brücken zwischen Gewerkschaften und Umweltbewegung." }
      ],
      5: [
        { titel: "Eigenrechte der Natur vertreten", beschreibung: "Setze dich für rechtliche Anerkennung von Ökosystemen ein." },
        { titel: "Degrowth praktizieren", beschreibung: "Lebe und verbreite Konzepte des guten Lebens jenseits von Wachstum." },
        { titel: "Ökosozialismus entwickeln", beschreibung: "Arbeite an einer Synthese von Sozialismus und Ökologie." }
      ]
    }
  };
  
  // Fallback-Aufgaben
  const fallback = [
    { titel: "Netzwerke aufbauen", beschreibung: "Verbinde dich mit anderen, die ähnlich denken, und tauscht euch aus." },
    { titel: "Wissen teilen", beschreibung: "Organisiere Lesekreise oder Workshops zu deinen Themen." },
    { titel: "Praxis wagen", beschreibung: "Setze kleine Projekte um, die deine Überzeugungen sichtbar machen." }
  ];
  
  return aufgabenDB[achse]?.[position] || fallback;
}

// Findet ähnliche Archetypen basierend auf ideal-Werten
function findeAehnlicheArchetypen(eigenerArchetyp, anzahl = 3) {
  const archetypen = window.archetypen;
  if (!archetypen || !eigenerArchetyp) return [];
  
  const eigener = archetypen[eigenerArchetyp];
  if (!eigener || !eigener.ideal) return [];
  
  const distanzen = [];
  
  Object.entries(archetypen).forEach(([id, arch]) => {
    if (id === eigenerArchetyp || !arch.ideal) return;
    
    // Berechne Distanz
    let distanz = 0;
    Object.keys(eigener.ideal).forEach(achse => {
      const diff = Math.abs((eigener.ideal[achse] || 3) - (arch.ideal[achse] || 3));
      distanz += diff;
    });
    
    distanzen.push({ id, ...arch, distanz });
  });
  
  distanzen.sort((a, b) => a.distanz - b.distanz);
  
  return distanzen.slice(0, anzahl);
}

// Scrollt zum Zimmer in der funktionalen Ansicht
function scrollToZimmer(achse) {
  document.querySelector('.dein-platz').style.display = 'none';
  
  setTimeout(() => {
    const zimmerEl = document.querySelector(`[data-achse="${achse}"]`);
    if (zimmerEl) {
      zimmerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      zimmerEl.classList.add('highlight-pulse');
      setTimeout(() => zimmerEl.classList.remove('highlight-pulse'), 2000);
    }
  }, 100);
}

// Legacy-Funktion für Kompatibilität
function highlightMeineWG(knoten, profil) {
  // Wird jetzt direkt in renderHaus gemacht
}

// parseUrlParams wird im fetch-Callback aufgerufen (siehe oben)

// ══════════════════════════════════════════════════════════════════════
// REAKTOR
// ══════════════════════════════════════════════════════════════════════

function openReaktor(idA, idB) {
  const a = knotenData[idA];
  const b = knotenData[idB];
  if (!a || !b) return;
  
  document.getElementById('reaktor-a').textContent = a.name;
  document.getElementById('reaktor-b').textContent = b.name;
  
  // Analyse
  const analyse = analysiereVerbindung(idA, idB);
  
  let html = '';
  
  // Sektion 1: Direkte Verbindung
  html += '<div class="reaktor-section">';
  html += '<h3>Direkte Verbindung</h3>';
  
  if (analyse.direkteVerbindung) {
    const v = analyse.direkteVerbindung;
    const typ = v.typ === 'debatte' ? 'debatte' : 'direkt';
    html += `<div class="reaktor-verbindung ${typ}">`;
    html += `<div style="font-size: 1.1rem; color: #fff; margin-bottom: 0.5rem;">`;
    html += v.typ === 'debatte' ? '⚔️ Debatte' : '🤝 Affinität';
    html += `</div>`;
    html += `<div style="font-size: 0.9rem; color: #aaa;">${v.beschreibung || ''}</div>`;
    html += `<div style="margin-top: 0.5rem;">`;
    html += `<span style="color: ${v.staerke > 0.7 ? '#4CAF50' : v.staerke > 0.4 ? '#FF9800' : '#f44336'};">`;
    html += `Stärke: ${Math.round(v.staerke * 100)}%</span>`;
    html += `</div>`;
    html += `</div>`;
  } else {
    html += `<div class="reaktor-verbindung keine">`;
    html += `<div style="color: #888;">Keine direkte Verbindung dokumentiert</div>`;
    html += `<div style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">`;
    html += `Achsen-Distanz: ${analyse.achsenDistanz !== null ? analyse.achsenDistanz + ' Schritte' : 'verschiedene Achsen'}`;
    html += `</div>`;
    html += `</div>`;
  }
  html += '</div>';
  
  // Sektion 2: Gemeinsame Nachbarn
  html += '<div class="reaktor-section">';
  html += '<h3>Gemeinsame Nachbarn</h3>';
  
  if (analyse.gemeinsameNachbarn.length > 0) {
    html += '<div class="reaktor-nachbarn">';
    analyse.gemeinsameNachbarn.forEach(n => {
      html += `<span class="reaktor-nachbar" onclick="openReaktor('${idA}', '${n.id}')">${n.name}</span>`;
    });
    html += '</div>';
    html += `<div style="font-size: 0.75rem; color: #666; margin-top: 0.5rem;">`;
    html += `Diese Positionen sind mit beiden verbunden`;
    html += `</div>`;
  } else {
    html += `<div style="color: #666; font-size: 0.9rem;">Keine gemeinsamen Nachbarn</div>`;
  }
  
  // Kürzester Pfad
  if (analyse.pfad && analyse.pfad.length > 2) {
    html += `<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #333;">`;
    html += `<div style="font-size: 0.75rem; color: #888; margin-bottom: 0.5rem;">Kürzester Pfad (${analyse.pfad.length - 1} Schritte):</div>`;
    html += `<div style="font-size: 0.85rem; color: #aaa;">`;
    html += analyse.pfad.map(id => knotenData[id]?.name || id).join(' → ');
    html += `</div></div>`;
  }
  html += '</div>';
  
  // Sektion 3: Synthese-Versuch
  html += '<div class="reaktor-section">';
  html += '<h3>Synthese / Spannung</h3>';
  
  const synthese = generiereSynthese(a, b, analyse);
  html += `<div class="reaktor-synthese">${synthese.text}</div>`;
  
  if (synthese.frage) {
    html += `<div class="reaktor-frage">${synthese.frage}</div>`;
  }
  
  // Gemeinsame Bewohner
  if (analyse.gemeinsamePersonen.length > 0) {
    html += `<div style="margin-top: 1rem; font-size: 0.85rem;">`;
    html += `<span style="color: #888;">Personen in beiden:</span> `;
    html += `<span style="color: #ccc;">${analyse.gemeinsamePersonen.join(', ')}</span>`;
    html += `</div>`;
  }
  
  html += '</div>';
  
  document.getElementById('reaktor-body').innerHTML = html;
  document.getElementById('reaktor-panel').classList.add('open');
  closePanel(); // Detail-Panel schließen
}

function closeReaktor() {
  document.getElementById('reaktor-panel').classList.remove('open');
}

function analysiereVerbindung(idA, idB) {
  const a = knotenData[idA];
  const b = knotenData[idB];
  
  // Direkte Verbindung?
  const direkteVerbindung = verbindungenData.find(v => 
    (v.von === idA && v.zu === idB) || (v.von === idB && v.zu === idA)
  );
  
  // Nachbarn von A und B
  const nachbarnA = new Set();
  const nachbarnB = new Set();
  
  verbindungenData.forEach(v => {
    if (v.von === idA) nachbarnA.add(v.zu);
    if (v.zu === idA) nachbarnA.add(v.von);
    if (v.von === idB) nachbarnB.add(v.zu);
    if (v.zu === idB) nachbarnB.add(v.von);
  });
  
  // Gemeinsame Nachbarn
  const gemeinsameNachbarn = [...nachbarnA].filter(id => nachbarnB.has(id))
    .map(id => ({ id, name: knotenData[id]?.name }))
    .filter(n => n.name);
  
  // Achsen-Distanz (wenn gleiche Achse)
  let achsenDistanz = null;
  if (a.achse === b.achse) {
    achsenDistanz = Math.abs(a.position - b.position);
  }
  
  // Gemeinsame Personen
  const personenA = new Set([
    ...(a.bewohner?.klassiker || []),
    ...(a.bewohner?.zeitgenossen || [])
  ].map(p => p.replace(/\s*\([^)]*\)/, '')));
  
  const personenB = new Set([
    ...(b.bewohner?.klassiker || []),
    ...(b.bewohner?.zeitgenossen || [])
  ].map(p => p.replace(/\s*\([^)]*\)/, '')));
  
  const gemeinsamePersonen = [...personenA].filter(p => personenB.has(p));
  
  // Kürzester Pfad (BFS)
  const pfad = findeKürzestenPfad(idA, idB);
  
  return {
    direkteVerbindung,
    gemeinsameNachbarn,
    achsenDistanz,
    gemeinsamePersonen,
    pfad
  };
}

function findeKürzestenPfad(startId, zielId) {
  const queue = [[startId]];
  const visited = new Set([startId]);
  
  while (queue.length > 0) {
    const pfad = queue.shift();
    const current = pfad[pfad.length - 1];
    
    if (current === zielId) return pfad;
    
    // Nachbarn finden
    const nachbarn = [];
    verbindungenData.forEach(v => {
      if (v.von === current && !visited.has(v.zu)) nachbarn.push(v.zu);
      if (v.zu === current && !visited.has(v.von)) nachbarn.push(v.von);
    });
    
    nachbarn.forEach(n => {
      visited.add(n);
      queue.push([...pfad, n]);
    });
    
    // Abbruch bei zu langen Pfaden
    if (pfad.length > 10) return null;
  }
  
  return null;
}

function generiereSynthese(a, b, analyse) {
  // Verschiedene Synthese-Typen basierend auf der Beziehung
  
  // Gleiche Achse = Spektrum
  if (a.achse === b.achse) {
    const distanz = Math.abs(a.position - b.position);
    if (distanz <= 1) {
      return {
        text: `${a.name} und ${b.name} sind Nachbarn auf der ${a.achse}-Achse. Sie teilen Grundannahmen, unterscheiden sich aber in der Intensität oder Konsequenz.`,
        frage: `Was genau ist der Unterschied? Ist es eine Frage des Grades oder des Prinzips?`
      };
    } else if (distanz >= 3) {
      return {
        text: `${a.name} und ${b.name} markieren gegensätzliche Pole derselben Frage. Die Spannung zwischen ihnen definiert das gesamte Spektrum der ${a.achse}-Debatte.`,
        frage: `Gibt es eine Position in der Mitte, die beide versöhnt – oder ist die Spannung unauflösbar?`
      };
    }
  }
  
  // Debatte
  if (analyse.direkteVerbindung?.typ === 'debatte') {
    return {
      text: `Hier treffen historische Gegner aufeinander. Die Debatte zwischen ${a.name} und ${b.name} hat die Linke geprägt und gespalten.`,
      frage: `Wer hatte recht? Oder ist die Frage falsch gestellt?`
    };
  }
  
  // Hohe Affinität
  if (analyse.direkteVerbindung?.staerke > 0.8) {
    return {
      text: `${a.name} und ${b.name} gehören zusammen wie zwei Seiten einer Medaille. Wer das eine denkt, denkt meist auch das andere.`,
      frage: `Muss das so sein? Kann man das eine ohne das andere haben?`
    };
  }
  
  // Gemeinsame Nachbarn
  if (analyse.gemeinsameNachbarn.length > 0) {
    const brücken = analyse.gemeinsameNachbarn.slice(0, 3).map(n => n.name).join(', ');
    return {
      text: `${a.name} und ${b.name} haben keine direkte Verbindung, aber gemeinsame Nachbarn: ${brücken}. Diese könnten als Brücke dienen.`,
      frage: `Was würde passieren, wenn jemand versucht, ${a.name} und ${b.name} direkt zu verbinden?`
    };
  }
  
  // Verschiedene Achsen, keine Verbindung
  return {
    text: `${a.name} (${a.achse}) und ${b.name} (${b.achse}) bewegen sich auf verschiedenen Achsen des Denkens. Ihre Begegnung wäre ein Experiment.`,
    frage: `Was würde ${a.bewohner?.klassiker?.[0]?.replace(/\s*\([^)]*\)/, '') || 'ein Vertreter von ' + a.name} zu ${b.name} sagen?`
  };
}
  