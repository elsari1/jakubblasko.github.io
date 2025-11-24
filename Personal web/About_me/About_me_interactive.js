// Scroll-triggered reveals: headings trigger staggered text when centered
(function initReveal() {
  const start = () => {
    const blocks = document.querySelectorAll('.about-block');
    const titles = document.querySelectorAll('.section-title');
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

    const revealAll = () => {
      blocks.forEach((block) => {
        revealBlock(block, false);
      });
      lines.forEach((line) => line.classList.add('is-visible'));
      footer?.classList.add('is-visible');
    };

    const revealBlock = (block, animate = true) => {
      if (!block || block.classList.contains('is-visible')) return;
      block.classList.add('is-visible');
      const title = block.querySelector('.section-title');
      if (title) title.classList.add('is-visible');
      const ps = block.querySelectorAll('.section-text');
      let delay = animate ? 0.05 : 0;
      ps.forEach((p) => {
        p.classList.add('is-visible');
        p.style.animation = 'textReveal 1.2s steps(14) forwards';
        p.style.animationDelay = `${delay}s`;
        delay += animate ? 0.25 : 0;
      });
    };

    if (typeof IntersectionObserver !== 'function') {
      revealAll();
      return;
    }

    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const titleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.intersectionRatio < 0.5) return;
          const block = entry.target.closest('.about-block');
          revealBlock(block);
        });
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: '-25% 0px -25% 0px' }
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

    lines.forEach((line) => lineObserver.observe(line));
    titles.forEach((title) => titleObserver.observe(title));
    footerObserver?.observe(footer);

    if (blocks[0]) {
      revealBlock(blocks[0]);
      if (lines[0]) lines[0].classList.add('is-visible');
    }

    const mid = window.innerHeight / 2;
    titles.forEach((title) => {
      const rect = title.getBoundingClientRect();
      if (rect.top <= mid && rect.bottom >= mid) {
        const block = title.closest('.about-block');
        revealBlock(block);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
