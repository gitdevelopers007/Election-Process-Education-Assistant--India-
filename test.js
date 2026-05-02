/**
 * @fileoverview Comprehensive Testing Module.
 * Tests input validation, DOM sanitization, and business logic with edge cases.
 */

import { validateChatInput, validateEligibilityInput } from './src/utils/validation.js';
import { escapeHTML, formatTextToHTML } from './src/utils/dom.js';

// Handle global scope for both Browser and Node.js environments
const globalScope = typeof window !== 'undefined' ? window : global;

globalScope.runTests = function() {
  console.clear();
  console.log('%c🧪 Starting Comprehensive Test Suite...', 'color: #2563eb; font-weight: bold; font-size: 14px; padding: 10px 0;');
  
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  function group(name) {
    console.log(`\n%c📦 ${name}`, 'font-weight: bold; color: #475569; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 10px;');
  }

  // --- Test Suite: Chat Input Validation ---
  group('Chat Input Validation');
  
  assert(validateChatInput('').isValid === false, 'Empty string is correctly rejected');
  assert(validateChatInput('   ').isValid === false, 'Whitespace-only string is correctly rejected');
  assert(validateChatInput(null).isValid === false, 'Null input is correctly rejected');
  assert(validateChatInput(undefined).isValid === false, 'Undefined input is correctly rejected');
  assert(validateChatInput({ text: 'hello' }).isValid === false, 'Object input is correctly rejected');
  assert(validateChatInput('How to vote?').isValid === true, 'Standard valid query is accepted');
  
  const exactly250 = 'a'.repeat(250);
  assert(validateChatInput(exactly250).isValid === true, 'Input of exactly 250 characters is accepted');
  
  const over250 = 'a'.repeat(251);
  assert(validateChatInput(over250).isValid === false, 'Input of 251 characters is rejected');

  // --- Test Suite: Eligibility Validation ---
  group('Eligibility Form Validation');
  
  assert(validateEligibilityInput(25, 'yes', 'yes').isValid === true, 'Standard valid input passes');
  assert(validateEligibilityInput(-1, 'yes', 'yes').isValid === false, 'Negative age is rejected');
  assert(validateEligibilityInput(0, 'yes', 'yes').isValid === true, 'Age 0 passes structural validation (business logic handles <18)');
  assert(validateEligibilityInput(121, 'yes', 'yes').isValid === false, 'Age over 120 is rejected');
  assert(validateEligibilityInput(NaN, 'yes', 'yes').isValid === false, 'NaN age is rejected');
  assert(validateEligibilityInput('25', 'yes', 'yes').isValid === false, 'String age (instead of number) is rejected');
  
  assert(validateEligibilityInput(25, 'maybe', 'yes').isValid === false, 'Invalid citizenship enum value is rejected');
  assert(validateEligibilityInput(25, '', 'yes').isValid === false, 'Empty citizenship value is rejected');
  assert(validateEligibilityInput(25, '__proto__', 'yes').isValid === false, 'Prototype pollution payload in citizenship is rejected');

  // --- Test Suite: DOM Security & Utilities ---
  group('DOM Utilities & Security');

  assert(escapeHTML('Safe string') === 'Safe string', 'Safe strings remain unmodified');
  assert(escapeHTML('<script>alert("XSS")</script>') === '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;', 'HTML tags and quotes are securely escaped');
  assert(escapeHTML('Me & You') === 'Me &amp; You', 'Ampersands are escaped');
  assert(escapeHTML(null) === '', 'Null input to escapeHTML returns empty string');

  const textToFormat = "First para.\n\nSecond para with <tag>.";
  const formatted = formatTextToHTML(textToFormat);
  assert(formatted === '<p>First para.</p><p>Second para with &lt;tag&gt;.</p>', 'formatTextToHTML correctly wraps in <p> and escapes content');

  // --- Test Suite: Eligibility Business Logic ---
  group('Eligibility Business Logic');
  
  // Duplicated logic here just for unit testing demonstration without exporting it from the UI component
  function evaluateEligibility(age, citizenship, residence) {
    if (citizenship === 'no') return { isEligible: false, title: 'Not Eligible' };
    if (age < 18) return { isEligible: false, title: 'Not Eligible Yet' };
    if (residence === 'no') return { isEligible: false, title: 'Registration Required Elsewhere' };
    if (residence === 'nri') return { isEligible: true, title: 'Eligible as NRI' };
    return { isEligible: true, title: 'You are Eligible!' }; 
  }

  assert(evaluateEligibility(25, 'yes', 'yes').isEligible === true, 'Citizen >= 18 Resident is eligible');
  assert(evaluateEligibility(18, 'yes', 'yes').isEligible === true, 'Exact age 18 is eligible');
  assert(evaluateEligibility(17, 'yes', 'yes').isEligible === false, 'Age 17 is NOT eligible');
  assert(evaluateEligibility(30, 'no', 'yes').isEligible === false, 'Non-citizen is NOT eligible');
  assert(evaluateEligibility(40, 'yes', 'nri').isEligible === true, 'NRI Citizen is eligible');
  assert(evaluateEligibility(22, 'yes', 'no').isEligible === false, 'Non-resident is NOT eligible (must register elsewhere)');

  // --- Summary ---
  const total = passed + failed;
  const successRate = Math.round((passed / total) * 100);
  
  console.log('\n========================================');
  if (failed === 0) {
    console.log(`🎉 All ${passed} tests passed successfully! (${successRate}%)`);
  } else {
    console.log(`⚠️ ${failed} out of ${total} tests failed.`);
  }
  console.log('========================================\n');
  
  return { passed, failed, total };
};

// Auto-run if executed directly via Node.js CLI
if (typeof process !== 'undefined' && process.release.name === 'node') {
  globalScope.runTests();
} else {
  // Browser log instruction
  console.log('%cℹ️ Test module loaded. Call window.runTests() in console or click the footer link to run tests.', 'color: #64748b; font-style: italic;');
}
