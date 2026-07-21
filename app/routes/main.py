"""Main blueprint — Home, About, Contact pages."""
import os
from datetime import datetime
from flask import Blueprint, render_template, request, jsonify, current_app, flash, redirect, url_for, send_file, abort
from flask_mail import Message as MailMessage
from ..extensions import db, mail
from ..models.message import Message
from ..models.service import Service
from ..models.project import Project

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Home page with featured services and projects."""
    featured_services = Service.query.filter_by(is_featured=True).order_by(Service.order).limit(3).all()
    featured_projects = Project.query.filter_by(is_featured=True).order_by(Project.order).limit(3).all()
    return render_template(
        'index.html',
        featured_services=featured_services,
        featured_projects=featured_projects
    )


@main_bp.route('/about')
def about():
    """About page."""
    return render_template('about.html')


@main_bp.route('/download-resume')
def download_resume():
    """Direct download of Krishan Sharma's resume. Checks for PDF first, then DOCX."""
    assets_dir = os.path.join(current_app.root_path, 'static', 'assets')

    # Try PDF first (preferred), fall back to DOCX
    pdf_path  = os.path.join(assets_dir, 'Krishan_Sharma_Resume.pdf')
    docx_path = os.path.join(assets_dir, 'Krishan_Sharma_Resume.docx')

    if os.path.exists(pdf_path):
        return send_file(
            pdf_path,
            as_attachment=True,
            download_name='Krishan_Sharma_Resume.pdf',
            mimetype='application/pdf'
        )
    elif os.path.exists(docx_path):
        return send_file(
            docx_path,
            as_attachment=True,
            download_name='Krishan_Sharma_Resume.docx',
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    else:
        abort(404, description=(
            "Resume file not found. Please place 'Krishan_Sharma_Resume.pdf' (or .docx) "
            "in app/static/assets/ and contact me at krishansharma995060@gmail.com"
        ))


@main_bp.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page with message form."""
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form

        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message_text = data.get('message', '').strip()

        # Validation
        errors = {}
        if not name:
            errors['name'] = 'Name is required.'
        if not email or '@' not in email:
            errors['email'] = 'Valid email is required.'
        if not message_text or len(message_text) < 10:
            errors['message'] = 'Message must be at least 10 characters.'

        if errors:
            if request.is_json:
                return jsonify({'success': False, 'errors': errors}), 400
            for field, msg in errors.items():
                flash(msg, 'danger')
            return redirect(url_for('main.contact'))

        # Save to database
        msg = Message(
            name=name,
            email=email,
            subject=subject or 'No Subject',
            message=message_text
        )
        db.session.add(msg)
        db.session.commit()

        # Send email notification (optional — gracefully skip if not configured)
        _send_contact_email(name, email, subject, message_text)

        if request.is_json:
            return jsonify({'success': True, 'message': 'Your message has been sent!'})
        flash('Your message has been sent! I\'ll get back to you soon.', 'success')
        return redirect(url_for('main.contact'))

    return render_template('contact.html')


def _send_contact_email(name, email, subject, message_text):
    """Send email notification to admin. Fails silently if mail not configured."""
    try:
        if not current_app.config.get('MAIL_USERNAME'):
            return
        admin_email = current_app.config['ADMIN_EMAIL']
        msg = MailMessage(
            subject=f'[FreelanceHub] New Contact: {subject}',
            recipients=[admin_email],
            reply_to=email,
            body=f'From: {name} <{email}>\n\n{message_text}'
        )
        mail.send(msg)
    except Exception as e:
        current_app.logger.warning(f'Email send failed: {e}')
