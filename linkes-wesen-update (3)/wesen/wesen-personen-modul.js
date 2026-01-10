// ═══════════════════════════════════════════════════════════════════════════
// WESEN: Personen-Anzeige Modul
// Zeigt Bewohner*innen eines Knotens an
// ═══════════════════════════════════════════════════════════════════════════

// Personen für einen Knoten laden (aus personen.json oder inline)
async function getPersonenFuerKnoten(knotenId) {
  // Falls PERSONEN_DATA global geladen ist:
  if (typeof PERSONEN_DATA !== 'undefined') {
    return PERSONEN_DATA.personen.filter(p => 
      p.hauptzimmer.includes(knotenId) || p.besucht?.includes(knotenId)
    );
  }
  
  // Sonst aus Datei laden
  try {
    const response = await fetch('./data/personen.json');
    const data = await response.json();
    return data.personen.filter(p => 
      p.hauptzimmer.includes(knotenId) || p.besucht?.includes(knotenId)
    );
  } catch (e) {
    console.warn('Personen-Daten nicht geladen:', e);
    return [];
  }
}

// Personen-Liste HTML generieren
function renderPersonenListe(personen, knotenId) {
  if (personen.length === 0) {
    return '<p class="keine-bewohner">Noch keine Bewohner*innen erfasst.</p>';
  }
  
  return `
    <div class="bewohner-liste">
      ${personen.map(p => `
        <div class="bewohner-card ${p.hauptzimmer.includes(knotenId) ? 'hauptbewohner' : 'besucher'}" 
             onclick="zeigePersonDetail('${p.id}')">
          <div class="bewohner-avatar">${p.name.charAt(0)}</div>
          <div class="bewohner-info">
            <span class="bewohner-name">${p.name}</span>
            <span class="bewohner-leben">${p.lebensdaten}</span>
          </div>
          ${p.hauptzimmer.includes(knotenId) ? '<span class="bewohner-badge">🏠</span>' : '<span class="bewohner-badge">👋</span>'}
        </div>
      `).join('')}
    </div>
  `;
}

// Person Detail Modal
async function zeigePersonDetail(personId) {
  let person;
  
  if (typeof PERSONEN_DATA !== 'undefined') {
    person = PERSONEN_DATA.personen.find(p => p.id === personId);
  } else {
    try {
      const response = await fetch('./data/personen.json');
      const data = await response.json();
      person = data.personen.find(p => p.id === personId);
    } catch (e) {
      console.error('Konnte Person nicht laden:', e);
      return;
    }
  }
  
  if (!person) return;
  
  const modal = document.createElement('div');
  modal.className = 'person-detail-modal';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = `
    <div class="person-detail-content">
      <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      
      <div class="person-header">
        <div class="person-avatar-large">${person.name.charAt(0)}</div>
        <div>
          <h2>${person.name}</h2>
          <p class="person-leben">${person.lebensdaten}</p>
        </div>
      </div>
      
      <p class="person-bio">${person.kurzbio}</p>
      
      ${person.hauptwerke?.length > 0 ? `
        <div class="person-section">
          <h3>📚 Hauptwerke</h3>
          <ul>
            ${person.hauptwerke.map(w => `<li>${w.titel} (${w.jahr})</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${person.zitate?.length > 0 ? `
        <div class="person-section">
          <h3>💬 Zitate</h3>
          ${person.zitate.map(z => `
            <blockquote>
              „${z.text}"
              ${z.quelle ? `<cite>— ${z.quelle}${z.jahr ? ` (${z.jahr})` : ''}</cite>` : ''}
            </blockquote>
          `).join('')}
        </div>
      ` : ''}
      
      ${person.hauptzimmer?.length > 0 ? `
        <div class="person-section">
          <h3>🏠 Positionen</h3>
          <div class="position-tags">
            ${person.hauptzimmer.map(k => `
              <span class="position-tag" onclick="navigateToKnoten('${k}')">${k}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${person.beziehungen?.length > 0 ? `
        <div class="person-section">
          <h3>🔗 Beziehungen</h3>
          <div class="beziehungen-liste">
            ${person.beziehungen.map(b => `
              <div class="beziehung">
                <span class="beziehung-typ beziehung-${b.typ}">${b.typ}</span>
                <span class="beziehung-zu" onclick="zeigePersonDetail('${b.zu}')">${b.zu}</span>
                <span class="beziehung-beschreibung">${b.beschreibung}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${person.wiki ? `
        <a href="https://de.wikipedia.org/wiki/${person.wiki}" target="_blank" class="wiki-link">
          Wikipedia →
        </a>
      ` : ''}
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Zu Knoten navigieren
function navigateToKnoten(knotenId) {
  // Modal schließen
  document.querySelectorAll('.person-detail-modal').forEach(m => m.remove());
  
  // Knoten finden und anzeigen
  const node = document.querySelector(`[data-knoten-id="${knotenId}"]`);
  if (node) {
    node.click();
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CSS für Personen-Anzeige (in <style> einfügen)
// ═══════════════════════════════════════════════════════════════════════════
/*
.bewohner-liste {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.bewohner-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.bewohner-card:hover {
  background: rgba(255,255,255,0.1);
  transform: translateX(4px);
}

.bewohner-card.hauptbewohner {
  border-left: 3px solid var(--accent);
}

.bewohner-card.besucher {
  border-left: 3px solid var(--text-muted);
  opacity: 0.8;
}

.bewohner-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.bewohner-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bewohner-name {
  font-weight: 500;
  color: var(--text-primary);
}

.bewohner-leben {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.bewohner-badge {
  font-size: 1rem;
}

.person-detail-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.person-detail-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
}

.person-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.person-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.person-leben {
  color: var(--text-secondary);
}

.person-bio {
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.person-section {
  margin-bottom: 1.5rem;
}

.person-section h3 {
  color: var(--accent);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.person-section ul {
  margin-left: 1.5rem;
  color: var(--text-secondary);
}

blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  margin: 0.5rem 0;
  font-style: italic;
  color: var(--text-secondary);
}

blockquote cite {
  display: block;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  font-style: normal;
}

.position-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.position-tag {
  background: var(--accent);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.beziehungen-liste {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.beziehung {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.beziehung-typ {
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.beziehung-freund { background: #4CAF50; color: white; }
.beziehung-allianz { background: #2196F3; color: white; }
.beziehung-kritisch { background: #FF9800; color: white; }
.beziehung-gegner { background: #f44336; color: white; }
.beziehung-beeinflusst_von { background: #9C27B0; color: white; }
.beziehung-mentor { background: #00BCD4; color: white; }

.beziehung-zu {
  cursor: pointer;
  color: var(--accent);
}

.beziehung-beschreibung {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.wiki-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--accent);
  text-decoration: none;
}

.wiki-link:hover {
  text-decoration: underline;
}
*/
