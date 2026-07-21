"""Blog blueprint — list, detail, create, edit, delete."""
from flask import Blueprint, render_template, request, redirect, url_for, flash, abort, jsonify
from flask_login import login_required, current_user
from slugify import slugify
from ..extensions import db
from ..models.blog import BlogPost

blog_bp = Blueprint('blog', __name__)


def admin_required(f):
    """Decorator to restrict access to admins."""
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)
        return f(*args, **kwargs)
    return decorated


@blog_bp.route('/')
def list_posts():
    """Blog post list with pagination."""
    page = request.args.get('page', 1, type=int)
    posts = BlogPost.query.filter_by(is_published=True)\
        .order_by(BlogPost.created_at.desc())\
        .paginate(page=page, per_page=6, error_out=False)
    return render_template('blog/list.html', posts=posts)


@blog_bp.route('/<slug>')
def post_detail(slug):
    """Single blog post."""
    post = BlogPost.query.filter_by(slug=slug, is_published=True).first_or_404()
    post.views += 1
    db.session.commit()
    recent = BlogPost.query.filter(
        BlogPost.id != post.id, BlogPost.is_published == True
    ).order_by(BlogPost.created_at.desc()).limit(3).all()
    return render_template('blog/detail.html', post=post, recent=recent)


@blog_bp.route('/create', methods=['GET', 'POST'])
@login_required
@admin_required
def create_post():
    """Create new blog post (admin only)."""
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()
        excerpt = request.form.get('excerpt', '').strip()
        tags = request.form.get('tags', '').strip()
        is_published = request.form.get('is_published') == 'on'

        if not title or not content:
            flash('Title and content are required.', 'danger')
            return redirect(url_for('blog.create_post'))

        slug = slugify(title)
        # Ensure unique slug
        base_slug = slug
        counter = 1
        while BlogPost.query.filter_by(slug=slug).first():
            slug = f'{base_slug}-{counter}'
            counter += 1

        post = BlogPost(
            title=title,
            slug=slug,
            content=content,
            excerpt=excerpt or content[:200],
            tags=tags,
            author_id=current_user.id,
            is_published=is_published
        )
        db.session.add(post)
        db.session.commit()
        flash('Blog post created!', 'success')
        return redirect(url_for('blog.post_detail', slug=post.slug))

    return render_template('blog/create.html')


@blog_bp.route('/edit/<int:post_id>', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_post(post_id):
    """Edit blog post (admin only)."""
    post = BlogPost.query.get_or_404(post_id)

    if request.method == 'POST':
        post.title = request.form.get('title', post.title).strip()
        post.content = request.form.get('content', post.content).strip()
        post.excerpt = request.form.get('excerpt', post.excerpt).strip()
        post.tags = request.form.get('tags', post.tags).strip()
        post.is_published = request.form.get('is_published') == 'on'

        db.session.commit()
        flash('Blog post updated!', 'success')
        return redirect(url_for('blog.post_detail', slug=post.slug))

    return render_template('blog/edit.html', post=post)


@blog_bp.route('/delete/<int:post_id>', methods=['POST'])
@login_required
@admin_required
def delete_post(post_id):
    """Delete blog post (admin only)."""
    post = BlogPost.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    if request.is_json:
        return jsonify({'success': True, 'message': 'Post deleted.'})
    flash('Blog post deleted.', 'info')
    return redirect(url_for('blog.list_posts'))
