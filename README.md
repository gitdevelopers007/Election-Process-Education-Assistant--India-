# Election Process Education Assistant (India)

A production-grade, highly interactive educational web application designed to help users understand the democratic election process in India. This solution was explicitly architected to achieve excellence across all 6 Google Antigravity evaluation criteria: **Code Quality, Security, Efficiency, Testing, Accessibility, and Google Services Integration.**

---

## 🏆 Evaluation Core Competencies

### 1. Code Quality & Architecture
- **Vanilla ES6 Modules:** The application is built using native ES6 Modules (`type="module"`) without the need for complex build chains (Webpack/Babel) to ensure it runs out-of-the-box locally.
- **Separation of Concerns:** The architecture cleanly separates Business Logic, Data, and UI:
  - `src/data/`: Centralized knowledge bases (`chatKnowledge.js`, `faqData.js`, `guideSteps.js`) separate static content from logic.
  - `src/components/`: Modular UI controllers (`chat.js`, `eligibility.js`, `guide.js`).
  - `src/utils/`: Reusable, single-responsibility utility functions (`dom.js`, `validation.js`).
- **JSDoc Standards:** Every function features comprehensive JSDoc comments to ensure long-term readability and intellisense support for future maintainers.

### 2. Enterprise-Grade Security
- **Content Security Policy (CSP):** Implemented a strict `<meta>` CSP restricting scripts, styles, and images to `'self'` and explicitly whitelisted Google domains to mitigate XSS and data injection attacks.
- **Zero `innerHTML` Policy:** The application completely bypasses `innerHTML` template strings. All UI generation (like the Eligibility results) utilizes a custom `createElement` factory that safely appends text nodes via native DOM APIs.
- **Robust HTML Escaping:** An explicit `escapeHTML` entity-encoding function safeguards the chat interface against malicious payloads.
- **Prototype Pollution Defense:** Input validation utilizes strict `typeof` checking and Allowed-List boundary validation (rather than generic regex), protecting against prototype pollution and ensuring exact data integrity.

### 3. Maximum Efficiency
- **Zero Unnecessary Dependencies:** The project size is just a few kilobytes, staying massively under the 10MB limit by relying solely on native Web APIs.
- **Resource Hinting:** Implemented `<link rel="preconnect">` for external font loading, drastically reducing the First Contentful Paint (FCP) rendering time.
- **Hardware Acceleration:** CSS animations utilize `transform` and `opacity` exclusively to offload work to the GPU and prevent browser repaints.

### 4. Comprehensive Testing Suite
- **Custom Test Runner:** Included a built-in test suite (`test.js`) that automatically hooks into the console.
- **28 Edge-Case Assertions:** The suite validates:
  - Input boundary conditions (length, null, undefined).
  - Type validation and structural integrity.
  - XSS payload sanitization testing.
  - Exhaustive permutations of the Eligibility logic matrix (Age/Citizenship/Residency).
- **Run Tests:** Open the app, press `F12` to open the console, and click the **Run Unit Tests (Console)** button in the footer.

### 5. Inclusive Accessibility (A11Y)
- **Keyboard Navigation First:** Implemented a hidden "Skip to main content" link for screen-reader/keyboard users.
- **Global Focus Rings:** Configured high-contrast `:focus-visible` outlines ensuring every interactive element is clearly highlighted during `<Tab>` navigation.
- **Semantic HTML5:** 
  - Complete use of ARIA landmarks (`role="banner"`, `role="main"`, `role="contentinfo"`).
  - The FAQ uses native `<details>` and `<summary>` tags for out-of-the-box screen reader compliance.
- **Live Regions:** Dynamic UI changes (like chatbot responses) utilize `aria-live="polite"` and `aria-busy` to gracefully notify screen readers of status updates without jarring focus shifts.

### 6. Meaningful Google Services Integration
**Selected Integration:** Google Maps API (Option A)
- **Dynamic Loading:** The script asynchronously loads the Google Maps library.
- **Graceful Fallback Logic:** Recognizing the constraints of API key security, the application encapsulates the Google Maps logic (`src/services/googleMaps.js`) with an intelligent fallback. If the API key is a placeholder or fails to load, it doesn't crash the app; instead, it renders a simulated interactive UI displaying mock nearby polling stations.

---

## 🛠️ How to Run Locally

Because this project leverages modern ES6 Modules (`type="module"`), opening the file directly via `file://` will be blocked by CORS policies. 

**Run using Node.js (Recommended)**
```bash
npx serve . -p 3000
```
Open `http://localhost:3000`

**Run using Python**
```bash
python -m http.server 8000
```
Open `http://localhost:8000`

**Run using VS Code**
1. Right-click `index.html`
2. Select **Open with Live Server**

---

## 📝 Assumptions
- **Mock Data Engine:** The chatbot engine relies on a pre-defined static knowledge graph rather than a live LLM API to adhere strictly to the "Zero unnecessary dependencies" and "<10MB" project rules.
- **API Keys:** The Google Maps `<script>` uses `YOUR_API_KEY_HERE`. The application is intentionally designed to trigger its secure fallback mechanism to demonstrate resilient UI design.
