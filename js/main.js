/* ============================================================
   TREE B GONE — Main JS
   ============================================================ */

/* ─── NAV SCROLL ─────────────────────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav && nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── ACTIVE LINK ────────────────────────────────────────────── */
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(a => {
  const href = a.getAttribute('href') || '';
  const match = href === page || (page === '' && href === 'index.html') ||
                (page === 'index.html' && href === 'index.html');
  if (match) a.classList.add('active');
});

/* ─── HAMBURGER ──────────────────────────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const drawer    = document.querySelector('.nav-drawer');
if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
  });
  // Close on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
    });
  });
}


/* ─── SCROLL REVEAL ──────────────────────────────────────────── */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ─── COUNTER ANIMATION ──────────────────────────────────────── */
(function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.counted) return;
      e.target.dataset.counted = '1';
      const end    = parseInt(e.target.dataset.count, 10);
      const suffix = e.target.dataset.suffix || '';
      const t0     = performance.now();
      const dur    = 1800;
      function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        const v = Math.floor((1 - Math.pow(1 - p, 3)) * end);
        e.target.textContent = v + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();

/* ─── FAQ ACCORDION ──────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── ORBITAL PROCESS TIMELINE ──────────────────────────────── */
(function initOrbital() {
  const arena = document.getElementById('orbitalArena');
  if (!arena) return;

  const STEPS = [
    { step:'Step 01', title:'Discovery',  desc:'We learn about your business, your goals, and what you need your website to do. Usually a quick 15-minute conversation — then we take it from there.', energy:100 },
    { step:'Step 02', title:'Design',     desc:'We build a custom mockup tailored to your brand — no templates, no stock layouts. You see exactly what your site will look like before we write a line of code.', energy:90 },
    { step:'Step 03', title:'Review',     desc:'You give us feedback and we refine until it\'s exactly right. Unlimited revisions at this stage — we don\'t move forward until you love it.',                    energy:80 },
    { step:'Step 04', title:'Build',      desc:'Once you approve the design, we code it up — fast, clean, mobile-ready, and SEO-optimized from day one. No bloated page builders.',                            energy:95 },
    { step:'Step 05', title:'Launch',     desc:'Your site goes live. Domain connected, hosting configured, SSL enabled, sitemap submitted to Google. Usually 48 hours after design approval.',                  energy:100 },
    { step:'Step 06', title:'Support',    desc:'We don\'t disappear after launch. Updates, fixes, new sections, performance monitoring — it\'s all included in your $20/month. Forever.',                      energy:85 },
  ];

  let rotAngle = 0;
  let autoRotate = true;
  let activeIdx = 0;
  let resumeTimer = null;

  const getRadius = () => window.innerWidth <= 560 ? 118 : (window.innerWidth <= 1000 ? 155 : 190);

  // Build node elements
  const nodeEls = STEPS.map((s, i) => {
    const el = document.createElement('div');
    el.className = 'orbital-node';
    el.innerHTML = `<div class="orbital-node-dot">0${i + 1}</div><span class="orbital-node-label">${s.title}</span>`;
    el.addEventListener('click', e => { e.stopPropagation(); setActive(i); });
    arena.appendChild(el);
    return el;
  });

  function updatePanel(idx) {
    const s = STEPS[idx];
    document.getElementById('opStep').textContent  = s.step;
    document.getElementById('opTitle').textContent = s.title;
    document.getElementById('opDesc').textContent  = s.desc;
    document.getElementById('opEnergy').textContent = s.energy + '%';
    document.getElementById('opFill').style.width   = s.energy + '%';
  }

  function setActive(idx) {
    activeIdx = idx;
    autoRotate = false;
    clearTimeout(resumeTimer);
    nodeEls.forEach((el, i) => el.classList.toggle('active', i === idx));
    updatePanel(idx);
    resumeTimer = setTimeout(() => { autoRotate = true; }, 8000);
  }

  document.getElementById('opPrev').addEventListener('click', () => setActive((activeIdx - 1 + STEPS.length) % STEPS.length));
  document.getElementById('opNext').addEventListener('click', () => setActive((activeIdx + 1) % STEPS.length));

  arena.addEventListener('click', () => {
    autoRotate = true;
    clearTimeout(resumeTimer);
    nodeEls.forEach(el => el.classList.remove('active'));
  });

  (function loop() {
    if (autoRotate) rotAngle = (rotAngle + 0.28) % 360;
    const r = getRadius();
    nodeEls.forEach((el, i) => {
      const theta = (i / STEPS.length) * 2 * Math.PI + (rotAngle * Math.PI / 180);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      const depth = (Math.sin(theta) + 1) / 2;
      el.style.zIndex = Math.round(10 + 90 * depth);
      if (!el.classList.contains('active')) el.style.opacity = 0.38 + 0.62 * depth;
      else el.style.opacity = 1;
      // Label: lerp a single translateX so the side-switch is a smooth glide
      const label = el.querySelector('.orbital-node-label');
      const degNorm = ((theta * 180 / Math.PI) % 360 + 360) % 360;
      const onRight = degNorm < 90 || degNorm > 270;
      if (el._labelX === undefined) {
        el._labelW  = label.offsetWidth || 70;
        el._labelX  = onRight ? 28 : -(el._labelW + 28);
      }
      const targetX   = onRight ? 28 : -(el._labelW + 28);
      el._labelX     += (targetX - el._labelX) * 0.18;
      label.style.left      = '0';
      label.style.right     = 'auto';
      label.style.transform = `translateX(${el._labelX}px) translateY(-50%)`;
      label.style.textAlign = onRight ? 'left' : 'right';
      label.style.opacity   = '1';
    });
    requestAnimationFrame(loop);
  })();

  updatePanel(0);
  nodeEls[0].classList.add('active');
})();

