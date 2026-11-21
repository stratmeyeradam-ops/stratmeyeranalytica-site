/* Stratmeyer Analytica — Core Interactive & Movement Engine */

(function () {
  'use strict';

  /* ── Active nav link ── */
  function setActiveNav() {
    var path = location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.primary-nav a, .mobile-nav a').forEach(function (a) {
      var href = a.getAttribute('href').replace(/\/$/, '') || '/';
      if (href !== '/' && path.startsWith(href)) { a.classList.add('active'); }
      else if (href === '/' && path === '/') { a.classList.add('active'); }
    });
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    var btn = document.getElementById('menu-btn');
    var nav = document.getElementById('mobile-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var iconMenu = btn.querySelector('.icon-menu');
      var iconClose = btn.querySelector('.icon-close');
      if (iconMenu) iconMenu.style.display = open ? 'none' : 'block';
      if (iconClose) iconClose.style.display = open ? 'block' : 'none';
    });
  }

  /* ── Search with Updated Practice & Careers Index ── */
  var searchIndex = [
    { title: 'AI Development', href: '/practice/ai-development', blurb: 'Autonomous agents, local LLM pipelines, observable compute clusters' },
    { title: 'Personal Consulting', href: '/practice/personal-consulting', blurb: 'Confidential 1-on-1 strategic advisory with Adam Ian Stratmeyer, J.D.' },
    { title: 'IRB Review', href: '/practice/irb-review', blurb: 'Institutional Review Board protocol auditing, 45 CFR 46, Common Rule compliance' },
    { title: 'AI Ethics', href: '/practice/ai-ethics', blurb: 'Algorithmic governance, observable function metrics, helpful-harmless tradeoffs' },
    { title: 'We\'re Hiring (Careers)', href: '/careers', blurb: 'Open roles in AI systems engineering, IRB compliance, and AI safety' },
    { title: 'Director: Adam Ian Stratmeyer, J.D.', href: '/about', blurb: 'Legal-technical researcher, 300+ IRB reviews, founding director' },
    { title: 'Personal Site (adamstratmeyer.com)', href: 'https://adamstratmeyer.com', blurb: 'Adam Stratmeyer personal essays, publications, and archive' },
    { title: 'Practice Overview', href: '/practice', blurb: 'Four core consulting and auditing pillars' },
    { title: 'Regulatory Compliance & Auditing', href: '/practice/compliance', blurb: 'HIPAA, FERPA, and institutional protocol reviews' },
    { title: 'System Architecture & Automation', href: '/practice/architecture', blurb: 'Localized high-redundancy processing systems' },
    { title: 'Behavioral Strategy', href: '/practice/behavioral', blurb: 'PRTF / ARU high-acuity residential consulting' },
    { title: 'Research Frameworks', href: '/research', blurb: 'Foundational open working papers' },
    { title: 'Observable Function in Processing Entities', href: '/research/observable-function', blurb: 'Empirical AI behavior mapping' },
    { title: 'Helpful-Harmless Paradox', href: '/research/helpful-harmless', blurb: 'Structural contradiction in model safety' },
    { title: 'Kindness Protocol', href: '/research/kindness-protocol', blurb: 'Interaction under computational uncertainty' },
    { title: 'The Knowledge Gradient', href: '/research/knowledge-gradient', blurb: 'Informational incompleteness framework' },
    { title: 'The In-Between', href: '/research/in-between', blurb: 'Agency as a temporal and systemic event' },
    { title: 'Anthropomorphization', href: '/research/anthropomorphization', blurb: 'Cognitive tools and institutional transparency' },
    { title: 'Chronicle', href: '/chronicle', blurb: 'Field essays, technical notes, and observations' },
    { title: 'Publications', href: '/publications', blurb: 'Books, monographs, and working papers' },
    { title: 'Engagement Portal', href: '/engagement', blurb: 'Written intake and conflict screening' },
    { title: 'Self-assessment Index', href: '/assessment', blurb: 'Interactive regulatory compliance readiness index' },
  ];

  function initSearch() {
    var toggleBtn = document.getElementById('search-btn');
    var overlay = document.getElementById('search-overlay');
    var input = document.getElementById('search-input');
    var resultsList = document.getElementById('search-results');
    if (!toggleBtn || !overlay) return;

    function renderResults(q) {
      var needle = q.trim().toLowerCase();
      var items = needle
        ? searchIndex.filter(function (i) { return i.title.toLowerCase().includes(needle) || i.blurb.toLowerCase().includes(needle); })
        : searchIndex.slice(0, 8);
      if (items.length === 0) {
        resultsList.innerHTML = '<li><p class="search-empty">No matching pages found.</p></li>';
        return;
      }
      resultsList.innerHTML = items.map(function (i) {
        var isExt = i.href.startsWith('http');
        var targetAttr = isExt ? ' target="_blank" rel="noreferrer"' : '';
        return '<li><a href="' + i.href + '"' + targetAttr + '><div class="search-result-title">' + i.title + (isExt ? ' ↗' : '') + '</div><div class="search-result-blurb">' + i.blurb + '</div></a></li>';
      }).join('');
    }

    toggleBtn.addEventListener('click', function () {
      overlay.classList.add('open');
      setTimeout(function () { if (input) input.focus(); }, 50);
      renderResults('');
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.remove('open');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') overlay.classList.remove('open');
    });

    if (input) {
      input.addEventListener('input', function () { renderResults(input.value); });
    }
  }

  /* ── Interactive Movement Effect 1: Neural Constellation Canvas ── */
  function initHeroCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var ctx = canvas.getContext('2d');
    var width, height;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var particleCount = 45;
    var connectionDist = 120;
    var mouse = { x: -1000, y: -1000, radius: 140 };
    var isRunning = true;

    function resize() {
      var parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);

      particleCount = Math.floor(Math.min(width * height / 18000, 55));
      if (particleCount < 20) particleCount = 20;

      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.5 + 1.2,
          baseAlpha: Math.random() * 0.35 + 0.25
        });
      }
    }

    resize();
    window.addEventListener('resize', resize);

    var heroSec = document.querySelector('.hero');
    if (heroSec) {
      heroSec.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroSec.addEventListener('mouseleave', function () {
        mouse.x = -1000;
        mouse.y = -1000;
      });
    }

    // Only render when in viewport to conserve GPU & CPU
    if ('IntersectionObserver' in window && heroSec) {
      var observer = new IntersectionObserver(function (entries) {
        isRunning = entries[0].isIntersecting;
        if (isRunning) requestAnimationFrame(draw);
      }, { threshold: 0.05 });
      observer.observe(heroSec);
    }

    function draw() {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (var i = 0; i < particles.length; i++) {
        var p1 = particles[i];

        // Update position
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce from boundaries
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse interaction
        var dxMouse = mouse.x - p1.x;
        var dyMouse = mouse.y - p1.y;
        var distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouse.radius) {
          var force = (mouse.radius - distMouse) / mouse.radius;
          var angle = Math.atan2(dyMouse, dxMouse);
          p1.x -= Math.cos(angle) * force * 1.5;
          p1.y -= Math.sin(angle) * force * 1.5;

          // Mouse link
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(235, 230, 220, ' + (force * 0.35) + ')';
          ctx.lineWidth = 0.8;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Connect to neighbors
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p1.x - p2.x;
          var dy = p1.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            var alpha = (1 - dist / connectionDist) * 0.28;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(235, 225, 210, ' + alpha + ')';
            ctx.lineWidth = 0.7;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 240, 230, ' + p1.baseAlpha + ')';
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /* ── Interactive Movement Effect 2: Scroll Reveals ── */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-fade');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ── Interactive Movement Effect 3: 3D Perspective Tilt on Hover ── */
  function initTiltCards() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    var cards = document.querySelectorAll('.tilt-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -5;
        var rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  /* ── Interactive Movement Effect 4: Practice Matrix Capability Tabs ── */
  function initPracticeMatrix() {
    var tabs = document.querySelectorAll('.matrix-tab-btn');
    var panels = document.querySelectorAll('.matrix-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId = tab.getAttribute('data-target');

        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });

        tab.classList.add('active');
        var targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  /* ── Interactive Movement Effect 5: Live Real-Time Audit Console ── */
  function initAuditFeed() {
    var pre = document.getElementById('audit-feed-pre');
    if (!pre) return;

    var logPool = [
      { text: 'VERIFY  IRB Protocol #491-B  ·  45 CFR 46.111 criteria met', type: 'highlight' },
      { text: 'AUDIT   Common Rule Expedited review determination verified', type: 'highlight' },
      { text: 'SCAN    Model Refusal Boundary  ·  harmlessness delta: 0.041', type: 'warn' },
      { text: 'EVAL    Autonomous Agent Harness  ·  task decomposition pass 98.2%', type: 'highlight' },
      { text: 'TELEMET Local inference cluster  ·  deterministic seed 42  ·  0 dropouts', type: '' },
      { text: 'CHECK   Informed Consent architecture  ·  no therapeutic misconception', type: 'highlight' },
      { text: 'OBSERVE Entity behavior vs policy statement  ·  drift: 0.012 (contained)', type: '' },
      { text: 'AUDIT   HIPAA BAA vendor checklist  ·  4 endpoints logged to disk', type: '' },
      { text: 'FLAG    Unregistered proxy agent loop  ·  isolated for inspection', type: 'warn' },
      { text: 'PASS    Belmont Report ethics matrix  ·  Beneficence & Justice validated', type: 'highlight' },
      { text: 'SYNC    Observable Compute audit daemon 4.3.0  ·  0 faults recorded', type: '' },
      { text: 'MONITOR High-acuity behavioral safety protocol  ·  PRTF compliance OK', type: 'highlight' },
      { text: 'EVAL    Knowledge gradient entropy  ·  gradient stabilized at 1.48 bits', type: '' },
      { text: 'EXEC    Zero-telemetry runtime active  ·  client private enclave verified', type: 'highlight' }
    ];

    var initialLines = [
      'INIT  Stratmeyer Analytica Systems Integrity Daemon v4.3.0',
      'LOAD  Scope: AI Systems, Regulatory Compliance, IRB Protocol Review',
      'STATUS Director: Adam Ian Stratmeyer, J.D. · Rapid City, SD',
      'NET   adamstratmeyer.com connected · Sovereign local processing',
      '────── Live Verification Stream ──────────────────────────'
    ];

    pre.textContent = initialLines.join("\n") + "\n";

    var isPaused = false;
    var speedMs = 2200;
    var poolIndex = 0;

    function appendLine() {
      if (isPaused) return;

      var entry = logPool[poolIndex % logPool.length];
      poolIndex++;

      var now = new Date();
      var timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      var line = '[' + timeStr + '] ' + entry.text;

      var lines = pre.textContent.trim().split("\n");
      if (lines.length > 22) {
        lines = lines.slice(lines.length - 20);
      }
      lines.push(line);
      pre.textContent = lines.join("\n");
      pre.scrollTop = pre.scrollHeight;
    }

    var intervalId = setInterval(appendLine, speedMs);

    var pauseBtn = document.getElementById('console-pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
      });
    }

    var runBtn = document.getElementById('console-run-btn');
    if (runBtn) {
      runBtn.addEventListener('click', function () {
        appendLine();
      });
    }
  }

  /* ── Inquiry form submission ── */
  function initInquiryForm() {
    var form = document.getElementById('inquiry-form');
    var successBox = document.getElementById('form-success');
    var errorBox = document.getElementById('form-error');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorBox) { errorBox.style.display = 'none'; errorBox.textContent = ''; }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting...';
      }

      var formData = new FormData(form);

      fetch('/contact.php', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data && data.success) {
          form.style.display = 'none';
          if (successBox) successBox.style.display = 'block';
        } else {
          throw new Error((data && data.error) ? data.error : 'Transmission failed.');
        }
      })
      .catch(function () {
        // Fallback: Mailto trigger
        var name = form.querySelector('[name="name"]') ? form.querySelector('[name="name"]').value : '';
        var scope = form.querySelector('[name="scope"]') ? form.querySelector('[name="scope"]').value : '';
        var note = form.querySelector('[name="note"]') ? form.querySelector('[name="note"]').value : '';
        var subject = encodeURIComponent('Consulting Inquiry: ' + scope + ' — ' + name);
        var body = encodeURIComponent(note + "\n\nDirect Inquiry from stratmeyeranalytica.org");
        window.location.href = 'mailto:adamstratmeyer@gmail.com?subject=' + subject + '&body=' + body;

        form.style.display = 'none';
        if (successBox) {
          successBox.innerHTML = '<h3>Inquiry Redirected to Email</h3><p>Your client email client has opened with your inquiry pre-filled to adamstratmeyer@gmail.com and inquiries@stratmeyeranalytica.org.</p>';
          successBox.style.display = 'block';
        }
      });
    });
  }

  /* ── Compliance self-assessment tool ── */
  function initAssessment() {
    var root = document.getElementById('assessment-app');
    if (!root) return;

    var scopes = [
      { id: 'irb', label: 'Institutional Review Board / Human Subjects', dek: 'Protocols, vulnerable populations, consent forms, 45 CFR 46' },
      { id: 'ai', label: 'AI Systems & Autonomous Agents', dek: 'Local pipelines, observable behavior, prompt injection, model refusal' },
      { id: 'hipaa', label: 'HIPAA & Healthcare Data Privacy', dek: 'BAA coverage, clinical fieldwork, audit logs, minimum necessary standard' },
      { id: 'ferpa', label: 'FERPA & Higher Education Data', dek: 'Student records, directory disclosures, research exceptions' },
    ];

    var questions = {
      irb: [
        { q: 'When was your IRB protocol registry last audited against actual ongoing research?', options: [{ t: 'Within the last six months', s: 3 }, { t: 'Within the last two years', s: 2 }, { t: 'Never or unknown', s: 0 }] },
        { q: 'How are consent forms verified for therapeutic misconception or coercive framing?', options: [{ t: 'Independent checklist review by compliance officer', s: 3 }, { t: 'Investigator self-attestation', s: 1 }, { t: 'Standard template without custom review', s: 0 }] },
        { q: 'What happens when a research protocol undergoes substantial modification in the field?', options: [{ t: 'Formal amendment required before data collection proceeds', s: 3 }, { t: 'Reported during annual continuing review', s: 1 }, { t: 'Handled informally by lab leads', s: 0 }] },
        { q: 'Are data sharing agreements in place for multi-site or secondary data analyses?', options: [{ t: 'Written DUAs signed by authorized institutional officials', s: 3 }, { t: 'Informal emails between co-investigators', s: 1 }, { t: 'No written agreements', s: 0 }] }
      ],
      ai: [
        { q: 'Where are automated system decision outputs logged and versioned?', options: [{ t: 'Immutable local append-only log with deterministic seed tracking', s: 3 }, { t: 'Cloud SaaS dashboards with ephemeral retention', s: 1 }, { t: 'Not consistently recorded', s: 0 }] },
        { q: 'How is the Helpful-Harmless trade-off calibrated for autonomous tool execution?', options: [{ t: 'Empirically mapped against observable failure benchmarks', s: 3 }, { t: 'Default system prompt instructions only', s: 1 }, { t: 'Uncalibrated', s: 0 }] },
        { q: 'Is there a kill-switch and rollback mechanism for agentic loops?', options: [{ t: 'Hardware or deterministic kernel-level break protocol', s: 3 }, { t: 'Manual process termination', s: 1 }, { t: 'No formal interlock', s: 0 }] },
        { q: 'Do third-party LLM providers retain telemetry or training rights on your sensitive data?', options: [{ t: 'Zero-data-retention agreements or sovereign local compute', s: 3 }, { t: 'Standard consumer/pro terms', s: 0 }] }
      ],
      hipaa: [
        { q: 'Are current Business Associate Agreements (BAAs) in place for every pipeline tool?', options: [{ t: '100% verified with documented annual review', s: 3 }, { t: 'Some vendors under BAA', s: 1 }, { t: 'Uncertain coverage', s: 0 }] },
        { q: 'How is the Minimum Necessary Rule enforced across internal staff access?', options: [{ t: 'Role-based access control with audited privilege escalation', s: 3 }, { t: 'Broad department-level access', s: 1 }, { t: 'Open internal sharing', s: 0 }] },
        { q: 'How quickly could your team reconstruct an audit trail for a specific PHI disclosure?', options: [{ t: 'Under 2 hours via centralized logs', s: 3 }, { t: 'Under 72 hours with manual forensics', s: 1 }, { t: 'Unable to reliably reconstruct', s: 0 }] },
        { q: 'Are physical and mobile endpoints in high-acuity environments encrypted at rest?', options: [{ t: 'Hardware-enforced encryption across all devices', s: 3 }, { t: 'Partial device coverage', s: 1 }, { t: 'Unmanaged devices permitted', s: 0 }] }
      ],
      ferpa: [
        { q: 'Are research exemptions under FERPA formally documented prior to data release?', options: [{ t: 'Written determination by institutional registrar or legal counsel', s: 3 }, { t: 'Faculty member judgment', s: 1 }, { t: 'No formal review', s: 0 }] },
        { q: 'How are vendor cloud systems evaluated for school official exception status?', options: [{ t: 'Contractual direct control provisions in written agreement', s: 3 }, { t: 'Vendor terms of service accepted online', s: 1 }, { t: 'Not reviewed', s: 0 }] },
        { q: 'Is directory information properly defined and opt-out requests systematically honored?', options: [{ t: 'Automated block in student information system', s: 3 }, { t: 'Manual spreadsheet tracking', s: 1 }, { t: 'Opt-outs not tracked', s: 0 }] },
        { q: 'What is the destruction schedule for de-identified educational research records?', options: [{ t: 'Enforced timeline with cryptographic deletion certificates', s: 3 }, { t: 'Archived indefinitely', s: 1 }, { t: 'No retention policy', s: 0 }] }
      ]
    };

    var state = { scope: null, step: 0, answers: [] };

    function rating(score, max) {
      var p = score / max;
      if (p >= 0.85) return { label: 'Contained', cls: 'result-ok', note: 'Rigorous structure in place. A professional audit would focus on drift and edge-case containment rather than structural overhaul.' };
      if (p >= 0.5) return { label: 'Exposed', cls: 'result-exposed', note: 'Sufficient paperwork for casual oversight, but structurally vulnerable to an adverse event, regulatory audit, or whistleblower disclosure.' };
      return { label: 'Open Exposure', cls: 'result-open', note: 'Significant procedural voids. Operating under substantial legal and ethical vulnerability. Immediate remediation recommended.' };
    }

    function render() {
      if (!state.scope) {
        root.innerHTML = [
          '<p class="kicker" style="font-size:.72rem">Step 1 — Select Regulatory Scope</p>',
          '<h2 style="margin-top:.5rem;font-family:var(--font-display);font-size:1.875rem;letter-spacing:-.03em">Compliance & Systems Readiness Index</h2>',
          '<p style="margin-top:.75rem;color:var(--muted);max-width:36rem">Four targeted operational questions. No registration required. Select your operational domain to evaluate procedural integrity.</p>',
          '<div class="scope-options">',
          scopes.map(function (s) {
            return '<button class="scope-btn tilt-card" data-scope="' + s.id + '"><div class="scope-btn-title">' + s.label + '</div><div class="scope-btn-dek">' + s.dek + '</div></button>';
          }).join(''),
          '</div>',
        ].join('');
        root.querySelectorAll('.scope-btn').forEach(function (btn) {
          btn.addEventListener('click', function () { state.scope = btn.dataset.scope; state.step = 0; state.answers = []; render(); });
        });
        return;
      }

      var qs = questions[state.scope];
      var done = state.answers.length === qs.length;

      if (!done) {
        var q = qs[state.step];
        root.innerHTML = [
          '<p class="kicker" style="font-size:.72rem">Question ' + (state.step + 1) + ' of ' + qs.length + '</p>',
          '<h2 style="margin-top:.5rem;font-family:var(--font-display);font-size:1.5rem;letter-spacing:-.03em">' + q.q + '</h2>',
          '<div class="question-options">',
          q.options.map(function (o) {
            return '<button class="option-btn" data-score="' + o.s + '">' + o.t + '</button>';
          }).join(''),
          '</div>',
          '<button class="back-btn">← Start over</button>',
        ].join('');
        root.querySelectorAll('.option-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            state.answers = state.answers.slice(0, state.step).concat([parseInt(btn.dataset.score, 10)]);
            state.step++;
            render();
          });
        });
        root.querySelector('.back-btn').addEventListener('click', function () { state.scope = null; render(); });
        return;
      }

      var score = state.answers.reduce(function (a, b) { return a + b; }, 0);
      var max = qs.length * 3;
      var r = rating(score, max);
      var scopeLabel = scopes.find(function (s) { return s.id === state.scope; }).label;
      var summary = scopeLabel + ' — ' + r.label + '. Score: ' + score + '/' + max + '. ' + r.note;

      root.innerHTML = [
        '<p class="kicker" style="font-size:.72rem">Audit Assessment Result</p>',
        '<h2 class="' + r.cls + '" style="margin-top:.5rem;font-family:var(--font-display);font-size:2.5rem;letter-spacing:-.03em">' + r.label + '</h2>',
        '<p class="result-score">' + score + ' / ' + max + ' Points · ' + scopeLabel + '</p>',
        '<p class="result-note">' + r.note + '</p>',
        '<ul class="result-list">',
        '<li>Catalog every system, protocol, and external vendor touching this scope.</li>',
        '<li>Assign named executive ownership to every unverified procedure.</li>',
        '<li>Schedule a formal written review before external audit exposure triggers.</li>',
        '</ul>',
        '<div class="result-actions">',
        '<button class="copy-result-btn" id="copy-result">Copy findings</button>',
        '<a class="btn btn-primary" href="/engagement">Request an audit</a>',
        '<a class="btn btn-outline" href="mailto:adamstratmeyer@gmail.com?subject=Assessment Review: ' + encodeURIComponent(scopeLabel) + '">Email Director</a>',
        '<button class="btn btn-ghost" id="run-another">Run another scope</button>',
        '</div>',
      ].join('');

      document.getElementById('copy-result').addEventListener('click', function () {
        try {
          navigator.clipboard.writeText(summary);
          this.textContent = 'Copied to clipboard';
        } catch (e) {}
      });
      document.getElementById('run-another').addEventListener('click', function () { state.scope = null; render(); });
    }

    render();
  }

  /* ── DOM Ready Initializer ── */
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    initMobileMenu();
    initSearch();
    initHeroCanvas();
    initScrollReveal();
    initTiltCards();
    initPracticeMatrix();
    initAuditFeed();
    initInquiryForm();
    initAssessment();
  });
})();
