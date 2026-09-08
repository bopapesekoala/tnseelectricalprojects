// Footer year
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// Mobile menu toggle
document.getElementById('mobile-menu-btn')?.addEventListener('click', function () {
  const nav = document.querySelector('nav');
  if (nav) nav.classList.toggle('hidden');
});

// Theme toggle (light/dark)
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  try {
    localStorage.setItem(
      'tnse_theme',
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  } catch (e) {
    console.warn('LocalStorage unavailable for theme preference', e);
  }
}

// Initialize saved theme
(function () {
  try {
    const theme = localStorage.getItem('tnse_theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.warn('LocalStorage unavailable', e);
  }
})();

// Cookie consent handlers
(function () {
  const banner = document.getElementById('cookieConsentBanner');
  const acceptBtn = document.getElementById('acceptCookieBtn');
  const declineBtn = document.getElementById('declineCookieBtn');

  function hideBanner() {
    if (banner) banner.style.display = 'none';
  }

  function setConsent(value) {
    try {
      localStorage.setItem('tnse_cookie_consent', JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage unavailable for cookie consent', e);
    }
  }

  acceptBtn?.addEventListener('click', function () {
    setConsent(true);
    hideBanner();
  });

  declineBtn?.addEventListener('click', function () {
    setConsent(false);
    hideBanner();
  });

  // Check saved consent status
  try {
    const consent = JSON.parse(localStorage.getItem('tnse_cookie_consent'));
    if (consent !== null) {
      hideBanner();
    }
  } catch (e) {
    console.warn('Error reading cookie consent', e);
  }
})();
