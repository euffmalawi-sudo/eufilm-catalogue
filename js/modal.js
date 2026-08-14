export function openModal(film) {
  const container = document.getElementById('modalContainer');
  const body = document.getElementById('modalBody');
  if (!container || !body) return;

  // Build YouTube link if youtubeId exists
  const trailerLink = film.youtubeId ? `https://www.youtube.com/watch?v=${film.youtubeId}` : null;

  // Format Awards list
  const awardsHtml = film.awards && film.awards.length > 0 
    ? `<p><strong>🏆 Awards:</strong><br>${film.awards.map(a => `&bull; ${a}`).join('<br>')}</p>` 
    : '';

  // Format Program details
  const program = film.program || {};
  const programHtml = `
    <div style="background:#0d1b3e; padding:14px 18px; border-radius:12px; margin:14px 0; border-left:4px solid #ffd700;">
      <p style="margin:4px 0;"><strong>📅 ${program.day || 'TBD'}</strong></p>
      <p style="margin:4px 0;">🕐 ${program.time || 'TBD'}  •  📍 ${program.venue || 'TBD'}</p>
      <p style="margin:4px 0; color:#ffd700;">🎬 ${program.slot || ''}</p>
    </div>
  `;

  body.innerHTML = `
    <button id="closeModalBtn" class="modal-close">&times;</button>
    <div class="modal-content">
      <h2>${film.title}</h2>
      <p><strong>Director:</strong> ${film.director || 'TBA'}</p>
      <p><strong>Year:</strong> ${film.year || 'TBA'}  •  <strong>Runtime:</strong> ${film.runtime ? film.runtime + ' min' : 'TBA'}</p>
      <p><strong>Country:</strong> ${film.country || 'TBA'}</p>
      <p><strong>Genres:</strong> ${film.genres ? film.genres.join(', ') : 'N/A'}</p>
      <p><strong>Languages:</strong> ${film.languages || 'TBA'}</p>
      
      ${film.synopsis ? `<p><strong>📖 Synopsis:</strong> ${film.synopsis}</p>` : ''}
      
      <p><strong>⭐ Ratings:</strong> IMDb ${film.imdb || 'N/A'}${film.rt ? ` | Rotten Tomatoes ${film.rt}%` : ''}${film.meta ? ` | Metacritic ${film.meta}` : ''}</p>
      
      ${programHtml}
      
      ${awardsHtml}
      
      ${trailerLink ? `<a href="${trailerLink}" target="_blank" class="trailer-link">🎬 Watch Trailer</a>` : ''}
    </div>
  `;

  container.style.display = 'flex';

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  container.addEventListener('click', (e) => {
    if (e.target === container) closeModal();
  });
}

export function closeModal() {
  const container = document.getElementById('modalContainer');
  if (container) container.style.display = 'none';
}
