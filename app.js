// ═══════════════════════════════════════════════════════════════════════════
// SOZIALISMUS-GENERATOR V3.1 - Mosaik + Modal Overlay
// ═══════════════════════════════════════════════════════════════════════════

const { useState, useEffect, useMemo } = React;

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE CSS INJECTION
// ═══════════════════════════════════════════════════════════════════════════

const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
  /* Mobile Viewport Fix */
  @media (max-width: 768px) {
    body {
      overflow-x: hidden;
    }
    
    /* Container */
    .container {
      padding: 0 0.75rem !important;
      max-width: 100% !important;
    }
    
    /* Grids */
    .generator-grid,
    [style*="gridTemplateColumns: 'repeat(3"] {
      grid-template-columns: 1fr 1fr !important;
      gap: 0.5rem !important;
    }
    
    /* Kacheln */
    .generator-kachel,
    [style*="padding: '0.75rem'"][style*="borderRadius: '10px'"] {
      padding: 0.6rem !important;
    }
    
    /* Modals */
    [style*="maxWidth: '500px'"] {
      max-width: calc(100vw - 1rem) !important;
      margin: 0.5rem !important;
      padding: 1rem !important;
    }
    
    /* Buttons nebeneinander */
    [style*="display: 'flex'"][style*="gap: '1rem'"] {
      flex-wrap: wrap !important;
    }
    
    /* Intro */
    .intro h1 {
      font-size: 1.5rem !important;
    }
    
    /* Analyse Header */
    [style*="fontSize: '4rem'"] {
      font-size: 3rem !important;
    }
    
    /* Cards */
    .card {
      padding: 1rem !important;
    }
    
    /* Option Cards Stack */
    [style*="marginTop: '1rem'"] > [style*="borderRadius: '12px'"] {
      margin-bottom: 0.75rem !important;
    }
    
    /* Text Sizes */
    [style*="fontSize: '1.3rem'"],
    [style*="fontSize: '1.2rem'"] {
      font-size: 1.1rem !important;
    }
    
    /* Theoretiker */
    [style*="gridTemplateColumns: 'repeat(2, 1fr)'"]:not(.generator-grid) {
      grid-template-columns: 1fr !important;
    }
    
    /* Position bubbles - kleinere Größe */
    [style*="width: '14px'"][style*="height: '14px'"] {
      width: 12px !important;
      height: 12px !important;
    }
  }
  
  @media (max-width: 480px) {
    /* Noch kleinere Screens - 1 Spalte */
    .generator-grid {
      grid-template-columns: 1fr !important;
    }
    
    /* Header */
    header h1 {
      font-size: 0.9rem !important;
    }
    
    /* Buttons */
    .btn {
      padding: 0.6rem 1rem !important;
      font-size: 0.85rem !important;
    }
    
    .btn-large {
      padding: 0.75rem 1.25rem !important;
    }
    
    /* Labels */
    .label {
      font-size: 0.6rem !important;
    }
  }
