import { renderCatalogue } from './catalogue.js';

export function setupFilters(films) {
  const countryFilter = document.getElementById('filterCountry');
  const dayFilter = document.getElementById('filterDay');

  // --- Populate Country dropdown ---
  const countries = new Set();
  films.forEach(f => {
    f.country.split(',').forEach(c => countries.add(c.trim()));
  });
  // Sort alphabetically
  const sortedCountries = Array.from(countries).sort();
  sortedCountries.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    countryFilter.appendChild(opt);
  });

  // --- Populate Day dropdown ---
  const days = new Set();
  films.forEach(f => {
    if (f.program && f.program.day) days.add(f.program.day);
  });
  // Sort days chronologically (optional, but keeps it tidy)
  const sortedDays = Array.from(days).sort();
  sortedDays.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    dayFilter.appendChild(opt);
  });

  // --- Apply Filters ---
  function applyFilters() {
    const countryVal = countryFilter.value;
    const dayVal = dayFilter.value;

    let filtered = films.filter(f => {
      let matchCountry = true;
      if (countryVal !== 'all') {
        matchCountry = f.country.split(',').map(c => c.trim()).includes(countryVal);
      }

      let matchDay = true;
      if (dayVal !== 'all') {
        matchDay = f.program && f.program.day === dayVal;
      }

      return matchCountry && matchDay;
    });

    // Save the filtered list globally so sorting can use it
    window.__currentFiltered = filtered;
    renderCatalogue(filtered);
  }

  countryFilter.addEventListener('change', applyFilters);
  dayFilter.addEventListener('change', applyFilters);
}
