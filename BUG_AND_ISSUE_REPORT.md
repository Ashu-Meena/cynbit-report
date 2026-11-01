# Cynbit Website Bug & Issue Report

**Candidate / Lead:** ASHU MEENA  
**Role:** QA Testing Intern  
**Target Website:** [https://www.cynbit.in/](https://www.cynbit.in/)  
**Standard:** IEEE 829 Software Defect Documentation  
**Date:** November 2026  

---

## Defect Inventory Index

| Defect ID | Defect Title | Category | Severity | Priority | Component |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CYN-BUG-001** | 22 Out of 23 Career Form Labels Unassociated (`htmlFor` Missing) | Accessibility | **Critical** | P0 | `/careers/[slug]` |
| **CYN-BUG-002** | Multiple Input & Select Controls Missing `name` Attribute | Functional | **High** | P0 | `/careers/[slug]` |
| **CYN-BUG-003** | Additional Deliverable Link Label Hardcoded to Marketing Copy | Functional | **High** | P1 | `/candidate/[token]` |
| **CYN-BUG-004** | Missing `/favicon.ico` Generates 404 & 15KB Error Payload | Broken Elements | **Medium** | P1 | Server / Assets |
| **CYN-BUG-005** | Widespread Heading Concatenation & Spelling Typo (`Unheared`) | Broken Elements | **Medium** | P1 | Global Templates |
| **CYN-BUG-006** | Primary Header CTA "Join Us" Triggers Newsletter Instead of Careers | Usability / UX | **Medium** | P1 | Header Navigation |
| **CYN-BUG-007** | Blocking Synchronous `alert()` Used for Candidate Form Errors | Usability / UX | **Medium** | P1 | `/candidate/[token]` |
| **CYN-BUG-008** | Temporary 307 Redirect on Apex Domain Weakens Link Equity | Security & SEO | **High** | P1 | DNS / Routing |
| **CYN-BUG-009** | All 82 Sitemap URLs Point to Redirecting Apex Domain | Security & SEO | **High** | P1 | `sitemap.xml` |
| **CYN-BUG-010** | Missing Critical Security Response Headers (CSP, X-Frame-Options) | Security & SEO | **High** | P0 | Response Headers |
| **CYN-BUG-011** | Social Media Icon Links Lack `aria-label` or Accessible Text | Accessibility | **Medium** | P1 | Global Footer |
| **CYN-BUG-012** | Mobile Navigation Drawer Missing Body Scroll-Lock | Responsiveness | **Medium** | P1 | Mobile Nav Menu |
| **CYN-BUG-013** | Hero Floating Glassmorphic Badges Collide on Narrow Viewports (<380px) | Responsiveness | **Low** | P2 | Homepage Hero |
| **CYN-BUG-014** | Contact Form Labels Completely Disconnected from Inputs (5/5) | Accessibility | **High** | P0 | `/contact` |
| **CYN-BUG-015** | Hardcoded 180-Second Cashfree Payment Timeout Abruptly Terminates Session | Usability / UX | **Medium** | P1 | `/candidate/[token]` |
| **CYN-BUG-016** | Render-Blocking Google Webfont Import Delays FCP/LCP | Performance | **Low** | P2 | Head Metadata |
| **CYN-BUG-017** | Desktop Dropdown Menus Collapse Abruptly on Mouse Transition | Usability / UX | **Medium** | P2 | Header Nav |
| **CYN-BUG-018** | Missing Schema.org Organization Canonical Consistency | SEO | **Low** | P2 | Root Layout |
| **CYN-BUG-019** | Candidate Submission Input Accepts Non-HTTP Schemas | Functional | **Medium** | P1 | `/candidate/[token]` |
| **CYN-BUG-020** | Support Ticket Form Lacks Inline Field Character Counter | Usability / UX | **Low** | P2 | `/candidate/[token]` |
| **CYN-BUG-021** | Digital Signature Input Case-Insensitive Validation Alert | Functional | **Low** | P2 | Candidate Onboarding |

---

## Detailed Defect Specifications

### CYN-BUG-001: 22 Out of 23 Career Form Labels Unassociated (`htmlFor` Missing)
- **Severity:** Critical  
- **Priority:** P0 (Immediate Hotfix)  
- **Category:** Accessibility (WCAG 2.1 AA)  
- **Compliance Reference:** WCAG 2.1 Level A (1.3.1 Info and Relationships, 4.1.2 Name, Role, Value)  
- **Affected URL:** `https://www.cynbit.in/careers/qa-testing-intern` (and all `/careers/*` listings)  
- **Component:** `#application-form` in Next.js career page template  
- **Preconditions:** User navigates to any open job listing.
- **Steps to Reproduce:**
  1. Open `https://www.cynbit.in/careers/qa-testing-intern`.
  2. Scroll down to `#application-form`.
  3. Inspect form labels: "Full Name*", "Email Address*", "Phone Number*", "Date of Birth*", etc.
  4. Click on the label text with mouse or test with screen reader (NVDA / VoiceOver).
- **Expected Behavior:** Each `<label>` must have a `for` (or `htmlFor` in JSX) matching the input's `id`. Clicking the label must focus the field, and screen readers must announce the label text upon navigating to the control.
- **Actual Behavior:** 22 out of 23 labels have no `for` attribute and do not wrap the input. Clicking the label does not focus the field. Screen readers announce "edit text, blank" without context.
- **Impact:** Critical barrier for candidates with motor or visual disabilities. Severe legal/reputational compliance liability under international accessibility standards.
- **Code Remediation Diff:**
```diff
- <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name*</label>
- <input type="text" name="fullName" placeholder="e.g. Alex Rivera" className="..." />
+ <label htmlFor="app-fullName" className="block text-xs font-semibold text-slate-700 mb-1">Full Name*</label>
+ <input id="app-fullName" type="text" name="fullName" placeholder="e.g. Alex Rivera" className="..." />
```

---

### CYN-BUG-002: Multiple Select Dropdowns & Inputs Missing `name` Attribute in Career Form
- **Severity:** High  
- **Priority:** P0 (Immediate Hotfix)  
- **Category:** Functional Bugs  
- **Affected URL:** `https://www.cynbit.in/careers/qa-testing-intern`  
- **Component:** Education and academic score inputs in `#application-form`  
- **Steps to Reproduce:**
  1. Open DevTools Elements inspector on `/careers/qa-testing-intern`.
  2. Locate the dropdowns for "Highest Qualification", "Degree", "Specialization", "Graduation Year", "Education Status", "Score System".
  3. Inspect `<select>` and `<input>` tags.
- **Expected Behavior:** Every input and select control must have a valid `name` attribute matching backend submission schemas (e.g., `name="graduationYear"`, `name="qualification"`).
- **Actual Behavior:** 8 input and select elements completely omit the `name` attribute (`name=null`).
- **Impact:** Standard browser form serialization (`new FormData(e.target)`) drops all unnamed inputs. Browser autofill cannot detect or populate candidate educational qualifications.
- **Code Remediation Diff:**
```diff
- <select className="...">
-   <option value="">Select Qualification</option>
- </select>
+ <select name="highestQualification" id="highestQualification" className="...">
+   <option value="">Select Qualification</option>
+ </select>
```

---

### CYN-BUG-003: Additional Deliverable Link Label Hardcoded to Marketing Copy
- **Severity:** High  
- **Priority:** P1 (Sprint 1)  
- **Category:** Functional Bugs  
- **Affected URL:** `https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm`  
- **Component:** Candidate Assessment Deliverable Card (`page-da5a6f561f8d3783.js`)  
- **Steps to Reproduce:**
  1. Open the dedicated candidate portal: `https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm`.
  2. Under "Submit Assessment Deliverables", click **"+ Add Additional Deliverable Link"**.
  3. Inspect the newly added input field label.
- **Expected Behavior:** For an engineering / QA candidate, the label should read: `"Deliverable Link 2 (Live Demo / Test Automation Suite / Video Walkthrough)"` or generic `"Deliverable Link 2"`.
- **Actual Behavior:** Label explicitly renders: `"Deliverable Link 2 (Campaign Plan / Creatives / Strategy Rationale)"`.
- **Impact:** Technical candidates (QA, Backend, Full Stack) are baffled by marketing terminology and second-guess whether their assigned task has been misconfigured by HR.
- **Code Remediation Diff:**
```diff
- <label className="block text-xs font-semibold text-slate-700">
-   Deliverable Link {t+2} (Campaign Plan / Creatives / Strategy Rationale)
- </label>
+ <label className="block text-xs font-semibold text-slate-700">
+   Deliverable Link {t+2} {candidate.department === 'marketing' 
+     ? '(Campaign Plan / Creatives / Strategy Rationale)' 
+     : '(Live Demo / Test Execution / Documentation)'}
+ </label>
```

---

### CYN-BUG-004: Missing `/favicon.ico` Generates 404 & 15KB Error Payload
- **Severity:** Medium  
- **Priority:** P1 (Sprint 1)  
- **Category:** Broken Elements  
- **Affected URL:** `https://www.cynbit.in/favicon.ico`  
- **Component:** Asset Delivery / Vercel Edge Server  
- **Steps to Reproduce:**
  1. Open Chrome DevTools Network Tab.
  2. Navigate to `https://www.cynbit.in/favicon.ico`.
  3. Note HTTP status and payload size.
- **Expected Behavior:** Server serves an icon asset (image/x-icon or image/svg+xml) with 200 OK and long-term cache headers.
- **Actual Behavior:** Server returns HTTP 404 and downloads an entire 15,072 byte HTML error page.
- **Impact:** Automatically fetched by all modern browsers, bots, and feed readers, generating unnecessary 404 error logs in Vercel and wasting server bandwidth.
- **Code Remediation Diff:**
```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      { source: '/favicon.ico', destination: '/favicon.svg' }
    ];
  }
};
```

---

### CYN-BUG-005: Widespread Heading Concatenation & Spelling Typo (`Unheared`)
- **Severity:** Medium  
- **Priority:** P1 (Sprint 1)  
- **Category:** Broken Elements  
- **Affected URLs:**
  - `/diaries` -> `Student Diaries:Unheared Stories` (Spelling typo + missing space)
  - `/bitelevate/paths` -> `Architect yourown future.` (Missing space in "yourown")
  - `/navigation` -> `DigitalNavigation Map` (Missing space)
  - `/products` -> `TheCynbit ProductEcosystem` (Missing spaces)
  - `/team` -> `Meet theArchitectsbehind Cynbit` (Missing spaces)
  - `/impact` -> `Cynbit forSociety` (Missing space)
- **Component:** Primary H1 headings across marketing pages  
- **Steps to Reproduce:**
  1. Navigate to `https://www.cynbit.in/diaries`.
  2. Inspect the main H1 tag.
  3. Observe text: `"Student Diaries:Unheared Stories"`.
- **Expected Behavior:** Proper typography: `"Student Diaries: Unheard Stories"`, `"Architect your own future."`, `"Digital Navigation Map"`.
- **Actual Behavior:** `<span>` tags rendered without explicit whitespace tokens cause words to merge into unspaced strings. "Unheard" is misspelled as "Unheared".
- **Impact:** Poor editorial presentation; harms search engine indexation of compound keywords; announces garbled words in screen readers.

---

### CYN-BUG-006: Primary Header CTA "Join Us" Triggers Newsletter Instead of Careers
- **Severity:** Medium  
- **Priority:** P1 (Sprint 1)  
- **Category:** Usability & UX  
- **Affected URL:** `https://www.cynbit.in/` (Global Header)  
- **Component:** Header navigation bar CTA button  
- **Steps to Reproduce:**
  1. Open homepage on desktop.
  2. Click the primary button in the upper right labeled **"Join Us"**.
- **Expected Behavior:** Navigates directly to the careers portal (`/careers`) or BitElevate program enrollment (`/bitelevate`).
- **Actual Behavior:** Opens a modal dialog asking for email to "Join the Newsletter".
- **Impact:** Cognitive mismatch. Candidates wanting to apply for open roles are prompted to enter a mailing list.

---

### CYN-BUG-007: Blocking Synchronous `alert()` Used for Candidate Form Errors
- **Severity:** Medium  
- **Priority:** P1 (Sprint 1)  
- **Category:** Usability & UX  
- **Affected URL:** `https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm`  
- **Component:** Client bundle `page-da5a6f561f8d3783.js`  
- **Steps to Reproduce:**
  1. Leave primary deliverable empty.
  2. Click "Submit Work".
  3. Observe the browser popup.
- **Expected Behavior:** Modern web UI inline toast banner or form error state.
- **Actual Behavior:** Browser triggers modal `alert("Please enter a valid GitHub repository or project URL.")` and `alert("Error submitting assessment task.")`.
- **Impact:** Freezes browser execution thread; looks outdated; users can accidentally check "Prevent this page from creating additional dialogs" and silence critical notifications.

---

### CYN-BUG-008: Temporary 307 Redirect on Apex Domain Weakens Link Equity
- **Severity:** High  
- **Priority:** P1 (Sprint 1)  
- **Category:** Security & SEO  
- **Affected URL:** `https://cynbit.in/`  
- **Steps to Reproduce:**
  1. Run `curl -I https://cynbit.in/`.
  2. Inspect response status code `307 Temporary Redirect` -> `https://www.cynbit.in/`.
  3. Run `curl -I http://cynbit.in/` -> 308 -> 307 -> 200 (Double Redirect).
- **Expected Behavior:** Single 301 Permanent Redirect from apex to www canonical URL.
- **Actual Behavior:** 307 Temporary Redirect used. Search engine bots do not pass PageRank through temporary redirects.
- **Impact:** SEO dilution and extra latency hop.

---

### CYN-BUG-009: All 82 Sitemap URLs Point to Redirecting Apex Domain
- **Severity:** High  
- **Priority:** P1 (Sprint 1)  
- **Category:** Security & SEO  
- **Affected URL:** `https://www.cynbit.in/sitemap.xml`  
- **Component:** Next.js sitemap generator (`app/sitemap.ts` or `next-sitemap`)  
- **Steps to Reproduce:**
  1. Open `https://www.cynbit.in/sitemap.xml`.
  2. Inspect all `<loc>` elements.
- **Expected Behavior:** All URLs must match canonical serving host: `https://www.cynbit.in/...`.
- **Actual Behavior:** Every URL is listed as `https://cynbit.in/...` which 307-redirects to `www`.
- **Impact:** Every single search engine crawl request to sitemap paths incurs a redirect cycle.

---

### CYN-BUG-010: Missing Critical Security Response Headers (CSP, X-Frame-Options)
- **Severity:** High  
- **Priority:** P0 (Immediate Hotfix)  
- **Category:** Security & SEO  
- **Affected URL:** `https://www.cynbit.in/*`  
- **Component:** HTTP Response Headers (Vercel / Next.js)  
- **Steps to Reproduce:**
  1. Perform `curl -I https://www.cynbit.in/`.
  2. Check for `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- **Expected Behavior:** Standard security headers present.
- **Actual Behavior:** All four headers are MISSING.
- **Impact:** Vulnerable to Clickjacking (`<iframe>` embedding), MIME sniffing, and unmitigated XSS.

---

### CYN-BUG-011: Social Media Icon Links Lack `aria-label` or Accessible Text
- **Severity:** Medium  
- **Priority:** P1 (Sprint 1)  
- **Category:** Accessibility (WCAG 2.1 AA)  
- **Affected URL:** `https://www.cynbit.in/` (Global Footer)  
- **Steps to Reproduce:**
  1. Inspect footer social anchors (LinkedIn, Facebook, Instagram, X).
  2. Verify accessibility tree in DevTools.
- **Expected Behavior:** `<a aria-label="Visit Cynbit on LinkedIn" href="...">`.
- **Actual Behavior:** Anchors contain raw SVGs without text, title, or aria attributes.
- **Impact:** Screen readers announce "empty link".

---

### CYN-BUG-012: Mobile Navigation Drawer Missing Body Scroll-Lock
- **Severity:** Medium  
- **Priority:** P1 (Sprint 1)  
- **Category:** Responsiveness & Mobile Viewport  
- **Affected URL:** `https://www.cynbit.in/*`  
- **Steps to Reproduce:**
  1. Open website on mobile device (or 390px viewport).
  2. Tap hamburger button to open mobile menu.
  3. Drag touch-screen up and down on the menu overlay.
- **Expected Behavior:** Body behind overlay is scroll-locked (`overflow: hidden`).
- **Actual Behavior:** Background page scrolls concurrently with the overlay.
- **Impact:** Disorienting mobile interaction; menu jumps unexpectedly.

---

### CYN-BUG-014: Contact Form Labels Completely Disconnected from Inputs (5/5)
- **Severity:** High  
- **Priority:** P0 (Immediate Hotfix)  
- **Category:** Accessibility (WCAG 2.1 AA)  
- **Affected URL:** `https://www.cynbit.in/contact`  
- **Component:** Contact form (`/contact`)  
- **Steps to Reproduce:**
  1. Open `/contact`.
  2. Inspect `<label>` and `<input>` elements.
- **Expected Behavior:** `<label htmlFor="email">Email</label><input id="email" />`.
- **Actual Behavior:** All 5 labels lack `htmlFor` and all 5 inputs lack `id`.
- **Impact:** Screen readers cannot identify fields for prospective clients and partners.

---

### CYN-BUG-015: Hardcoded 180-Second Cashfree Payment Timeout Abruptly Terminates Session
- **Severity:** Medium  
- **Priority:** P1 (Sprint 1)  
- **Category:** Usability / UX  
- **Affected URL:** `https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm`  
- **Component:** Candidate Portal Enrollment Payment Integration  
- **Steps to Reproduce:**
  1. Review `page-da5a6f561f8d3783.js`: `setInterval(..., 180)`.
  2. Initiate UPI payment. If banking app takes >3 minutes, session terminates without clear timer warning.
- **Expected Behavior:** Provide clear visual countdown warning and opportunity to extend window.
- **Actual Behavior:** Silent timeout or abrupt failure alert.
- **Impact:** Risk of customer drop-off and support tickets.
