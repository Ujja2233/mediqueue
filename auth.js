/* ---------------------------------------------------------------------
   7. DEMO AUTHENTICATION & CONTACT HANDLERS (auth.js)
   --------------------------------------------------------------------- */
let authMode = 'login';

function renderAuthHeader() {
  const desktopBox = document.getElementById('auth-header-area');
  const mobileBox = document.getElementById('mobile-auth-area');

  if (appState.user) {
    const html = `
      <button class="btn btn-sm btn-outline" onclick="navigateTo('dashboards'); switchDashboardRole('${appState.user.role}')">
        ${appState.user.name} (${appState.user.role})
      </button>
      <button class="btn btn-sm btn-primary" onclick="openModal('auth-modal')">Switch Role</button>
    `;
    desktopBox.innerHTML = html;
    mobileBox.innerHTML = html;
  } else {
    const html = `
      <button class="btn btn-sm btn-outline" onclick="setAuthMode('login'); openModal('auth-modal')">Login</button>
      <button class="btn btn-sm btn-primary" onclick="setAuthMode('register'); openModal('auth-modal')">Register</button>
    `;
    desktopBox.innerHTML = html;
    mobileBox.innerHTML = html;
  }
}

function setAuthMode(mode) {
  authMode = mode;
  document.getElementById('auth-name-group').style.display = mode === 'register' ? 'flex' : 'none';
  document.getElementById('tab-login-btn').className = mode === 'login' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline';
  document.getElementById('tab-reg-btn').className = mode === 'register' ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-outline';
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value.trim();
  const role = document.getElementById('auth-role').value;
  const customName = document.getElementById('auth-name').value.trim();

  const defaultNames = {
    patient: 'Rahul Mahto',
    doctor: 'Dr. Arvind Kumar Verma',
    admin: 'Ramgarh Admin'
  };

  appState.user = {
    name: customName || defaultNames[role],
    email,
    role,
    city: 'Ramgarh, Jharkhand'
  };
  saveState();
  renderAuthHeader();
  closeModal('auth-modal');
  navigateTo('dashboards');
  switchDashboardRole(role);
  showToast(`Signed in as ${appState.user.name} (${role} demo)`, 'success');
}

function handleContactSubmit(e) {
  e.preventDefault();
  e.target.reset();
  showToast('Thank you! Your demo message has been logged for Ramgarh Support.', 'success');
}

