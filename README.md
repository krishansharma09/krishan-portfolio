# Krishan Sharma — AI/ML Engineer & Backend Developer Portfolio

A production-grade, highly custom personal developer portfolio and client request platform built with **Flask**, **PostgreSQL**, **SQLAlchemy**, and **Google Gemini AI**. Designed with a modern **Technical Researcher / Sky Blue** visual aesthetic, interactive project showcases, real-time lead capture, and an embedded AI chatbot ("Nova").

---

## Key Features

- **Nova AI Assistant**: Embedded conversational AI chatbot powered by Google Gemini API (`gemini-2.5-flash`), with contextual knowledge about Krishan's background, education, projects, and an automated multi-step lead capture workflow integrated with **Web3Forms**.
- **Interactive Projects Showcase**: Production-ready project cards featuring *Binance Futures Trading Bot* and *Personal Finance Dashboard*, detailed case study modals, architecture diagrams, and GitHub repository links.
- **Tech Stack & Engineering Expertise**: Interactive skill breakdown across **Backend**, **Frontend**, **AI/ML**, **Cloud**, and **Tools** with interactive category filter tabs and circular progress rings.
- **Client Project Request & Contact Flow**: Dual lead intake system supporting both direct contact messages and structured project submission forms with automatic Web3Forms email notifications and DB backup.
- **Blog & Case Study Engine**: Full blog platform with markdown/HTML rendering, category filtering, search, and admin management.
- **Custom Vector Projection Canvas**: Interactive canvas particle animation tuned to the Sky Blue design palette.
- **Comprehensive Admin Dashboard**: Full CRUD management interface for projects, blog posts, leads/messages, and system configurations.

---

## Design System

- **Theme Palette**: Soft Sky Blue (`#EAF4FB`) background, Deep Navy Ink (`#131B26`) typography, Cobalt Sky Accent (`#2B78C5`), and Soft Sky Pill Fill (`#DDECF8`).
- **Typography**: `Newsreader` (Georgia/Serif) for section titles & project headings, `Inter` for body copy, and `JetBrains Mono` for code snippets, eyebrows, and skill pills.

---

## Tech Stack

- **Backend**: Python 3.10+, Flask, SQLAlchemy, Werkzeug, Google Generative AI SDK (`google-genai`), Gunicorn
- **Frontend**: HTML5, Vanilla CSS3 (Custom design system), Vanilla JavaScript (ES6+), FontAwesome 6, Canvas API
- **Database**: PostgreSQL (Production), SQLite (Local Development fallback)
- **Integrations**: Google Gemini API, Web3Forms API
- **Deployment**: Render / Railway / Heroku (Procfile included)

---

## Quick Start

### 1. Clone & Set Up Virtual Environment

```bash
git clone https://github.com/krishansharma09/FreelanceHub.git
cd FreelanceHub

python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```env
SECRET_KEY=your-super-secret-key-here
FLASK_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/freelancehub

# Gemini API Key for Nova AI Chatbot
GEMINI_API_KEY=your-gemini-api-key

# Web3Forms Key for Contact & Lead Form Submission
WEB3FORMS_ACCESS_KEY=your-web3forms-access-key
```

### 4. Database Setup & Initialization

```bash
flask db upgrade
# Or run python run.py to initialize tables automatically
```

### 5. Run the Application

```bash
python run.py
```

Access the application in your browser at `http://localhost:5000`.

---

## Project Architecture

```
FreelanceHub/
├── app/
│   ├── __init__.py           # Flask App Factory & extension initialization
│   ├── config.py             # Config settings (DB, Gemini, Mail, Web3Forms)
│   ├── extensions.py         # SQLAlchemy, LoginManager, Migrate instances
│   ├── models/               # SQLAlchemy models (User, Project, Post, Message, etc.)
│   ├── routes/               # Modular Flask Blueprints
│   │   ├── main.py           # Home, About, Contact, Services, AI Chatbot API
│   │   ├── projects.py       # Projects list, details, filter API
│   │   ├── blog.py           # Blog articles & categories
│   │   ├── client.py         # Client project submission workflow
│   │   ├── auth.py           # User authentication & registration
│   │   └── admin.py          # Admin management dashboard
│   ├── templates/            # Jinja2 HTML templates
│   └── static/
│       ├── css/              # Custom CSS stylesheets (main, components, etc.)
│       ├── js/               # Interactive JS scripts (chatbot, showcase, canvas)
│       └── uploads/          # Project images & assets
├── .env.example              # Environment variables template
├── Procfile                  # Gunicorn configuration for deployment
├── requirements.txt          # Python package dependencies
└── run.py                    # Application entry point
```

---

## Default Admin Credentials

Upon initial database seeding:
- **Email**: `admin@freelancehub.com`
- **Password**: `Admin@12345`

*Note: Update password immediately after initial setup.*

---

## License & Author

Developed by **Krishan Sharma** — Python Developer & AI/ML Engineer (Jaipur, Rajasthan, India).
