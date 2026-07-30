import { loadFilms } from './catalogue.js';
import { applyFilters } from './filters.js';
import { applySort } from './sorting.js';
import { renderGrid } from './catalogue.js';
import { updateStats } from './catalogue.js';

let allFilms = [];
let currentFiltered = [];

export function getFilms() { return allFilms; }

async function init() {
    try {
        const res = await fetch('./data/films.json');
        if (!res.ok) throw new Error('Failed to load films');
        allFilms = await res.json();
        currentFiltered = [...allFilms];
        
        // Populate genre filter
        const genres = new Set();
        allFilms.forEach(f => f.genres.forEach(g => genres.add(g)));
        const genreSelect = document.getElementById('genreFilter');
        genres.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g;
            opt.textContent = g;
            genreSelect.appendChild(opt);
        });

        updateCatalogue();
        setupEventListeners();
    } catch (err) {
        document.getElementById('catalogueGrid').innerHTML = `<p style="text-align:center;color:var(--eff-red);">Error loading catalogue: ${err.message}</p>`;
    }
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', updateCatalogue);
    document.getElementById('eventFilter').addEventListener('change', updateCatalogue);
    document.getElementById('genreFilter').addEventListener('change', updateCatalogue);
    document.getElementById('sortFilter').addEventListener('change', updateCatalogue);
}

window.updateCatalogue = function() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const eventFilter = document.getElementById('eventFilter').value;
    const genreFilter = document.getElementById('genreFilter').value;
    const sortType = document.getElementById('sortFilter').value;

    let filtered = applyFilters(allFilms, search, eventFilter, genreFilter);
    filtered = applySort(filtered, sortType);
    currentFiltered = filtered;

    renderGrid(filtered);
    updateStats(allFilms, filtered);
};

init();