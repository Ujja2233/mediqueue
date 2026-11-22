/* ---------------------------------------------------------------------
   6. MULTI-ROLE DASHBOARDS: PATIENT, DOCTOR, ADMIN (dashboard.js)
   --------------------------------------------------------------------- */
function switchDashboardRole(role) {
  currentDashboardRole = role;
  document.querySelectorAll('.dash-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });
  renderDashboardView();
}

function renderDashboardView() {
  const area = document.getElementById('dashboard-content-area');
  const appts = appState.appointments;

  if (currentDashboardRole === 'patient') {
    const total = appts.length;
    const upcoming = appts.filter(a => a.status === 'Upcoming');
    const completed = appts.filter(a => a.status === 'Completed');
    const cancelled = appts.filter(a => a.status === 'Cancelled');
    const nextAppt = upcoming[0];

    area.innerHTML = `
      <div class="card" style="margin-bottom:1.5rem; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
        <div>
          <h2 style="font-size:1.35rem;">Welcome back, ${appState.user ? appState.user.name : 'Rahul Mahto'}</h2>
          <p style="font-size:0.86rem; color:var(--text-secondary);">Location: Ramgarh, Jharkhand &bull; Demo Patient Profile</p>
        </div>
        <button class="btn btn-primary" onclick="navigateTo('booking')">+ Book New Appointment</button>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Total Appointments</span><div class="kpi-value">${total}</div></div><span class="badge-pill">All</span></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Upcoming</span><div class="kpi-value" style="color:var(--primary);">${upcoming.length}</div></div><span class="badge-pill">Active</span></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Completed</span><div class="kpi-value" style="color:var(--secondary);">${completed.length}</div></div><span class="badge-pill badge-teal">Done</span></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Cancelled</span><div class="kpi-value" style="color:var(--danger);">${cancelled.length}</div></div><span class="badge-pill">Void</span></div>
      </div>

      ${nextAppt ? `
        <div class="card" style="margin-bottom:1.75rem; border-left:4px solid var(--secondary); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
          <div>
            <span class="badge-pill badge-teal">Next Scheduled Visit &bull; Token ${nextAppt.token}</span>
            <h3>${nextAppt.doctorName} (${nextAppt.specialization})</h3>
            <p style="font-size:0.88rem; color:var(--text-secondary);">${nextAppt.hospital}, Ramgarh &bull; ${nextAppt.date} at ${nextAppt.slot}</p>
          </div>
          <button class="btn btn-teal" onclick="selectQueueAppointment('${nextAppt.id}'); navigateTo('queue');">Track Live Queue &rarr;</button>
        </div>
      ` : ''}

      <h3 style="margin-bottom:0.85rem;">Appointment History</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID &amp; Token</th>
              <th>Doctor &amp; Specialty</th>
              <th>Ramgarh Hospital</th>
              <th>Date &amp; Slot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${appts.map(a => `
              <tr>
                <td><strong>${a.id}</strong><br/><span style="color:var(--secondary); font-weight:700;">${a.token}</span></td>
                <td><strong>${a.doctorName}</strong><br/><span style="font-size:0.8rem; color:var(--text-muted);">${a.specialization}</span></td>
                <td>${a.hospital}</td>
                <td>${a.date}<br/><span style="font-size:0.8rem; color:var(--text-muted);">${a.slot}</span></td>
                <td><span class="status-badge ${a.status === 'Upcoming' ? 'status-available' : (a.status === 'Completed' ? 'status-busy' : 'status-cancelled')}">${a.status}</span></td>
                <td>
                  ${a.status === 'Upcoming' ? `
                    <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                      <button class="btn btn-sm btn-outline" onclick="openRescheduleModal('${a.id}')">Reschedule</button>
                      <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${a.id}')">Cancel</button>
                    </div>
                  ` : '<span style="color:var(--text-muted); font-size:0.8rem;">No actions</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (currentDashboardRole === 'doctor') {
    const doc = appState.doctors[0];
    const queueList = appts.filter(a => a.status !== 'Cancelled');
    const nextPatient = queueList.find(a => a.status === 'Upcoming');

    area.innerHTML = `
      <div class="card" style="margin-bottom:1.5rem; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
        <div>
          <h2>OPD Console: ${doc.name}</h2>
          <p style="font-size:0.86rem; color:var(--text-secondary);">${doc.specialization} &bull; ${doc.hospital}, Ramgarh</p>
        </div>
        <div style="display:flex; gap:0.65rem; align-items:center;">
          <span class="status-badge ${doc.availability === 'Available Today' ? 'status-available' : 'status-busy'}">${doc.availability}</span>
          <button class="btn btn-outline btn-sm" onclick="toggleDoctorAvailability('${doc.id}')">Toggle Availability</button>
          <button class="btn btn-primary btn-sm" onclick="advanceQueueOnce()">Call Next Token</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Today's Appointments</span><div class="kpi-value">${queueList.length}</div></div></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Currently Serving</span><div class="kpi-value" style="color:var(--primary);">T-${appState.queue.servingNumber}</div></div></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Next Patient</span><div class="kpi-value" style="font-size:1.15rem;">${nextPatient ? nextPatient.patientName : 'Queue Clear'}</div></div></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Consultation Fee</span><div class="kpi-value" style="color:var(--secondary);">&#8377;${doc.fee}</div></div></div>
      </div>

      <h3 style="margin-bottom:0.85rem;">Live OPD Patient Queue</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Patient</th>
              <th>Slot</th>
              <th>Symptoms / Notes</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            ${queueList.map(a => `
              <tr>
                <td><strong style="color:var(--primary);">${a.token}</strong></td>
                <td><strong>${a.patientName}</strong> (${a.patientAge}y)</td>
                <td>${a.slot}</td>
                <td>${a.notes}</td>
                <td><span class="status-badge ${a.status === 'Upcoming' ? 'status-available' : 'status-busy'}">${a.status}</span></td>
                <td>
                  ${a.status === 'Upcoming'
                    ? `<button class="btn btn-sm btn-teal" onclick="markAppointmentCompleted('${a.id}')">Mark Completed</button>`
                    : `<span style="font-size:0.8rem; color:var(--text-muted);">Completed</span>`}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    // Admin Dashboard
    const specCounts = SPECIALIZATIONS.map(s => ({
      name: s.name.slice(0, 6),
      count: appState.doctors.filter(d => d.specialization === s.name).length + 2
    }));

    area.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Total Doctors</span><div class="kpi-value">${appState.doctors.length}</div></div></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Total Hospitals</span><div class="kpi-value">${appState.hospitals.length}</div></div></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Total Appointments</span><div class="kpi-value" style="color:var(--primary);">${appState.appointments.length}</div></div></div>
        <div class="kpi-card"><div><span style="font-size:0.8rem; color:var(--text-muted);">Active OPD Queues</span><div class="kpi-value" style="color:var(--secondary);">5</div></div></div>
      </div>

      <div style="display:grid; grid-template-columns:1.1fr 0.9fr; gap:1.5rem; margin-bottom:1.75rem;">
        <div class="card">
          <h3 style="margin-bottom:0.35rem;">Departmental OPD Load (Ramgarh)</h3>
          <p style="font-size:0.82rem; color:var(--text-muted);">Simulated daily patient distribution by specialization</p>
          <div class="bar-chart">
            ${specCounts.map(item => `
              <div class="bar-col">
                <span style="font-size:0.75rem; font-weight:700;">${item.count * 4}</span>
                <div class="bar-fill" style="height:${item.count * 24}px;"></div>
                <span style="font-size:0.72rem; color:var(--text-muted);">${item.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom:0.85rem;">Add Demo Doctor (Ramgarh)</h3>
          <form onsubmit="handleAdminAddDoctor(event)" style="display:flex; flex-direction:column; gap:0.7rem;">
            <input type="text" id="adm-doc-name" class="form-control" placeholder="Doctor Name (e.g., Dr. Kavita Sahu)" required />
            <select id="adm-doc-spec" class="form-control">
              ${SPECIALIZATIONS.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
            </select>
            <select id="adm-doc-hosp" class="form-control">
              ${appState.hospitals.map(h => `<option value="${h.name}">${h.name}</option>`).join('')}
            </select>
            <input type="number" id="adm-doc-fee" class="form-control" placeholder="Consultation Fee (₹)" value="500" required />
            <button type="submit" class="btn btn-primary btn-sm">Add Doctor to Directory</button>
          </form>
        </div>
      </div>

      <h3 style="margin-bottom:0.85rem;">Ramgarh Hospitals &amp; Clinics Directory</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Hospital Name</th>
              <th>Ramgarh Locality</th>
              <th>OPD Beds</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            ${appState.hospitals.map(h => `
              <tr>
                <td><strong>${h.name}</strong></td>
                <td>${h.area}</td>
                <td>${h.beds}</td>
                <td>&#9733; ${h.rating}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

function cancelAppointment(id) {
  const target = appState.appointments.find(a => a.id === id);
  if (target) {
    target.status = 'Cancelled';
    saveState();
    renderDashboardView();
    showToast(`Appointment ${id} cancelled.`, 'warning');
  }
}

function openRescheduleModal(id) {
  const target = appState.appointments.find(a => a.id === id);
  if (!target) return;
  document.getElementById('resched-id').value = id;
  document.getElementById('resched-date').min = getTodayISO(0);
  document.getElementById('resched-date').value = target.date;
  document.getElementById('resched-slot').value = target.slot;
  openModal('reschedule-modal');
}

function submitReschedule(e) {
  e.preventDefault();
  const id = document.getElementById('resched-id').value;
  const newDate = document.getElementById('resched-date').value;
  const newSlot = document.getElementById('resched-slot').value;
  const target = appState.appointments.find(a => a.id === id);
  if (target) {
    target.date = newDate;
    target.slot = newSlot;
    saveState();
    closeModal('reschedule-modal');
    renderDashboardView();
    showToast(`Appointment ${id} rescheduled to ${newDate} at ${newSlot}.`, 'success');
  }
}

function toggleDoctorAvailability(docId) {
  const doc = appState.doctors.find(d => d.id === docId);
  if (doc) {
    doc.availability = doc.availability === 'Available Today' ? 'Next Slot Tomorrow' : 'Available Today';
    saveState();
    renderDashboardView();
    showToast(`${doc.name} status updated to ${doc.availability}`);
  }
}

function markAppointmentCompleted(id) {
  const appt = appState.appointments.find(a => a.id === id);
  if (appt) {
    appt.status = 'Completed';
    saveState();
    renderDashboardView();
    showToast(`Marked ${appt.token} (${appt.patientName}) as Completed`, 'success');
  }
}

function handleAdminAddDoctor(e) {
  e.preventDefault();
  const name = document.getElementById('adm-doc-name').value.trim();
  const specialization = document.getElementById('adm-doc-spec').value;
  const hospital = document.getElementById('adm-doc-hosp').value;
  const fee = parseInt(document.getElementById('adm-doc-fee').value, 10) || 500;

  appState.doctors.push({
    id: 'd' + (appState.doctors.length + 1),
    name,
    specialization,
    qualification: 'MBBS, MD',
    experience: 7,
    hospital,
    fee,
    availability: 'Available Today',
    rating: 4.8,
    reviews: 42,
    about: `Consultant in ${specialization} practicing at ${hospital}, Ramgarh.`,
    slots: ['10:00 AM', '11:30 AM', '05:00 PM']
  });
  saveState();
  renderDashboardView();
  showToast(`${name} added to Ramgarh directory!`, 'success');
}

