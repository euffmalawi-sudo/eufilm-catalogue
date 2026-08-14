import { renderGrid, updateStats, setBookingIds as setCatalogueBookingIds } from './catalogue.js';
import { setBookingIds as setModalBookingIds } from './modal.js';
import { applyFilters } from './filters.js';
import { applySort } from './sorting.js';

// ----- CONFIGURE YOUR GOOGLE FORM IDs HERE -----
const FORM_ID = '1FAIpQLSdOSqgGyZCzydXeK8iLIXmZCjmsiK5IW3q8iw83QDPsKUPYVQ';        // <-- paste your form ID
const ENTRY_ID = '1162404058';      // <-- paste your entry ID
// ------------------------------------------------

// Pass booking IDs to both modules
setCatalogueBookingIds(FORM_ID, ENTRY_ID);
setModalBookingIds(FORM_ID, ENTRY_ID);

let allFilms = [];
let currentDate = null;
let currentFiltered = [];

export function getFilms() { return allFilms; }

async function init() {
    try {
        const res = await fetch('./data/films.json');
        if (!res.ok) throw new Error('Failed to load films');
        allFilms = await res.json();
        // Filter only films with a program
        const programmed = allFilms.filter(f => f.program);
        
        // Build date selector
        const dates = [...new Set(programmed.map(f => f.program.day))];
        const dateSelector = document.getElementById('dateSelector');
        dateSelector.innerHTML = '';
        dates.forEach((day, index) => {
            const btn = document.createElement('button');
            btn.className = 'date-btn' + (index === 0 ? ' active' : '');
            btn.dataset.day = day;
            // Extract venue from first film of that day (for display)
            const venue = programmed.find(f => f.program.day === day)?.program.venue || '';
            btn.innerHTML = `${day} <span class="venue-badge">${venue}</span>`;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentDate = day;
                updateCatalogue();
            });
            dateSelector.appendChild(btn);
        });

        // Set default date to the first one
        if (dates.length > 0) {
            currentDate = dates[0];
        }

        // Populate genre filter (optional, we can remove but keep if you want)
        const genres = new Set();
        programmed.forEach(f => f.genres.forEach(g => genres.add(g)));
        const genreSelect = document.getElementById('genreFilter');
        if (genreSelect) {
            genres.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g;
                genreSelect.appendChild(opt);
            });
        }

        updateCatalogue();
        setupEventListeners();
    } catch (err) {
        document.getElementById('catalogueGrid').innerHTML = `<p style="text-align:center;color:var(--eff-red);">Error loading catalogue: ${err.message}</p>`;
    }
}

function setupEventListeners() {
    // If you keep search/filter, re-add listeners
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', updateCatalogue);
    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter) genreFilter.addEventListener('change', updateCatalogue);
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) sortFilter.addEventListener('change', updateCatalogue);
}

window.updateCatalogue = function() {
    // Only show films with program
    let filtered = allFilms.filter(f => f.program);
    
    // Date filter
    if (currentDate) {
        filtered = filtered.filter(f => f.program.day === currentDate);
    }

    // Optional search & genre (if you have them in your HTML)
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (search) {
        filtered = filtered.filter(f => 
            f.title.toLowerCase().includes(search) ||
            f.director.toLowerCase().includes(search) ||
            f.country.toLowerCase().includes(search)
        );
    }
    const genreFilter = document.getElementById('genreFilter');
    if (genreFilter && genreFilter.value !== 'all') {
        filtered = filtered.filter(f => f.genres.includes(genreFilter.value));
    }

    // Sort
    const sortType = document.getElementById('sortFilter')?.value || 'time';
    if (sortType === 'time') {
        filtered.sort((a, b) => a.program.time.localeCompare(b.program.time));
    } else if (sortType === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'year') {
        filtered.sort((a, b) => b.year - a.year);
    }

    currentFiltered = filtered;
    renderGrid(filtered);
    updateStats(allFilms, filtered);
};

init();
