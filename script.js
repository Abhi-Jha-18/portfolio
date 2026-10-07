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

  const savedTheme = localStorage.getItem('abhi-theme') || 'light';
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
    localStorage.setItem('abhi-theme', theme);
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

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 3. SCROLL SPY
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }, { passive: true });

  // =========================================================================
  // 4. SKILLS MATRIX FILTER
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const matrixItems = document.querySelectorAll('.matrix-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.category;
      matrixItems.forEach(item => {
        const show = category === 'all' || item.dataset.category === category;
        item.style.display = show ? 'block' : 'none';
        if (show) {
          item.style.opacity = '0';
          requestAnimationFrame(() => { item.style.opacity = '1'; });
        }
      });
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
  experience — Police Cyber Cell & Education details
  projects   — Deep learning & cybersecurity projects
  skills     — Technical skills breakdown
  certs      — Certifications, programs & leadership
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
LinkedIn: linkedin.com/in/abhi-jha-18 (@abhi-jha-18)
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

    const responseText = commands[cmd] ||
      `Command not found: "${escapeHtml(rawCmd)}". Type "help" to see available commands.`;

    const outputBlock = document.createElement('div');
    outputBlock.className = 'terminal-output';
    outputBlock.innerHTML = responseText.replace(/\n/g, '<br>');
    terminalOutput.appendChild(outputBlock);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="https://github.com/Abhi-Jha-18" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">View on GitHub</a>
          <button class="btn btn-primary btn-sm" id="modalDismissBtn">Close</button>
        </div>
      `;

      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';

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

  if (openResumeBtn) openResumeBtn.addEventListener('click', () => {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeModals);
  if (printResumeBtn) printResumeBtn.addEventListener('click', () => window.print());

  [projectModal, resumeModal].forEach(m => {
    if (m) m.addEventListener('click', e => { if (e.target === m) closeModals(); });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

  function closeModals() {
    if (projectModal) projectModal.classList.remove('active');
    if (resumeModal) resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

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
  // 9. CONTACT FORM
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const msg = document.getElementById('contactMessage')?.value.trim();

      if (!name || !email || !msg) {
        showToast('Please fill in your name, email, and message.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        const orig = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
          <span>Sending...</span>`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = orig;
          contactForm.reset();
          showToast(`Message received, ${name}! I'll get back to you soon.`);
        }, 1200);
      }
    });
  }

  // =========================================================================
  // 10. TOAST UTILITY
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
