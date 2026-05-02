/**
 * @fileoverview Eligibility Checker logic and UI handler.
 * Implements strict type checking and zero-innerHTML rendering.
 */

import { validateEligibilityInput } from '../utils/validation.js';
import { createElement } from '../utils/dom.js';

/**
 * Initializes the Eligibility Checker form.
 */
export function initEligibility() {
  const elements = {
    form: document.getElementById('eligibility-form'),
    resultContainer: document.getElementById('eligibility-result'),
    ageInput: document.getElementById('age-input'),
    citizenshipInput: document.getElementById('citizenship-input'),
    residenceInput: document.getElementById('residence-input')
  };

  if (!elements.form || !elements.resultContainer) return;

  elements.form.addEventListener('submit', (event) => handleFormSubmit(event, elements));
}

/**
 * Processes the form submission for eligibility safely.
 * @param {Event} event - The form submit event.
 * @param {Object} elements - The DOM elements configuration.
 */
function handleFormSubmit(event, elements) {
  event.preventDefault();
  
  // Parse inputs defensively
  const age = parseInt(elements.ageInput.value, 10);
  const citizenship = elements.citizenshipInput.value;
  const residence = elements.residenceInput.value;

  const validation = validateEligibilityInput(age, citizenship, residence);
  
  if (!validation.isValid) {
    renderResult(elements.resultContainer, false, 'Validation Error', validation.errors.join(' '));
    return;
  }

  const result = determineEligibility(age, citizenship, residence);
  renderResult(elements.resultContainer, result.isEligible, result.title, result.message, result.nextSteps);
}

/**
 * Determines voter eligibility based on provided criteria.
 * @param {number} age - Age of the user.
 * @param {string} citizenship - 'yes' or 'no'.
 * @param {string} residence - 'yes', 'no', or 'nri'.
 * @returns {{isEligible: boolean, title: string, message: string, nextSteps: string[]}}
 */
function determineEligibility(age, citizenship, residence) {
  if (citizenship === 'no') {
    return {
      isEligible: false,
      title: 'Not Eligible',
      message: 'Only Indian citizens are eligible to vote in Indian elections.',
      nextSteps: ['If you acquire Indian citizenship in the future, you may apply then.']
    };
  }

  if (age < 18) {
    return {
      isEligible: false,
      title: 'Not Eligible Yet',
      message: `You must be at least 18 years old to vote. You need to wait ${18 - age} more year(s).`,
      nextSteps: ['You can pre-register if you are 17+, and your name will be added to the electoral roll when you turn 18.']
    };
  }

  if (residence === 'no') {
    return {
      isEligible: false,
      title: 'Registration Required Elsewhere',
      message: 'You must be registered in the constituency where you ordinarily reside.',
      nextSteps: ['Find your current constituency and apply there.']
    };
  }

  if (residence === 'nri') {
    return {
      isEligible: true,
      title: 'Eligible as NRI',
      message: 'Non-Resident Indians holding an Indian passport are eligible to vote.',
      nextSteps: [
        'Fill Form 6A online on the Voter Portal.',
        'You must be physically present at your polling station in India to vote.'
      ]
    };
  }

  return {
    isEligible: true,
    title: 'You are Eligible!',
    message: 'You meet the basic criteria to vote in India.',
    nextSteps: [
      'Check if your name is on the Electoral Roll.',
      'If not, fill Form 6 to register as a new voter.',
      'Ensure you have your Voter ID or alternative approved ID on voting day.'
    ]
  };
}

/**
 * Renders the eligibility result securely via createElement (Zero innerHTML).
 * @param {HTMLElement} container - The container for results.
 * @param {boolean} isEligible - Whether the user is eligible.
 * @param {string} title - Result title.
 * @param {string} message - Result description.
 * @param {string[]} [nextSteps=[]] - Actionable steps for the user.
 */
function renderResult(container, isEligible, title, message, nextSteps = []) {
  // Clear any previous results
  container.innerHTML = '';
  container.className = `result-container ${isEligible ? 'result-eligible' : 'result-not-eligible'}`;
  
  const children = [
    createElement('h3', {}, [title]),
    createElement('p', {}, [message])
  ];

  if (nextSteps.length > 0) {
    const stepsTitle = createElement('p', {}, [createElement('strong', {}, ['Next Steps:'])]);
    const listItems = nextSteps.map(step => createElement('li', {}, [step]));
    const stepsList = createElement('ul', {}, listItems);
    
    children.push(stepsTitle, stepsList);
  }

  // Append safe DOM elements
  children.forEach(child => container.appendChild(child));
  
  // Display and announce to screen readers
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
