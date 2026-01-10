// ═══════════════════════════════════════════════════════════════════════════
// GENERATOR: "Weiter zum Wesen" Button
// Einfügen in die Ergebnis-Anzeige der app.js
// ═══════════════════════════════════════════════════════════════════════════

// Wesen-URL generieren
function generateWesenURL(ergebnis) {
  const baseURL = './wesen/index.html'; // Pfad anpassen
  const params = new URLSearchParams({
    stroemung: ergebnis.id || 'eigenstaendig',
    knoten: (ergebnis.wesenKnoten || []).join(','),
    etage: ergebnis.wesenEtage || 'Lobby',
    name: ergebnis.name
  });
  return `${baseURL}?${params.toString()}`;
}

// Button-Komponente (für React)
const WesenButton = ({ ergebnis }) => {
  const handleClick = () => {
    const url = generateWesenURL(ergebnis);
    window.open(url, '_blank');
  };
  
  return React.createElement('button', {
    className: 'wesen-button',
    onClick: handleClick
  }, [
    React.createElement('span', { key: 'icon', className: 'wesen-icon' }, '🏠'),
    React.createElement('span', { key: 'text' }, 'Im Haus der Ideen erkunden'),
    React.createElement('span', { key: 'arrow', className: 'wesen-arrow' }, '→')
  ]);
};

// Einfache Button-Funktion (ohne React)
function createWesenButton(ergebnis, container) {
  const url = generateWesenURL(ergebnis);
  
  const button = document.createElement('a');
  button.href = url;
  button.target = '_blank';
  button.className = 'wesen-button';
  button.innerHTML = `
    <span class="wesen-icon">🏠</span>
    <span>Im Haus der Ideen erkunden</span>
    <span class="wesen-arrow">→</span>
  `;
  
  if (container) {
    container.appendChild(button);
  }
  
  return button;
}

// ═══════════════════════════════════════════════════════════════════════════
// Integration in bestehende Ergebnis-Anzeige
// ═══════════════════════════════════════════════════════════════════════════

// In der renderErgebnis-Funktion nach den Theoretikern einfügen:
/*
// Nach dem Theoretiker-Bereich:
<div class="wesen-integration">
  <h4>Vertiefe deine Position</h4>
  <p>Erkunde die theoretischen Grundlagen deines Sozialismus-Typs im interaktiven Netzwerk.</p>
  {WesenButton && <WesenButton ergebnis={ergebnis} />}
  
  <div class="wesen-knoten-preview">
    <span>Deine Koordinaten:</span>
    {ergebnis.wesenKnoten?.map(k => (
      <span key={k} className="knoten-chip">{k}</span>
    ))}
  </div>
</div>
*/

// ═══════════════════════════════════════════════════════════════════════════
// CSS für Wesen-Button (in Stylesheet einfügen)
// ═══════════════════════════════════════════════════════════════════════════
/*
.wesen-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #C62828, #E53935);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 1rem 0;
}

.wesen-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(198, 40, 40, 0.4);
}

.wesen-icon {
  font-size: 1.25rem;
}

.wesen-arrow {
  margin-left: auto;
  transition: transform 0.3s;
}

.wesen-button:hover .wesen-arrow {
  transform: translateX(4px);
}

.wesen-integration {
  background: rgba(198, 40, 40, 0.1);
  border: 1px solid rgba(198, 40, 40, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.wesen-integration h4 {
  color: #C62828;
  margin-bottom: 0.5rem;
}

.wesen-integration p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.wesen-knoten-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(198, 40, 40, 0.2);
}

.wesen-knoten-preview span:first-child {
  color: #888;
  font-size: 0.85rem;
}

.knoten-chip {
  background: #333;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: monospace;
}
*/
