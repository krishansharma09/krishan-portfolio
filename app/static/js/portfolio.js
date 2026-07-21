/* ============================================================
   FreelanceHub — Portfolio Premium JS
   AI Project Cards, Modals, Currency Converter,
   Card Tilt, Cursor Glow, Portfolio AI Assistant
============================================================ */

/* ── 1. PROJECT DATA ──────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 'ml-prediction',
    title: 'ML Prediction System',
    category: 'Machine Learning',
    badge: 'ML',
    icon: 'fas fa-brain',
    desc: 'A production-ready ML pipeline that predicts outcomes from structured data using ensemble models with REST API endpoints.',
    longDesc: 'A full end-to-end Machine Learning system designed for real-world deployment. It handles raw CSV ingestion, automated feature engineering, trains multiple ensemble models, selects the best performer, and exposes predictions via a clean REST API. The system includes a monitoring dashboard built with Streamlit.',
    tech: ['Python', 'Scikit-learn', 'Flask', 'Pandas', 'NumPy', 'Matplotlib', 'Joblib'],
    features: [
      'Automated data preprocessing & feature engineering pipeline',
      'Multi-model training: Random Forest, XGBoost, Gradient Boosting',
      'Automatic model selection based on cross-validation scores',
      'REST API endpoints for real-time single & batch predictions',
      'Model performance dashboard with Streamlit',
      'Serialized model versioning with Joblib',
      'Input validation and error handling for production use'
    ],
    architecture: `# ML Prediction System — Architecture

[CSV Data Input]
    → data_loader.py       # pandas ingestion & schema validation
    → preprocessor.py      # encoding, scaling, imputation
    → feature_engineer.py  # derived features, selection

[Model Training]
    → trainer.py           # RandomForest / XGBoost / GradBoost
    → evaluator.py         # CV scores, confusion matrix, ROC
    → model_registry.py    # joblib save/load, versioning

[Flask REST API]
    POST /api/predict       # single prediction
    POST /api/predict/batch # batch predictions
    GET  /api/model/info    # model metrics

[Streamlit Dashboard]
    → app.py               # live accuracy, feature importance`,
    challenges: [
      'Handling class imbalance in training data using SMOTE oversampling',
      'Building a pipeline that works for both regression and classification tasks',
      'Ensuring model reproducibility across environments with fixed random seeds',
      'Optimizing API response time to under 50ms for production load'
    ],
    deployment: 'Deployed on Heroku with Gunicorn. Docker image available. CI/CD via GitHub Actions. Environment variables for config management.',
    useCase: 'Ideal for businesses needing data-driven decision automation — e.g., churn prediction, sales forecasting, risk scoring, demand estimation.',
    status: 'Completed',
    duration: '3 weeks',
    github: '#',
    live: '#'
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot (Gemini/OpenAI)',
    category: 'AI / NLP',
    badge: 'AI',
    icon: 'fas fa-robot',
    desc: 'Context-aware conversational AI chatbot with multi-turn dialogue, streaming responses, and custom personality using Gemini API.',
    longDesc: 'A fully featured AI chatbot built on top of Google Gemini 1.5 Flash and OpenAI GPT-4. It maintains conversation memory, supports multi-turn dialogue, and can be customized with a system prompt for any use case — from customer support to portfolio assistant. Embedded on websites as a floating widget.',
    tech: ['Python', 'Flask', 'Gemini API', 'OpenAI API', 'JavaScript', 'SQLite', 'WebSocket'],
    features: [
      'Multi-turn conversation with persistent context memory',
      'Dual LLM support: Google Gemini 1.5 Flash & OpenAI GPT-4',
      'Real-time streaming token response for instant feel',
      'Custom system prompt for personality/role configuration',
      'Conversation history stored in SQLite per session',
      'Embeddable floating widget for any website',
      'Graceful API fallback with keyword-based responses',
      'Markdown rendering in chat messages'
    ],
    architecture: `# AI Chatbot — Architecture

[Frontend Widget]
    chat.js         # bubble toggle, message rendering
    chatbot.css     # glassmorphism panel styles

[Flask Backend]
    POST /api/chat  # receives message + history
    → system_prompt # role & personality context
    → LLM Router    # Gemini 1.5 Flash (primary)
                    # OpenAI GPT-4 (fallback)
    → history_mgr   # last 10 turns for context

[Storage]
    SQLite sessions  # conversation history per user
    In-memory cache  # rate limiting per IP`,
    challenges: [
      'Managing conversation context window limits for long chats',
      'Graceful degradation when API keys are missing or rate-limited',
      'Rendering AI markdown (bold, lists, code) in chat bubbles safely',
      'Keeping the widget lightweight — under 12KB JS bundle'
    ],
    deployment: 'Runs as part of Flask app. API keys via environment variables. Supports self-hosted and cloud deployment.',
    useCase: 'Portfolio AI assistants, customer support automation, internal knowledge base chatbots, FAQ bots for SaaS products.',
    status: 'Completed',
    duration: '2 weeks',
    github: '#',
    live: '#'
  },
  {
    id: 'resume-generator',
    title: 'Resume Generator AI',
    category: 'AI Tools',
    badge: 'GPT-4',
    icon: 'fas fa-file-alt',
    desc: 'AI-powered resume builder that generates ATS-optimized resumes from user input using GPT-4, exported as professional PDFs.',
    longDesc: 'An intelligent resume generator that takes structured user input (job title, skills, experience) and uses GPT-4 to craft professional, ATS-optimized resume content. Users can choose from multiple templates, preview in browser, and download as PDF. The AI tailors content based on the target job description.',
    tech: ['Python', 'OpenAI GPT-4', 'Flask', 'FPDF', 'Jinja2', 'HTML', 'CSS', 'JavaScript'],
    features: [
      'GPT-4 powered content generation from bullet-point inputs',
      'ATS keyword optimization based on target job description',
      'Multiple professional resume templates (Classic, Modern, Minimal)',
      'Live browser preview before PDF export',
      'FPDF-based pixel-perfect PDF generation',
      'Editable sections: Summary, Experience, Education, Skills, Projects',
      'LinkedIn profile URL auto-import (optional)',
      'One-click download as .pdf or .docx'
    ],
    architecture: `# Resume Generator — Architecture

[User Input Form]
    name, title, skills, experience, target_job

[AI Content Engine]
    POST /api/generate
    → prompt_builder.py   # structured GPT-4 prompt
    → openai_client.py    # GPT-4 API call
    → content_parser.py   # extract sections from response

[Template Engine]
    Jinja2 HTML templates  # 3 design options
    → preview_renderer.py  # browser preview

[PDF Export]
    → pdf_generator.py     # FPDF layout engine
    → GET /download/<id>   # serve PDF file`,
    challenges: [
      'Ensuring GPT-4 output follows the exact resume section format required',
      'Making FPDF layout handle variable-length AI-generated content gracefully',
      'Building a clean preview that matches the final PDF output exactly',
      'Implementing ATS scoring to verify keyword density before export'
    ],
    deployment: 'Flask app on Render. PDF files stored temporarily with 24hr auto-cleanup. OpenAI API key via environment config.',
    useCase: 'Job seekers, career coaches, HR platforms, recruitment SaaS products needing AI resume generation.',
    status: 'Completed',
    duration: '2 weeks',
    github: '#',
    live: '#'
  },
  {
    id: 'flask-jwt-auth',
    title: 'Flask Auth System with JWT',
    category: 'Web Security',
    badge: 'Security',
    icon: 'fas fa-shield-alt',
    desc: 'Enterprise-grade authentication system with JWT tokens, role-based access control, email verification, and admin panel.',
    longDesc: 'A production-ready authentication and authorization system for Flask applications. Implements access/refresh JWT token pairs, role-based permissions, email verification, password reset flow, brute-force rate limiting, and a full admin panel. Ready to plug into any Flask project.',
    tech: ['Flask', 'Python', 'JWT', 'PostgreSQL', 'SQLAlchemy', 'Bcrypt', 'Flask-Mail', 'Redis'],
    features: [
      'Access + Refresh JWT token pair with configurable expiry',
      'Role-based access control (Admin, Editor, Viewer)',
      'Email verification on registration via Flask-Mail',
      'Secure password reset with time-limited tokens',
      'Brute-force protection with Redis-backed rate limiting',
      'Token blacklisting on logout via Redis store',
      'Admin dashboard for user management',
      'Argon2/Bcrypt password hashing with salt rounds',
      'CSRF protection on form endpoints'
    ],
    architecture: `# Flask JWT Auth — Architecture

[Auth Endpoints]
    POST /auth/register    # create user + send verify email
    POST /auth/verify      # email token verification
    POST /auth/login       # issue access + refresh tokens
    POST /auth/refresh     # rotate refresh token
    POST /auth/logout      # blacklist token in Redis
    POST /auth/reset       # password reset flow

[Middleware]
    @jwt_required()        # verify access token
    @role_required('admin')# RBAC decorator

[Storage]
    PostgreSQL             # users, roles, permissions
    Redis                  # token blacklist, rate limits
    Flask-Mail             # verification/reset emails`,
    challenges: [
      'Implementing secure refresh token rotation to prevent token theft',
      'Designing RBAC to be flexible without tight coupling to business logic',
      'Building token blacklist that survives server restarts using Redis',
      'Preventing timing attacks on token comparison with constant-time checks'
    ],
    deployment: 'Docker Compose with Flask + PostgreSQL + Redis. Deployable to AWS ECS, Render, or Railway. Environment-based config.',
    useCase: 'Any SaaS product, internal tool, or API needing secure multi-role authentication out of the box.',
    status: 'Completed',
    duration: '3 weeks',
    github: '#',
    live: '#'
  },
  {
    id: 'streamlit-doc-chatbot',
    title: 'Streamlit AI Document Chatbot',
    category: 'AI / RAG',
    badge: 'RAG',
    icon: 'fas fa-comments',
    desc: 'Upload PDFs, DOCX, or TXT files and chat with them using AI. Semantic search with FAISS finds the most relevant passages.',
    longDesc: 'A Retrieval-Augmented Generation (RAG) application built with Streamlit and LangChain. Users upload any document and ask natural-language questions. The system chunks the document, embeds it with OpenAI embeddings, stores in FAISS, retrieves the top-k relevant passages, and passes them to GPT-4 with the question for a grounded answer.',
    tech: ['Python', 'Streamlit', 'LangChain', 'FAISS', 'OpenAI', 'PyPDF2', 'python-docx', 'NumPy'],
    features: [
      'Multi-format document upload: PDF, DOCX, TXT',
      'Recursive text chunking with configurable overlap',
      'OpenAI text-embedding-3-small for semantic embeddings',
      'FAISS vector store for fast top-k similarity search',
      'GPT-4 answers grounded in retrieved document passages',
      'Source citation — shows which page/section the answer came from',
      'Multi-document support — query across multiple files',
      'Conversation memory for follow-up questions',
      'Clean Streamlit UI with file upload sidebar'
    ],
    architecture: `# Document Chatbot — RAG Pipeline

[Document Upload]
    file_loader.py   # PDF/DOCX/TXT → raw text

[Indexing Pipeline]
    chunker.py       # RecursiveCharacterTextSplitter
                     # chunk_size=1000, overlap=200
    embedder.py      # OpenAI text-embedding-3-small
    vector_store.py  # FAISS index, save/load

[Query Pipeline]
    query → embed query → FAISS similarity search
         → top-k chunks  → GPT-4 with context
         → answer + source citations

[Streamlit App]
    app.py           # sidebar upload, chat interface`,
    challenges: [
      'Tuning chunk size and overlap for different document types (legal vs technical)',
      'Handling scanned PDFs that need OCR preprocessing with Tesseract',
      'Managing FAISS index persistence across Streamlit reruns',
      'Preventing hallucination by strictly constraining GPT-4 to retrieved context'
    ],
    deployment: 'Streamlit Cloud deployment. FAISS index persisted to disk. Supports local run with pip install. API keys via Streamlit secrets.',
    useCase: 'Legal document analysis, research paper Q&A, technical manual chatbots, HR policy assistants, contract review.',
    status: 'Completed',
    duration: '2 weeks',
    github: '#',
    live: '#'
  },
  {
    id: 'fastapi-backend',
    title: 'FastAPI + PostgreSQL Backend',
    category: 'Backend API',
    badge: 'FastAPI',
    icon: 'fas fa-server',
    desc: 'Production-ready async REST API with automatic Swagger docs, Pydantic validation, async SQLAlchemy, and Docker deployment.',
    longDesc: 'A modern, high-performance backend API built with FastAPI and async SQLAlchemy ORM. Features full CRUD operations, JWT authentication, role-based permissions, automatic OpenAPI/Swagger documentation, request validation with Pydantic v2, pagination, filtering, and a Docker Compose setup for one-command deployment.',
    tech: ['FastAPI', 'Python', 'PostgreSQL', 'SQLAlchemy', 'Pydantic', 'Docker', 'Alembic', 'Redis'],
    features: [
      'Fully async endpoints using async/await with asyncpg',
      'Pydantic v2 schemas for strict request/response validation',
      'Auto-generated Swagger UI and ReDoc documentation',
      'JWT Bearer authentication on protected routes',
      'Role-based permission system (Admin / User / Guest)',
      'Database migrations managed with Alembic',
      'Cursor-based pagination for large datasets',
      'Redis caching layer for frequently accessed endpoints',
      'Docker Compose: FastAPI + PostgreSQL + Redis + Nginx',
      'Background tasks with FastAPI BackgroundTasks'
    ],
    architecture: `# FastAPI Backend — Architecture

[API Layer]  FastAPI + Uvicorn (async)
    routers/
      users.py     GET/POST/PUT/DELETE /users
      items.py     CRUD /items with pagination
      auth.py      POST /auth/login, /refresh

[Business Logic]
    services/
      user_service.py   # domain logic
      auth_service.py   # JWT issue/verify

[Data Layer]  async SQLAlchemy + asyncpg
    models/       # ORM table definitions
    schemas/      # Pydantic v2 request/response
    migrations/   # Alembic version files

[Infrastructure]  Docker Compose
    api       → uvicorn main:app --reload
    db        → postgres:16-alpine
    cache     → redis:7-alpine
    proxy     → nginx (SSL termination)`,
    challenges: [
      'Migrating from synchronous SQLAlchemy to fully async sessions without N+1 query issues',
      'Implementing cursor-based pagination that works efficiently with complex filters',
      'Handling database connection pooling correctly in async context',
      'Building a generic CRUD base class that works for all models with type safety'
    ],
    deployment: 'Docker Compose for local/staging. Production on Railway or AWS ECS. Nginx reverse proxy with SSL. GitHub Actions CI/CD pipeline.',
    useCase: 'SaaS product backends, mobile app APIs, microservices, e-commerce backends, any project needing a fast, documented, scalable REST API.',
    status: 'Completed',
    duration: '4 weeks',
    github: '#',
    live: '#'
  }
];

/* ── 2. CURRENCY CONVERTER ────────────────────────────────────── */
const CURRENCY = {
  rates: { USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79 },
  symbols: { USD: '$', INR: '₹', EUR: '€', GBP: '£' },
  formatters: {
    USD: (n) => `$${n.toLocaleString('en-US')}`,
    INR: (n) => `₹${n.toLocaleString('en-IN')}`,
    EUR: (n) => `€${n.toLocaleString('en-EU')}`,
    GBP: (n) => `£${n.toLocaleString('en-GB')}`
  }
};

