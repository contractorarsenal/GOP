document.addEventListener('DOMContentLoaded', function() {

var form = document.getElementById('gomlForm');
if (!form) return; // scoped to /mailing only

var steps = Array.prototype.slice.call(form.querySelectorAll('.goml-step'));
var dots = [document.getElementById('goml-dot-1'), document.getElementById('goml-dot-2'), document.getElementById('goml-dot-3')];
var current = 1;
var submitting = false;
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('gomlPageUrl').value = window.location.href;

// ── STEP NAVIGATION (tracks direction so Next/Back animate differently) ──
function showStep(n) {
  var goingBack = n < current;
  steps.forEach(function(s) {
    var isTarget = parseInt(s.getAttribute('data-step'), 10) === n;
    s.classList.toggle('active', isTarget);
    s.classList.toggle('dir-back', isTarget && goingBack);
  });
  dots.forEach(function(d, i) {
    var wasDone = d && d.classList.contains('done');
    var nowDone = i < n;
    if (d) {
      d.classList.toggle('done', nowDone);
      if (!reduceMotion && nowDone && !wasDone) {
        d.classList.remove('pulse');
        void d.offsetWidth; // restart animation
        d.classList.add('pulse');
      }
    }
  });
  current = n;
  form.querySelectorAll('.goml-step-err').forEach(function(e) { e.style.display = 'none'; });
  // move focus to the new step's heading for keyboard/screen-reader users
  var activeStep = form.querySelector('.goml-step.active .goml-step-title');
  if (activeStep) { activeStep.setAttribute('tabindex', '-1'); activeStep.focus({ preventScroll: true }); }
}

// Enter key inside a step-1/2 field should advance via the visible Next
// button rather than trigger the form's (currently hidden) submit control.
form.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  if (e.target.tagName === 'TEXTAREA') return;
  if (current < 3) {
    e.preventDefault();
    var nextBtn = form.querySelector('.goml-step.active [data-next]');
    if (nextBtn) nextBtn.click();
  }
});

function validateStep1() {
  var checked = form.querySelectorAll('input[name="services"]:checked');
  var err = document.getElementById('gomlErr1');
  if (checked.length === 0) {
    if (err) err.style.display = 'block';
    return false;
  }
  if (err) err.style.display = 'none';
  return true;
}

function validateStep2() {
  var ok = true;
  var timelineChecked = form.querySelector('input[name="timeline"]:checked');
  var errA = document.getElementById('gomlErr2a');
  if (!timelineChecked) {
    if (errA) errA.style.display = 'block';
    ok = false;
  } else if (errA) {
    errA.style.display = 'none';
  }
  var zip = document.getElementById('gomlZip');
  var zipField = document.getElementById('gomlZipField');
  if (!/^[0-9]{5}$/.test(zip.value.trim())) {
    zipField.classList.add('err');
    ok = false;
  } else {
    zipField.classList.remove('err');
  }
  return ok;
}

function digits(s) { return (s || '').replace(/\D/g, ''); }

function validateStep3() {
  var ok = true;
  var first = document.getElementById('gomlFirst');
  var firstField = document.getElementById('gomlFirstField');
  if (!first.value.trim()) { firstField.classList.add('err'); ok = false; } else { firstField.classList.remove('err'); }

  var phone = document.getElementById('gomlPhone');
  var phoneField = document.getElementById('gomlPhoneField');
  if (digits(phone.value).length !== 10) { phoneField.classList.add('err'); ok = false; } else { phoneField.classList.remove('err'); }

  var email = document.getElementById('gomlEmail');
  var emailField = document.getElementById('gomlEmailField');
  var emailVal = email.value.trim();
  if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { emailField.classList.add('err'); ok = false; } else { emailField.classList.remove('err'); }

  var address = document.getElementById('gomlAddress');
  var addressField = document.getElementById('gomlAddressField');
  if (!address.value.trim()) { addressField.classList.add('err'); ok = false; } else { addressField.classList.remove('err'); }

  return ok;
}

form.querySelectorAll('[data-next]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var target = parseInt(btn.getAttribute('data-next'), 10);
    var valid = true;
    if (current === 1) valid = validateStep1();
    if (current === 2) valid = validateStep2();
    if (valid) showStep(target);
  });
});

form.querySelectorAll('[data-back]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    showStep(parseInt(btn.getAttribute('data-back'), 10));
  });
});

// ── VISUAL SELECTED STATE (checkboxes / radios) + brief pop feedback ──
function popFeedback(label) {
  if (reduceMotion) return;
  label.classList.remove('pop');
  void label.offsetWidth; // restart animation
  label.classList.add('pop');
}
form.querySelectorAll('.goml-check input').forEach(function(cb) {
  cb.addEventListener('change', function() {
    var label = cb.closest('.goml-check');
    label.classList.toggle('sel', cb.checked);
    if (cb.checked) popFeedback(label);
  });
});
form.querySelectorAll('.goml-radio input').forEach(function(rb) {
  rb.addEventListener('change', function() {
    form.querySelectorAll('.goml-radio').forEach(function(l) { l.classList.remove('sel'); });
    var label = rb.closest('.goml-radio');
    label.classList.add('sel');
    popFeedback(label);
  });
});

// ZIP: digits only
var zipInput = document.getElementById('gomlZip');
if (zipInput) {
  zipInput.addEventListener('input', function() {
    zipInput.value = zipInput.value.replace(/\D/g, '').slice(0, 5);
  });
}

