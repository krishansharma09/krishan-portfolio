"""Authentication blueprint — login, signup, logout."""
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from ..extensions import db
from ..models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login."""
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))

    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        remember = bool(data.get('remember', False))

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            if request.is_json:
                return jsonify({'success': False, 'message': 'Invalid email or password.'}), 401
            flash('Invalid email or password.', 'danger')
            return redirect(url_for('auth.login'))

        if not user.is_active:
            if request.is_json:
                return jsonify({'success': False, 'message': 'Account is deactivated.'}), 403
            flash('Your account has been deactivated.', 'danger')
            return redirect(url_for('auth.login'))

        login_user(user, remember=remember)
        user.last_login = datetime.utcnow()
        db.session.commit()

        next_page = request.args.get('next')
        if request.is_json:
            return jsonify({
                'success': True,
                'message': f'Welcome back, {user.username}!',
                'redirect': next_page or url_for('main.index'),
                'role': user.role
            })

        flash(f'Welcome back, {user.username}!', 'success')
        return redirect(next_page or url_for('main.index'))

    return render_template('auth/login.html')


@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    """User registration."""
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))

    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')

        # Validation
        errors = {}
        if not username or len(username) < 3:
            errors['username'] = 'Username must be at least 3 characters.'
        if not email or '@' not in email:
            errors['email'] = 'Valid email is required.'
        if not password or len(password) < 8:
            errors['password'] = 'Password must be at least 8 characters.'
        if password != confirm_password:
            errors['confirm_password'] = 'Passwords do not match.'
        if User.query.filter_by(username=username).first():
            errors['username'] = 'Username already taken.'
        if User.query.filter_by(email=email).first():
            errors['email'] = 'Email already registered.'

        if errors:
            if request.is_json:
                return jsonify({'success': False, 'errors': errors}), 400
            for msg in errors.values():
                flash(msg, 'danger')
            return redirect(url_for('auth.signup'))

        # Create user (first user becomes admin)
        role = 'admin' if User.query.count() == 0 else 'client'
        user = User(username=username, email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        login_user(user)
        if request.is_json:
            return jsonify({
                'success': True,
                'message': 'Account created successfully!',
                'redirect': url_for('main.index')
            })
        flash('Account created successfully! Welcome aboard.', 'success')
        return redirect(url_for('main.index'))

    return render_template('auth/signup.html')


@auth_bp.route('/logout')
@login_required
def logout():
    """User logout."""
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('main.index'))
