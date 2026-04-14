/* ═══════════════════════════════════════
   HOOSH — Product Modal
   Opens on "Learn More" click, shows product
   details + contact buttons.
═══════════════════════════════════════ */
(function () {
  const modal = document.getElementById('hoosh-modal');
  if (!modal) return;

  const overlay = modal.querySelector('[data-modal-overlay]');
  const closeBtn = modal.querySelector('[data-modal-close]');
  const nameEl = modal.querySelector('[data-modal-name]');
  const descEl = modal.querySelector('[data-modal-desc]');
  const imgEl = modal.querySelector('[data-modal-img]');
  const specsEl = modal.querySelector('[data-modal-specs]');
  const waBtn = modal.querySelector('[data-modal-wa]');

  function open(trigger) {
    const data = trigger.dataset;
    if (nameEl) nameEl.textContent = data.productName || '';
    if (descEl) descEl.textContent = data.productDesc || '';
    if (imgEl) {
      imgEl.src = data.productImg || '';
      imgEl.alt = data.productName || '';
    }
    if (specsEl) specsEl.innerHTML = data.productSpecs || '';
    if (waBtn && data.productName) {
      const waBase = waBtn.dataset.waBase || '';
      if (waBase) {
        waBtn.href = waBase + '?text=' + encodeURIComponent('Hi, I\'m interested in ' + data.productName);
      }
    }

    modal.classList.add('is-open');
    document.body.classList.add('h-modal-open');
    modal.setAttribute('aria-hidden', 'false');

    /* Trap focus */
    const focusable = modal.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('h-modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  /* Bind triggers */
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-modal-trigger]');
    if (trigger) {
      e.preventDefault();
      open(trigger);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();
