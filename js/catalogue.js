import { openModal } from './modal.js';

export function renderCatalogue(films) {
  const grid = document.getElementById('filmGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (films.length === 0) {
    grid.innerHTML = '<p style="text-align:center;padding:40px;color:#888;">No films match your criteria.</p>';
    return;
  }

  films.forEach(film => {
    const card = document.createElement('div');
    card.className = 'film-card';
    const posterUrl = film.poster && film.poster.trim() !== '' ? film.poster : 'https://via.placeholder.com/300x400?text=No+Poster';

    // Build badges
    let badges = '';
    if (film.isMalawian) badges += `<span class="badge badge-mw">🇲🇼 Malawian</span>`;
    else badges += `<span class="badge badge-eu">🇪🇺 European</span>`;
    
    if (film.program?.slot) {
      if (film.program.slot.includes('Feature')) badges += `<span class="badge badge-feature">Feature</span>`;
      else if (film.program.slot.includes('Short')) badges += `<span class="badge badge-short">Short</span>`;
    }

    // Clean time display
    const time = film.program?.time || '';
    const venue = film.program?.venue || '';

    card.innerHTML = `
      <img src="${posterUrl}" alt="${film.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=No+Poster'">
      <div class="card-body">
        <div class="film-title">${film.title}</div>
        <div class="film-meta">
          <span>${film.director || 'TBA'}</span>
          <span>•</span>
          <span>${film.year || ''}</span>
        </div>
        <div class="film-meta" style="font-size:0.75rem; color:#666;">
          ${time} ${venue ? '• '+venue : ''}
        </div>
        <div class="badge-row">${badges}</div>
        <button class="details-btn" data-film-id="${film.id}">View Details</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach listeners
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.filmId, 10);
      const source = window.__currentFiltered || window.__films || [];
      const film = source.find(f => f.id === id);
      if (film) openModal(film);
    });
  });
}
