"""Service model."""
from datetime import datetime
from ..extensions import db


class Service(db.Model):
    """Freelancer service offering."""
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    slug = db.Column(db.String(160), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    long_description = db.Column(db.Text)
    icon = db.Column(db.String(100), default='fas fa-code')  # FontAwesome class
    price_range = db.Column(db.String(50))
    delivery_time = db.Column(db.String(50))
    is_featured = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'description': self.description,
            'long_description': self.long_description,
            'icon': self.icon,
            'price_range': self.price_range,
            'delivery_time': self.delivery_time,
            'is_featured': self.is_featured,
            'order': self.order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Service {self.title}>'
