// ═══════════════════════════════════════════════════════════════════════════
// SOZIALISMUS-GENERATOR V3.1 - Mosaik + Modal Overlay
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

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_API_KEY = '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';

// ═══════════════════════════════════════════════════════════════════════════
// BASIS-PARAMETER
// ═══════════════════════════════════════════════════════════════════════════

const PARAMETER_L1_BASE = [
  { id: 1, titel: 'EIGENTUM', kurz: 'Wem gehört die Wirtschaft?', links: 'Privat', rechts: 'Gemeinsam', icon: '🏭',
    gegenargument: 'Konzerne schreiben heute die Gesetze, die sie regulieren sollen.' },
  { id: 2, titel: 'PLANUNG', kurz: 'Wer entscheidet, was produziert wird?', links: 'Der Markt', rechts: 'Wir alle', icon: '📊',
    gegenargument: 'Der Markt produziert Luxusautos, während Menschen obdachlos sind.' },
  { id: 3, titel: 'WACHSTUM', kurz: 'Brauchen wir immer mehr?', links: 'Ja, mit Technik', rechts: 'Nein, genug ist genug', icon: '📈',
    gegenargument: 'Unendliches Wachstum auf einem endlichen Planeten ist unmöglich.' },
  { id: 4, titel: 'ARBEIT', kurz: 'Was bedeutet Arbeit für dich?', links: 'Pflicht & Sinn', rechts: 'Nur ein Teil des Lebens', icon: '⚙️',
    gegenargument: 'Warum ist nur "Arbeit", was bezahlt wird?' },
  { id: 5, titel: 'EINKOMMEN', kurz: 'Wovon sollen Menschen leben?', links: 'Von Leistung', rechts: 'Bedingungslos', icon: '💰',
    gegenargument: 'Wer erbt, leistet nichts. Das Leistungsprinzip ist eine Lüge.' },
  { id: 6, titel: 'STAAT', kurz: 'Wie viel Staat brauchen wir?', links: 'So wenig wie möglich', rechts: 'Aktiv gestaltend', icon: '🏛️',
    gegenargument: 'Der "schlanke Staat" heißt: Die Armen bleiben allein.' },
  { id: 7, titel: 'DEMOKRATIE', kurz: 'Wo darfst du mitbestimmen?', links: 'Bei Wahlen reicht', rechts: 'Überall, auch im Job', icon: '🗳️',
    gegenargument: 'Demokratie endet nicht am Werkstor.' },
  { id: 8, titel: 'KLASSE', kurz: 'Gibt es oben und unten?', links: 'Nein, jeder kann aufsteigen', rechts: 'Ja, das System teilt', icon: '📶',
    gegenargument: 'Wer arm geboren wird, stirbt arm.' },
  { id: 9, titel: 'GESCHLECHT', kurz: 'Woher kommen Geschlechterrollen?', links: 'Biologie', rechts: 'Gesellschaft', icon: '⚧️',
    gegenargument: 'Frauen verdienen weniger, machen mehr unbezahlte Arbeit. Das ist System.' },
  { id: 10, titel: 'MIGRATION', kurz: 'Wie offen sollen Grenzen sein?', links: 'Geschlossen', rechts: 'Offen', icon: '🌍',
    gegenargument: 'Die Festung Europa tötet.' },
  { id: 11, titel: 'FRIEDEN', kurz: 'Wie entsteht Sicherheit?', links: 'Durch Stärke', rechts: 'Durch Abrüstung', icon: '☮️',
    gegenargument: 'Jeder Krieg wurde als "Verteidigung" verkauft.' },
  { id: 12, titel: 'EUROPA', kurz: 'Wie stehst du zur EU?', links: 'Weniger EU', rechts: 'Demokratischere EU', icon: '🇪🇺',
    gegenargument: 'Die Alternative zum EU-Elitenprojekt ist Demokratie jenseits der Grenzen.' },
  { id: 13, titel: 'KLIMA', kurz: 'Wie lösen wir die Klimakrise?', links: 'Der Markt regelt', rechts: 'Systemwandel nötig', icon: '🔥',
    gegenargument: 'Klimakrise ist kein Marktversagen – es ist das System.' },
  { id: 14, titel: 'WANDEL', kurz: 'Wie schnell muss sich etwas ändern?', links: 'Langsam, behutsam', rechts: 'Grundlegend, jetzt', icon: '⚡',
    gegenargument: 'Alles Erkämpfte wird seit 40 Jahren abgebaut.' },
  { id: 15, titel: 'PARTEI', kurz: 'Braucht es eine linke Partei?', links: 'Eher nicht', rechts: 'Unbedingt', icon: '✊',
    gegenargument: 'Die Linke ist die einzige Partei, die die Eigentumsfrage stellt.' },
  { id: 16, titel: 'FREIHEIT', kurz: 'Was bedeutet Freiheit?', links: 'In Ruhe gelassen werden', rechts: 'Gemeinsam frei sein', icon: '🕊️',
    gegenargument: 'Echte Freiheit braucht materielle Grundlagen.' },
  { id: 17, titel: 'SOLIDARITÄT', kurz: 'Wem gegenüber solidarisch?', links: 'Den Nächsten', rechts: 'Allen Menschen', icon: '🤝',
    gegenargument: 'Solidarität ist unteilbar, oder sie ist keine.' },
];

