/**
 * @fileoverview Frequently Asked Questions data.
 */

/**
 * Represents a single FAQ item.
 * @typedef {Object} FAQItem
 * @property {string} q - The question.
 * @property {string} a - The answer.
 */

/**
 * Predefined array of common election-related questions and answers.
 * @type {FAQItem[]}
 */
export const FAQ_DATA = [
  {
    q: "Can I vote online?",
    a: "No, currently India does not have an online voting system. You must cast your vote in person at your designated polling station using an EVM."
  },
  {
    q: "What is an EVM?",
    a: "EVM stands for Electronic Voting Machine. It is an electronic device used to record votes replacing ballot papers. It is highly secure and tamper-proof."
  },
  {
    q: "What is NOTA?",
    a: "NOTA means 'None Of The Above'. It is an option on the EVM that allows a voter to officially register a vote of rejection for all candidates in the election."
  },
  {
    q: "Can I vote if I don't have my Voter ID card?",
    a: "Yes! If your name is on the electoral roll, you can vote by showing other ECI-approved photo ID proofs (like Aadhaar, PAN card, Passport, Driving License)."
  }
];
