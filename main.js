/* ---------------------------------------------------------------------
   2. NAVIGATION, THEME & NOTIFICATIONS (main.js)
   --------------------------------------------------------------------- */
let currentView = 'home';
let currentDashboardRole = 'patient';
let autoQueueTimer = null;

function applyTheme() {
  document.documentElement.setAttribute('data-theme', appState.theme);
  const icon = document.getElementById('theme-icon');
  if (appState.theme === 'dark') {
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  } else {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
}

function toggleTheme() {
  appState.theme = appState.theme === 'light' ? 'dark' : 'light';
  saveState();
  applyTheme();
  showToast(`Switched to ${appState.theme === 'dark' ? 'Dark' : 'Light'} Mode`);
}

function navigateTo(viewName) {
  currentView = viewName;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(`view-${viewName}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewName === 'doctors') renderDoctorsDirectory();
  if (viewName === 'booking') renderBookingWizard();
  if (viewName === 'queue') renderQueueTracker();
  if (viewName === 'dashboards') renderDashboardView();
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

function showToast(message, type = 'info') {
  const stack = document.getElementById('toast-stack');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition = 'all 0.25s ease';
    setTimeout(() => el.remove(), 260);
  }, 3200);
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

