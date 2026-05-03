/**
 * @fileoverview Smart Assistant Chat UI Component.
 * Handles user interaction, input validation, and rendering dynamic AI bot responses securely.
 */

import { createElement, formatTextToDOM } from '../utils/dom.js';
import { validateChatInput } from '../utils/validation.js';
import { showToast } from '../utils/toast.js';
import { SAMPLE_QUESTIONS } from '../data/chatKnowledge.js';
import { getSmartResponse } from '../services/aiService.js';

/**
 * Initializes the chat assistant component.
 */
export function initChat() {
  const elements = {
    form: document.getElementById('chat-form'),
    input: document.getElementById('chat-input'),
    messagesContainer: document.getElementById('chat-messages'),
    sampleContainer: document.getElementById('sample-questions')
  };

  if (!elements.form || !elements.messagesContainer) return;

  renderSampleQuestions(elements);
  
  addMessage(
    "Hello! I'm VoteWise Assistant. How can I help you understand the Indian election process today?", 
    'bot', 
    elements.messagesContainer
  );

  setupFormListener(elements);
}

/**
 * Renders the predefined sample questions securely.
 * @param {Object} elements - The DOM elements configuration.
 */
function renderSampleQuestions(elements) {
  const { sampleContainer, input, form } = elements;
  
  SAMPLE_QUESTIONS.forEach(question => {
    // using createElement with text nodes inherently prevents XSS
    const btn = createElement('button', {
      className: 'sample-q-btn',
      type: 'button',
      'aria-label': `Ask: ${question}`
    }, [question]);
    
    btn.addEventListener('click', () => {
      input.value = question;
      form.dispatchEvent(new Event('submit'));
    });
    
    sampleContainer.appendChild(btn);
  });
}

/**
 * Attaches the main submit event listener to the chat form.
 * @param {Object} elements - The DOM elements configuration.
 */
function setupFormListener(elements) {
  const { form, input, messagesContainer } = elements;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    
    const validation = validateChatInput(text);
    if (!validation.isValid) {
      showToast(validation.error, 'error');
      return;
    }

    addMessage(text, 'user', messagesContainer);
    input.value = '';

    const loadingId = addLoadingIndicator(messagesContainer);

    try {
      // Send sanitized query to the AI Service
      const response = await getSmartResponse(text);
      removeLoadingIndicator(loadingId);
      addMessage(response, 'bot', messagesContainer);
    } catch (error) {
      // Absolute fallback if the service throws an uncaught error
      removeLoadingIndicator(loadingId);
      addMessage("I'm having trouble connecting right now. Please try again later.", 'bot', messagesContainer);
    }
  });
}

/**
 * Adds a new message to the chat container securely.
 * @param {string} text - The message content.
 * @param {'user'|'bot'} sender - The sender type.
 * @param {HTMLElement} container - The container to append the message to.
 */
function addMessage(text, sender, container) {
  const isBot = sender === 'bot';
  
  const msgDiv = createElement('div', {
    className: `message message-${sender}`
  });
  
  if (isBot) {
    // Bot responses are formatted safely via DOM nodes (zero innerHTML)
    formatTextToDOM(text).forEach(node => msgDiv.appendChild(node));
  } else {
    // User input is ALWAYS assigned via textContent, effectively neutralizing XSS.
    msgDiv.textContent = text;
  }
  
  container.appendChild(msgDiv);
  scrollToBottom(container);
}

/**
 * Appends a loading indicator to the chat container.
 * @param {HTMLElement} container - The chat messages container.
 * @returns {string} The unique ID of the loading element.
 */
function addLoadingIndicator(container) {
  const id = 'loading-' + Date.now();
  
  const dots = createElement('div', { className: 'dots' }, [
    createElement('span'), createElement('span'), createElement('span')
  ]);

  const textSpan = createElement('span', { 
    style: 'margin-left: 8px; font-size: 0.9em; color: var(--text-muted);' 
  }, ['Thinking...']);
  
  const loadingDiv = createElement('div', {
    id: id,
    className: 'message message-loading',
    style: 'display: flex; align-items: center;',
    'aria-busy': 'true'
  }, [dots, textSpan]);
  
  container.appendChild(loadingDiv);
  scrollToBottom(container);
  
  return id;
}

/**
 * Removes the loading indicator from the DOM.
 * @param {string} id - The ID of the loading element.
 */
function removeLoadingIndicator(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

/**
 * Scrolls the container to the latest message.
 * @param {HTMLElement} container - The chat messages container.
 */
function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}
