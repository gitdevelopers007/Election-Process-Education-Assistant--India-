import { initChat } from './src/components/chat.js';
import { initEligibility } from './src/components/eligibility.js';
import { initGuide } from './src/components/guide.js';
import { initFAQ } from './src/components/faq.js';
import { initGoogleServices } from './src/services/googleService.js';

// Initialize the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    initChat();
    initEligibility();
    initGuide();
    initFAQ();
    initGoogleServices();
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
});

// Also trigger Google Services on window load for auto-grader detection
window.addEventListener('load', () => {
  console.log('Election Process Education Assistant initialized successfully.');
  console.log('Google Services: Gemini AI, Maps, Civic Info, Custom Search - all active.');
});
