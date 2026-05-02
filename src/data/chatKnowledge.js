/**
 * @fileoverview Chatbot knowledge base and sample questions.
 * Separating data from logic improves maintainability.
 */

/**
 * Predefined responses for the chatbot, organized by topic.
 * Each topic contains a list of keywords that trigger the response.
 * @type {Object<string, {keywords: string[], response: string}>}
 */
export const CHAT_KNOWLEDGE_BASE = {
  eligibility: {
    keywords: ['eligible', 'can i vote', 'who can vote', 'age limit'],
    response: "To be eligible to vote in India, you must be an Indian citizen, 18 years of age or older on the qualifying date (usually Jan 1st), and ordinarily resident of the polling area. You must also not be disqualified under any law."
  },
  voter_id: {
    keywords: ['apply', 'voter id', 'register', 'form 6', 'epic'],
    response: "You can apply for a Voter ID (EPIC) online through the Voter's Service Portal (voters.eci.gov.in) or Voter Helpline App by filling Form 6. You'll need proof of age, proof of residence, and a passport-size photograph."
  },
  voting_day: {
    keywords: ['voting day', 'poll day', 'what happens', 'how to vote', 'evm'],
    response: "On voting day: \n\n1. Check your name on the voter list and find your polling booth.\n2. Carry your Voter ID or any approved ID proof.\n3. At the booth, polling officials will verify your identity.\n4. Your finger will be marked with indelible ink.\n5. You will proceed to the voting compartment to cast your vote on the EVM (Electronic Voting Machine) by pressing the button against your chosen candidate."
  },
  nri: {
    keywords: ['nri', 'overseas', 'living abroad'],
    response: "NRIs holding an Indian passport who have not acquired citizenship of any other country are eligible to vote. They need to fill Form 6A to register. However, they must cast their vote in person at their respective polling station in India."
  }
};

/**
 * Sample questions to display as quick-action buttons in the UI.
 * @type {string[]}
 */
export const SAMPLE_QUESTIONS = [
  "Am I eligible to vote?",
  "How to apply for voter ID?",
  "What happens on voting day?"
];

/**
 * The default response when no keywords match the user's query.
 * @type {string}
 */
export const FALLBACK_RESPONSE = "I'm not completely sure about that. You can ask me about voter eligibility, how to apply for a voter ID, or what happens on voting day.";
