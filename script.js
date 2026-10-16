document.querySelectorAll('.reveal').forEach(el => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  io.observe(el);
});

const nav = document.getElementById('main-nav');
const menu = document.querySelector('.menu-toggle');

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// EMAILJS
const EMAILJS_SERVICE_ID = 'service_jsa9lmi';
const EMAILJS_BOOKING_TEMPLATE_ID = 'template_2d1xr1j';
const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_gma81ux';
const EMAILJS_PUBLIC_KEY = 'WGyBfyHcUlBZah5nO';

if (window.emailjs) {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });
}

const form = document.getElementById('booking-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Simple honeypot: bots often fill hidden fields.
    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      statusEl.className = 'form-status ok';
      statusEl.textContent = 'Verstuurd — thanks!';
      form.reset();
      return;
    }

    if (!window.emailjs) {
      statusEl.className = 'form-status error';
      statusEl.innerHTML = 'Mailservice kon niet laden. Mail ons direct via <a href="mailto:snaapselik@gmail.com">snaapselik@gmail.com</a>.';
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    const params = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      type: String(formData.get('type') || '').trim(),
      date: String(formData.get('date') || '').trim() || 'Niet opgegeven',
      message: String(formData.get('message') || '').trim()
    };

    button.disabled = true;
    statusEl.className = 'form-status';
    statusEl.textContent = 'Versturen…';

    try {
      // 1. Mail the booking request to Snaapse Lik.
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_BOOKING_TEMPLATE_ID,
        params
      );

      // 2. Send an automatic confirmation to the person who filled in the form.
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_AUTOREPLY_TEMPLATE_ID,
        params
      );

      form.reset();
      statusEl.className = 'form-status ok';
      statusEl.textContent = 'Verstuurd — check je inbox voor de bevestiging.';
    } catch (error) {
      console.error('EmailJS error:', error);
      statusEl.className = 'form-status error';
      statusEl.innerHTML = 'Versturen lukte niet. Mail ons direct via <a href="mailto:snaapselik@gmail.com">snaapselik@gmail.com</a>.';
    } finally {
      button.disabled = false;
    }
  });
}
