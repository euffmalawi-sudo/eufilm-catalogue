export function openModal(film) {
  const container = document.getElementById('modalContainer');
  const body = document.getElementById('modalBody');
  if (!container || !body) return;

  // --- DETERMINE WHICH FORM TO USE BASED ON VENUE ---
  let GOOGLE_FORM_ID;
  let FILM_ENTRY_ID;
  const venue = film.program?.venue || '';

  if (venue.includes('Jacaranda')) {
    // Jacaranda Form (Saturday 12 September)
    GOOGLE_FORM_ID = '1FAIpQLScPiE2o-0GaOlVbAQXFyPurugtfIOIg8cXxv20mLXtdCDOR5w';
    FILM_ENTRY_ID = '1162404058';
  } else if (venue.includes('Pabwalo')) {
    // Pabwalo Form (Saturday 19 September)
    GOOGLE_FORM_ID = '1FAIpQLScBGDHtUkdQtvRZVk4uXfxaFYXjZ0FhW3DPjUPxB8OX-4fhqg';
    FILM_ENTRY_ID = '635912452'; // ← CORRECTED ENTRY ID FOR PABWALO
  } else {
    // Fallback: use Jacaranda form
    GOOGLE_FORM_ID = '1FAIpQLScPiE2o-0GaOlVbAQXFyPurugtfIOIg8cXxv20mLXtdCDOR5w';
    FILM_ENTRY_ID = '1162404058';
  }

  // --- FORMAT THE FILM + TIME VALUE ---
  // Example: "Banel & Adama – 13:00"
  const filmValue = `${film.title} – ${film.program?.time || 'TBD'}`;

  // Build the pre-filled URL with the film field
  const bookingUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?usp=pp_url&entry.${FILM_ENTRY_ID}=${encodeURIComponent(filmValue)}`;

  // --- EMBEDDED TRAILER (YouTube iframe) ---
  const trailerHtml = film.youtubeId ? `
    <div class="video-wrapper">
      <iframe src="https://www.youtube.com/embed/${film.youtubeId}" title="${film.title} trailer" frameborder="0" allowfullscreen></iframe>
    </div>
  ` : '';

  // --- AWARDS ---
  const awardsHtml = film.awards && film.awards.length > 0 
    ? `<p><strong>🏆 Awards</strong></p><ul class="awards-list">${film.awards.map(a => `<li>${a}</li>`).join('')}</ul>` 
    : '';

  // --- PROGRAM DETAILS ---
  const program = film.program || {};
  const programHtml = `
    <div class="program-box">
      <p style="margin:4px 0;"><strong>📅 ${program.day || 'TBD'}</strong></p>
      <p style="margin:4px 0;">🕐 ${program.time || 'TBD'}  •  📍 ${program.venue || 'TBD'}</p>
      <p style="margin:4px 0; color:#F5C518;">🎬 ${program.slot || ''}</p>
    </div>
  `;

  body.innerHTML = `
    <button id="closeModalBtn" class="modal-close">&times;</button>
    <div class="modal-content">
      <h2>${film.title}</h2>
      <p><strong>Director:</strong> ${film.director || 'TBA'}  •  <strong>Year:</strong> ${film.year || 'TBA'}  •  <strong>Runtime:</strong> ${film.runtime ? film.runtime + ' min' : 'TBA'}</p>
      <p><strong>Country:</strong> ${film.country || 'TBA'}  •  <strong>Genres:</strong> ${film.genres ? film.genres.join(', ') : 'N/A'}</p>
      <p><strong>Languages:</strong> ${film.languages || 'TBA'}</p>
      
      ${film.synopsis ? `<p><strong>📖 Synopsis:</strong> ${film.synopsis}</p>` : ''}
      
      <p><strong>⭐ Ratings:</strong> IMDb ${film.imdb || 'N/A'}${film.rt ? ` | Rotten Tomatoes ${film.rt}%` : ''}${film.meta ? ` | Metacritic ${film.meta}` : ''}</p>
      
      ${programHtml}
      
      ${trailerHtml}
      
      ${awardsHtml}
      
      <a href="${bookingUrl}" target="_blank" class="booking-btn">🎟️ Book Now</a>
    </div>
  `;

  container.style.display = 'flex';
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  container.addEventListener('click', (e) => { if (e.target === container) closeModal(); });
}

export function closeModal() {
  const container = document.getElementById('modalContainer');
  if (container) container.style.display = 'none';
}
