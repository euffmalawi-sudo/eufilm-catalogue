import { renderCatalogue } from './catalogue.js';

export function setupSorting(films) {
  const sortSelect = document.getElementById('sortBy');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    // Use the currently filtered list (or full list if no filters applied)
    const listToSort = window.__currentFiltered || films;
    let sorted = [...listToSort];

    if (val === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (val === 'year') {
      sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    renderCatalogue(sorted);
  });
}
