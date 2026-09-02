import { renderCatalogue } from './catalogue.js';

let currentFilms = [];

export function setupFilters(films) {
  // Filter out Lilongwe films (private event) before setting up filters
  const visibleFilms = films.filter(f => f.program?.day !== 'Sunday 20 September');
  currentFilms = visibleFilms;
  
  const searchInput = document.getElementById('searchInput');
  const filterDate = document.getElementById('filterDate');
  const filterVenue = document.getElementById('filterVenue');
  const filterGenre = document.getElementById('filterGenre');
  
  // Populate Date dropdown (only with visible dates)
  const dates = new Set();
  visibleFilms.forEach(f => { if (f.program?.day) dates.add(f.program.day); });
  dates.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    filterDate.appendChild(opt);
  });

  // Populate Venue dropdown
  const venues = new Set();
  visibleFilms.forEach(f => { if (f.program?.venue) venues.add(f.program.venue); });
  venues.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    filterVenue.appendChild(opt);
  });

  // Populate Genre dropdown
  const genres = new Set();
  visibleFilms.forEach(f => { if (f.genres) f.genres.forEach(g => genres.add(g)); });
  genres.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    filterGenre.appendChild(opt);
  });

  // Event listeners
  searchInput.addEventListener('input', applyFilters);
  filterDate.addEventListener('change', applyFilters);
  filterVenue.addEventListener('change', applyFilters);
  filterGenre.addEventListener('change', applyFilters);

  // Toggle buttons (Origin & Type)
  document.querySelectorAll('#originToggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#originToggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
  document.querySelectorAll('#typeToggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#typeToggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

export function applyFilters() {
  const searchVal = document.getElementById('searchInput').value.toLowerCase().trim();
  const dateVal = document.getElementById('filterDate').value;
  const venueVal = document.getElementById('filterVenue').value;
  const genreVal = document.getElementById('filterGenre').value;
  
  const originActive = document.querySelector('#originToggle button.active');
  const originVal = originActive ? originActive.dataset.value : 'all';
  
  const typeActive = document.querySelector('#typeToggle button.active');
  const typeVal = typeActive ? typeActive.dataset.value : 'all';

  const filtered = currentFilms.filter(f => {
    // Title search
    if (searchVal && !f.title.toLowerCase().includes(searchVal)) return false;
    // Date
    if (dateVal !== 'all' && f.program?.day !== dateVal) return false;
    // Venue
    if (venueVal !== 'all' && f.program?.venue !== venueVal) return false;
    // Genre
    if (genreVal !== 'all' && (!f.genres || !f.genres.includes(genreVal))) return false;
    // Origin
    if (originVal === 'eu' && f.isMalawian === true) return false;
    if (originVal === 'mw' && f.isMalawian !== true) return false;
    // Type (Feature/Short)
    if (typeVal !== 'all' && f.program?.slot) {
      if (!f.program.slot.includes(typeVal)) return false;
    }
    return true;
  });

  window.__currentFiltered = filtered;
  renderCatalogue(filtered);
}
