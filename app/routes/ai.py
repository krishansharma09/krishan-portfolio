"""AI chatbot blueprint — streams responses from Google Gemini API or custom retriever."""
from flask import Blueprint, request, jsonify, Response, stream_with_context
from ..utils.chatbot.service import ChatbotService

ai_bp = Blueprint('ai', __name__)
chatbot_service = ChatbotService()


@ai_bp.route('/chat', methods=['POST'])
def chat():
    """Handle AI chatbot messages via streaming Gemini API."""
    data = request.get_json() or {}
    user_message = data.get('message', '').strip()
    history = data.get('history', [])  # List of {role, content} dicts

    if not user_message:
        return jsonify({'success': False, 'reply': 'No message provided.'}), 400

    def generate():
        # Stream the text chunks directly as plain text
        for chunk in chatbot_service.stream_chat(user_message, history):
            yield chunk

    return Response(stream_with_context(generate()), content_type='text/plain')
