/* ============================================================
   Krishan Sharma — Premium Projects Showcase JS
   Spotlight Tracking · Magnetic Buttons · Particle Canvas
   Chip Animations · Feature Checklist · Modal System
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     PROJECT DATA — Add more projects here to extend
  ────────────────────────────────────────────────────────── */
  const SHOWCASE_PROJECTS = [
    {
      id: 'binance-futures-bot',
      slug: 'binance-futures-bot',
      title: 'Binance Futures Trading Bot',
      tagline: 'Automated futures trading with intelligent execution and real-time market integration.',
      category: 'AI Trading / Automation / Python',
      icon: 'fas fa-chart-line',
      status: 'live',
      statusLabel: 'DEPLOYED',
      bannerImg: '/static/uploads/trading_bot_banner.png',
      github: 'https://github.com/krishansharma09/binance-futures-trading-bot',
      live: null, // set to URL string if demo is available
      desc: 'An automated trading system designed for Binance futures market execution. Enables strategy-based order management, automation workflows, and scalable backend architecture for handling market interactions efficiently.',
      overview: `Binance Futures Trading Bot is an automated trading system designed for futures market execution. It enables strategy-based order management, automation workflows, and scalable backend architecture for handling market interactions efficiently.

The bot is built to interface directly with Binance's Futures API, enabling real-time data fetching, intelligent order placement, and position management. The architecture is modular and extensible — designed to support multiple trading strategies without rewriting the core execution engine.`,
      tech: [
        { label: 'Python',       type: 'backend',  icon: 'fab fa-python' },
        { label: 'REST APIs',    type: 'api',      icon: 'fas fa-plug' },
        { label: 'PostgreSQL',   type: 'db',       icon: 'fas fa-database' },
        { label: 'Cloud Ready',  type: 'deploy',   icon: 'fas fa-cloud' },
        { label: 'Git + GitHub', type: 'vcs',      icon: 'fab fa-github' },
      ],
      features: [
        'Automated trade execution',
        'Futures market integration',
        'Strategy-based architecture',
        'Scalable backend',
        'Deployment ready',
        'Secure workflow',
      ],
      architecture: [
        { icon: 'fas fa-lightbulb',    title: 'Idea',        desc: 'Problem definition, strategy planning, and API feasibility study.' },
        { icon: 'fas fa-code',          title: 'Development', desc: 'Modular Python backend with REST API integration and strategy engine.' },
        { icon: 'fas fa-vial',          title: 'Testing',     desc: 'Sandbox testing on Binance Testnet with simulated market conditions.' },
        { icon: 'fas fa-rocket',        title: 'Deployment',  desc: 'Cloud-deployed with environment-based config and secure key management.' },
      ],
      stats: [
        { label: 'Status',    value: 'Live ✅' },
        { label: 'Type',      value: 'Automation' },
        { label: 'Category',  value: 'Trading Bot' },
        { label: 'Developer', value: 'Krishan Sharma' },
      ],
    },
    {
      id: 'personal-finance-dashboard',
      slug: 'personal-finance-dashboard',
      title: 'Personal Finance Dashboard',
      tagline: 'Upload a bank statement CSV and get instant, auto-categorized spending insights through interactive charts.',
      category: 'Finance / Data / Web App',
      icon: 'fas fa-chart-pie',
      status: 'built',
      statusLabel: 'BUILT',
      bannerImg: null,
      github: 'https://github.com/krishansharma09/Personal-Finance-Dashboard',
      live: null,
      desc: 'A web app that lets users upload a bank statement CSV and instantly see auto-categorized spending insights through interactive charts. Features keyword-based transaction categorization, summary cards, switchable chart types, and a sortable transactions table.',
      overview: `Personal Finance Dashboard is a full-stack web application that transforms raw bank statement CSVs into meaningful spending insights. Upload your CSV, and the app automatically categorizes every transaction using keyword-based rules — no manual input required.

The dashboard surfaces summary cards for income, expenses, and savings, alongside interactive charts that let you switch between pie, donut, and bar views for category breakdowns, and line or bar charts for monthly spending trends. A fully sortable transactions table completes the analytical suite.`,
      tech: [
        { label: 'Flask',        type: 'backend',  icon: 'fas fa-flask' },
        { label: 'Pandas',       type: 'backend',  icon: 'fas fa-table' },
        { label: 'Chart.js',     type: 'frontend', icon: 'fas fa-chart-bar' },
        { label: 'HTML/CSS/JS',  type: 'frontend', icon: 'fab fa-html5' },
        { label: 'CSV Upload',   type: 'feature',  icon: 'fas fa-file-csv' },
      ],
      features: [
        'CSV upload & parsing',
        'Keyword-based auto-categorization',
        'Income / Expenses / Savings cards',
        'Switchable pie, donut & bar charts',
        'Monthly trend line & bar chart',
        'Sortable transactions table',
      ],
      architecture: [
        { icon: 'fas fa-upload',      title: 'Upload',      desc: 'User uploads a bank statement CSV via a clean drag-and-drop interface.' },
        { icon: 'fas fa-table',       title: 'Parsing',     desc: 'Pandas reads and normalises the CSV, mapping columns to a standard schema.' },
        { icon: 'fas fa-tags',        title: 'Categorize',  desc: 'Keyword-based engine scans transaction descriptions and auto-assigns categories.' },
        { icon: 'fas fa-chart-pie',   title: 'Visualize',   desc: 'Chart.js renders interactive, switchable charts for category spend and monthly trends.' },
      ],
      stats: [
        { label: 'Status',    value: 'Built ✅' },
        { label: 'Type',      value: 'Web App' },
        { label: 'Category',  value: 'Finance / Data' },
        { label: 'Developer', value: 'Krishan Sharma' },
      ],
    },
  ];

  /* ──────────────────────────────────────────────────────────
     1. RENDER FEATURE CARD
  ────────────────────────────────────────────────────────── */
  function renderFeatureCard(project, index) {
    const techChips = project.tech.map(t =>
      `<span class="project-card__chip"><i class="${t.icon}"></i>${t.label}</span>`
    ).join('');

    const card = document.createElement('article');
    card.className = 'project-card pj-reveal';
    card.dataset.projectId = project.id;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${project.title} project details`);

    card.innerHTML = `
      <!-- Header: Top-left icon badge & status badge -->
      <div class="project-card__header">
        <div class="project-card__icon-badge">
          <i class="${project.icon}"></i>
        </div>
        <div class="project-card__status-badge">
          <span class="project-card__status-dot"></span> ${project.statusLabel}
        </div>
      </div>

      <!-- Info Panel -->
      <div class="project-card__info">
        <div class="project-card__category">// ${project.category.replace(/\s*\/\s*/g, ' · ').toUpperCase()}</div>
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__description">${project.desc}</p>
        <div class="project-card__tags">${techChips}</div>

        <div class="project-card__footer">
          <button class="project-card__btn-primary" data-open-modal="${project.id}" id="pj-view-details-${project.id}">
            View Details <i class="fas fa-arrow-right"></i>
          </button>
          ${project.github ? `
            <a href="${project.github}" target="_blank" rel="noopener" class="project-card__btn-gh" id="pj-gh-${project.id}" onclick="event.stopPropagation()">
              <i class="fab fa-github"></i> GitHub
            </a>
          ` : ''}
        </div>
      </div>
    `;

    // Spotlight tracking
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });

    // Tilt effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      card.style.transform = `perspective(1000px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    // Open modal on click / enter
    card.addEventListener('click', () => openModal(project.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(project.id);
      }
    });

    // "View Details" button click (don't bubble up to card again)
    card.querySelector(`[data-open-modal]`).addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(project.id);
    });

    // Magnetic button effect
    initMagneticBtn(card.querySelector('.pj-cta-btn'));

    return card;
  }

  /* ──────────────────────────────────────────────────────────
     2. RENDER MODAL
  ────────────────────────────────────────────────────────── */
  function renderModal(project) {
    const overlay = document.getElementById('pjModalOverlay');
    if (!overlay) return;

    const featuresHTML = project.features.map((f, i) => `
      <div class="pj-feature-item" style="--delay:${i * 0.08}s">
        <div class="pj-feature-check">
          <svg viewBox="0 0 12 12">
            <polyline class="check-path" style="--delay:${0.3 + i * 0.08}s" points="1.5,6 5,9.5 10.5,2.5"/>
          </svg>
        </div>
        <span>${f}</span>
      </div>`
    ).join('');

    const chipsHTML = project.tech.map((t, i) => `
      <span class="pj-modal-chip pj-modal-chip--${t.type}" style="transition-delay:${i * 0.07}s">
        <i class="${t.icon}"></i> ${t.label}
      </span>`
    ).join('');

    const archHTML = project.architecture.map((step, i) => `
      <div class="pj-arch-step" style="--delay:${i * 0.1}s">
        <div class="pj-arch-step__left">
          <div class="pj-arch-dot"><i class="${step.icon}"></i></div>
          <div class="pj-arch-line"></div>
        </div>
        <div class="pj-arch-card">
          <div class="pj-arch-card__title">${step.title}</div>
          <div class="pj-arch-card__desc">${step.desc}</div>
        </div>
      </div>`
    ).join('');

    const statsHTML = project.stats.map(s => `
      <div class="pj-stat-card">
        <div class="pj-stat-card__label">${s.label}</div>
        <div class="pj-stat-card__value">${s.value}</div>
      </div>`
    ).join('');

    const liveBtn = project.live
      ? `<a href="${project.live}" target="_blank" rel="noopener" class="pj-modal-btn-primary" id="pj-modal-live-${project.id}">
          <i class="fas fa-external-link-alt"></i> Live Demo
        </a>`
      : `<button class="pj-modal-btn-primary" disabled style="opacity:0.4;cursor:not-allowed;">
          <i class="fas fa-external-link-alt"></i> Live Demo (Soon)
        </button>`;

    overlay.querySelector('.pj-modal').innerHTML = `
      <button class="pj-modal__close" id="pjModalClose" aria-label="Close project details">
        <i class="fas fa-times"></i>
      </button>

      <!-- Hero Banner -->
      <div class="pj-modal-hero">
        ${project.bannerImg
          ? `<img class="pj-modal-hero__img" src="${project.bannerImg}" alt="${project.title} banner" />`
          : `<div style="width:100%;height:100%;background:linear-gradient(135deg,rgba(0,255,136,0.08),rgba(0,229,255,0.04))"></div>`
        }
        <div class="pj-modal-hero__overlay"></div>

        <!-- Floating icons -->
        <div class="pj-modal-hero__float-icons" aria-hidden="true">
          <i class="pj-banner-icon fas fa-chart-line" style="top:25%;left:5%"></i>
          <i class="pj-banner-icon fas fa-robot" style="top:60%;left:12%"></i>
          <i class="pj-banner-icon fas fa-bolt" style="top:30%;right:10%"></i>
          <i class="pj-banner-icon fab fa-python" style="top:70%;right:18%"></i>
          <i class="pj-banner-icon fas fa-coins" style="top:45%;left:40%"></i>
        </div>

        <div class="pj-modal-hero__content">
          <div class="pj-modal-hero__badges">
            <span class="pj-live-badge">
              <span class="pj-live-badge__dot"></span>
              ${project.statusLabel}
            </span>
            <span class="pj-cat-badge">${project.category}</span>
          </div>
          <h1 class="pj-modal-hero__title">${project.title}</h1>
          <p class="pj-modal-hero__tagline">"${project.tagline}"</p>
        </div>
      </div>

      <!-- Body -->
      <div class="pj-modal-body">

        <!-- Main Column -->
        <div class="pj-modal-main">

          <!-- Overview -->
          <div class="pj-section" id="pj-overview">
            <div class="pj-section-label">01 Overview</div>
            <div class="pj-overview-text">${project.overview.replace(/\n\n/g, '</p><p class="pj-overview-text" style="margin-top:12px">')}</div>
          </div>

          <!-- Features -->
          <div class="pj-section">
            <div class="pj-section-label">02 Key Features</div>
            <div class="pj-features-list">${featuresHTML}</div>
          </div>

          <!-- Tech Stack -->
          <div class="pj-section">
            <div class="pj-section-label">03 Tech Stack</div>
            <div class="pj-modal-chips">${chipsHTML}</div>
          </div>

          <!-- Architecture -->
          <div class="pj-section">
            <div class="pj-section-label">04 Architecture</div>
            <div class="pj-arch-timeline">${archHTML}</div>
          </div>

        </div><!-- /.pj-modal-main -->

        <!-- Sidebar -->
        <div class="pj-modal-sidebar">

          <!-- Stats -->
          <div class="pj-section">
            <div class="pj-section-label">Project Stats</div>
            <div class="pj-stats-grid">${statsHTML}</div>
          </div>

          <!-- Actions -->
          <div class="pj-modal-actions">
            ${liveBtn}
            <a href="${project.github}" target="_blank" rel="noopener"
               class="pj-modal-btn-secondary" id="pj-modal-gh-${project.id}">
              <i class="fab fa-github"></i> GitHub Repository
            </a>
          </div>

        </div><!-- /.pj-modal-sidebar -->
      </div><!-- /.pj-modal-body -->
    `;

    // Bind close button
    const closeBtn = overlay.querySelector('#pjModalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
  }

  /* ──────────────────────────────────────────────────────────
     3. MODAL OPEN / CLOSE
  ────────────────────────────────────────────────────────── */
  function openModal(projectId) {
    const project = SHOWCASE_PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    renderModal(project);

    const overlay = document.getElementById('pjModalOverlay');
    overlay.classList.add('pj-modal--open');
    document.body.style.overflow = 'hidden';

    // Trigger animations after a frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Feature items
        overlay.querySelectorAll('.pj-feature-item').forEach(el => {
          el.classList.add('pj-visible');
        });
        // Tech chips
        overlay.querySelectorAll('.pj-modal-chip').forEach(el => {
          el.classList.add('pj-visible');
        });
        // Architecture steps
        overlay.querySelectorAll('.pj-arch-step').forEach(el => {
          el.classList.add('pj-visible');
        });
      });
    });
  }

  function closeModal() {
    const overlay = document.getElementById('pjModalOverlay');
    overlay.classList.remove('pj-modal--open');
    document.body.style.overflow = '';
  }

  /* ──────────────────────────────────────────────────────────
     4. MAGNETIC BUTTON
  ────────────────────────────────────────────────────────── */
  function initMagneticBtn(btn) {
    if (!btn || window.matchMedia('(hover:none)').matches) return;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  }

  /* ──────────────────────────────────────────────────────────
     5. FLOATING PARTICLE CANVAS
  ────────────────────────────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('pj-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['rgba(0,255,136,', 'rgba(0,229,255,', 'rgba(168,85,247,', 'rgba(247,165,58,'];

    particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.08,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });
      requestAnimationFrame(draw);
    }

    draw();
  }

  /* ──────────────────────────────────────────────────────────
     6. CHIP ANIMATION (IntersectionObserver)
  ────────────────────────────────────────────────────────── */
  function initChipAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chips = entry.target.querySelectorAll('.pj-chip');
          chips.forEach((chip, i) => {
            setTimeout(() => chip.classList.add('pj-chip--visible'), i * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.pj-tech-chips').forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     7. SCROLL REVEAL
  ────────────────────────────────────────────────────────── */
  function initReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animation = 'proj-slide-up 0.7s cubic-bezier(0.23,1,0.32,1) both';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.pj-reveal').forEach(el => {
      el.style.opacity = '0';
      obs.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────
     8. KEYBOARD / ESCAPE TO CLOSE MODAL
  ────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* Close on overlay click (outside modal panel) */
  document.addEventListener('click', (e) => {
    const overlay = document.getElementById('pjModalOverlay');
    if (overlay && e.target === overlay) closeModal();
  });

  /* ──────────────────────────────────────────────────────────
     9. MAIN INIT
  ────────────────────────────────────────────────────────── */
  function init() {
    const grid = document.getElementById('pjShowcaseGrid');
    if (!grid) return;

    // Render project cards
    SHOWCASE_PROJECTS.forEach((project, i) => {
      grid.appendChild(renderFeatureCard(project, i));
    });

    // "Add next project" placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'pj-add-placeholder pj-reveal';
    placeholder.setAttribute('title', 'Add your next project');
    placeholder.innerHTML = `
      <div class="pj-add-placeholder__icon"><i class="fas fa-plus"></i></div>
      <div class="pj-add-placeholder__text">+ Add Next Project</div>
      <p style="font-size:0.78rem;color:var(--text-muted);margin:0">
        Your next project will appear here
      </p>
    `;
    grid.appendChild(placeholder);

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'pjModalOverlay';
    overlay.className = 'pj-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'pj-modal-title');
    overlay.innerHTML = `<div class="pj-modal"></div>`;
    document.body.appendChild(overlay);

    // Init effects
    initParticles();
    initChipAnimations();
    initReveal();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
