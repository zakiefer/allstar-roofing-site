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

  function submitForm() {
    var name = fieldValue('name').trim();
    var phoneOk = fieldValue('phone').replace(/\D/g, '').length >= 7;
    toggleErr('name', !name);
    toggleErr('phone', !phoneOk);
    if (!name || !phoneOk) return;
    var panel = document.querySelector('[data-form-panel]');
    var thanks = document.querySelector('[data-thanks-panel]');
    var thanksName = document.querySelector('[data-thanks-name]');
    if (thanksName) thanksName.textContent = name ? ', ' + name.split(/\s+/)[0] : '';
    if (panel) panel.classList.add('hide');
    if (thanks) thanks.classList.add('show');
  }

  function resetForm() {
    ['name', 'phone', 'town', 'msg'].forEach(function (f) { setField(f, ''); });
    setField('ptype', 'Home');
    ['name', 'phone'].forEach(function (f) { toggleErr(f, false); });
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
