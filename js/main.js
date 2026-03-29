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
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = pct + '%';
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


/* ---------- SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay;
      if (delay) {
        entry.target.style.transitionDelay = `${(+delay - 1) * 0.17 + 0.05}s`;
      }
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


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
const toggle   = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

toggle.addEventListener('click', () => {
  const isOpen = toggle.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    // Only unlock scroll if the modal isn't open
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name  = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();

    if (!name || !email) {
      showStatus('Please fill in your name and email.', 'error');
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
        submitBtn.textContent = 'Sent';
        showStatus('Thanks — Daniel will be in touch within 24 hours.', 'success');
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

  function showStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className   = `form__status form__status--${type}`;
  }

  function resetBtn() {
    submitBtn.disabled    = false;
    submitBtn.textContent = originalBtnText;
  }
}
