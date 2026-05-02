/**
 * @fileoverview FAQ Component.
 * Injects Frequently Asked Questions into the UI using accessible HTML5 details/summary tags.
 */

import { createElement } from '../utils/dom.js';
import { FAQ_DATA } from '../data/faqData.js';

/**
 * Initializes the FAQ section by rendering predefined questions and answers.
 */
export function initFAQ() {
  const container = document.getElementById('faq-container');
  if (!container) return;

  FAQ_DATA.forEach(faq => {
    const card = createFAQCard(faq);
    container.appendChild(card);
  });
}

/**
 * Creates a single FAQ card element using native <details> and <summary> 
 * for built-in keyboard navigation and ARIA support.
 * @param {import('../data/faqData.js').FAQItem} faq - The FAQ data object.
 * @returns {HTMLElement} The formatted FAQ <details> element.
 */
function createFAQCard(faq) {
  // <summary> provides a natively focusable and clickable element
  const questionElement = createElement('summary', {
    className: 'faq-summary'
  }, [faq.q]);
  
  // The answer content
  const answerElement = createElement('div', {
    className: 'faq-content'
  }, [createElement('p', {}, [faq.a])]);
  
  // <details> provides native aria-expanded toggling
  return createElement('details', {
    className: 'faq-card faq-details'
  }, [questionElement, answerElement]);
}
