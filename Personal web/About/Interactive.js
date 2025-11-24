document.addEventListener('DOMContentLoaded', () => {
  initPageFade();
  initIntroAnimations();
  setupNavigation();
  setupSocialLinks();
  setupHoverEffects();
});

function initPageFade() {
  const revealPage = () => document.body.classList.add('is-page-visible');
  revealPage();
  window.addEventListener('pageshow', revealPage);
}

// Spuštění vstupních animací se zpožděním
function initIntroAnimations() {
  const intro = [
    { selector: '.name', delay: 0 },
    { selector: '.role', delay: 1500 },
    { selector: '.motto', delay: 2500 },
  ];

  intro.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (el) {
      el.classList.add('anim-item');
      el.style.setProperty('--delay', `${delay}ms`);
    }
  });

  const sections = document.querySelectorAll('.section-block');
  sections.forEach((el, idx) => {
    const delay = 3500 + idx * 800;
    el.classList.add('anim-item');
    el.style.setProperty('--delay', `${delay}ms`);
  });

  const socials = document.querySelectorAll('.social-link');
  const footer = document.querySelector('.mini-footer');
  const tailDelay = 6500;

  socials.forEach((el) => {
    el.classList.add('anim-item');
    el.style.setProperty('--delay', `${tailDelay}ms`);
  });

  if (footer) {
    footer.classList.add('anim-item');
    footer.style.setProperty('--delay', `${tailDelay}ms`);
  }
}

// Navigace na podstránky (fade-out + redirect)
function setupNavigation() {
  const targets = document.querySelectorAll('.nav-card');
  let isLeaving = false;
  const overlay = ensurePageOverlay();

  function ensurePageOverlay() {
    const existing = document.querySelector('.page-transition');
    if (existing) return existing;
    const el = document.createElement('div');
    el.className = 'page-transition';
    document.body.appendChild(el);
    return el;
  }

  const startTransition = (url) => {
    if (isLeaving) return;
    isLeaving = true;
    document.body.classList.add('is-page-exiting');
    document.body.classList.add('is-fading-out');
    if (overlay) overlay.classList.add('is-active');
    setTimeout(() => {
      window.location.href = url;
    }, 1600);
  };

  targets.forEach((el) => {
    const url = el.getAttribute('data-target');
    if (!url) return;

    const handler = (evt) => {
      evt.preventDefault();
      startTransition(url);
    };

    el.addEventListener('click', handler);
    el.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        handler(evt);
      }
    });
  });
}

// Klikací sociální odkazy (nové okno + krátká animace)
function setupSocialLinks() {
  const socials = document.querySelectorAll('.social-link[data-url]');
  socials.forEach((link) => {
    const url = link.getAttribute('data-url');
    if (!url) return;

    link.addEventListener('click', (evt) => {
      evt.preventDefault();
      link.classList.add('is-active');
      setTimeout(() => link.classList.remove('is-active'), 180);
      window.open(url, '_blank', 'noopener');
    });
  });
}

// Hover efekty přidávané třídami
function setupHoverEffects() {
  const hoverables = [
    ...document.querySelectorAll('.nav-card'),
    ...document.querySelectorAll('.social-link'),
  ];

  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => el.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => el.classList.remove('is-hovered'));
    el.addEventListener('focus', () => el.classList.add('is-hovered'));
    el.addEventListener('blur', () => el.classList.remove('is-hovered'));
  });
}
