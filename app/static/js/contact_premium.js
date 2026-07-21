/* ============================================================
   Contact Premium — JavaScript
   Particles · Spotlight · Copy · Magnetic Button · Typing
============================================================ */

(function () {
  'use strict';

  /* ── 1. Spotlight effect ──────────────────────────────────── */
  function initSpotlight() {
    const spotlight = document.getElementById('cpSpotlight');
    if (!spotlight) return;
    let visible = false;
    document.addEventListener('mousemove', (e) => {
      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top  = e.clientY + 'px';
      if (!visible) {
        visible = true;
        spotlight.style.opacity = '1';
      }
    });
    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
      visible = false;
    });
  }

  /* ── 2. Floating particles ────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('cp-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function isDark() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = [];
    const COUNT = 55;

    function makeParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
      };
    }

    for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

    function getColor() {
      return isDark()
        ? 'rgba(0,255,136,'
        : 'rgba(8,145,178,';
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const col = getColor();

      particles.forEach((p) => {
        p.pulse += p.pulseSpeed;
        const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col + alpha + ')';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      });

      // Draw faint connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = col + (0.06 * (1 - dist / 110)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── 3. Copy to clipboard (email card) ───────────────────── */
  function initCopyCards() {
    const emailCard = document.getElementById('cpEmailCard');
    const toast = document.getElementById('cpCopiedToast');
    if (!emailCard || !toast) return;

    emailCard.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'krishansharma995060@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        toast.textContent = '✓ Email copied to clipboard!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2400);
      }).catch(() => {
        // Fallback: open mailto
        window.location.href = 'mailto:' + email;
      });
    });
  }

  /* ── 4. Magnetic button effect ───────────────────────────── */
  function initMagnetic() {
    const btn = document.getElementById('cpSubmitBtn');
    if (!btn) return;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0) scale(1)';
    });
  }

  /* ── 5. Premium contact form submit (EmailJS) ────────────── */
  function initContactForm() {
    const form = document.getElementById('cpContactForm');
    const btn  = document.getElementById('cpSubmitBtn');
    if (!form || !btn) return;

    const EMAILJS_SERVICE  = 'service_mp9u6gh';
    const EMAILJS_TEMPLATE = 'template_73skj0n';

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const label   = btn.querySelector('.cp-btn-label');
      const spinner = btn.querySelector('.cp-spinner');

      // ── Validation ──────────────────────────────────────────
      const nameVal  = (form.querySelector('[name="name"]')?.value  || '').trim();
      const emailVal = (form.querySelector('[name="email"]')?.value || '').trim();
      const msgVal   = (form.querySelector('[name="message"]')?.value || '').trim();

      if (!nameVal) {
        if (window.showToast) showToast('Please enter your name.', 'error');
        form.querySelector('[name="name"]')?.focus();
        return;
      }
      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        if (window.showToast) showToast('Please enter a valid email address.', 'error');
        form.querySelector('[name="email"]')?.focus();
        return;
      }
      if (!msgVal || msgVal.length < 10) {
        if (window.showToast) showToast('Message must be at least 10 characters.', 'error');
        form.querySelector('[name="message"]')?.focus();
        return;
      }

      // ── Loading state ────────────────────────────────────────
      btn.disabled = true;
      btn.classList.add('loading');
      if (label) label.innerHTML = '<span style="font-size:0.85em;letter-spacing:0.04em">Sending...</span>';

      // ── EmailJS payload (matches template variables exactly) ─
      const templateParams = {
        from_name       : nameVal,
        from_email      : emailVal,
        message         : msgVal,
        form_type       : 'Contact',
        project_details : '',
        budget          : '',
        timeline        : ''
      };

      emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams)
        .then(function() {
          btn.classList.remove('loading');
          btn.classList.add('success');
          if (label) label.innerHTML = '<i class="fas fa-check"></i> Sent!';
          form.reset();
          if (window.showToast) showToast('Message sent successfully! I\'ll reply within 24 hours.', 'success');
          setTimeout(function() {
            btn.classList.remove('success');
            if (label) label.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.disabled = false;
          }, 3500);
        })
        .catch(function(err) {
          console.error('EmailJS error:', err);
          if (window.showToast) showToast('Failed to send. Please email me directly at krishansharma995060@gmail.com', 'error');
          btn.classList.remove('loading');
          if (label) label.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.disabled = false;
        });
    });
  }

  /* ── 6. Scroll reveal ────────────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.cp-reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach((el) => obs.observe(el));
  }

  /* ── 7. Typing animation (Projects Coming Soon) ─────────── */
  function initComingSoonTyping() {
    const el = document.getElementById('pjCsTyping');
    if (!el) return;

    const phrases = [
      'AI Agents & Automation',
      'Backend APIs (FastAPI)',
      'ML Model Deployment',
      'Computer Vision Projects',
      'LLM Integrations',
    ];

    let pIdx = 0, cIdx = 0, deleting = false;

    // Add cursor span
    const cursor = document.createElement('span');
    cursor.className = 'pj-cs-cursor';
    el.appendChild(cursor);

    let textNode = document.createTextNode('');
    el.insertBefore(textNode, cursor);

    function type() {
      const phrase = phrases[pIdx];
      if (!deleting) {
        textNode.textContent = phrase.slice(0, ++cIdx);
        if (cIdx === phrase.length) {
          deleting = true;
          return setTimeout(type, 2000);
        }
        setTimeout(type, 70);
      } else {
        textNode.textContent = phrase.slice(0, --cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          return setTimeout(type, 400);
        }
        setTimeout(type, 38);
      }
    }
    setTimeout(type, 800);
  }

  /* ── Init all ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initSpotlight();
    initParticles();
    initCopyCards();
    initMagnetic();
    initContactForm();
    initScrollReveal();
    initComingSoonTyping();
  });
})();
