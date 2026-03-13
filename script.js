const pages = [
  ['index.html', 'Home'],
  ['services.html', 'Services'],
  ['results.html', 'Results'],
  ['about.html', 'About'],
  ['contact.html', 'Contact']
];

const current = window.location.pathname.split('/').pop() || 'index.html';
const isHomePage = current === 'index.html';

if (isHomePage) {
  document.body.classList.add('is-home');
}

const navLinks = pages.map(([href, label]) => {
  const className = current === href ? 'active' : '';

  if (isHomePage) {
    const anchorId = label.toLowerCase();
    return `<a href="#${anchorId}" data-nav-target="${anchorId}" class="${className}">${label}</a>`;
  }

  return `<a href="${href}" class="${className}">${label}</a>`;
}).join('');

const headerHTML = `
<header class="site-header" id="global-header">
  <div class="scroll-progress" aria-hidden="true"></div>
  <div class="container nav-wrap">
    <a href="index.html" class="brand" aria-label="CKY Property Restore LLC home">
      <img src="assets/logo.png" alt="CKY Property Restore logo" class="brand-logo" />
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">Menu</button>
    <nav class="nav-links" id="main-nav" aria-label="Main navigation">
      ${navLinks}
    </nav>
  </div>
</header>`;

const footerHTML = `
<footer class="site-footer">
  <div class="container footer-grid">
    <strong>CKY Property Restore LLC</strong>
    <span>Central Kentucky • Licensed & Insured • Free Estimates • No Hidden Fees</span>
    <span>Phone: <a href="tel:+16063021790">(606) 302-1790</a></span>
  </div>
</footer>`;

const headerMount = document.getElementById('site-header');
if (headerMount) headerMount.innerHTML = headerHTML;
const footerMount = document.getElementById('site-footer');
if (footerMount) footerMount.innerHTML = footerHTML;

const header = document.getElementById('global-header');
const root = document.documentElement;
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
const progressBar = document.querySelector('.scroll-progress');

const setHeaderOffset = () => {
  if (!header) return;

  const hadScrolledClass = header.classList.contains('is-scrolled');
  if (hadScrolledClass) header.classList.remove('is-scrolled');
  const headerHeight = header.offsetHeight;
  if (hadScrolledClass) header.classList.add('is-scrolled');

  root.style.setProperty('--header-offset', `${headerHeight}px`);
};

const syncHeaderState = () => {
  if (!header) return;
  const scrolled = window.scrollY > 30;
  header.classList.toggle('is-scrolled', scrolled);
};

setHeaderOffset();
syncHeaderState();

window.addEventListener('resize', setHeaderOffset, { passive: true });
window.addEventListener('load', setHeaderOffset);
window.addEventListener('scroll', () => {
  syncHeaderState();

  if (progressBar) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.transform = `scaleX(${percent / 100})`;
  }
}, { passive: true });

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    header?.classList.toggle('menu-open', isOpen);
    setHeaderOffset();
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      header?.classList.remove('menu-open');
      setHeaderOffset();
    });
  });
}

if (isHomePage) {
  const sectionLinks = document.querySelectorAll('a[data-nav-target]');
  const sections = document.querySelectorAll('[data-nav-section]');

  sectionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('data-nav-target');
      const target = document.getElementById(targetId);

      if (!target) return;

      event.preventDefault();
      const headerOffset = parseFloat(getComputedStyle(root).getPropertyValue('--header-offset')) || 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset + 6;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth'
      });

      history.replaceState(null, '', `#${targetId}`);
    });
  });

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const currentSection = entry.target.getAttribute('data-nav-section');
        sectionLinks.forEach((link) => {
          const isActive = link.getAttribute('data-nav-target') === currentSection;
          link.classList.toggle('active', isActive);
        });
      });
    }, {
      rootMargin: '-42% 0px -45% 0px',
      threshold: 0.01
    });

    sections.forEach((section) => navObserver.observe(section));
  }
}

const revealTargets = document.querySelectorAll(
  '.hero h1, .hero .lead, .hero p:not(.eyebrow), .hero .cta-row, .hero-image-wrap, .section-divider .container, .section-divider-light .container, .page-header, .card, .service-card, .results-header, .project-section, .about-story, .contact-layout, .cta-banner .container'
);

revealTargets.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.transitionDelay = `${Math.min(index % 6, 4) * 60}ms`;
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('in-view'));
}

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-image');
if (lightbox && lightboxImg) {
  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      lightboxImg.src = trigger.dataset.src;
      lightboxImg.alt = trigger.dataset.alt;
      lightbox.showModal();
    });
  });

  lightbox.addEventListener('click', (event) => {
    const closeBtn = event.target.closest('.lightbox-close');
    const clickedBackdrop = event.target === lightbox;
    if (closeBtn || clickedBackdrop) lightbox.close();
  });
}