const PARAMETER_L2_BASE = [
  { id: 'A1', feld: 'STRATEGIE', titel: 'WEG', kurz: 'Reform oder Revolution?', links: 'Schrittweise Reform', rechts: 'Radikaler Bruch', icon: '🛤️' },
  { id: 'A2', feld: 'STRATEGIE', titel: 'SUBJEKT', kurz: 'Wer macht die Veränderung?', links: 'Die Arbeiterklasse', rechts: 'Alle Unterdrückten', icon: '👥' },
  { id: 'A3', feld: 'STRATEGIE', titel: 'STAAT', kurz: 'Was tun mit dem Staat?', links: 'Übernehmen & nutzen', rechts: 'Langfristig überwinden', icon: '🏛️' },
  { id: 'B1', feld: 'ÖKONOMIE', titel: 'KOORDINATION', kurz: 'Wie organisieren wir Wirtschaft?', links: 'Sozialer Markt', rechts: 'Demokratischer Plan', icon: '🔄' },
  { id: 'B2', feld: 'ÖKONOMIE', titel: 'BESITZ', kurz: 'Wem gehören die Betriebe?', links: 'Dem Staat', rechts: 'Den Arbeitenden selbst', icon: '🏭' },
  { id: 'B3', feld: 'ÖKONOMIE', titel: 'ARBEIT', kurz: 'Was ist das Ziel bei Arbeit?', links: 'Befreite, sinnvolle Arbeit', rechts: 'Weniger Arbeit für alle', icon: '⏰' },
  { id: 'C1', feld: 'GESELLSCHAFT', titel: 'FEMINISMUS', kurz: 'Klasse oder Geschlecht zuerst?', links: 'Klasse zuerst', rechts: 'Untrennbar verbunden', icon: '⚧️' },
  { id: 'C2', feld: 'GESELLSCHAFT', titel: 'NATUR', kurz: 'Wie stehen wir zur Natur?', links: 'Ressource für Menschen', rechts: 'Hat Eigenrecht', icon: '🌱' },
  { id: 'C3', feld: 'GESELLSCHAFT', titel: 'GLOBAL', kurz: 'National oder international?', links: 'Erst hier, dann dort', rechts: 'Global von Anfang an', icon: '🌐' },
  { id: 'D1', feld: 'KULTUR', titel: 'UTOPIE', kurz: 'Brauchen wir ein Zukunftsbild?', links: 'Entsteht im Kampf', rechts: 'Konkret ausmalen', icon: '🔮' },
  { id: 'D2', feld: 'KULTUR', titel: 'KONFLIKT', kurz: 'Wie gehen wir mit Konflikten um?', links: 'Institutionen schaffen', rechts: 'Ständige Transformation', icon: '⚔️' },
  { id: 'D3', feld: 'KULTUR', titel: 'SINN', kurz: 'Braucht Sozialismus Spiritualität?', links: 'Rein säkular', rechts: 'Offen für Transzendenz', icon: '✨' },
  { id: 'E1', feld: 'PRAXIS', titel: 'BÜNDNIS', kurz: 'Mit wem zusammenarbeiten?', links: 'Arbeiterklasse vereinen', rechts: 'Bewegungen vernetzen', icon: '🤝' },
  { id: 'E2', feld: 'PRAXIS', titel: 'EBENE', kurz: 'Wo ansetzen?', links: 'Bundespolitik', rechts: 'Lokal + Global', icon: '📍' },
  { id: 'E3', feld: 'PRAXIS', titel: 'BILDUNG', kurz: 'Wie lernen wir Sozialismus?', links: 'Aufklärung & Theorie', rechts: 'Gemeinsame Erfahrung', icon: '📚' },
];

