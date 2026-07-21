"""Client request blueprint — project request form with file upload."""
import os
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from flask_login import current_user
from werkzeug.utils import secure_filename
from ..extensions import db
from ..models.client_request import ClientRequest

client_bp = Blueprint('client', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'zip', 'txt'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@client_bp.route('/request', methods=['GET', 'POST'])
def submit_request():
    """Client project request form with optional file upload."""
    if request.method == 'POST':
        # Get form data
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        title = request.form.get('title', '').strip()
        description = request.form.get('description', '').strip()
        budget = request.form.get('budget', '').strip()
        deadline_str = request.form.get('deadline', '').strip()

        # Validation
        errors = {}
        if not name:
            errors['name'] = 'Name is required.'
        if not email or '@' not in email:
            errors['email'] = 'Valid email is required.'
        if not title:
            errors['title'] = 'Project title is required.'
        if not description or len(description) < 20:
            errors['description'] = 'Please describe your project in at least 20 characters.'

        if errors:
            if request.is_json:
                return jsonify({'success': False, 'errors': errors}), 400
            for msg in errors.values():
                flash(msg, 'danger')
            return redirect(url_for('client.submit_request'))

        # Parse deadline
        deadline = None
        if deadline_str:
            try:
                deadline = datetime.strptime(deadline_str, '%Y-%m-%d').date()
            except ValueError:
                pass

        # Handle file upload
        file_path = None
        file_name = None
        file = request.files.get('attachment')
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            filename = f'{timestamp}_{filename}'
            upload_dir = current_app.config['UPLOAD_FOLDER']
            os.makedirs(upload_dir, exist_ok=True)
            full_path = os.path.join(upload_dir, filename)
            file.save(full_path)
            file_path = full_path
            file_name = file.filename

        # Save to DB
        client_id = current_user.id if current_user.is_authenticated else None
        req = ClientRequest(
            client_id=client_id,
            name=name,
            email=email,
            title=title,
            description=description,
            budget=budget,
            deadline=deadline,
            file_path=file_path,
            file_name=file_name
        )
        db.session.add(req)
        db.session.commit()

        flash('Your project request has been submitted! I\'ll review it and get back to you.', 'success')
        return redirect(url_for('client.submit_request'))

    return render_template('client_request.html')
