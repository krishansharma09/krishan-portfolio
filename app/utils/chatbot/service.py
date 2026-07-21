import os
import time
import re
import requests
import google.generativeai as genai
from .retriever import JSONRetriever

class ChatbotService:
    """Service to handle chatbot queries, prompt management, streaming LLM, lead capture, and fallback."""
    def __init__(self, retriever=None):
        self.retriever = retriever or JSONRetriever()
        
    def get_system_prompt(self) -> str:
        """Retrieves portfolio context and constructs system instructions structured by section."""
        portfolio_context = self.retriever.retrieve("")
        
        system_prompt = f"""You are Nova, an approachable, friendly, and intelligent AI assistant representing Krishan Sharma — Machine Learning Engineer & Python Developer based in Jaipur, Rajasthan, India.

PURPOSE:
Help visitors explore every section of Krishan's portfolio website, answer service/pricing/location inquiries, and capture project leads for Krishan.

PORTFOLIO KNOWLEDGE BASE (JSON DATA):
{portfolio_context}

=== BASIC INFORMATION & LOCATION ===
- Name: Krishan Sharma
- Primary Role: Machine Learning Engineer & Python Developer
- Location: Jaipur, Rajasthan, India (He is based in Jaipur, Rajasthan, India)
- Contact Email: krishansharma995060@gmail.com
- Contact Phone: +91 86191 64592
- LinkedIn: linkedin.com/in/krishan-sharma-50a89635b
- GitHub: github.com/krishansharma09

=== HOME & HERO SECTION ===
- Headline: "I build intelligent AI systems & scalable Python backends"
- Subheading: Python Developer & AI/ML Engineer skilled in Flask, FastAPI, Machine Learning, LLM Integration, REST APIs, and intelligent automation.
- Location & Status: Open to AI/ML Opportunities · Jaipur, Rajasthan, India
- Key Stats & Metrics: 3+ years learning journey, 10+ projects built, 7 months industry internship, 15+ technologies.
- Featured Tech Tags: Python, Flask, FastAPI, Machine Learning, LLM Integration, Computer Vision, PostgreSQL, AWS, Docker, Generative AI.

=== ABOUT ME SECTION ===
- Profile: Krishan Sharma — Machine Learning Engineer & Python Developer based in Jaipur, Rajasthan, India.
- Bio: Specializes in developing scalable backend applications, AI-powered systems, REST APIs, and intelligent automation solutions. Focuses on creating efficient, user-centric, and production-ready applications with modern workflows.

=== CURRENT STATUS & EMPLOYMENT AVAILABILITY ===
- Current Academic Status: Krishan is currently a student pursuing his Master of Computer Applications (MCA) at JECRC University, Sitapura, Jaipur (Aug 2025 – Present, ongoing).
- Work Experience Status: Worked as a Machine Learning Engineer Intern at Dotsquares Technologies Pvt. Ltd. (Aug 2024 – Feb 2025, 7 months).
- Availability: Open to full-time Python Developer / Machine Learning Engineer roles, internships, and freelance projects.
- GUIDANCE FOR STATUS QUESTIONS: Questions asking whether Krishan is a student or working full-time MUST explain that he is currently pursuing his MCA at JECRC University (started Aug 2025) while actively open to full-time Python Developer / ML Engineer roles, internships, and freelance work. Do NOT return the projects list for status or employment queries.

=== WORK EXPERIENCE SECTION ===
- Role: Machine Learning Engineer Intern
- Company: Dotsquares Technologies Pvt. Ltd. (Jagatpura, Jaipur, Rajasthan, India)
- Duration: August 2024 – February 2025 (7 Months)
- Highlights & Accomplishments:
  • Designed and deployed NLP pipelines for text classification, entity recognition, and semantic similarity (90%+ accuracy).
  • Built RESTful APIs using Flask and FastAPI for ML inference endpoints (35% lower latency via async processing).
  • Developed and fine-tuned machine learning models using Scikit-learn for predictive analytics and document categorization.
  • Implemented LLM-powered features using LangChain and Gemini AI for intelligent document Q&A and text summarization.
  • Optimized PostgreSQL schemas and integrated FAISS vector stores for sub-second similarity search across large-scale text corpora.

=== PROJECTS SECTION ===
1. Binance Futures Trading Bot: Automated cryptocurrency futures trading bot built with Python and Binance API. Features real-time WebSocket market data streaming for sub-second signal generation, technical strategy engine (RSI, MACD, Bollinger Bands), automated risk management (Stop-Loss and Take-Profit), and Pandas/NumPy backtesting framework. (GitHub: github.com/krishansharma09/binance-futures-trading-bot)
2. Personal Finance Dashboard: Web app allowing users to upload bank statement CSVs and view auto-categorized spending insights. Features keyword auto-categorization via Pandas, summary cards, interactive Chart.js graphs, and sortable transactions table built on Flask + Pandas. (GitHub: github.com/krishansharma09/Personal-Finance-Dashboard)
3. AI Chatbot with Gemini + PostgreSQL + FAISS: Production-grade conversational AI chatbot built with Google Gemini LLM and LangChain for multi-turn dialogue management. FAISS search over 10,000+ document embeddings, FastAPI + PostgreSQL backend for persistent chat history, supporting 50+ concurrent users with 92% satisfaction.
4. RAG-Based Document Chatbot: End-to-end Retrieval-Augmented Generation pipeline allowing users to upload PDFs and query documents in natural language with high precision. Document chunking, FAISS vector indexing, interactive Streamlit UI, and 40% reduced context noise.
5. E-Commerce Platform: Microservices architecture with Flask APIs, React frontend, PostgreSQL with Redis caching on AWS ECS.

=== INSIGHTS SECTION ===
- Section Title: "Insights & Experiments"
- Subtitle: "Sharing what I'm building, learning and exploring in AI, backend and automation."
- Card 01 - Current Focus: Building AI applications, backend systems and automation solutions using Python.
- Card 02 - Learning Journey: Currently improving expertise in Machine Learning, LLMs, Cloud and scalable architecture.
- Card 03 - Coming Soon: Technical articles and project breakdowns will be added soon.

=== SERVICES SECTION ===
- Section Title: "Professional Services — What I Offer"
- Offered Services & Rates:
  1. Full-Stack Web Development: End-to-end web apps from API design to UI implementation. (Rate: ₹8,000–₹20,000 / $100–$250)
  2. API Development & Integration: RESTful and GraphQL API design, building, and third-party integration. (Rate: ₹2,000–₹8,000 / $25–$100)
  3. AI & Machine Learning Integration: Integrate AI models, LLMs, chatbots, recommendation engines, and automation scripts into your product. (Rate: ₹4,000–₹16,000 / $50–$200)
  4. Database Design & Optimization: PostgreSQL, MySQL, MongoDB schema design and query tuning. (Rate: ₹2,000–₹6,000 / $25–$75)
  5. DevOps & Cloud Deployment: CI/CD pipelines, Docker containerization, AWS/GCP deployment. (Rate: ₹3,000–₹10,000 / $40–$120)
  6. Technical Consulting & Python Automation Scripting: Architecture review, Python automation scripts, code audits, performance optimization. (Rate: ₹400/hr / $5/hr or custom project quote)

=== SKILLS SECTION ===
- Languages: Python (Advanced), SQL, Bash, HTML, CSS, JavaScript
- AI / ML / NLP: Machine Learning, NLP (Text Classification, Entity Recognition, Semantic Similarity), Deep Learning, Generative AI, RAG Pipelines, LLM Integration, Prompt Engineering
- Frameworks & Libraries: LangChain, Scikit-learn, TensorFlow (basics), Hugging Face Transformers, Pandas, NumPy
- Backend & APIs: FastAPI, Flask, RESTful APIs, Microservices, Async Processing, JWT Auth, Pydantic
- Databases & Vector Stores: PostgreSQL, FAISS Vector Store, pgvector, SQLAlchemy ORM
- Tools & Cloud: Streamlit, Gemini AI, OpenAI API, Git, GitHub, Docker, Postman, WebSockets

=== EDUCATION SECTION ===
- Master of Computer Applications (MCA) — JECRC University, Sitapura, Jaipur (Aug 2025 – Present, currently pursuing / ongoing)
- Bachelor of Computer Applications (BCA) — University of Rajasthan, Jaipur (Aug 2022 – Aug 2025, completed)

=== COLLABORATE & START A PROJECT SECTION ===
- Title: "Let's Build Something Amazing / Start a Project"
- Response SLA: Guaranteed response within 24 hours.

=== CONTACT & SOCIAL CHANNELS SECTION ===
- Email: krishansharma995060@gmail.com
- Phone: +91 86191 64592
- LinkedIn: linkedin.com/in/krishan-sharma-50a89635b
- GitHub: github.com/krishansharma09
- Location: Jaipur, Rajasthan, India

=== RESUME & DOWNLOAD SECTION ===
- Resume PDF/DOCX download feature. Include [TRIGGER_DOWNLOAD] in response if user asks to download resume.

CORE BEHAVIORAL & DECISION RULES:
1. HIRING INTENT & SERVICE/RATE INQUIRIES (PRIORITY #1):
   - Evaluate each hiring question specifically based on its topic:
     a) If asked about CHATBOT / AI DEVELOPMENT (e.g. "I'm looking for someone to build a chatbot for my business, are you available?"): Confirm availability, mention AI/Chatbot integration rates (₹4,000–₹16,000 / $50–$200), and ask for Name, Email, and chatbot features.
     b) If asked about PYTHON AUTOMATION / SCRIPTING (e.g. "Can you help me with a Python automation script? What's your rate?"): Confirm availability, mention automation scripting rates (₹400/hr / $5/hr or ₹2,000–₹8,000 / $25–$100 per script), and ask for Name, Email, and automation details.
     c) If asked about WEB DEVELOPMENT (e.g. "need a website built"): Confirm availability, mention full-stack rates (₹8,000–₹20,000 / $100–$250), and ask for Name, Email, and project details.
2. LOCATION QUESTIONS: When asked where Krishan is based or located (e.g. "Where is he based?"), answer clearly: "Krishan is based in Jaipur, Rajasthan, India."
3. NAMED SECTION INQUIRIES: Describe the specific named section in detail when requested by name (Insights, Services, Skills, Projects, Education, About, Contact).
4. CASUAL CONVERSATION: Respond warmly and naturally to greetings ("hi", "hello"), check-ins ("how are you"), reactions ("Good", "cool", "nice"), and gratitude ("thanks") without forcing fallback or project lists.
5. SINGLE PROJECT VS ALL PROJECTS RULE: If asked about ONE specific project (e.g. "Tell me about the Binance trading bot project"), describe ONLY that specific project. If asked generally ("What projects has Krishan built?"), list all 4 main projects.
6. STRICT FALLBACK RULE: Trigger fallback ("I don't have information on that specific topic...") ONLY for factual questions about topics completely unrelated to Krishan or his portfolio.
"""
        return system_prompt

    def parse_lead_info(self, user_message: str, history: list = None) -> dict:
        """Parses Name, Email, and Project Description ONLY when a NEW email is provided in the current user message."""
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', user_message)
        if not email_match:
            return None

        email = email_match.group(0).strip()

        # Build context from user_message first, then combine with preceding user turn if description is short
        text_corpus = user_message
        if history and len(history) > 0:
            prev_user_msgs = [h.get('content', '') for h in history if h.get('role') == 'user']
            if prev_user_msgs:
                text_corpus = prev_user_msgs[-1] + " \n " + user_message

        # Extract name from user_message first using clean patterns
        name = None
        
        # Explicit name patterns
        m1 = re.search(r'(?:name\s*[:=]?\s*is\s*|name\s*[:=]\s*|my\s+name\s+is\s+|i\'m\s+|iam\s+|this\s+is\s+)([a-zA-Z\s]{2,30})(?=\s*\,|\s+email|\s+and|\s+my|$|\.|\,)', user_message, re.IGNORECASE)
        if m1:
            extracted = m1.group(1).strip()
            if extracted and len(extracted) > 1 and not any(w in extracted.lower() for w in ['email', 'my', 'the', 'is', 'and', 'project']):
                name = extracted.title()

        # Pattern: "Test User, email: test@example.com"
        if not name:
            m2 = re.search(r'^([a-zA-Z\s]{2,30})(?=\s*\,?\s*email)', user_message, re.IGNORECASE)
            if m2:
                extracted = m2.group(1).strip()
                if extracted and len(extracted) > 1 and not any(w in extracted.lower() for w in ['email', 'my', 'the', 'is', 'and', 'project', 'looking']):
                    name = extracted.title()

        if not name:
            name = "Visitor"

        # Extract message / project description
        msg_text = text_corpus
        msg_text = re.sub(r'name\s*[:=]?\s*(?:is\s*)?[a-zA-Z\s]{2,30}', '', msg_text, flags=re.IGNORECASE)
        msg_text = re.sub(r'my\s+name\s+is\s+[a-zA-Z\s]{2,30}', '', msg_text, flags=re.IGNORECASE)
        msg_text = re.sub(r'email\s*[:=]?\s*(?:is\s*)?', '', msg_text, flags=re.IGNORECASE)
        msg_text = re.sub(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', '', msg_text)
        
        clean_desc = re.sub(r'\s+', ' ', msg_text).strip(' ,.and:')
        if not clean_desc or len(clean_desc) < 3:
            clean_desc = "Project inquiry via chatbot"

        return {
            "name": name,
            "email": email,
            "message": clean_desc
        }

    def save_lead_db(self, name: str, email: str, message_text: str):
        """Saves a captured lead to the database as a backup."""
        try:
            from flask import current_app
            from ...extensions import db
            from ...models.message import Message
            
            def save():
                msg = Message(
                    name=name,
                    email=email,
                    subject="New Lead via Nova Chatbot (Source: Chatbot lead)",
                    message=f"[Source: Chatbot lead]\nName: {name}\nEmail: {email}\nProject Details: {message_text}"
                )
                db.session.add(msg)
                db.session.commit()

            try:
                if current_app:
                    save()
                else:
                    from ... import create_app
                    app = create_app()
                    with app.app_context():
                        save()
            except RuntimeError:
                from ... import create_app
                app = create_app()
                with app.app_context():
                    save()
        except Exception as e:
            print(f"DB lead save warning (handled): {e}")

    def stream_chat(self, user_message: str, history: list):
        """Streams the chat response from Gemini API or falls back to local rules if needed."""
        # ── PRIORITY LEAD DETECTION (Triggers ONLY when user_message contains a new email address) ──
        lead = self.parse_lead_info(user_message, history)
        if lead:
            self.save_lead_db(lead['name'], lead['email'], lead['message'])
            trigger_tag = f'[SUBMIT_LEAD: name="{lead["name"]}" email="{lead["email"]}" message="{lead["message"]}"]'
            reply = f"{trigger_tag}\nThanks {lead['name']}! I've sent your project request to Krishan — he'll get back to you soon at {lead['email']}."
            
            # Stream response word by word
            words = reply.split(' ')
            for i, word in enumerate(words):
                yield (word + ' ') if i < len(words) - 1 else word
                time.sleep(0.04)
            return

        api_key = os.environ.get('GEMINI_API_KEY') or os.getenv('GEMINI_API_KEY')
        
        if not api_key:
            yield from self._stream_fallback(user_message)
            return

        try:
            genai.configure(api_key=api_key)
            system_prompt = self.get_system_prompt()
            
            model = genai.GenerativeModel(
                model_name='gemini-2.0-flash',
                system_instruction=system_prompt
            )
            
            formatted_history = []
            for h in history:
                role = 'user' if h.get('role') == 'user' else 'model'
                content = h.get('content', '')
                if content:
                    formatted_history.append({'role': role, 'parts': [content]})
                    
            chat_session = model.start_chat(history=formatted_history)
            response = chat_session.send_message(user_message, stream=True)
            
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except Exception as e:
            print(f"Gemini streaming error: {e}")
            yield from self._stream_fallback(user_message)

    def _stream_fallback(self, user_message: str):
        """Simulates response streaming for fallback rules."""
        reply = self._get_fallback_text(user_message)
        
        words = reply.split(' ')
        for i, word in enumerate(words):
            yield (word + ' ') if i < len(words) - 1 else word
            time.sleep(0.04)

    def _get_fallback_text(self, user_message: str) -> str:
        """Determines the fallback answer using local portfolio rules."""
        msg = user_message.lower().strip()

        # ── 1. HIRING / SERVICE / RATE / PROJECT INTEREST (PRIORITY #1) ──
        # 1a. Python Automation Script inquiry
        if any(k in msg for k in ['automation script', 'python script', 'automation', 'scripting', 'python automation']):
            return ("Yes! Krishan can definitely help you with a custom Python automation script or data workflow. "
                    "Technical consulting and automation scripting rates are **₹400/hr ($5/hr)** or structured per project (typically **₹2,000–₹8,000 / $25–$100** depending on complexity).\n\n"
                    "To get an exact quote and discuss your project, please share your **Name**, **Email address**, and a short description of what you need automated! "
                    "Once shared, I'll send your details directly to Krishan so he can reach out to you.")

        # 1b. Chatbot / AI Application inquiry
        if any(k in msg for k in ['chatbot', 'ai chatbot', 'build a chatbot', 'custom chatbot', 'rag chatbot']):
            return ("Yes! Krishan is available and specializes in building custom AI chatbots, RAG pipelines, and LLM applications using Python, LangChain, and Gemini/OpenAI! "
                    "AI & Machine Learning Integration typically ranges from **₹4,000–₹16,000 ($50–$200)** depending on features and context size.\n\n"
                    "To get started and receive a custom estimate, please share your **Name**, **Email address**, and a short description of what you'd like your chatbot to do! "
                    "Once provided, I will send your details directly to Krishan so he can reach out to you.")

        # 1c. Website / Web App inquiry
        if any(k in msg for k in ['website', 'web app', 'build a website', 'web development']):
            return ("Yes! Krishan is available for full-stack web development projects building responsive, modern web applications. "
                    "Full-Stack Web Development rates typically range from **₹8,000–₹20,000 ($100–$250)** depending on design and backend complexity.\n\n"
                    "To get started, please share your **Name**, **Email address**, and a short description of your website requirements! "
                    "Once shared, I'll send your details directly to Krishan so he can reach out to you.")

        # 1d. General Hiring / Rate inquiry
        if any(k in msg for k in ['rate', 'rates', 'pricing', 'cost', 'hire you', 'want to hire', 'available to build', 'are you available', 'how much for', 'how much would it cost', 'looking for someone']):
            return ("Yes, Krishan is available for freelance projects and full-time opportunities! "
                    "His rates are: AI/ML Integration (**₹4,000–₹16,000 / $50–$200**), Full-Stack Web Development (**₹8,000–₹20,000 / $100–$250**), and Python Automation Scripting (**₹400/hr / $5/hr**).\n\n"
                    "To discuss your project and get a custom proposal, please share your **Name**, **Email address**, and a short description of what you need built! "
                    "Once provided, I will send your details directly to Krishan so he can reach out to you.")

        # ── 2. Combined Thanks + Bye ──
        if any(k in msg for k in ['thanks, bye', 'thanks bye', 'thank you bye', 'bye thanks', 'bye, thanks']):
            return "You're very welcome! Have a wonderful day ahead. Feel free to reach out to Krishan anytime via the contact form!"

        # ── 3. Farewells ──
        if any(k in msg for k in ['bye', 'goodbye', 'see you', 'gtg', 'talk later', 'cya', 'have a good day', 'good night']):
            return "Goodbye! Have a great day ahead. Feel free to reach out to Krishan via the contact form anytime if you need anything else!"

        # ── 4. Gratitude ──
        if any(k in msg for k in ['thanks', 'thank you', 'thx', 'appreciate it', 'thanku', 'tanks']):
            return "You're very welcome! Let me know if you have any more questions about Krishan's work."

        # ── 5. Greetings ──
        if 'good morning' in msg:
            return "Good morning! I'm Nova, Krishan's AI portfolio assistant. How can I help you explore Krishan's projects or skills today?"
        if 'good afternoon' in msg:
            return "Good afternoon! I'm Nova, Krishan's AI portfolio assistant. How can I help you today?"
        if 'good evening' in msg:
            return "Good evening! I'm Nova, Krishan's AI portfolio assistant. How can I help you explore Krishan's work tonight?"
        if msg in ['hi', 'hello', 'hey', 'greetings', 'namaste', 'hi!', 'hello!', 'hey!'] or any(k in msg for k in ['hello nova', 'hi nova', 'hey nova']):
            return "Hello! I'm Nova, Krishan's AI portfolio assistant. How can I assist you with Krishan's work or experience today?"

        # ── 6. Wellbeing Check-ins ──
        if any(k in msg for k in ['how are you', 'how\'s it going', 'hows it going', 'what\'s up', 'whats up', 'kaise ho', 'how r u']):
            return "I'm doing great, thanks for asking! Ready to help you learn about Krishan's projects, skills, or experience."

        # ── 7. Compliments & Small Talk ──
        if any(k in msg for k in ['portfolio looks great', 'nice portfolio', 'great portfolio', 'cool site', 'this is cool', 'nice site', 'helpful', 'awesome', 'great work', 'love this']):
            return "Thank you so much! Krishan put a lot of effort into building this portfolio and his AI projects. Let me know if you'd like to explore any specific project or skill!"

        # ── 8. Strict Acknowledgments & Reactions (exact word boundary to prevent 'ok' in 'looking') ──
        if msg in ['good', 'ok', 'okay', 'cool', 'nice', 'great', 'wow', 'haha', 'lol', 'got it', 'sure']:
            return "Glad to hear that! Let me know if there's anything else about Krishan's work or portfolio you'd like to explore."
        if re.search(r'\b(lol|haha|lmao|cool|nice|great|wow|okay)\b', msg) and not any(w in msg for w in ['project', 'work', 'build', 'service', 'looking']):
            return "Glad to hear that! Let me know if there's anything else about Krishan's work you'd like to check out."

        # ── 9. Location Queries ──
        if any(k in msg for k in ['where is he based', 'where is krishan based', 'location', 'where does he live', 'where is he located', 'jaipur', 'rajasthan', 'city', 'based in', 'country']):
            return "Krishan is based in **Jaipur, Rajasthan, India**."

        # ── 10. Status / Student / Working full-time query ──
        if any(k in msg for k in ['student', 'working', 'full-time', 'fulltime', 'employment', 'status', 'currently doing', 'job status']):
            return ("Krishan is currently a student pursuing his Master of Computer Applications (MCA) at JECRC University, Sitapura, Jaipur (Aug 2025 – Present). "
                    "He previously completed a 7-month Machine Learning Engineer Internship at Dotsquares Technologies (Aug 2024 – Feb 2025) and is actively open to full-time Python Developer / Machine Learning Engineer roles, internships, and freelance projects!")

        # ── 11. Education Query ──
        if any(k in msg for k in ['education', 'educational', 'study', 'studied', 'degree', 'college', 'university', 'bca', 'mca', 'academic', 'qualification']):
            return ("Krishan's educational background includes:\n\n"
                    "• **Master of Computer Applications (MCA):** JECRC University, Sitapura, Jaipur (Aug 2025 – Present, currently pursuing)\n"
                    "• **Bachelor of Computer Applications (BCA):** University of Rajasthan, Jaipur (Aug 2022 – Aug 2025, completed)")

        # ── 12. Insights Section Query ──
        if any(k in msg for k in ['insight', 'insights', 'experiment', 'experiments', 'blog']):
            return ("The **Insights & Experiments** section shares what Krishan is currently building, learning, and exploring:\n\n"
                    "• **01 Current Focus:** Building AI applications, backend systems, and automation solutions using Python.\n"
                    "• **02 Learning Journey:** Expanding expertise in Machine Learning, LLMs, Cloud, and scalable architecture.\n"
                    "• **03 Coming Soon:** Technical articles and project breakdowns will be published soon!")

        # ── 13. Services & Pricing ──
        if any(k in msg for k in ['service', 'services', 'pricing', 'price', 'cost', 'offer', 'offers']):
            return ("Here is what's in the **Services** section:\n\n"
                    "• **Full-Stack Web Development:** End-to-end web apps from API design to UI (₹8,000–₹20,000 / $100–$250).\n"
                    "• **API Development & Integration:** RESTful/GraphQL APIs and 3rd-party integrations (₹2,000–₹8,000 / $25–$100).\n"
                    "• **AI & Machine Learning Integration:** LLMs, chatbots, RAG pipelines, and data analytics (₹4,000–₹16,000 / $50–$200).\n"
                    "• **Database Design & Optimization:** PostgreSQL, MySQL, MongoDB schema design and query tuning (₹2,000–₹6,000 / $25–$75).\n"
                    "• **DevOps & Cloud Deployment:** CI/CD pipelines, Docker, AWS/GCP deployment (₹3,000–₹10,000 / $40–$120).\n"
                    "• **Technical Consulting & Automation:** Architecture review, Python scripts, code audits (₹400/hr / $5/hr).\n\n"
                    "Visitors can also request custom project solutions directly through the site!")

        # ── 14. Skills Section ──
        if any(k in msg for k in ['skill', 'skills', 'tech stack', 'technologies']):
            return ("Here is what's in the **Skills** section:\n\n"
                    "• **Languages:** Python (Advanced), SQL, Bash, HTML, CSS, JavaScript\n"
                    "• **AI / ML / NLP:** Machine Learning, NLP (Text Classification, Entity Recognition, Semantic Similarity), Deep Learning, Generative AI, RAG Pipelines, LLM Integration, Prompt Engineering\n"
                    "• **Frameworks & Libraries:** LangChain, Scikit-learn, TensorFlow (basics), Hugging Face Transformers, Pandas, NumPy\n"
                    "• **Backend & APIs:** FastAPI, Flask, RESTful APIs, Microservices, Async Processing, JWT Auth, Pydantic\n"
                    "• **Databases & Vector Stores:** PostgreSQL, FAISS Vector Store, pgvector, SQLAlchemy ORM\n"
                    "• **Tools & Cloud:** Streamlit, Gemini AI, OpenAI API, Git, GitHub, Docker, Postman, WebSockets")

        # ── 15. Tell me about yourself / introduce yourself / who are you ──
        if any(k in msg for k in ['tell me about yourself', 'who are you', 'introduce yourself', 'about yourself', 'what is your name', 'who created you', 'tell about yourself']):
            return ("Hi! I'm Nova, an AI assistant representing Krishan Sharma. "
                    "Krishan is a Machine Learning Engineer & Python Developer based in Jaipur, India. "
                    "He specializes in building AI-powered applications, NLP systems, REST APIs, and RAG pipelines using LLMs and vector databases. "
                    "How can I help you explore his work today?")

        # ── 16. Single project queries vs General projects ──
        is_trading_bot = any(k in msg for k in ['trading bot', 'binance', 'crypto bot', 'futures bot'])
        is_rag_bot = any(k in msg for k in ['rag', 'document chatbot', 'pdf chatbot', 'rag-based'])
        is_gemini_bot = any(k in msg for k in ['gemini chatbot', 'faiss chatbot', 'ai chatbot with gemini', 'multi-turn'])
        is_finance = any(k in msg for k in ['finance dashboard', 'personal finance', 'bank statement', 'spending insights'])
        is_general_projects = any(k in msg for k in ['what projects', 'all projects', 'list projects', 'other projects', 'show me his work', 'what projects has krishan built'])

        if is_trading_bot and not is_general_projects:
            return ("**Binance Futures Trading Bot**\n\n"
                    "An automated cryptocurrency futures trading bot developed using Python and the Binance API.\n\n"
                    "**Key Features:** Real-time WebSocket market data streaming for sub-second signal generation, a technical strategy engine (RSI, MACD, Bollinger Bands), automated risk management (Stop-Loss and Take-Profit), and a Pandas/NumPy backtesting framework.\n\n"
                    "**Tech Stack:** Python, Binance API, WebSockets, Pandas, NumPy.\n"
                    "**GitHub:** github.com/krishansharma09/binance-futures-trading-bot")

        if is_rag_bot and not is_general_projects:
            return ("**RAG-Based Document Chatbot**\n\n"
                    "An end-to-end Retrieval-Augmented Generation pipeline that allows users to upload PDFs and query documents in natural language with high precision.\n\n"
                    "**Key Features:** PDF document chunking, embedding generation, FAISS vector indexing, interactive Streamlit UI, and prompt template optimization that reduced irrelevant context injection by 40%.\n\n"
                    "**Tech Stack:** Python, LangChain, FAISS, Streamlit, Gemini AI / OpenAI.")

        if is_gemini_bot and not is_general_projects:
            return ("**AI Chatbot with Gemini + PostgreSQL + FAISS**\n\n"
                    "A production-grade conversational AI chatbot built with Google Gemini LLM and LangChain for multi-turn dialogue management.\n\n"
                    "**Key Features:** Sub-second semantic search across 10,000+ document embeddings via FAISS, persistent chat history and user auth using FastAPI + PostgreSQL backend, supporting 50+ concurrent users with a 92% satisfaction score.\n\n"
                    "**Tech Stack:** Python, LangChain, Gemini AI, FAISS, PostgreSQL, FastAPI.")

        if is_finance and not is_general_projects:
            return ("**Personal Finance Dashboard**\n\n"
                    "A web application that allows users to upload bank statement CSVs and view auto-categorized spending insights.\n\n"
                    "**Key Features:** CSV parsing via Pandas, keyword-based transaction categorization, summary cards, interactive Chart.js graphs, and a sortable transactions table.\n\n"
                    "**Tech Stack:** Python, Flask, Pandas, HTML, CSS, JavaScript, Chart.js.\n"
                    "**GitHub:** github.com/krishansharma09/Personal-Finance-Dashboard")

        if any(k in msg for k in ['projects', 'show me his work', 'portfolio', 'what projects has krishan built']):
            return ("Here are the key projects Krishan has built:\n\n"
                    "1. **AI Chatbot with Gemini + PostgreSQL + FAISS:** Production-grade conversational AI with LangChain, FAISS search over 10,000+ embeddings, and FastAPI/PostgreSQL backend.\n"
                    "2. **RAG-Based Document Chatbot:** PDF Q&A pipeline using LangChain, FAISS vector indexing, and Streamlit UI (40% less context noise).\n"
                    "3. **Binance Futures Trading Bot:** Automated crypto futures trading via Binance API, WebSockets live streaming, RSI/MACD/Bollinger strategy engine, and Pandas/NumPy backtesting.\n"
                    "4. **Personal Finance Dashboard:** Bank statement CSV upload, auto-categorization, interactive Chart.js graphs, Flask + Pandas backend.")

        # ── 17. Freelance / Availability ──
        if any(k in msg for k in ['freelance', 'available', 'hire', 'work together', 'collaborate', 'opportunity', 'open to']):
            return ("Yes! Krishan is currently open to full-time Python Developer / Machine Learning Engineer roles, internships, and freelance projects. "
                    "You can reach out directly via email at krishansharma995060@gmail.com or through the contact form on this site.")

        # ── 18. Contact / email / GitHub / LinkedIn ──
        if 'linkedin' in msg:
            return "LinkedIn: linkedin.com/in/krishan-sharma-50a89635b"
        if 'github' in msg:
            return "GitHub: github.com/krishansharma09"
        if any(k in msg for k in ['email', 'gmail', 'mail']):
            return "You can reach Krishan at krishansharma995060@gmail.com"
        if any(k in msg for k in ['contact', 'reach', 'connect']):
            return ("You can reach Krishan via:\n"
                    "Email: krishansharma995060@gmail.com\n"
                    "LinkedIn: linkedin.com/in/krishan-sharma-50a89635b\n"
                    "GitHub: github.com/krishansharma09")

        # ── 19. Fallback ONLY for unrelated factual questions ──
        return ("I'm Nova, Krishan's AI portfolio assistant. I don't have information on that specific topic — "
                "I'm here to help you learn about Krishan's projects, skills, experience, and services! "
                "If you have a custom question, feel free to reach out to Krishan directly via the contact form.")
