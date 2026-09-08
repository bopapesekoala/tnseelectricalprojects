// Footer year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Mobile menu toggle (simple)
document.getElementById('mobile-menu-btn')?.addEventListener('click', function(){
  const nav = document.querySelector('nav');
  if (nav) nav.classList.toggle('hidden');
});

// Theme toggle (light/dark)
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  // store preference
  try { localStorage.setItem('tnse_theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light'); } catch(e) {}
}
(function(){
  try {
    const theme = localStorage.getItem('tnse_theme');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch(e){}
})();

// Cookie consent handlers
(function () {
  const banner = document.getElementById('cookieConsentBanner');
  const acceptBtn = document.getElementById('acceptCookieBtn');
  const declineBtn = document.getElementById('declineCookieBtn');

  function hideBanner() { if (banner) banner.style.display = 'none'; }

  function setConsent(value) {
    try { localStorage.setItem('tnse_cookie_consent', JSON.stringify(value)); } catch(e){}
  }

  try {
    const consent = JSON.parse(localStorage.getItem('tnse_cookie_consent'));
    if (consent && consent.accepted) hideBanner();
  } catch(e) { /* ignore */ }

  acceptBtn?.addEventListener('click', function(){
    setConsent({ accepted: true, timestamp: Date.now() });
    hideBanner();
  });
  declineBtn?.addEventListener('click', function(){
    setConsent({ accepted: false, timestamp: Date.now() });
    hideBanner();
  });
})();

// Consultation / Contact form: placeholder sending via EmailJS (replace IDs)
(function(){
  const form = document.getElementById('consultationForm');
  const resp = document.getElementById('formResponse');
  if (!form) return;

  // Initialize emailjs with your user ID if you want to use it
  try {
    if (window.emailjs && !window.emailjs._initialized) {
      // emailjs.init('YOUR_EMAILJS_USER_ID'); // <-- set your EmailJS user id here
      window.emailjs._initialized = true;
    }
  } catch(e){}

  form.addEventListener('submit', function(e){
    e.preventDefault();
    resp.textContent = 'Sending...';
    // If using EmailJS, you'd call emailjs.sendForm(serviceID, templateID, form)
    // For now simulate
    setTimeout(function(){
      resp.textContent = 'Message sent — we will get back to you shortly.';
      form.reset();
    }, 900);
  });
})();

// Footer subscribe: simple placeholder
(function(){
  const form = document.getElementById('footerSubscribeForm');
  const msg = document.getElementById('subscribeMsg');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    msg.textContent = 'Thanks — we will notify you by email.';
    form.reset();
  });
})();

// Simple counter animation helper for elements with data-target
(function(){
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;
  counters.forEach(el => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, 16);
  });
})();
