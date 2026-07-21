"""Client project request model."""
from datetime import datetime
from ..extensions import db


class ClientRequest(db.Model):
    """Project request submitted by a client."""
    __tablename__ = 'client_requests'

    STATUS_CHOICES = ['pending', 'reviewed', 'accepted', 'rejected', 'completed']

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    # Allow anonymous requests too
    name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    budget = db.Column(db.String(50))
    deadline = db.Column(db.Date)
    file_path = db.Column(db.String(255))   # Uploaded file path
    file_name = db.Column(db.String(255))   # Original filename
    status = db.Column(db.String(20), default='pending')
    admin_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'name': self.name or (self.client.username if self.client else 'Anonymous'),
            'email': self.email or (self.client.email if self.client else ''),
            'title': self.title,
            'description': self.description,
            'budget': self.budget,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'file_name': self.file_name,
            'status': self.status,
            'admin_notes': self.admin_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<ClientRequest {self.title} [{self.status}]>'
