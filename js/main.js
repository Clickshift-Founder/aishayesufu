/* ================================================================
   AISHA4SENATE — Main JavaScript
   Scroll reveals, counters, mobile nav, FAQ, flip cards, marquee
   ================================================================ */

(function () {
  'use strict';

  /* ── NAVIGATION ─────────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active link
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Mobile nav toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });
  mobileLinks.forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── SCROLL REVEAL ───────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── ANIMATED COUNTERS ───────────────────────────────────────── */
  function animateCounter(el, target, duration = 2000, prefix = '', suffix = '') {
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * eased;
      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.counted) {
          e.target.dataset.counted = 'true';
          const target = parseFloat(e.target.dataset.target);
          const prefix = e.target.dataset.prefix || '';
          const suffix = e.target.dataset.suffix || '';
          animateCounter(e.target, target, 2000, prefix, suffix);
        }
      });
    },
    { threshold: 0.3 }
  );
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── PROGRESS BARS ───────────────────────────────────────────── */
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const fill = e.target;
          fill.style.width = fill.dataset.width || '0%';
          progressObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.2 }
  );
  document.querySelectorAll('.progress-fill, .mini-fill').forEach(el => {
    el.style.width = '0%';
    progressObserver.observe(el);
  });

  /* ── FAQ ACCORDIONS ──────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ── FAQ TABS ────────────────────────────────────────────────── */
  const faqTabs = document.querySelectorAll('.faq-tab');
  faqTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      faqTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      document.querySelectorAll('.faq-item').forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── FLIP CARDS (touch support) ──────────────────────────────── */
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  /* ── MARQUEE DUPLICATE ───────────────────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const clone = marqueeTrack.cloneNode(true);
    marqueeTrack.parentElement.appendChild(clone);
  }

  /* ── SMOOTH ANCHOR SCROLLING ─────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── FORM SUBMISSION (demo) ──────────────────────────────────── */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (!btn) return;
      const orig = btn.textContent;
      btn.textContent = 'Submitting...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Submitted! Thank you.';
        btn.style.background = 'var(--green-mid)';
        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled = false;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }, 1200);
    });
  });

  /* ── PILLAR CARDS HOVER STAGGER ──────────────────────────────── */
  document.querySelectorAll('.pillar-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.05}s`;
  });

  /* ── SCROLL INDICATOR HIDE ───────────────────────────────────── */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '';
    }, { passive: true });
  }

  /* ── HERO PARALLAX ───────────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg-image');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      heroBg.style.transform = `translateY(${scroll * 0.3}px)`;
    }, { passive: true });
  }

  /* ── CHANT INTERACTIVE ───────────────────────────────────────── */
  const chantRows = document.querySelectorAll('.chant-row');
  chantRows.forEach((row, i) => {
    setTimeout(() => {
      row.style.opacity = '1';
      row.style.transform = 'none';
    }, 200 + i * 150);
    row.style.opacity = '0';
    row.style.transform = 'translateY(20px)';
    row.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const chantObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        chantRows.forEach((row, i) => {
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'none';
          }, i * 200);
        });
        chantObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  const chantSection = document.querySelector('.chant-section');
  if (chantSection) chantObserver.observe(chantSection);

  /* ── EVENTS FILTER ───────────────────────────────────────────── */
  const eventFilters = document.querySelectorAll('[data-event-filter]');
  eventFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      eventFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.eventFilter;
      document.querySelectorAll('.event-card').forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── MEDIA FILTERS ───────────────────────────────────────────── */
  const mediaFilters = document.querySelectorAll('[data-media-filter]');
  mediaFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      mediaFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.mediaFilter;
      document.querySelectorAll('.media-card').forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── WARD CHAMPION FOCUS ─────────────────────────────────────── */
  document.querySelectorAll('.council-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const dots = card.querySelectorAll('.ward-dot.pending');
      dots.forEach((dot, i) => {
        setTimeout(() => {
          dot.style.background = 'rgba(201,162,39,0.5)';
        }, i * 50);
      });
    });
    card.addEventListener('mouseleave', () => {
      card.querySelectorAll('.ward-dot.pending').forEach(dot => {
        dot.style.background = '';
      });
    });
  });

  /* ── TYPING HEADLINE EFFECT (hero) ──────────────────────────── */
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const phrases = ['A BETTER ABUJA', 'SECURITY FOR ALL', 'YOUR RIGHTS MATTER', 'REAL CHANGE NOW'];
    let pi = 0, ci = 0, deleting = false;
    function type() {
      const phrase = phrases[pi];
      if (!deleting) {
        typedEl.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        typedEl.textContent = phrase.slice(0, --ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
        }
      }
      setTimeout(type, deleting ? 50 : 80);
    }
    setTimeout(type, 3000);
  }

  console.log('%c🇳🇬 AISHA4SENATE — A Better Abuja For All Of Us', 
    'font-size:14px;font-weight:bold;color:#C9A227;background:#0B3D20;padding:8px 16px;border-radius:4px');
})();
