// ═══════════════════════════════════════════════════════════════════════════
// MEDIATHEK für Das Linke Wesen
// 232 Medien (Bücher, Filme, Serien) organisiert nach Archetypen & Themen
// ═══════════════════════════════════════════════════════════════════════════

let mediathekData = null;
let mediathekLoaded = false;

// ═══════════════════════════════════════════════════════════════════════════
// MEDIATHEK LADEN
// ═══════════════════════════════════════════════════════════════════════════

async function loadMediathek() {
  if (mediathekLoaded) return;
  
  try {
    console.log('📚 Lade Mediathek...');
    const response = await fetch('data/mediathek.json');
    mediathekData = await response.json();
    mediathekLoaded = true;
    console.log('✅ Mediathek geladen:', mediathekData.medien.length, 'Medien');
  } catch (error) {
    console.error('❌ Fehler beim Laden der Mediathek:', error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MEDIATHEK INITIALISIEREN
// ═══════════════════════════════════════════════════════════════════════════

async function initMediathek() {
  console.log('📚 Initialisiere Mediathek...');
  
  // Daten laden falls nötig
  if (!mediathekLoaded) {
    await loadMediathek();
  }
  
  if (!mediathekData) {
    const container = document.getElementById('mediathek-container');
    container.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <h2>❌ Fehler</h2>
        <p>Mediathek-Daten konnten nicht geladen werden.</p>
      </div>
    `;
    return;
  }
  
  // Container vorbereiten
  const container = document.getElementById('mediathek-container');
  container.innerHTML = '';
  container.style.padding = '2rem';
  container.style.overflow = 'auto';
  container.style.height = '100vh';
  
  // Header
  const header = document.createElement('div');
  header.style.marginBottom = '2rem';
  header.innerHTML = `
    <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">📚 Die Mediathek</h1>
    <p style="color: var(--text-secondary); max-width: 800px;">
      ${mediathekData.medien.length} Bücher, Filme und Serien – kuratiert, sortiert nach Archetypen und Schwierigkeitsgrad.
    </p>
  `;
  container.appendChild(header);
  
  // Typ-Icons
  const typIcons = {
    'buch': '📖',
    'film': '🎬',
    'serie': '📺'
  };
  
  // Medien nach Typ gruppieren
  const medienNachTyp = {
    'buch': [],
    'film': [],
    'serie': []
  };
  
  mediathekData.medien.forEach(medium => {
    const typ = medium.typ || 'buch';
    if (medienNachTyp[typ]) {
      medienNachTyp[typ].push(medium);
    }
  });
  
  // Für jeden Typ: Sektion erstellen
  Object.entries(medienNachTyp).forEach(([typ, medien]) => {
    if (medien.length === 0) return;
    
    const section = document.createElement('div');
    section.style.marginBottom = '3rem';
    
    const sectionHeader = document.createElement('h2');
    sectionHeader.style.fontSize = '1.5rem';
    sectionHeader.style.marginBottom = '1rem';
    sectionHeader.style.display = 'flex';
    sectionHeader.style.alignItems = 'center';
    sectionHeader.style.gap = '0.5rem';
    sectionHeader.innerHTML = `
      <span>${typIcons[typ]}</span>
      <span>${typ.charAt(0).toUpperCase() + typ.slice(1)}${typ === 'buch' ? 'ücher' : (typ === 'film' ? 'e' : 'n')}</span>
      <span style="color: var(--text-muted); font-size: 1rem;">(${medien.length})</span>
    `;
    section.appendChild(sectionHeader);
    
    // Grid für Medien
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    grid.style.gap = '1rem';
    
    medien.forEach(medium => {
      const card = createMediumCard(medium);
      grid.appendChild(card);
    });
    
    section.appendChild(grid);
    container.appendChild(section);
  });
  
  console.log('✅ Mediathek gerendert');
}

// ═══════════════════════════════════════════════════════════════════════════
// MEDIUM CARD ERSTELLEN
// ═══════════════════════════════════════════════════════════════════════════

function createMediumCard(medium) {
  const card = document.createElement('div');
  card.style.background = 'var(--bg-secondary)';
  card.style.border = '1px solid var(--border)';
  card.style.borderRadius = 'var(--radius)';
  card.style.padding = '1rem';
  card.style.transition = 'transform 0.2s, box-shadow 0.2s';
  card.style.cursor = 'pointer';
  
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-2px)';
    card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'none';
  });
  
  // Typ-Icon
  const typIcons = {
    'buch': '📖',
    'film': '🎬',
    'serie': '📺'
  };
  
  const icon = typIcons[medium.typ] || '📄';
  
  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
      <div style="font-size: 1.5rem;">${icon}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted);">${medium.jahr || '?'}</div>
    </div>
    <h3 style="font-size: 1rem; margin-bottom: 0.25rem; color: var(--text-primary);">
      ${medium.titel}
    </h3>
    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
      ${medium.autor}
    </div>
    <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
      ${medium.essenz ? medium.essenz.substring(0, 150) + '...' : 'Keine Beschreibung verfügbar'}
    </div>
  `;
  
  return card;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-LOAD beim Laden der Seite
// ═══════════════════════════════════════════════════════════════════════════

// Daten im Hintergrund vorladen (nicht blockierend)
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadMediathek, 1000);
  });
}
