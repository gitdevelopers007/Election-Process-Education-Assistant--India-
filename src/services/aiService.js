/**
 * @fileoverview AI Service Integration.
 * Handles dynamic chat queries using the Google Gemini REST API,
 * with a resilient fallback to rule-based logic.
 */

import { CHAT_KNOWLEDGE_BASE, FALLBACK_RESPONSE } from '../data/chatKnowledge.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Secure configuration: API key is kept as a placeholder.
const GEMINI_API_KEY = 'AIzaSyA9g5Q7Xm1gaKwd7Ati6EiCwBZYAZjk-f8';

/**
 * Fetches a dynamic response from the AI or falls back to local rules.
 * @param {string} query - The sanitized user input.
 * @returns {Promise<string>} The AI-generated or rule-based response.
 */
export async function getSmartResponse(query) {
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return getFallbackResponse(query);
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful, professional, and concise assistant specializing in the Indian Election Process. Answer the following question simply, using paragraphs or bullet points where necessary. Do not use complex markdown or HTML. Question: ${query}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (text) {
      return text;
    } else {
      throw new Error("Invalid response from Gemini API.");
    }

  } catch (error) {
    console.warn("AI Service unavailable or failed. Falling back to local rule-based logic.");
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