`;
document.head.appendChild(mobileStyles);

// ═══════════════════════════════════════════════════════════════════════════
// KONSTANTEN
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  rot: '#C62828',
  schwarz: '#1A1A1A',
  weiss: '#FAFAFA',
  creme: '#F5F0E8',
  gruen: '#2E7D32',
  orange: '#EF6C00',
  grau: '#616161',
};

// ═══════════════════════════════════════════════════════════════════════════
// SOZIALISMUS-ANALYSE-ENGINE (Deterministische Frontend-Logik)
// ═══════════════════════════════════════════════════════════════════════════

const SOZIALISMUS_ENGINE = {
  
  theoretiker: {
    "Eduard Bernstein": { bedingungen: { A1: [1,2], A3: [1,2] }, schlagwort: "Evolutionärer Sozialismus", wiki: "Eduard_Bernstein" },
    "Rosa Luxemburg": { bedingungen: { A1: [3,4,5], A4: [3,4,5], A2: [1,2,3] }, schlagwort: "Spontaneität der Massen", wiki: "Rosa_Luxemburg" },
    "Anton Pannekoek": { bedingungen: { A1: [4,5], A3: [4,5], A4: [4,5] }, schlagwort: "Rätekommunismus", wiki: "Anton_Pannekoek" },
    "Michail Bakunin": { bedingungen: { A3: [4,5], A4: [5], B2: [4,5] }, schlagwort: "Kollektiver Anarchismus", wiki: "Michail_Bakunin" },
    "Peter Kropotkin": { bedingungen: { A3: [5], B2: [5], B3: [4,5] }, schlagwort: "Anarcho-Kommunismus", wiki: "Peter_Kropotkin" },
    "Murray Bookchin": { bedingungen: { A3: [4,5], C2: [4,5], E2: [1,2] }, schlagwort: "Kommunalismus", wiki: "Murray_Bookchin" },
    "Antonio Negri": { bedingungen: { A1: [4,5], A2: [4,5], A4: [4,5] }, schlagwort: "Multitude", wiki: "Antonio_Negri" },
    "John Holloway": { bedingungen: { A1: [5], A3: [4,5], A4: [5] }, schlagwort: "Die Welt verändern ohne die Macht zu übernehmen", wiki: "John_Holloway_(Soziologe)" },
    "Antonio Gramsci": { bedingungen: { A1: [3,4], D1: [2,3,4] }, schlagwort: "Kulturelle Hegemonie", wiki: "Antonio_Gramsci" },
    "Nicos Poulantzas": { bedingungen: { A1: [3], A3: [2,3], A4: [3,4] }, schlagwort: "Relationale Staatstheorie", wiki: "Nicos_Poulantzas" },
    "André Gorz": { bedingungen: { A1: [2,3], B3: [4,5], C2: [4,5] }, schlagwort: "Politische Ökologie", wiki: "André_Gorz" },
    "Silvia Federici": { bedingungen: { C1: [4,5], B3: [4,5], B2: [4,5] }, schlagwort: "Feministische Reproduktionsarbeit", wiki: "Silvia_Federici" },
    "Nancy Fraser": { bedingungen: { C1: [4,5], A1: [2,3] }, schlagwort: "Feminismus für die 99%", wiki: "Nancy_Fraser" },
    "Frantz Fanon": { bedingungen: { C3: [4,5], E4: [4,5] }, schlagwort: "Dekolonisierung", wiki: "Frantz_Fanon" },
    "Erik Olin Wright": { bedingungen: { A1: [2,3], B2: [3,4] }, schlagwort: "Reale Utopien", wiki: "Erik_Olin_Wright" },
    "David Graeber": { bedingungen: { A4: [5], B3: [5], A3: [5] }, schlagwort: "Anarchistische Anthropologie", wiki: "David_Graeber" },
    "Mark Fisher": { bedingungen: { D1: [3,4,5], D3: [3,4,5] }, schlagwort: "Kapitalistischer Realismus", wiki: "Mark_Fisher_(Kulturtheoretiker)" }
  },

  stroemungen: [
    { name: "Anarcho-Kommunismus", kurzform: "Anarchistisch", icon: "Ⓐ", id: "libertaerer_sozialismus",
      bedingungen: (p) => p.A3 >= 4 && p.A4 >= 4 && p.B2 >= 4,
      beschreibung: "Du willst den Staat abschaffen und durch freie Assoziationen ersetzen. Eigentum wird gemeinschaftlich verwaltet, ohne zentrale Autorität.",
      wesenKnoten: ["A3-5", "B2-5", "E2-5"],
      wesenZimmer: "Der Garten - hier wächst alles wild, aber zusammen" },
    { name: "Rätekommunismus", kurzform: "Rätedemokratisch", icon: "☭", id: "raetekommunismus",
      bedingungen: (p) => p.A1 >= 4 && p.A3 >= 3 && p.A4 >= 4 && p.B1 <= 3,
      beschreibung: "Du setzt auf Arbeiterräte als Organe der Selbstverwaltung. Die Basis entscheidet – in Betrieb und Stadtteil.",
      wesenKnoten: ["A3-4", "B2-5", "E3-4"],
      wesenZimmer: "Die Versammlungshalle - hier entscheiden alle gemeinsam" },
    { name: "Autonomer Sozialismus", kurzform: "Autonom", icon: "🏴", id: "autonomismus",
      bedingungen: (p) => p.A1 >= 4 && p.A4 >= 4 && p.E1 >= 3,
      beschreibung: "Du glaubst an Veränderung durch Bewegung, nicht durch Parteien. Die neue Gesellschaft wird im Widerstand geboren.",
      wesenKnoten: ["A2-4", "A3-4", "B3-4"],
      wesenZimmer: "Der Korridor - hier kreuzen sich alle Kämpfe" },
    { name: "Demokratischer Sozialismus", kurzform: "Demokratisch", icon: "🌹", id: "demokratischer_sozialismus",
      bedingungen: (p) => p.A1 <= 3 && p.A3 <= 3 && p.A4 <= 3,
      beschreibung: "Du willst den Sozialismus durch demokratische Reformen erreichen. Schritt für Schritt, Mehrheit für Mehrheit.",
      wesenKnoten: ["A1-2", "A3-2", "D2-2"],
      wesenZimmer: "Der Salon - hier wird debattiert und abgestimmt" },
    { name: "Libertärer Kommunalismus", kurzform: "Kommunalistisch", icon: "🌻", id: "municipalismus",
      bedingungen: (p) => p.A3 >= 4 && p.E2 <= 2 && p.C2 >= 3,
      beschreibung: "Du setzt auf kommunale Selbstverwaltung und direkte Demokratie. Föderationen freier Kommunen ersetzen den Nationalstaat.",
      wesenKnoten: ["E2-5", "A3-4", "B2-4"],
      wesenZimmer: "Der Innenhof - hier versammelt sich die Nachbarschaft" },
    { name: "Ökosozialismus", kurzform: "Ökosozialistisch", icon: "🌍", id: "oekosozialismus",
      bedingungen: (p) => p.C2 >= 4 && p.B3 >= 3,
      beschreibung: "Ökologische und soziale Krise sind zwei Seiten derselben Medaille. Nur ein Systemwechsel kann beide lösen.",
      wesenKnoten: ["C2-4", "B3-4", "A1-4"],
      wesenZimmer: "Der Wintergarten - hier wächst die Zukunft unter Glas" },
    { name: "Feministischer Sozialismus", kurzform: "Feministisch", icon: "♀️", id: "feministischer_sozialismus",
      bedingungen: (p) => p.C1 >= 4 && (p.B3 >= 3 || p.A2 >= 3),
      beschreibung: "Patriarchat und Kapitalismus sind verwobene Herrschaftssysteme. Care-Arbeit und Geschlecht stehen im Zentrum.",
      wesenKnoten: ["C1-4", "B3-3", "A2-4"],
      wesenZimmer: "Die Küche - hier wird die unsichtbare Arbeit sichtbar" },
    { name: "Postkolonialer Sozialismus", kurzform: "Antiimperialistisch", icon: "✊🏾", id: "buen_vivir",
      bedingungen: (p) => p.C3 >= 4 && p.E4 >= 3,
      beschreibung: "Sozialismus ohne Dekolonisierung ist unvollständig. Die Kämpfe im globalen Süden sind zentral.",
      wesenKnoten: ["C2-5", "D3-4", "C3-4"],
      wesenZimmer: "Die Terrasse - hier weht der Wind aus allen Richtungen" },
    { name: "Reformorientierter Sozialismus", kurzform: "Reformistisch", icon: "📜", id: "eurokommunismus",
      bedingungen: (p) => p.A1 <= 2 && p.E4 <= 2,
      beschreibung: "Du glaubst an den parlamentarischen Weg. Reformen verbessern das Leben und bereiten größere Veränderungen vor.",
      wesenKnoten: ["A1-2", "D2-2", "B1-2"],
      wesenZimmer: "Das Büro - hier wird an den Details gearbeitet" }
  ],

  spannungen: [
    { test: (p) => p.A3 <= 2 && p.A4 >= 4, titel: "Staat vs. Basisdemokratie",
      beschreibung: "Du willst den Staat nutzen, aber Hierarchien ablehnen.", frage: "Kann ein Staatsapparat ohne Hierarchie funktionieren?" },
    { test: (p) => p.B1 <= 2 && p.A4 >= 4, titel: "Zentrale Planung vs. Basisdemokratie",
      beschreibung: "Du willst Planung und maximale Basisdemokratie.", frage: "Wie kann Planung dezentral und trotzdem koordiniert funktionieren?" },
    { test: (p) => p.A2 <= 2 && p.C1 >= 4, titel: "Klasse vs. Intersektionalität",
      beschreibung: "Du fokussierst auf die Arbeiterklasse, betonst aber auch Feminismus.", frage: "Ist Geschlecht ein Nebenwiderspruch?" },
    { test: (p) => p.A1 <= 2 && p.A3 >= 4, titel: "Reform vs. Staatsablehnung",
      beschreibung: "Du willst graduelle Reformen, lehnst aber den Staat ab.", frage: "Wer soll die Reformen dann umsetzen?" },
    { test: (p) => p.E4 >= 4 && p.E1 <= 2, titel: "Militanz vs. Enge Bündnisse",
      beschreibung: "Du bist offen für Militanz, arbeitest aber nur mit Gleichgesinnten.", frage: "Führt Radikalität zur Isolation?" },
    { test: (p) => p.B3 >= 4 && p.A1 <= 2, titel: "Post-Work vs. Reformismus",
      beschreibung: "Du willst Lohnarbeit überwinden, setzt aber auf graduelle Reformen.", frage: "Kann man sich aus der Arbeit herausreformieren?" },
    { test: (p) => p.C2 >= 4 && p.C3 <= 2, titel: "Ökologie vs. Nationale Fokussierung",
      beschreibung: "Du priorisierst Ökologie, fokussierst aber national.", frage: "Kann ein Land allein ökologisch transformieren?" },
    { test: (p) => p.D1 <= 2 && p.A1 >= 4, titel: "Vage Utopie vs. Revolution",
      beschreibung: "Du willst revolutionären Bruch, ohne konkretes Bild der Zukunft.", frage: "Wofür kämpfst du dann?" }
  ],

  positionsBeschreibungen: {
    wirtschaft: (p) => {
      if (p.B1 <= 2 && p.B2 <= 2) return "Zentrale Planung in staatlicher Hand";
      if (p.B1 <= 2 && p.B2 >= 4) return "Demokratische Planung mit Gemeineigentum";
      if (p.B1 >= 4 && p.B2 >= 4) return "Dezentrale Commons-Wirtschaft";
      if (p.B1 >= 4 && p.B2 <= 2) return "Marktsozialistisches Genossenschaftsmodell";
      return "Gemischte Koordination mit starkem öffentlichen Sektor";
    },
    staat: (p) => {
      if (p.A3 <= 2 && p.A4 <= 2) return "Staat als Werkzeug der Transformation";
      if (p.A3 <= 2 && p.A4 >= 4) return "Demokratisierter Staat mit Basisbeteiligung";
      if (p.A3 >= 4 && p.A4 >= 4) return "Ersetzung des Staates durch Selbstverwaltung";
      if (p.A3 >= 4 && p.A4 <= 2) return "Revolutionärer Bruch, neue Institutionen";
      return "Transformation durch Druck von unten und oben";
    },
    wandel: (p) => {
      if (p.A1 <= 2 && p.E4 <= 2) return "Parlamentarischer Weg, legale Mittel";
      if (p.A1 <= 2 && p.E4 >= 4) return "Reform mit militantem Druck";
      if (p.A1 >= 4 && p.E4 <= 2) return "Revolutionärer Bruch, aber gewaltfrei";
      if (p.A1 >= 4 && p.E4 >= 4) return "Revolutionärer Bruch, alle Mittel";
      return "Kombination aus Reform und außerparlamentarischem Druck";
    },
    subjekt: (p) => {
      if (p.A2 <= 2) return "Industriearbeiterschaft als Kern";
      if (p.A2 === 3) return "Breite Klasse aller Lohnabhängigen";
      if (p.A2 >= 4 && p.C1 >= 4) return "Intersektionale Multitude";
      if (p.A2 >= 4) return "Vielfalt der Unterdrückten";
      return "Erweiterter Klassenbegriff";
    }
  },

  analysiere: function(profil) {
    const p = {};
    Object.keys(profil).forEach(k => { p[k] = profil[k]; });
    
    // 1. Strömung finden
    let hauptstroemung = null;
    let nebenstroemungen = [];
    for (const s of this.stroemungen) {
      if (s.bedingungen(p)) {
        if (!hauptstroemung) hauptstroemung = s;
        else nebenstroemungen.push(s);
      }
    }
    if (!hauptstroemung) {
      hauptstroemung = { name: "Eigenständiger Sozialismus", kurzform: "Eigenständig", icon: "🔥", id: "eigenstaendig",
        beschreibung: "Dein Profil passt in keine klassische Schublade – du kombinierst Elemente verschiedener Strömungen auf eigene Weise.",
        wesenKnoten: ["A1-3", "B1-3", "C1-3"],
        wesenZimmer: "Die Lobby - ein Übergangsraum zum Erkunden" };
    }
    
    // 2. Theoretiker finden
    const passende_theoretiker = [];
    for (const [name, data] of Object.entries(this.theoretiker)) {
      let passt = true;
      for (const [param, werte] of Object.entries(data.bedingungen)) {
        if (!werte.includes(p[param])) { passt = false; break; }
      }
      if (passt) passende_theoretiker.push({ name, schlagwort: data.schlagwort, wiki: data.wiki });
    }
    
    // 3. Spannungen finden
    const gefundene_spannungen = this.spannungen.filter(s => s.test(p));
    
    // 4. Positionen
    const positionen = {
      wirtschaft: this.positionsBeschreibungen.wirtschaft(p),
      staat: this.positionsBeschreibungen.staat(p),
      wandel: this.positionsBeschreibungen.wandel(p),
      subjekt: this.positionsBeschreibungen.subjekt(p)
    };
    
    // 5. Stärken
    const staerken = [];
    if (p.A4 >= 4 && p.E1 >= 4) staerken.push("Verbindet Basisdemokratie mit Bündnisfähigkeit");
    if (p.C1 >= 4 && p.A2 >= 3) staerken.push("Integriert Feminismus in Klassenpolitik");
    if (p.C2 >= 4 && p.B3 >= 4) staerken.push("Denkt Ökologie und Arbeitskritik zusammen");
    if (p.A1 >= 3 && p.A1 <= 4) staerken.push("Balance zwischen Reform und Bruch");
    if (p.D1 >= 3 && p.D1 <= 4) staerken.push("Konkrete Vision ohne Dogmatismus");
    if (staerken.length === 0) staerken.push("Eigenständige Kombination verschiedener Ansätze");
    
    // 6. Slogan
    const slogans = {
      "Anarcho-Kommunismus": "Keine Götter, keine Herren!",
      "Rätekommunismus": "Alle Macht den Räten!",
      "Autonomer Sozialismus": "Wir sind überall!",
      "Demokratischer Sozialismus": "Demokratie in Wirtschaft und Staat!",
      "Libertärer Kommunalismus": "Denke global, handle lokal!",
      "Ökosozialismus": "System Change, not Climate Change!",
      "Feministischer Sozialismus": "Feminismus für die 99%!",
      "Postkolonialer Sozialismus": "Hasta la victoria siempre!",
      "Reformorientierter Sozialismus": "Der Weg ist das Ziel!",
      "Eigenständiger Sozialismus": "Eine andere Welt ist möglich!"
    };
    
    // 7. Name
    let name = hauptstroemung.name;
    if (p.C2 >= 4 && !name.includes("Öko")) name = "Öko-" + name.charAt(0).toLowerCase() + name.slice(1);
    if (p.C1 >= 4 && !name.includes("Feministisch")) name = "Feministischer " + name;
    
    return {
      name, kurzform: hauptstroemung.kurzform, icon: hauptstroemung.icon,
      id: hauptstroemung.id || 'eigenstaendig',
      slogan: slogans[hauptstroemung.name] || "Eine andere Welt ist möglich!",
      beschreibung: hauptstroemung.beschreibung,
      theoretiker: passende_theoretiker.slice(0, 4),
      spannungen: gefundene_spannungen.slice(0, 3),
      positionen, staerken: staerken.slice(0, 3),
      nebenstroemungen: nebenstroemungen.map(s => s.name).slice(0, 2),
      wesenKnoten: hauptstroemung.wesenKnoten || ["A1-3", "B1-3", "C1-3"],
      wesenZimmer: hauptstroemung.wesenZimmer || "Die Lobby - ein Übergangsraum"
    };
  }
};

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_API_KEY = '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';

// ═══════════════════════════════════════════════════════════════════════════
// BASIS-PARAMETER
// ═══════════════════════════════════════════════════════════════════════════

const PARAMETER_L1_BASE = [
  { id: 1, titel: 'EIGENTUM', kurz: 'Wem gehört die Wirtschaft?', links: 'Privat', rechts: 'Gemeinsam', icon: '🏭',
    gegenargument: 'Konzerne schreiben heute die Gesetze, die sie regulieren sollen.',
    programmScore: 4, programmText: 'Vergesellschaftung in Schlüsselbereichen, aber kleine/mittlere Unternehmen bleiben privat' },
  { id: 2, titel: 'PLANUNG', kurz: 'Wer entscheidet, was produziert wird?', links: 'Der Markt', rechts: 'Wir alle', icon: '📊',
    gegenargument: 'Der Markt produziert Luxusautos, während Menschen obdachlos sind.',
    programmScore: 3, programmText: 'Marktsteuerung bleibt, nur unter demokratischer Rahmensetzung' },
  { id: 3, titel: 'WACHSTUM', kurz: 'Brauchen wir immer mehr?', links: 'Ja, mit Technik', rechts: 'Nein, genug ist genug', icon: '📈',
    gegenargument: 'Unendliches Wachstum auf einem endlichen Planeten ist unmöglich.',
    programmScore: 4, programmText: 'Nachhaltiges Wirtschaften, aber kein explizites Degrowth/Postwachstum' },
  { id: 4, titel: 'ARBEIT', kurz: 'Was bedeutet Arbeit für dich?', links: 'Pflicht & Sinn', rechts: 'Nur ein Teil des Lebens', icon: '⚙️',
    gegenargument: 'Warum ist nur "Arbeit", was bezahlt wird?',
    programmScore: 3, programmText: 'Arbeitszeitverkürzung ja, aber Erwerbsarbeit bleibt zentral (neue Vollbeschäftigung)' },
  { id: 5, titel: 'EINKOMMEN', kurz: 'Wovon sollen Menschen leben?', links: 'Von Leistung', rechts: 'Bedingungslos', icon: '💰',
    gegenargument: 'Wer erbt, leistet nichts. Das Leistungsprinzip ist eine Lüge.',
    programmScore: 3, programmText: 'Sanktionsfreie Mindestsicherung – aber KEIN bedingungsloses Grundeinkommen' },
  { id: 6, titel: 'STAAT', kurz: 'Wie viel Staat brauchen wir?', links: 'So wenig wie möglich', rechts: 'Aktiv gestaltend', icon: '🏛️',
    gegenargument: 'Der "schlanke Staat" heißt: Die Armen bleiben allein.',
    programmScore: 4, programmText: 'Aktiver Sozialstaat, demokratisch kontrolliert' },
  { id: 7, titel: 'DEMOKRATIE', kurz: 'Wo darfst du mitbestimmen?', links: 'Bei Wahlen reicht', rechts: 'Überall, auch im Job', icon: '🗳️',
    gegenargument: 'Demokratie endet nicht am Werkstor.',
    programmScore: 5, programmText: 'Wirtschaftsdemokratie, Mitbestimmung, Volksabstimmungen, politische Streiks' },
  { id: 8, titel: 'KLASSE', kurz: 'Gibt es oben und unten?', links: 'Nein, jeder kann aufsteigen', rechts: 'Ja, das System teilt', icon: '📶',
    gegenargument: 'Wer arm geboren wird, stirbt arm.',
    programmScore: 5, programmText: 'Explizit: "Deutschland – eine Klassengesellschaft"' },
  { id: 9, titel: 'GESCHLECHT', kurz: 'Woher kommen Geschlechterrollen?', links: 'Biologie', rechts: 'Gesellschaft', icon: '⚧️',
    gegenargument: 'Frauen verdienen weniger, machen mehr unbezahlte Arbeit. Das ist System.',
    programmScore: 5, programmText: '"Geschlechterverhältnisse sind Produktionsverhältnisse", patriarchale Unterdrückung' },
  { id: 10, titel: 'MIGRATION', kurz: 'Wie offen sollen Grenzen sein?', links: 'Geschlossen', rechts: 'Offen', icon: '🌍',
    gegenargument: 'Die Festung Europa tötet.',
    programmScore: 4, programmText: '"Offene Grenzen für Menschen in Not" – aber nicht generell offene Grenzen' },
  { id: 11, titel: 'FRIEDEN', kurz: 'Wie entsteht Sicherheit?', links: 'Durch Stärke', rechts: 'Durch Abrüstung', icon: '☮️',
    gegenargument: 'Jeder Krieg wurde als "Verteidigung" verkauft.',
    programmScore: 5, programmText: 'Nie Kriegsbeteiligung, Bundeswehr raus aus Auslandseinsätzen, Abrüstung, Rüstungskonversion' },
  { id: 12, titel: 'EUROPA', kurz: 'Wie stehst du zur EU?', links: 'Weniger EU', rechts: 'Demokratischere EU', icon: '🇪🇺',
    gegenargument: 'Die Alternative zum EU-Elitenprojekt ist Demokratie jenseits der Grenzen.',
    programmScore: 4, programmText: 'Neustart als demokratische, soziale, ökologische Friedensunion – Reform, nicht Exit' },
  { id: 13, titel: 'KLIMA', kurz: 'Wie lösen wir die Klimakrise?', links: 'Der Markt regelt', rechts: 'Systemwandel nötig', icon: '🔥',
    gegenargument: 'Klimakrise ist kein Marktversagen – es ist das System.',
    programmScore: 4, programmText: 'Sozial-ökologischer Umbau, Energiewende – aber keine explizite Kapitalismuskritik in der Klimafrage' },
  { id: 14, titel: 'WANDEL', kurz: 'Wie schnell muss sich etwas ändern?', links: 'Langsam, behutsam', rechts: 'Grundlegend, jetzt', icon: '⚡',
    gegenargument: 'Alles Erkämpfte wird seit 40 Jahren abgebaut.',
    programmScore: 4, programmText: '"Längerer emanzipatorischer Prozess" – grundlegend, aber schrittweise' },
  { id: 15, titel: 'PARTEI', kurz: 'Braucht es eine linke Partei?', links: 'Eher nicht', rechts: 'Unbedingt', icon: '✊',
    gegenargument: 'Die Linke ist die einzige Partei, die die Eigentumsfrage stellt.',
    programmScore: 4, programmText: 'Partei wichtig, aber "breite linke Bündnisse" betont' },
  { id: 16, titel: 'FREIHEIT', kurz: 'Was bedeutet Freiheit?', links: 'In Ruhe gelassen werden', rechts: 'Gemeinsam frei sein', icon: '🕊️',
    gegenargument: 'Echte Freiheit braucht materielle Grundlagen.',
    programmScore: 5, programmText: '"Individuelle Freiheit durch sozial gleiche Teilhabe" – Freiheit durch Solidarität' },
  { id: 17, titel: 'SOLIDARITÄT', kurz: 'Wem gegenüber solidarisch?', links: 'Den Nächsten', rechts: 'Allen Menschen', icon: '🤝',
    gegenargument: 'Solidarität ist unteilbar, oder sie ist keine.',
    programmScore: 5, programmText: 'Internationale Solidarität durchgehend' },
  // NEUE PARAMETER
  { id: 18, titel: 'WOHNEN', kurz: 'Wie lösen wir die Wohnungskrise?', links: 'Markt regulieren', rechts: 'Vergesellschaften', icon: '🏠',
    gegenargument: 'Wohnen ist Menschenrecht, keine Ware.',
    programmScore: 3, programmText: 'Bezahlbares Wohnen, sozialer Wohnungsbau – aber keine Enteignung großer Wohnkonzerne' },
  { id: 19, titel: 'NATO', kurz: 'Wie stehst du zur NATO?', links: 'Reformieren', rechts: 'Auflösen/Austreten', icon: '🛡️',
    gegenargument: 'Die NATO ist ein Angriffsbündnis unter US-Führung.',
    programmScore: 3, programmText: 'Kollektive Sicherheit statt NATO – aber kein expliziter Austritt gefordert' },
  { id: 20, titel: 'POLIZEI', kurz: 'Was tun mit der Polizei?', links: 'Stärken', rechts: 'Grundlegend reformieren', icon: '👮',
    gegenargument: 'Polizeigewalt ist strukturell, nicht individuell.',
    programmScore: 3, programmText: 'Bürgerrechte stärken, Kennzeichnungspflicht – aber keine grundlegende Infragestellung' },
];

const PARAMETER_L2_BASE = [
  { id: 'A1', feld: 'STRATEGIE', titel: 'WEG', kurz: 'Reform oder Revolution?', links: 'Schrittweise Reform', rechts: 'Radikaler Bruch', icon: '🛤️',
    programmScore: 3, programmText: '"Längerer emanzipatorischer Prozess" – transformativer Reformismus, kein Bruch' },
  { id: 'A2', feld: 'STRATEGIE', titel: 'SUBJEKT', kurz: 'Wer macht die Veränderung?', links: 'Die Arbeiterklasse', rechts: 'Alle Unterdrückten', icon: '👥',
    programmScore: 4, programmText: 'Arbeiterbewegung + Frauenbewegung + emanzipatorische Bewegungen' },
  { id: 'A3', feld: 'STRATEGIE', titel: 'STAAT', kurz: 'Was tun mit dem Staat?', links: 'Übernehmen & nutzen', rechts: 'Langfristig überwinden', icon: '🏛️',
    programmScore: 2, programmText: 'Sozialstaat ausbauen – kein Wort von Staatsüberwindung' },
  { id: 'A4', feld: 'STRATEGIE', titel: 'ORGANISATION', kurz: 'Wie organisieren wir uns?', links: 'Zentralistisch', rechts: 'Basisdemokratisch', icon: '🔺',
    programmScore: 3, programmText: 'Parlamentsorientiert, klassische Parteistruktur' },
  { id: 'B1', feld: 'ÖKONOMIE', titel: 'KOORDINATION', kurz: 'Wie organisieren wir Wirtschaft?', links: 'Sozialer Markt', rechts: 'Demokratischer Plan', icon: '🔄',
    programmScore: 2, programmText: 'Markt mit demokratischer Rahmensetzung – keine Planwirtschaft' },
  { id: 'B2', feld: 'ÖKONOMIE', titel: 'BESITZ', kurz: 'Wem gehören die Betriebe?', links: 'Dem Staat', rechts: 'Den Arbeitenden selbst', icon: '🏭',
    programmScore: 3, programmText: 'Staatsbesitz, kommunal, genossenschaftlich ODER Belegschaft – Staat steht vorn' },
  { id: 'B3', feld: 'ÖKONOMIE', titel: 'ARBEIT', kurz: 'Was ist das Ziel bei Arbeit?', links: 'Befreite, sinnvolle Arbeit', rechts: 'Weniger Arbeit für alle', icon: '⏰',
    programmScore: 3, programmText: 'Arbeitszeitverkürzung, aber "neue Vollbeschäftigung" bleibt Ziel' },
  { id: 'C1', feld: 'GESELLSCHAFT', titel: 'FEMINISMUS', kurz: 'Klasse oder Geschlecht zuerst?', links: 'Klasse zuerst', rechts: 'Untrennbar verbunden', icon: '⚧️',
    programmScore: 4, programmText: 'Patriarchat und Kapitalismus verknüpft, aber nicht vollständig intersektional' },
  { id: 'C2', feld: 'GESELLSCHAFT', titel: 'NATUR', kurz: 'Wie stehen wir zur Natur?', links: 'Ressource für Menschen', rechts: 'Hat Eigenrecht', icon: '🌱',
    programmScore: 3, programmText: '"Bewahrung der Natur" als Lebensgrundlage – anthropozentrisch, kein Eigenrecht' },
  { id: 'C3', feld: 'GESELLSCHAFT', titel: 'GLOBAL', kurz: 'National oder international?', links: 'Erst hier, dann dort', rechts: 'Global von Anfang an', icon: '🌐',
    programmScore: 5, programmText: 'Internationale Solidarität und Kooperation durchgehend' },
  { id: 'D1', feld: 'KULTUR', titel: 'UTOPIE', kurz: 'Brauchen wir ein Zukunftsbild?', links: 'Entsteht im Kampf', rechts: 'Konkret ausmalen', icon: '🔮',
    programmScore: 2, programmText: '"Demokratischer Sozialismus" als Ziel, aber wenig konkrete Utopie' },
  { id: 'D2', feld: 'KULTUR', titel: 'KONFLIKT', kurz: 'Wie gehen wir mit Konflikten um?', links: 'Institutionen schaffen', rechts: 'Ständige Transformation', icon: '⚔️',
    programmScore: 2, programmText: 'Institutionen stärken, Rechtsstaat ausbauen' },
  { id: 'D3', feld: 'KULTUR', titel: 'SINN', kurz: 'Braucht Sozialismus Spiritualität?', links: 'Rein säkular', rechts: 'Offen für Transzendenz', icon: '✨',
    programmScore: 3, programmText: 'Grundsätzlich säkular, aber religiöse Einflüsse bei Mitgliedern anerkannt' },
  { id: 'E1', feld: 'PRAXIS', titel: 'BÜNDNIS', kurz: 'Mit wem zusammenarbeiten?', links: 'Arbeiterklasse vereinen', rechts: 'Bewegungen vernetzen', icon: '🤝',
    programmScore: 4, programmText: 'Breite linke Bündnisse, Bewegungsorientierung' },
  { id: 'E2', feld: 'PRAXIS', titel: 'EBENE', kurz: 'Wo ansetzen?', links: 'Bundespolitik', rechts: 'Lokal + Global', icon: '📍',
    programmScore: 3, programmText: 'Parlamentarisch orientiert, aber kommunale und europäische Ebene auch wichtig' },
  { id: 'E3', feld: 'PRAXIS', titel: 'BILDUNG', kurz: 'Wie lernen wir Sozialismus?', links: 'Aufklärung & Theorie', rechts: 'Gemeinsame Erfahrung', icon: '📚',
    programmScore: 3, programmText: 'Politische Bildung wichtig, aber keine konkrete Pädagogik' },
  // NEUE PARAMETER
  { id: 'E4', feld: 'PRAXIS', titel: 'GEWALT', kurz: 'Wie weit gehen wir?', links: 'Strikt gewaltfrei', rechts: 'Notfalls militant', icon: '🔥',
    programmScore: 2, programmText: 'Keine Positionierung zu militanten Aktionen, implizit gewaltfrei-institutionell' },
];

// ═══════════════════════════════════════════════════════════════════════════
// GROQ API
// ═══════════════════════════════════════════════════════════════════════════

const analyzeWithGroq = async (antworten, params, apiKey, analyseTyp) => {
  if (!apiKey) return null;
  
  console.log('analyzeWithGroq called with:', analyseTyp, 'params:', params?.length); // Debug
  
  const profilText = params.map(p => {
    const wert = antworten[p.id];
    const stufe = p.stufen?.find(s => s.wert === wert);
    return `${p.titel} (${p.kurz}): ${wert}/5 - "${stufe?.label || ''}"`;
  }).join('\n');
  
  console.log('profilText:', profilText.substring(0, 200)); // Debug

  let prompt = '';
  
  if (analyseTyp === 'layer1') {
    // Zähle links/mitte/rechts für Kontext
    const linksCount = Object.values(antworten).filter(v => v >= 4).length;
    const mitteCount = Object.values(antworten).filter(v => v === 3).length;
    const rechtsCount = Object.values(antworten).filter(v => v <= 2).length;
    
    prompt = `Analysiere dieses politische Profil. DU-FORM.

