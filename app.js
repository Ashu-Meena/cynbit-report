/**
 * Cynbit QA Audit Dashboard Controller
 * Applicant: ASHU MEENA | Role: QA Testing Intern
 */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderDefects(QA_AUDIT_DATA.defects);
  renderMatrices();
  renderRecommendations();
  initSearchAndFilter();
  initModal();
  initRunner();
  initExportJson();
});

// TAB CONTROLLER
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      tabPanels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const targetPanel = document.getElementById(btn.dataset.tab);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}

// DEFECTS RENDERING
function renderDefects(defectsList) {
  const container = document.getElementById("defectsGrid");
  if (!container) return;

  if (defectsList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
        <p style="font-size: 16px;">No defects match the selected filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = defectsList.map(defect => {
    const sevClass = `badge-sev-${defect.severity.toLowerCase()}`;
    return `
      <div class="defect-card" data-id="${defect.id}" tabindex="0" role="button" aria-label="View details for ${defect.id}">
        <div>
          <div class="defect-header">
            <span class="defect-id-badge">${defect.id}</span>
            <div class="defect-badges">
              <span class="badge-sev ${sevClass}">${defect.severity}</span>
            </div>
          </div>
          <h3 class="defect-title">${escapeHtml(defect.title)}</h3>
          <div class="defect-component">
            <span>&#128279;</span> ${escapeHtml(defect.component)}
          </div>
          <p class="defect-desc">${escapeHtml(defect.actualBehavior || defect.impact)}</p>
        </div>

        <div class="defect-footer">
          <span>Priority: <strong>${defect.priority}</strong></span>
          <span class="view-details-link">Details &rarr;</span>
        </div>
      </div>
    `;
  }).join("");

  // Attach card click handlers for modal
  container.querySelectorAll(".defect-card").forEach(card => {
    card.addEventListener("click", () => {
      const bugId = card.dataset.id;
      const defect = QA_AUDIT_DATA.defects.find(d => d.id === bugId);
      if (defect) openModal(defect);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const bugId = card.dataset.id;
        const defect = QA_AUDIT_DATA.defects.find(d => d.id === bugId);
        if (defect) openModal(defect);
      }
    });
  });
}

// SEARCH & CATEGORY FILTERING
function initSearchAndFilter() {
  const searchInput = document.getElementById("defectSearchInput");
  const pills = document.querySelectorAll(".filter-pill");
  let currentCategory = "ALL";
  let currentSearch = "";

  function applyFilters() {
    let filtered = QA_AUDIT_DATA.defects;

    if (currentCategory !== "ALL") {
      filtered = filtered.filter(d => d.category.toLowerCase().includes(currentCategory.toLowerCase()) || d.category === currentCategory);
    }

    if (currentSearch.trim()) {
      const term = currentSearch.toLowerCase().trim();
      filtered = filtered.filter(d => 
        d.id.toLowerCase().includes(term) ||
        d.title.toLowerCase().includes(term) ||
        d.component.toLowerCase().includes(term) ||
        d.actualBehavior.toLowerCase().includes(term) ||
        d.category.toLowerCase().includes(term)
      );
    }

    renderDefects(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      applyFilters();
    });
  }

  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.dataset.category;
      applyFilters();
    });
  });
}

