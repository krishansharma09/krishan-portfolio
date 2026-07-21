"""Admin blueprint — dashboard and full CRUD management."""
import json
from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, abort
from flask_login import login_required, current_user
from slugify import slugify
from ..extensions import db
from ..models.user import User
from ..models.service import Service
from ..models.project import Project
from ..models.blog import BlogPost
from ..models.message import Message
from ..models.client_request import ClientRequest

admin_bp = Blueprint('admin', __name__)


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)
        return f(*args, **kwargs)
    return decorated


# ─── Dashboard ───────────────────────────────────────────────────────────────

@admin_bp.route('/dashboard')
@login_required
@admin_required
def dashboard():
    stats = {
        'messages': Message.query.count(),
        'unread_messages': Message.query.filter_by(is_read=False).count(),
        'requests': ClientRequest.query.count(),
        'pending_requests': ClientRequest.query.filter_by(status='pending').count(),
        'projects': Project.query.count(),
        'services': Service.query.count(),
        'blog_posts': BlogPost.query.count(),
        'users': User.query.count(),
    }
    recent_messages = Message.query.order_by(Message.created_at.desc()).limit(5).all()
    recent_requests = ClientRequest.query.order_by(ClientRequest.created_at.desc()).limit(5).all()
    return render_template(
        'admin/dashboard.html',
        stats=stats,
        recent_messages=recent_messages,
        recent_requests=recent_requests
    )


# ─── Services CRUD ───────────────────────────────────────────────────────────

@admin_bp.route('/services')
@login_required
@admin_required
def manage_services():
    services = Service.query.order_by(Service.order, Service.title).all()
    return render_template('admin/services.html', services=services)


@admin_bp.route('/services/add', methods=['POST'])
@login_required
@admin_required
def add_service():
    data = request.get_json() if request.is_json else request.form
    title = data.get('title', '').strip()
    if not title:
        return jsonify({'success': False, 'message': 'Title required'}), 400

    service = Service(
        title=title,
        slug=slugify(title),
        description=data.get('description', ''),
        long_description=data.get('long_description', ''),
        icon=data.get('icon', 'fas fa-code'),
        price_range=data.get('price_range', ''),
        delivery_time=data.get('delivery_time', ''),
        is_featured=bool(data.get('is_featured', False)),
        order=int(data.get('order', 0))
    )
    db.session.add(service)
    db.session.commit()
    return jsonify({'success': True, 'service': service.to_dict()})


@admin_bp.route('/services/edit/<int:sid>', methods=['POST'])
@login_required
@admin_required
def edit_service(sid):
    service = Service.query.get_or_404(sid)
    data = request.get_json() if request.is_json else request.form
    service.title = data.get('title', service.title).strip()
    service.slug = slugify(service.title)
    service.description = data.get('description', service.description)
    service.long_description = data.get('long_description', service.long_description)
    service.icon = data.get('icon', service.icon)
    service.price_range = data.get('price_range', service.price_range)
    service.delivery_time = data.get('delivery_time', service.delivery_time)
    service.is_featured = bool(data.get('is_featured', service.is_featured))
    service.order = int(data.get('order', service.order))
    db.session.commit()
    return jsonify({'success': True, 'service': service.to_dict()})


@admin_bp.route('/services/delete/<int:sid>', methods=['POST'])
@login_required
@admin_required
def delete_service(sid):
    service = Service.query.get_or_404(sid)
    db.session.delete(service)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Service deleted.'})


# ─── Projects CRUD ───────────────────────────────────────────────────────────

@admin_bp.route('/projects')
@login_required
@admin_required
def manage_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return render_template('admin/projects.html', projects=projects)


