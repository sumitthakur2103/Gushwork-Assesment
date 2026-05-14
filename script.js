/**
 * script.js — Mangalam HDPE Pipes Product Page
 * ─────────────────────────────────────────────
 * Features:
 *  1. Sticky Bar — appears after scrolling beyond first fold, hides on scroll up
 *  2. Image Carousel — with thumbnails, prev/next navigation
 *  3. Carousel Zoom — hover magnifier on main image
 *  4. FAQ Accordion
 *  5. Manufacturing Process Tabs
 *  6. Applications Carousel
 *  7. Modals (Quote & Catalogue)
 *  8. Mobile Nav Toggle
 */

/* ============================================================
   0. DOM-READY INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initStickyBar();
  initFAQ();
  initMfgTabs();
  initAppsCarousel();
  initMobileNav();
  initModals();
});

/* ============================================================
   1. PRODUCT IMAGE CAROUSEL
   ============================================================ */

/**
 * Product images for the main hero carousel.
 * In a real project these would be actual product photos.
 * Using high-quality Unsplash images as placeholders.
 */
const PRODUCT_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    alt: 'HDPE pipe workers installing pipes in the field',
  },
  {
    src: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80',
    alt: 'HDPE pipe manufacturing process',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    alt: 'HDPE coil pipes ready for delivery',
  },
  {
    src: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80',
    alt: 'Industrial pipe installation project',
  },
  {
    src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    alt: 'HDPE pipe quality testing',
  },
];

let currentSlide = 0;
let carouselMain, carouselThumbs, carouselZoom, carouselZoomImg;

function initCarousel() {
  carouselMain  = document.getElementById('carouselMain');
  carouselThumbs = document.getElementById('carouselThumbs');
  carouselZoom  = document.getElementById('carouselZoom');
  carouselZoomImg = document.getElementById('carouselZoomImg');

  if (!carouselMain) return;

  // Build slides
  PRODUCT_IMAGES.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel__slide' + (i === 0 ? ' active' : '');
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    imgEl.loading = i === 0 ? 'eager' : 'lazy';
    slide.appendChild(imgEl);
    carouselMain.appendChild(slide);
  });

  // Build thumbnails
  PRODUCT_IMAGES.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'carousel__thumb' + (i === 0 ? ' active' : '');
    thumb.setAttribute('role', 'listitem');
    thumb.setAttribute('aria-label', `Image ${i + 1}`);
    thumb.tabIndex = 0;
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    imgEl.loading = 'lazy';
    thumb.appendChild(imgEl);
    thumb.addEventListener('click', () => goToSlide(i));
    thumb.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') goToSlide(i); });
    carouselThumbs.appendChild(thumb);
  });

  // Arrow navigation
  document.getElementById('prevArrow').addEventListener('click', () => {
    goToSlide((currentSlide - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);
  });
  document.getElementById('nextArrow').addEventListener('click', () => {
    goToSlide((currentSlide + 1) % PRODUCT_IMAGES.length);
  });

  // Keyboard navigation
  document.getElementById('carousel').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  goToSlide((currentSlide - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);
    if (e.key === 'ArrowRight') goToSlide((currentSlide + 1) % PRODUCT_IMAGES.length);
  });

  // Zoom on hover
  initCarouselZoom();
}

/** Switch to a given slide index */
function goToSlide(index) {
  const slides = carouselMain.querySelectorAll('.carousel__slide');
  const thumbs = carouselThumbs.querySelectorAll('.carousel__thumb');

  slides[currentSlide].classList.remove('active');
  thumbs[currentSlide].classList.remove('active');

  currentSlide = index;

  slides[currentSlide].classList.add('active');
  thumbs[currentSlide].classList.add('active');

  // Update zoom source
  const currentSrc = PRODUCT_IMAGES[currentSlide].src;
  carouselZoomImg.style.backgroundImage = `url(${currentSrc})`;
}

/* ─── Zoom Feature ─────────────────────────────────────────── */
function initCarouselZoom() {
  const mainWrap = document.querySelector('.carousel__main-wrap');
  if (!mainWrap || !carouselZoom) return;

  mainWrap.addEventListener('mouseenter', () => {
    // Set initial zoom image
    const src = PRODUCT_IMAGES[currentSlide].src;
    carouselZoomImg.style.backgroundImage = `url(${src})`;
    carouselZoom.classList.add('is-visible');
  });

  mainWrap.addEventListener('mouseleave', () => {
    carouselZoom.classList.remove('is-visible');
  });

  /**
   * Track mouse position inside the main image and
   * map it to the corresponding position in the zoomed preview.
   * Creates a magnifying glass / lens effect.
   */
  mainWrap.addEventListener('mousemove', (e) => {
    const rect = carouselMain.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp to bounds
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));

    // Percentage of cursor position
    const pctX = (clampedX / rect.width) * 100;
    const pctY = (clampedY / rect.height) * 100;

    // Move the zoomed background (2x zoom)
    carouselZoomImg.style.backgroundPosition = `${pctX}% ${pctY}%`;
    carouselZoomImg.style.backgroundSize = '200%';
  });
}

/* ============================================================
   2. STICKY BAR
   ============================================================ */
