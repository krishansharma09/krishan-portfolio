"""Flask application factory."""
from datetime import datetime
import os
from flask import Flask
from .config import config
from .extensions import db, migrate, login_manager, mail, cors


def create_app(config_name=None):
    """Create and configure the Flask application."""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config['default']))

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    mail.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Template globals
    @app.context_processor
    def inject_globals():
        return {'now': datetime.utcnow()}

    # Register user loader
    from .models.user import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    from .routes.main import main_bp
    from .routes.auth import auth_bp
    from .routes.services import services_bp
    from .routes.projects import projects_bp
    from .routes.blog import blog_bp
    from .routes.client import client_bp
    from .routes.admin import admin_bp
    from .routes.api import api_bp
    from .routes.ai import ai_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(services_bp, url_prefix='/services')
    app.register_blueprint(projects_bp, url_prefix='/projects')
    app.register_blueprint(blog_bp, url_prefix='/blog')
    app.register_blueprint(client_bp, url_prefix='/client')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(ai_bp, url_prefix='/api')

    # Create tables on first run
    with app.app_context():
        db.create_all()
        _seed_initial_data()

    return app


def _seed_initial_data():
    """Seed database with initial demo data if empty."""
    from .models.user import User
    from .models.service import Service
    from .models.project import Project

    # Create default admin user if no users exist
    if User.query.count() == 0:
        admin = User(
            username='admin',
            email=os.environ.get('ADMIN_EMAIL', 'admin@freelancehub.com'),
            role='admin'
        )
        admin.set_password('Admin@12345')
        db.session.add(admin)

    # Seed services if empty
    if Service.query.count() == 0:
        services = [
            Service(
                title='Full-Stack Web Development',
                slug='full-stack-web-development',
                description='End-to-end web application development using modern frameworks. From API design to pixel-perfect UI.',
                icon='fas fa-code',
                price_range='₹8,000–₹20,000 / $100–$250',
                is_featured=True
            ),
            Service(
                title='API Development & Integration',
                slug='api-development-integration',
                description='RESTful and GraphQL API design, development, and third-party integration with robust documentation.',
                icon='fas fa-plug',
                price_range='₹2,000–₹8,000 / $25–$100',
                is_featured=True
            ),
            Service(
                title='AI & Machine Learning Integration',
                slug='ai-machine-learning-integration',
                description='Integrate cutting-edge AI models into your product — chatbots, recommendation engines, data analysis.',
                icon='fas fa-robot',
                price_range='₹4,000–₹16,000 / $50–$200',
                is_featured=True
            ),
            Service(
                title='Database Design & Optimization',
                slug='database-design-optimization',
                description='PostgreSQL, MySQL, MongoDB schema design, query optimization and migration strategies.',
                icon='fas fa-database',
                price_range='₹2,000–₹6,000 / $25–$75',
                is_featured=False
            ),
            Service(
                title='DevOps & Cloud Deployment',
                slug='devops-cloud-deployment',
                description='CI/CD pipelines, Docker, Kubernetes, AWS/GCP deployment and infrastructure as code.',
                icon='fas fa-cloud',
                price_range='₹3,000–₹10,000 / $40–$120',
                is_featured=False
            ),
            Service(
                title='Technical Consulting',
                slug='technical-consulting',
                description='Architecture review, code audits, performance optimization, and technology stack selection.',
                icon='fas fa-lightbulb',
                price_range='₹400/hr / $5/hr',
                is_featured=False
            ),
        ]
        db.session.add_all(services)

    # Always sync prices so existing DB rows get updated rates
    _updated_prices = {
        'full-stack-web-development':   '₹8,000–₹20,000 / $100–$250',
        'api-development-integration':  '₹2,000–₹8,000 / $25–$100',
        'ai-machine-learning-integration': '₹4,000–₹16,000 / $50–$200',
        'database-design-optimization': '₹2,000–₹6,000 / $25–$75',
        'devops-cloud-deployment':      '₹3,000–₹10,000 / $40–$120',
        'technical-consulting':         '₹400/hr / $5/hr',
    }
    for slug, price in _updated_prices.items():
        svc = Service.query.filter_by(slug=slug).first()
        if svc and svc.price_range != price:
            svc.price_range = price

    # Seed projects if empty
    if Project.query.count() == 0:
        projects = [
            Project(
                title='E-Commerce Platform',
                slug='e-commerce-platform',
                description='A full-featured e-commerce solution with real-time inventory management.',
                problem='Client needed a scalable online store that could handle 10,000+ concurrent users with real-time stock updates.',
                solution='Built a microservices architecture using Flask APIs, React frontend, PostgreSQL with Redis caching, deployed on AWS ECS.',
                tech_stack='["Python", "Flask", "React", "PostgreSQL", "Redis", "AWS", "Docker"]',
                image_url='/static/assets/project1.jpg',
                live_url='https://example.com',
                github_url='https://github.com/example',
                is_featured=True
            ),
            Project(
                title='AI Document Analyzer',
                slug='ai-document-analyzer',
                description='RAG-based document analysis platform using Google Gemini for intelligent Q&A.',
                problem='Legal firm needed to extract insights from thousands of PDF documents quickly.',
                solution='Built a RAG pipeline with vector embeddings, semantic search, and Gemini AI for contextual answers.',
                tech_stack='["Python", "Flask", "PostgreSQL", "Google Gemini", "pgvector", "Docker"]',
                image_url='/static/assets/project2.jpg',
                live_url='https://example.com',
                github_url='https://github.com/example',
                is_featured=True
            ),
            Project(
                title='Real-Time Trading Dashboard',
                slug='real-time-trading-dashboard',
                description='Live cryptocurrency trading bot with analytics dashboard.',
                problem='Trader needed automated execution and visual analytics for crypto strategies.',
                solution='WebSocket-based dashboard with Binance API integration, backtesting engine, and real-time P&L tracking.',
                tech_stack='["Python", "Flask", "WebSockets", "Chart.js", "Binance API", "PostgreSQL"]',
                image_url='/static/assets/project3.jpg',
                live_url='https://example.com',
                github_url='https://github.com/example',
                is_featured=True
            ),
        ]
        db.session.add_all(projects)

    db.session.commit()