@admin_bp.route('/projects/add', methods=['POST'])
@login_required
@admin_required
def add_project():
    data = request.get_json() if request.is_json else request.form
    title = data.get('title', '').strip()
    if not title:
        return jsonify({'success': False, 'message': 'Title required'}), 400

    slug = slugify(title)
    base = slug
    i = 1
    while Project.query.filter_by(slug=slug).first():
        slug = f'{base}-{i}'; i += 1

    tech_raw = data.get('tech_stack', '[]')
    if isinstance(tech_raw, str):
        try:
            json.loads(tech_raw)
        except Exception:
            tech_raw = json.dumps([t.strip() for t in tech_raw.split(',') if t.strip()])

    project = Project(
        title=title, slug=slug,
        description=data.get('description', ''),
        problem=data.get('problem', ''),
        solution=data.get('solution', ''),
        tech_stack=tech_raw,
        image_url=data.get('image_url', ''),
        live_url=data.get('live_url', ''),
        github_url=data.get('github_url', ''),
        category=data.get('category', ''),
        is_featured=bool(data.get('is_featured', False)),
        order=int(data.get('order', 0))
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({'success': True, 'project': project.to_dict()})


@admin_bp.route('/projects/edit/<int:pid>', methods=['POST'])
@login_required
@admin_required
def edit_project(pid):
    project = Project.query.get_or_404(pid)
    data = request.get_json() if request.is_json else request.form
    for field in ['title', 'description', 'problem', 'solution', 'image_url', 'live_url', 'github_url', 'category']:
        val = data.get(field)
        if val is not None:
            setattr(project, field, val.strip())
    tech_raw = data.get('tech_stack')
    if tech_raw:
        if isinstance(tech_raw, str):
            try:
                json.loads(tech_raw)
                project.tech_stack = tech_raw
            except Exception:
                project.tech_stack = json.dumps([t.strip() for t in tech_raw.split(',') if t.strip()])
    project.is_featured = bool(data.get('is_featured', project.is_featured))
    if project.title:
        project.slug = slugify(project.title)
    db.session.commit()
    return jsonify({'success': True, 'project': project.to_dict()})


@admin_bp.route('/projects/delete/<int:pid>', methods=['POST'])
@login_required
@admin_required
def delete_project(pid):
    project = Project.query.get_or_404(pid)
    db.session.delete(project)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Project deleted.'})


# ─── Blog CRUD ───────────────────────────────────────────────────────────────

@admin_bp.route('/blog')
@login_required
@admin_required
def manage_blog():
    posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
    return render_template('admin/blog.html', posts=posts)


# ─── Messages ────────────────────────────────────────────────────────────────

@admin_bp.route('/messages')
@login_required
@admin_required
def manage_messages():
    messages = Message.query.order_by(Message.created_at.desc()).all()
    return render_template('admin/messages.html', messages=messages)


@admin_bp.route('/messages/read/<int:mid>', methods=['POST'])
@login_required
@admin_required
def mark_read(mid):
    msg = Message.query.get_or_404(mid)
    msg.is_read = True
    db.session.commit()
    return jsonify({'success': True})


@admin_bp.route('/messages/delete/<int:mid>', methods=['POST'])
@login_required
@admin_required
def delete_message(mid):
    msg = Message.query.get_or_404(mid)
    db.session.delete(msg)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Message deleted.'})


# ─── Client Requests ─────────────────────────────────────────────────────────

@admin_bp.route('/requests')
@login_required
@admin_required
def manage_requests():
    reqs = ClientRequest.query.order_by(ClientRequest.created_at.desc()).all()
    return render_template('admin/requests.html', requests=reqs)


@admin_bp.route('/requests/status/<int:rid>', methods=['POST'])
@login_required
@admin_required
def update_request_status(rid):
    req = ClientRequest.query.get_or_404(rid)
    data = request.get_json() if request.is_json else request.form
    new_status = data.get('status')
    if new_status in ClientRequest.STATUS_CHOICES:
        req.status = new_status
        req.admin_notes = data.get('admin_notes', req.admin_notes)
        db.session.commit()
        return jsonify({'success': True, 'status': req.status})
    return jsonify({'success': False, 'message': 'Invalid status'}), 400
