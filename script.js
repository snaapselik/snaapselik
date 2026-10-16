
document.querySelectorAll('.reveal').forEach(el => {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: .08});
  io.observe(el);
});

const nav = document.getElementById('main-nav');
const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  document.body.style.overflow = '';
}));

document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

const form = document.getElementById('booking-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (location.protocol === 'file:') {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Dit formulier werkt pas op de live Netlify-site, niet vanuit een lokaal index.html-bestand.';
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    statusEl.className = 'form-status';
    statusEl.textContent = 'Versturen…';

    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const response = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body
      });

      if (!response.ok) throw new Error('Form submission failed');

      form.reset();
      statusEl.className = 'form-status ok';
      statusEl.textContent = 'Verstuurd — thanks! We nemen zo snel mogelijk contact op.';
    } catch (error) {
      statusEl.className = 'form-status error';
      statusEl.innerHTML = 'Versturen lukte niet. Mail ons direct via <a href="mailto:snaapselik@gmail.com">snaapselik@gmail.com</a>.';
    } finally {
      button.disabled = false;
    }
  });
}
