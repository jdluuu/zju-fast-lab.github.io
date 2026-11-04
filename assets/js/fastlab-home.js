(() => {
  const carousel = document.querySelector('[data-fastlab-carousel]');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('.fastlab-slide')];
  if (slides.length < 2) return;

  const dots = [...carousel.querySelectorAll('[data-slide-index]')];
  const pause = carousel.querySelector('[data-carousel-pause]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reducedMotion.matches;
  let hovering = false;
  let timer;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      dots[i].setAttribute('aria-pressed', String(i === current));
    });
  }

  function schedule() {
    window.clearInterval(timer);
    if (!paused && !hovering && !document.hidden && !carousel.contains(document.activeElement)) {
      timer = window.setInterval(() => show(current + 1), 5000);
    }
  }

  function updatePause() {
    pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    pause.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
    schedule();
  }

  carousel.querySelector('.fastlab-carousel-controls').hidden = false;
  carousel.querySelectorAll('[data-slide-step]').forEach(button => {
    button.addEventListener('click', () => {
      show(current + Number(button.dataset.slideStep));
      schedule();
    });
  });
  dots.forEach((button, i) => button.addEventListener('click', () => {
    show(i);
    schedule();
  }));
  pause.addEventListener('click', () => {
    paused = !paused;
    updatePause();
  });
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
      schedule();
    }
  });
  carousel.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => window.setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updatePause(); });
  updatePause();
})();
