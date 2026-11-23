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

// Play loops only while the section is visible. Try sound, then muted autoplay.
const bankoe = document.getElementById('bankoe');
if (bankoe) {
  const videos = [...bankoe.querySelectorAll('video')];
  const liveVideo = document.getElementById('koningsdag-video');
  const soundButton = bankoe.querySelector('.bankoe-sound');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let visible = false;
  let soundAttempted = false;
  let userStarted = false;
  const updateSoundButton = () => {
    soundButton.textContent = liveVideo.muted ? 'GELUID AAN' : 'GELUID UIT';
    soundButton.setAttribute('aria-label', liveVideo.muted ? 'Geluid aanzetten' : 'Geluid uitzetten');
  };
  const shouldPlay = video => visible && !document.hidden && (!paused || (video === liveVideo && userStarted));
  const loadVideo = video => {
    const source = video.querySelector('source');
    if (!source.hasAttribute('src')) {
      source.src = source.dataset.src;
      video.load();
    }
  };
  const startVideo = async video => {
    loadVideo(video);
    if (video === liveVideo && !soundAttempted) {
      soundAttempted = true;
      video.muted = false;
    }
    try {
      await video.play();
    } catch {
      if (video === liveVideo && !video.muted && shouldPlay(video)) {
        video.muted = true;
        try { await video.play(); } catch { /* The sound button allows a manual start. */ }
      }
    }
    if (!shouldPlay(video)) video.pause();
    updateSoundButton();
  };
  const syncVideos = () => videos.forEach(video => {
    if (shouldPlay(video)) startVideo(video);
    else video.pause();
  });
  soundButton.hidden = false;
  soundButton.addEventListener('click', () => {
    loadVideo(liveVideo);
    soundAttempted = true;
    userStarted = true;
    liveVideo.muted = !liveVideo.muted;
    liveVideo.play().catch(() => { liveVideo.muted = true; updateSoundButton(); });
    updateSoundButton();
  });
  liveVideo.addEventListener('volumechange', updateSoundButton);
  reducedMotion.addEventListener('change', event => { paused = event.matches; syncVideos(); });
  document.addEventListener('visibilitychange', syncVideos);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncVideos();
  }, { threshold: 0 }).observe(bankoe);
}
