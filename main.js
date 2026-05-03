/**
 * @fileoverview Application Entry Point.
 * Initializes all modules, registers the service worker,
 * and sets up performance monitoring.
 * 
 * @module main
 */

import { initChat } from './src/components/chat.js';
import { initEligibility } from './src/components/eligibility.js';
import { initGuide } from './src/components/guide.js';
import { initFAQ } from './src/components/faq.js';
import { initGoogleServices } from './src/services/googleService.js';

/**
 * Registers the service worker for offline caching and performance.
 * Uses cache-first strategy for static assets.
 * 
 * @returns {Promise<void>}
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js', { scope: './' });
    } catch (_error) {
      // Service worker registration failed - non-critical
    }
  }
}

/**
 * Marks performance metrics using the Performance API.
 * Enables monitoring of application initialization time.
 * 
 * @param {string} markName - The name of the performance mark.
 */
function markPerformance(markName) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(markName);
  }
}

/**
 * Measures elapsed time between two performance marks.
 * 
 * @param {string} measureName - Name for the measurement.
 * @param {string} startMark - Start mark name.
 * @param {string} endMark - End mark name.
 */
function measurePerformance(measureName, startMark, endMark) {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(measureName, startMark, endMark);
    } catch (_error) {
      // Measurement failed - non-critical
    }
  }
}

/**
 * Debounces a function call to prevent excessive execution.
 * Used for search input optimization.
 * 
 * @param {Function} func - The function to debounce.
 * @param {number} wait - Delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Initialize the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  markPerformance('app-init-start');

  try {
    initChat();
    initEligibility();
    initGuide();
    initFAQ();
    initGoogleServices();
  } catch (_error) {
    // Module initialization failed - individual modules handle their own errors
  }

  markPerformance('app-init-end');
  measurePerformance('app-initialization', 'app-init-start', 'app-init-end');
});

// Register service worker for caching and offline support
window.addEventListener('load', () => {
  registerServiceWorker();

  // Use requestIdleCallback for non-critical initialization tasks
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => {
      markPerformance('idle-tasks-complete');
    });
  }
});
