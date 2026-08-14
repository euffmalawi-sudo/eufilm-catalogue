import { renderCatalogue } from './catalogue.js';
import { setupFilters } from './filters.js';
import { setupSorting } from './sorting.js';

async function loadFilms() {
  try {
    const response = await fetch('./data/films.json');
    const films = await response.json();
    // Store globally so filters and sorting can share the data
    window.__films = films;
    window.__currentFiltered = films;
    renderCatalogue(films);
    setupFilters(films);
    setupSorting(films);
  } catch (error) {
    console.error('Failed to load films:', error);
    document.getElementById('filmGrid').innerHTML = '<p style="text-align:center;padding:40px;">⚠️ Sorry, unable to load films.</p>';
  }
}

loadFilms();