// ── SUBMIT ──
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (submitting) return;

  // final full-form validation (covers direct submit / browser autofill edge cases)
  var v1 = validateStep1(), v2 = validateStep2(), v3 = validateStep3();
  if (!v1) { showStep(1); return; }
  if (!v2) { showStep(2); return; }
  if (!v3) { showStep(3); return; }

  submitting = true;
  var btn = document.getElementById('gomlSubmitBtn');
  var status = document.getElementById('gomlStatus');
  var originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.classList.remove('show', 'ok', 'bad');

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: new FormData(form)
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    if (data.success) {
      form.style.display = 'none';
      document.getElementById('gomlSuccess').classList.add('show');
      status.classList.remove('show');
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  }).catch(function() {
    status.textContent = '❌ Something went wrong. Please call us now.';
    status.classList.add('show', 'bad');
    submitting = false;
    btn.disabled = false;
    btn.textContent = originalLabel;
  });
});

// ── SMOOTH SCROLL TO FORM (respects reduced motion) ──
document.querySelectorAll('[data-scroll]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var targetId = link.getAttribute('href');
    if (!targetId || targetId.charAt(0) !== '#') return;
    var target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

// ── FAQ ACCORDION (scoped; independent of the main site's toggleFaq) ──
// Questions are role="button" tabindex="0" divs, so clicks AND Enter/Space
// both need to operate them, and aria-expanded needs to stay in sync.
var faqList = document.getElementById('gomlFaq');
if (faqList) {
  function toggleFaqItem(q) {
    var item = q.parentElement;
    var wasOpen = item.classList.contains('open');
    faqList.querySelectorAll('.goml-faq-item').forEach(function(i) {
      i.classList.remove('open');
      i.querySelector('.goml-faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  }
  faqList.querySelectorAll('.goml-faq-q').forEach(function(q) {
    q.addEventListener('click', function() { toggleFaqItem(q); });
    q.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleFaqItem(q);
      }
    });
  });
}

// ── REVEAL ON SCROLL (video cards, photos, process steps, FAQ) ──
// Default state (no JS, or JS before this runs) is fully visible, so
// content is never dependent on the observer to be usable. Reduced
// motion skips the hidden/pre state entirely -- everything just shows.
var revealEls = document.querySelectorAll('.goml-reveal');
if (revealEls.length) {
  if (reduceMotion || typeof IntersectionObserver === 'undefined') {
    revealEls.forEach(function(el) { el.classList.add('in'); });
  } else {
    revealEls.forEach(function(el) { el.classList.add('goml-pre'); });
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el) { io.observe(el); });
  }
}

// ── "FROM CLAIM TO FRESH PAINT": connector draws as the visitor
// scrolls, and each step highlights exactly when the line reaches it.
// Progress is computed from the grid's real position in the viewport
// on every scroll/resize (rAF-throttled), not a fixed timed stagger,
// so the line and highlight genuinely track scroll position in both
// directions. Reduced motion shows the fully-drawn, fully-highlighted
// state immediately and skips the scroll listener entirely.
var processGrid = document.querySelector('.goml-process-grid');
if (processGrid) {
  var processSteps = Array.prototype.slice.call(processGrid.querySelectorAll('.goml-process-step'));
  var processFills = Array.prototype.slice.call(processGrid.querySelectorAll('.goml-process-connector-fill'));
  var processSegments = Math.max(1, processSteps.length - 1);

  function isMobileProcessLayout() {
    return window.matchMedia && window.matchMedia('(max-width: 680px)').matches;
  }

  function setProcessProgress() {
    var rect = processGrid.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var start = vh * 0.85;
    var end = vh * 0.35;
    var span = Math.max(1, rect.height + (start - end));
    var scrolled = start - rect.top;
    var p = Math.max(0, Math.min(1, scrolled / span));
    var axis = isMobileProcessLayout() ? 'scaleY(' : 'scaleX(';
    for (var i = 0; i < processSegments; i++) {
      var segProgress = Math.max(0, Math.min(1, p * processSegments - i));
      if (processFills[i]) processFills[i].style.transform = axis + segProgress + ')';
    }
    processSteps.forEach(function(step, i) {
      // Step 1's threshold is a small positive value, not 0, so it only
      // highlights once the section has actually been scrolled to --
      // never pre-highlighted just because the page loaded.
      var threshold = i === 0 ? 0.04 : i / processSegments;
      step.classList.toggle('is-reached', p >= threshold);
    });
  }

  var processTicking = false;
  function onProcessScroll() {
    if (processTicking) return;
    processTicking = true;
    requestAnimationFrame(function() { setProcessProgress(); processTicking = false; });
  }

  if (reduceMotion) {
    var fullAxis = isMobileProcessLayout() ? 'scaleY(1)' : 'scaleX(1)';
    processFills.forEach(function(f) { f.style.transform = fullAxis; });
    processSteps.forEach(function(s) { s.classList.add('is-reached'); });
  } else {
    window.addEventListener('scroll', onProcessScroll, { passive: true });
    window.addEventListener('resize', onProcessScroll);
    setProcessProgress();
  }
}

// ── CUSTOMER VIDEOS: click-to-play facade ──
// No iframe exists in the DOM until a visitor clicks play, so the two
// testimonial embeds never add to initial page load. Clicking swaps
// the thumbnail for a YouTube iframe with autoplay=1 -- playback only
// starts from that explicit click, never on page load/scroll.
document.querySelectorAll('.goml-video-card').forEach(function(card) {
  var btn = card.querySelector('.goml-play-btn');
  if (!btn) return;
  btn.addEventListener('click', function() {
    var frame = card.querySelector('.goml-video-frame');
    var videoId = card.getAttribute('data-video-id');
    var caption = card.getAttribute('data-caption') || 'Customer testimonial video';
    if (!videoId || frame.querySelector('iframe')) return;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
    iframe.title = caption;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    frame.innerHTML = '';
    frame.appendChild(iframe);
  });
});

});
