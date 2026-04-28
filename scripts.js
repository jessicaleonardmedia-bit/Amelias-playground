/* ASCW shared scripts: AuDHD controls panel, FAQ accordion, year. */

/* Year in footer */
(function() {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* Controls panel toggle */
(function() {
  var toggleBtn = document.getElementById('controls-toggle');
  var panel = document.getElementById('controls-panel');
  if (!toggleBtn || !panel) return;
  toggleBtn.addEventListener('click', function() {
    var open = panel.dataset.open === 'true';
    panel.dataset.open = (!open).toString();
    toggleBtn.setAttribute('aria-expanded', (!open).toString());
  });
})();

/* Persistence */
var STORAGE_KEY = 'ascw-prefs';
function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch (e) { return {}; }
}
function savePrefs(prefs) { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); }
var prefs = loadPrefs();

function applyPrefs() {
  var body = document.body;

  body.classList.remove('bg-cream', 'bg-sage', 'bg-lavender');
  body.classList.add('bg-' + (prefs.bg || 'cream'));
  document.querySelectorAll('.bg-options button').forEach(function(btn) {
    btn.setAttribute('aria-pressed',
      btn.dataset.bg === (prefs.bg || 'cream') ? 'true' : 'false');
  });

  var size = prefs.fontSize || 16;
  document.documentElement.style.setProperty('--font-size', size + 'px');
  var slider = document.getElementById('font-size-slider');
  if (slider) slider.value = size;

  body.classList.toggle('font-dyslexia', !!prefs.dyslexia);
  body.classList.toggle('high-contrast', !!prefs.contrast);
  body.classList.toggle('reduce-motion',  !!prefs.motion);
  body.classList.toggle('reading-mode',   !!prefs.reading);

  var ids = {
    'toggle-dyslexia': 'dyslexia',
    'toggle-contrast': 'contrast',
    'toggle-motion':   'motion',
    'toggle-reading':  'reading'
  };
  Object.keys(ids).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.checked = !!prefs[ids[id]];
  });
}
applyPrefs();

/* Wire up controls */
(function() {
  var slider = document.getElementById('font-size-slider');
  if (slider) {
    slider.addEventListener('input', function(e) {
      prefs.fontSize = parseInt(e.target.value, 10);
      document.documentElement.style.setProperty('--font-size', prefs.fontSize + 'px');
      savePrefs(prefs);
    });
  }

  document.querySelectorAll('.bg-options button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      prefs.bg = btn.dataset.bg;
      applyPrefs();
      savePrefs(prefs);
    });
  });

  function bindToggle(id, prefKey, className) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', function(e) {
      prefs[prefKey] = e.target.checked;
      document.body.classList.toggle(className, e.target.checked);
      savePrefs(prefs);
    });
  }
  bindToggle('toggle-dyslexia', 'dyslexia', 'font-dyslexia');
  bindToggle('toggle-contrast', 'contrast', 'high-contrast');
  bindToggle('toggle-motion',   'motion',   'reduce-motion');
  bindToggle('toggle-reading',  'reading',  'reading-mode');

  var resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      prefs = {};
      savePrefs(prefs);
      document.documentElement.style.setProperty('--font-size', '16px');
      applyPrefs();
    });
  }
})();

/* FAQ accordion */
(function() {
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      item.classList.toggle('open');
      var expanded = item.classList.contains('open');
      btn.setAttribute('aria-expanded', expanded.toString());
    });
  });
})();