function initStickyBar() {
  const stickyBar = document.getElementById('stickyBar');
  const navbar    = document.getElementById('navbar');
  const hero      = document.getElementById('hero');
  if (!stickyBar || !navbar || !hero) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  /** The "first fold" is the bottom of the hero section */
  function getFirstFoldBottom() {
    return hero.offsetTop + hero.offsetHeight;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const firstFold = getFirstFoldBottom();
        const scrollingDown = currentY > lastScrollY;

        if (currentY > firstFold) {
          // Beyond first fold
          if (scrollingDown) {
            // Scrolling down → show sticky bar, move navbar below it
            stickyBar.classList.add('is-visible');
            stickyBar.setAttribute('aria-hidden', 'false');
            navbar.classList.add('with-sticky-bar');
          } else {
            // Scrolling up → hide sticky bar, reset navbar
            stickyBar.classList.remove('is-visible');
            stickyBar.setAttribute('aria-hidden', 'true');
            navbar.classList.remove('with-sticky-bar');
          }
        } else {
          // Above first fold — always hide sticky bar
          stickyBar.classList.remove('is-visible');
          stickyBar.setAttribute('aria-hidden', 'true');
          navbar.classList.remove('with-sticky-bar');
        }

        lastScrollY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   3. FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  const items = document.querySelectorAll('[data-faq]');
  if (!items.length) return;

  // Open first item by default
  items[0].classList.add('is-open');

  items.forEach((item) => {
    const btn = item.querySelector('.faq-item__q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all
      items.forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.faq-item__q')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (toggle)
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================================
   4. MANUFACTURING PROCESS TABS
   ============================================================ */
function initMfgTabs() {
  const tabs   = document.querySelectorAll('.mfg-tab');
  const panels = document.querySelectorAll('.mfg-panel');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Remove active from all tabs
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      panels.forEach((p) => p.classList.remove('active'));

      // Activate clicked tab and matching panel
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.querySelector(`[data-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ============================================================
   5. APPLICATIONS CAROUSEL (horizontal scroll)
   ============================================================ */
function initAppsCarousel() {
  const track    = document.getElementById('appsTrack');
  const prevBtn  = document.getElementById('appsPrev');
  const nextBtn  = document.getElementById('appsNext');
  if (!track || !prevBtn || !nextBtn) return;

  let offset = 0;

  function getCardWidth() {
    const card = track.querySelector('.app-card');
    if (!card) return 0;
    return card.offsetWidth + 20; // card + gap
  }

  function getMaxOffset() {
    return track.scrollWidth - track.parentElement.offsetWidth;
  }

  nextBtn.addEventListener('click', () => {
    offset = Math.min(offset + getCardWidth(), getMaxOffset());
    track.style.transform = `translateX(-${offset}px)`;
  });

  prevBtn.addEventListener('click', () => {
    offset = Math.max(offset - getCardWidth(), 0);
    track.style.transform = `translateX(-${offset}px)`;
  });

  // Drag/swipe support
  let startX = 0, isDragging = false;

  track.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    isDragging = true;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = startX - e.clientX;
    const clampedOffset = Math.max(0, Math.min(offset + dx, getMaxOffset()));
    track.style.transform = `translateX(-${clampedOffset}px)`;
  });

  track.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = startX - e.clientX;
    offset = Math.max(0, Math.min(offset + dx, getMaxOffset()));
    track.style.transform = `translateX(-${offset}px)`;
  });
}

/* ============================================================
   6. MOBILE NAV TOGGLE
   ============================================================ */
function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ============================================================
   7. MODALS
   ============================================================ */
function initModals() {
  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach((overlay) => {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
      });
      document.body.style.overflow = '';
    }
  });
}

/** Open a modal by key: 'quote' | 'catalogue' */
function openModal(key) {
  const map = {
    quote:     'quoteModal',
    catalogue: 'catalogueModal',
  };
  const el = document.getElementById(map[key]);
  if (!el) return;
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus first input after transition
  setTimeout(() => {
    const input = el.querySelector('input');
    if (input) input.focus();
  }, 250);
}

/** Close a modal by key */
function closeModal(key) {
  const map = {
    quote:     'quoteModal',
    catalogue: 'catalogueModal',
  };
  const el = document.getElementById(map[key]);
  if (!el) return;
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ============================================================
   8. UTILITY FUNCTIONS (called from HTML onclick)
   ============================================================ */

/** Smooth scroll to specs section */
function scrollToSpecs() {
  const el = document.getElementById('specs');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Submit catalogue email — minimal validation */
function submitCatalogueEmail(btn) {
  const input = btn.previousElementSibling;
  if (!input || !input.value.includes('@')) {
    input.focus();
    input.style.borderColor = '#ef4444';
    setTimeout(() => { input.style.borderColor = ''; }, 1500);
    return;
  }
  btn.textContent = 'Sent! ✓';
  btn.disabled = true;
  btn.style.background = '#10b981';
  input.value = '';
}

/** Submit contact form — shows success feedback */
function submitContactForm(btn) {
  btn.textContent = 'Request Sent! ✓';
  btn.disabled = true;
  btn.style.background = '#10b981';
  setTimeout(() => {
    btn.textContent = 'Request Custom Quote';
    btn.disabled = false;
    btn.style.background = '';
  }, 3000);
}
