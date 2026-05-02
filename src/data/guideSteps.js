/**
 * @fileoverview Data for the step-by-step election guide.
 */

/**
 * Represents a single step in the election process.
 * @typedef {Object} GuideStep
 * @property {string} title - The title of the step.
 * @property {string} content - HTML formatted content describing the step.
 */

/**
 * Array of steps detailing the election journey from registration to counting.
 * @type {GuideStep[]}
 */
export const GUIDE_STEPS = [
  {
    title: '1. Registration (Getting your Voter ID)',
    content: `
      <p>Before you can vote, you must be registered in the electoral roll of your constituency.</p>
      <ol>
        <li>Check if you are eligible (18+ years, Indian citizen).</li>
        <li>Fill out Form 6 online on the Voter's Service Portal or offline via your Booth Level Officer (BLO).</li>
        <li>Submit necessary documents (Age proof, Address proof, Photo).</li>
        <li>Once verified, your name is added to the roll and your EPIC (Voter ID card) is issued.</li>
      </ol>
    `
  },
  {
    title: '2. Verification (Pre-Poll)',
    content: `
      <p>Before election day, it's crucial to verify your details.</p>
      <ol>
        <li>Check your name on the electoral roll online or via SMS.</li>
        <li>Find your designated polling station.</li>
        <li>You will receive a Voter Information Slip (VIS) from your BLO with polling station details, date, and time.</li>
      </ol>
    `
  },
  {
    title: '3. Polling Process (Voting Day)',
    content: `
      <p>The actual process of casting your vote at the polling booth.</p>
      <ol>
        <li>Join the queue at your designated polling station.</li>
        <li>First Polling Officer will check your name on the voter list and verify your ID proof.</li>
        <li>Second Polling Officer will mark your finger with indelible ink, give you a slip, and take your signature/thumb impression on a register.</li>
        <li>Third Polling Officer will take the slip and enable the Electronic Voting Machine (EVM).</li>
        <li>Proceed to the voting compartment, press the button on the EVM against your chosen candidate, and verify via VVPAT (Voter Verifiable Paper Audit Trail) slip.</li>
      </ol>
    `
  },
  {
    title: '4. Counting Process',
    content: `
      <p>After polling, votes are counted under strict security.</p>
      <ol>
        <li>EVMs are sealed and transported to strong rooms.</li>
        <li>On counting day, seals are broken in the presence of candidate representatives.</li>
        <li>Votes on the EVMs are tallied round by round.</li>
        <li>The Returning Officer declares the result once counting is complete.</li>
      </ol>
    `
  }
];
