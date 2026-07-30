export function openModal(film) {
    const container = document.getElementById('modalContainer');
    const body = document.getElementById('modalBody');

    const eventClass = film.eventSuggestion ? film.eventSuggestion.toLowerCase().replace(' ', '') : '';
    const eventTag = film.eventSuggestion ? `<span class="tag event-${eventClass}">${film.eventSuggestion}</span>` : '';
    const delegationTag = film.delegation ? `<span class="tag delegation">${film.delegation} Pick</span>` : '';
    
    const genresHtml = film.genres.map(g => `<span class="genre-tag" style="background:var(--eff-off-white);padding:0.1rem 0.7rem;border-radius:20px;font-size:0.7rem;border:1px solid rgba(209,209,209,0.3);">${g}</span>`).join(' ');

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://www.imdb.com/title/${film.imdbId}/`;
    
    // ----- FIXED: Direct embed using youtubeId -----
    let trailerHtml = '';
    if (film.youtubeId && film.youtubeId !== '') {
        trailerHtml = `
            <div class="trailer-wrap">
                <iframe 
                    src="https://www.youtube.com/embed/${film.youtubeId}" 
                    allowfullscreen 
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>
        `;
    } else {
        trailerHtml = `
            <div style="background:var(--eff-off-white);padding:2rem;text-align:center;border-radius:12px;color:#8a94ae;">
                <i class="fas fa-video" style="font-size:2rem;display:block;margin-bottom:0.5rem;"></i>
                <span>Trailer not yet added</span>
            </div>
        `;
    }

    body.innerHTML = `
        <div class="modal-body">
            <div class="modal-poster">
                <img src="${film.poster}" alt="${film.title}" onerror="this.src='https://placehold.co/300x450/f8f6f4/d1d1d1?text=No+Poster'">
                <div class="modal-qr">
                    <img src="${qrUrl}" alt="QR" width="100" height="100">
                    <div class="qr-label"><i class="fas fa-qrcode"></i> Scan for IMDb</div>
                </div>
            </div>
            <div class="modal-details">
                <h2>${film.title}</h2>
                <div class="director">
                    <i class="fas fa-user-tie"></i> ${film.director} <span style="background:var(--eff-red);color:white;font-size:0.7rem;padding:0.1rem 0.6rem;border-radius:30px;margin-left:0.5rem;">${film.year}</span>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.5rem;">
                    ${eventTag} ${delegationTag}
                </div>
                <div><strong>Country:</strong> ${film.country} | <strong>Runtime:</strong> ${film.runtime}m | <strong>Languages:</strong> ${film.languages || 'N/A'}</div>
                <div style="margin:0.5rem 0;">${genresHtml}</div>
                <div class="synopsis">${film.synopsis}</div>
                <div class="modal-scores">
                    <div class="item"><div class="label">Combined</div><div class="value combined">${film.combined}</div></div>
                    <div class="item"><div class="label">IMDb</div><div class="value">${film.imdb}</div></div>
                    <div class="item"><div class="label">Rotten Tomatoes</div><div class="value gold">${film.rt}%</div></div>
                    <div class="item"><div class="label">Metacritic</div><div class="value blue">${film.meta}</div></div>
                    <div class="item"><div class="label">Festival</div><div class="value gold">${film.festivalScore}</div></div>
                    <div class="item"><div class="label">Content Risk</div><div class="value" style="color:var(--eff-red);">${film.contentRisk}</div></div>
                </div>
                <div class="modal-trailer">
                    <h4><i class="fas fa-video"></i> Official Trailer</h4>
                    ${trailerHtml}
                </div>
            </div>
        </div>
    `;
    container.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    container.onclick = (e) => { if (e.target === container) closeModal(); };
    document.getElementById('closeModalBtn').onclick = closeModal;
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

export function closeModal() {
    document.getElementById('modalContainer').style.display = 'none';
    document.body.style.overflow = 'auto';
}
