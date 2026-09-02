import { renderCatalogue } from './catalogue.js';
import { setupFilters, applyFilters } from './filters.js';
import { setupSorting } from './sorting.js';
import { openModal } from './modal.js';

let allFilms = [];

async function loadFilms() {
  try {
    const response = await fetch('./data/films.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const films = await response.json();

    allFilms = films;
    window.__films = films;
    window.__currentFiltered = films;

    // 1. Render Catalogue
    renderCatalogue(films);

    // 2. Setup Filters & Sorting
    setupFilters(films);
    setupSorting(films);

    // 3. Populate Quick Book dropdowns
    populateQuickSelects(films);

    // 4. Quick Book button
    const quickBookBtn = document.getElementById('quickBookBtn');
    if (quickBookBtn) {
      quickBookBtn.addEventListener('click', () => {
        const title = document.getElementById('quickFilmSelect').value;
        if (!title) { 
          alert('Please select a film first.'); 
          return; 
        }
        const film = allFilms.find(f => f.title === title);
        if (!film) {
          alert('Film not found. Please try again.');
          return;
        }
        const GOOGLE_FORM_ID = '1FAIpQLSdOSqgGyZCzydXeK8iLIXmZCjmsiK5IW3q8iw83QDPsKUPYVQ';
        const DATE_ENTRY_ID = '1185226796';
        const FILM_ENTRY_ID = '1162404058';
        const dateValue = `${film.program?.day || 'TBD'} - ${film.program?.venue || 'TBD'}`;
        const filmValue = `${film.title} – ${film.program?.time || 'TBD'}`;
        const url = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?usp=pp_url&entry.${DATE_ENTRY_ID}=${encodeURIComponent(dateValue)}&entry.${FILM_ENTRY_ID}=${encodeURIComponent(filmValue)}`;
        window.open(url, '_blank');
      });
    }

    // 5. Nav Venue filter (conditional)
    const navVenueSelect = document.getElementById('navVenueSelect');
    if (navVenueSelect) {
      navVenueSelect.addEventListener('change', (e) => {
        document.getElementById('filterVenue').value = e.target.value;
        applyFilters();
      });
    }

  } catch (error) {
    console.error('Failed to load films:', error);
    document.getElementById('filmGrid').innerHTML = `<p style="text-align:center;padding:40px;">⚠️ Failed to load films. Please refresh the page.<br><small>${error.message}</small></p>`;
  }
}

function populateQuickSelects(films) {
  const filmSelect = document.getElementById('quickFilmSelect');
  if (!filmSelect) return;

  // Filter out EU Residence films (Friday 18 September) AND Lilongwe Girls School films (Sunday 20 September)
  const filteredFilms = films.filter(f => 
    f.program?.day !== 'Friday 18 September' && 
    f.program?.day !== 'Sunday 20 September'
  );

  const dayOrder = ['Saturday 12 September', 'Saturday 19 September'];
  filteredFilms.sort((a, b) => {
    const dayA = a.program?.day || '';
    const dayB = b.program?.day || '';
    const idxA = dayOrder.indexOf(dayA);
    const idxB = dayOrder.indexOf(dayB);
    if (idxA !== idxB) return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    const timeA = a.program?.time || '00:00';
    const timeB = b.program?.time || '00:00';
    return timeA.localeCompare(timeB);
  });

  filmSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select a Film to Book...';
  filmSelect.appendChild(defaultOption);

  filteredFilms.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.title;
    const day = f.program?.day || 'TBD';
    const time = f.program?.time || 'TBD';
    opt.textContent = `${f.title} (${day}, ${time})`;
    filmSelect.appendChild(opt);
  });
}

loadFilms();
