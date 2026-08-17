export function openModal(film) {
  const container = document.getElementById('modalContainer');
  const body = document.getElementById('modalBody');
  if (!container || !body) return;

  const GOOGLE_FORM_ID = '1FAIpQLSdOSqgGyZCzydXeK8iLIXmZCjmsiK5IW3q8iw83QDPsKUPYVQ';
  const ENTRY_ID = '1162404058';
  const bookingUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?usp=pp_url&entry.${ENTRY_ID}=${encodeURIComponent(film.title)}`;

  const trailerHtml = film.youtubeId ? `
    <div class="video-wrapper">
      <iframe src="https://www.youtube.com/embed/${film.youtubeId}" title="${film.title} trailer" frameborder="0" allowfullscreen></iframe>
    </div>
  ` : '';

  const awardsHtml = film.awards && film.awards.length > 0 
    ? `<p><strong>🏆 Awards</strong></p><ul class="awards-list">${film.awards.map(a => `<li>${a}</li>`).join('')}</ul>` 
    : '';

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
