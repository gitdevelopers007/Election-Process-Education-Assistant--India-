/**
 * @fileoverview Step-by-Step Election Guide UI Component.
 * Implements an accessible, collapsible accordion.
 */

import { createElement } from '../utils/dom.js';
import { GUIDE_STEPS } from '../data/guideSteps.js';

/**
 * Initializes the Election Guide accordion component.
 */
export function initGuide() {
  const container = document.getElementById('election-guide-accordion');
  if (!container) return;

  GUIDE_STEPS.forEach((step, index) => {
    const isFirst = index === 0;
    const accordionItem = createAccordionItem(step, index, isFirst);
    container.appendChild(accordionItem);
  });
}

/**
 * Creates a single accordion item element.
 * @param {import('../data/guideSteps.js').GuideStep} step - The guide step data.
 * @param {number} index - The index of the item.
 * @param {boolean} isFirst - Whether this is the first item in the list.
 * @returns {HTMLElement} The complete accordion item element.
 */
function createAccordionItem(step, index, isFirst) {
  // Header Elements
  const titleSpan = createElement('span', {}, [step.title]);
  const iconSpan = createElement('span', { className: 'accordion-icon', 'aria-hidden': 'true' }, ['▼']);
  
  const headerBtn = createElement('button', {
    className: 'accordion-header',
    'aria-expanded': isFirst ? 'true' : 'false',
    'aria-controls': `sect-${index}`,
    id: `accordion-header-${index}`
  }, [titleSpan, iconSpan]);

  // Content Elements
  const innerContent = createElement('div', { className: 'accordion-content-inner' });
  // Render content safely via textContent (content is from guideSteps.js)
  const contentPara = createElement('p', {}, [step.content]);
  innerContent.appendChild(contentPara);
  
  const contentDiv = createElement('div', {
    className: 'accordion-content',
    id: `sect-${index}`,
    role: 'region',
    'aria-labelledby': `accordion-header-${index}`
  }, [innerContent]);

  // Wrapper
  const itemWrapper = createElement('div', {
    className: `accordion-item ${isFirst ? 'active' : ''}`
  }, [headerBtn, contentDiv]);

  // Set initial open state for the first item
  if (isFirst) {
    contentDiv.style.maxHeight = '1000px'; 
  }

  // Attach click interaction
  headerBtn.addEventListener('click', () => toggleAccordionItem(itemWrapper, headerBtn, contentDiv));

  return itemWrapper;
}

/**
 * Toggles the state of an accordion item and closes siblings.
 * @param {HTMLElement} itemWrapper - The parent wrapper of the accordion item.
 * @param {HTMLElement} headerBtn - The clickable header button.
 * @param {HTMLElement} contentDiv - The collapsible content area.
 */
function toggleAccordionItem(itemWrapper, headerBtn, contentDiv) {
  const isActive = itemWrapper.classList.contains('active');
  
  // Close all other accordion items
  const allItems = document.querySelectorAll('.accordion-item');
  allItems.forEach(item => {
    item.classList.remove('active');
    item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
    item.querySelector('.accordion-content').style.maxHeight = null;
  });

  // Expand the clicked item if it wasn't already open
  if (!isActive) {
    itemWrapper.classList.add('active');
    headerBtn.setAttribute('aria-expanded', 'true');
    contentDiv.style.maxHeight = contentDiv.scrollHeight + 'px';
  }
}
