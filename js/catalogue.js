import { openModal } from './modal.js';

// Define the exact order of the festival days
const dayOrder = ['Saturday 12 September', 'Saturday 19 September'];
function sortDays(a, b) {
  const idxA = dayOrder.indexOf(a);
  const idxB = dayOrder.indexOf(b);
  if (idxA === -1 && idxB === -1) return a.localeCompare(b);
  if (idxA === -1) return 1;
  if (idxB === -1) return -1;
  return idxA - idxB;
}

export function renderCatalogue(films) {
  const grid = document.getElementById('filmGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // Filter out Lilongwe Girls School films (Sunday 20 September)
  // These are private events and should not be displayed in the catalogue
  const visibleFilms = films.filter(f => f.program?.day !== 'Sunday 20 September');

  if (visibleFilms.length === 0) {
    grid.innerHTML = '<p style="text-align:center;padding:40px;color:#b0c4de;">No films match your criteria.</p>';
    return;
  }

  // Get current sort preference from the dropdown
  const sortSelect = document.getElementById('sortBy');
  const sortVal = sortSelect ? sortSelect.value : 'time';

  // 1. Group films by their program day
  const groups = {};
  visibleFilms.forEach(film => {
    const day = film.program?.day || 'TBD';
    if (!groups[day]) groups[day] = [];
    groups[day].push(film);
  });

  // 2. Sort the days
  const sortedDays = Object.keys(groups).sort(sortDays);

  // 3. Loop through each day and create a section
  sortedDays.forEach(day => {
    let dayFilms = groups[day];

    // Sort the films INSIDE this day based on the dropdown
    if (sortVal === 'title') {
      dayFilms.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortVal === 'year') {
      dayFilms.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else { // default: sort by screening time
      dayFilms.sort((a, b) => {
        const timeA = a.program?.time || '00:00';
        const timeB = b.program?.time || '00:00';
        return timeA.localeCompare(timeB);
      });
    }

    // Create the Day Section wrapper
    const section = document.createElement('div');
    section.className = 'day-section';

    const filmCount = dayFilms.length;
    const header = document.createElement('div');
    header.className = 'day-header';
    header.innerHTML = `
      <span>${day}</span>
      <span class="date-badge">${filmCount} film${filmCount > 1 ? 's' : ''}</span>
    `;
    section.appendChild(header);

    // Inner grid for the cards of this day
    const innerGrid = document.createElement('div');
    innerGrid.className = 'film-grid-inner';

    dayFilms.forEach((film) => {
      const card = document.createElement('div');
      card.className = 'film-card';
      const posterUrl = film.poster && film.poster.trim() !== '' 
        ? film.poster 
        : 'https://via.placeholder.com/300x400?text=No+Poster';
      card.innerHTML = `
        <img src="${posterUrl}" alt="${film.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=No+Poster'">
        <h3 class="film-title">${film.title}</h3>
        <p class="film-director">${film.director || 'Director TBA'}</p>
        <p class="film-year">${film.year || ''}  •  ${film.country || ''}</p>
        <button class="details-btn" data-film-id="${film.id}">View Details</button>
      `;
      innerGrid.appendChild(card);
    });

    section.appendChild(innerGrid);
    grid.appendChild(section);
  });

  // Attach click listeners to all "View Details" buttons
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.filmId, 10);
      const source = window.__currentFiltered || window.__films || [];
      const film = source.find(f => f.id === id);
      if (film) openModal(film);
    });
  });
}
