# Cynbit Website Quality Audit & QA Assessment Solution

**Applicant / Lead:** ASHU MEENA  
**Role Applied:** QA Testing Intern  
**Target Platform:** [https://www.cynbit.in/](https://www.cynbit.in/)  
**Assessment Task:** Cynbit Website Quality Audit  
**Submission Portal:** [https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm](https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm)  
**Submission Deadline:** Tue, Nov 3, 04:03 AM  
**Repository Status:** Production Ready & Automated  

---

## 🚀 Overview

This repository contains the complete practical technical assessment for the **QA Testing Intern** role at **Cynbit Technologies**. 

The solution delivers an in-depth empirical audit of the live Cynbit platform (`https://www.cynbit.in/`), combining **automated regression testing**, **WCAG 2.1 Level AA accessibility validation**, **responsive multi-viewport analysis**, and **OWASP security compliance**.

### 📦 Deliverables Summary

1. **[QA Audit Report (`QA_AUDIT_REPORT.md`)](./QA_AUDIT_REPORT.md)**:
   - Comprehensive testing methodology (ISTQB & IEEE 829 standards).
   - In-depth scope definition across **82 sitemap URLs** and interactive client routes.
   - Cross-browser compatibility matrix (Chrome, Firefox, Safari, Edge, Android Chrome).
   - Multi-device viewport testing matrix (Desktop, Laptop, Tablet, Mobile 360px - 1920px).
   - Network latency simulation matrix (Broadband, 4G, Slow 3G).

2. **[Bug & Issue Report (`BUG_AND_ISSUE_REPORT.md`)](./BUG_AND_ISSUE_REPORT.md)**:
   - **21 Verified Production Defects** cataloged in standard IEEE 829 defect format.
   - Breakdown: 3 Critical (P0), 6 High (P1), 8 Medium (P2), 4 Low (P3).
   - Exact steps to reproduce, expected vs. actual behaviors, and code fix diffs for developers.

3. **[Improvement Recommendations (`IMPROVEMENT_RECOMMENDATIONS.md`)](./IMPROVEMENT_RECOMMENDATIONS.md)**:
   - Prioritized 3-phase engineering roadmap:
     - **Phase 1 (P0):** Immediate 24-hour critical hotfixes (Form label accessibility, OWASP security headers).
     - **Phase 2 (P1):** Sprint 1 quality & usability enhancements (Sitemap canonicalization, favicon fix, toast notifications).
     - **Phase 3 (P2):** QA automation architecture (Playwright CI/CD pipeline, axe-core automated regression gates).
   - Developer pre-merge quality checklist.

4. **Interactive Live QA Testing Portal (`index.html`, `style.css`, `app.js`, `data.js`)**:
   - A state-of-the-art interactive dashboard with glassmorphic aesthetics.
   - Real-time search, filterable category pills, severity badges, and interactive defect modals.
   - Built-in live regression runner simulation and JSON export for Jira / Linear.
   - Print-optimized stylesheet for 1-click PDF generation.

5. **Executable Automated Regression Suite (`automated_qa_suite.py`)**:
   - Executable Python script that performs live assertions against `https://www.cynbit.in/` and exports structured findings to `qa_automation_results.json`.

---

## 📊 Key Audit Metrics & Findings

```
+---------------------------------------------------------------------------------+
|                       CYNBIT QA AUDIT HEALTH SCORECARD                          |
+---------------------------------------------------------------------------------+
| Quality Health Score        : 74 / 100                                          |
| Total URLs Audited          : 82 Pages                                          |
| Total Tests Executed        : 42 Automated & Exploratory Tests                  |
| Total Defects Identified    : 21 Verified Defects                               |
| Defect Severity Breakdown   : 3 Critical (P0) | 6 High (P1) | 8 Med | 4 Low     |
| WCAG 2.1 A11y Violations    : 5 Non-Compliant Areas                             |
| Security Header Gaps        : 4 Missing Critical Headers (CSP, X-Frame-Options) |
+---------------------------------------------------------------------------------+
```

### Top 5 Notable Defects Identified:
1. **Critical Form Label Disconnection (`CYN-BUG-001`):** 22 out of 23 labels on `/careers/qa-testing-intern` have no `for` (or `htmlFor`) attribute, violating WCAG 1.3.1 Level A. Screen readers announce unlabelled inputs.
2. **Missing Input `name` Attributes (`CYN-BUG-002`):** 8 select/input elements on the job application form lack `name` attributes, causing data loss during standard FormData serialization.
3. **Candidate Portal Template Mismatch (`CYN-BUG-003`):** In `candidate/[token]`, additional deliverable link label is hardcoded to marketing copy: `"Deliverable Link 2 (Campaign Plan / Creatives / Strategy Rationale)"` for engineering/QA applicants.
4. **Missing Favicon 404 Overhead (`CYN-BUG-004`):** Requesting `/favicon.ico` returns HTTP 404 with a full 15KB HTML error page on every browser session.
5. **Double Redirect Hop & Sitemap Mismatch (`CYN-BUG-008` & `CYN-BUG-009`):** Apex domain `cynbit.in` returns `307 Temporary Redirect` (not 301), and all 82 URLs in `sitemap.xml` point to `https://cynbit.in` rather than the canonical `https://www.cynbit.in`.

---

## 🛠️ How to Run the Automated Test Suite

### Prerequisites:
- Python 3.8+ installed.
- Internet connectivity to access `https://www.cynbit.in/`.

### Execution:
```bash
# Navigate to the project directory
cd "cynbit report"

# Run the automated regression suite
python automated_qa_suite.py
```

The script will execute live assertions against `https://www.cynbit.in/`, output color-coded test results to the terminal, and save a full audit artifact to `qa_automation_results.json`.

---

## 🌐 How to View the Interactive QA Dashboard

Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari):

```bash
# On Windows PowerShell:
start index.html

# Or open directly by double-clicking index.html in file explorer
```

### Dashboard Features:
- **Instant Search:** Type any keyword (e.g. `Cashfree`, `H1`, `labels`, `001`) to immediately isolate bugs.
- **Category Filter:** Filter by Accessibility, Functional, Broken Elements, Usability, Security & SEO, or Responsiveness.
- **Interactive Modals:** Click any defect card to view full reproduction steps, expected vs actual behaviors, and code fix diffs.
- **JSON Export:** Click `Export JSON` to export the entire defect catalog in standardized format for Jira/Linear import.
- **PDF Export:** Click `Print / PDF` for a printer-optimized report view.

---

## 📂 Repository File Structure

```
cynbit-report/
├── index.html                   # Interactive QA Dashboard web application
├── style.css                    # Modern dark glassmorphic stylesheet & print styles
├── app.js                       # Dashboard interactive controller & runner simulation
├── data.js                      # Centralized structured audit dataset
├── automated_qa_suite.py        # Executable Python live regression test script
├── qa_automation_results.json   # Output from automated regression execution
├── deep_audit_results.json      # Complete crawl results of 23 key routes & endpoints
├── QA_AUDIT_REPORT.md           # Deliverable 1: Methodology, Scope, Matrices
├── BUG_AND_ISSUE_REPORT.md      # Deliverable 2: Complete 21-defect catalog
├── IMPROVEMENT_RECOMMENDATIONS.md # Deliverable 3: Prioritized 3-Phase roadmap
└── README.md                    # Project overview & candidate submission details
```

---

## 👤 Candidate Information

- **Applicant Name:** ASHU MEENA
- **Role:** QA Testing Intern
- **Target Company:** Cynbit Technologies
- **Submission Token URL:** [https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm](https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm)
