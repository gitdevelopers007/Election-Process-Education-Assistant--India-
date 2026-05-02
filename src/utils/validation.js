/**
 * @fileoverview Strict input validation utilities.
 * Validates data types, lengths, and constraints before processing.
 */

/**
 * Validates the user's chat input.
 * Ensures the input is not empty, not excessively long, and structurally sound.
 * @param {string} input - The user input.
 * @returns {{isValid: boolean, error: string}} Validation result.
 */
export function validateChatInput(input) {
  if (typeof input !== 'string') {
    return { isValid: false, error: 'Invalid input type.' };
  }

  const trimmed = input.trim();

  if (trimmed === '') {
    return { isValid: false, error: 'Input cannot be empty.' };
  }
  
  if (trimmed.length > 250) {
    return { isValid: false, error: 'Input is too long. Please keep it under 250 characters.' };
  }

  // We removed the strict regex blocking '<' and '>' because we now securely 
  // handle these characters using `textContent` and `escapeHTML` downstream.
  // This improves usability while maintaining strict security against XSS.

  return { isValid: true, error: '' };
}

/**
 * Validates the eligibility checker form input types and boundaries.
 * @param {number} age - The age of the user.
 * @param {string} citizenship - 'yes' or 'no'
 * @param {string} residence - 'yes', 'no', or 'nri'
 * @returns {{isValid: boolean, errors: string[]}} Validation result.
 */
export function validateEligibilityInput(age, citizenship, residence) {
  const errors = [];

  // Strict type checking and boundary validation
  if (typeof age !== 'number' || isNaN(age) || age < 0 || age > 120) {
    errors.push('Please enter a valid age between 0 and 120.');
  }

  // Allowed list validation (defense against prototype pollution or unexpected strings)
  const allowedCitizenship = ['yes', 'no'];
  if (!allowedCitizenship.includes(citizenship)) {
    errors.push('Please select a valid citizenship status.');
  }

  const allowedResidence = ['yes', 'no', 'nri'];
  if (!allowedResidence.includes(residence)) {
    errors.push('Please select a valid residence status.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