// ═══════════════════════════════════════════════════════════════════════════
// GROQ API
// ═══════════════════════════════════════════════════════════════════════════

const analyzeWithGroq = async (antworten, params, apiKey, analyseTyp) => {
  if (!apiKey) return null;
  
  const profilText = params.map(p => {
    const wert = antworten[p.id];
    const stufe = p.stufen?.find(s => s.wert === wert);
    return `${p.titel} (${p.kurz}): ${wert}/5 - "${stufe?.label || ''}"`;
  }).join('\n');

  let prompt = '';
  
  if (analyseTyp === 'layer1') {
    // Zähle links/mitte/rechts für Kontext
    const linksCount = Object.values(antworten).filter(v => v >= 4).length;
    const mitteCount = Object.values(antworten).filter(v => v === 3).length;
    const rechtsCount = Object.values(antworten).filter(v => v <= 2).length;
    
    prompt = `Analysiere dieses politische Profil für Die Linke. DU-FORM.

PROFIL:
${profilText}

STATS: ${linksCount} links, ${mitteCount} mitte, ${rechtsCount} rechts

JSON-Antwort:
{
  "titel": "Max 5 Wörter",
  "links_score": "sehr links" oder "links" oder "mitte-links" oder "mitte" oder "eher rechts",
  "abgrenzung_spd_gruene": "NUR wenn mitte-links/mitte/eher rechts: 3-4 Sätze warum Die Linke besser als SPD/Grüne ist. Beziehe dich auf KONKRETE Parameter des Profils. Bei sehr links/links: null"
}

Für abgrenzung_spd_gruene:
- SPD: Macht Sozialabbau mit, stellt nie Eigentumsfrage, Hartz IV
- Grüne: Kriegspartei, CO2-Preis statt Systemwandel, keine Klassenpolitik
- Sei konkret bezogen auf die Werte im Profil!

NUR JSON.`;
  } else if (analyseTyp === 'layer2') {
    prompt = `Du analysierst einen Sozialismus-Typ. Schreibe in DU-FORM.

PROFIL:
${profilText}

Antworte als JSON:
{
  "archetyp": "Name für deinen Sozialismus (z.B. Libertärer Ökosozialismus, Rätedemokratischer Kommunismus)",
  "beschreibung": "2-3 Sätze in Du-Form (z.B. 'Du verbindest... mit...')",
  "theoretiker": ["Denker*in 1 (Schlagwort)", "Denker*in 2 (Schlagwort)"],
  "staerken": ["Stärke deines Ansatzes 1", "Stärke 2"],
  "spannungen": ["Interne Spannung/Herausforderung 1", "Spannung 2"],
  "slogan": "Dein Slogan (max 6 Wörter)"
}

NUR valides JSON.`;
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

    const data = await response.json();
    console.log('Groq Response:', data); // Debug
    
    if (data.error) {
      console.error('Groq API Error:', data.error);
      return null;
    }
    
    const text = data.choices?.[0]?.message?.content || '';
    console.log('Raw text:', text.substring(0, 200)); // Debug
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, jsonMatch[0].substring(0, 200));
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('Groq Fetch Fehler:', error);
    return null;
  }
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
    return { ...p, frage: detail.frage || p.kurz, stufen: detail.stufen || [] };
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
        <span>{parameter.links}</span>
        <span>{parameter.rechts}</span>
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
              ALLTAGSBEISPIEL
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