function convertAmount(usdAmount, toCurrency) {
  return Math.round(usdAmount * CURRENCY.rates[toCurrency]);
}

function formatPrice(usdAmount, currency) {
  const converted = convertAmount(usdAmount, currency);
  return CURRENCY.formatters[currency](converted);
}

function parseUSDRange(rangeStr) {
  // Parses "$300 - $800" or "$1,000 - $5,000" into [300, 800]
  const nums = rangeStr.replace(/[$,]/g, '').match(/\d+/g);
  if (!nums || nums.length < 2) return null;
  return [parseInt(nums[0]), parseInt(nums[1])];
}

function updateAllPrices(currency) {
  document.querySelectorAll('[data-usd-min][data-usd-max]').forEach(el => {
    const min = parseInt(el.dataset.usdMin);
    const max = parseInt(el.dataset.usdMax);
    const formatted = `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`;
    el.classList.add('updating');
    setTimeout(() => {
      el.textContent = formatted;
      el.classList.remove('updating');
    }, 150);
  });

  // Also update any .service-detail-price elements
  document.querySelectorAll('[data-price-usd]').forEach(el => {
    const usdRange = el.dataset.priceUsd;
    const parsed = parseUSDRange(usdRange);
    if (!parsed) return;
    const formatted = `${formatPrice(parsed[0], currency)} – ${formatPrice(parsed[1], currency)}`;
    el.classList.add('updating');
    setTimeout(() => {
      el.textContent = formatted;
      el.classList.remove('updating');
    }, 150);
  });
}