/* ─── PRICING TOGGLE ─────────────────────────────────────────── */
(function initPricingToggle() {
  const tabs = document.querySelectorAll('.pricing-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      document.querySelectorAll('.pricing-amount').forEach(el => {
        const val = el.dataset[target];
        if (val) el.textContent = '$' + parseInt(val, 10).toLocaleString('en-CA');
      });
      document.querySelectorAll('.pricing-period').forEach(el => {
        const period = el.dataset[target + 'Period'];
        if (period) el.textContent = period;
      });
    });
  });
})();

/* ─── PLAN BUILDER CALCULATOR ────────────────────────────────── */
(function initPlanBuilder() {
  const planTypeEl  = document.getElementById('planType');
  const billingEl   = document.getElementById('billingPeriod');
  const totalEl     = document.getElementById('calcTotal');
  const breakdownEl = document.getElementById('calcBreakdown');

  if (!planTypeEl || !totalEl) return;

  const PLANS = {
    starter: { name: 'Starter', monthly: 20,  annual: 199 },
    pro:     { name: 'Pro',     monthly: 35,  annual: 349 },
    store:   { name: 'Store',   monthly: 60,  annual: 599 },
  };

  function fmt(n) {
    return '$' + n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function update() {
    const plan     = PLANS[planTypeEl.value];
    const isAnnual = billingEl.value === 'annual';
    if (!plan) return;

    const total   = isAnnual ? plan.annual : plan.monthly;
    const period  = isAnnual ? '/ year' : '/ month';
    const savings = isAnnual ? (plan.monthly * 12 - plan.annual) : 0;

    totalEl.textContent = fmt(total) + ' ' + period;

    let html = `<div class="calc-breakdown-item"><span>${plan.name} Plan — ${isAnnual ? 'Annual' : 'Monthly'}</span><span>${fmt(total)}</span></div>`;
    if (isAnnual && savings > 0) {
      html += `<div class="calc-breakdown-item"><span>Savings vs monthly billing</span><span style="color:var(--lime)">-${fmt(savings)}</span></div>`;
    }
    breakdownEl.innerHTML = html;
  }

  [planTypeEl, billingEl].forEach(el => el.addEventListener('change', update));
  update();
})();
