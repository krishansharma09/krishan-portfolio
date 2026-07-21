"""Services blueprint."""
from flask import Blueprint, render_template, abort
from ..models.service import Service

services_bp = Blueprint('services', __name__)


@services_bp.route('/')
def list_services():
    """All services."""
    services = Service.query.order_by(Service.order, Service.title).all()
    return render_template('services/list.html', services=services)


@services_bp.route('/<slug>')
def service_detail(slug):
    """Single service detail."""
    service = Service.query.filter_by(slug=slug).first_or_404()
    other_services = Service.query.filter(Service.id != service.id).limit(3).all()
    return render_template('services/detail.html', service=service, other_services=other_services)