PROFIL:
${profilText}

STATS: ${linksCount} von 20 Parametern links (4-5), ${mitteCount} mitte (3), ${rechtsCount} eher rechts (1-2)

JSON-Antwort:
{
  "titel": "Max 5 Wörter, kreativ",
  "links_score": "sehr links" oder "links" oder "mitte-links" oder "mitte" oder "eher rechts"
}

NUR JSON.`;
  } else if (analyseTyp === 'layer2') {
    prompt = `Analysiere diesen Sozialismus-Typ basierend auf dem Profil. Schreibe in DU-FORM.

PROFIL:
${profilText}

Antworte NUR mit diesem JSON (keine anderen Texte):
{
  "archetyp": "Kreativer Name für diesen Sozialismus-Typ (z.B. Libertärer Ökosozialismus, Rätedemokratischer Kommunismus, Feministischer Mutualismus)",
  "beschreibung": "2-3 Sätze in Du-Form die beschreiben was diesen Typ ausmacht",
  "theoretiker": ["Name 1 (Schlagwort)", "Name 2 (Schlagwort)"],
  "staerken": ["Stärke 1", "Stärke 2"],
  "spannungen": ["Interne Spannung 1", "Spannung 2"],
  "slogan": "Kurzer Slogan (max 6 Wörter)"
}`;
  } else if (analyseTyp === 'layer3') {
    // Berechne Durchschnitt um Radikalität einzuschätzen
    const werte = Object.values(antworten);
    const durchschnitt = werte.reduce((a, b) => a + b, 0) / werte.length;
    const istRadikal = durchschnitt > 3.5;
    const istModerat = durchschnitt < 2.5;
    
    const programmPositionen = `
PROGRAMM-POSITIONEN (entsprechen etwa Stufe 3-4):
- EIGENTUM: Öffentliches Eigentum, Vergesellschaftung strategischer Sektoren – primär staatlich gedacht, wenig Commons
- ARBEIT: Gute Arbeit, Mindestlohn, Tarifbindung, 30h-Woche als Fernziel – aber kein Post-Work
- STAAT: Sozialstaat ausbauen, mehr Demokratie – aber keine Überwindungsperspektive
- ÖKOLOGIE: Sozial-ökologischer Umbau – aber kein konsequentes Degrowth
- PLANUNG: Regulierung, öffentliche Daseinsvorsorge – aber keine demokratische Planwirtschaft
- FEMINISMUS: Gleichstellung, Care-Arbeit anerkennen
- GLOBAL: Internationale Solidarität – aber nationalstaatlich orientiert, EU reformieren
- MIGRATION: Humanitäre Flüchtlingspolitik – "offene Grenzen" fehlt`;

    if (istRadikal) {
      prompt = `Vergleiche Nutzer-Positionen mit dem Erfurter Programm der Linken (2011).
${programmPositionen}

NUTZER-PROFIL (Durchschnitt ${durchschnitt.toFixed(1)}/5 – radikaler als Programm):
${profilText}

Der Nutzer ist RADIKALER als das Programm. Zeige 2-4 konkrete Spannungsfelder wo der Nutzer über das Programm hinausgeht.

Antworte als JSON:
{
  "ueberschrift": "Du gehst über das Programm hinaus",
  "einleitung": "2-3 Sätze in Du-Form: Beschreibe konkret wo und warum der Nutzer radikaler ist",
  "verhältnis": "radikaler",
  "spannungsfelder": [
    {
      "thema": "z.B. EIGENTUM",
      "deine_position": "Konkret was der Nutzer will basierend auf seinen hohen Werten (4-5)",
      "programm_position": "Konkret was das Erfurter Programm dazu sagt",
      "luecke": "Wo das Programm hinterherhinkt"
    }
  ],
  "einladung": "Motivierender Aufruf (2 Sätze): Programm verändern, Antrag schreiben!"
}

Beziehe dich auf die KONKRETEN hohen Werte (4-5) im Profil! NUR valides JSON.`;
    } else if (istModerat) {
      prompt = `Vergleiche Nutzer-Positionen mit dem Erfurter Programm der Linken (2011).
