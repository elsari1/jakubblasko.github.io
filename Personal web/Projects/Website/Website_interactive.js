document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.detail-block');
  const lines = document.querySelectorAll('.section-line');
  const footer = document.querySelector('.mini-footer');

  const revealPage = () => document.body.classList.add('is-page-visible');
  revealPage();
  window.addEventListener('pageshow', revealPage);

  const setupSmoothLinks = () => {
    const links = document.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank' ||
        link.hasAttribute('download')
      ) {
        return;
      }
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('is-page-exiting');
        setTimeout(() => {
          window.location.href = href;
        }, 180);
      });
    });
  };

  const setupBackButton = () => {
    const backBtn = document.querySelector('.back-button');
    if (!backBtn) return;
    const fallback = backBtn.getAttribute('data-home');
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else if (fallback) {
        window.location.href = fallback;
      }
    });
  };

  setupBackButton();
  setupSmoothLinks();

  const revealBlock = (block, animate = true) => {
    if (!block || block.classList.contains('is-visible')) return;
    block.classList.add('is-visible');

    const pageTitle = block.querySelector('.page-title');
    if (pageTitle) pageTitle.classList.add('is-visible');

    const sectionTitle = block.querySelector('.section-title');
    if (sectionTitle) sectionTitle.classList.add('is-visible');

    const texts = block.querySelectorAll('.section-text');
    let delay = animate ? 0.1 : 0;
    texts.forEach((p) => {
      p.classList.add('is-visible');
      p.style.animationDelay = `${delay}s`;
      delay += animate ? 0.25 : 0;
    });
  };

  const revealAll = () => {
    blocks.forEach((block) => revealBlock(block, false));
    lines.forEach((line) => line.classList.add('is-visible'));
    footer?.classList.add('is-visible');
  };

  if (typeof IntersectionObserver !== 'function') {
    revealAll();
    return;
  }

  const blockObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealBlock(entry.target);
        }
      });
    },
    { threshold: [0.25, 0.5, 0.7], rootMargin: '-18% 0px -18% 0px' }
  );

  const lineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -12% 0px' }
  );

  const footerObserver =
    footer &&
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );

  blocks.forEach((block) => blockObserver.observe(block));
  lines.forEach((line) => lineObserver.observe(line));
  footerObserver?.observe(footer);

  if (blocks[0]) revealBlock(blocks[0], false);
  if (lines[0]) lines[0].classList.add('is-visible');
});
