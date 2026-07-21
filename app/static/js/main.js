/* ============================================================
   FreelanceHub — Main JavaScript
   Theme toggle, navbar, animations, typewriter, counters
============================================================ */

/* ── Theme ────────────────────────────────────────────────────── */
const ThemeManager = (() => {
  const root = document.documentElement;
  const key  = 'fh_theme';

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.className = theme === 'dark'
        ? 'fas fa-sun theme-icon'
        : 'fas fa-moon theme-icon';
    }
  }

  function init() {
    const saved = localStorage.getItem(key) || 'dark';
    apply(saved);
  }

  function toggle() {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(key, next);
    apply(next);
  }

  return { init, toggle };
})();

ThemeManager.init();

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Theme toggle button ─────────────────────────────────────
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', ThemeManager.toggle);
  }

  // ── Mobile menu ─────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose  = document.getElementById('menuClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    menuClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) mobileMenu.classList.remove('open');
    });
  }

  // ── Active navbar link ─────────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
      link.classList.add('active');
    }
  });

  // ── Typewriter effect (hero) ────────────────────────────────
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const phrases = [
      'ML Engineer',
      'Python Developer',
      'AI Systems Builder',
      'FastAPI & Flask Dev',
      'Intelligent Automation'
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        typeTarget.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) {
          deleting = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 75);
      } else {
        typeTarget.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 350);
          return;
        }
        setTimeout(type, 38);
      }
    }
    setTimeout(type, 1200);
  }

  // ── Stats counter animation ─────────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ── Scroll reveal via IntersectionObserver ──────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);

          // Trigger counter animation
          if (entry.target.classList.contains('counter-val')) {
            animateCounter(entry.target);
          }

          // Trigger skill bar animation
          entry.target.querySelectorAll?.('.skill-bar__fill').forEach(bar => {
            bar.style.width = bar.dataset.width;
          });
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal, .counter-val').forEach(el => {
    revealObserver.observe(el);
  });

  // Skill bars — observe them individually
  document.querySelectorAll('.skill-bar__fill').forEach(bar => {
    revealObserver.observe(bar.closest('.skill-bar'));
  });

  // ── Smooth scroll for anchor links ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Scroll-to-top button ────────────────────────────────────
  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      scrollTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Toast notifications (client-side) ──────────────────────
  window.showToast = function(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // ── Auto-dismiss flash messages ─────────────────────────────
  document.querySelectorAll('.alert[data-auto-dismiss]').forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.marginBottom = '0';
      setTimeout(() => alert.remove(), 300);
    }, 4000);
  });

  // (Contact form is handled exclusively by contact_premium.js via EmailJS)

  // ── File drop zone ──────────────────────────────────────────
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length) {
        const dt = new DataTransfer();
        dt.items.add(files[0]);
        fileInput.files = dt.files;
        updateDropZoneLabel(files[0].name);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        updateDropZoneLabel(fileInput.files[0].name);
      }
    });

    function updateDropZoneLabel(name) {
      const label = dropZone.querySelector('.drop-label');
      if (label) label.textContent = `Selected: ${name}`;
    }
  }

  console.log('%c[ML_DEV] 🤖 Portfolio loaded ⚡', 'color:#00ff88;font-size:16px;font-weight:bold;font-family:monospace;');
});

/* ── Global Image Lightbox Feature ────────────────────────────── */
(function() {
  function initLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox || !lightboxImg) return;

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = alt || 'Krishan Sharma';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Attach to all profile photos & elements with data-lightbox
    document.addEventListener('click', function(e) {
      const avatar = e.target.closest('.ks-avatar, .hire-me-avatar, [data-lightbox]');
      if (avatar) {
        const img = avatar.querySelector('img') || (avatar.tagName === 'IMG' ? avatar : null);
        if (img && img.src) {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(img.src, img.alt || 'Krishan Sharma');
        }
      }
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
