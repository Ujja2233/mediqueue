/* ---------------------------------------------------------------------
   5. SMART QUEUE TRACKER & SIMULATOR (queue.js)
   --------------------------------------------------------------------- */
function parseTokenNumber(tokenStr) {
  const num = parseInt(String(tokenStr).replace(/\D/g, ''), 10);
  return isNaN(num) ? 107 : num;
}

function renderQueueTracker() {
  const selectEl = document.getElementById('queue-select-appt');
  const activeAppts = appState.appointments.filter(a => a.status !== 'Cancelled');

  selectEl.innerHTML = activeAppts.map(a =>
    `<option value="${a.id}" ${a.id === appState.queue.selectedApptId ? 'selected' : ''}>${a.token} — ${a.patientName} (${a.doctorName})</option>`
  ).join('');

  let currentAppt = activeAppts.find(a => a.id === appState.queue.selectedApptId) || activeAppts[0];
  const display = document.getElementById('queue-tracker-display');

  if (!currentAppt) {
    display.innerHTML = `
      <div class="empty-state">
        <h3>No Active Queue Tokens Found</h3>
        <p style="margin:0.5rem 0 1rem;">Book an appointment first to generate a digital queue token.</p>
        <button class="btn btn-primary" onclick="navigateTo('booking')">Book Appointment</button>
      </div>
    `;
    return;
  }

  const patientTokenNum = parseTokenNumber(currentAppt.token);
  const servingNum = appState.queue.servingNumber;
  const ahead = Math.max(0, patientTokenNum - servingNum);
  const estMins = ahead * appState.queue.avgMinutesPerPatient;

  let statusLabel = 'Waiting in Queue';
  let progressPct = 20;

  if (currentAppt.status === 'Completed' || servingNum > patientTokenNum) {
    statusLabel = 'Consultation Completed';
    progressPct = 100;
  } else if (servingNum === patientTokenNum) {
    statusLabel = 'Your Turn Now — Please Proceed to Room';
    progressPct = 95;
  } else {
    const span = Math.max(5, patientTokenNum - 100);
    progressPct = Math.min(90, Math.max(15, Math.round(((span - ahead) / span) * 100)));
  }

  // Update Hero Mini Preview too
  const heroServing = document.getElementById('hero-serving-token');
  const heroUser = document.getElementById('hero-user-token');
  const heroEst = document.getElementById('hero-wait-est');
  if (heroServing) heroServing.textContent = `T-${servingNum}`;
  if (heroUser) heroUser.textContent = currentAppt.token;
  if (heroEst) heroEst.textContent = ahead === 0 ? 'Now Serving' : `~${estMins} mins wait`;

  display.innerHTML = `
    <div class="queue-hero-box">
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:0.75rem;">
        <div>
          <span style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.05em; opacity:0.85;">${currentAppt.hospital} &bull; ${currentAppt.specialization}</span>
          <h2 style="font-size:1.5rem; margin-top:0.2rem;">${currentAppt.doctorName}</h2>
          <p style="font-size:0.88rem; opacity:0.9;">Patient: <strong>${currentAppt.patientName}</strong> &bull; Date: ${currentAppt.date} (${currentAppt.slot})</p>
        </div>
        <span style="background:rgba(255,255,255,0.18); padding:0.45rem 0.95rem; border-radius:999px; font-weight:700; font-size:0.85rem;">
          ${statusLabel}
        </span>
      </div>

      <div class="token-display-grid">
        <div class="token-metric">
          <span>Your Token Number</span>
          <strong>${currentAppt.token}</strong>
        </div>
        <div class="token-metric">
          <span>Currently Serving</span>
          <strong>T-${servingNum}</strong>
        </div>
        <div class="token-metric">
          <span>Patients Ahead</span>
          <strong>${ahead}</strong>
        </div>
        <div class="token-metric">
          <span>Est. Waiting Time</span>
          <strong>${ahead === 0 ? '0 min' : estMins + ' mins'}</strong>
        </div>
      </div>

      <div>
        <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:600;">
          <span>Queue Progress (Simulated)</span>
          <span>${progressPct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${progressPct}%;"></div>
        </div>
      </div>
    </div>
  `;
}

function selectQueueAppointment(apptId) {
  appState.queue.selectedApptId = apptId;
  saveState();
  if (currentView === 'queue') renderQueueTracker();
}

function lookupQueueByToken() {
  const raw = document.getElementById('queue-token-input').value.trim().toUpperCase();
  if (!raw) {
    showToast('Enter a token number like T-107', 'warning');
    return;
  }
  const normalized = raw.startsWith('T-') ? raw : `T-${raw.replace(/\D/g, '')}`;
  const found = appState.appointments.find(a => a.token.toUpperCase() === normalized);
  if (found) {
    appState.queue.selectedApptId = found.id;
    saveState();
    renderQueueTracker();
    showToast(`Tracking ${found.token} for ${found.patientName}`, 'success');
  } else {
    showToast(`Token ${normalized} not found in active demo bookings.`, 'error');
  }
}

function advanceQueueOnce() {
  appState.queue.servingNumber += 1;
  // Automatically mark appointments below servingNumber as Completed
  appState.appointments.forEach(a => {
    if (a.status === 'Upcoming' && parseTokenNumber(a.token) < appState.queue.servingNumber) {
      a.status = 'Completed';
    }
  });
  saveState();
  renderQueueTracker();
  if (currentView === 'dashboards') renderDashboardView();
  showToast(`Simulated OPD Queue advanced to T-${appState.queue.servingNumber}`);
}

function resetQueueSimulation() {
  appState.queue.servingNumber = 104;
  saveState();
  renderQueueTracker();
  showToast('Queue simulation reset to T-104');
}

function toggleAutoQueueSim() {
  const btn = document.getElementById('auto-sim-btn');
  if (autoQueueTimer) {
    clearInterval(autoQueueTimer);
    autoQueueTimer = null;
    btn.textContent = 'Start Auto-Simulation';
    showToast('Auto-simulation paused');
  } else {
    btn.textContent = 'Stop Auto-Simulation';
    showToast('Auto-simulation running (advances every 3.5s)', 'success');
    autoQueueTimer = setInterval(() => {
      advanceQueueOnce();
    }, 3500);
  }
}

