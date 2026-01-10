// ═══════════════════════════════════════════════════════════════════════════
// SOZIALISMUS-GENERATOR V4.0 - Mit 18 Achsen + Wesen-Integration
// ═══════════════════════════════════════════════════════════════════════════

const { useState, useEffect, useMemo } = React;

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
// Mit allen 18 Achsen und Wesen-Integration
// ═══════════════════════════════════════════════════════════════════════════

const SOZIALISMUS_ENGINE = {
  
  theoretiker: {
    // KLASSIKER
    "Eduard Bernstein": { bedingungen: { A1: [1,2], A3: [1,2] }, schlagwort: "Evolutionärer Sozialismus", wiki: "Eduard_Bernstein" },
    "Rosa Luxemburg": { bedingungen: { A1: [3,4,5], A4: [3,4,5], A2: [1,2,3] }, schlagwort: "Spontaneität der Massen", wiki: "Rosa_Luxemburg" },
    "Anton Pannekoek": { bedingungen: { A1: [4,5], A3: [4,5], A4: [4,5] }, schlagwort: "Rätekommunismus", wiki: "Anton_Pannekoek" },
    "Michail Bakunin": { bedingungen: { A3: [4,5], A4: [5], B2: [4,5] }, schlagwort: "Kollektiver Anarchismus", wiki: "Michail_Alexandrowitsch_Bakunin" },
    "Peter Kropotkin": { bedingungen: { A3: [5], B2: [5], B3: [4,5] }, schlagwort: "Anarcho-Kommunismus", wiki: "Peter_Kropotkin" },
    "Antonio Gramsci": { bedingungen: { A1: [3,4], D1: [2,3,4], A3: [3] }, schlagwort: "Kulturelle Hegemonie", wiki: "Antonio_Gramsci" },
    "Nicos Poulantzas": { bedingungen: { A1: [3], A3: [2,3], A4: [3,4] }, schlagwort: "Relationale Staatstheorie", wiki: "Nicos_Poulantzas" },
    
    // ÖKOLOGIE & POST-WORK
    "André Gorz": { bedingungen: { A1: [2,3], B3: [4,5], C2: [4,5] }, schlagwort: "Politische Ökologie", wiki: "André_Gorz" },
    "Murray Bookchin": { bedingungen: { A3: [4,5], C2: [4,5], E1: [4,5] }, schlagwort: "Kommunalismus", wiki: "Murray_Bookchin" },
    "Kohei Saito": { bedingungen: { C2: [4,5], B3: [4,5], D3: [1,2] }, schlagwort: "Degrowth-Kommunismus", wiki: "Kohei_Saito" },
    
    // FEMINISMUS
    "Silvia Federici": { bedingungen: { C1: [4,5], B3: [4,5], B2: [4,5] }, schlagwort: "Reproduktionsarbeit", wiki: "Silvia_Federici" },
    "Nancy Fraser": { bedingungen: { C1: [4,5], A1: [2,3], A5: [4,5] }, schlagwort: "Feminismus für die 99%", wiki: "Nancy_Fraser" },
    "Angela Davis": { bedingungen: { C1: [5], A2: [4,5], C3: [4,5] }, schlagwort: "Abolitionismus", wiki: "Angela_Davis" },
    
    // AUTONOME & ANARCHIE
    "Antonio Negri": { bedingungen: { A1: [4,5], A2: [4,5], A4: [4,5] }, schlagwort: "Multitude", wiki: "Antonio_Negri" },
    "John Holloway": { bedingungen: { A1: [5], A3: [4,5], A4: [5] }, schlagwort: "Welt verändern ohne Macht", wiki: "John_Holloway_(Politikwissenschaftler)" },
    "David Graeber": { bedingungen: { A4: [5], B3: [5], A3: [5], B2: [5] }, schlagwort: "Anarchistische Anthropologie", wiki: "David_Graeber" },
    
    // POSTKOLONIAL
    "Frantz Fanon": { bedingungen: { C3: [4,5], F2: [4,5] }, schlagwort: "Dekolonisierung", wiki: "Frantz_Fanon" },
    "Gayatri Spivak": { bedingungen: { C3: [5], E2: [5], C1: [5] }, schlagwort: "Subalterne Studien", wiki: "Gayatri_Chakravorty_Spivak" },
    
    // UTOPIE & KULTUR
    "Erik Olin Wright": { bedingungen: { A1: [2,3], B2: [3,4], D1: [4] }, schlagwort: "Reale Utopien", wiki: "Erik_Olin_Wright" },
    "Mark Fisher": { bedingungen: { D1: [2,3], D3: [2,3], B3: [4,5] }, schlagwort: "Kapitalistischer Realismus", wiki: "Mark_Fisher_(Theoretiker)" },
    "Ernst Bloch": { bedingungen: { D1: [3,4,5], D3: [3,4] }, schlagwort: "Prinzip Hoffnung", wiki: "Ernst_Bloch" },
    
    // NEUE: Technologie & Bündnisse
    "Nick Srnicek": { bedingungen: { F1: [4,5], B3: [5], D1: [4,5] }, schlagwort: "Akzelerationismus", wiki: "Nick_Srnicek" },
    "Aaron Bastani": { bedingungen: { F1: [5], B3: [5], D1: [5] }, schlagwort: "FALC", wiki: "Aaron_Bastani" },
    "Ivan Illich": { bedingungen: { F1: [1,2], B3: [3,4], A3: [4,5] }, schlagwort: "Konviviale Werkzeuge", wiki: "Ivan_Illich" },
    "Chantal Mouffe": { bedingungen: { A5: [4,5], A2: [4,5], A3: [3] }, schlagwort: "Agonistische Demokratie", wiki: "Chantal_Mouffe" },
    "Herbert Marcuse": { bedingungen: { D3: [3], A2: [4,5], F2: [3,4] }, schlagwort: "Große Weigerung", wiki: "Herbert_Marcuse" },
    "Bini Adamczak": { bedingungen: { D2: [4,5], C1: [5], D1: [3,4] }, schlagwort: "Beziehungsweise Revolution", wiki: "Bini_Adamczak" }
  },

  stroemungen: [
    { 
      name: "Anarcho-Kommunismus", 
      kurzform: "Anarchistisch", 
      icon: "Ⓐ", 
      id: "anarcho-kommunismus",
      bedingungen: (p) => p.A3 >= 4 && p.A4 >= 4 && p.B2 >= 4,
      beschreibung: "Du willst den Staat abschaffen und durch freie Assoziationen ersetzen. Eigentum wird gemeinschaftlich verwaltet, ohne zentrale Autorität.",
      wesenKnoten: ["A3-5", "B2-5", "A4-5"],
      wesenEtage: "1. Stock",
      literaturKey: "libertaerer_sozialismus"
    },
    { 
      name: "Rätekommunismus", 
      kurzform: "Rätedemokratisch", 
      icon: "☭", 
      id: "raetekommunismus",
      bedingungen: (p) => p.A1 >= 4 && p.A3 >= 3 && p.A4 >= 4 && p.B2 >= 4,
      beschreibung: "Du setzt auf Arbeiterräte als Organe der Selbstverwaltung. Die Basis entscheidet – in Betrieb und Stadtteil.",
      wesenKnoten: ["A3-4", "B2-5", "A4-4", "E2-4"],
      wesenEtage: "1. Stock",
      literaturKey: "raetekommunismus"
    },
    { 
      name: "Autonomer Sozialismus", 
      kurzform: "Autonom", 
      icon: "🏴", 
      id: "autonomer-sozialismus",
      bedingungen: (p) => p.A1 >= 4 && p.A4 >= 4 && p.A5 >= 3 && p.D2 >= 4,
      beschreibung: "Du glaubst an Veränderung durch Bewegung, nicht durch Parteien. Die neue Gesellschaft entsteht im Widerstand.",
      wesenKnoten: ["A2-4", "A4-5", "D2-4", "F2-3"],
      wesenEtage: "1. Stock",
      literaturKey: "autonomer_marxismus"
    },
    { 
      name: "Demokratischer Sozialismus", 
      kurzform: "Demokratisch", 
      icon: "🌹", 
      id: "demokratischer-sozialismus",
      bedingungen: (p) => p.A1 <= 3 && p.A3 <= 3 && p.A4 <= 3 && p.F2 <= 2,
      beschreibung: "Du willst den Sozialismus durch demokratische Reformen erreichen. Schritt für Schritt, Mehrheit für Mehrheit.",
      wesenKnoten: ["A1-2", "A3-3", "D2-2", "F2-2"],
      wesenEtage: "1. Stock",
      literaturKey: "demokratischer_sozialismus"
    },
    { 
      name: "Libertärer Kommunalismus", 
      kurzform: "Kommunalistisch", 
      icon: "🌻", 
      id: "munizipalismus",
      bedingungen: (p) => p.A3 >= 4 && p.E1 >= 4 && p.C2 >= 3,
      beschreibung: "Du setzt auf kommunale Selbstverwaltung und direkte Demokratie. Föderationen freier Kommunen ersetzen den Nationalstaat.",
      wesenKnoten: ["E1-4", "A3-4", "B2-4", "C2-4"],
      wesenEtage: "1. Stock",
      literaturKey: "munizipalismus"
    },
    { 
      name: "Ökosozialismus", 
      kurzform: "Ökosozialistisch", 
      icon: "🌍", 
      id: "oekosozialismus",
      bedingungen: (p) => p.C2 >= 4 && p.B3 >= 3,
      beschreibung: "Ökologische und soziale Krise sind zwei Seiten derselben Medaille. Nur ein Systemwechsel kann beide lösen.",
      wesenKnoten: ["C2-4", "C2-5", "B3-4"],
      wesenEtage: "2. Stock",
      literaturKey: "oekosozialismus"
    },
    { 
      name: "Feministischer Sozialismus", 
      kurzform: "Feministisch", 
      icon: "♀️", 
      id: "feministischer-sozialismus",
      bedingungen: (p) => p.C1 >= 4 && (p.B3 >= 3 || p.A2 >= 4),
      beschreibung: "Patriarchat und Kapitalismus sind verwobene Herrschaftssysteme. Care-Arbeit steht im Zentrum.",
      wesenKnoten: ["C1-4", "C1-5", "B3-4", "A2-4"],
      wesenEtage: "2. Stock",
      literaturKey: "feministischer_sozialismus"
    },
    { 
      name: "Postkolonialer Sozialismus", 
      kurzform: "Dekolonial", 
      icon: "✊🏾", 
      id: "postkolonial",
      bedingungen: (p) => p.C3 >= 4 && (p.C2 >= 4 || p.D3 >= 4),
      beschreibung: "Sozialismus ohne Dekolonisierung ist unvollständig. Die Kämpfe im globalen Süden sind zentral.",
      wesenKnoten: ["C3-4", "C3-5", "C2-5", "D3-4"],
      wesenEtage: "2. Stock",
      literaturKey: "buen_vivir"
    },
    { 
      name: "Reformorientierter Sozialismus", 
      kurzform: "Reformistisch", 
      icon: "📜", 
      id: "reformsozialismus",
      bedingungen: (p) => p.A1 <= 2 && p.F2 <= 2 && p.A3 <= 2,
      beschreibung: "Du glaubst an den parlamentarischen Weg. Reformen verbessern das Leben und bereiten größere Veränderungen vor.",
      wesenKnoten: ["A1-1", "A1-2", "D2-1", "F2-1"],
      wesenEtage: "1. Stock",
      literaturKey: "demokratischer_sozialismus"
    },
    { 
      name: "Post-Kapitalismus", 
      kurzform: "Post-Work", 
      icon: "🤖", 
      id: "post-kapitalismus",
      bedingungen: (p) => p.B3 >= 4 && p.F1 >= 4,
      beschreibung: "Automation und Grundeinkommen können uns von Lohnarbeit befreien. Fully Automated Luxury Communism.",
      wesenKnoten: ["B3-5", "F1-4", "F1-5", "D1-4"],
      wesenEtage: "Erdgeschoss",
      literaturKey: "postkapitalismus"
    },
    { 
      name: "Marxismus-Leninismus", 
      kurzform: "ML", 
      icon: "⚒️", 
      id: "marxismus-leninismus",
      bedingungen: (p) => p.A3 <= 2 && p.A4 <= 2 && p.B1 <= 2 && p.E2 <= 2,
      beschreibung: "Eine disziplinierte Partei führt die Arbeiterklasse zur Macht. Der Staat wird erobert und für die Revolution genutzt.",
      wesenKnoten: ["A3-2", "A4-1", "B1-1", "E2-1"],
      wesenEtage: "1. Stock",
      literaturKey: "marxismus_leninismus"
    }
  ],

  spannungen: [
    { test: (p) => p.A3 <= 2 && p.A4 >= 4, titel: "Staat vs. Basisdemokratie",
      beschreibung: "Du willst den Staat nutzen, aber Hierarchien ablehnen.", 
      frage: "Kann ein Staatsapparat ohne Hierarchie funktionieren?" },
    { test: (p) => p.B1 <= 2 && p.A4 >= 4, titel: "Zentrale Planung vs. Basisdemokratie",
      beschreibung: "Du willst Planung und maximale Basisdemokratie.", 
      frage: "Wie kann Planung dezentral und trotzdem koordiniert funktionieren?" },
    { test: (p) => p.A2 <= 2 && p.C1 >= 4, titel: "Klasse vs. Intersektionalität",
      beschreibung: "Du fokussierst auf Arbeiterklasse, betonst aber auch Feminismus.", 
      frage: "Ist Geschlecht ein Nebenwiderspruch?" },
    { test: (p) => p.A1 <= 2 && p.A3 >= 4, titel: "Reform vs. Staatsablehnung",
      beschreibung: "Du willst graduelle Reformen, lehnst aber den Staat ab.", 
      frage: "Wer soll die Reformen dann umsetzen?" },
    { test: (p) => p.F2 >= 4 && p.A5 <= 2, titel: "Militanz vs. Enge Bündnisse",
      beschreibung: "Du bist offen für Militanz, arbeitest aber nur mit Gleichgesinnten.", 
      frage: "Führt Radikalität zur Isolation?" },
    { test: (p) => p.B3 >= 4 && p.A1 <= 2, titel: "Post-Work vs. Reformismus",
      beschreibung: "Du willst Lohnarbeit überwinden, setzt aber auf graduelle Reformen.", 
      frage: "Kann man sich aus der Arbeit herausreformieren?" },
    { test: (p) => p.C2 >= 4 && p.C3 <= 2, titel: "Ökologie vs. Nationale Fokussierung",
      beschreibung: "Du priorisierst Ökologie, fokussierst aber national.", 
      frage: "Kann ein Land allein ökologisch transformieren?" },
    { test: (p) => p.D1 <= 2 && p.A1 >= 4, titel: "Vage Utopie vs. Revolution",
      beschreibung: "Du willst revolutionären Bruch, ohne konkretes Bild der Zukunft.", 
      frage: "Wofür kämpfst du dann?" },
    // NEUE Spannungen für neue Achsen
    { test: (p) => p.F1 >= 4 && p.C2 >= 4, titel: "Akzelerationismus vs. Ökologie",
      beschreibung: "Du willst Technik beschleunigen und die Natur schützen.", 
      frage: "Kann High-Tech ökologisch sein, oder ist Degrowth nötig?" },
    { test: (p) => p.F2 >= 4 && p.D3 >= 4, titel: "Militanz vs. Spiritualität",
      beschreibung: "Du bist offen für Gewalt und für spirituelle Perspektiven.", 
      frage: "Wie passt revolutionäre Gewalt zu spiritueller Transformation?" },
    { test: (p) => p.A5 >= 4 && p.A4 <= 2, titel: "Breite Bündnisse vs. Zentralismus",
      beschreibung: "Du willst breite Bewegungskoalitionen, aber zentralistische Führung.", 
      frage: "Wer führt ein Mosaik?" },
    { test: (p) => p.F1 <= 2 && p.B3 >= 4, titel: "Low-Tech vs. Post-Work",
      beschreibung: "Du bist technikskeptisch, willst aber Arbeit überwinden.", 
      frage: "Wer macht die Arbeit, wenn nicht die Maschinen?" }
  ],

  // Analysiere ein Profil und finde passende Strömung
  analysiere: function(profil) {
    // Parameter-Objekt erstellen
    const p = {};
    Object.entries(profil).forEach(([key, val]) => {
      p[key] = val;
    });
    
    // Strömung finden
    let hauptstroemung = this.stroemungen.find(s => s.bedingungen(p));
    const nebenstroemungen = this.stroemungen.filter(s => s !== hauptstroemung && s.bedingungen(p));
    
    if (!hauptstroemung) {
      hauptstroemung = { 
        name: "Eigenständiger Sozialismus", 
        kurzform: "Eigenständig", 
        icon: "🌟",
        id: "eigenstaendig",
        beschreibung: "Dein Profil passt in keine Schublade. Du kombinierst Ideen auf einzigartige Weise.",
        wesenKnoten: ["A1-3", "B1-3", "C1-3"],
        wesenEtage: "Lobby",
        literaturKey: null
      };
    }
    
    // Theoretiker finden
    const passende_theoretiker = [];
    Object.entries(this.theoretiker).forEach(([name, data]) => {
      let matches = true;
      Object.entries(data.bedingungen).forEach(([param, werte]) => {
        if (!werte.includes(p[param])) matches = false;
      });
      if (matches) passende_theoretiker.push({ name, ...data });
    });
    
    // Spannungen finden
    const gefundene_spannungen = this.spannungen.filter(s => s.test(p));
    
    // Positionen zusammenfassen
    const positionen = [];
    if (p.A1 >= 4) positionen.push("Revolutionär");
    if (p.A1 <= 2) positionen.push("Reformistisch");
    if (p.A3 >= 4) positionen.push("Staatsablehnend");
    if (p.A3 <= 2) positionen.push("Staatsorientiert");
    if (p.A4 >= 4) positionen.push("Basisdemokratisch");
    if (p.A4 <= 2) positionen.push("Zentralistisch");
    if (p.B2 >= 4) positionen.push("Commons/Selbstverwaltung");
    if (p.B3 >= 4) positionen.push("Post-Work");
    if (p.C1 >= 4) positionen.push("Intersektional");
    if (p.C2 >= 4) positionen.push("Ökosozialistisch");
    if (p.C3 >= 4) positionen.push("Internationalistisch");
    if (p.F1 >= 4) positionen.push("Technikoptimistisch");
    if (p.F1 <= 2) positionen.push("Technikskeptisch");
    if (p.F2 >= 4) positionen.push("Militant");
    if (p.F2 <= 2) positionen.push("Gewaltfrei");
    
    // Stärken ableiten
    const staerken = [];
    if (p.A1 >= 3 && p.A1 <= 4) staerken.push("Balanciert Theorie und Praxis");
    if (p.C1 >= 4 && p.C2 >= 4) staerken.push("Verbindet Feminismus und Ökologie");
    if (p.A4 >= 4 && p.A5 >= 4) staerken.push("Stark in Basisarbeit und Vernetzung");
    if (p.D1 >= 4) staerken.push("Hat ein klares Zukunftsbild");
    if (p.B3 >= 4 && p.F1 >= 4) staerken.push("Denkt Technologie und Befreiung zusammen");
    
    // Slogans
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
      "Post-Kapitalismus": "Fully Automated Luxury Communism!",
      "Marxismus-Leninismus": "Proletarier aller Länder, vereinigt euch!",
      "Eigenständiger Sozialismus": "Eine andere Welt ist möglich!"
    };
    
    // Name anpassen basierend auf Profil
    let name = hauptstroemung.name;
    if (p.C2 >= 4 && !name.includes("Öko")) name = "Öko-" + name.charAt(0).toLowerCase() + name.slice(1);
    if (p.C1 >= 4 && !name.includes("Feministisch")) name = "Feministischer " + name;
    
    return {
      name, 
      kurzform: hauptstroemung.kurzform, 
      icon: hauptstroemung.icon,
      id: hauptstroemung.id,
      slogan: slogans[hauptstroemung.name] || "Eine andere Welt ist möglich!",
      beschreibung: hauptstroemung.beschreibung,
      theoretiker: passende_theoretiker.slice(0, 4),
      spannungen: gefundene_spannungen.slice(0, 3),
      positionen, 
      staerken: staerken.slice(0, 3),
      nebenstroemungen: nebenstroemungen.map(s => s.name).slice(0, 2),
      wesenKnoten: hauptstroemung.wesenKnoten,
      wesenEtage: hauptstroemung.wesenEtage,
      literaturKey: hauptstroemung.literaturKey
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// WESEN-INTEGRATION: URL-Generierung und Weiterleitung
// ═══════════════════════════════════════════════════════════════════════════

const WESEN_INTEGRATION = {
  baseURL: '/wesen/',  // Anpassen je nach Deployment
  
  // Generiere URL für Wesen-Weiterleitung
  generateURL: function(ergebnis) {
    const params = new URLSearchParams({
      stroemung: ergebnis.id,
      knoten: ergebnis.wesenKnoten.join(','),
      etage: ergebnis.wesenEtage || '1. Stock',
      name: ergebnis.name
    });
    return this.baseURL + '?' + params.toString();
  },
  
  // Weiterleiten zum Wesen
  redirect: function(ergebnis) {
    const url = this.generateURL(ergebnis);
    window.location.href = url;
  },
  
  // Link in neuem Tab öffnen
  openInNewTab: function(ergebnis) {
    const url = this.generateURL(ergebnis);
    window.open(url, '_blank');
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// LAYER 2 PARAMETER (18 Achsen)
// ═══════════════════════════════════════════════════════════════════════════

const PARAMETER_L2_BASE = [
  // FELD A: STRATEGIE (5 Parameter)
  { id: 'A1', feld: 'STRATEGIE', titel: 'WEG', kurz: 'Reform oder Revolution?', 
    links: 'Schrittweise Reform', rechts: 'Radikaler Bruch', icon: '🛤️',
    programmScore: 3, programmText: '"Längerer emanzipatorischer Prozess" – transformativer Reformismus',
    stufen: [
      { wert: 1, label: 'Strikter Reformismus', beschreibung: 'Veränderung nur durch Wahlen, Gesetze, Institutionen.' },
      { wert: 2, label: 'Radikale Reform', beschreibung: 'Tiefgreifende Strukturreformen, die über Verbesserungen hinausgehen.' },
      { wert: 3, label: 'Revolutionäre Realpolitik', beschreibung: 'Parlamentarische Arbeit + außerparlamentarischer Druck.' },
      { wert: 4, label: 'Revolutionärer Bruch', beschreibung: 'Ein grundlegender Bruch ist nötig, muss aber organisiert werden.' },
      { wert: 5, label: 'Permanente Revolution', beschreibung: 'Revolution ist ein fortlaufender Prozess. Keine Erstarrung.' }
    ]
  },
  { id: 'A2', feld: 'STRATEGIE', titel: 'SUBJEKT', kurz: 'Wer macht die Veränderung?', 
    links: 'Die Arbeiterklasse', rechts: 'Alle Unterdrückten', icon: '👥',
    programmScore: 4, programmText: 'Arbeiterbewegung + Frauenbewegung + emanzipatorische Bewegungen',
    stufen: [
      { wert: 1, label: 'Industrieproletariat', beschreibung: 'Die Industriearbeiterschaft ist das revolutionäre Subjekt.' },
      { wert: 2, label: 'Erweiterte Arbeiterklasse', beschreibung: 'Alle Lohnabhängigen – auch Angestellte, Prekarisierte.' },
      { wert: 3, label: 'Klasse und Bewegungen', beschreibung: 'Klassenkampf zentral, aber andere Kämpfe sind eigenständig.' },
      { wert: 4, label: 'Multitude', beschreibung: 'Viele Kämpfe, viele Subjekte, die sich vernetzen.' },
      { wert: 5, label: 'Universelle Emanzipation', beschreibung: 'Jede Form der Unterdrückung muss bekämpft werden.' }
    ]
  },
  { id: 'A3', feld: 'STRATEGIE', titel: 'STAAT', kurz: 'Was tun mit dem Staat?', 
    links: 'Übernehmen & nutzen', rechts: 'Langfristig überwinden', icon: '🏛️',
    programmScore: 2, programmText: 'Sozialstaat ausbauen – kein Wort von Staatsüberwindung',
    stufen: [
      { wert: 1, label: 'Etatismus', beschreibung: 'Der Staat ist das zentrale Werkzeug der Transformation.' },
      { wert: 2, label: 'Staat erobern', beschreibung: 'Bürgerlicher Staat zerschlagen, Arbeiterstaat errichten.' },
      { wert: 3, label: 'Staat transformieren', beschreibung: 'Der Staat ist umkämpftes Terrain, kann von innen/außen verändert werden.' },
      { wert: 4, label: 'Duale Macht', beschreibung: 'Parallele Strukturen aufbauen: Räte, Kommunen, Genossenschaften.' },
      { wert: 5, label: 'Anti-Etatismus', beschreibung: 'Der Staat ist per se Herrschaft. Ersetzung durch freie Assoziation.' }
    ]
  },
  { id: 'A4', feld: 'STRATEGIE', titel: 'ORGANISATION', kurz: 'Wie organisieren wir uns?', 
    links: 'Zentralistisch', rechts: 'Basisdemokratisch', icon: '🔺',
    programmScore: 3, programmText: 'Parlamentsorientiert, klassische Parteistruktur',
    stufen: [
      { wert: 1, label: 'Avantgarde-Partei', beschreibung: 'Disziplinierte Kaderpartei führt die Massen.' },
      { wert: 2, label: 'Demokratischer Zentralismus', beschreibung: 'Freie Debatte, dann Einheit. Partei als Transmissionsriemen.' },
      { wert: 3, label: 'Pluralistische Partei', beschreibung: 'Verschiedene Strömungen ringen demokratisch um Mehrheiten.' },
      { wert: 4, label: 'Bewegungspartei', beschreibung: 'Partei als Teil einer breiteren Bewegung, nicht ihr Kommando.' },
      { wert: 5, label: 'Horizontalismus', beschreibung: 'Keine Hierarchie. Spontane Selbstorganisation der Basis.' }
    ]
  },
  { id: 'A5', feld: 'STRATEGIE', titel: 'BÜNDNIS', kurz: 'Wie breit sollen Bündnisse sein?', 
    links: 'Enge Klasseneinheit', rechts: 'Breite Bewegungskoalition', icon: '🤝',
    programmScore: 4, programmText: 'Breite linke Bündnisse, Kern bleibt Arbeiterbewegung',
    stufen: [
      { wert: 1, label: 'Klassenreinheit', beschreibung: 'Nur mit der organisierten Arbeiterklasse.' },
      { wert: 2, label: 'Taktische Bündnisse', beschreibung: 'Punktuelle Kooperation, keine strategische Einheit.' },
      { wert: 3, label: 'Volksfront', beschreibung: 'Breite Bündnisse gegen Reaktion, auch mit Bürgerlichen.' },
      { wert: 4, label: 'Bewegungskoalition', beschreibung: 'Mosaiklinke: verschiedene Bewegungen verbinden sich.' },
      { wert: 5, label: 'Äquivalenzketten', beschreibung: 'Jeder Kampf als Katalysator. Alle Kämpfe verbinden.' }
    ]
  },

  // FELD B: ÖKONOMIE (3 Parameter)
  { id: 'B1', feld: 'ÖKONOMIE', titel: 'KOORDINATION', kurz: 'Wie organisieren wir Wirtschaft?', 
    links: 'Zentrale Planung', rechts: 'Dezentral/Markt', icon: '🔄',
    programmScore: 2, programmText: 'Markt mit demokratischer Rahmensetzung – keine Planwirtschaft',
    stufen: [
      { wert: 1, label: 'Zentralplanung', beschreibung: 'Gesamte Wirtschaft von zentraler Behörde geplant.' },
      { wert: 2, label: 'Demokratische Planung', beschreibung: 'Planung durch demokratische Gremien auf verschiedenen Ebenen.' },
      { wert: 3, label: 'Mischsystem', beschreibung: 'Strategische Sektoren geplant, Rest über regulierte Märkte.' },
      { wert: 4, label: 'Marktsozialismus', beschreibung: 'Genossenschaften konkurrieren auf Märkten. Preise koordinieren.' },
      { wert: 5, label: 'Dezentrale Koordination', beschreibung: 'Keine zentrale Instanz. Freie Vereinbarung zwischen Kommunen.' }
    ]
  },
  { id: 'B2', feld: 'ÖKONOMIE', titel: 'EIGENTUM', kurz: 'Wem gehören die Betriebe?', 
    links: 'Dem Staat', rechts: 'Den Arbeitenden selbst', icon: '🏭',
    programmScore: 3, programmText: 'Staatsbesitz, kommunal, genossenschaftlich – Staat steht vorn',
    stufen: [
      { wert: 1, label: 'Verstaatlichung', beschreibung: 'Produktionsmittel gehören dem Staat.' },
      { wert: 2, label: 'Öffentliches Eigentum', beschreibung: 'Öffentliche Unternehmen mit Mitbestimmung.' },
      { wert: 3, label: 'Gemischtes Eigentum', beschreibung: 'Mix aus öffentlich, genossenschaftlich, klein-privat.' },
      { wert: 4, label: 'Genossenschaften', beschreibung: 'Arbeitende besitzen und kontrollieren ihre Betriebe.' },
      { wert: 5, label: 'Commons', beschreibung: 'Gemeinsam verwaltete Ressourcen ohne Eigentum.' }
    ]
  },
  { id: 'B3', feld: 'ÖKONOMIE', titel: 'ARBEIT', kurz: 'Was ist das Ziel bei Arbeit?', 
    links: 'Produktivität steigern', rechts: 'Arbeit überwinden', icon: '⏰',
    programmScore: 3, programmText: 'Arbeitszeitverkürzung, aber neue Vollbeschäftigung bleibt Ziel',
    stufen: [
      { wert: 1, label: 'Produktivismus', beschreibung: 'Entwicklung der Produktivkräfte als Schlüssel.' },
      { wert: 2, label: 'Gute Arbeit', beschreibung: 'Gut bezahlt, sicher, sinnvoll. Gewerkschaftliche Perspektive.' },
      { wert: 3, label: 'Arbeitszeitverkürzung', beschreibung: 'Radikal kürzere Arbeitszeiten für alle.' },
      { wert: 4, label: 'Care-Revolution', beschreibung: 'Reproduktionsarbeit ins Zentrum. Care sichtbar machen.' },
      { wert: 5, label: 'Post-Work', beschreibung: 'Lohnarbeit überwinden. Automation + Grundeinkommen.' }
    ]
  },

  // FELD C: GESELLSCHAFT (3 Parameter)
  { id: 'C1', feld: 'GESELLSCHAFT', titel: 'FEMINISMUS', kurz: 'Klasse oder Geschlecht zuerst?', 
    links: 'Klasse zuerst', rechts: 'Voll intersektional', icon: '⚧️',
    programmScore: 4, programmText: 'Patriarchat und Kapitalismus verknüpft, aber nicht vollständig intersektional',
    stufen: [
      { wert: 1, label: 'Nebenwiderspruch', beschreibung: 'Geschlecht ist dem Klassenwiderspruch nachgeordnet.' },
      { wert: 2, label: 'Sozialistische Frauenbewegung', beschreibung: 'Frauenbefreiung als Teil des Klassenkampfs.' },
      { wert: 3, label: 'Dual Systems', beschreibung: 'Kapitalismus und Patriarchat als zwei verwobene Systeme.' },
      { wert: 4, label: 'Materialistischer Feminismus', beschreibung: 'Kapitalismus beruht auf unbezahlter Reproduktionsarbeit.' },
      { wert: 5, label: 'Intersektionalität', beschreibung: 'Klasse, Geschlecht, Race, Sexualität zusammendenken.' }
    ]
  },
  { id: 'C2', feld: 'GESELLSCHAFT', titel: 'ÖKOLOGIE', kurz: 'Wie stehen wir zur Natur?', 
    links: 'Ressource für Menschen', rechts: 'Hat Eigenrecht', icon: '🌱',
    programmScore: 3, programmText: 'Bewahrung der Natur als Lebensgrundlage – anthropozentrisch',
    stufen: [
      { wert: 1, label: 'Produktivistisch', beschreibung: 'Natur ist Ressource für Produktivkraftentwicklung.' },
      { wert: 2, label: 'Umweltschutz instrumentell', beschreibung: 'Umweltschutz, weil er für Menschen nützlich ist.' },
      { wert: 3, label: 'Sozial-ökologisch', beschreibung: 'Ökologische und soziale Transformation gehören zusammen.' },
      { wert: 4, label: 'Ökosozialismus', beschreibung: 'Der Stoffwechselriss zwischen Mensch und Natur muss geheilt werden.' },
      { wert: 5, label: 'Rechte der Natur', beschreibung: 'Natur hat eigene Rechte. Buen Vivir, dekoloniale Perspektive.' }
    ]
  },
  { id: 'C3', feld: 'GESELLSCHAFT', titel: 'INTERNATIONAL', kurz: 'National oder global?', 
    links: 'Erst hier, dann dort', rechts: 'Global von Anfang an', icon: '🌐',
    programmScore: 5, programmText: 'Internationale Solidarität und Kooperation durchgehend',
    stufen: [
      { wert: 1, label: 'Sozialismus in einem Land', beschreibung: 'Erst national aufbauen, dann ausweiten.' },
      { wert: 2, label: 'Europäischer Weg', beschreibung: 'EU als Rahmen für Transformation.' },
      { wert: 3, label: 'Internationaler Klassenkampf', beschreibung: 'Arbeiterklasse hat kein Vaterland. Internationale Solidarität.' },
      { wert: 4, label: 'Antiimperialismus', beschreibung: 'Hauptwiderspruch zwischen imperialem Zentrum und Peripherie.' },
      { wert: 5, label: 'Dekoloniale Perspektive', beschreibung: 'Kolonialismus prägt alles. Wissen dekolonisieren.' }
    ]
  },

  // FELD D: KULTUR (3 Parameter)
  { id: 'D1', feld: 'KULTUR', titel: 'UTOPIE', kurz: 'Brauchen wir ein Zukunftsbild?', 
    links: 'Entsteht im Kampf', rechts: 'Konkret ausmalen', icon: '🔮',
    programmScore: 2, programmText: 'Demokratischer Sozialismus als Ziel, aber wenig konkrete Utopie',
    stufen: [
      { wert: 1, label: 'Offene Zukunft', beschreibung: 'Keine Rezepte für die Garküchen der Zukunft.' },
      { wert: 2, label: 'Negative Utopie', beschreibung: 'Wir wissen, was wir nicht wollen. Utopie ex negativo.' },
      { wert: 3, label: 'Prinzip Hoffnung', beschreibung: 'Utopie als Triebkraft. Das Noch-Nicht enthält Möglichkeiten.' },
      { wert: 4, label: 'Reale Utopien', beschreibung: 'Durchdachte Entwürfe. Modelle, die man diskutieren kann.' },
      { wert: 5, label: 'Ausgemalte Utopie', beschreibung: 'Utopien in Literatur, Film, Kunst. Zukunft sinnlich erfahrbar.' }
    ]
  },
  { id: 'D2', feld: 'KULTUR', titel: 'VERÄNDERUNG', kurz: 'Wie verändern wir die Welt?', 
    links: 'Durch Institutionen', rechts: 'Durch Praxis im Jetzt', icon: '🔄',
    programmScore: 2, programmText: 'Institutionen stärken, Rechtsstaat ausbauen',
    stufen: [
      { wert: 1, label: 'Institutionelle Reform', beschreibung: 'Veränderung durch Gesetze, Verordnungen, Reformen.' },
      { wert: 2, label: 'Gegenmacht aufbauen', beschreibung: 'Eigene Institutionen, die zeigen dass es anders geht.' },
      { wert: 3, label: 'Interstitielle Transformation', beschreibung: 'In den Lücken des Systems die neue Gesellschaft aufbauen.' },
      { wert: 4, label: 'Präfigurative Politik', beschreibung: 'Die Mittel müssen den Zielen entsprechen. Hier und jetzt.' },
      { wert: 5, label: 'Exodus', beschreibung: 'Das System verlassen, nicht erobern. Fluchtlinien.' }
    ]
  },
  { id: 'D3', feld: 'KULTUR', titel: 'WELTANSCHAUUNG', kurz: 'Braucht Sozialismus Spiritualität?', 
    links: 'Rein säkular', rechts: 'Offen für Transzendenz', icon: '✨',
    programmScore: 3, programmText: 'Grundsätzlich säkular, religiöse Einflüsse anerkannt',
    stufen: [
      { wert: 1, label: 'Wissenschaftlicher Sozialismus', beschreibung: 'Strikt materialistisch. Keine Religion.' },
      { wert: 2, label: 'Kritische Theorie', beschreibung: 'Auch die Vernunft muss kritisiert werden.' },
      { wert: 3, label: 'Humanistischer Marxismus', beschreibung: 'Entfremdung, Gattungswesen, menschliche Emanzipation.' },
      { wert: 4, label: 'Befreiungstheologie', beschreibung: 'Option für die Armen. Religion und Befreiung zusammen.' },
      { wert: 5, label: 'Spirituelle Linke', beschreibung: 'Transformation braucht auch innere Veränderung.' }
    ]
  },

  // FELD E: PRAXIS (2 Parameter)
  { id: 'E1', feld: 'PRAXIS', titel: 'EBENE', kurz: 'Wo ansetzen?', 
    links: 'Bundespolitik', rechts: 'Lokal + Global', icon: '📍',
    programmScore: 3, programmText: 'Parlamentarisch orientiert, kommunale und EU-Ebene auch wichtig',
    stufen: [
      { wert: 1, label: 'Bundespolitik', beschreibung: 'Die nationale Ebene ist entscheidend. Dort liegt die Macht.' },
      { wert: 2, label: 'Föderalismus', beschreibung: 'Länder und Regionen stärken. Dezentralisierung.' },
      { wert: 3, label: 'Multi-Level', beschreibung: 'Auf allen Ebenen gleichzeitig: lokal, national, europäisch, global.' },
      { wert: 4, label: 'Kommunalismus', beschreibung: 'Die Kommune ist der Ort der Demokratie. Von unten aufbauen.' },
      { wert: 5, label: 'Glokal', beschreibung: 'Nationale Ebene umgehen. Lokale und globale Vernetzung.' }
    ]
  },
  { id: 'E2', feld: 'PRAXIS', titel: 'WISSEN', kurz: 'Wie lernen wir Sozialismus?', 
    links: 'Theorie & Avantgarde', rechts: 'Erfahrung & Basis', icon: '📚',
    programmScore: 3, programmText: 'Politische Bildung wichtig, keine konkrete Pädagogik',
    stufen: [
      { wert: 1, label: 'Wissenschaftliche Führung', beschreibung: 'Theorie geht vor. Intellektuelle entwickeln die Linie.' },
      { wert: 2, label: 'Organische Intellektuelle', beschreibung: 'Intellektuelle aus der Klasse, mit ihr verbunden.' },
      { wert: 3, label: 'Arbeitertradition', beschreibung: 'Erfahrung der Arbeiterbewegung ebenso wichtig wie Theorie.' },
      { wert: 4, label: 'Basiswissen', beschreibung: 'Die Basis weiß am besten, was sie braucht.' },
      { wert: 5, label: 'Situiertes Wissen', beschreibung: 'Alle Erkenntnis ist situiert. Perspektive der Marginalisierten.' }
    ]
  },

  // FELD F: METHODE (2 Parameter) - NEU
  { id: 'F1', feld: 'METHODE', titel: 'TECHNOLOGIE', kurz: 'Welche Rolle spielt Technik?', 
    links: 'Skepsis, Low-Tech', rechts: 'Beschleunigung, High-Tech', icon: '🔧',
    programmScore: 3, programmText: 'Digitalisierung gestalten, keine klare Technikphilosophie',
    stufen: [
      { wert: 1, label: 'Technik-Skepsis', beschreibung: 'Technologie ist Teil des Problems. Einfachheit.' },
      { wert: 2, label: 'Konviviale Technik', beschreibung: 'Werkzeuge, die Menschen ermächtigen, nicht ersetzen.' },
      { wert: 3, label: 'Kritische Aneignung', beschreibung: 'Kapitalistische Technologie kritisch umformen.' },
      { wert: 4, label: 'Left Accelerationism', beschreibung: 'Produktivkräfte entwickeln, um Kapitalismus zu überwinden.' },
      { wert: 5, label: 'FALC', beschreibung: 'Vollautomatisierter Luxuskommunismus. Maschinen befreien.' }
    ]
  },
  { id: 'F2', feld: 'METHODE', titel: 'MITTEL', kurz: 'Wie weit gehen wir?', 
    links: 'Strikt gewaltfrei', rechts: 'Alle Mittel nötig', icon: '⚡',
    programmScore: 2, programmText: 'Implizit gewaltfrei-institutionell, keine Positionierung zu Militanz',
    stufen: [
      { wert: 1, label: 'Strikter Pazifismus', beschreibung: 'Gewalt ist niemals gerechtfertigt.' },
      { wert: 2, label: 'Ziviler Ungehorsam', beschreibung: 'Gewaltfrei, aber illegal. Blockaden, Besetzungen.' },
      { wert: 3, label: 'Vielfalt der Taktiken', beschreibung: 'Verschiedene Taktiken, keine Dogmen.' },
      { wert: 4, label: 'Revolutionäre Gewalt', beschreibung: 'Gegen Systemgewalt ist Gegengewalt legitim.' },
      { wert: 5, label: 'Alle Mittel', beschreibung: 'Im Kampf um Befreiung ist alles erlaubt.' }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// REST DES CODES (Layer 1 Parameter, UI-Komponenten, etc.)
// Hier würde der restliche Code aus der originalen app.js folgen
// ═══════════════════════════════════════════════════════════════════════════

// Export für Tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOZIALISMUS_ENGINE, PARAMETER_L2_BASE, WESEN_INTEGRATION };
}
