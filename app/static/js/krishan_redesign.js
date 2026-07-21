/* ============================================================
   Krishan Sharma Portfolio — Premium JS
   Animated Counters · Skill Ring Progress · Floating Particles
   Scroll Reveal · Skill Tab Filtering
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Scroll Reveal ──────────────────────────────────── */
  function initScrollReveal() {
    const items = document.querySelectorAll('.ks-reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ks-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(el => observer.observe(el));
  }

  /* ── 2. Animated Counters ──────────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const isFloat = !Number.isInteger(target);
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('.ks-counter-num[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── 3. Circular Progress Rings ────────────────────────── */
  function initSkillRings() {
    const rings = document.querySelectorAll('.ks-progress-ring__fill[data-pct]');
    if (!rings.length) return;

    const CIRCUMFERENCE = 282.6; // 2 * π * 45

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const pct = parseInt(fill.dataset.pct, 10);
          const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
          // Small delay for stagger effect
          const card = fill.closest('.ks-skill-card');
          const delay = card ? parseInt(card.dataset.delay || 0, 10) : 0;
          setTimeout(() => {
            fill.style.strokeDashoffset = offset;
          }, delay);
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });

    rings.forEach(ring => observer.observe(ring));
  }

  /* ── 4. Skill Tab Filtering ────────────────────────────── */
  function initSkillTabs() {
    const tabs = document.querySelectorAll('.ks-skill-tab');
    const cards = document.querySelectorAll('.ks-skill-card');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.cat;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── 5. Floating Skill Particles ───────────────────────── */
  function initSkillParticles() {
    const canvas = document.getElementById('ks-skill-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const colors = [
      'rgba(0,255,136,', 
      'rgba(0,229,255,', 
      'rgba(168,85,247,'
    ];

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.1,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });
      requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    });
  }

  /* ── 6. Card tilt effect ───────────────────────────────── */
  function initCardTilt() {
    const cards = document.querySelectorAll('.ks-skill-card, .ks-profile-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * 5;
        const tiltY = (x / rect.width) * -5;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── 7. Counter cards hover spark ─────────────────────── */
  function initCounterHover() {
    const cards = document.querySelectorAll('.ks-counter-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const num = card.querySelector('.ks-counter-num');
        if (num) num.style.textShadow = '0 0 20px rgba(0,255,136,0.5)';
      });
      card.addEventListener('mouseleave', () => {
        const num = card.querySelector('.ks-counter-num');
        if (num) num.style.textShadow = '';
      });
    });
  }

  /* ── Init ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initSkillRings();
    initSkillTabs();
    initSkillParticles();
    initCardTilt();
    initCounterHover();
  });
})();
