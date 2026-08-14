import { openModal } from './modal.js';

// These will be set from app.js
let FORM_ID = '';
let ENTRY_ID = '';

export function setBookingIds(formId, entryId) {
    FORM_ID = formId;
    ENTRY_ID = entryId;
}

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
        
        // Booking button (only if film has a program)
        let bookingHtml = '';
        if (film.program && FORM_ID && ENTRY_ID) {
            const label = film.dropdownLabel || film.title;
            const bookingUrl = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform?${ENTRY_ID}=${encodeURIComponent(label)}`;
            bookingHtml = `
                <div class="card-booking">
                    <a href="${bookingUrl}" target="_blank" class="booking-btn-sm">🎟️ Book Now</a>
                </div>
            `;
        }

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
                    ${bookingHtml}
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;

    // Attach click listeners to open modal (only on the card, not on the button)
    grid.querySelectorAll('.film-card').forEach(card => {
        const id = parseInt(card.dataset.id);
        const film = films.find(f => f.id === id);
        if (film) {
            // Click on card opens modal, but if click is on the booking button, don't open modal
            card.addEventListener('click', (e) => {
                if (e.target.closest('.booking-btn-sm')) return;
                openModal(film);
            });
        }
    });
}

export function updateStats(allFilms, filtered) {
    // Count unique days from all films with program
    const days = new Set();
    allFilms.forEach(f => {
        if (f.program) days.add(f.program.day);
    });
    document.getElementById('dayCount').textContent = days.size;
    document.getElementById('filmCount').textContent = allFilms.filter(f => f.program).length;
}
