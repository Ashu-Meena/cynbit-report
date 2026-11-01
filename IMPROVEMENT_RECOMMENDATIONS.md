# Cynbit Quality Improvement Recommendations & Engineering Roadmap

**Candidate / Lead:** ASHU MEENA  
**Role:** QA Testing Intern  
**Target Application:** [https://www.cynbit.in/](https://www.cynbit.in/)  
**Assessment Deliverable:** Improvement Recommendations for Development & QA Teams  
**Date:** November 2026  

---

## 1. Executive Prioritization Matrix

To maximize engineering return on investment and address the most critical risks first, recommendations are segmented into three distinct phases:

```
+-----------------------------------------------------------------------------------------+
|                              PRIORITIZATION ROADMAP                                     |
+-----------------------------------------------------------------------------------------+
| PHASE 1: IMMEDIATE HOTFIXES (P0 - Within 24 Hours)                                      |
|  * Reconnect 22 Career & 5 Contact Form Labels (WCAG 1.3.1 compliance)                  |
|  * Add missing `name` attributes to all form controls                                   |
|  * Inject OWASP Security Headers (CSP, X-Frame-Options, X-Content-Type-Options)         |
+-----------------------------------------------------------------------------------------+
| PHASE 2: SPRINT 1 ENHANCEMENTS (P1 - 1-2 Weeks)                                         |
|  * Correct Canonical 301 Redirects and align `sitemap.xml` with www host               |
|  * Provide `/favicon.ico` asset to eliminate 404 console errors & 15KB overhead         |
|  * Fix heading whitespace concatenation & spelling across marketing templates           |
|  * Replace native `alert()` popups with toast notifications in Candidate Portal         |
|  * Implement mobile navigation drawer body scroll-lock                                  |
+-----------------------------------------------------------------------------------------+
| PHASE 3: QA AUTOMATION & ENGINEERING EXCELLENCE (P2 - Ongoing)                          |
|  * Deploy Playwright Automated End-to-End Regression Suite in GitHub Actions CI/CD      |
|  * Integrate `@axe-core/playwright` for automated zero-accessibility-regression gates    |
|  * Optimize Webfonts & Core Web Vitals to reach Lighthouse 95+ Score                   |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Phase 1: Immediate Critical Hotfixes (P0)

### 2.1 Standardize Form Accessibility Design System (WCAG 1.3.1, 4.1.2)
**Problem:** 22 out of 23 labels on `/careers/*` and 5 out of 5 labels on `/contact` have no `htmlFor` binding and inputs lack `id`. Screen readers cannot determine what fields are required.
**Remediation Blueprint:**
Create a reusable, accessible Form Input component in Next.js/React:
```tsx
// components/ui/FormInput.tsx
import React, { useId } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, id, required, ...props }) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1">
      <label 
        htmlFor={inputId} 
        className="block text-xs font-semibold text-slate-700 cursor-pointer"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="w-full bg-white border border-slate-200 focus:border-[#006067] focus:ring-2 focus:ring-[#006067]/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
        {...props}
      />
      {error && (
        <p id={errorId} className="text-[11px] text-rose-500 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
```

---

### 2.2 Add OWASP Security Headers in `next.config.js`
**Problem:** Cynbit is currently vulnerable to Clickjacking (`X-Frame-Options` missing) and MIME-type sniffing attacks.
**Remediation Blueprint:**
Add the following configuration in `next.config.js`:
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://sdk.cashfree.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "frame-src https://sdk.cashfree.com",
      "connect-src 'self' https://sdk.cashfree.com https://api.cashfree.com https://www.google-analytics.com",
    ].join('; '),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 3. Phase 2: Sprint 1 Quality & Usability Enhancements (P1)

### 3.1 Unify Canonical Redirection & Sitemap URLs
**Problem:** Apex domain `cynbit.in` returns 307 Temporary Redirect, and `sitemap.xml` lists all 82 paths under `https://cynbit.in`, causing double hops and crawler inefficiency.
**Remediation Blueprint:**
1. In `app/layout.tsx`, update `metadataBase`:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://www.cynbit.in'), // Fixed from apex domain
  // ...
};
```
2. In `vercel.json` or `next.config.js`, configure permanent 301 redirection from apex to `www`:
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "cynbit.in" }],
      "destination": "https://www.cynbit.in/:path*",
      "permanent": true
    }
  ]
}
```

---

### 3.2 Provide Static `/favicon.ico`
**Problem:** `GET /favicon.ico` returns HTTP 404 with 15KB error payload.
**Remediation Blueprint:**
Place a 32x32 `favicon.ico` into the `/public` root folder or configure a redirect rule in `next.config.js`:
```javascript
async rewrites() {
  return [
    {
      source: '/favicon.ico',
      destination: '/favicon.svg',
    },
  ];
}
```

---

### 3.3 Replace Native `alert()` with Modern Toast Notifications
**Problem:** In `candidate/[token]`, error handling executes blocking `alert("Please enter a valid GitHub repository...")`.
**Remediation Blueprint:**
Install and implement `sonner` or `react-hot-toast`:
```tsx
// In candidate submission handler:
import { toast } from 'sonner';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!primaryLink.trim()) {
    toast.error('Please enter a valid GitHub repository or project URL.', {
      description: 'Your deliverable link must be accessible to our evaluation team.'
    });
    return;
  }
  
  setIsSubmitting(true);
  try {
    const res = await submitCandidateAssessment(candidateId, primaryLink, additionalLinks, notes);
    if (res.success) {
      toast.success('Assessment Deliverables Submitted Successfully!', {
        description: 'Our technical evaluation team will review your submission shortly.'
      });
    } else {
      toast.error(res.error || 'Failed to submit work. Please try again.');
    }
  } catch (err) {
    toast.error('Network error submitting assessment. Please check your connection.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### 3.4 Mobile Navigation Body Scroll-Lock
**Problem:** Background page scrolls while mobile navigation overlay is open.
**Remediation Blueprint:**
```tsx
useEffect(() => {
  if (isMobileMenuOpen) {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  } else {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
}, [isMobileMenuOpen]);
```

---

## 4. Phase 3: QA Automation & Engineering Excellence (P2)

### 4.1 Automated CI/CD Regression Pipeline Architecture
Implement Playwright end-to-end tests inside GitHub Actions to run on every Pull Request before deployment to production.

```
       [Developer Pull Request]
                  |
                  v
       +-----------------------+
       |   GitHub Actions CI   |
       +-----------------------+
                  |
       +----------+----------+
       |                     |
       v                     v
 [Playwright E2E]     [axe-core A11y]
  * Form Submits       * 0 Unassociated Labels
  * 82 Sitemap URLs    * Contrast >= 4.5:1
  * 0 Broken Assets    * All Links have aria-label
       |                     |
       +----------+----------+
                  |
                  v
       [Deploy to Vercel Prod]
```

### 4.2 Playwright Sample Test File (`tests/cynbit-e2e.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Cynbit Quality Regression Suite', () => {
  
  test('Verify /favicon.ico returns 200 OK', async ({ request }) => {
    const response = await request.get('https://www.cynbit.in/favicon.ico');
    expect(response.status()).not.toBe(404);
  });

  test('Verify Career Application Form has properly associated labels', async ({ page }) => {
    await page.goto('https://www.cynbit.in/careers/qa-testing-intern');
    const form = page.locator('#application-form');
    await expect(form).toBeVisible();

    const nameInput = form.locator('#fullName');
    const nameLabel = form.locator('label[for="fullName"]');
    await expect(nameInput).toBeVisible();
    await expect(nameLabel).toBeVisible();
    
    // Clicking label must focus input
    await nameLabel.click();
    await expect(nameInput).toBeFocused();
  });

  test('Automated WCAG 2.1 AA Accessibility Audit', async ({ page }) => {
    await page.goto('https://www.cynbit.in/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Verify OWASP Security Headers present on root', async ({ request }) => {
    const response = await request.get('https://www.cynbit.in/');
    const headers = response.headers();
    expect(headers['x-frame-options']).toBeDefined();
    expect(headers['x-content-type-options']).toBe('nosniff');
  });
});
```

---

## 5. Defect Prevention Checklist for Cynbit Engineering

Prior to merging any pull request to `main`, developers should verify:
- [ ] Every `<input>`, `<select>`, and `<textarea>` has a matching `<label htmlFor="...">` and `id="..."`.
- [ ] Every form control has an explicit `name="..."` attribute for FormData and autofill.
- [ ] Heading `<span>` elements contain explicit whitespace `{' '}` to prevent word concatenation.
- [ ] External icon links (`<a>`) have descriptive `aria-label` tags.
- [ ] No native `alert()` or `confirm()` dialogs are invoked in client code.
- [ ] All new routes are registered in canonical sitemap generator with `https://www.cynbit.in`.
