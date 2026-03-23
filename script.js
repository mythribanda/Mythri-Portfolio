/* ═══════════════════════════════════════════════
   MYTHRI RAJ BANDA — PORTFOLIO SCRIPTS
   script.js
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Footer Year ──────────────────────────── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Mobile Menu ──────────────────────────── */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon   = document.querySelector('.menu-icon');
  const closeIcon  = document.querySelector('.close-icon');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('show');
      menuIcon?.classList.toggle('hidden');
      closeIcon?.classList.toggle('hidden');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        menuIcon?.classList.remove('hidden');
        closeIcon?.classList.add('hidden');
      });
    });
  }

  /* ── Smooth Scroll ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── Dark / Light Mode ────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon    = document.querySelector('.moon');
  const sunIcon     = document.querySelector('.sun');

  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    moonIcon?.classList.toggle('hidden', !isDark);
    sunIcon?.classList.toggle('hidden', isDark);
  };

  const savedTheme  = localStorage.getItem('theme');
  const systemDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme === 'dark' || (!savedTheme && systemDark));

  themeToggle?.addEventListener('click', () => {
    const isDark = !document.documentElement.classList.contains('dark');
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  /* ── Sticky Header ────────────────────────── */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Scroll-to-Top Button ─────────────────── */
  const scrollTopBtn = document.getElementById('scroll-top');
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Contact Form ─────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (formSuccess) {
      formSuccess.style.display = 'block';
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }
    contactForm.reset();
  });

  /* ── Resume Download ──────────────────────── */
  const downloadBtn = document.getElementById('download-resume');
  downloadBtn?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href     = 'public/Mythri Resume.pdf';
    link.download = 'Mythri_Raj_Banda_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  /* ── Project Filter Tabs ──────────────────── */
  const filterTabs  = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      // Show / hide cards
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

});
