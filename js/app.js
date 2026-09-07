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

    renderCatalogue(films);
    setupFilters(films);
    setupSorting(films);
    populateQuickSelects(films);

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
        // Use the same logic as modal.js to determine which form to use
        let GOOGLE_FORM_ID;
        let FILM_ENTRY_ID;
        const venue = film.program?.venue || '';

        if (venue.includes('Jacaranda') || venue.includes('Alliance Française')) {
          GOOGLE_FORM_ID = '1FAIpQLScPiE2o-0GaOlVbAQXFyPurugtfIOIg8cXxv20mLXtdCDOR5w';
          FILM_ENTRY_ID = '1162404058';
        } else if (venue.includes('Pabwalo')) {
          GOOGLE_FORM_ID = '1FAIpQLScBGDHtUkdQtvRZVk4uXfxaFYXjZ0FhW3DPjUPxB8OX-4fhqg';
          FILM_ENTRY_ID = '635912452';
        } else if (venue.includes('EU Residence')) {
          GOOGLE_FORM_ID = '1FAIpQLScfA8ITA559ZlzoDILNBDdtfv-D1yKmfEXpZgWEXxkO_Co4qw';
          FILM_ENTRY_ID = '635912452';
        } else {
          GOOGLE_FORM_ID = '1FAIpQLScPiE2o-0GaOlVbAQXFyPurugtfIOIg8cXxv20mLXtdCDOR5w';
          FILM_ENTRY_ID = '1162404058';
        }

        const filmValue = `${film.title} – ${film.program?.time || 'TBD'}`;
        const url = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?usp=pp_url&entry.${FILM_ENTRY_ID}=${encodeURIComponent(filmValue)}`;
        window.open(url, '_blank');
      });
    }

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

  // Only filter out EU Residence films from Quick Book if they are still private
  // Since EU Residence is now public, we only filter out Lilongwe (private event)
  const filteredFilms = films.filter(f => f.program?.day !== 'Sunday 20 September');

  const dayOrder = ['Saturday 12 September', 'Friday 18 September', 'Saturday 19 September'];
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