// Analyse-Anzeige
const AnalyseBox = ({ analyse, typ, antworten, params, onGenerateAntrag, showAntragButton }) => {
  if (!analyse) return <div style={{ textAlign: 'center', color: COLORS.grau }}>Analyse konnte nicht geladen werden.</div>;
  
  if (typ === 'layer1') {
    // Parameter-Bewertung im Frontend berechnen
    const paramBewertung = params ? params.map(p => {
      const wert = antworten?.[p.id] || 3;
      let status = 'gelb';
      if (wert >= 4) status = 'gruen';
      else if (wert <= 2) status = 'rot';
      return { id: p.id, name: p.titel, wert, status, kurz: p.kurz };
    }) : [];
    
    const gruen = paramBewertung.filter(p => p.status === 'gruen');
    const nichtGruen = paramBewertung.filter(p => p.status !== 'gruen');
    
    // Prüfen ob Abgrenzungs-Box gezeigt werden soll
    const zeigeAbgrenzung = analyse.abgrenzung_spd_gruene && 
      ['mitte-links', 'mitte', 'eher rechts'].includes(analyse.links_score);
    
    return (
      <div className="fade-in">
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
          
          {/* GEMEINSAM - Grüne Badges */}
          {gruen.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div className="label" style={{ color: COLORS.gruen, marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                ✓ GEMEINSAM MIT DER LINKEN
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {gruen.map((p, i) => (
                  <div key={i} style={{ 
                    padding: '0.35rem 0.6rem',
                    background: COLORS.gruen,
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* GESPRÄCHSSTOFF - Orange/Rote Badges */}
          {nichtGruen.length > 0 && (
            <div>
              <div className="label" style={{ color: COLORS.orange, marginBottom: '0.5rem', fontSize: '0.7rem' }}>
                ⚡ GESPRÄCHSSTOFF
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {nichtGruen.map((p, i) => (
                  <div key={i} style={{ 
                    padding: '0.35rem 0.6rem',
                    background: p.status === 'gelb' ? COLORS.orange : '#E53935',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Abgrenzung SPD/Grüne - NUR bei Mitte-Links bis Rechts */}
        {zeigeAbgrenzung && (
          <div className="card" style={{ background: COLORS.schwarz, color: COLORS.weiss }}>
            <div className="card-body">
              <div className="label" style={{ marginBottom: '0.75rem' }}>
                💡 WARUM NICHT SPD ODER GRÜNE?
              </div>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{analyse.abgrenzung_spd_gruene}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (typ === 'layer2') {
    return (
      <div className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem', color: COLORS.weiss }}>{analyse.archetyp || 'Dein Sozialismus'}</h2>
          {analyse.slogan && <div style={{ fontSize: '1.1rem', color: '#AAA', fontStyle: 'italic' }}>„{analyse.slogan}"</div>}
        </div>
        
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-body">
            <p style={{ margin: 0, lineHeight: 1.6 }}>{analyse.beschreibung}</p>
          </div>
        </div>
        
        {analyse.theoretiker?.length > 0 && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body">
              <div className="label" style={{ marginBottom: '0.5rem' }}>DEINE DENKER*INNEN</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {analyse.theoretiker.map((t, i) => {
                  // Name extrahieren (vor Klammer oder Komma)
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
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                <div className="label" style={{ color: COLORS.orange, marginBottom: '0.5rem' }}>DEINE HERAUSFORDERUNGEN</div>
                {analyse.spannungen.map((s, i) => <p key={i} style={{ margin: '0 0 0.25rem', fontSize: '0.9rem' }}>• {s}</p>)}
              </div>
            </div>
          )}
        </div>
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
        
        {/* Einladung mit Antrags-Button - NUR bei radikaler */}
        {analyse.verhältnis === 'radikaler' && analyse.einladung && (
          <div className="card" style={{ background: COLORS.rot, color: COLORS.weiss }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ margin: showAntragButton ? '0 0 1rem' : 0, fontSize: '1.1rem', lineHeight: 1.5 }}>{analyse.einladung}</p>
              {showAntragButton && onGenerateAntrag && (
                <button
                  onClick={onGenerateAntrag}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    background: 'rgba(255,255,255,0.25)', 
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: '8px', 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.25)';
                  }}
                >
                  ✍️ Antrag generieren
                </button>
              )}
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

const Layer1 = ({ params, onComplete, apiKey }) => {
  const [antworten, setAntworten] = useState(() => {
    const init = {};
    params.forEach(p => { init[p.id] = 3; });
    return init;
  });
  const [expanded, setExpanded] = useState(null);
  const [phase, setPhase] = useState('intro');
  const [analyse, setAnalyse] = useState(null);
  const [loading, setLoading] = useState(false);

  const startAnalyse = async () => {
    setPhase('analyse');
    setLoading(true);
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
          17 Fragen zu deinen politischen Überzeugungen.<br/>
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

const Layer2 = ({ params, onComplete, onBack, apiKey }) => {
  const [antworten, setAntworten] = useState(() => {
    const init = {};
    params.forEach(p => { init[p.id] = 3; });
    return init;
  });
  const [expanded, setExpanded] = useState(null);
  const [phase, setPhase] = useState('intro');
  const [analyse, setAnalyse] = useState(null);
  const [loading, setLoading] = useState(false);

  const startAnalyse = async () => {
    setPhase('analyse');
    setLoading(true);
    const result = await analyzeWithGroq(antworten, params, apiKey, 'layer2');
    setAnalyse(result);
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
          15 theoretische Fragen in 5 Feldern.<br/>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
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
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setPhase('fragen')} className="btn btn-secondary" style={{ color: '#AAA', borderColor: '#666' }}>← Anpassen</button>
                <button onClick={() => onComplete(antworten)} className="btn btn-primary btn-large" style={{ flex: 1 }}>
                  Weiter: Parteiprogramm →
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

// Antrags-Generator Funktion
const generateAntrag = async (analyse, apiKey) => {
  const spannungen = analyse.spannungsfelder || [];
  const themen = spannungen.map(s => `${s.thema}: ${s.deine_position} (Programm: ${s.programm_position})`).join('\n');
  
  const prompt = `Du bist ein erfahrener Parteitagsdelegierter der Linken. Erstelle eine Argumentationsskizze für einen Antrag zur Programmänderung.

SPANNUNGSFELDER zwischen Nutzerprofil und Erfurter Programm:
${themen}

PROGRAMM-KRITIK: ${analyse.programm_kritik || 'Das Programm ist in vielen Punkten strukturkonservativ.'}

Erstelle eine Argumentationsskizze mit:

1. ANTRAGSTITEL
Ein prägnanter Titel für den Änderungsantrag

2. ANTRAGSTELLER*IN
[Platzhalter: Name, Kreisverband]

3. PROBLEMANALYSE (3-4 Sätze)
Was fehlt im aktuellen Programm? Warum ist das ein Problem?

4. FORDERUNG (konkret formuliert)
Was soll ins Programm aufgenommen/geändert werden?

5. BEGRÜNDUNG (5-6 Punkte)
- Theoretische Argumente
- Praktische Beispiele
- Bezug zu linken Traditionen
- Aktualität/Notwendigkeit
- Verbindung zu anderen Programmteilen

6. MÖGLICHE GEGENARGUMENTE & ENTKRÄFTUNG
2-3 erwartbare Einwände und wie man ihnen begegnet

7. UNTERSTÜTZER*INNEN GEWINNEN
Welche AGs, Strömungen, Personen könnten diesen Antrag unterstützen?

Schreibe als durchformulierte Skizze, die die Antragsteller*in selbst weiter ausarbeiten kann.
Bleibe sachlich, aber überzeugend. Keine JSON-Formatierung, sondern lesbarer Text mit klaren Überschriften.`;

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

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Fehler bei der Generierung.';
  } catch (error) {
    console.error('Antrag-Generator Fehler:', error);
    return 'Fehler bei der Generierung. Bitte versuche es erneut.';
  }
};

// Download als TXT
const downloadAsTxt = (text, filename) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const Layer3 = ({ profilL1, profilL2, onBack, apiKey, paramsL1, paramsL2 }) => {
  const [analyse, setAnalyse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [antrag, setAntrag] = useState(null);
  const [antragLoading, setAntragLoading] = useState(false);
  const [showAntrag, setShowAntrag] = useState(false);

  useEffect(() => {
    const run = async () => {
      const kombiniert = { ...profilL1, ...profilL2 };
      const allParams = [...paramsL1, ...paramsL2];
      const result = await analyzeWithGroq(kombiniert, allParams, apiKey, 'layer3');
      setAnalyse(result);
      setLoading(false);
    };
    run();
  }, [profilL1, profilL2, apiKey, paramsL1, paramsL2]);

  const handleGenerateAntrag = async () => {
    setAntragLoading(true);
    setShowAntrag(true);
    const result = await generateAntrag(analyse, apiKey);
    setAntrag(result);
    setAntragLoading(false);
  };

  const handleDownload = () => {
    if (antrag) {
      const datum = new Date().toISOString().split('T')[0];
      downloadAsTxt(antrag, `Programmantrag_${datum}.txt`);
    }
  };

  return (
    <div className="dark" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="label">LAYER 3: PARTEIPROGRAMM-CHECK</div>
          <h1 style={{ color: COLORS.weiss, marginTop: '0.5rem' }}>Du & Die Linke</h1>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: '#AAA' }}>Vergleiche mit Parteiprogramm...</p>
          </div>
        ) : (
          <>
            <AnalyseBox 
              analyse={analyse} 
              typ="layer3" 
              onGenerateAntrag={handleGenerateAntrag}
              showAntragButton={analyse?.verhältnis === 'radikaler' && analyse?.spannungsfelder?.length > 0 && !showAntrag}
            />}
            
            {/* Antrags-Anzeige */}
            {showAntrag && (
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="label">DEINE ANTRAGSSKIZZE</div>
                    {antrag && !antragLoading && (
                      <button 
                        onClick={handleDownload}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      >
                        📥 Als TXT speichern
                      </button>
                    )}
                  </div>
                  
                  {antragLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                      <p style={{ color: '#AAA' }}>KI schreibt Antragsskizze...</p>
                    </div>
                  ) : (
                    <div style={{ 
                      background: '#1A1A1A', 
                      padding: '1.5rem', 
                      borderRadius: '8px',
                      maxHeight: '500px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      color: '#DDD'
                    }}>
                      {antrag}
                    </div>
                  )}
                  
                  <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '1rem', marginBottom: 0 }}>
                    💡 Dies ist eine Skizze. Formuliere sie in deinen eigenen Worten aus und reiche sie bei deinem Kreisverband oder auf dem Parteitag ein.
                  </p>
                </div>
              </div>
            )}
            
            <button onClick={onBack} className="btn btn-secondary btn-block" style={{ marginTop: '2rem', color: '#AAA', borderColor: '#666' }}>
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

const Layer0 = ({ onStart }) => {
  const [showInfo, setShowInfo] = useState(false);
  
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
        
        {/* Titel - Bauhaus-Stil */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-block',
            background: COLORS.rot,
            color: 'white',
            padding: '0.5rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}>
            Die Linke
          </span>
        </div>
        
        <h1 style={{
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          fontWeight: 900,
          color: COLORS.schwarz,
          margin: '0 0 0.5rem',
          lineHeight: 0.95,
          letterSpacing: '-0.03em'
        }}>
          SOZIALISMUS
        </h1>
        
        <h2 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 300,
          color: COLORS.rot,
          margin: '0 0 2rem',
          letterSpacing: '0.1em'
        }}>
          GENERATOR
        </h2>
        
        {/* Untertitel */}
        <p style={{
          fontSize: '1.1rem',
          color: COLORS.grau,
          maxWidth: '500px',
          margin: '0 auto 3rem',
          lineHeight: 1.6
        }}>
          Finde heraus, wie links du bist,<br/>
          welcher Sozialismus zu dir passt<br/>
          und wo du über das Parteiprogramm hinausgehst.
        </p>
        
        {/* Start-Button */}
        <button
          onClick={onStart}
          style={{
            padding: '1.25rem 3rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            background: COLORS.schwarz,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = COLORS.rot;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = COLORS.schwarz;
          }}
        >
          Starten →
        </button>
        
        {/* 3 Layer Vorschau */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '4rem',
          flexWrap: 'wrap'
        }}>
          {[
            { num: '01', title: 'Wie links?', color: COLORS.rot },
            { num: '02', title: 'Welcher Sozialismus?', color: COLORS.schwarz },
            { num: '03', title: 'Parteiprogramm-Check', color: COLORS.grau }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: item.color,
                lineHeight: 1
              }}>
                {item.num}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: COLORS.grau,
                letterSpacing: '0.05em',
                marginTop: '0.25rem'
              }}>
                {item.title}
              </div>
            </div>
          ))}
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
                color: COLORS.grau
              }}
            >
              ×
            </button>
            
            <h3 style={{ 
              margin: '0 0 1.5rem', 
              color: COLORS.schwarz,
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              Über dieses Projekt
            </h3>
            
            <p style={{ 
              margin: '0 0 1rem', 
              lineHeight: 1.7,
              color: COLORS.schwarz
            }}>
              Der <strong>Sozialismus-Generator</strong> ist ein interaktives Tool, 
              um politische Positionen spielerisch zu erkunden und mit dem 
              Programm der Linken zu vergleichen.
            </p>
            
            <p style={{ 
              margin: '0 0 1.5rem', 
              lineHeight: 1.7,
              color: COLORS.schwarz
            }}>
              Erstellt von <strong>Demien Bartók</strong> (Halle/Saale) unter 
              Verwendung der KIs <strong>Claude</strong> (Anthropic), 
              <strong> Gemini</strong> (Google) und <strong>Groq</strong>.
            </p>
            
            <div style={{
              background: '#FFF3E0',
              padding: '1rem',
              borderLeft: `4px solid ${COLORS.orange}`,
              fontSize: '0.85rem',
              lineHeight: 1.6
            }}>
              <strong>Hinweis:</strong> Groq ist ein KI-Infrastruktur-Unternehmen 
              und hat <em>nichts</em> mit Elon Musks „Grok" zu tun. 
              Groq ≠ Grok!
            </div>
            
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: `1px solid ${COLORS.grau}30`,
              fontSize: '0.8rem',
              color: COLORS.grau
            }}>
              Die Linke · Kreisverband Halle · 2025
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════

const App = () => {
  const [layer, setLayer] = useState(0);
  const [profilL1, setProfilL1] = useState(null);
  const [profilL2, setProfilL2] = useState(null);
  const [detailsL1, setDetailsL1] = useState(null);
  const [detailsL2, setDetailsL2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiKey] = useState(DEFAULT_API_KEY);

  useEffect(() => {
    Promise.all([
      fetch('data/layer1.json').then(r => r.json()).catch(() => null),
      fetch('data/layer2.json').then(r => r.json()).catch(() => null)
    ]).then(([l1, l2]) => {
      setDetailsL1(l1);
      setDetailsL2(l2);
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

  if (layer === 0) {
    return <Layer0 onStart={() => setLayer(1)} />;
  }

  if (layer === 1) {
    return <Layer1 params={paramsL1} onComplete={(p) => { setProfilL1(p); setLayer(2); }} apiKey={apiKey} />;
  }

  if (layer === 2) {
    return <Layer2 params={paramsL2} onComplete={(p) => { setProfilL2(p); setLayer(3); }} onBack={() => setLayer(1)} apiKey={apiKey} />;
  }

  if (layer === 3) {
    return <Layer3 profilL1={profilL1} profilL2={profilL2} onBack={() => { setLayer(0); setProfilL1(null); setProfilL2(null); }} apiKey={apiKey} paramsL1={paramsL1} paramsL2={paramsL2} />;
  }

  return null;
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
