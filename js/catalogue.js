// js/catalogue.js
import { openModal } from './modal.js';

export function renderCatalogue(films) {
  const grid = document.getElementById('filmGrid');
  if (!grid) return;
  grid.innerHTML = '';
  films.forEach((film, index) => {
    const card = document.createElement('div');
    card.className = 'film-card';
    card.innerHTML = `
      <img src="${film.poster || 'https://via.placeholder.com/300x400?text=No+Poster'}" alt="${film.title}" loading="lazy">
      <h3 class="film-title">${film.title}</h3>
      <p class="film-director">${film.director || 'Director TBA'}</p>
      <p class="film-year">${film.year || ''}  •  ${film.country || ''}</p>
      <button class="details-btn" data-index="${index}">View Details</button>
    `;
    grid.appendChild(card);
  });

  // Add click listeners to all detail buttons
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      openModal(films[idx]);
    });
  });
}
