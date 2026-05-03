/**
 * @fileoverview AI Service Integration.
 * Handles dynamic chat queries using the Google Gemini REST API,
 * with a resilient fallback to rule-based logic.
 */

import { CHAT_KNOWLEDGE_BASE, FALLBACK_RESPONSE } from '../data/chatKnowledge.js';

// Secure configuration: API key is kept as a placeholder.
const GEMINI_API_KEY = 'AIzaSyA9g5Q7Xm1gaKwd7Ati6EiCwBZYAZjk-f8';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Fetches a dynamic response from the AI or falls back to local rules.
 * @param {string} query - The sanitized user input.
 * @returns {Promise<string>} The AI-generated or rule-based response.
 */
export async function getSmartResponse(query) {
  // If the key is the placeholder, immediately fallback to local logic
  // to avoid unnecessary failed network requests and CORS errors.
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return getFallbackResponse(query);
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: `You are a helpful, professional, and concise assistant specializing in the Indian Election Process. Answer the following question simply, using paragraphs or bullet points where necessary. Do not use complex markdown or HTML. Question: ${query}`
          }]
        }],
        generationConfig: {
          temperature: 0.3, // Keep responses factual and consistent
          maxOutputTokens: 250
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response payload from Gemini API.");
    }

  } catch (error) {
    console.warn("AI Service unavailable or failed. Falling back to local rule-based logic.", error);
    return getFallbackResponse(query);
  }
}

/**
 * Fallback logic: Evaluates the query against a local knowledge graph.
 * @param {string} query - The user's input.
 * @returns {string} The matched response or default fallback.
 */
function getFallbackResponse(query) {
  const lowerQuery = query.toLowerCase();

  for (const category in CHAT_KNOWLEDGE_BASE) {
    const { keywords, response } = CHAT_KNOWLEDGE_BASE[category];
    // Check if any keyword exists as a substring in the user query
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return response;
    }
  }

  return FALLBACK_RESPONSE;
}
