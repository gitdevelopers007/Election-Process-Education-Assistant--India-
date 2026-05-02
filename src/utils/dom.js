/**
 * @fileoverview Safe DOM manipulation utilities to prevent XSS attacks.
 */

/**
 * Safely escapes HTML characters to prevent cross-site scripting (XSS).
 * Converts characters like <, >, &, ", and ' to their corresponding HTML entities.
 * @param {string} str - The unstrusted string to sanitize.
 * @returns {string} The safely escaped string.
 */
export function escapeHTML(str) {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match) => (map[match]));
}

/**
 * Creates a DOM element dynamically and securely using native DOM APIs.
 * This prevents innerHTML-based injection vulnerabilities.
 * @param {string} tag - The HTML tag name.
 * @param {Object} attributes - Key-value pairs of attributes to apply.
 * @param {Array<HTMLElement|string>} children - Child elements or safe text nodes.
 * @returns {HTMLElement} The created DOM element.
 */
export function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  for (const [key, value] of Object.entries(attributes)) {
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.substring(2).toLowerCase(), value);
    } else if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue;
      }
    } else {
      element.setAttribute(key, value);
    }
  }

  children.forEach(child => {
    if (typeof child === 'string') {
      // document.createTextNode is inherently secure against XSS.
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Formats multi-line trusted text into HTML paragraphs.
 * Applies HTML escaping to ensure defense-in-depth even for trusted data.
 * @param {string} text - The raw text.
 * @returns {string} Safe HTML string wrapped in paragraphs.
 */
export function formatTextToHTML(text) {
  return text.split('\n\n')
    .filter(p => p.trim() !== '')
    .map(p => `<p>${escapeHTML(p)}</p>`)
    .join('');
}
