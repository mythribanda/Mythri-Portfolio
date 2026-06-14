document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('show');
      menuIcon?.classList.toggle('hidden');
      closeIcon?.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('show');
        menuIcon?.classList.remove('hidden');
        closeIcon?.classList.add('hidden');
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon = document.querySelector('.moon');
  const sunIcon = document.querySelector('.sun');

  const syncIcons = (isDark) => {
    moonIcon?.classList.toggle('hidden', !isDark);
    sunIcon?.classList.toggle('hidden', isDark);
  };

  syncIcons(document.documentElement.classList.contains('dark'));

  themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    syncIcons(isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); }
    catch (e) {}
  });

  // Sticky header
  const header = document.getElementById('header');
  const onScroll = () => { if (header) header.classList.toggle('scrolled', window.scrollY > 50); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll to top
  document.getElementById('scroll-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  // Contact
  const WEB3FORMS_ACCESS_KEY = 'a88e7578-cbc7-40ab-9282-0da3f345010f';

  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = contactForm?.querySelector('button[type="submit"]');

  const showStatus = (msg, ok) => {
    if (!formSuccess) return;
    formSuccess.textContent = msg;
    formSuccess.style.display = 'block';
    formSuccess.style.color = ok ? '#16a34a' : '#dc2626';
    formSuccess.style.borderColor = ok ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)';
    formSuccess.style.background = ok ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)';
  };

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const subject = document.getElementById('subject')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR-ACCESS-KEY-HERE') {
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href = `mailto:bandamythri@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showStatus('Opening your mail app… (set up Web3Forms to send directly)', true);
      return;
    }

    const original = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name, email, subject,
          message,
          from_name: 'Portfolio Contact Form',
          botcheck: document.getElementById('botcheck')?.checked || false
        })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('Thanks — your message has been sent.', true);
        contactForm.reset();
      } else {
        showStatus('Something went wrong. Please email bandamythri@gmail.com directly.', false);
      }
    } catch (err) {
      showStatus('Network error. Please email bandamythri@gmail.com directly.', false);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = original; }
      setTimeout(() => { if (formSuccess) formSuccess.style.display = 'none'; }, 8000);
    }
  });

  // Resume
  const downloadBtn = document.getElementById('download-resume');
  downloadBtn?.addEventListener('click', (e) => {
    const url = downloadBtn.getAttribute('href');
    fetch(url, { method: 'HEAD' })
      .then(res => {
        if (!res.ok) {
          e.preventDefault();
          alert('Resume file not found yet. Add your PDF at:  public/Mythri_Raj_Banda_Resume.pdf');
        }
      })
      .catch(() => {});
  });

  // Projects
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');

  const fillSkillBars = (root) => {
    root.querySelectorAll('.skill-progress').forEach(bar => {
      const w = bar.getAttribute('data-width');
      if (w) bar.style.width = w;
    });
  };

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced) { el.textContent = target + suffix; return; }
    
    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        fillSkillBars(el);
        el.querySelectorAll('.stat-num').forEach(animateCounter);
        if (el.classList.contains('stat-num')) animateCounter(el);
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.projects-grid .reveal, .skills-categories .reveal').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 6) * 0.06}s`);
    });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => { el.classList.add('is-visible'); fillSkillBars(el); });
    document.querySelectorAll('.stat-num').forEach(animateCounter);
  }

  // Hero
  const rotator = document.getElementById('role-rotator');
  if (rotator) {
    const roles = [
      'AI & ML products',
      'data pipelines',
      'full-stack web apps',
      'analytics dashboards'
    ];
    if (prefersReduced) {
      rotator.textContent = roles[0];
    } else {
      let r = 0, c = 0, deleting = false;
      const tick = () => {
        const word = roles[r];
        c += deleting ? -1 : 1;
        rotator.textContent = word.slice(0, c);
        
        let delay = deleting ? 45 : 90;
        if (!deleting && c === word.length) { 
          delay = 1600;
          deleting = true; 
        } else if (deleting && c === 0) { 
          deleting = false; 
          r = (r + 1) % roles.length;
          delay = 350;
        }
        setTimeout(tick, delay);
      };
      tick();
    }
  }

});