${programmPositionen}

NUTZER-PROFIL (Durchschnitt ${durchschnitt.toFixed(1)}/5 – moderater als Programm):
${profilText}

Der Nutzer ist MODERATER als das Programm.

Antworte als JSON:
{
  "ueberschrift": "Das Programm ist radikaler als du",
  "einleitung": "2-3 Sätze in Du-Form: Beschreibe konkret wo das Programm weiter geht als die Positionen des Nutzers. Sei ermutigend, nicht belehrend.",
  "verhältnis": "moderater",
  "spannungsfelder": []
}

NUR valides JSON.`;
    } else {
      prompt = `Vergleiche Nutzer-Positionen mit dem Erfurter Programm der Linken (2011).
${programmPositionen}

NUTZER-PROFIL (Durchschnitt ${durchschnitt.toFixed(1)}/5 – entspricht etwa dem Programm):
${profilText}

Der Nutzer stimmt weitgehend mit dem Programm überein.

Antworte als JSON:
{
  "ueberschrift": "Du passt zum Programm",
  "einleitung": "2-3 Sätze in Du-Form: Beschreibe wo der Nutzer mit dem Erfurter Programm übereinstimmt. Sei wertschätzend.",
  "verhältnis": "uebereinstimmend",
  "spannungsfelder": []
}

