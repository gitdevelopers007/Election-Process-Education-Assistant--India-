/**
 * @fileoverview AI Service Integration Module.
 * Handles dynamic chat queries using the Google Gemini REST API
 * with a resilient fallback to rule-based logic.
 * 
 * Architecture:
 * - Primary: Google Gemini 1.5 Flash via official SDK
 * - Fallback: Local keyword-based knowledge graph
 * 
 * @module aiService
 */

import { CHAT_KNOWLEDGE_BASE, FALLBACK_RESPONSE } from '../data/chatKnowledge.js';
import { GEMINI_API_KEY, API_ENDPOINTS, APP_CONFIG } from '../config.js';

/**
 * Fetches a dynamic response from Google Gemini AI or falls back to local rules.
 * Uses the Gemini REST API endpoint for generating election-related content.
 * 
 * @param {string} query - The sanitized user input.
 * @returns {Promise<string>} The AI-generated or rule-based response.
 * @throws {Error} Silently caught - falls back to local logic on any failure.
 */
export async function getSmartResponse(query) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return getFallbackResponse(query);
  }

  try {
    const endpoint = `${API_ENDPOINTS.GEMINI}?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `You are a helpful, professional, and concise assistant specializing in the Indian Election Process. Answer the following question simply, using paragraphs or bullet points where necessary. Do not use complex markdown or HTML. Question: ${query}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: APP_CONFIG.MAX_CHAT_TOKENS
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('Invalid response payload from Gemini API.');
  } catch (_error) {
    return getFallbackResponse(query);
  }
}

/**
 * Analyzes user query sentiment using Google Cloud Natural Language API.
 * Helps the assistant understand the user's intent and emotional context.
 * 
 * @param {string} text - The text to analyze.
 * @returns {Promise<Object|null>} Sentiment analysis result or null on failure.
 */
export async function analyzeQuerySentiment(text) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }

  try {
    const response = await fetch(`${API_ENDPOINTS.NLP}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document: {
          type: 'PLAIN_TEXT',
          content: text
        },
        encodingType: 'UTF8'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.documentSentiment || null;
    }
    return null;
  } catch (_error) {
    return null;
  }
}

/**
 * Translates election-related text using Google Cloud Translation API.
 * Supports Hindi, Tamil, Telugu, Bengali, and Marathi for inclusive access.
 * 
 * @param {string} text - The text to translate.
 * @param {string} targetLang - Target language code (e.g., 'hi' for Hindi).
 * @returns {Promise<string>} Translated text or original text on failure.
 */
export async function translateText(text, targetLang = 'hi') {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return text;
  }

  try {
    const response = await fetch(`${API_ENDPOINTS.TRANSLATE}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        source: 'en'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data?.data?.translations?.[0]?.translatedText || text;
    }
    return text;
  } catch (_error) {
    return text;
  }
}

/**
 * Fallback logic: Evaluates the query against a local knowledge graph.
 * Uses keyword matching to find the most relevant response.
 * 
 * @param {string} query - The user's input.
 * @returns {string} The matched response or default fallback.
 * @private
 */
function getFallbackResponse(query) {
  const lowerQuery = query.toLowerCase();

  for (const category in CHAT_KNOWLEDGE_BASE) {
    const { keywords, response } = CHAT_KNOWLEDGE_BASE[category];
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return response;
    }
  }

  return FALLBACK_RESPONSE;
}
