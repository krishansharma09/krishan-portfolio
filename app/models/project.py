"""Project / Portfolio model."""
import json
from datetime import datetime
from ..extensions import db


class Project(db.Model):
    """Portfolio project with full case study fields."""
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    slug = db.Column(db.String(160), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    problem = db.Column(db.Text)          # Problem statement
    solution = db.Column(db.Text)         # Solution approach
    tech_stack = db.Column(db.Text)       # JSON array of tech names
    image_url = db.Column(db.String(255))
    live_url = db.Column(db.String(255))
    github_url = db.Column(db.String(255))
    category = db.Column(db.String(80))
    is_featured = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def tech_list(self):
        """Return tech_stack as Python list."""
        if self.tech_stack:
            try:
                return json.loads(self.tech_stack)
            except (json.JSONDecodeError, TypeError):
                return []
        return []

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'description': self.description,
            'problem': self.problem,
            'solution': self.solution,
            'tech_stack': self.tech_list,
            'image_url': self.image_url,
            'live_url': self.live_url,
            'github_url': self.github_url,
            'category': self.category,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Project {self.title}>'
