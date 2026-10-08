/**
 * ABHI JHA — PERSONAL PORTFOLIO SCRIPT
 * B.Tech CSE Student · AI, ML & Cybersecurity
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. THEME SWITCHER
  // =========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlElement = document.documentElement;

  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('abhi-theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (err) {
    // Storage unavailable — fall through to the OS preference
    savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} mode`);
    });
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('abhi-theme', theme);
    } catch (err) {
      // Private mode / storage disabled — the theme still applies for this session
    }

    // Keep the toggle's accessible name and state in sync with what it does
    if (themeToggleBtn) {
      const goingToDark = theme !== 'dark';
      themeToggleBtn.setAttribute('aria-label', `Switch to ${goingToDark ? 'dark' : 'light'} theme`);
      themeToggleBtn.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    } else {
      themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
  }

  // =========================================================================
  // 2. MOBILE NAVIGATION
  // =========================================================================
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  function closeMobileNav() {
    if (!navMenu || !mobileNavToggle) return;
    navMenu.classList.remove('open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // =========================================================================
  // 3. SCROLL SPY
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateScrollSpy() {
    let currentId = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // rAF-throttled: the old handler ran on every scroll event, and each pass
  // read offsetTop/offsetHeight for every section (forced layout).
  let spyScheduled = false;
  function scheduleScrollSpy() {
    if (spyScheduled) return;
    spyScheduled = true;
    requestAnimationFrame(() => {
      spyScheduled = false;
      updateScrollSpy();
    });
  }

  window.addEventListener('scroll', scheduleScrollSpy, { passive: true });
  window.addEventListener('resize', scheduleScrollSpy, { passive: true });
  updateScrollSpy();

  // =========================================================================
  // 4. SKILLS MATRIX FILTER
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const matrixItems = document.querySelectorAll('.matrix-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const category = btn.dataset.category;
      let visible = 0;

      matrixItems.forEach(item => {
        const show = category === 'all' || item.dataset.category === category;
        // Toggle [hidden] instead of inline display so the state is exposed
        // to assistive tech, and animate via a class rather than inline styles.
        item.hidden = !show;
        item.classList.toggle('is-entering', show);
        if (show) {
          visible += 1;
          requestAnimationFrame(() => item.classList.remove('is-entering'));
        }
      });

      const label = btn.textContent.trim();
      showToast(
        category === 'all'
          ? `Showing all ${visible} skills`
          : `Filtered to ${visible} skill${visible === 1 ? '' : 's'} — ${label}`
      );
    });
  });

  // =========================================================================
  // 5. INTERACTIVE TERMINAL
  // =========================================================================
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const termChips = document.querySelectorAll('.term-chip');

  const commands = {
    help: `Available commands:
  whoami     — About Abhi Jha
  experience — Police Cyber Cell & Education details   (alias: exp)
  projects   — Deep learning & cybersecurity projects
  skills     — Technical skills breakdown
  certs      — Certifications, programs & leadership  (alias: certifications)
  contact    — Email, phone, GitHub, LinkedIn
  clear      — Clear terminal`,

    whoami: `Name: Abhi Jha
Status: Junior CSE Undergraduate @ Dr. Bhimrao Ambedkar University (CGPA: 8.0/10.0)
Focus: Network Security | Deepfake Detection | AI/ML Engineering
Experience: Cybersecurity Intern – Amroha Police Cybersecurity Cell (Govt of UP)
Objective: Seeking Cybersecurity / AI-ML Engineering internship roles 🎯
Motto: Build. Learn. Secure. Innovate. 🚀`,

    experience: `[WORK EXPERIENCE]
• Cybersecurity Intern – Amroha Police Cybersecurity Cell (June 2026)
  - Built 3 automated forensic tools to streamline digital-evidence workflows.
  - Developed deep learning-based NIDS flagging DoS, port scans & brute-force in live traffic.
  - Built CNN synthetic media classifier for active fraud investigations.
  - Earned Content Creator Award from panel of 10+ senior law-enforcement officers.

[EDUCATION]
• Bachelor of Engineering in Computer Science Engineering (July 2024 – July 2028)
  - Dr. Bhimrao Ambedkar University, Agra, India
  - Cumulative Grade Point Average (CGPA): 8.0 / 10.0
  - Coursework: DSA, OS, DBMS, Computer Networks, ML, AI, Cybersecurity, Computer Vision`,

    projects: `[1] VigilVoice: Real-Time Audio Deepfake & Voice Spoofing Detection
    Tech: Python, PyTorch, FastAPI, Librosa, WebSockets, React, Vite, Docker Compose, Pytest
    Details: Real-time detection of AI voice clones, TTS & replay spoofing. 2D PyTorch CNN with 13-band MFCC DSP pipeline, low-latency WebSocket monitor, and SHA-256 traceable forensic reports.

[2] Cyber Sentinel: AI-Powered Network Intrusion Detection System
    Tech: Python, LSTM/CNN, Scapy, Wireshark
    Details: Hybrid LSTM/CNN architecture for real-time packet classification. Reached 90%+ accuracy on held-out CICIDS2017 traffic.

[3] Deepfake Detection System using Computer Vision
    Tech: Python, OpenCV, CNN
    Details: Frame-sampling and face-localization pipeline feeding custom CNN. Temporal aggregation reaching 92% precision on 200+ test samples.

[4] Automated Digital Forensics Suite
    Tech: Python, Forensic Evidence Tooling
    Details: 3 automated forensic tools built for Amroha Police Cybersecurity Cell.`,

    skills: `• Languages: Python, Java, C++, SQL, JavaScript, HTML, CSS, Bash
• AI / ML & Data: CNN, LSTM, PyTorch, Scikit-learn, Pandas, NumPy, SciPy, Librosa, OpenCV, Digital Signal Processing (MFCC)
• Security & Networking: Network Intrusion Detection, Packet Capture (Scapy/Wireshark), Deepfake & Voice-Spoofing Forensics, Digital Evidence Handling, Threat Analysis
• Web, Backend & Tools: FastAPI, React, WebSockets, REST APIs, Pytest, Git, Docker, Docker Compose, AWS, Linux, SQLite, MySQL`,

    certs: `• Certifications:
  - AWS Certified Cloud Practitioner (2025)
  - Google Data Analytics Certificate (2025)
• Programs:
  - APCSIP-2026 (Cyber Security & Infosec Practices)
  - Microsoft Global Fabric Fair 2026
• Leadership & Honors:
  - IET International Technology Conference: Anchor & Designer (200+ delegates)
  - Content Creator Award: Security Tooling presentation to 10+ Senior Police Officers`,

    contact: `Email:    abhijha.edu@gmail.com
Mobile:   +91 8218778168
GitHub:   github.com/Abhi-Jha-18 (@Abhi-Jha-18)
LinkedIn: linkedin.com/in/abhi-jha18 (@abhi-jha18)
Location: Agra, Uttar Pradesh, India
Status:   Seeking Cybersecurity / AI-ML Engineering Internship Roles 🎯`,

    clear: 'CLEAR_ACTION'
  };

  commands.exp = commands.experience;
  commands.certifications = commands.certs;

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">abhi@portfolio:~$</span> <span class="terminal-command">${escapeHtml(rawCmd)}</span>`;
    terminalOutput.appendChild(userLine);

    // Command output comes from the local `commands` map, not from user input,
    // so it is trusted markup; unknown input is escaped.
    const responseText = commands[cmd] ||
      `Command not found: "${escapeHtml(rawCmd)}". Type "help" to see available commands.`;

    const outputBlock = document.createElement('div');
    outputBlock.className = 'terminal-output';
    outputBlock.innerHTML = responseText.replace(/\n/g, '<br>');
    terminalOutput.appendChild(outputBlock);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    // Cap the transcript so a long session doesn't grow the DOM unbounded
    const MAX_LINES = 200;
    const lines = terminalOutput.children;
    while (lines.length > MAX_LINES) terminalOutput.removeChild(lines[0]);
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        executeCommand(terminalInput.value);
        terminalInput.value = '';
      }
    });
  }

  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      executeCommand(chip.dataset.cmd);
      if (terminalInput) terminalInput.focus();
    });
  });

  // =========================================================================
  // 6. PROJECT MODALS
  // =========================================================================
  const projectModal = document.getElementById('projectModal');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const projectModalBody = document.getElementById('projectModalBody');
  const projectTriggers = document.querySelectorAll('.project-modal-trigger');

  const projectData = {
    vigilvoice: {
      repo: 'https://github.com/Abhi-Jha-18/vigil-voice',
      title: 'VigilVoice: Real-Time Audio Deepfake & Voice Spoofing Detection',
      badge: 'Audio ML · Real-Time Forensics · PyTorch',
      overview: 'A real-time platform detecting AI voice clones, text-to-speech (TTS), and replay spoofing in live audio streams and uploaded recordings. Engineered for high precision under acoustic noise with verifiable forensic incident reporting.',
      highlights: [
        'Built a real-time platform detecting AI voice clones, TTS, and replay spoofing in live calls and uploaded audio.',
        'Architected a DSP pipeline (energy-based VAD, silence clipping, quality checks, 13-band MFCC extraction) feeding a 2D PyTorch CNN.',
        'Built evaluation suite tracking EER, ROC-AUC, FAR/FRR, and noise robustness on speaker-disjoint splits.',
        'Engineered a low-latency WebSocket monitor using a 2.5s sliding window (1.0s hop) with rolling multi-window voting and spike protection to suppress transient false alarms.',
        'Implemented a forensic incident logger recording peak spoof scores and model SHA-256 hashes in traceable JSON reports formatted for cybercrime portals.',
        'Containerized with Docker Compose; wrote 60+ integration tests and load-testing scripts, with asyncio semaphores throttling concurrent inference.'
      ],
      tech: ['Python', 'PyTorch', 'FastAPI', 'Librosa', 'NumPy', 'SciPy', 'React', 'Vite', 'WebSockets', 'Tailwind CSS', 'Docker Compose', 'Pytest'],
      impact: 'Provides enterprise platforms and crime investigation portals with an end-to-end, tamper-evident voice spoofing audit trail.'
    },
    cybersentinel: {
      repo: 'https://github.com/Abhi-Jha-18/cyber-sentinel-ids',
      repoLabel: 'View dashboard repo',
      // The linked repository holds the monitoring dashboard, not the detection
      // model. Say so up front so a reader doesn't open it expecting PyTorch.
      repoNote: 'This repository contains the tactical monitoring dashboard (Node/Express) that '
        + 'visualises live IDS state and ships with an attack simulator so the UI can be demoed '
        + 'without a capture interface. The PyTorch LSTM/CNN model, the Scapy/Wireshark feature '
        + 'pipeline and the CICIDS2017 evaluation are not published in this repository.',
      title: 'Cyber Sentinel: AI-Powered Network Intrusion Detection System',
      badge: 'Deep Learning Traffic Defense · NIDS',
      overview: 'A deep learning-powered Network Intrusion Detection System built for real-time packet classification, combining deep sequence modeling with custom features extracted from live Scapy and Wireshark captures.',
      highlights: [
        'Designed a hybrid LSTM/CNN architecture for real-time packet classification using custom features from live Scapy and Wireshark captures.',
        'Tuned hyperparameters and the feature-engineering pipeline to reach 90%+ accuracy across intrusion categories on held-out CICIDS2017 traffic.',
        'Flags port scans, DoS attacks, and brute-force attempts with low false alarm rates in live production environments.',
        'Optimized feature extraction for low-overhead packet inspection across high-bandwidth network interfaces.'
      ],
      tech: ['Python', 'LSTM / CNN', 'Scapy', 'Wireshark', 'CICIDS2017', 'Packet Capture', 'Threat Analysis'],
      impact: 'Protects critical network perimeters by converting raw packet traffic into real-time threat intelligence.'
    },
    deepfakecv: {
      repo: 'https://github.com/Abhi-Jha-18/Anti-deepfake_Project',
      title: 'Deepfake Detection System using Computer Vision',
      badge: 'Computer Vision · Synthetic Media Forensics',
      overview: 'A computer vision pipeline designed for synthetic-media and face-swap detection, combining OpenCV facial landmark localization with deep convolutional feature extraction.',
      highlights: [
        'Built a frame-sampling and face-localization pipeline in OpenCV feeding a custom CNN classifier for synthetic-media detection.',
        'Applied temporal aggregation across video frames to stabilize predictions and eliminate transient false classifications.',
        'Reached 92% precision on 200+ test samples across synthetic video datasets.',
        'Extracts subtle facial compression boundary artifacts and unnatural biological motion.'
      ],
      tech: ['Python', 'OpenCV', 'CNN', 'Temporal Aggregation', 'Face Localization', 'Synthetic Media Analysis'],
      impact: 'Aids digital forensic investigators in authenticating video evidence and mitigating AI-generated impersonation fraud.'
    },
    forensictools: {
      repo: 'https://github.com/Abhi-Jha-18',
      title: 'Automated Digital Forensics Suite',
      badge: 'Amroha Police Cybersecurity Cell · Govt. of UP',
      overview: 'A suite of automated forensic tooling built during an active cybersecurity internship at Amroha Police Cybersecurity Cell, Government of Uttar Pradesh.',
      highlights: [
        'Built 3 automated forensic tools to streamline digital-evidence workflows under direct supervisor guidance.',
        'Developed a deep learning-based Network Intrusion Detection System to flag port scans, DoS attacks, and brute-force attempts in live traffic.',
        'Built a CNN-based synthetic media classifier to support active fraud investigations.',
        'Presented technical findings to a panel of 10+ senior law-enforcement officers; earned the Content Creator Award for the presentation of security tooling.'
      ],
      tech: ['Python', 'Digital Evidence Forensics', 'Chain of Custody Workflows', 'Synthetic Media Classifier', 'Security Tooling'],
      impact: 'Directly supported law enforcement officers in accelerating digital evidence examination and synthetic media fraud inquiries.'
    }
  };

  projectTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.project;
      const d = projectData[key];
      if (!d) return;
      const trigger = btn;

      projectModalBody.innerHTML = `
        <span class="badge badge-ai" style="margin-bottom: 0.75rem;">${escapeHtml(d.badge)}</span>
        <h3 id="projectModalTitle" style="font-size: 1.6rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-main); line-height: 1.3;">${escapeHtml(d.title)}</h3>
        <p style="font-size: 0.98rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">${escapeHtml(d.overview)}</p>

        <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.75rem;">Key Architecture & Implementation Details</h4>
        <ul style="padding-left: 1.25rem; margin-bottom: 1.5rem; color: var(--text-secondary); line-height: 1.7;">
          ${d.highlights.map(h => `<li style="margin-bottom: 0.45rem;">${escapeHtml(h)}</li>`).join('')}
        </ul>

        <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem;">Real-World Impact</div>
          <div style="font-size: 0.92rem; font-weight: 600; color: var(--text-main);">${escapeHtml(d.impact)}</div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
          ${d.tech.map(t => `<span class="skill-tag">${escapeHtml(t)}</span>`).join('')}
        </div>

        ${d.repoNote ? `
        <div class="repo-note" style="display: flex; gap: 0.75rem; align-items: flex-start; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-left: 3px solid var(--accent-cyber); padding: 1rem 1.15rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyber)" stroke-width="2" aria-hidden="true" focusable="false" style="flex-shrink: 0; margin-top: 0.15rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
            <strong style="color: var(--text-main);">What's in the linked repository:</strong>
            ${escapeHtml(d.repoNote)}
          </p>
        </div>` : ''}

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="${escapeHtml(d.repo)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">${escapeHtml(d.repoLabel || 'View on GitHub')}</a>
          <button type="button" class="btn btn-primary btn-sm" id="modalDismissBtn">Close</button>
        </div>
      `;

      openModal(projectModal, trigger);

      const dismissBtn = document.getElementById('modalDismissBtn');
      if (dismissBtn) dismissBtn.addEventListener('click', closeModals);
    });
  });

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeModals);

  // =========================================================================
  // 7. RESUME MODAL
  // =========================================================================
  const openResumeBtn = document.getElementById('openResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  // -------------------------------------------------------------------------
  // 7b. MODAL DIALOG BEHAVIOUR (shared by both modals)
  //     Previously a dialog opened with focus left on the trigger, so keyboard
  //     users tabbed through the page *behind* the overlay, and focus was never
  //     restored on close.
  // -------------------------------------------------------------------------
  let lastFocusedElement = null;

  const FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  // Filtered by attribute rather than offsetParent: offsetParent is null for
  // position:fixed subtrees and for any element when the document isn't laid
  // out yet, which would silently empty the focus trap.
  function getFocusable(container) {
    return Array.prototype.filter.call(
      container.querySelectorAll(FOCUSABLE),
      el => !el.hasAttribute('hidden')
        && !el.closest('[hidden]')
        && el.getAttribute('aria-hidden') !== 'true'
    );
  }

  function openModal(modal, trigger) {
    if (!modal) return;
    lastFocusedElement = trigger || document.activeElement;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const content = modal.querySelector('.modal-content');
    const target = modal.querySelector('.modal-close-btn')
      || (content && getFocusable(content)[0])
      || content;
    if (target) target.focus({ preventScroll: true });
  }

  function closeModals() {
    const wasOpen = [projectModal, resumeModal].some(m => m && m.classList.contains('active'));
    if (projectModal) projectModal.classList.remove('active');
    if (resumeModal) resumeModal.classList.remove('active');
    document.body.style.overflow = '';
    closeMobileNav();

    // Return focus to whatever opened the dialog
    if (wasOpen && lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus({ preventScroll: true });
    }
    lastFocusedElement = null;
  }

  function activeModal() {
    return [projectModal, resumeModal].find(m => m && m.classList.contains('active')) || null;
  }

  if (openResumeBtn) {
    openResumeBtn.addEventListener('click', () => openModal(resumeModal, openResumeBtn));
  }

  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeModals);

  // -------------------------------------------------------------------------
  // 7c. PRINT / SAVE PDF
  //     window.print() used to fire with no print-mode class, and the print
  //     stylesheet hid everything unconditionally — Ctrl+P produced a blank
  //     page. .print-mode scopes the visibility rules to the resume sheet only.
  // -------------------------------------------------------------------------
  function printResume() {
    const cleanup = () => {
      document.body.classList.remove('print-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    document.body.classList.add('print-mode');
    window.addEventListener('afterprint', cleanup);

    try {
      window.print();
    } finally {
      // Safari fires afterprint reliably; this covers engines that don't.
      setTimeout(cleanup, 1000);
    }
  }

  if (printResumeBtn) printResumeBtn.addEventListener('click', printResume);

  [projectModal, resumeModal].forEach(m => {
    if (m) m.addEventListener('click', e => { if (e.target === m) closeModals(); });
  });

  // -------------------------------------------------------------------------
  // 7d. KEYBOARD HANDLING — Escape to close, Tab cycles within the dialog
  // -------------------------------------------------------------------------
  document.addEventListener('keydown', e => {
    const modal = activeModal();

    if (e.key === 'Escape') {
      if (modal) closeModals();
      else closeMobileNav();
      return;
    }

    if (e.key !== 'Tab' || !modal) return;

    const content = modal.querySelector('.modal-content');
    if (!content) return;

    const focusables = getFocusable(content);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (!content.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  });

  // =========================================================================
  // 8. CLIPBOARD COPY UTILITIES
  // =========================================================================
  function copyTextToClipboard(text, btnElement, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        const orig = btnElement.textContent;
        btnElement.textContent = 'Copied!';
        showToast(successMsg);
        setTimeout(() => { btnElement.textContent = orig; }, 2000);
      });
    } else {
      const tmp = document.createElement('textarea');
      tmp.value = text;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
      const orig = btnElement.textContent;
      btnElement.textContent = 'Copied!';
      showToast(successMsg);
      setTimeout(() => { btnElement.textContent = orig; }, 2000);
    }
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyTextToClipboard('abhijha.edu@gmail.com', copyEmailBtn, 'Email copied to clipboard!');
    });
  }

  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      copyTextToClipboard('+918218778168', copyPhoneBtn, 'Phone number copied to clipboard!');
    });
  }

  // =========================================================================
  // 9. LIVE CLOCK (IST)
  // =========================================================================
  const liveTimeClock = document.getElementById('liveTimeClock');
  const currentYearSpan = document.getElementById('currentYear');

  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

  function updateClock() {
    if (!liveTimeClock) return;
    const now = new Date();
    const ist = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);
    liveTimeClock.textContent = `${ist} IST // India`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // =========================================================================
  // 10. CONTACT FORM
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  // -------------------------------------------------------------------------
  // 10b. CONTACT FORM — real submission
  //
  // Previously this called preventDefault(), waited 1.2s, and toasted
  // "Message received!" without sending anything anywhere.
  //
  // It now POSTs to FormSubmit, which needs no account: the first submission
  // emails a one-time activation link to the address below. Until that link is
  // clicked, FormSubmit accepts the request but does not forward it, and says
  // so in its JSON response — we surface that honestly rather than claiming the
  // message was delivered.
  //
  // index.html's <form action=""> points at the non-AJAX endpoint so the no-JS
  // path still works; fetch() uses the /ajax/ endpoint to get JSON back.
  // -------------------------------------------------------------------------
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/abhijha.edu@gmail.com';
  const FALLBACK_EMAIL = 'abhijha.edu@gmail.com';

  const formStatus = document.getElementById('contactFormStatus');

  // state: 'success' | 'error' | 'info' (info = a neutral next step, e.g. mailto)
  function setFormStatus(message, state) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.remove('is-error', 'is-success', 'is-info');
    if (message) {
      formStatus.classList.add('is-visible');
      formStatus.classList.add(`is-${state === 'success' ? 'success' : state === 'error' ? 'error' : 'info'}`);
    } else {
      formStatus.classList.remove('is-visible');
    }
  }

  function mailtoFallback() {
    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const subject = document.getElementById('contactSubject')?.value.trim()
      || 'Website enquiry from your portfolio';
    const message = document.getElementById('contactMessage')?.value.trim() || '';

    const body = [
      message,
      '',
      `— ${name}`,
      email ? `Reply to: ${email}` : ''
    ].filter(Boolean).join('\n');

    const href = `mailto:${FALLBACK_EMAIL}`
      + `?subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(body)}`;

    // Anchor click rather than assigning location.href: it hands off to the OS
    // mail client without touching the page's history entry.
    const link = document.createElement('a');
    link.href = href;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setFormStatus(`Opening your email client… (or write to ${FALLBACK_EMAIL})`, 'info');
    showToast('Opening your email client — or write to abhijha.edu@gmail.com');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      setFormStatus('');

      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const msg = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !msg) {
        setFormStatus('Please fill in your name, email, and message.', 'error');
        showToast('Please fill in your name, email, and message.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormStatus('Please enter a valid email address.', 'error');
        showToast('Please enter a valid email address.');
        return;
      }

      // Honeypot tripped — silently drop. Do not tell the bot why.
      const honeypot = document.getElementById('contactCompanyWebsite');
      if (honeypot && honeypot.value) return;

      const orig = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin" aria-hidden="true" focusable="false">
            <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
          <span>Sending…</span>`;
      }

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        });

        // FormSubmit answers 200 even when the form is not yet activated, so the
        // response body is the source of truth — not just the status code.
        let payload = null;
        try {
          payload = await response.json();
        } catch (parseErr) {
          // Non-JSON reply; fall back to judging by status code alone
        }

        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        if (payload && payload.success !== undefined && String(payload.success) !== 'true') {
          // Typically the pending-activation case
          setFormStatus(
            'The form still needs its one-time confirmation before it can deliver. '
            + `Please email ${FALLBACK_EMAIL} directly and I'll reply right away.`,
            'info'
          );
          showToast('Form is awaiting one-time confirmation — email reaches me instantly');
          return;
        }

        contactForm.reset();
        setFormStatus(`Thanks, ${name} — your message is on its way. I'll reply soon.`, 'success');
        showToast(`Message sent, ${name}! I'll get back to you soon.`);
      } catch (err) {
        // Don't leave the visitor with a dead end
        setFormStatus(
          'Something went wrong sending that. Opening your email client as a backup…',
          'error'
        );
        mailtoFallback();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = orig;
        }
      }
    });
  }

  // =========================================================================
  // 11. TOAST UTILITY
  // =========================================================================
  const toastEl = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimer;

  function showToast(msg) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])
    );
  }
});
