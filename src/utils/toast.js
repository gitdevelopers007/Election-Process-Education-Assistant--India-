/**
 * @fileoverview Toast Notification Utility.
 * Provides a non-blocking, accessible UI notification system.
 */

import { createElement } from './dom.js';

/**
 * Displays a temporary toast notification.
 * @param {string} message - The message to display.
 * @param {'error'|'success'|'info'} [type='error'] - The severity type.
 */
export function showToast(message, type = 'error') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = createElement('div', { id: 'toast-container', className: 'toast-container' });
    document.body.appendChild(container);
  }

  const toast = createElement('div', { 
    className: `toast toast-${type}`,
    role: 'alert',
    'aria-live': 'assertive'
  }, [message]);

  container.appendChild(toast);

  // Trigger CSS animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}
