"""Projects blueprint."""
from flask import Blueprint, render_template
from ..models.project import Project

projects_bp = Blueprint('projects', __name__)


@projects_bp.route('/')
def list_projects():
    """All projects in grid layout."""
    projects = Project.query.order_by(Project.order, Project.created_at.desc()).all()
    return render_template('projects/list.html', projects=projects)


@projects_bp.route('/<slug>')
def project_detail(slug):
    """Full project case study."""
    project = Project.query.filter_by(slug=slug).first_or_404()
    related = Project.query.filter(
        Project.id != project.id,
        Project.category == project.category
    ).limit(3).all()
    if not related:
        related = Project.query.filter(Project.id != project.id).limit(3).all()
    return render_template('projects/detail.html', project=project, related=related)
