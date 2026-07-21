"""REST API blueprint — JSON endpoints for AJAX calls."""
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models.service import Service
from ..models.project import Project
from ..models.message import Message
from ..models.client_request import ClientRequest
from ..models.blog import BlogPost

api_bp = Blueprint('api', __name__)


@api_bp.route('/services')
def get_services():
    """Return all services as JSON."""
    services = Service.query.order_by(Service.order, Service.title).all()
    return jsonify([s.to_dict() for s in services])


@api_bp.route('/services/featured')
def get_featured_services():
    services = Service.query.filter_by(is_featured=True).limit(6).all()
    return jsonify([s.to_dict() for s in services])


@api_bp.route('/projects')
def get_projects():
    """Return all projects as JSON."""
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return jsonify([p.to_dict() for p in projects])


@api_bp.route('/projects/featured')
def get_featured_projects():
    projects = Project.query.filter_by(is_featured=True).limit(6).all()
    return jsonify([p.to_dict() for p in projects])


@api_bp.route('/blog')
def get_blog_posts():
    """Return published blog posts as JSON."""
    page = request.args.get('page', 1, type=int)
    result = BlogPost.query.filter_by(is_published=True)\
        .order_by(BlogPost.created_at.desc())\
        .paginate(page=page, per_page=6, error_out=False)
    return jsonify({
        'posts': [p.to_dict() for p in result.items],
        'total': result.total,
        'pages': result.pages,
        'current_page': page
    })


@api_bp.route('/notifications/count')
@login_required
def notification_count():
    """Return count of unread items for admin notifications (polls every 30s)."""
    if not current_user.is_admin:
        return jsonify({'count': 0})
    unread_messages = Message.query.filter_by(is_read=False).count()
    pending_requests = ClientRequest.query.filter_by(status='pending').count()
    total = unread_messages + pending_requests
    return jsonify({
        'total': total,
        'unread_messages': unread_messages,
        'pending_requests': pending_requests
    })


@api_bp.route('/stats')
def public_stats():
    """Public stats for the home page counter section."""
    return jsonify({
        'projects': Project.query.count(),
        'services': Service.query.count(),
        'blog_posts': BlogPost.query.count(),
    })
