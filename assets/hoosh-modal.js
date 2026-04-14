/* ═══════════════════════════════════════
   HOOSH — Full-Screen Product View
   Gallery + info + contact, no page nav.
═══════════════════════════════════════ */
(function () {
  const modal = document.getElementById('hoosh-modal');
  if (!modal) return;

  const overlay = modal.querySelector('[data-modal-overlay]');
  const closeBtn = modal.querySelector('[data-modal-close]');
  const nameEl = modal.querySelector('[data-modal-name]');
  const labelEl = modal.querySelector('[data-modal-label]');
  const descEl = modal.querySelector('[data-modal-desc]');
  const mainImg = modal.querySelector('[data-modal-img]');
  const thumbsWrap = modal.querySelector('[data-modal-thumbs]');
  const waBtn = modal.querySelector('[data-modal-wa]');

  function setMainImage(src, alt) {
    if (!mainImg) return;
    mainImg.src = src;
    mainImg.alt = alt || '';
  }

  function buildThumbs(images, name) {
    if (!thumbsWrap) return;
    thumbsWrap.innerHTML = '';
    if (!images || images.length < 2) {
      thumbsWrap.style.display = 'none';
      return;
    }
    thumbsWrap.style.display = 'flex';
    images.forEach(function (src, i) {
      var thumb = document.createElement('button');
      thumb.className = 'hm__thumb' + (i === 0 ? ' is-active' : '');
      thumb.setAttribute('aria-label', 'View image ' + (i + 1));
      var img = document.createElement('img');
      img.src = src;
      img.alt = name || '';
      img.loading = 'lazy';
      thumb.appendChild(img);
      thumb.addEventListener('click', function () {
        setMainImage(src, name);
        thumbsWrap.querySelectorAll('.hm__thumb').forEach(function (t) {
          t.classList.remove('is-active');
        });
        thumb.classList.add('is-active');
      });
      thumbsWrap.appendChild(thumb);
    });
  }

  function open(trigger) {
    var data = trigger.dataset;
    var name = data.productName || '';
    var label = data.productLabel || '';
    var desc = data.productDesc || '';
    var images = [];

    try {
      images = JSON.parse(data.productImages || '[]');
    } catch (e) {
      if (data.productImg) images = [data.productImg];
    }
    if (!images.length && data.productImg) images = [data.productImg];

    if (nameEl) nameEl.textContent = name;
    if (labelEl) labelEl.textContent = label;
    if (descEl) descEl.innerHTML = desc;
    if (images.length) setMainImage(images[0], name);
    buildThumbs(images, name);

    if (waBtn && name) {
      var waBase = waBtn.dataset.waBase || '';
      if (waBase) {
        waBtn.href = waBase + '?text=' + encodeURIComponent("Hi, I'm interested in " + name);
      }
    }

    modal.classList.add('is-open');
    document.body.classList.add('h-modal-open');
    modal.setAttribute('aria-hidden', 'false');

    var focusable = modal.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('h-modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-trigger]');
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
