/* ============================================================
   Krishan AI — Portfolio AI Chatbot Widget
   Floating widget + Portfolio AI Modal
   Supports streaming, one-time welcome, and quick prompts
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements: Floating Widget ---
  const bubble = document.getElementById('chatBubble');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const messages = document.getElementById('chatMessages');

  // --- DOM Elements: Modal Assistant ---
  const aiModal = document.getElementById('portfolioAIModal');
  const modalInput = document.getElementById('pai-input');
  const modalSendBtn = document.getElementById('pai-send');
  const modalMessages = document.getElementById('pai-messages');
  const modalCloseBtn = document.getElementById('pai-close');

  // Shared session-level chat history
  let chatHistory = [];

  // Track if welcome was shown (once per page load session)
  let floatWelcomeDone = false;
  let modalWelcomeDone = false;

  const WELCOME_MSG = "Hi 👋\nI'm Nova, Krishan's AI portfolio assistant.\n\nAsk me about Krishan's projects, skills, experience, services or just chat normally.";

  // --- Initialize Floating Chatbot ---
  if (bubble && panel && messages) {
    let isOpen = false;

    // Toggle panel
    bubble.addEventListener('click', () => {
      isOpen = !isOpen;
      panel.classList.toggle('hidden', !isOpen);
      if (isOpen) {
        input.focus();
        bubble.style.animation = 'none';
        // Show welcome message only once
        if (!floatWelcomeDone) {
          floatWelcomeDone = true;
          addBotMessage(WELCOME_MSG, messages);
        }
      } else {
        bubble.style.animation = '';
      }
    });

    closeBtn?.addEventListener('click', () => {
      isOpen = false;
      panel.classList.add('hidden');
      bubble.style.animation = '';
    });

    sendBtn?.addEventListener('click', () => triggerSend(input, messages, sendBtn));
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        triggerSend(input, messages, sendBtn);
      }
    });
  }

  // --- Initialize Modal Assistant ---
  if (aiModal && modalMessages) {
    // Close on backdrop
    aiModal.addEventListener('click', (e) => {
      if (e.target === aiModal) closePortfolioAI();
    });

    modalCloseBtn?.addEventListener('click', closePortfolioAI);
    modalSendBtn?.addEventListener('click', () => triggerSend(modalInput, modalMessages, modalSendBtn));
    modalInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        triggerSend(modalInput, modalMessages, modalSendBtn);
      }
    });

    // Quick prompt buttons inside Modal — auto-send on click
    aiModal.querySelectorAll('.portfolio-ai__prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (modalInput) {
          modalInput.value = btn.textContent.trim();
          triggerSend(modalInput, modalMessages, modalSendBtn);
        }
      });
    });
  }

  // --- Quick Prompt triggers on the floating widget — auto-send on click ---
  document.querySelectorAll('.chat-panel__prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (input) {
        // Open panel if not open
        if (panel && panel.classList.contains('hidden')) {
          panel.classList.remove('hidden');
          if (!floatWelcomeDone) {
            floatWelcomeDone = true;
            addBotMessage(WELCOME_MSG, messages);
          }
          if (bubble) bubble.style.animation = 'none';
        }
        input.value = btn.textContent.trim();
        triggerSend(input, messages, sendBtn);
      }
    });
  });

  // --- General trigger data-open-ai buttons throughout website ---
  document.querySelectorAll('[data-open-ai]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ctx = btn.dataset.openAi || '';
      openPortfolioAI(ctx);
    });
  });

  // Global functions exposed for manual triggers in templates or portfolio.js
  window.openPortfolioAI = function(context) {
    if (!aiModal) return;
    document.body.style.overflow = 'hidden';
    aiModal.classList.add('open');

    // Show welcome once in modal
    if (!modalWelcomeDone) {
      modalWelcomeDone = true;
      setTimeout(() => {
        if (modalMessages.children.length === 0) {
          addBotMessage(WELCOME_MSG, modalMessages);
        }
      }, 300);
    }

    if (modalInput) {
      if (context && typeof context === 'string') {
        setTimeout(() => {
          modalInput.value = context;
          triggerSend(modalInput, modalMessages, modalSendBtn);
        }, 450);
      } else {
        setTimeout(() => modalInput.focus(), 300);
      }
    }
  };

  window.closePortfolioAI = function() {
    if (!aiModal) return;
    aiModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closePortfolioAI();
      if (panel) {
        panel.classList.add('hidden');
        if (bubble) bubble.style.animation = '';
      }
    }
  });

  // --- Helper to execute Web3Forms Lead Fetch ---
  function sendWeb3FormsLead(leadName, leadEmail, leadMsg, label = '') {
    const accessKey = '9a67801f-76cc-4174-b30c-49ee971d4d39';
    const payloadData = {
      access_key: accessKey,
      name: leadName,
      email: leadEmail,
      subject: 'New Project Lead via Nova Chatbot (Source: Chatbot lead)',
      message: `[Source: Chatbot lead]\nName: ${leadName}\nEmail: ${leadEmail}\nProject Description: ${leadMsg}`
    };

    console.log(`%c[Nova Lead Capture${label}] Sending Web3Forms Lead Payload:`, 'color:#3b82f6;font-weight:bold;', payloadData);

    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('name', leadName);
    formData.append('email', leadEmail);
    formData.append('subject', 'New Project Lead via Nova Chatbot (Source: Chatbot lead)');
    formData.append('message', `[Source: Chatbot lead]\nName: ${leadName}\nEmail: ${leadEmail}\nProject Description: ${leadMsg}`);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    }).then(async (res) => {
      const resBody = await res.json();
      console.log(`%c[Nova Lead Capture${label}] Web3Forms API Response:`, 'color:#10b981;font-weight:bold;', {
        statusCode: res.status,
        ok: res.ok,
        responseBody: resBody
      });
    }).catch(err => {
      console.error(`%c[Nova Lead Capture${label}] Web3Forms API Fetch Error:`, 'color:#ef4444;font-weight:bold;', err);
    });
  }

  // --- Chat Logic ---

  async function triggerSend(inputElement, containerElement, sendButtonElement) {
    const text = inputElement.value.trim();
    if (!text) return;

    // 1. Add user message to UI
    addUserMessage(text, containerElement);
    inputElement.value = '';
    
    // Disable inputs during processing
    inputElement.disabled = true;
    if (sendButtonElement) sendButtonElement.disabled = true;

    // 2. Add typing indicator
    const typingIndicator = addTypingIndicator(containerElement);
    scrollToBottom(containerElement);

    // 3. Prepare payload and history
    const payloadHistory = chatHistory.slice(-10);
    chatHistory.push({ role: 'user', content: text });

    try {
      // 4. Fetch stream from server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: payloadHistory })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      // Remove typing indicator once stream starts
      typingIndicator.remove();

      // Create bot message wrapper
      const isModal = (containerElement === modalMessages);
      const botMsgClass = isModal ? 'portfolio-ai__msg portfolio-ai__msg--bot' : 'chat-msg chat-msg--bot';
      const botMsgEl = document.createElement('div');
      botMsgEl.className = botMsgClass;
      containerElement.appendChild(botMsgEl);

      // Read ReadableStream chunks
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = '';
      let downloadTriggered = false;
      let leadTriggered = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullReply += chunk;
        
        // Handle programmatic download trigger
        if (fullReply.includes('[TRIGGER_DOWNLOAD]') && !downloadTriggered) {
          downloadTriggered = true;
          window.location.href = '/download-resume';
        }

        // Handle client-side browser Web3Forms lead submission during stream
        if (fullReply.includes('[SUBMIT_LEAD:') && !leadTriggered) {
          const match = fullReply.match(/\[SUBMIT_LEAD:\s*name="([^"]*)"\s*email="([^"]*)"\s*message="([^"]*)"\]/i);
          if (match) {
            leadTriggered = true; // Set leadTriggered ONLY after a full regex match!
            sendWeb3FormsLead(match[1], match[2], match[3], ' - Streaming');
          }
        }

        // Render streamed markdown to html on the fly
        botMsgEl.innerHTML = formatMarkdown(fullReply);
        scrollToBottom(containerElement);
      }

      // Backup check after streaming finishes in case tag completed at stream end
      if (fullReply.includes('[SUBMIT_LEAD:') && !leadTriggered) {
        const match = fullReply.match(/\[SUBMIT_LEAD:\s*name="([^"]*)"\s*email="([^"]*)"\s*message="([^"]*)"\]/i);
        if (match) {
          leadTriggered = true;
          sendWeb3FormsLead(match[1], match[2], match[3], ' - PostStream');
        }
      }

      // Append completed bot response to session memory
      chatHistory.push({ role: 'model', content: fullReply });

    } catch (err) {
      console.error(err);
      typingIndicator.remove();
      
      const isModal = (containerElement === modalMessages);
      const errClass = isModal ? 'portfolio-ai__msg portfolio-ai__msg--bot' : 'chat-msg chat-msg--bot';
      const botMsgEl = document.createElement('div');
      botMsgEl.className = errClass;
      botMsgEl.innerHTML = '<span style="color:#ef4444;"><i class="fas fa-exclamation-triangle"></i> Connection error. Please try again.</span>';
      containerElement.appendChild(botMsgEl);
      scrollToBottom(containerElement);
    } finally {
      // Re-enable inputs
      inputElement.disabled = false;
      if (sendButtonElement) sendButtonElement.disabled = false;
      inputElement.focus();
    }
  }

  function addUserMessage(text, container) {
    const isModal = (container === modalMessages);
    const msgClass = isModal ? 'portfolio-ai__msg portfolio-ai__msg--user' : 'chat-msg chat-msg--user';
    const el = document.createElement('div');
    el.className = msgClass;
    el.textContent = text;
    container.appendChild(el);
    scrollToBottom(container);
  }

  function addBotMessage(text, container) {
    const isModal = (container === modalMessages);
    const msgClass = isModal ? 'portfolio-ai__msg portfolio-ai__msg--bot' : 'chat-msg chat-msg--bot';
    const el = document.createElement('div');
    el.className = msgClass;
    el.innerHTML = formatMarkdown(text);
    container.appendChild(el);
    scrollToBottom(container);
    return el;
  }

  function addTypingIndicator(container) {
    const isModal = (container === modalMessages);
    const typingClass = isModal ? 'portfolio-ai__typing' : 'chat-typing';
    const el = document.createElement('div');
    el.className = typingClass;
    el.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(el);
    return el;
  }

  function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
  }

  function formatMarkdown(text) {
    // Strip trigger tokens from visible UI text
    let cleanText = text
      .replace(/\[TRIGGER_DOWNLOAD\]/gi, '')
      .replace(/\[SUBMIT_LEAD:[^\]]*\]/gi, '')
      .trim();

    // Escape standard HTML tags to prevent arbitrary script injection
    let escaped = cleanText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Format markdown shortcuts
    return escaped
      // Bold: **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent);">$1</strong>')
      // Italic: *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline Code: `code`
      .replace(/`(.*?)`/g, '<code style="font-family:var(--font-mono);font-size:0.85em;color:var(--accent-2);background:rgba(0,0,0,0.2);padding:2px 6px;border-radius:4px;">$1</code>')
      // Hyperlinks: [text](url)
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;">$1</a>')
      // Linebreaks
      .replace(/\n/g, '<br>');
  }
});