/* ── 3. PROJECT MODAL ─────────────────────────────────────────── */
let currentProject = null;

function openProjectModal(projectId) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return;
  currentProject = project;

  const modal = document.getElementById('projectModal');
  if (!modal) return;

  // Populate hero
  modal.querySelector('#pm-icon').className = project.icon;
  modal.querySelector('#pm-category').textContent = project.category;
  modal.querySelector('#pm-title').textContent = project.title;
  modal.querySelector('#pm-desc').textContent = project.longDesc;

  // Actions
  const githubBtn = modal.querySelector('#pm-github');
  const liveBtn = modal.querySelector('#pm-live');
  if (githubBtn) githubBtn.href = project.github;
  if (liveBtn) liveBtn.href = project.live;

  // Features
  const featuresList = modal.querySelector('#pm-features');
  if (featuresList) {
    featuresList.innerHTML = project.features.map(f =>
      `<div class="project-modal__feature">
        <div class="project-modal__feature-dot"></div>
        <span>${f}</span>
      </div>`
    ).join('');
  }

  // Tech pills
  const techGrid = modal.querySelector('#pm-tech');
  if (techGrid) {
    techGrid.innerHTML = project.tech.map(t =>
      `<span class="project-modal__tech-pill">${t}</span>`
    ).join('');
  }

  // Architecture terminal
  const termBody = modal.querySelector('#pm-architecture');
  if (termBody) {
    termBody.textContent = project.architecture;
  }

  // Challenges
  const challengesList = modal.querySelector('#pm-challenges');
  if (challengesList) {
    challengesList.innerHTML = project.challenges.map(c =>
      `<div class="project-modal__feature">
        <div class="project-modal__feature-dot" style="background:var(--accent-2)"></div>
        <span>${c}</span>
      </div>`
    ).join('');
  }

  // Info sidebar
  modal.querySelector('#pm-status').textContent = project.status;
  modal.querySelector('#pm-duration').textContent = project.duration;
  modal.querySelector('#pm-deployment').textContent = project.deployment;

  // Use case
  const ucEl = modal.querySelector('#pm-usecase');
  if (ucEl) ucEl.textContent = project.useCase;

  // Open modal
  document.body.style.overflow = 'hidden';
  modal.classList.add('open');

  // Scroll panel to top
  const panel = modal.querySelector('.project-modal__panel');
  if (panel) panel.scrollTop = 0;
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  currentProject = null;
}

