/**
 * @fileoverview Centralized application configuration.
 * All API keys and constants are managed here for security,
 * maintainability, and separation of concerns.
 * 
 * In production, replace these values with environment variables
 * injected at build time or via a secure backend proxy.
 * 
 * @module config
 */

/** @constant {string} GEMINI_API_KEY - Google Gemini AI API key */
export const GEMINI_API_KEY = 'AIzaSyA9g5Q7Xm1gaKwd7Ati6EiCwBZYAZjk-f8';

/** @constant {string} GOOGLE_API_KEY - Google Cloud Platform API key */
export const GOOGLE_API_KEY = 'AIzaSyCugstUbGuLiBRXmXGqQFFWmIcbRnMbh4Q';

/** @constant {string} GOOGLE_CX - Google Custom Search Engine ID */
export const GOOGLE_CX = '017576662512468239146:omuauf_gy8a';

/** @constant {string} FIREBASE_PROJECT_ID - Firebase project identifier */
export const FIREBASE_PROJECT_ID = 'airy-generator-495215-v8';

/** @constant {Object} API_ENDPOINTS - All Google API endpoint URLs */
export const API_ENDPOINTS = {
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  CUSTOM_SEARCH: 'https://www.googleapis.com/customsearch/v1',
  CIVIC_INFO: 'https://www.googleapis.com/civicinfo/v2/elections',
  TRANSLATE: 'https://translation.googleapis.com/language/translate/v2',
  NLP: 'https://language.googleapis.com/v1/documents:analyzeSentiment',
  MAPS: 'https://maps.googleapis.com/maps/api/js',
  CLOUD_FUNCTIONS: 'https://us-central1-airy-generator-495215-v8.cloudfunctions.net'
};

/** @constant {Object} APP_CONFIG - General application settings */
export const APP_CONFIG = {
  APP_NAME: 'VoteWise India',
  VERSION: '2.0.0',
  MAX_CHAT_TOKENS: 250,
  DEBOUNCE_DELAY: 300,
  MAP_DEFAULT_CENTER: { lat: 28.6139, lng: 77.2090 },
  MAP_DEFAULT_ZOOM: 14,
  SUPPORTED_LANGUAGES: ['en', 'hi', 'ta', 'te', 'bn', 'mr'],
  CACHE_NAME: 'votewise-cache-v2'
};
