import { renderCatalogue } from './catalogue.js';

export function setupSorting(films) {
  const sortSelect = document.getElementById('sortBy');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', () => {
    // Re-render the current filtered list. catalogue.js handles the sorting internally.
    const list = window.__currentFiltered || films;
    renderCatalogue(list);
  });
}
