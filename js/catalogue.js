import { openModal } from './modal.js';

// Map full day names to URL-friendly slugs for anchor links
function getDaySlug(day) {
  const map = {
    'Saturday 12 September': 'sat-12',
    'Friday 18 September': 'fri-18',
    'Saturday 19 September': 'sat-19'
  };
  return map[day] || day.toLowerCase().replace(/ /g, '-').replace('september', 'sep');
}

// Define the exact order of the festival days (only visible days)
const dayOrder = ['Saturday 12 September', 'Friday 18 September', 'Saturday 19 September'];

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

  // Filter out Lilongwe Girls School films (Sunday 20 September) – private event
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

    // Create the Day Section wrapper with an ID for anchor linking
    const section = document.createElement('div');
    section.className = 'day-section';
    section.id = 'day-' + getDaySlug(day);

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

      // Build badges
      let badges = '';
      if (film.isMalawian) badges += `<span class="badge badge-mw">🇲🇼 Malawian</span>`;
      else badges += `<span class="badge badge-eu">🇪🇺 European</span>`;
      
      if (film.program?.slot) {
        if (film.program.slot.includes('Feature')) badges += `<span class="badge badge-feature">Feature</span>`;
        else if (film.program.slot.includes('Short')) badges += `<span class="badge badge-short">Short</span>`;
      }

      card.innerHTML = `
        <img src="${posterUrl}" alt="${film.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=No+Poster'">
        <div class="card-body">
          <div class="film-title">${film.title}</div>
          <div class="film-meta">
            <span>${film.director || 'Director TBA'}</span>
            <span>•</span>
            <span>${film.year || ''}</span>
            <span>•</span>
            <span>${film.country || ''}</span>
          </div>
          <div class="film-meta time-venue">
            🕐 ${film.program?.time || 'TBD'}  •  📍 ${film.program?.venue || 'TBD'}
          </div>
          <div class="badge-row">${badges}</div>
          <button class="details-btn" data-film-id="${film.id}">View Details</button>
        </div>
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
