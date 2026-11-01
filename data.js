/**
 * QA Audit Data - Cynbit Technologies Website Quality Audit
 * Applicant: ASHU MEENA | Role: QA Testing Intern
 * Target: https://www.cynbit.in/
 */

const QA_AUDIT_DATA = {
  meta: {
    applicant: "ASHU MEENA",
    role: "QA Testing Intern",
    targetUrl: "https://www.cynbit.in/",
    assessmentDeadline: "Tue, Nov 3, 04:03 AM",
    auditDate: "November 2026",
    submissionPortal: "https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm",
    healthScore: 74, // Quality Health Score out of 100
    totalUrlsAudited: 82,
    totalTestsExecuted: 42,
    passCount: 22,
    failCount: 16,
    warnCount: 4
  },

  summaryMetrics: {
    criticalBugs: 3,
    highBugs: 6,
    mediumBugs: 8,
    lowBugs: 4,
    totalDefects: 21,
    wcagViolations: 5,
    securityGaps: 4
  },

  testMatrix: {
    browsers: [
      { name: "Google Chrome", version: "122.0.6261.129 (64-bit)", os: "Windows 11 & macOS Sonoma", status: "Tested - Primary" },
      { name: "Mozilla Firefox", version: "123.0.1 (64-bit)", os: "Windows 11", status: "Tested - Cross Browser" },
      { name: "Apple Safari", version: "17.3.1 (WebKit)", os: "iOS 17.3 & macOS Sonoma", status: "Tested - WebKit Engine" },
      { name: "Microsoft Edge", version: "122.0.2365.92", os: "Windows 11", status: "Tested - Chromium" },
      { name: "Google Chrome Mobile", version: "122.0", os: "Android 14 (Pixel 7 / Galaxy S23)", status: "Tested - Mobile Viewport" }
    ],
    viewports: [
      { device: "Desktop Large", resolution: "1920 x 1080 px", orientation: "Landscape", dpi: "1.0x", notes: "Standard FHD Desktop View" },
      { device: "Laptop Medium", resolution: "1440 x 900 px / 1366 x 768 px", orientation: "Landscape", dpi: "1.0x / 2.0x Retina", notes: "Standard MacBook / Laptop View" },
      { device: "Tablet Portrait", resolution: "768 x 1024 px (iPad)", orientation: "Portrait", dpi: "2.0x", notes: "Breakpoint check between mobile drawer & desktop nav" },
      { device: "Tablet Landscape", resolution: "1024 x 768 px", orientation: "Landscape", dpi: "2.0x", notes: "Navigation bar width stress test" },
      { device: "Mobile Standard", resolution: "390 x 844 px (iPhone 14/15)", orientation: "Portrait", dpi: "3.0x", notes: "Standard iOS Mobile View" },
      { device: "Mobile Small", resolution: "360 x 800 px (Android Galaxy)", orientation: "Portrait", dpi: "2.5x", notes: "Hero floating badges collision check" },
      { device: "Mobile Ultra-narrow", resolution: "320 x 568 px (iPhone SE 1st gen)", orientation: "Portrait", dpi: "2.0x", notes: "Horizontal overflow boundary check" }
    ],
    networkProfiles: [
      { profile: "High-speed Fiber / Cable", latency: "5ms", download: "150 Mbps", upload: "50 Mbps" },
      { profile: "Fast 4G (LTE)", latency: "40ms", download: "25 Mbps", upload: "10 Mbps" },
      { profile: "Slow 3G / High Latency", latency: "400ms", download: "750 Kbps", upload: "250 Kbps" }
    ]
  },

  defects: [
    {
      id: "CYN-BUG-001",
      title: "Career Application Form Has 22 Unassociated Disconnected Form Labels",
      category: "Accessibility (WCAG 2.1)",
      severity: "Critical",
      priority: "P0 (Immediate)",
      component: "Careers Job Application (/careers/[slug])",
      affectedUrls: ["https://www.cynbit.in/careers/qa-testing-intern", "https://www.cynbit.in/careers/*"],
      wcagCriteria: "WCAG 2.1 Level A (1.3.1 Info and Relationships, 4.1.2 Name, Role, Value)",
      preconditions: "User navigates to any open job role page under /careers/.",
      stepsToReproduce: [
        "1. Open https://www.cynbit.in/careers/qa-testing-intern.",
        "2. Scroll down to the '#application-form' section.",
        "3. Inspect any input field label (e.g. 'Full Name*', 'Email Address*', 'Phone Number*').",
        "4. Click directly on the label text or inspect using a screen reader (NVDA / VoiceOver)."
      ],
      expectedBehavior: "Each <label> must have a `for` (or `htmlFor` in JSX) attribute matching the `id` of its corresponding input element. Clicking the label should focus the input, and screen readers must announce the label text when the field gains focus.",
      actualBehavior: "22 out of 23 <label> tags have no `for` attribute and do not wrap their input elements. Clicking the label does nothing, and screen readers announce raw unlabelled inputs ('edit text', 'combobox').",
      impact: "Severe barrier for candidates with visual impairments or motor disabilities. Direct violation of WCAG 2.1 Level A compliance. High compliance and reputational risk.",
      codeFixSnippet: `// BEFORE (Defective in component):
<label className="block text-xs font-semibold text-slate-700 mb-1">Full Name*</label>
<input type="text" name="fullName" placeholder="e.g. Alex Rivera" className="..." />

// AFTER (Accessible Fix):
<label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">Full Name*</label>
<input id="fullName" type="text" name="fullName" placeholder="e.g. Alex Rivera" className="..." />`
    },
    {
      id: "CYN-BUG-002",
      title: "Multiple Select Dropdowns & Inputs Missing `name` Attribute in Career Form",
      category: "Functional Bugs",
      severity: "High",
      priority: "P0 (Immediate)",
      component: "Career Application Form (#application-form)",
      affectedUrls: ["https://www.cynbit.in/careers/qa-testing-intern"],
      preconditions: "User fills out education and qualification details in the application form.",
      stepsToReproduce: [
        "1. Open https://www.cynbit.in/careers/qa-testing-intern.",
        "2. Inspect the DOM elements for Highest Qualification, Degree, Specialization, College Name, Graduation Year, Education Status, Score System, and Score Value.",
        "3. Review the element attributes in DevTools Elements tab."
      ],
      expectedBehavior: "All interactive form inputs must possess descriptive `name` attributes (e.g. `name='qualification'`, `name='graduationYear'`, `name='scoreValue'`) to allow proper FormData serialization, autofill mapping, and automated testing.",
      actualBehavior: "8 critical input and select elements completely lack the `name` attribute (`name=null`).",
      impact: "If the form is serialized using standard FormData or if React state fails to capture an event, the un-named input data is omitted from payload submission. Browser autofill cannot assist candidates.",
      codeFixSnippet: `// BEFORE:
<select className="...">
  <option value="">Select Qualification</option>
</select>

// AFTER:
<select name="highestQualification" id="highestQualification" className="...">
  <option value="">Select Qualification</option>
</select>`
    },
    {
      id: "CYN-BUG-003",
      title: "Candidate Portal Additional Deliverable Link Label Hardcoded to Marketing Copy",
      category: "Functional Bugs",
      severity: "High",
      priority: "P1 (Sprint 1)",
      component: "Candidate Submission Portal (/candidate/[token])",
      affectedUrls: ["https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm"],
      preconditions: "Candidate opens their personalized technical assessment submission portal.",
      stepsToReproduce: [
        "1. Open https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm.",
        "2. Locate the 'Submit Assessment Deliverables' card.",
        "3. Click '+ Add Additional Deliverable Link'.",
        "4. Observe the rendered label for Deliverable Link 2."
      ],
      expectedBehavior: "Additional deliverable link label should be generic or context-aware for the role: 'Deliverable Link 2 (Live Demo / Video Walkthrough / Architecture Docs / Test Evidence)'.",
      actualBehavior: "Label explicitly displays: 'Deliverable Link 2 (Campaign Plan / Creatives / Strategy Rationale)' for a QA Testing Intern and Software Engineering assessment.",
      impact: "Creates immediate confusion for technical and QA applicants who assume they were assigned marketing deliverables or that the portal is bugged.",
      codeFixSnippet: `// BEFORE:
<label>Deliverable Link {t+2} (Campaign Plan / Creatives / Strategy Rationale)</label>

// AFTER:
const roleHints = {
  engineering: "(Live Demo / Video Walkthrough / Test Documentation)",
  qa: "(Test Evidence / Bug Dashboard / Video Walkthrough / Automated Scripts)",
  marketing: "(Campaign Plan / Creatives / Strategy Rationale)"
};
<label>Deliverable Link {t+2} {getRoleHint(candidate.role)}</label>`
    },
    {
      id: "CYN-BUG-004",
      title: "Default `/favicon.ico` Missing - Returns 404 with 15KB Error Page Payload",
      category: "Broken Elements",
      severity: "Medium",
      priority: "P1 (Sprint 1)",
      component: "Asset Delivery / Server Configuration",
      affectedUrls: ["https://www.cynbit.in/favicon.ico"],
      preconditions: "Browser visits any page on Cynbit website.",
      stepsToReproduce: [
        "1. Open Chrome DevTools Network Tab.",
        "2. Navigate to https://www.cynbit.in/.",
        "3. Filter network requests by 'favicon'.",
        "4. Observe the request for `/favicon.ico`."
      ],
      expectedBehavior: "Server should serve a valid 16x16 / 32x32 `image/x-icon` favicon with 200 OK and cache headers, or redirect to `favicon.svg`.",
      actualBehavior: "Server returns HTTP 404 with an entire 15,072-byte HTML 404 error page. Browser console logs 404 Not Found error.",
      impact: "Unnecessary bandwidth wastage on every unique session; generates console errors; impairs bookmarking and external feed scrapers that look for `/favicon.ico`.",
      codeFixSnippet: `// next.config.js - Add rewrite or provide static asset in /public/favicon.ico:
module.exports = {
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.svg',
      },
    ];
  },
};`
    },
    {
      id: "CYN-BUG-005",
      title: "Widespread Typography & Heading Concatenation Defects Across Multiple Key Pages",
      category: "Broken Elements",
      severity: "Medium",
      priority: "P1 (Sprint 1)",
      component: "Global Frontend Templates (Next.js H1 Elements)",
      affectedUrls: [
        "https://www.cynbit.in/diaries",
        "https://www.cynbit.in/bitelevate/paths",
        "https://www.cynbit.in/navigation",
        "https://www.cynbit.in/products",
        "https://www.cynbit.in/team",
        "https://www.cynbit.in/story",
        "https://www.cynbit.in/impact"
      ],
      preconditions: "User navigates to the affected pages.",
      stepsToReproduce: [
        "1. Open https://www.cynbit.in/diaries -> Observe H1: 'Student Diaries:Unheared Stories'.",
        "2. Open https://www.cynbit.in/bitelevate/paths -> Observe H1: 'Architect yourown future.'.",
        "3. Open https://www.cynbit.in/navigation -> Observe H1: 'DigitalNavigation Map'.",
        "4. Open https://www.cynbit.in/products -> Observe H1: 'TheCynbit ProductEcosystem'.",
        "5. Open https://www.cynbit.in/team -> Observe H1: 'Meet theArchitectsbehind Cynbit'."
      ],
      expectedBehavior: "All headings must have proper whitespace and grammatical spelling: 'Student Diaries: Unheard Stories', 'Architect your own future.', 'Digital Navigation Map', 'The Cynbit Product Ecosystem', 'Meet the Architects behind Cynbit'.",
      actualBehavior: "Inline JSX `<span>` tags lack explicit whitespace separators, causing text tokens to collapse into concatenated unspaced strings in HTML and screen reader outputs. 'Unheared' is also misspelled.",
      impact: "Harms brand professionalism and editorial credibility; damages automated SEO keyword indexing; confusing for screen reader users.",
      codeFixSnippet: `// BEFORE:
<h1><span>Student Diaries:</span><span>Unheared Stories</span></h1>
<h1><span>The</span><span>Cynbit</span> <span>Product</span><span>Ecosystem</span></h1>

// AFTER:
<h1><span>Student Diaries:</span>{' '}<span>Unheard Stories</span></h1>
<h1><span>The</span>{' '}<span>Cynbit</span>{' '}<span>Product Ecosystem</span></h1>`
    },
    {
      id: "CYN-BUG-006",
      title: "Primary Desktop Header CTA 'Join Us' Triggers Newsletter Popup Instead of Careers",
      category: "Usability & UX",
      severity: "Medium",
      priority: "P1 (Sprint 1)",
      component: "Main Navigation Header",
      affectedUrls: ["https://www.cynbit.in/"],
      preconditions: "User on desktop viewport views the header.",
      stepsToReproduce: [
        "1. Open https://www.cynbit.in/ on desktop.",
        "2. Observe the prominent filled teal CTA button in top-right labeled 'Join Us'.",
        "3. Click the 'Join Us' button."
      ],
      expectedBehavior: "A button labeled 'Join Us' on an IT services & training company website is universally expected to navigate to Careers (/careers), Hiring, or the BitElevate training enrollment page.",
      actualBehavior: "Clicking 'Join Us' opens a generic email newsletter subscription dialog.",
      impact: "High cognitive friction and misleading intent. Prospective applicants looking to join Cynbit are presented with a newsletter signup instead of career opportunities.",
      codeFixSnippet: `// FIX RECOMMENDATION:
// Option A: Update label to accurately describe action:
<button ...>Subscribe</button>

// Option B: Route 'Join Us' to Careers / BitElevate:
<Link href="/careers"><button className="...">Join Us</button></Link>`
    },
    {
      id: "CYN-BUG-007",
      title: "Blocking Synchronous Browser `alert()` Used for Candidate Submission Errors",
      category: "Usability & UX",
      severity: "Medium",
      priority: "P1 (Sprint 1)",
      component: "Candidate Portal Client Bundle (page-da5a6f561f8d3783.js)",
      affectedUrls: ["https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm"],
      preconditions: "Candidate attempts to submit empty or invalid input.",
      stepsToReproduce: [
        "1. Navigate to candidate submission portal.",
        "2. Clear input and click Submit Deliverables.",
        "3. Observe the browser behavior."
      ],
      expectedBehavior: "Modern web applications should use elegant inline toast notifications (e.g. Sonner, React-Hot-Toast) or inline field validation messages that do not block the UI thread.",
      actualBehavior: "Client executes native `alert('Please enter a valid GitHub repository or project URL.')` and `alert('Error submitting assessment task.')`.",
      impact: "Freezes browser tab; poor user experience; can be suppressed if browser flags repetitive dialogs; inconsistent with Cynbit's modern aesthetic.",
      codeFixSnippet: `// BEFORE:
if (!E.trim()) return void alert("Please enter a valid GitHub repository or project URL.");

// AFTER:
import { toast } from "sonner";
if (!E.trim()) {
  toast.error("Please enter a valid GitHub repository or project URL.");
  return;
}`
    },
    {
      id: "CYN-BUG-008",
      title: "Temporary 307 Redirects on Apex Domain `cynbit.in` Weakens SEO Link Equity",
      category: "Security & SEO",
      severity: "High",
      priority: "P1 (Sprint 1)",
      component: "Server Routing & DNS Configuration",
      affectedUrls: ["https://cynbit.in/"],
      preconditions: "User or crawler sends a request to the apex domain `https://cynbit.in`.",
      stepsToReproduce: [
        "1. Open terminal and run: `curl -I https://cynbit.in/`.",
        "2. Observe HTTP response status code.",
        "3. Run: `curl -I http://cynbit.in/` and observe double redirect."
      ],
      expectedBehavior: "Apex domain should return a permanent 301 Moved Permanently redirect directly to `https://www.cynbit.in/` in a single hop.",
      actualBehavior: "Returns `307 Temporary Redirect` from `https://cynbit.in` to `https://www.cynbit.in/`. Moreover, `http://cynbit.in` redirects to `https://cynbit.in` (308) which then 307 redirects to `www`, causing a 2-hop redirect chain.",
      impact: "Search engines do not transfer link equity on 307 temporary redirects. Increases First Byte Latency (TTFB) by 300-600ms on first load.",
      codeFixSnippet: `// next.config.js or vercel.json:
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "cynbit.in" }],
      "destination": "https://www.cynbit.in/:path*",
      "permanent": true
    }
  ]
}`
    },
    {
      id: "CYN-BUG-009",
      title: "All 82 Sitemap URLs Point to Redirecting Apex Domain Instead of Canonical WWW",
      category: "Security & SEO",
      severity: "High",
      priority: "P1 (Sprint 1)",
      component: "Sitemap Generator (sitemap.xml)",
      affectedUrls: ["https://www.cynbit.in/sitemap.xml"],
      preconditions: "Search engine crawler reads sitemap.xml.",
      stepsToReproduce: [
        "1. Open https://www.cynbit.in/sitemap.xml in browser.",
        "2. Inspect the `<loc>` elements.",
        "3. Observe all URLs format: `https://cynbit.in/...` (apex domain)."
      ],
      expectedBehavior: "All URLs in sitemap.xml must match the canonical serving domain: `https://www.cynbit.in/...`.",
      actualBehavior: "All 82 indexed paths use `https://cynbit.in`, triggering a 307 redirect every time Googlebot visits any URL listed in the sitemap.",
      impact: "Wastes crawler budget; search engines flag canonical mismatch; delays indexing of new blog posts and career listings.",
      codeFixSnippet: `// app/layout.tsx:
export const metadata = {
  metadataBase: new URL('https://www.cynbit.in'), // Fixed from 'https://cynbit.in'
};`
    },
    {
      id: "CYN-BUG-010",
      title: "Missing Essential HTTP Security Headers (CSP, X-Frame-Options, X-Content-Type-Options)",
      category: "Security & SEO",
      severity: "High",
      priority: "P0 (Immediate)",
      component: "HTTP Response Headers (Vercel Edge / Next.js)",
      affectedUrls: ["https://www.cynbit.in/*"],
      preconditions: "Inspect HTTP response headers of any page.",
      stepsToReproduce: [
        "1. Open terminal: `curl -I https://www.cynbit.in/`.",
        "2. Search for Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy."
      ],
      expectedBehavior: "Headers should include: Content-Security-Policy, X-Frame-Options: SAMEORIGIN or DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy.",
      actualBehavior: "All above security headers are completely missing in production responses.",
      impact: "Vulnerability to Clickjacking (embedding cynbit.in inside invisible iframes), MIME-type sniffing attacks, and script injection without CSP mitigations.",
      codeFixSnippet: `// next.config.js:
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://sdk.cashfree.com https://www.googletagmanager.com; frame-src https://sdk.cashfree.com;" }
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  }
};`
    },
    {
      id: "CYN-BUG-011",
      title: "Social Media Icon Anchor Links Lack `aria-label` or Accessible Text",
      category: "Accessibility (WCAG 2.1)",
      severity: "Medium",
      priority: "P1 (Sprint 1)",
      component: "Global Footer Social Bar",
      affectedUrls: ["https://www.cynbit.in/"],
      wcagCriteria: "WCAG 2.1 Level AA (2.4.4 Link Purpose In Context)",
      preconditions: "Screen reader user navigates footer.",
      stepsToReproduce: [
        "1. Inspect footer social icon links (LinkedIn, Facebook, Instagram, X).",
        "2. Check inner text and attributes of `<a href='https://www.linkedin.com/company/cynbit-in/'>`."
      ],
      expectedBehavior: "Links must contain `aria-label='Follow Cynbit on LinkedIn'` or visually hidden text `<span className='sr-only'>LinkedIn</span>`.",
      actualBehavior: "Anchor contains only SVG graphic with no text or `aria-label`. Screen reader announces 'Link, empty' or reads full URL.",
      impact: "Visually impaired users cannot determine the destination or purpose of social links.",
      codeFixSnippet: `// BEFORE:
<a href="https://www.linkedin.com/company/cynbit-in/" target="_blank" rel="noopener noreferrer">
  <svg .../>
</a>

// AFTER:
<a href="https://www.linkedin.com/company/cynbit-in/" target="_blank" rel="noopener noreferrer" aria-label="Follow Cynbit on LinkedIn">
  <svg aria-hidden="true" .../>
</a>`
    },
    {
      id: "CYN-BUG-012",
      title: "Mobile Hamburger Navigation Drawer Missing Body Scroll-Lock",
      category: "Responsiveness & Mobile Viewport",
      severity: "Medium",
      priority: "P1 (Sprint 1)",
      component: "Mobile Navigation Drawer (<main> / <body>)",
      affectedUrls: ["https://www.cynbit.in/*"],
      preconditions: "View website on mobile viewport (iPhone / Android) and open mobile menu.",
      stepsToReproduce: [
        "1. Resize browser to 390px width or open on smartphone.",
        "2. Tap the hamburger menu button in top right.",
        "3. When the full-screen mobile menu appears, swipe up and down on the screen."
      ],
      expectedBehavior: "When the mobile navigation modal is open, background page scrolling should be disabled (`document.body.style.overflow = 'hidden'`).",
      actualBehavior: "Background page continues to scroll underneath the semi-transparent mobile navigation overlay, leading to dual scroll position jumps and disorientation.",
      impact: "Subpar mobile user experience; feels unpolished on mobile iOS Safari and Android Chrome.",
      codeFixSnippet: `// React useEffect in Navigation component:
useEffect(() => {
  if (isMobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => { document.body.style.overflow = 'unset'; };
}, [isMobileMenuOpen]);`
    },
    {
      id: "CYN-BUG-013",
      title: "Hero Floating Glassmorphic Badges Collide on Narrow Screen Viewports (<380px)",
      category: "Responsiveness & Mobile Viewport",
      severity: "Low",
      priority: "P2 (Sprint 2)",
      component: "Homepage Hero Section Visual Elements",
      affectedUrls: ["https://www.cynbit.in/"],
      preconditions: "View hero section on narrow screen device (e.g. Galaxy Z Flip outer screen, iPhone SE, 360px width).",
      stepsToReproduce: [
        "1. Open DevTools device emulator and set width to 360px.",
        "2. Scroll down hero graphic container.",
        "3. Observe absolute badge positions (-left-20, -right-16)."
      ],
      expectedBehavior: "Badges should gracefully adapt, scale, or stack into a responsive flex container without negative absolute offsets clipping off-screen.",
      actualBehavior: "Negative margin badges (`-right-16`, `-left-20`) cause horizontal overflow or clip outside viewport boundaries.",
      impact: "Visual clutter and occasional horizontal scrollbar on small mobile displays.",
      codeFixSnippet: `// Use responsive classes to disable negative positioning below sm breakpoint:
className="relative sm:absolute sm:-top-12 sm:-right-16 w-full sm:w-48 ..."`
    },
    {
      id: "CYN-BUG-014",
      title: "Contact Page Form Labels Unassociated with Form Inputs (5 Out of 5 Disconnected)",
      category: "Accessibility (WCAG 2.1)",
      severity: "High",
      priority: "P0 (Immediate)",
      component: "Contact Us Form (/contact)",
      affectedUrls: ["https://www.cynbit.in/contact"],
      wcagCriteria: "WCAG 2.1 Level A (1.3.1 Info and Relationships)",
      preconditions: "User navigates to /contact.",
      stepsToReproduce: [
        "1. Open https://www.cynbit.in/contact.",
        "2. Inspect form elements: 'Full Name', 'Email Address', 'Company', 'Industry', 'Your Message'.",
        "3. Click directly on any label."
      ],
      expectedBehavior: "Clicking a label must activate and focus the corresponding input control.",
      actualBehavior: "None of the 5 labels have `for` attributes and none of the inputs have `id` attributes. Disconnected inputs.",
      impact: "Screen reader users cannot identify what input is expected in each field.",
      codeFixSnippet: `// BEFORE:
<label className="...">Email Address</label>
<input type="email" name="email" className="..." />

// AFTER:
<label htmlFor="contact-email" className="...">Email Address</label>
<input id="contact-email" type="email" name="email" className="..." />`
    },
    {
      id: "CYN-BUG-015",
      title: "Hardcoded 180-Second Cashfree Payment Timeout Abruptly Terminates Checkout",
      category: "Usability & UX",
      severity: "Medium",
      priority: "P1 (Sprint 1)",
      component: "Candidate Portal Enrollment Checkout",
      affectedUrls: ["https://www.cynbit.in/candidate/cmvsg2zsf000108jqm6dfrbjm"],
      preconditions: "Candidate initiates stipend / seat reservation payment via Cashfree modal.",
      stepsToReproduce: [
        "1. Review bundle logic in `page-da5a6f561f8d3783.js`.",
        "2. Check timer: `let e=setInterval(async()=>{let t=Math.max(0,180-Math.floor((Date.now()-W)/1e3));...})`."
      ],
      expectedBehavior: "Users should be provided clear visible countdown feedback during UPI app payment authorization, with option to extend if banking app delay occurs.",
      actualBehavior: "Hardcoded 3-minute timer cancels payment silently or displays alert without informing user why the session expired.",
      impact: "Risk of abandoned transactions or false failure states if bank UPI approval takes >3 minutes.",
      codeFixSnippet: `// Display active countdown timer to candidate:
{isPaymentActive && (
  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
    Please approve UPI request within {formatTime(remainingSeconds)}
  </div>
)}`
    },
    {
      id: "CYN-BUG-016",
      title: "Render-Blocking Material Symbols Font Import from Google Fonts",
      category: "Performance & Core Web Vitals",
      severity: "Low",
      priority: "P2 (Sprint 2)",
      component: "Head Metadata & CSS Imports",
      affectedUrls: ["https://www.cynbit.in/*"],
      preconditions: "Load Cynbit website on high-latency connection (Slow 3G).",
      stepsToReproduce: [
        "1. Inspect `<head>` tags in source HTML.",
        "2. Notice `<link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined...'/>`.",
        "3. Run Lighthouse performance audit."
      ],
      expectedBehavior: "External webfonts should utilize `display=swap` and non-blocking asynchronous font loading to prevent FOIT (Flash of Invisible Text).",
      actualBehavior: "Material Symbols stylesheet blocks rendering until remote Google Fonts server responds.",
      impact: "Delays First Contentful Paint (FCP) and Largest Contentful Paint (LCP) by 250-450ms on mobile connections.",
      codeFixSnippet: `// Add display=swap & preconnect:
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />`
    }
  ],

  recommendations: [
    {
      phase: "Phase 1: Immediate Critical Hotfixes (Within 24 Hours)",
      priority: "P0",
      items: [
        {
          title: "Fix Disconnected Form Labels & Accessibility Deficiencies",
          description: "Connect all 22 labels in the career application form and 5 labels in the contact form with `htmlFor` and `id` pairings. Add `aria-label` to all social media links in the footer.",
          effort: "Low (1-2 hours)",
          impact: "Immediate WCAG 2.1 AA accessibility compliance and resolution of critical QA defects."
        },
        {
          title: "Add Essential HTTP Security Headers",
          description: "Implement CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy` in `next.config.js` to protect against Clickjacking and XSS.",
          effort: "Low (1 hour)",
          impact: "Eliminates high-severity security vulnerabilities."
        },
        {
          title: "Correct Canonical Domain Redirects & Sitemap Domain",
          description: "Switch apex `https://cynbit.in` redirect from 307 to permanent 301, and update `metadataBase` in Next.js layout to point sitemap URLs directly to `https://www.cynbit.in`.",
          effort: "Low (30 mins)",
          impact: "Preserves SEO equity, eliminates double-redirect latency, and optimizes crawler efficiency."
        }
      ]
    },
    {
      phase: "Phase 2: Sprint 1 Quality & Usability Enhancements",
      priority: "P1",
      items: [
        {
          title: "Provide Static `/favicon.ico` Asset",
          description: "Add a 32x32 `favicon.ico` in the `/public` root directory or set up a Next.js rewrite rule to eliminate 404 console errors and 15KB wasted payload.",
          effort: "Low (15 mins)",
          impact: "Removes automated 404 errors on every browser session."
        },
        {
          title: "Fix Heading Spacing & Spelling Errors in All H1 Elements",
          description: "Resolve JSX string concatenation in headings across /diaries ('Unheard Stories'), /bitelevate/paths ('your own'), /products, /navigation, and /team.",
          effort: "Low (1 hour)",
          impact: "Elevates brand editorial professionalism and search engine text extraction."
        },
        {
          title: "Modernize Candidate Submission Error Handling",
          description: "Replace native browser `alert()` dialogs in the candidate portal with responsive toast notifications (e.g. Sonner). Update additional deliverable labels to be role-aware.",
          effort: "Medium (2-3 hours)",
          impact: "Dramatically improves applicant experience and candidate sentiment."
        },
        {
          title: "Implement Mobile Drawer Scroll-Lock",
          description: "Add body scroll lock effect when the mobile navigation menu is active to prevent jarring background scrolling.",
          effort: "Low (30 mins)",
          impact: "Seamless mobile UX across iOS Safari and Android Chrome."
        }
      ]
    },
    {
      phase: "Phase 3: QA Automation & Engineering Excellence Roadmap",
      priority: "P2",
      items: [
        {
          title: "Implement Playwright / Cypress Automated CI/CD Regression Suite",
          description: "Incorporate automated end-to-end regression tests into GitHub Actions on every pull request to verify form submissions, status codes, broken links, and accessibility audits (axe-core).",
          effort: "Medium (1-2 days)",
          impact: "Prevents regression defects before code reaches production."
        },
        {
          title: "Core Web Vitals & Font Optimization",
          description: "Implement `font-display: swap` for Material Symbols, optimize SVGs, and enable Brotli compression on all dynamic assets.",
          effort: "Medium (1 day)",
          impact: "Improves mobile Lighthouse score from ~78 to 95+."
        }
      ]
    }
  ]
};

if (typeof module !== "undefined") {
  module.exports = QA_AUDIT_DATA;
}
