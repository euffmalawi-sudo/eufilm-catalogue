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
      const ENTRY_ID = '1162404058';
      const url = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform?usp=pp_url&entry.${ENTRY_ID}=${encodeURIComponent(title)}`;
      window.open(url, '_blank');
    });

    // 6. Nav Venue filter
    document.getElementById('navVenueSelect').addEventListener('change', (e) => {
      document.getElementById('filterVenue').value = e.target.value;
      applyFilters();
    });

  } catch (error) {
    console.error(error);
    document.getElementById('filmGrid').innerHTML = '<p style="text-align:center;padding:40px;">⚠️ Failed to load films.</p>';
  }
}

function populateQuickSelects(films) {
  const filmSelect = document.getElementById('quickFilmSelect');
  films.sort((a,b) => a.title.localeCompare(b.title)).forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.title;
    opt.textContent = f.title;
    filmSelect.appendChild(opt);
  });
}

function setupCarousel(films) {
  const track = document.getElementById('carouselTrack');
  const posters = films.filter(f => f.poster && f.poster.trim() !== '').slice(0, 8); // limit to 8

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

  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentIndex < maxIndex) { currentIndex++; updateCarousel(); }
    else { currentIndex = 0; updateCarousel(); }
  });
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; updateCarousel(); }
    else { currentIndex = maxIndex; updateCarousel(); }
  });

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

loadFilms();
