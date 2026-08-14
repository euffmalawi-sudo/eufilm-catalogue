// js/sorting.js
export function setupSorting(films) {
  const sortSelect = document.getElementById('sortBy');
  if (!sortSelect) return;
  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    let sorted = [...films];
    if (val === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (val === 'year') sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
    import('./catalogue.js').then(module => module.renderCatalogue(sorted));
  });
}
