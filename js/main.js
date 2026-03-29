/* ============================================
   DPP FITNESS — main.js
   ============================================ */

/* ---------- SCROLL TO TOP ON LOAD ---------- */
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ---------- FOOTER YEAR ---------- */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ---------- SCROLL PROGRESS BAR ---------- */
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${ratio})`;
}


/* ---------- HERO PARALLAX ---------- */
const hero = document.querySelector('.hero');

function updateParallax() {
  if (!hero) return;
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight * 1.2) {
    hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.3}px)`;
  }
}


/* ---------- NAV: SCROLL EFFECT ---------- */
const header = document.querySelector('.site-header');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 40);
  updateProgress();
  updateParallax();
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

window.addEventListener('beforeunload', () => window.scrollTo(0, 0));




/* ---------- 3D CARD TILT ---------- */
const TILT_MAX   = 7;   // max degrees
const TILT_SPEED = 0.5; // multiplier for smoothness feel

document.querySelectorAll('.service-card').forEach(card => {
  const isFeatured = card.classList.contains('service-card--featured');
  // Base vertical offset matches CSS (featured is raised by 10px in CSS)
  const baseY = isFeatured ? -10 : 0;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2; // -1 to 1

    const rotateX = -(y * TILT_MAX * TILT_SPEED);
    const rotateY =   x * TILT_MAX * TILT_SPEED;

    card.style.transform =
      `perspective(1000px) translateY(${baseY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    // Clear inline transform — CSS takes back over smoothly
    card.style.transform = '';
  });
});


/* ---------- MODAL ---------- */
const modalOverlay = document.getElementById('modal');
const modalClose   = document.getElementById('modal-close');

function openModal(pkg) {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (pkg) {
    const select = modalOverlay.querySelector('#interest');
    if (select) select.value = pkg;
  }
  setTimeout(() => {
    const first = modalOverlay.querySelector('input, select, textarea');
    if (first) first.focus();
  }, 80);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(btn.dataset.package || '');
  });
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});



/* ---------- NAV: MOBILE TOGGLE ---------- */
const toggle      = document.querySelector('.nav__toggle');
const navCheckbox = document.getElementById('nav-checkbox');
const navLinks    = document.querySelector('.nav__links');

navCheckbox.addEventListener('change', () => {
  const isOpen = navCheckbox.checked;
  navLinks.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navCheckbox.checked = false;
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    if (!modalOverlay.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  });
});


/* ---------- CONTACT FORM ---------- */
const form = document.querySelector('.contact__form');

if (form) {
  const submitBtn      = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  const statusMsg = document.createElement('p');
  statusMsg.className = 'form__status';
  statusMsg.setAttribute('role', 'alert');
  submitBtn.insertAdjacentElement('afterend', statusMsg);

  function showFieldError(fieldEl, message) {
    // Remove any existing error on this field's group
    const group = fieldEl.closest('.form__group') || fieldEl.parentElement;
    const existing = group.querySelector('.field-error');
    if (existing) existing.remove();

    const err = document.createElement('div');
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    err.innerHTML = `
      <div class="field-error__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 24 24" height="18" fill="none"><path fill="#fff" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
      </div>
      <div class="field-error__title">${message}</div>
      <div class="field-error__close" aria-label="Dismiss">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 20 20" height="18"><path fill="#fff" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path></svg>
      </div>`;

    err.querySelector('.field-error__close').addEventListener('click', () => err.remove());

    // Auto-dismiss after 5s
    setTimeout(() => { if (err.parentElement) err.remove(); }, 5000);

    // Insert above the input (after the label)
    const label = group.querySelector('label');
    if (label) label.insertAdjacentElement('afterend', err);
    else group.prepend(err);

    // Clear when user starts typing
    fieldEl.addEventListener('input', () => err.remove(), { once: true });
  }

  // Blur validation — show error when leaving a required field empty
  const nameEl  = form.querySelector('#name');
  const emailEl = form.querySelector('#email');
  const phoneEl = form.querySelector('#phone');

  nameEl.addEventListener('blur', () => {
    if (!nameEl.value.trim()) {
      showFieldError(nameEl, 'Please fill in your name.');
    }
  });

  emailEl.addEventListener('blur', () => {
    if (!emailEl.value.trim() && !phoneEl.value.trim()) {
      showFieldError(emailEl, 'Add an email or phone — whichever\'s easiest.');
    }
  });

  phoneEl.addEventListener('blur', () => {
    if (!phoneEl.value.trim() && !emailEl.value.trim()) {
      showFieldError(phoneEl, 'Add a phone or email — whichever\'s easiest.');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name  = nameEl.value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl.value.trim();

    if (!name) {
      showFieldError(nameEl, 'Please fill in your name.');
      return;
    }
    if (!email && !phone) {
      showFieldError(emailEl, 'Add an email or phone — whichever\'s easiest.');
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        form.reset();
        showSuccess();
      } else {
        const data = await response.json();
        const msg  = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
        showStatus(msg, 'error');
        resetBtn();
      }
    } catch {
      showStatus('Could not send your message. Please check your connection and try again.', 'error');
      resetBtn();
    }
  });

  function showSuccess() {
    closeModal();
    window.location.href = 'thankyou.html';
  }

  function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className   = `form__status form__status--${type}`;
  }

  function resetBtn() {
    submitBtn.disabled    = false;
    submitBtn.textContent = originalBtnText;
  }
}
