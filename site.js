/* All Star Roofing & Exteriors — shared page behavior
   Ported from the Claude Design artboard components (dc-runtime). */
(function () {
  'use strict';

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var overlay = document.querySelector('[data-menu]');

  function playVideo(trigger) {
    var poster = trigger.closest('.video-poster');
    if (!poster || !poster.parentElement) return;
    var embed = poster.parentElement.querySelector('[data-video-embed]');
    if (embed) {
      var iframe = embed.querySelector('iframe');
      if (iframe && !iframe.getAttribute('src')) {
        iframe.setAttribute('src', iframe.getAttribute('data-embed-src'));
      }
      embed.classList.add('on');
    }
    poster.style.display = 'none';
  }

  // Original component resets menuOpen when leaving mobile widths
  var desktopMq = window.matchMedia('(min-width: 1140.02px)');
  var onDesktop = function () {
    if (desktopMq.matches && overlay) overlay.classList.remove('open');
  };
  if (desktopMq.addEventListener) desktopMq.addEventListener('change', onDesktop);

  function fieldValue(name) {
    var el = document.querySelector('[data-field="' + name + '"]');
    return el ? el.value : '';
  }

  function setField(name, value) {
    var el = document.querySelector('[data-field="' + name + '"]');
    if (el) el.value = value;
  }

  function toggleErr(name, show) {
    var el = document.querySelector('[data-err="' + name + '"]');
    if (el) el.classList.toggle('show', show);
  }

  // Original React form recomputes errors on every keystroke once a submit
  // was attempted ("tried" state) — errors clear live as the user types
  var tried = false;
  function refreshErrors() {
    toggleErr('name', tried && !fieldValue('name').trim());
    toggleErr('phone', tried && fieldValue('phone').replace(/\D/g, '').length < 7);
  }
  ['name', 'phone'].forEach(function (f) {
    var el = document.querySelector('[data-field="' + f + '"]');
    if (el) el.addEventListener('input', refreshErrors);
  });

  // Form backend: FormSubmit.co AJAX endpoint delivering to the business
  // inbox already published on the site. NOTE: the first-ever submission
  // triggers FormSubmit's one-time activation email to this address; the
  // inbox owner must click it once before submissions are delivered.
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/812allstar@gmail.com';

  function showThanks(name) {
    var panel = document.querySelector('[data-form-panel]');
    var thanks = document.querySelector('[data-thanks-panel]');
    var thanksName = document.querySelector('[data-thanks-name]');
    if (thanksName) thanksName.textContent = name ? ', ' + name.split(/\s+/)[0] : '';
    if (panel) panel.classList.add('hide');
    if (thanks) thanks.classList.add('show');
  }

  function sendError(show) {
    var el = document.querySelector('[data-send-error]');
    if (!el && show) {
      var btn = document.querySelector('[data-action="submit-form"]');
      el = document.createElement('p');
      el.setAttribute('data-send-error', '');
      el.style.cssText = 'margin:10px 0 0;font-size:13.5px;line-height:1.5;font-weight:600;color:#B22730;text-align:center';
      el.textContent = "Something went wrong sending your request — please call (812) 499-2890 and we'll take it from there.";
      btn.parentElement.insertBefore(el, btn.nextSibling);
    }
    if (el) el.style.display = show ? '' : 'none';
  }

  function submitForm() {
    var name = fieldValue('name').trim();
    var phoneOk = fieldValue('phone').replace(/\D/g, '').length >= 7;
    if (!name || !phoneOk) { tried = true; refreshErrors(); return; }
    tried = false;
    refreshErrors();
    sendError(false);
    var btn = document.querySelector('[data-action="submit-form"]');
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: name,
        phone: fieldValue('phone'),
        town: fieldValue('town'),
        property: fieldValue('ptype'),
        message: fieldValue('msg'),
        _subject: 'Free inspection request — ' + name,
        _template: 'table'
      })
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function () {
      showThanks(name);
    }).catch(function () {
      sendError(true);
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = label;
    });
  }

  function resetForm() {
    ['name', 'phone', 'town', 'msg'].forEach(function (f) { setField(f, ''); });
    setField('ptype', 'Home');
    tried = false;
    refreshErrors();
    var panel = document.querySelector('[data-form-panel]');
    var thanks = document.querySelector('[data-thanks-panel]');
    if (thanks) thanks.classList.remove('show');
    if (panel) panel.classList.remove('hide');
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    switch (t.getAttribute('data-action')) {
      case 'open-menu': if (overlay) overlay.classList.add('open'); break;
      case 'close-menu': if (overlay) overlay.classList.remove('open'); break;
      case 'play-video': playVideo(t); break;
      case 'submit-form': submitForm(); break;
      case 'reset-form': resetForm(); break;
    }
  });

  // Reveal-on-scroll (identical to the artboard component logic)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!reduce && 'IntersectionObserver' in window) {
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px' });
    els.forEach(function (el) { io.observe(el); });
  }
})();
