import { renderCatalogue } from './catalogue.js';
import { setupFilters, applyFilters } from './filters.js';
import { setupSorting } from './sorting.js';
import { openModal } from './modal.js';

let allFilms = [];

async function loadFilms() {
  try {
    const response = await fetch('./data/films.json');
    const films = await response.json();
    allFilms = films;
    window.__films = films;
    window.__currentFiltered = films;

    // 1. Render Catalogue
    renderCatalogue(films);

    // 2. Setup Filters & Sorting
    setupFilters(films);
    setupSorting(films);

    // 3. Populate Quick Book dropdowns
    populateQuickSelects(films);

    // 4. Setup Carousel
    setupCarousel(films);

    // 5. Quick Book button logic (Direct to Google Form)
    document.getElementById('quickBookBtn').addEventListener('click', () => {
      const title = document.getElementById('quickFilmSelect').value;
      if (!title) { 
        alert('Please select a film first.'); 
        return; 
      }
      // Google Form pre-fill URL
      const GOOGLE_FORM_ID = '1FAIpQLSdOSqgGyZCzydXeK8iLIXmZCjmsiK5IW3q8iw83QDPsKUPYVQ';
      const DATE_ENTRY_ID = '1185226796';
      const FILM_ENTRY_ID = '1162404058';
      
      // Find the selected film to get its data
      const film = allFilms.find(f => f.title === title);
      if (!film) {
        alert('Film not found. Please try again.');
        return;
      }
      
      // Build the pre-filled URL with both fields
      const dateValue = `${film.program?.day || 'TBD'} - ${film.program?.venue || 'TBD'}`;
      const filmValue = `${film.title} – ${film.program?.time || 'TBD'}`;
      
      const url = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?usp=pp_url&entry.${DATE_ENTRY_ID}=${encodeURIComponent(dateValue)}&entry.${FILM_ENTRY_ID}=${encodeURIComponent(filmValue)}`;
      window.open(url, '_blank');
    });

    // 6. Nav Venue filter
    document.getElementById('navVenueSelect').addEventListener('change', (e) => {
      document.getElementById('filterVenue').value = e.target.value;
      applyFilters();
    });

  } catch (error) {
    console.error('Failed to load films:', error);
    document.getElementById('filmGrid').innerHTML = '<p style="text-align:center;padding:40px;">⚠️ Failed to load films. Please refresh the page.</p>';
  }
}

function populateQuickSelects(films) {
  const filmSelect = document.getElementById('quickFilmSelect');
  if (!filmSelect) return;

  // --- FILTER OUT EU RESIDENCE FILMS (Friday 18 September) ---
  const filteredFilms = films.filter(f => f.program?.day !== 'Friday 18 September');

  // Sort by date/time
  const dayOrder = ['Saturday 12 September', 'Saturday 19 September', 'Sunday 20 September'];
  filteredFilms.sort((a, b) => {
    const dayA = a.program?.day || '';
    const dayB = b.program?.day || '';
    const idxA = dayOrder.indexOf(dayA);
    const idxB = dayOrder.indexOf(dayB);
    if (idxA !== idxB) return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    const timeA = a.program?.time || '00:00';
    const timeB = b.program?.time || '00:00';
    return timeA.localeCompare(timeB);
  });

  // Clear existing options and add default
  filmSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select a Film to Book...';
  filmSelect.appendChild(defaultOption);

  // Add filtered films to dropdown
  filteredFilms.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.title;
    const day = f.program?.day || 'TBD';
    const time = f.program?.time || 'TBD';
    opt.textContent = `${f.title} (${day}, ${time})`;
    filmSelect.appendChild(opt);
  });
}

function setupCarousel(films) {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  
  const posters = films.filter(f => f.poster && f.poster.trim() !== '').slice(0, 8);

  let slidesHtml = posters.map(f => `
    <div class="carousel-slide">
      <img src="${f.poster}" alt="${f.title}" loading="lazy" onerror="this.style.display='none'" />
      <div class="slide-overlay"><h3>${f.title}</h3><p>${f.director || ''}</p></div>
    </div>
  `).join('');

  // Add the special Media Day slide
  slidesHtml += `
    <div class="carousel-slide media-day">
      <div class="date-badge">📸 26 SEPTEMBER</div>
      <h3>Filmmakers & Media Day</h3>
      <p style="color:#ccc; margin:4px 0 12px;">Networking, panels, and exclusive previews.</p>
      <a href="mailto:eufilmfestmalawi@gmail.com?subject=Media%20Day%20Inquiry">📧 More Info →</a>
    </div>
  `;

  track.innerHTML = slidesHtml;

  // Carousel navigation
  let currentIndex = 0;
  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  const visibleSlides = window.innerWidth > 900 ? 4 : (window.innerWidth > 600 ? 2 : 1);
  const maxIndex = Math.max(0, totalSlides - visibleSlides);

  const updateCarousel = () => {
    const slideWidth = slides[0]?.offsetWidth + 4 || 0;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  };

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) { currentIndex--; updateCarousel(); }
      else { currentIndex = maxIndex; updateCarousel(); }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < maxIndex) { currentIndex++; updateCarousel(); }
      else { currentIndex = 0; updateCarousel(); }
    });
  }

  window.addEventListener('resize', () => {
    const newVisible = window.innerWidth > 900 ? 4 : (window.innerWidth > 600 ? 2 : 1);
    const newMax = Math.max(0, totalSlides - newVisible);
    if (currentIndex > newMax) currentIndex = newMax;
    updateCarousel();
  });

  // Auto-play
  setInterval(() => {
    if (currentIndex < maxIndex) { currentIndex++; } 
    else { currentIndex = 0; }
    updateCarousel();
  }, 4500);

  // Initial update
  setTimeout(updateCarousel, 100);
}

// Load films when the page loads
loadFilms();
