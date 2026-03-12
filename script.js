const pages = [
  ['index.html', 'Home'],
  ['services.html', 'Services'],
  ['results.html', 'Results'],
  ['about.html', 'About'],
  ['contact.html', 'Contact']
];

const current = window.location.pathname.split('/').pop() || 'index.html';

const headerHTML = `
<header class="site-header">
  <div class="container nav-wrap">
    <a href="index.html" class="brand" aria-label="CKY Property Restore LLC home">
      <img src="assets/logo.svg" alt="CKY Property Restore logo" class="brand-logo" />
    </a>
    <nav class="nav-links" aria-label="Main navigation">
      ${pages.map(([href, label]) => `<a href="${href}" class="${current === href ? 'active' : ''}">${label}</a>`).join('')}
    </nav>
  </div>
</header>`;

const footerHTML = `
<footer class="site-footer">
  <div class="container footer-grid">
    <strong>CKY Property Restore LLC</strong>
    <span>Central Kentucky • Licensed & Insured • Free Estimates • No Hidden Fees</span>
    <span>Phone: <a href="tel:+16063021790">(606) 302-1790</a></span>
    <span>Keywords: junk removal Central Kentucky • demolition services Central Kentucky • property cleanup Central Kentucky • shrub removal Central Kentucky • stump grinding Central Kentucky • junk hauling near me • property restoration Kentucky</span>
  </div>
</footer>`;

const headerMount = document.getElementById('site-header');
if (headerMount) headerMount.innerHTML = headerHTML;
const footerMount = document.getElementById('site-footer');
if (footerMount) footerMount.innerHTML = footerHTML;

const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.result-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const selected = button.dataset.filter;
    cards.forEach((card) => {
      card.style.display = selected === 'all' || card.dataset.category === selected ? 'block' : 'none';
    });
  });
});

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
