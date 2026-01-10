// ═══════════════════════════════════════════════════════════════════════════
// WESEN: URL-Parameter Integration
// Einfügen am Anfang des JavaScript-Teils in index.html
// ═══════════════════════════════════════════════════════════════════════════

// URL-Parameter auslesen (vom Generator übergeben)
function getGeneratorParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    stroemung: params.get('stroemung'),
    knoten: params.get('knoten')?.split(',') || [],
    etage: params.get('etage'),
    name: params.get('name')
  };
}

// Knoten hervorheben
function highlightKnoten(knotenIds) {
  if (!knotenIds || knotenIds.length === 0) return;
  
  knotenIds.forEach(id => {
    const node = document.querySelector(`[data-knoten-id="${id}"]`);
    if (node) {
      node.classList.add('highlighted-from-generator');
      node.style.boxShadow = '0 0 20px var(--accent)';
      node.style.transform = 'scale(1.1)';
    }
  });
  
  // Zum ersten Knoten scrollen/zentrieren
  const firstNode = document.querySelector(`[data-knoten-id="${knotenIds[0]}"]`);
  if (firstNode) {
    firstNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Begrüßungs-Modal anzeigen
function zeigeBegruessung(params) {
  if (!params.stroemung) return;
  
  const modal = document.createElement('div');
  modal.className = 'generator-welcome-modal';
  modal.innerHTML = `
    <div class="generator-welcome-content">
      <h2>Willkommen im Haus der Ideen!</h2>
      <p class="stroemung-name">${params.name || params.stroemung}</p>
      <p>Du befindest dich jetzt ${params.etage ? `im <strong>${params.etage}</strong>` : 'im Haus'}.</p>
      ${params.knoten.length > 0 ? `
        <p>Deine Positionen:</p>
        <div class="knoten-tags">
          ${params.knoten.map(k => `<span class="knoten-tag">${k}</span>`).join('')}
        </div>
      ` : ''}
      <button onclick="this.parentElement.parentElement.remove()">Erkunden</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// Beim Laden ausführen
document.addEventListener('DOMContentLoaded', () => {
  const params = getGeneratorParams();
  
  if (params.stroemung) {
    // Kurze Verzögerung, damit DOM fertig ist
    setTimeout(() => {
      highlightKnoten(params.knoten);
      zeigeBegruessung(params);
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// CSS für das Begrüßungs-Modal (in <style> einfügen)
// ═══════════════════════════════════════════════════════════════════════════
/*
.generator-welcome-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.generator-welcome-content {
  background: var(--bg-secondary);
  border: 2px solid var(--accent);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  text-align: center;
}

.generator-welcome-content h2 {
  color: var(--accent);
  margin-bottom: 1rem;
}

.stroemung-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  margin: 1rem 0;
}

.knoten-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
}

.knoten-tag {
  background: var(--accent);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.generator-welcome-content button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.generator-welcome-content button:hover {
  filter: brightness(1.1);
}

.highlighted-from-generator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 10px var(--accent); }
  50% { box-shadow: 0 0 30px var(--accent); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
*/
