(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---- téma ---- */
  function currentTheme() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  var theme = currentTheme();
  var themeBtn = document.getElementById('themeToggle');
  var iconSun = document.getElementById('iconSun');
  var iconMoon = document.getElementById('iconMoon');
  function renderTheme() {
    if (iconSun) iconSun.style.display = theme === 'dark' ? 'none' : '';
    if (iconMoon) iconMoon.style.display = theme === 'dark' ? '' : 'none';
    if (themeBtn) themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Prepnúť na svetlý režim' : 'Prepnúť na tmavý režim');
  }
  renderTheme();
  if (themeBtn) themeBtn.addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('kc-theme', theme); } catch (e) {}
    renderTheme();
  });

  /* ---- mobilné menu ---- */
  var burger = document.getElementById('burger');
  var navMenu = document.getElementById('navMenu');
  function closeMenu() {
    if (burger) burger.classList.remove('is-active');
    if (navMenu) navMenu.classList.remove('is-active');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && navMenu) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('is-active');
      navMenu.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(navMenu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---- rotujúci text v hero nadpise ---- */
  function startRotator() {
    var el = document.getElementById('rotatorText');
    if (!el || reduce) return;
    var words = ['na mieru.', 'ktoré predávajú.', 'bez šablón.', 'čo ušetria čas.'];
    var w = 0, i = words[0].length, deleting = true, paused = true;
    setTimeout(function () { paused = false; }, 2400);
    setInterval(function () {
      if (paused) return;
      if (deleting) {
        i--;
        if (i <= 0) { i = 0; deleting = false; w = (w + 1) % words.length; }
      } else {
        i++;
        if (i >= words[w].length) {
          i = words[w].length;
          deleting = true;
          paused = true;
          el.textContent = words[w];
          setTimeout(function () { paused = false; }, 2100);
          return;
        }
      }
      el.textContent = words[w].slice(0, i) || '\u00A0';
    }, 62);
  }
  startRotator();

  /* ---- projekty: dáta, vykreslenie, filter ---- */
  var PROJECTS = [
    { id: 1, name: 'Rezervačný systém pre kliniku', cat: 'Webové aplikácie', mark: 'RS',
      desc: 'Online objednávanie pacientov s kalendárom lekárov, SMS pripomienkami a prehľadom vyťaženosti.',
      tech: ['Vue.js', 'Node.js', 'PostgreSQL'], bg: 'linear-gradient(135deg,#6C4CF1,#22B8E8)' },
    { id: 2, name: 'E-shop s ručne robenou keramikou', cat: 'E-shopy', mark: 'KE',
      desc: 'Malý predaj s napojením na platobnú bránu, skladom a automatickým generovaním faktúr.',
      tech: ['Laravel', 'Bulma', 'Stripe'], bg: 'linear-gradient(135deg,#F1734C,#F1B84C)' },
    { id: 3, name: 'Web pre architektonické štúdio', cat: 'Weby', mark: 'AŠ',
      desc: 'Vizuálne silná prezentácia portfólia s plynulými prechodmi a správou projektov cez CMS.',
      tech: ['Vue.js', 'Headless CMS'], bg: 'linear-gradient(135deg,#1F2A44,#4C6CF1)' },
    { id: 4, name: 'Interný dashboard pre logistiku', cat: 'Webové aplikácie', mark: 'LD',
      desc: 'Prehľad zásielok v reálnom čase, roly pre dispečerov a exporty do účtovníctva.',
      tech: ['Vue.js', 'REST API', 'MySQL'], bg: 'linear-gradient(135deg,#0F9B8E,#6C4CF1)' },
    { id: 5, name: 'Landing page pre SaaS startup', cat: 'Weby', mark: 'SL',
      desc: 'Jednostránkový web pre uvedenie produktu s A/B testovaním a napojením na newsletter.',
      tech: ['Bulma', 'JavaScript'], bg: 'linear-gradient(135deg,#8E4CF1,#E84CB0)' },
    { id: 6, name: 'Objednávkový portál pre veľkoobchod', cat: 'E-shopy', mark: 'VO',
      desc: 'B2B portál s individuálnymi cenníkmi, rýchlym objednávaním a históriou nákupov.',
      tech: ['Laravel', 'Vue.js', 'MySQL'], bg: 'linear-gradient(135deg,#2B3A67,#22B8E8)' }
  ];

  var grid = document.getElementById('projectsGrid');
  var filterBar = document.getElementById('filters');
  var currentFilter = 'Všetko';

  function renderProjects() {
    if (!grid) return;
    var list = currentFilter === 'Všetko' ? PROJECTS : PROJECTS.filter(function (p) { return p.cat === currentFilter; });
    grid.innerHTML = list.map(function (p) {
      return '' +
        '<div class="column is-6-tablet is-4-desktop">' +
          '<article class="kc-project">' +
            '<div class="kc-project__thumb" style="background:' + p.bg + '"><span>' + esc(p.mark) + '</span></div>' +
            '<div class="kc-project__body">' +
              '<h3>' + esc(p.name) + '</h3>' +
              '<p>' + esc(p.desc) + '</p>' +
              '<div>' + p.tech.map(function (t) { return '<span class="kc-chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
            '</div>' +
          '</article>' +
        '</div>';
    }).join('');
  }
  renderProjects();

  if (filterBar) {
    filterBar.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.kc-filter');
      if (!btn) return;
      currentFilter = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(filterBar.querySelectorAll('.kc-filter'), function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      if (grid) {
        grid.style.transition = 'opacity .18s ease';
        grid.style.opacity = '0';
        setTimeout(function () {
          renderProjects();
          grid.style.opacity = '1';
        }, reduce ? 0 : 160);
      }
    });
  }

  /* ---- kontaktný formulár ---- */
  var formWrap = document.getElementById('contactForm');
  var successWrap = document.getElementById('contactSuccess');
  var submitBtn = document.getElementById('submitBtn');
  var resetBtn = document.getElementById('resetFormBtn');

  function setError(id, msg) {
    var el = document.getElementById('err-' + id);
    var input = document.getElementById('f-' + id);
    if (el) { el.textContent = msg || ''; el.style.display = msg ? '' : 'none'; }
    if (input) input.classList.toggle('is-invalid', !!msg);
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var name = (document.getElementById('f-name') || {}).value || '';
      var email = (document.getElementById('f-email') || {}).value || '';
      var type = (document.getElementById('f-type') || {}).value || '';
      var budget = (document.getElementById('f-budget') || {}).value || '';
      var message = (document.getElementById('f-msg') || {}).value || '';

      var hasError = false;
      if (!name.trim()) { setError('name', 'Prosím, vyplňte meno.'); hasError = true; } else setError('name', '');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setError('email', 'Zadajte platný e-mail.'); hasError = true; } else setError('email', '');
      if (message.trim().length < 10) { setError('message', 'Napíšte aspoň pár viet (min. 10 znakov).'); hasError = true; } else setError('message', '');
      if (hasError) return;

      var body =
        'Meno: ' + name + '\n' +
        'E-mail: ' + email + '\n' +
        'Typ projektu: ' + type + '\n' +
        'Rozpočet: ' + budget + '\n\n' +
        message;
      var href = 'mailto:ahoj@kristiancernak.sk' +
        '?subject=' + encodeURIComponent('Dopyt z webu — ' + type) +
        '&body=' + encodeURIComponent(body);
      window.location.href = href;

      if (formWrap) formWrap.style.display = 'none';
      if (successWrap) successWrap.style.display = '';
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      ['name', 'email', 'message'].forEach(function (id) { setError(id, ''); });
      var n = document.getElementById('f-name'); if (n) n.value = '';
      var e = document.getElementById('f-email'); if (e) e.value = '';
      var m = document.getElementById('f-msg'); if (m) m.value = '';
      if (successWrap) successWrap.style.display = 'none';
      if (formWrap) formWrap.style.display = '';
    });
  }

  /* ---- scroll: stuck nav, tlačidlo hore, scrollspy, reveal, počítadlá ---- */
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-stuck', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(document.querySelectorAll('.kc-reveal'), function (el) { el.classList.add('is-in'); });
    return;
  }

  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en, idx) {
      if (!en.isIntersecting) return;
      var el = en.target;
      setTimeout(function () { el.classList.add('is-in'); }, reduce ? 0 : idx * 90);
      revealIO.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  Array.prototype.forEach.call(document.querySelectorAll('.kc-reveal'), function (el) { revealIO.observe(el); });

  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = target + suffix; countIO.unobserve(el); return; }
      var t0 = null, dur = 1400;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) { countIO.observe(el); });

  var navLinks = document.querySelectorAll('.kc-navlink');
  var spyIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      Array.prototype.forEach.call(navLinks, function (a) {
        a.classList.toggle('is-current', a.getAttribute('data-nav') === en.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['sluzby', 'proces', 'projekty', 'cennik', 'kontakt'].forEach(function (id) {
    var s = document.getElementById(id);
    if (s) spyIO.observe(s);
  });
})();
