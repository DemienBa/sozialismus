// Navigation Module

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

function toggleGruppe(gruppe) {
  const gruppeEl = document.getElementById(`gruppe-${gruppe}`);
  if (gruppeEl) {
    gruppeEl.classList.toggle('open');
  }
}

function togglePalette() {
  const palette = document.getElementById('linsen-palette');
  palette.classList.toggle('expanded');
  document.body.classList.toggle('palette-expanded');
}

