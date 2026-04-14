/* ═══════════════════════════════════════
   HOOSH — Full-Screen Product View
   Gallery + bundle toggle + contact.
═══════════════════════════════════════ */
(function () {
  var modal = document.getElementById('hoosh-modal');
  if (!modal) return;

  var overlay = modal.querySelector('[data-modal-overlay]');
  var closeBtn = modal.querySelector('[data-modal-close]');
  var nameEl = modal.querySelector('[data-modal-name]');
  var labelEl = modal.querySelector('[data-modal-label]');
  var descEl = modal.querySelector('[data-modal-desc]');
  var mainImg = modal.querySelector('[data-modal-img]');
  var thumbsWrap = modal.querySelector('[data-modal-thumbs]');
  var waBtn = modal.querySelector('[data-modal-wa]');
  var toggleWrap = modal.querySelector('[data-modal-toggle-wrap]');
  var toggleSingle = modal.querySelector('[data-toggle="single"]');
  var toggleBundle = modal.querySelector('[data-toggle="bundle"]');
  var toggleBundleLabel = modal.querySelector('[data-toggle-bundle-label]');

  /* State: holds both single & bundle data for the current product */
  var state = {
    mode: 'single', /* 'single' or 'bundle' */
    single: { name: '', desc: '', images: [] },
    bundle: { name: '', desc: '', images: [] },
    hasBundle: false
  };

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

  function parseImages(data, fallback) {
    try {
      var imgs = JSON.parse(data || '[]');
      return imgs.length ? imgs : (fallback ? [fallback] : []);
    } catch (e) {
      return fallback ? [fallback] : [];
    }
  }

  function updateWhatsApp(name) {
    if (waBtn && name) {
      var waBase = waBtn.dataset.waBase || '';
      if (waBase) {
        waBtn.href = waBase + '?text=' + encodeURIComponent("Hi, I'm interested in " + name);
      }
    }
  }

  function renderView() {
    var d = state.mode === 'bundle' ? state.bundle : state.single;
    if (nameEl) nameEl.textContent = d.name;
    if (descEl) descEl.innerHTML = d.desc;
    if (d.images.length) setMainImage(d.images[0], d.name);
    buildThumbs(d.images, d.name);
    updateWhatsApp(d.name);
  }

  function setToggle(mode) {
    state.mode = mode;
    if (toggleSingle && toggleBundle) {
      toggleSingle.classList.toggle('is-active', mode === 'single');
      toggleBundle.classList.toggle('is-active', mode === 'bundle');
    }
    renderView();
  }

  /* ── Open ── */
  function open(trigger) {
    var data = trigger.dataset;

    state.mode = 'single';
    state.single.name = data.productName || '';
    state.single.desc = data.productDesc || '';
    state.single.images = parseImages(data.productImages, data.productImg);

    state.hasBundle = !!data.bundleName;
    if (state.hasBundle) {
      state.bundle.name = data.bundleName || '';
      state.bundle.desc = data.bundleDesc || '';
      state.bundle.images = parseImages(data.bundleImages, data.bundleImg);
      if (toggleBundleLabel) toggleBundleLabel.textContent = data.bundleLabel || 'Pack of 10';
    }

    if (toggleWrap) {
      toggleWrap.style.display = state.hasBundle ? 'flex' : 'none';
    }
    if (toggleSingle) toggleSingle.classList.add('is-active');
    if (toggleBundle) toggleBundle.classList.remove('is-active');

    if (labelEl) labelEl.textContent = data.productLabel || '';

    renderView();

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

  /* ── Event Bindings ── */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-modal-trigger]');
    if (trigger) {
      e.preventDefault();
      open(trigger);
    }
  });

  if (toggleSingle) toggleSingle.addEventListener('click', function () { setToggle('single'); });
  if (toggleBundle) toggleBundle.addEventListener('click', function () { setToggle('bundle'); });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });
})();
