/* ============================================
   DPP FITNESS — main.js
   ============================================ */

/* ---------- FOOTER YEAR ---------- */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ---------- NAV: SCROLL EFFECT ---------- */
const header = document.querySelector('.site-header');

function onScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load


/* ---------- NAV: MOBILE TOGGLE ---------- */
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

toggle.addEventListener('click', () => {
  const isOpen = toggle.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});


/* ---------- CONTACT FORM ---------- */
const form = document.querySelector('.contact__form');

if (form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  // Inject a status message element below the button
  const statusMsg = document.createElement('p');
  statusMsg.className = 'form__status';
  statusMsg.setAttribute('role', 'alert');
  submitBtn.insertAdjacentElement('afterend', statusMsg);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();

    if (!name || !email) {
      showStatus('Please fill in your name and email.', 'error');
      return;
    }

    // Disable button + show loading state
    submitBtn.disabled = true;
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
        const msg = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
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
    statusMsg.className = `form__status form__status--${type}`;
  }

  function resetBtn() {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}
