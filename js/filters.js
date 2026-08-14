// js/filters.js
export function setupFilters(films) {
  const filterSelect = document.getElementById('filterCountry');
  if (!filterSelect) return;
  filterSelect.addEventListener('change', () => {
    // Simple filter logic – you can expand later
    const val = filterSelect.value;
    // For now, just reload the catalogue (you can improve this)
    import('./catalogue.js').then(module => {
      if (val === 'all') {
        module.renderCatalogue(films);
      } else {
        const filtered = films.filter(f => f.country === val);
        module.renderCatalogue(filtered);
      }
    });
  });
}