// MODAL CONTROLLER
function initModal() {
  const modal = document.getElementById("defectModal");
  const closeBtn = document.getElementById("modalCloseBtn");

  if (!modal) return;

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

function openModal(defect) {
  const modal = document.getElementById("defectModal");
  if (!modal) return;

  document.getElementById("modalBugId").textContent = defect.id;
  const sevEl = document.getElementById("modalBugSev");
  sevEl.textContent = defect.severity;
  sevEl.className = `badge-sev badge-sev-${defect.severity.toLowerCase()}`;
  document.getElementById("modalBugPriority").textContent = defect.priority;
  document.getElementById("modalBugTitle").textContent = defect.title;
  document.getElementById("modalBugComponent").textContent = `${defect.component} (${defect.category})`;
  document.getElementById("modalBugPreconditions").textContent = defect.preconditions || "Standard browser access.";
  
  const stepsContainer = document.getElementById("modalBugSteps");
  stepsContainer.innerHTML = (defect.stepsToReproduce || []).map(step => `<li>${escapeHtml(step)}</li>`).join("");

  document.getElementById("modalBugExpected").textContent = defect.expectedBehavior;
  document.getElementById("modalBugActual").textContent = defect.actualBehavior;
  document.getElementById("modalBugImpact").textContent = defect.impact;

  const diffSection = document.getElementById("modalDiffSection");
  const diffBox = document.getElementById("modalBugCodeFix");
  if (defect.codeFixSnippet) {
    diffSection.style.display = "block";
    diffBox.textContent = defect.codeFixSnippet;
  } else {
    diffSection.style.display = "none";
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("defectModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "unset";
}

// MATRICES RENDERING
function renderMatrices() {
  // Browsers
  const browserBody = document.getElementById("browserTableBody");
  if (browserBody && QA_AUDIT_DATA.testMatrix) {
    browserBody.innerHTML = QA_AUDIT_DATA.testMatrix.browsers.map(b => `
      <tr>
        <td style="font-weight:700; color:#fff;">${b.name}</td>
        <td style="font-family:var(--font-mono);">${b.version}</td>
        <td>${b.os}</td>
        <td><span class="badge-pill badge-live">${b.status}</span></td>
      </tr>
    `).join("");
  }

  // Viewports
  const viewportBody = document.getElementById("viewportTableBody");
  if (viewportBody && QA_AUDIT_DATA.testMatrix) {
    viewportBody.innerHTML = QA_AUDIT_DATA.testMatrix.viewports.map(v => `
      <tr>
        <td style="font-weight:700; color:#fff;">${v.device}</td>
        <td style="font-family:var(--font-mono);">${v.resolution}</td>
        <td>${v.orientation}</td>
        <td>${v.dpi}</td>
        <td>${v.notes}</td>
      </tr>
    `).join("");
  }

  // Network
  const networkBody = document.getElementById("networkTableBody");
  if (networkBody && QA_AUDIT_DATA.testMatrix) {
    networkBody.innerHTML = QA_AUDIT_DATA.testMatrix.networkProfiles.map(n => `
      <tr>
        <td style="font-weight:700; color:#fff;">${n.profile}</td>
        <td style="font-family:var(--font-mono);">${n.latency}</td>
        <td>${n.download}</td>
        <td>${n.upload}</td>
      </tr>
    `).join("");
  }
}

// RECOMMENDATIONS RENDERING
function renderRecommendations() {
  const container = document.getElementById("recommendationsContainer");
  if (!container || !QA_AUDIT_DATA.recommendations) return;

  container.innerHTML = QA_AUDIT_DATA.recommendations.map(recGroup => `
    <div class="rec-card">
      <h3>
        <span class="badge-sev badge-sev-${recGroup.priority === 'P0' ? 'critical' : recGroup.priority === 'P1' ? 'high' : 'medium'}">${recGroup.priority}</span>
        ${recGroup.phase}
      </h3>
      <div>
        ${recGroup.items.map(item => `
          <div class="rec-item">
            <div class="rec-item-header">
              <span class="rec-item-title">${escapeHtml(item.title)}</span>
              <div class="rec-badge-group">
                <span class="badge-pill" style="background:rgba(255,255,255,0.06); color:var(--text-secondary);">Effort: ${item.effort}</span>
              </div>
            </div>
            <p class="rec-item-desc">${escapeHtml(item.description)}</p>
            <p style="font-size:12px; color:var(--brand-teal-light); margin-top:8px;"><strong>Impact:</strong> ${escapeHtml(item.impact)}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

// AUTOMATION RUNNER
function initRunner() {
  const output = document.getElementById("runnerOutput");
  const btn = document.getElementById("btnRerunAutomation");

  const runLogs = [
    { type: "info", text: "===========================================================================" },
    { type: "info", text: "  EXECUTING CYNBIT WEBSITE QUALITY REGRESSION SUITE (Live Assertions)" },
    { type: "info", text: "  Target: https://www.cynbit.in/ | Candidate: ASHU MEENA | Role: QA Intern" },
    { type: "info", text: "===========================================================================" },
    { type: "fail", text: "[FAIL] [CYN-QA-001] Default /favicon.ico returns HTTP 404 (Medium)" },
    { type: "fail", text: "[FAIL] [CYN-QA-002] Temporary 307 Redirect on Apex Domain instead of 301 (Medium)" },
    { type: "fail", text: "[FAIL] [CYN-QA-003] Missing Critical Security Response Headers: CSP, X-Frame-Options (High)" },
    { type: "fail", text: "[FAIL] [CYN-QA-004] Sitemap URLs Point to Redirecting Apex Domain (82 URLs affected) (High)" },
    { type: "fail", text: "[FAIL] [CYN-QA-TYPO-DIARIES] Typography Typo & Concatenation on /diaries ('Unheared') (Medium)" },
    { type: "fail", text: "[FAIL] [CYN-QA-TYPO-BITELEVATE] Typography Concatenation on /bitelevate/paths ('yourown') (Medium)" },
    { type: "fail", text: "[FAIL] [CYN-QA-TYPO-NAV] Typography Concatenation on /navigation ('DigitalNavigation') (Medium)" },
    { type: "fail", text: "[FAIL] [CYN-QA-TYPO-PROD] Typography Concatenation on /products ('TheCynbit') (Medium)" },
    { type: "fail", text: "[FAIL] [CYN-QA-TYPO-TEAM] Typography Concatenation on /team ('theArchitectsbehind') (Medium)" },
    { type: "fail", text: "[FAIL] [CYN-QA-007] Career Form Unassociated Disconnected Labels (22/23 disconnected) (Critical)" },
    { type: "fail", text: "[FAIL] [CYN-QA-008] Missing 'name' Attributes on Career Form Controls (8 select/inputs) (High)" },
    { type: "fail", text: "[FAIL] [CYN-QA-009] Contact Form Completely Disconnected Labels (5/5 unassociated) (High)" },
    { type: "fail", text: "[FAIL] [CYN-QA-010] Social Media Icon Links Lack Accessible Names / aria-label (4/4 links) (Medium)" },
    { type: "warn", text: "[WARN] [CYN-QA-011] Header 'Join Us' Button Triggers Newsletter Instead of Careers (Medium)" },
    { type: "info", text: "===========================================================================" },
    { type: "info", text: "  EXECUTION SUMMARY: 14 Programmatic Assertions Run | 0 PASS | 13 FAIL | 1 WARN" },
    { type: "info", text: "  Exported results to qa_automation_results.json" }
  ];

  function streamLogs() {
    output.innerHTML = "";
    runLogs.forEach((log, index) => {
      setTimeout(() => {
        const line = document.createElement("div");
        line.className = `log-line log-${log.type}`;
        line.textContent = log.text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
      }, index * 80);
    });
  }

  streamLogs();

  if (btn) {
    btn.addEventListener("click", () => {
      streamLogs();
    });
  }
}

// EXPORT JSON FOR JIRA / LINEAR
function initExportJson() {
  const exportBtn = document.getElementById("btnExportJson");
  if (!exportBtn) return;

  exportBtn.addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(QA_AUDIT_DATA, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "Cynbit_Website_QA_Audit_ASHU_MEENA.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
