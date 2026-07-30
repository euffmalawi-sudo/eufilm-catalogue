import { openModal } from './modal.js';

export function renderGrid(films) {
    const grid = document.getElementById('catalogueGrid');
    const noResults = document.getElementById('noResults');

    if (films.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';

    let html = '';
    films.forEach(film => {
        const badgeClass = film.combined >= 70 ? 'green' : 'yellow';
        const badgeText = film.combined >= 70 ? '✓' : '⌛';
        html += `
            <div class="film-card" data-id="${film.id}">
                <div class="poster-wrap">
                    <img src="${film.poster}" alt="${film.title}" loading="lazy" onerror="this.src='https://placehold.co/300x450/f8f6f4/d1d1d1?text=No+Poster'">
                    <span class="card-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="card-info">
                    <h3>${film.title}</h3>
                    <div class="meta">
                        <span>${film.year}</span>
                        <span>${film.runtime}m</span>
                    </div>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;

    // Attach click listeners
    grid.querySelectorAll('.film-card').forEach(card => {
        const id = parseInt(card.dataset.id);
        const film = films.find(f => f.id === id);
        if (film) card.addEventListener('click', () => openModal(film));
    });
}

export function updateStats(allFilms, filtered) {
    document.getElementById('totalCount').textContent = allFilms.length;
    const green = allFilms.filter(f => f.combined >= 70).length;
    const yellow = allFilms.filter(f => f.combined < 70).length;
    document.getElementById('greenCount').textContent = green;
    document.getElementById('yellowCount').textContent = yellow;
}