NUR valides JSON.`;
    }
  }

  console.log('Prompt length:', prompt.length, 'Type:', analyseTyp); // Debug
  
  if (!prompt) {
    console.error('Prompt ist leer für analyseTyp:', analyseTyp);
    return null;
  }

  // Retry-Logik für Rate Limiting (429 Errors)
  const maxRetries = 3;
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      // Rate Limit Error - warten und retry
      if (response.status === 429) {
        const waitTime = attempt * 2000; // 2s, 4s, 6s
        console.log(`Rate limit erreicht. Warte ${waitTime/1000}s... (Versuch ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      const data = await response.json();
      console.log('Groq Response:', data); // Debug
      
      if (data.error) {
        console.error('Groq API Error:', data.error);
        lastError = data.error;
        if (data.error.code === 'rate_limit_exceeded') {
          const waitTime = attempt * 2000;
          console.log(`Rate limit (error). Warte ${waitTime/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        return null;
      }
      
      const text = data.choices?.[0]?.message?.content || '';
      console.log('Raw text:', text.substring(0, 300)); // Debug
      
      // Versuche JSON zu extrahieren (auch aus Markdown Code-Blocks)
      let jsonStr = text;
      
      // Entferne Markdown Code-Block falls vorhanden
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      }
      
      // Finde JSON-Objekt
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('Parsed JSON:', parsed); // Debug
          return parsed;
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError.message);
          console.error('Attempted to parse:', jsonMatch[0].substring(0, 300));
          return null;
        }
      }
      
      console.error('No JSON found in response');
      return null;
      
    } catch (error) {
      console.error('Groq Fetch Fehler:', error);
      lastError = error;
    }
  }
  
  console.error('Alle Versuche fehlgeschlagen:', lastError);
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════════════════

const mergeWithDetails = (baseParams, details, isL2 = false) => {
  return baseParams.map(p => {
    const key = isL2 ? p.id : String(p.id);
    const detail = details ? details[key] : null;
    if (!detail) {
      return {
        ...p,
        frage: p.kurz,
        stufen: [1, 2, 3, 4, 5].map(w => ({ wert: w, label: `Stufe ${w}`, beschreibung: '' }))
      };
    }
    return { 
      ...p, 
      frage: detail.frage || p.kurz, 
      stufen: detail.stufen || [],
      linkePosition: detail.linkePosition || null,
      rechteGegenrede: detail.rechteGegenrede || null,
      programmLink: detail.programmLink || null
    };
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// KOMPONENTEN
// ═══════════════════════════════════════════════════════════════════════════

// Kompakte Kachel (zeigt mehr Info)
const Kachel = ({ parameter, value, onChange, onExpand, darkMode = false }) => {
  const bg = darkMode ? '#2A2A2A' : '#FFF';
  const border = darkMode ? '#444' : '#E0E0E0';
  const text = darkMode ? COLORS.weiss : COLORS.schwarz;
  const muted = darkMode ? '#AAA' : COLORS.grau;
  const sliderBg = darkMode ? '#444' : '#DDD';
  
  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '10px',
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      transition: 'box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onClick={onExpand}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Header: Icon + Titel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.3rem' }}>{parameter.icon}</span>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.rot, letterSpacing: '0.05em' }}>
          {parameter.titel}
        </span>
      </div>
      
      {/* Frage/Kurzbeschreibung */}
      <div style={{ fontSize: '0.8rem', color: text, lineHeight: 1.3, minHeight: '2.4em' }}>
        {parameter.kurz}
      </div>
      
      {/* Links/Rechts Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: muted }}>
        <span style={{ textAlign: 'left', maxWidth: '45%' }}>{parameter.links}</span>
        <span style={{ textAlign: 'right', maxWidth: '45%' }}>{parameter.rechts}</span>
      </div>
      
      {/* Slider */}
      <div onClick={(e) => e.stopPropagation()}>
        <input
          type="range"
          min={1}
          max={5}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: `linear-gradient(to right, ${COLORS.rot} ${(value - 1) * 25}%, ${sliderBg} ${(value - 1) * 25}%)`,
            appearance: 'none',
            cursor: 'pointer'
          }}
        />
        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ 
              width: '8px', height: '8px', borderRadius: '50%',
              background: value >= n ? COLORS.rot : sliderBg
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Modal-Overlay für expandierte Ansicht
const DetailModal = ({ parameter, value, onChange, onClose, darkMode = false }) => {
  const currentStufe = parameter.stufen?.find(s => s.wert === value) || { label: '', beschreibung: '' };
  
  const bg = darkMode ? '#2A2A2A' : '#FFF';
  const text = darkMode ? COLORS.weiss : COLORS.schwarz;
  const muted = darkMode ? '#AAA' : COLORS.grau;
  const sliderBg = darkMode ? '#444' : '#DDD';
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: bg,
          borderRadius: '12px',
          padding: '1.5rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{parameter.icon}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.rot, letterSpacing: '0.1em' }}>
              {parameter.titel}
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: muted, padding: 0 }}
          >
            ×
          </button>
        </div>
        
        {/* Frage */}
        <div style={{ fontSize: '1.1rem', color: text, marginBottom: '1.25rem', lineHeight: 1.4 }}>
          {parameter.frage || parameter.kurz}
        </div>
        
        {/* Slider */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: muted, marginBottom: '0.5rem' }}>
            <span>{parameter.links}</span>
            <span>{parameter.rechts}</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '10px',
              borderRadius: '5px',
              background: `linear-gradient(to right, ${COLORS.rot} ${(value - 1) * 25}%, ${sliderBg} ${(value - 1) * 25}%)`,
              appearance: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{ 
                width: '14px', height: '14px', borderRadius: '50%',
                background: value >= n ? COLORS.rot : sliderBg,
                border: value === n ? '2px solid white' : 'none',
                boxShadow: value === n ? '0 0 6px rgba(0,0,0,0.3)' : 'none'
              }} />
            ))}
          </div>
        </div>
        
        {/* Aktuelle Stufe */}
        <div style={{
          padding: '1rem',
          background: darkMode ? '#333' : 'rgba(198,40,40,0.05)',
          borderLeft: `4px solid ${COLORS.rot}`,
          borderRadius: '0 8px 8px 0',
          marginBottom: '1rem'
        }}>
          <div style={{ fontWeight: 600, color: text, marginBottom: '0.5rem', fontSize: '1rem' }}>
            {currentStufe.label}
          </div>
          <div style={{ fontSize: '0.9rem', color: muted, lineHeight: 1.6 }}>
            {currentStufe.beschreibung}
          </div>
        </div>
        
        {/* Vertiefung */}
        {currentStufe.vertiefung && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.rot, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              THEORIE
            </div>
            <div style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.6 }}>
              {currentStufe.vertiefung}
            </div>
          </div>
        )}
        
        {/* Beispiel */}
        {currentStufe.beispiel && (
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.rot, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              KONKRET GEDACHT
            </div>
            <div style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.6, fontStyle: 'italic' }}>
              {currentStufe.beispiel}
            </div>
          </div>
        )}
        
        {/* Schließen Button */}
        <button 
          onClick={onClose}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.75rem',
            background: COLORS.rot,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Fertig
        </button>
      </div>
    </div>
  );
};

// Gemeinsam-Modal: Zeigt detaillierte Programm-Position bei Übereinstimmung
const GemeinsamModal = ({ parameter, nutzerWert, onClose }) => {
  const nutzerStufe = parameter.stufen?.find(s => s.wert === nutzerWert) || {};
  const linkePosition = parameter.linkePosition || {};
  const muted = '#888';
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFF',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header mit X */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{parameter.icon}</span>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: COLORS.gruen }}>
                GEMEINSAM
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{parameter.titel}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: muted, padding: 0 }}
          >
            ×
          </button>
        </div>
        
        {/* Frage */}
        <div style={{ fontSize: '1rem', color: COLORS.schwarz, marginBottom: '1.25rem', lineHeight: 1.4 }}>
          {parameter.frage || parameter.kurz}
        </div>
        
        {/* Deine Position */}
        <div style={{
          padding: '1rem',
          background: 'rgba(46,125,50,0.08)',
          borderLeft: `4px solid ${COLORS.gruen}`,
          borderRadius: '0 8px 8px 0',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.gruen, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            DEINE POSITION
          </div>
          <div style={{ fontWeight: 600, color: COLORS.schwarz, marginBottom: '0.5rem' }}>
            {nutzerStufe.label}
          </div>
          <div style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.6 }}>
            {nutzerStufe.beschreibung}
          </div>
        </div>
        
        {/* Position der Linken */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.rot, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            IM ERFURTER PROGRAMM
          </div>
          <div style={{ fontWeight: 600, color: COLORS.schwarz, marginBottom: '0.5rem' }}>
            {linkePosition.position || 'Position wird ergänzt'}
          </div>
          <div style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.6 }}>
            {linkePosition.begruendung || 'Begründung wird ergänzt.'}
          </div>
        </div>
        
        {/* Verstärkung */}
        {linkePosition.gegenargument && (
          <div style={{
            padding: '1rem',
            background: 'rgba(198,40,40,0.05)',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.rot, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              💪 DAS ARGUMENT
            </div>
            <div style={{ fontSize: '0.9rem', color: COLORS.schwarz, lineHeight: 1.6, fontStyle: 'italic' }}>
              {linkePosition.gegenargument}
            </div>
          </div>
        )}
        
        {/* Programm-Link */}
        {parameter.programmLink && (
          <a 
            href={parameter.programmLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              color: COLORS.gruen,
              fontSize: '0.8rem',
              marginBottom: '1rem',
              textDecoration: 'none'
            }}
          >
            → Im Erfurter Programm nachlesen
          </a>
        )}
        
        {/* Schließen Button */}
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: COLORS.gruen,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Verstanden
        </button>
      </div>
    </div>
  );
};

// Gegenrede-Modal: Für rote Badges - Eindringliche Argumente gegen rechte Positionen
const GegenredeModal = ({ parameter, nutzerWert, onClose }) => {
  const nutzerStufe = parameter.stufen?.find(s => s.wert === nutzerWert) || {};
  const gegenrede = parameter.rechteGegenrede || {};
  const linkePosition = parameter.linkePosition || {};
  const muted = '#888';
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFF',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header mit X */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{parameter.icon}</span>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#E53935' }}>
                GEGENREDE
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{parameter.titel}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: muted, padding: 0 }}
          >
            ×
          </button>
        </div>
        
        {/* Deine Position */}
        <div style={{
          padding: '1rem',
          background: 'rgba(229,57,53,0.08)',
          borderLeft: '4px solid #E53935',
          borderRadius: '0 8px 8px 0',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#E53935', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            DEINE POSITION
          </div>
          <div style={{ fontWeight: 600, color: COLORS.schwarz, marginBottom: '0.5rem' }}>
            {nutzerStufe.label}
          </div>
          <div style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.6 }}>
            {nutzerStufe.beschreibung}
          </div>
        </div>
        
        {/* Gegenrede */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.rot, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            ✊ {gegenrede.titel || 'WARUM DIE LINKE DAS ANDERS SIEHT'}
          </div>
          <div style={{ fontSize: '0.9rem', color: COLORS.schwarz, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {gegenrede.text || linkePosition.begruendung || 'Argumentation wird ergänzt.'}
          </div>
        </div>
        
        {/* Programm-Link */}
        {parameter.programmLink && (
          <a 
            href={parameter.programmLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              color: COLORS.rot,
              fontSize: '0.8rem',
              marginBottom: '1rem',
              textDecoration: 'none'
            }}
          >
            → Im Erfurter Programm nachlesen
          </a>
        )}
        
        {/* Schließen Button */}
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#E53935',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Verstanden
        </button>
      </div>
    </div>
  );
};

// Konflikt-Modal: Zeigt Linke-Position und Gegenargumente
const KonfliktModal = ({ parameter, nutzerWert, onClose }) => {
  const nutzerStufe = parameter.stufen?.find(s => s.wert === nutzerWert) || {};
  const linkePosition = parameter.linkePosition || {};
  const muted = '#888';
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFF',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header mit X */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{parameter.icon}</span>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: COLORS.orange }}>
                GESPRÄCHSSTOFF
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{parameter.titel}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: muted, padding: 0 }}
          >
            ×
          </button>
        </div>
        
        {/* Frage */}
        <div style={{ fontSize: '1rem', color: COLORS.schwarz, marginBottom: '1.25rem', lineHeight: 1.4 }}>
          {parameter.frage || parameter.kurz}
        </div>
        
        {/* Deine Position */}
        <div style={{
          padding: '1rem',
          background: 'rgba(239,108,0,0.08)',
          borderLeft: `4px solid ${COLORS.orange}`,
          borderRadius: '0 8px 8px 0',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.orange, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            DEINE POSITION
          </div>
          <div style={{ fontWeight: 600, color: COLORS.schwarz, marginBottom: '0.5rem' }}>
            {nutzerStufe.label}
          </div>
          <div style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.6 }}>
            {nutzerStufe.beschreibung}
          </div>
        </div>
        
        {/* Position der Linken */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.rot, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            POSITION DER LINKEN
          </div>
          <div style={{ fontWeight: 600, color: COLORS.schwarz, marginBottom: '0.5rem' }}>
            {linkePosition.position || 'Position wird ergänzt'}
          </div>
          <div style={{ fontSize: '0.85rem', color: muted, lineHeight: 1.6 }}>
            {linkePosition.begruendung || 'Begründung wird ergänzt.'}
          </div>
        </div>
        
        {/* Zum Nachdenken */}
        {linkePosition.gegenargument && (
          <div style={{
            padding: '1rem',
            background: 'rgba(198,40,40,0.05)',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: COLORS.rot, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              💭 ZUM NACHDENKEN
            </div>
            <div style={{ fontSize: '0.9rem', color: COLORS.schwarz, lineHeight: 1.6, fontStyle: 'italic' }}>
              {linkePosition.gegenargument}
            </div>
          </div>
        )}
        
        {/* Programm-Link */}
        {parameter.programmLink && (
          <a 
            href={parameter.programmLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              color: COLORS.rot,
              fontSize: '0.8rem',
              marginBottom: '1rem',
              textDecoration: 'none'
            }}
          >
            → Im Erfurter Programm nachlesen
          </a>
        )}
        
        {/* Schließen Button */}
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: COLORS.rot,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Verstanden
        </button>
      </div>
    </div>
  );
};

// Analyse-Anzeige
const AnalyseBox = ({ analyse, typ, antworten, params }) => {
  const [selectedKonflikt, setSelectedKonflikt] = React.useState(null);
  const [selectedGemeinsam, setSelectedGemeinsam] = React.useState(null);
  const [selectedGegenrede, setSelectedGegenrede] = React.useState(null);
  
  if (!analyse) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <p style={{ color: COLORS.grau, margin: '0 0 1rem' }}>
          Die KI-API ist gerade überlastet.<br/>
          <strong>Bitte warte kurz und lade die Seite neu.</strong>
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          🔄 Seite neu laden
        </button>
      </div>
    );
  }
  
  if (typ === 'layer1') {
    // Parameter-Bewertung im Frontend berechnen
    const paramBewertung = params ? params.map(p => {
      const wert = antworten?.[p.id] || 3;
      let status = 'gelb';
      if (wert >= 4) status = 'gruen';
      else if (wert <= 2) status = 'rot';
      return { id: p.id, name: p.titel, wert, status, kurz: p.kurz, icon: p.icon };
    }) : [];
    
    const gruen = paramBewertung.filter(p => p.status === 'gruen');
    const gelb = paramBewertung.filter(p => p.status === 'gelb');
    const rot = paramBewertung.filter(p => p.status === 'rot');
    
    // Finde vollständigen Parameter für Modals
    const konfliktParam = selectedKonflikt ? params.find(p => p.id === selectedKonflikt.id) : null;
    const konfliktWert = selectedKonflikt ? antworten[selectedKonflikt.id] : null;
    const gemeinsamParam = selectedGemeinsam ? params.find(p => p.id === selectedGemeinsam.id) : null;
    const gemeinsamWert = selectedGemeinsam ? antworten[selectedGemeinsam.id] : null;
    const gegenredeParam = selectedGegenrede ? params.find(p => p.id === selectedGegenrede.id) : null;
    const gegenredeWert = selectedGegenrede ? antworten[selectedGegenrede.id] : null;
    
    return (
      <div className="fade-in">
        {/* Konflikt-Modal (gelb) */}
        {konfliktParam && (
          <KonfliktModal 
            parameter={konfliktParam}
            nutzerWert={konfliktWert}
            onClose={() => setSelectedKonflikt(null)}
          />
        )}
        
        {/* Gemeinsam-Modal (grün) */}
        {gemeinsamParam && (
          <GemeinsamModal 
            parameter={gemeinsamParam}
            nutzerWert={gemeinsamWert}
            onClose={() => setSelectedGemeinsam(null)}
          />
        )}
        
        {/* Gegenrede-Modal (rot) */}
        {gegenredeParam && (
          <GegenredeModal 
            parameter={gegenredeParam}
            nutzerWert={gegenredeWert}
            onClose={() => setSelectedGegenrede(null)}
          />
        )}
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {analyse.links_score?.includes('sehr') ? '✊' : analyse.links_score?.includes('links') ? '👍' : '💭'}
          </div>
          <h2 style={{ margin: '0 0 0.5rem', color: COLORS.rot }}>{analyse.titel || 'Dein Profil'}</h2>
          <div style={{ 
            display: 'inline-block', padding: '0.25rem 0.75rem',
            background: analyse.links_score?.includes('links') ? 'rgba(198,40,40,0.1)' : 'rgba(239,108,0,0.1)',
            color: analyse.links_score?.includes('links') ? COLORS.rot : COLORS.orange,
            borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600
          }}>
            {analyse.links_score || 'Politisches Profil'}
          </div>
        </div>
        
        {/* Gemeinsam und Gesprächsstoff als farbige Badges */}
        <div style={{ marginBottom: '1.5rem' }}>
          
          {/* GEMEINSAM - Grüne Badges - KLICKBAR */}
          {gruen.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="label" style={{ color: COLORS.gruen, marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                ✓ GEMEINSAM MIT DER LINKEN <span style={{ fontWeight: 400, opacity: 0.7 }}>(klicken für Details)</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {gruen.map((p, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedGemeinsam(p)}
                    style={{ 
                      padding: '0.35rem 0.6rem',
                      background: COLORS.gruen,
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'transform 0.1s, box-shadow 0.1s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {p.icon} {p.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* GESPRÄCHSSTOFF - Orange Badges (Mitte) - KLICKBAR */}
          {gelb.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="label" style={{ color: COLORS.orange, marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                ⚡ GESPRÄCHSSTOFF <span style={{ fontWeight: 400, opacity: 0.7 }}>(klicken für Details)</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {gelb.map((p, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedKonflikt(p)}
                    style={{ 
                      padding: '0.35rem 0.6rem',
                      background: COLORS.orange,
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'transform 0.1s, box-shadow 0.1s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {p.icon} {p.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* GEGENREDE - Rote Badges (Rechte Positionen) - KLICKBAR */}
          {rot.length > 0 && (
            <div>
              <div className="label" style={{ color: '#E53935', marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                ✊ HIER HALTEN WIR DAGEGEN <span style={{ fontWeight: 400, opacity: 0.7 }}>(klicken für Details)</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {rot.map((p, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedGegenrede(p)}
                    style={{ 
                      padding: '0.35rem 0.6rem',
                      background: '#E53935',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'transform 0.1s, box-shadow 0.1s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {p.icon} {p.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
      </div>
    );
  }
  
  if (typ === 'layer2') {
    return (
      <div className="fade-in">
        {/* Header mit Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{analyse.icon || '🔥'}</div>
          <h2 style={{ margin: '0 0 0.5rem', color: COLORS.weiss }}>{analyse.archetyp || 'Dein Sozialismus'}</h2>
          {analyse.slogan && <div style={{ fontSize: '1.1rem', color: '#AAA', fontStyle: 'italic' }}>„{analyse.slogan}"</div>}
          {analyse.nebenstroemungen?.length > 0 && (
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
              Mit Einflüssen von: {analyse.nebenstroemungen.join(', ')}
            </div>
          )}
        </div>
        
        {/* Beschreibung */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-body">
            <p style={{ margin: 0, lineHeight: 1.6 }}>{analyse.beschreibung}</p>
          </div>
        </div>
        
        {/* Positionen */}
        {analyse.positionen && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body">
              <div className="label" style={{ marginBottom: '0.75rem', color: COLORS.rot }}>DEINE POSITIONEN</div>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', minWidth: '80px' }}>WIRTSCHAFT</span>
                  <span style={{ fontSize: '0.9rem' }}>{analyse.positionen.wirtschaft}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', minWidth: '80px' }}>STAAT</span>
                  <span style={{ fontSize: '0.9rem' }}>{analyse.positionen.staat}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', minWidth: '80px' }}>WANDEL</span>
                  <span style={{ fontSize: '0.9rem' }}>{analyse.positionen.wandel}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', minWidth: '80px' }}>SUBJEKT</span>
                  <span style={{ fontSize: '0.9rem' }}>{analyse.positionen.subjekt}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Theoretiker */}
        {analyse.theoretiker?.length > 0 && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body">
              <div className="label" style={{ marginBottom: '0.5rem' }}>DEINE DENKER*INNEN</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analyse.theoretiker.map((t, i) => {
                  const name = t.split(/[\(,]/)[0].trim();
                  const wikiUrl = `https://de.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g, '_'))}`;
                  return (
                    <a 
                      key={i} 
                      href={wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        background: '#333', 
                        borderRadius: '4px', 
                        fontSize: '0.85rem',
                        color: '#FFF',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#C62828'}
                      onMouseLeave={(e) => e.target.style.background = '#333'}
                    >
                      {t} ↗
                    </a>
                  );
                })}
              </div>
              <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
                Klicke auf einen Namen für den Wikipedia-Artikel
              </p>
            </div>
          </div>
        )}
        
        {/* Stärken und Spannungen */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          {analyse.staerken?.length > 0 && (
            <div className="card" style={{ borderLeft: `4px solid ${COLORS.gruen}` }}>
              <div className="card-body">
                <div className="label" style={{ color: COLORS.gruen, marginBottom: '0.5rem' }}>DEINE STÄRKEN</div>
                {analyse.staerken.map((s, i) => <p key={i} style={{ margin: '0 0 0.25rem', fontSize: '0.9rem' }}>• {s}</p>)}
              </div>
            </div>
          )}
          {analyse.spannungen?.length > 0 && (
            <div className="card" style={{ borderLeft: `4px solid ${COLORS.orange}` }}>
              <div className="card-body">
                <div className="label" style={{ color: COLORS.orange, marginBottom: '0.5rem' }}>SPANNUNGSFELDER</div>
                {analyse.spannungen.map((s, i) => <p key={i} style={{ margin: '0 0 0.25rem', fontSize: '0.9rem' }}>• {s}</p>)}
              </div>
            </div>
          )}
        </div>
        
        {/* Spannungs-Details */}
        {analyse.spannungenDetails?.length > 0 && (
          <div className="card" style={{ background: 'rgba(239,108,0,0.1)', border: 'none' }}>
            <div className="card-body">
              <div className="label" style={{ color: COLORS.orange, marginBottom: '0.75rem' }}>💭 ZUM WEITERDENKEN</div>
              {analyse.spannungenDetails.map((s, i) => (
                <div key={i} style={{ marginBottom: i < analyse.spannungenDetails.length - 1 ? '1rem' : 0 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{s.titel}</div>
                  <div style={{ fontSize: '0.85rem', color: '#AAA', marginBottom: '0.25rem' }}>{s.beschreibung}</div>
                  <div style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>→ {s.frage}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (typ === 'layer3') {
    const spannungen = analyse.spannungsfelder || [];
    const hatSpannungen = spannungen.length > 0;
    
    return (
      <div className="fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {analyse.verhältnis === 'radikaler' ? '🔥' : '✓'}
          </div>
          <h2 style={{ margin: '0 0 0.5rem', color: COLORS.weiss }}>
            {analyse.ueberschrift || 'Dein Profil & das Parteiprogramm'}
          </h2>
        </div>
        
        {/* Einleitung */}
        {analyse.einleitung && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body">
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: '1.05rem' }}>{analyse.einleitung}</p>
            </div>
          </div>
        )}
        
        {/* Spannungsfelder - NUR bei radikaler */}
        {analyse.verhältnis === 'radikaler' && hatSpannungen && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="label" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              ⚡ WO DU ÜBER DAS PROGRAMM HINAUSGEHST
            </div>
            {spannungen.map((s, i) => (
              <div key={i} className="card" style={{ marginBottom: '0.75rem', borderLeft: `4px solid ${COLORS.orange}` }}>
                <div className="card-body">
                  <div style={{ fontWeight: 700, color: COLORS.rot, marginBottom: '0.75rem', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    {s.thema}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: s.luecke ? '0.75rem' : 0 }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#888', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>DEINE POSITION</div>
                      <div style={{ fontSize: '0.9rem', color: COLORS.weiss }}>{s.deine_position || '–'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#888', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>DAS PROGRAMM</div>
                      <div style={{ fontSize: '0.9rem', color: '#AAA' }}>{s.programm_position || '–'}</div>
                    </div>
                  </div>
                  {s.luecke && (
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: COLORS.orange, 
                      fontStyle: 'italic',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid #444'
                    }}>
                      → {s.luecke}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Einladung - NUR bei radikaler */}
        {analyse.verhältnis === 'radikaler' && analyse.einladung && (
          <div className="card" style={{ background: COLORS.rot, color: COLORS.weiss }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>{analyse.einladung}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 1
// ═══════════════════════════════════════════════════════════════════════════

// Offline-Analyse für Layer 1
const getOfflineAnalyseL1 = (antworten, analysen) => {
  if (!analysen) return null;
  
  const werte = Object.values(antworten);
  const durchschnitt = werte.reduce((a, b) => a + b, 0) / werte.length;
  
  // Kategorie basierend auf Durchschnitt
  let kategorie;
  if (durchschnitt >= 4.2) kategorie = 'sehr_links';
  else if (durchschnitt >= 3.5) kategorie = 'links';
  else if (durchschnitt >= 2.8) kategorie = 'mitte_links';
  else if (durchschnitt >= 2.0) kategorie = 'mitte';
  else kategorie = 'eher_rechts';
  
  console.log('Offline L1:', durchschnitt.toFixed(2), '→', kategorie);
  return analysen[kategorie] || null;
};

const Layer1 = ({ params, onComplete, apiKey, analysen, initialAntworten }) => {
  const [antworten, setAntworten] = useState(() => {
    if (initialAntworten) return initialAntworten;
    const init = {};
    params.forEach(p => { init[p.id] = 3; });
    return init;
  });
  const [expanded, setExpanded] = useState(null);
  const [phase, setPhase] = useState(initialAntworten ? 'fragen' : 'intro');
  const [analyse, setAnalyse] = useState(null);
  const [loading, setLoading] = useState(false);

  const startAnalyse = async () => {
    setPhase('analyse');
    setLoading(true);
    
    // Erst Offline-Analyse versuchen
    const offlineResult = getOfflineAnalyseL1(antworten, analysen);
    if (offlineResult) {
      setAnalyse(offlineResult);
      setLoading(false);
      return;
    }
    
    // Fallback: KI-Analyse
    const result = await analyzeWithGroq(antworten, params, apiKey, 'layer1');
    setAnalyse(result);
    setLoading(false);
  };

  const expandedParam = params.find(p => p.id === expanded);

  if (phase === 'intro') {
    return (
      <div className="intro">
        <div className="label" style={{ marginBottom: '1rem' }}>LAYER 1</div>
        <h1>Wie links bist du?</h1>
        <p style={{ marginBottom: '2rem' }}>
          20 Fragen zu deinen politischen Überzeugungen.<br/>
          Klicke auf eine Kachel für mehr Details.
        </p>
        <button onClick={() => setPhase('fragen')} className="btn btn-primary btn-large">
          Start →
        </button>
      </div>
    );
  }

  if (phase === 'fragen') {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.creme, padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="label">LAYER 1: WIE LINKS BIST DU?</div>
            <p style={{ color: COLORS.grau, fontSize: '0.9rem', marginTop: '0.5rem' }}>Klicke auf eine Kachel für Details</p>
          </div>
          
          {/* Mosaik-Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            {params.map(p => (
              <Kachel
                key={p.id}
                parameter={p}
                value={antworten[p.id]}
                onChange={(w) => setAntworten(prev => ({ ...prev, [p.id]: w }))}
                onExpand={() => setExpanded(p.id)}
              />
            ))}
          </div>
          
          <button onClick={startAnalyse} className="btn btn-primary btn-large btn-block">
            Analysieren →
          </button>
        </div>
        
        {/* Modal */}
        {expandedParam && (
          <DetailModal
            parameter={expandedParam}
            value={antworten[expanded]}
            onChange={(w) => setAntworten(prev => ({ ...prev, [expanded]: w }))}
            onClose={() => setExpanded(null)}
          />
        )}
      </div>
    );
  }

  if (phase === 'analyse') {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.creme, padding: '2rem 1rem' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p style={{ color: COLORS.grau }}>KI analysiert dein Profil...</p>
            </div>
          ) : (
            <>
              <AnalyseBox analyse={analyse} typ="layer1" antworten={antworten} params={params} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setPhase('fragen')} className="btn btn-secondary">← Anpassen</button>
                <button onClick={() => onComplete(antworten)} className="btn btn-primary btn-large" style={{ flex: 1 }}>
                  Weiter: Welcher Sozialismus? →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 2
// ═══════════════════════════════════════════════════════════════════════════

// Offline-Analyse für Layer 2 - findet passendsten Archetyp via gewichtete Distanz
const getOfflineAnalyseL2 = (antworten, analysen) => {
  if (!analysen?.archetypen) return null;
  
  let bestMatch = null;
  let bestScore = Infinity; // Niedrigere Distanz = besser
  
  for (const arch of analysen.archetypen) {
    if (!arch.ideal) continue;
    
    let totalDistance = 0;
    let totalWeight = 0;
    
    // Berechne gewichtete Distanz zu Idealvektor
    for (const [paramId, idealValue] of Object.entries(arch.ideal)) {
      const userValue = antworten[paramId];
      if (userValue === undefined) continue;
      
      // Gewicht: aus gewichte-Objekt oder 1 als Default
      const weight = arch.gewichte?.[paramId] || 1;
      
      // Quadratische Distanz (bestraft große Abweichungen stärker)
      const diff = Math.abs(userValue - idealValue);
      totalDistance += weight * (diff * diff);
      totalWeight += weight;
    }
    
    // Normalisierte Distanz
    const normalizedDistance = totalWeight > 0 ? totalDistance / totalWeight : Infinity;
    
    if (normalizedDistance < bestScore) {
      bestScore = normalizedDistance;
      bestMatch = arch;
    }
  }
  
  console.log('Offline L2: Best match:', bestMatch?.archetyp, 'Distance:', bestScore.toFixed(2));
  
  if (bestMatch) {
    return {
      id: bestMatch.id,
      archetyp: bestMatch.archetyp,
      beschreibung: bestMatch.beschreibung,
      theoretiker: bestMatch.theoretiker,
      staerken: bestMatch.staerken,
      spannungen: bestMatch.spannungen,
      slogan: bestMatch.slogan
    };
  }
  
  return null;
};

const Layer2 = ({ params, onComplete, onLiteratur, onBack, apiKey, analysen, initialPhase = 'intro', initialAnalyse = null, initialAntworten = null }) => {
  const [antworten, setAntworten] = useState(() => {
    if (initialAntworten) return initialAntworten;
    const init = {};
    params.forEach(p => { init[p.id] = 3; });
    return init;
  });
  const [expanded, setExpanded] = useState(null);
  const [phase, setPhase] = useState(initialPhase);
  const [analyse, setAnalyse] = useState(initialAnalyse);
  const [loading, setLoading] = useState(false);

  const startAnalyse = async () => {
    setPhase('analyse');
    setLoading(true);
    
    // Nutze die deterministische Sozialismus-Engine (kein LLM nötig)
    const engineResult = SOZIALISMUS_ENGINE.analysiere(antworten);
    
    // Transformiere in das erwartete Format
    const analyseResult = {
      id: engineResult.id,
      archetyp: engineResult.name,
      beschreibung: engineResult.beschreibung,
      slogan: engineResult.slogan,
      icon: engineResult.icon,
      theoretiker: engineResult.theoretiker.map(t => `${t.name} (${t.schlagwort})`),
      staerken: engineResult.staerken,
      spannungen: engineResult.spannungen.map(s => s.titel),
      spannungenDetails: engineResult.spannungen,
      positionen: engineResult.positionen,
      nebenstroemungen: engineResult.nebenstroemungen,
      wesenKnoten: engineResult.wesenKnoten,
      wesenZimmer: engineResult.wesenZimmer
    };
    
    setAnalyse(analyseResult);
    setLoading(false);
  };

  const expandedParam = params.find(p => p.id === expanded);
  const felder = ['STRATEGIE', 'ÖKONOMIE', 'GESELLSCHAFT', 'KULTUR', 'PRAXIS'];

  if (phase === 'intro') {
    return (
      <div className="intro dark" style={{ background: COLORS.schwarz }}>
        <div className="label" style={{ marginBottom: '1rem' }}>LAYER 2</div>
        <h1 style={{ color: COLORS.weiss }}>Welcher Sozialismus?</h1>
        <p style={{ marginBottom: '2rem', color: '#AAA' }}>
          17 theoretische Fragen in 5 Feldern.<br/>
          Definiere deinen Sozialismus.
        </p>
        <button onClick={() => setPhase('fragen')} className="btn btn-primary btn-large">
          Vertiefen →
        </button>
      </div>
    );
  }

  if (phase === 'fragen') {
    return (
      <div className="dark" style={{ minHeight: '100vh', padding: '1.5rem 1rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="label">LAYER 2: DEIN SOZIALISMUS</div>
          </div>
          
          {felder.map((feld, fi) => (
            <div key={feld} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: COLORS.rot, marginBottom: '0.75rem' }}>
                {String.fromCharCode(65 + fi)}. {feld}
              </div>
              <div className="generator-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {params.filter(p => p.feld === feld).map(p => (
                  <Kachel
                    key={p.id}
                    parameter={p}
                    value={antworten[p.id]}
                    onChange={(w) => setAntworten(prev => ({ ...prev, [p.id]: w }))}
                    onExpand={() => setExpanded(p.id)}
                    darkMode={true}
                  />
                ))}
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={onBack} className="btn btn-secondary" style={{ color: '#AAA', borderColor: '#666' }}>← Zurück</button>
            <button onClick={startAnalyse} className="btn btn-primary btn-large" style={{ flex: 1 }}>
              Analysieren →
            </button>
          </div>
        </div>
        
        {/* Modal */}
        {expandedParam && (
          <DetailModal
            parameter={expandedParam}
            value={antworten[expanded]}
            onChange={(w) => setAntworten(prev => ({ ...prev, [expanded]: w }))}
            onClose={() => setExpanded(null)}
            darkMode={true}
          />
        )}
      </div>
    );
  }

  if (phase === 'analyse') {
    return (
      <div className="dark" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p style={{ color: '#AAA' }}>Analysiere deinen Sozialismus...</p>
            </div>
          ) : (
            <>
              <AnalyseBox analyse={analyse} typ="layer2" />
              
              {/* Literatur-Button */}
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                background: '#2E2E2E', 
                borderRadius: '8px',
                border: '1px solid #444'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📚</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: COLORS.weiss, fontWeight: 600 }}>Literatur zu deinem Sozialismus</div>
                    <div style={{ color: '#AAA', fontSize: '0.85rem' }}>Bücher, Videos, Podcasts passend zu "{analyse?.archetyp}"</div>
                  </div>
                  <button 
                    onClick={() => onLiteratur && onLiteratur(antworten, analyse?.id, analyse?.archetyp, analyse)} 
                    className="btn btn-secondary"
                    style={{ color: COLORS.weiss, borderColor: COLORS.rot, background: 'transparent' }}
                  >
                    Entdecken →
                  </button>
                </div>
              </div>
              
              {/* Zwei Optionen */}
              <div style={{ marginTop: '2rem' }}>
                <div className="label" style={{ textAlign: 'center', marginBottom: '1rem', color: '#888' }}>
                  WAS MÖCHTEST DU JETZT TUN?
                </div>
                
                {/* Option 1: Parteiprogramm */}
                <div 
                  onClick={() => onComplete(antworten, analyse?.id, analyse?.archetyp)}
                  style={{ 
                    background: '#2A2A2A', 
                    border: '2px solid #444',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.rot;
                    e.currentTarget.style.background = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#444';
                    e.currentTarget.style.background = '#2A2A2A';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>📋</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: COLORS.weiss, fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        Mit Parteiprogramm abgleichen
                      </div>
                      <div style={{ color: '#AAA', fontSize: '0.85rem' }}>
                        Vergleiche deine Positionen mit dem Erfurter Programm der Linken
                      </div>
                    </div>
                    <span style={{ color: COLORS.rot, fontSize: '1.5rem' }}>→</span>
                  </div>
                </div>
                
                {/* Option 2: Linkes Wesen */}
                <div 
                  onClick={() => {
                    // Baue URL mit vollständigem Profil
                    const wesenUrl = new URL('haus/index.html', window.location.href);
                    
                    // Vollständiges Profil übergeben (A1:3,A2:5,B1:2,...)
                    if (antworten && Object.keys(antworten).length > 0) {
                      const profilString = Object.entries(antworten)
                        .map(([key, value]) => `${key}:${value}`)
                        .join(',');
                      wesenUrl.searchParams.set('profil', profilString);
                    }
                    
                    // Archetyp als Zusatzinfo (für Name/Icon)
                    if (analyse?.id) {
                      wesenUrl.searchParams.set('archetyp', analyse.id);
                    }
                    if (analyse?.wesenKnoten?.length) {
                      wesenUrl.searchParams.set('knoten', analyse.wesenKnoten.join(','));
                    }
                    if (analyse?.wesenZimmer) {
                      wesenUrl.searchParams.set('zimmer', analyse.wesenZimmer);
                    }
                    window.open(wesenUrl.toString(), '_blank');
                  }}
                  style={{ 
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
                    border: '2px solid #C62828',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(198,40,40,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>🔮</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: COLORS.weiss, fontWeight: 700, fontSize: '1.1rem' }}>
                        Zum Linken Wesen
                      </div>
                      {analyse?.wesenZimmer && (
                        <div style={{ color: '#AAA', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          Dein Ort: {analyse.wesenZimmer}
                        </div>
                      )}
                    </div>
                    <span style={{ color: COLORS.rot, fontSize: '1.5rem' }}>↗</span>
                  </div>
                </div>
              </div>
              
              {/* Zurück Button klein unten */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button onClick={() => setPhase('fragen')} className="btn btn-secondary" style={{ color: '#666', borderColor: '#444', fontSize: '0.85rem' }}>
                  ← Antworten anpassen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 3
// ═══════════════════════════════════════════════════════════════════════════

// Neue Analyse-Funktion für Layer 3: Vergleiche Nutzer mit Programm
const analyzeAgainstProgram = (profilL1, profilL2, paramsL1, paramsL2) => {
  const diskrepanzen = [];
  
  // L1 Parameter durchgehen (nur wenn profilL1 existiert)
  if (profilL1 && typeof profilL1 === 'object') {
    paramsL1.forEach(param => {
      const nutzerWert = profilL1[param.id];
      const programmWert = param.programmScore;
      
      // Skip wenn nutzerWert undefined oder programmScore fehlt
      if (nutzerWert === undefined || nutzerWert === null || !programmWert) return;
      
      const differenz = nutzerWert - programmWert;
      
      if (differenz >= 1) { // Nutzer ist radikaler
        diskrepanzen.push({
          id: param.id,
          titel: param.titel,
          icon: param.icon,
          kurz: param.kurz,
          nutzerWert,
          programmWert,
          differenz,
          programmText: param.programmText,
          nutzerPosition: nutzerWert >= 4 ? param.rechts : (nutzerWert <= 2 ? param.links : 'Mitte'),
          layer: 1
        });
      }
    });
  }
  
  // L2 Parameter durchgehen (nur wenn profilL2 existiert)
  if (profilL2 && typeof profilL2 === 'object') {
    paramsL2.forEach(param => {
      const nutzerWert = profilL2[param.id];
      const programmWert = param.programmScore;
      
      // Skip wenn nutzerWert undefined oder programmScore fehlt
      if (nutzerWert === undefined || nutzerWert === null || !programmWert) return;
      
      const differenz = nutzerWert - programmWert;
      
      if (differenz >= 1) { // Nutzer ist radikaler
        diskrepanzen.push({
          id: param.id,
          titel: param.titel,
          icon: param.icon,
          kurz: param.kurz,
          feld: param.feld,
          nutzerWert,
          programmWert,
          differenz,
          programmText: param.programmText,
          nutzerPosition: nutzerWert >= 4 ? param.rechts : (nutzerWert <= 2 ? param.links : 'Mitte'),
          layer: 2
        });
      }
    });
  }
  
  // Nach Differenz sortieren (größte zuerst)
  diskrepanzen.sort((a, b) => b.differenz - a.differenz);
  
  return diskrepanzen;
};

// Diskrepanz-Karte Komponente (vereinfacht, ohne Antragsgenerator)
const DiskrepanzKarte = ({ diskrepanz }) => {
  return (
    <div style={{
      background: '#2A2A2A',
      border: '1px solid #444',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{diskrepanz.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, color: COLORS.weiss }}>{diskrepanz.titel}</div>
            <div style={{ 
              background: COLORS.rot, 
              color: 'white', 
              padding: '2px 8px', 
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              +{diskrepanz.differenz} radikaler
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#AAA', marginTop: '0.25rem' }}>
            {diskrepanz.kurz}
          </div>
          
          {/* Vergleich */}
          <div style={{ 
            marginTop: '0.75rem', 
            padding: '0.75rem', 
            background: '#1A1A1A', 
            borderRadius: '4px',
            fontSize: '0.85rem'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#888' }}>Programm sagt: </span>
              <span style={{ color: '#CCC' }}>{diskrepanz.programmText}</span>
            </div>
            <div>
              <span style={{ color: '#888' }}>Du willst: </span>
              <span style={{ color: COLORS.rot, fontWeight: 500 }}>{diskrepanz.nutzerPosition}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layer3 = ({ profilL1, profilL2, onBack, onLiteratur, apiKey, paramsL1, paramsL2, analysen, archetypName }) => {
  const [diskrepanzen, setDiskrepanzen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Analysiere Diskrepanzen zwischen Nutzer und Programm
    const result = analyzeAgainstProgram(profilL1, profilL2, paramsL1, paramsL2);
    setDiskrepanzen(result);
    setLoading(false);
  }, [profilL1, profilL2, paramsL1, paramsL2]);

  const anzahlDiskrepanzen = diskrepanzen.length;
  const hatDiskrepanzen = anzahlDiskrepanzen > 0;

  // Hinweis wenn keine Profile vorhanden sind
  const keinProfil = (!profilL1 || Object.keys(profilL1).length === 0) && 
                      (!profilL2 || Object.keys(profilL2).length === 0);

  return (
    <div className="dark" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="label">LAYER 3: PROGRAMM-CHECK</div>
          <h1 style={{ color: COLORS.weiss, marginTop: '0.5rem' }}>
            {keinProfil ? 'Kein Profil vorhanden' : 
             hatDiskrepanzen ? 'Wo das Programm nachziehen sollte' : 'Keine großen Diskrepanzen'}
          </h1>
          <p style={{ color: '#AAA', marginTop: '0.5rem' }}>
            Vergleich mit dem Erfurter Programm (2011)
          </p>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: '#AAA' }}>Vergleiche deine Positionen mit dem Programm...</p>
          </div>
        ) : keinProfil ? (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 1rem', lineHeight: 1.6 }}>
                Um den Programm-Check durchzuführen, musst du zuerst Layer 1 oder Layer 2 ausfüllen.
              </p>
              <button onClick={onBack} className="btn btn-primary">
                ← Zurück zum Start
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Zusammenfassung */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-body">
                {hatDiskrepanzen ? (
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    In <strong style={{ color: COLORS.rot }}>{anzahlDiskrepanzen} Punkten</strong> bist du radikaler als das aktuelle Erfurter Programm. 
                    Das Programm wird in den nächsten Jahren erneuert – hier kannst du Einfluss nehmen.
                  </p>
                ) : (
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    Wir haben keine großen Diskrepanzen zwischen deinen Positionen und dem Erfurter Programm gefunden. 
                    Das heißt nicht, dass du mit allem übereinstimmst – aber in den abgefragten Punkten liegt ihr nah beieinander.
                  </p>
                )}
              </div>
            </div>

            {/* Diskrepanzen-Liste */}
            {hatDiskrepanzen && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="label" style={{ marginBottom: '1rem' }}>
                  DEINE RADIKALEREN POSITIONEN ({anzahlDiskrepanzen})
                </div>
                {diskrepanzen.map(d => (
                  <DiskrepanzKarte
                    key={d.id}
                    diskrepanz={d}
                  />
                ))}
              </div>
            )}
            
            {/* Literatur-Button */}
            {archetypName && onLiteratur && (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                background: '#2E2E2E', 
                borderRadius: '8px',
                border: '1px solid #444'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📚</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: COLORS.weiss, fontWeight: 600 }}>Literatur zu "{archetypName}"</div>
                    <div style={{ color: '#AAA', fontSize: '0.85rem' }}>Bücher, Videos, Podcasts für deine Vertiefung</div>
                  </div>
                  <button 
                    onClick={onLiteratur} 
                    className="btn btn-secondary"
                    style={{ color: COLORS.weiss, borderColor: COLORS.rot, background: 'transparent' }}
                  >
                    Entdecken →
                  </button>
                </div>
              </div>
            )}

            {/* Info-Box über Programmerneuerung */}
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              background: '#2A2A2A', 
              borderRadius: '8px',
              borderLeft: `4px solid ${COLORS.rot}`
            }}>
              <div style={{ fontWeight: 600, color: COLORS.weiss, marginBottom: '0.5rem' }}>
                📋 Über die Programmerneuerung
              </div>
              <p style={{ fontSize: '0.85rem', color: '#AAA', margin: 0, lineHeight: 1.6 }}>
                Das Erfurter Programm stammt von 2011. Die Linke hat beschlossen, es zu erneuern. 
                Anträge können über Kreisverbände, Landesverbände oder als Initiativanträge eingebracht werden.
                <br/><br/>
                <a href="https://www.die-linke.de/partei/parteistruktur/parteitag/" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.rot }}>
                  → Mehr zum Antragsverfahren
                </a>
              </p>
            </div>
            
            <button onClick={onBack} className="btn btn-secondary btn-block" style={{ marginTop: '1.5rem', color: '#AAA', borderColor: '#666' }}>
              ← Nochmal von vorne
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 0 - STARTSEITE (BAUHAUS)
// ═══════════════════════════════════════════════════════════════════════════

const Layer0 = ({ onStart, onStartL2, onWesen }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: COLORS.creme,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Bauhaus geometrische Elemente */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '120px',
        height: '120px',
        background: COLORS.rot,
        opacity: 0.15
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: COLORS.schwarz,
        opacity: 0.1
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '60px',
        height: '60px',
        background: COLORS.orange,
        transform: 'rotate(45deg)',
        opacity: 0.12
      }} />
      
      {/* Info-Button oben rechts */}
      <button
        onClick={() => setShowInfo(true)}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: `2px solid ${COLORS.schwarz}`,
          background: 'transparent',
          fontSize: '1.2rem',
          fontWeight: 700,
          cursor: 'pointer',
          color: COLORS.schwarz
        }}
      >
        i
      </button>
      
      {/* Hauptinhalt */}
      <div style={{ textAlign: 'center', maxWidth: '800px', zIndex: 1 }}>
        
        {/* Klickbarer Titel */}
        <h1 
          onClick={() => setShowOptions(!showOptions)}
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 900,
            color: COLORS.schwarz,
            margin: '0 0 2rem',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            cursor: 'pointer',
            transition: 'all 0.3s',
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = COLORS.rot;
          }}
          onMouseLeave={(e) => {
            e.target.style.color = COLORS.schwarz;
          }}
        >
          SOZIALISMUS
        </h1>
        
        {/* Drei Optionen - erscheinen nach Klick */}
        <div style={{
          maxHeight: showOptions ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease, opacity 0.3s ease',
          opacity: showOptions ? 1 : 0
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem',
            maxWidth: '400px',
            margin: '0 auto 2rem'
          }}>
            {/* Option 1: Bin ich links? */}
            <button
              onClick={onStart}
              style={{
                padding: '1.25rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'transparent',
                color: COLORS.schwarz,
                border: `3px solid ${COLORS.schwarz}`,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.schwarz;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = COLORS.schwarz;
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>❓</span>
              <div>
                <div>Bin ich links?</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.7 }}>Schnelltest in 5 Minuten</div>
              </div>
            </button>
            
            {/* Option 2: Wie links bin ich? */}
            <button
              onClick={onStartL2}
              style={{
                padding: '1.25rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'transparent',
                color: COLORS.rot,
                border: `3px solid ${COLORS.rot}`,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.rot;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = COLORS.rot;
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
              <div>
                <div>Wie links bin ich?</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.7 }}>Ausführliche Analyse</div>
              </div>
            </button>
            
            {/* Option 3: Das Linke Wesen */}
            <button
              onClick={onWesen}
              style={{
                padding: '1.25rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'transparent',
                color: COLORS.grau,
                border: `3px solid ${COLORS.grau}`,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.grau;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = COLORS.grau;
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🔮</span>
              <div>
                <div>Das Linke Wesen</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.7 }}>Erkunde alle Positionen</div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Info-Modal */}
      {showInfo && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowInfo(false)}
        >
          <div 
            style={{
              background: COLORS.creme,
              padding: '2.5rem',
              maxWidth: '500px',
              width: '100%',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInfo(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: COLORS.schwarz
              }}
            >
              ×
            </button>
            
            <h3 style={{ color: COLORS.schwarz, marginBottom: '1rem' }}>Über dieses Projekt</h3>
            
            <p style={{ color: COLORS.grau, marginBottom: '1rem', lineHeight: 1.6 }}>
              Der <strong>Sozialismus-Generator</strong> hilft dir, deine politische Position innerhalb des linken Spektrums zu verorten.
            </p>
            
            <p style={{ color: COLORS.grau, marginBottom: '1rem', lineHeight: 1.6 }}>
              <strong>Bin ich links?</strong> – Ein Schnelltest zu grundlegenden Fragen.
            </p>
            
            <p style={{ color: COLORS.grau, marginBottom: '1rem', lineHeight: 1.6 }}>
              <strong>Wie links bin ich?</strong> – Eine ausführliche Analyse deiner politischen Positionen auf 17 Achsen.
            </p>
            
            <p style={{ color: COLORS.grau, marginBottom: '1rem', lineHeight: 1.6 }}>
              <strong>Das Linke Wesen</strong> – Eine interaktive Kartografie aller linken Ideen, Positionen und Debatten.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 4: LITERATUR
// ═══════════════════════════════════════════════════════════════════════════

const Layer4 = ({ archetypId, archetypName, literatur, onBack }) => {
  const data = literatur?.archetypen?.[archetypId];
  
  const LiteraturKarte = ({ item, highlight }) => (
    <div style={{
      background: highlight ? '#FFF8E1' : COLORS.weiss,
      border: highlight ? `2px solid ${COLORS.orange}` : '1px solid #DDD',
      padding: '1rem',
      marginBottom: '0.75rem',
      borderRadius: '4px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <strong style={{ color: COLORS.schwarz }}>{item.titel}</strong>
        {item.frei && <span style={{ fontSize: '0.7rem', background: COLORS.gruen, color: COLORS.weiss, padding: '2px 6px', borderRadius: '2px' }}>FREI</span>}
      </div>
      {item.autor && <div style={{ fontSize: '0.85rem', color: COLORS.grau }}>{item.autor} {item.jahr && `(${item.jahr})`}</div>}
      {item.warum && <p style={{ fontSize: '0.85rem', margin: '0.5rem 0', fontStyle: 'italic' }}>{item.warum}</p>}
      {item.schwierigkeit && (
        <div style={{ fontSize: '0.75rem', color: COLORS.grau }}>
          Schwierigkeit: {'★'.repeat(item.schwierigkeit)}{'☆'.repeat(5 - item.schwierigkeit)}
        </div>
      )}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ 
          display: 'inline-block', 
          marginTop: '0.5rem', 
          fontSize: '0.85rem', 
          color: COLORS.rot,
          textDecoration: 'none'
        }}>
          → Jetzt lesen
        </a>
      )}
    </div>
  );

  const VideoKarte = ({ item }) => (
    <div style={{
      background: COLORS.weiss,
      border: '1px solid #DDD',
      padding: '1rem',
      marginBottom: '0.75rem',
      borderRadius: '4px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <strong style={{ color: COLORS.schwarz }}>{item.titel}</strong>
        <span style={{ fontSize: '0.75rem', color: COLORS.grau }}>{item.laenge}</span>
      </div>
      {item.kanal && <div style={{ fontSize: '0.85rem', color: COLORS.grau }}>{item.kanal}</div>}
      {item.warum && <p style={{ fontSize: '0.85rem', margin: '0.5rem 0', fontStyle: 'italic' }}>{item.warum}</p>}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ 
          display: 'inline-block', 
          marginTop: '0.5rem', 
          fontSize: '0.85rem', 
          color: COLORS.rot,
          textDecoration: 'none'
        }}>
          ▶ Ansehen
        </a>
      )}
    </div>
  );

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: COLORS.creme }}>
        <div className="container">
          <h1>Literatur wird noch ergänzt</h1>
          <p>Für "{archetypName}" sind noch keine Literaturempfehlungen verfügbar.</p>
          <button onClick={onBack} className="btn btn-secondary" style={{ marginTop: '2rem' }}>← Zurück</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: COLORS.creme }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="label">LAYER 4: DEIN LESEPLAN</div>
          <h1 style={{ marginTop: '0.5rem' }}>Literatur für {data.name || archetypName}</h1>
        </div>

        {data.warnung && (
          <div style={{ background: '#FFF3E0', padding: '1rem', borderLeft: `4px solid ${COLORS.orange}`, marginBottom: '2rem', fontSize: '0.9rem' }}>
            ⚠️ {data.warnung}
          </div>
        )}

        {data.hinweis && (
          <div style={{ background: '#E3F2FD', padding: '1rem', borderLeft: `4px solid #2196F3`, marginBottom: '2rem', fontSize: '0.9rem' }}>
            💡 {data.hinweis}
          </div>
        )}

        {/* Einstieg */}
        {data.einstieg?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: COLORS.rot, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📖</span> Einstieg – Hier anfangen!
            </h2>
            {data.einstieg.map((item, i) => <LiteraturKarte key={i} item={item} highlight={i === 0} />)}
          </div>
        )}

        {/* Vertiefung */}
        {data.vertiefung?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: COLORS.schwarz, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📚</span> Vertiefung
            </h2>
            {data.vertiefung.map((item, i) => <LiteraturKarte key={i} item={item} />)}
          </div>
        )}

        {/* Klassiker */}
        {data.klassiker?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: COLORS.schwarz, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🏛️</span> Klassiker
            </h2>
            {data.klassiker.map((item, i) => <LiteraturKarte key={i} item={item} />)}
          </div>
        )}

        {/* Videos */}
        {data.videos?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: COLORS.schwarz, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎬</span> Videos
            </h2>
            {data.videos.map((item, i) => <VideoKarte key={i} item={item} />)}
          </div>
        )}

        {/* Podcasts */}
        {data.podcasts?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: COLORS.schwarz, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎧</span> Podcasts
            </h2>
            {data.podcasts.map((item, i) => <VideoKarte key={i} item={item} />)}
          </div>
        )}

        {/* Praxis */}
        {data.praxis?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: COLORS.gruen, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>✊</span> Praxis – Mitmachen!
            </h2>
            {data.praxis.map((item, i) => (
              <div key={i} style={{ background: '#E8F5E9', border: `1px solid ${COLORS.gruen}`, padding: '1rem', marginBottom: '0.75rem', borderRadius: '4px' }}>
                <strong>{item.name}</strong>
                {item.was && <p style={{ fontSize: '0.85rem', margin: '0.5rem 0' }}>{item.was}</p>}
                {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gruen, fontSize: '0.85rem' }}>→ Website</a>}
              </div>
            ))}
          </div>
        )}

        {/* Allgemeine Bibliotheken */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#F5F5F5', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>📁 Freie Online-Bibliotheken</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <a href="https://www.marxists.org/deutsch/" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.rot, fontSize: '0.9rem' }}>Marxists.org (Klassiker)</a>
            <a href="https://theanarchistlibrary.org/" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.rot, fontSize: '0.9rem' }}>Anarchist Library</a>
            <a href="https://libcom.org/" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.rot, fontSize: '0.9rem' }}>libcom.org</a>
            <a href="https://anarchistischebibliothek.org/" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.rot, fontSize: '0.9rem' }}>Anarchistische Bibliothek</a>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={onBack} className="btn btn-secondary">← Zurück zum Ergebnis</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LAYER NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

