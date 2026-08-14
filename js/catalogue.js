import { openModal } from './modal.js';

export function renderCatalogue(films) {
  const grid = document.getElementById('filmGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (films.length === 0) {
    grid.innerHTML = '<p style="text-align:center;padding:40px;color:#b0c4de;">No films match your criteria.</p>';
    return;
  }

  films.forEach((film, index) => {
    const card = document.createElement('div');
    card.className = 'film-card';

    // Handle missing posters gracefully
    const posterUrl = film.poster && film.poster.trim() !== '' 
      ? film.poster 
      : 'https://via.placeholder.com/300x400?text=No+Poster';

    card.innerHTML = `
      <img src="${posterUrl}" alt="${film.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=No+Poster'">
      <h3 class="film-title">${film.title}</h3>
      <p class="film-director">${film.director || 'Director TBA'}</p>
      <p class="film-year">${film.year || ''}  •  ${film.country || ''}</p>
      <button class="details-btn" data-index="${index}">View Details</button>
    `;
    grid.appendChild(card);
  });

  // Attach click listeners to all detail buttons
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      openModal(films[idx]);
    });
  });
}
