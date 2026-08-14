// js/modal.js
export function openModal(film) {
  const container = document.getElementById('modalContainer');
  const body = document.getElementById('modalBody');
  if (!container || !body) return;

  body.innerHTML = `
    <button id="closeModalBtn" class="modal-close">&times;</button>
    <div class="modal-content">
      <h2>${film.title}</h2>
      <p><strong>Director:</strong> ${film.director || 'TBA'}</p>
      <p><strong>Year:</strong> ${film.year || 'TBA'}</p>
      <p><strong>Country:</strong> ${film.country || 'TBA'}</p>
      <p><strong>Synopsis:</strong> ${film.synopsis || 'No synopsis available.'}</p>
      <p><strong>Rating:</strong> ${film.rating || 'N/A'}</p>
      ${film.trailer ? `<a href="${film.trailer}" target="_blank" class="trailer-link">🎬 Watch Trailer</a>` : ''}
      ${film.booking ? `<a href="${film.booking}" target="_blank" class="booking-btn">🎟️ Book Now</a>` : ''}
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