/* ── CARD TILT EFFECT ──────────────────────────────────────── */
function initTiltCards() {
  // Only on devices with hover support
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    const MAX_TILT = 8;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * MAX_TILT;
      const rotY = dx * MAX_TILT;
      card.style.transition = 'transform 0.1s linear';
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
}

/* ── 6. CURSOR GLOW ───────────────────────────────────────────── */
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.getElementById('cursor-glow');
  if (!cursor) return;

  document.body.classList.add('cursor-active');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow with lerp
  function animateCursor() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursor.style.left = glowX + 'px';
    cursor.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* ── 7. PROJECT FILTER TABS ───────────────────────────────────── */
function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.ai-project-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const category = card.dataset.category || '';
        const show = filter === 'all' || category === filter;
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0.2';
          card.style.transform = 'scale(0.97)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });
}

/* ── 8. RENDER PROJECT CARDS ──────────────────────────────────── */
function renderProjectCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = PROJECTS.map((p, i) => `
    <div class="ai-project-card tilt-card reveal delay-${(i % 3) + 1}"
         data-category="${p.category}"
         data-project="${p.id}"
         onclick="openProjectModal('${p.id}')"
         role="button"
         tabindex="0"
         aria-label="View ${p.title} details">
      <div class="ai-project-card__num">${String(i + 1).padStart(2, '0')}</div>
      <div class="ai-project-card__header">
        <div class="ai-project-card__icon">
          <i class="${p.icon}"></i>
        </div>
        <span class="ai-project-card__badge">${p.badge}</span>
      </div>
      <h3 class="ai-project-card__title">${p.title}</h3>
      <p class="ai-project-card__desc">${p.desc}</p>
      <div class="ai-project-card__tech">
        ${p.tech.slice(0, 4).map(t => `<span class="ai-project-card__tech-tag">${t}</span>`).join('')}
        ${p.tech.length > 4 ? `<span class="ai-project-card__tech-tag">+${p.tech.length - 4}</span>` : ''}
      </div>
      <div class="ai-project-card__footer">
        <span class="ai-project-card__view-btn">
          View Details <i class="fas fa-arrow-right"></i>
        </span>
        <div class="ai-project-card__links">
          <a href="${p.github}" class="ai-project-card__link" title="GitHub" onclick="event.stopPropagation()" target="_blank" rel="noopener">
            <i class="fab fa-github"></i>
          </a>
          <a href="${p.live}" class="ai-project-card__link" title="Live Demo" onclick="event.stopPropagation()" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');

  // Re-run tilt on new cards
  initTiltCards();

  // Re-trigger reveal observer on new elements
  document.querySelectorAll(`#${containerId} .reveal`).forEach(el => {
    if (window._revealObserver) window._revealObserver.observe(el);
  });
}

