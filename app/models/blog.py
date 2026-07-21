"""Blog post model."""
from datetime import datetime
from ..extensions import db


class BlogPost(db.Model):
    """Blog post written by admin."""
    __tablename__ = 'blog_posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(210), unique=True, nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.String(500))
    cover_image = db.Column(db.String(255))
    tags = db.Column(db.String(255))   # Comma-separated tags
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_published = db.Column(db.Boolean, default=True)
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def tag_list(self):
        if self.tags:
            return [t.strip() for t in self.tags.split(',') if t.strip()]
        return []

    @property
    def reading_time(self):
        """Estimate reading time in minutes."""
        words = len(self.content.split()) if self.content else 0
        return max(1, round(words / 200))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'excerpt': self.excerpt,
            'cover_image': self.cover_image,
            'tags': self.tag_list,
            'author': self.author.username if self.author else None,
            'is_published': self.is_published,
            'views': self.views,
            'reading_time': self.reading_time,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<BlogPost {self.title}>'
