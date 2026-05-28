const yearTarget = document.getElementById('year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  const toggleNav = () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };

  navToggle.addEventListener('click', toggleNav);
  navToggle.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleNav();
    }
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

const anniversaryGallery = document.querySelector('[data-anniversary-gallery]');

if (anniversaryGallery) {
  const stage = anniversaryGallery.querySelector('[data-gallery-stage]');
  const image = anniversaryGallery.querySelector('[data-gallery-image]');
  const year = anniversaryGallery.querySelector('[data-gallery-year]');
  const title = anniversaryGallery.querySelector('[data-gallery-title]');
  const caption = anniversaryGallery.querySelector('[data-gallery-caption]');
  const previousButton = anniversaryGallery.querySelector('[data-gallery-prev]');
  const nextButton = anniversaryGallery.querySelector('[data-gallery-next]');
  const toggleButton = anniversaryGallery.querySelector('[data-gallery-toggle]');
  const toggleIcon = anniversaryGallery.querySelector('[data-gallery-toggle-icon]');
  const lightbox = document.querySelector('[data-gallery-lightbox]');
  const lightboxImage = document.querySelector('[data-gallery-lightbox-image]');
  const lightboxCloseButtons = Array.from(document.querySelectorAll('[data-gallery-lightbox-close]'));
  const stops = Array.from(anniversaryGallery.querySelectorAll('[data-gallery-index]'));
  let activeIndex = 0;
  let isPaused = false;
  let rotationTimer;

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    window.clearInterval(rotationTimer);
  };

  const setActiveSlide = (index) => {
    const activeStop = stops[index];
    if (!activeStop) {
      return;
    }

    activeIndex = index;
    image.src = activeStop.dataset.image;
    image.alt = activeStop.dataset.alt;
    if (year) {
      year.textContent = activeStop.dataset.year;
    }
    title.textContent = activeStop.dataset.title;
    caption.textContent = activeStop.dataset.text;

    stops.forEach((stop, stopIndex) => {
      const isActive = stopIndex === activeIndex;
      stop.classList.toggle('is-active', isActive);
      stop.setAttribute('aria-pressed', String(isActive));
    });
  };

  const restartRotation = () => {
    window.clearInterval(rotationTimer);
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches || stops.length < 2) {
      return;
    }

    rotationTimer = window.setInterval(() => {
      setActiveSlide((activeIndex + 1) % stops.length);
    }, 5000);
  };

  stops.forEach((stop, index) => {
    stop.addEventListener('click', (event) => {
      setActiveSlide(index);

      if (event.target.closest('.timeline-card img')) {
        openLightbox(stop.dataset.image, stop.dataset.alt);
        return;
      }

      restartRotation();
    });
  });

  stage.addEventListener('click', () => {
    openLightbox(image.src, image.alt);
  });

  previousButton.addEventListener('click', () => {
    setActiveSlide((activeIndex - 1 + stops.length) % stops.length);
    restartRotation();
  });

  nextButton.addEventListener('click', () => {
    setActiveSlide((activeIndex + 1) % stops.length);
    restartRotation();
  });

  toggleButton.addEventListener('click', () => {
    isPaused = !isPaused;
    toggleButton.setAttribute('aria-pressed', String(isPaused));
    toggleButton.setAttribute(
      'aria-label',
      isPaused ? 'Automatischen Bildwechsel fortsetzen' : 'Automatischen Bildwechsel pausieren'
    );
    toggleIcon.innerHTML = isPaused ? '&#9654;' : '&#10074;&#10074;';
    restartRotation();
  });

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    lightboxImage.alt = '';
    document.body.classList.remove('lightbox-open');
    restartRotation();
  };

  lightboxCloseButtons.forEach((button) => {
    button.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  setActiveSlide(0);
  restartRotation();
}