/* ── 9. INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Render project cards into any .ai-projects-grid containers
  renderProjectCards('aiProjectsGrid');
  renderProjectCards('aiProjectsGridPage'); // on projects/list page

  // Cursor glow
  initCursorGlow();

  // Tilt cards
  initTiltCards();

  // Filter tabs
  initFilterTabs();

  // ── Project Modal ──
  const projectModal = document.getElementById('projectModal');
  if (projectModal) {
    // Close on backdrop click
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });

    // Close button
    const closeBtn = projectModal.querySelector('#pm-close');
    if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);

    // Hire me button inside modal
    const hireBtn = projectModal.querySelector('#pm-hire');
    if (hireBtn) hireBtn.addEventListener('click', () => {
      closeProjectModal();
      window.location.href = '/client/request';
    });

    // Talk with AI inside modal
    const aiBtn = projectModal.querySelector('#pm-ai');
    if (aiBtn) aiBtn.addEventListener('click', () => {
      const ctx = currentProject ? `Tell me more about the ${currentProject.title} project` : '';
      closeProjectModal();
      setTimeout(() => openPortfolioAI(ctx), 200);
    });
  }

  // ── Currency Converter ──
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) {
    currencySelect.addEventListener('change', () => {
      updateAllPrices(currencySelect.value);
    });
  }

  // ── Escape key closes modals ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
    }
  });

  // ── Keyboard accessibility for project cards ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('ai-project-card')) {
      openProjectModal(e.target.dataset.project);
    }
  });

  // Export reveal observer reference for dynamic cards
  window._revealObserver = window._revealObserver || null;
});

// Expose globally for inline onclick handlers
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