const LayerNav = ({ currentLayer, visitedLayers, onNavigate }) => {
  const layers = [
    { id: 1, label: 'Bist du links?', short: 'L1' },
    { id: 2, label: 'Welcher Sozialismus?', short: 'L2' },
    { id: 3, label: 'Programmvergleich', short: 'L3' }
  ];
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(26,26,26,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #333',
      padding: '0.5rem 1rem',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem'
    }}>
      {layers.map((l, i) => {
        const isActive = currentLayer === l.id;
        const isVisited = visitedLayers.includes(l.id);
        const canClick = isVisited && !isActive;
        
        return (
          <React.Fragment key={l.id}>
            <button
              onClick={() => canClick && onNavigate(l.id)}
              disabled={!canClick}
              style={{
                padding: '0.4rem 0.75rem',
                background: isActive ? COLORS.rot : (isVisited ? 'rgba(255,255,255,0.1)' : 'transparent'),
                border: `1px solid ${isActive ? COLORS.rot : (isVisited ? '#555' : '#333')}`,
                borderRadius: '20px',
                color: isActive ? '#fff' : (isVisited ? '#aaa' : '#444'),
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 400,
                cursor: canClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                opacity: isVisited || isActive ? 1 : 0.5
              }}
              title={l.label}
            >
              <span style={{ display: 'none', '@media (min-width: 500px)': { display: 'inline' } }}>{l.label}</span>
              <span>{l.short}</span>
            </button>
            {i < layers.length - 1 && (
              <span style={{ color: '#333', alignSelf: 'center' }}>→</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════

const App = () => {
  const [layer, setLayer] = useState(0);
  const [visitedLayers, setVisitedLayers] = useState([]);
  const [previousLayer, setPreviousLayer] = useState(null);
  const [returnToL2Analyse, setReturnToL2Analyse] = useState(false);
  const [profilL1, setProfilL1] = useState(null);
  const [profilL2, setProfilL2] = useState(null);
  const [analyseL2, setAnalyseL2] = useState(null);
  const [detailsL1, setDetailsL1] = useState(null);
  const [detailsL2, setDetailsL2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiKey] = useState(DEFAULT_API_KEY);
  const [analysenL1, setAnalysenL1] = useState(null);
  const [analysenL2, setAnalysenL2] = useState(null);
  const [analysenL3, setAnalysenL3] = useState(null);
  const [literatur, setLiteratur] = useState(null);
  const [archetypId, setArchetypId] = useState(null);
  const [archetypName, setArchetypName] = useState(null);
  
  // Speichere Layer1 Antworten für Rückkehr
  const [savedL1Antworten, setSavedL1Antworten] = useState(null);
  const [savedL2Antworten, setSavedL2Antworten] = useState(null);

  // Markiere Layer als besucht
  const markVisited = (layerId) => {
    setVisitedLayers(prev => prev.includes(layerId) ? prev : [...prev, layerId]);
  };

  // Navigation Handler
  const handleNavigate = (targetLayer) => {
    // Spezielle Logik für Rückkehr zu verschiedenen Layern
    if (targetLayer === 1) {
      setReturnToL2Analyse(false);
    } else if (targetLayer === 2) {
      setReturnToL2Analyse(true); // Zeige Analyse wenn vorhanden
    }
    setLayer(targetLayer);
  };

  useEffect(() => {
    Promise.all([
      fetch('data/layer1.json').then(r => r.json()).catch(() => null),
      fetch('data/layer2.json').then(r => r.json()).catch(() => null),
      fetch('data/analysen-layer1.json').then(r => r.json()).catch(() => null),
      fetch('data/analysen-layer2.json').then(r => r.json()).catch(() => null),
      fetch('data/analysen-layer3.json').then(r => r.json()).catch(() => null),
      fetch('data/literatur.json').then(r => {
        if (!r.ok) {
          console.error('literatur.json nicht gefunden! Status:', r.status);
          return null;
        }
        return r.json();
      }).catch(err => {
        console.error('Fehler beim Laden von literatur.json:', err);
        return null;
      })
    ]).then(([l1, l2, a1, a2, a3, lit]) => {
      console.log('Literatur geladen:', lit ? 'JA (' + Object.keys(lit.archetypen || {}).length + ' Archetypen)' : 'NEIN');
      setDetailsL1(l1);
      setDetailsL2(l2);
      setAnalysenL1(a1);
      setAnalysenL2(a2);
      setAnalysenL3(a3);
      setLiteratur(lit);
      setLoading(false);
    });
  }, []);

  const paramsL1 = useMemo(() => mergeWithDetails(PARAMETER_L1_BASE, detailsL1, false), [detailsL1]);
  const paramsL2 = useMemo(() => mergeWithDetails(PARAMETER_L2_BASE, detailsL2, true), [detailsL2]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: COLORS.grau }}>Lade...</p>
      </div>
    );
  }

  // Layer 0 - Intro (keine Nav)
  if (layer === 0) {
    return <Layer0 
      onStart={() => { setLayer(1); markVisited(1); }}
      onStartL2={() => { setLayer(2); markVisited(2); }}
      onWesen={() => { window.location.href = 'haus/index.html'; }}
    />;
  }

  // Wrapper mit Navigation für Layer 1-3
  const showNav = layer >= 1 && layer <= 3;

  return (
    <>
      {showNav && (
        <LayerNav 
          currentLayer={layer} 
          visitedLayers={visitedLayers} 
          onNavigate={handleNavigate} 
        />
      )}
      
      <div style={{ paddingTop: showNav ? '3rem' : 0 }}>
        {layer === 1 && (
          <Layer1 
            params={paramsL1} 
            onComplete={(p) => { 
              setProfilL1(p); 
              setSavedL1Antworten(p);
              markVisited(2);
              setLayer(2); 
            }} 
            apiKey={apiKey} 
            analysen={analysenL1}
            initialAntworten={savedL1Antworten}
          />
        )}
        
        {layer === 2 && (
          <Layer2 
            params={paramsL2} 
            onComplete={(p, id, name) => { 
              setProfilL2(p); 
              setSavedL2Antworten(p);
              setArchetypId(id);
              setArchetypName(name);
              setAnalyseL2({ id, archetyp: name });
              setReturnToL2Analyse(false);
              markVisited(3);
              setLayer(3); 
            }} 
            onLiteratur={(p, id, name, fullAnalyse) => {
              setProfilL2(p);
              setSavedL2Antworten(p);
              setArchetypId(id);
              setArchetypName(name);
              setAnalyseL2(fullAnalyse);
              setPreviousLayer(2);
              setReturnToL2Analyse(true);
              setLayer(4);
            }}
            onBack={() => {
              setReturnToL2Analyse(false);
              setLayer(1);
            }} 
            apiKey={apiKey} 
            analysen={analysenL2}
            initialPhase={returnToL2Analyse ? 'analyse' : 'intro'}
            initialAnalyse={returnToL2Analyse ? analyseL2 : null}
            initialAntworten={savedL2Antworten}
          />
        )}
        
        {layer === 3 && (
          <Layer3 
            profilL1={profilL1} 
            profilL2={profilL2} 
            onBack={() => { 
              setLayer(0); 
              setProfilL1(null); 
              setProfilL2(null); 
              setArchetypId(null); 
              setArchetypName(null);
              setVisitedLayers([]);
              setSavedL1Antworten(null);
              setSavedL2Antworten(null);
            }} 
            onLiteratur={() => {
              setPreviousLayer(3);
              setLayer(4);
            }}
            apiKey={apiKey} 
            paramsL1={paramsL1} 
            paramsL2={paramsL2} 
            analysen={analysenL3} 
            archetypName={archetypName}
          />
        )}
        
        {layer === 4 && (
          <Layer4 
            archetypId={archetypId} 
            archetypName={archetypName} 
            literatur={literatur} 
            onBack={() => {
              const goTo = previousLayer || 2;
              setPreviousLayer(null);
              setLayer(goTo);
            }}
          />
        )}
      </div>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
