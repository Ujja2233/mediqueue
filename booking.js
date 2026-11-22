/* ---------------------------------------------------------------------
   4. 7-STEP APPOINTMENT BOOKING WIZARD (booking.js)
   --------------------------------------------------------------------- */
let bookingDraft = {
  step: 1,
  specialization: 'Cardiology',
  doctorId: 'd1',
  hospital: 'Ramgarh Cantt Care Hospital',
  date: getTodayISO(0),
  slot: '10:30 AM',
  patientName: appState.user ? appState.user.name : 'Rahul Mahto',
  patientAge: 29,
  patientPhone: '9835144210',
  notes: '',
  confirmedAppt: null
};

const STEP_LABELS = [
  '1. Specialty',
  '2. Doctor',
  '3. Hospital',
  '4. Date',
  '5. Time Slot',
  '6. Details',
  '7. Confirm'
];

function startBookingWithDoctor(docId) {
  const doc = appState.doctors.find(d => d.id === docId);
  if (doc) {
    bookingDraft.specialization = doc.specialization;
    bookingDraft.doctorId = doc.id;
    bookingDraft.hospital = doc.hospital;
    bookingDraft.slot = doc.slots[0] || '10:00 AM';
    bookingDraft.step = 4;
    bookingDraft.confirmedAppt = null;
  }
  navigateTo('booking');
}

function renderBookingWizard() {
  // Stepper header
  const stepper = document.getElementById('booking-stepper');
  stepper.innerHTML = STEP_LABELS.map((lbl, idx) => {
    const stepNum = idx + 1;
    const cls = stepNum === bookingDraft.step ? 'active' : (stepNum < bookingDraft.step ? 'completed' : '');
    return `
      <div class="step-item ${cls}" onclick="jumpToBookingStep(${stepNum})">
        <div class="step-num">${stepNum < bookingDraft.step ? '&#10003;' : stepNum}</div>
        <div>${lbl.split('. ')[1]}</div>
      </div>
    `;
  }).join('');

  renderBookingSummary();

  const panel = document.getElementById('booking-step-panel');
  const selectedDoc = appState.doctors.find(d => d.id === bookingDraft.doctorId) || appState.doctors[0];

  if (bookingDraft.step === 1) {
    panel.innerHTML = `
      <h2 style="margin-bottom:0.4rem;">Step 1: Select Medical Specialization</h2>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.25rem;">Choose the department you wish to consult in Ramgarh.</p>
      <div class="choice-grid">
        ${SPECIALIZATIONS.map(s => `
          <div class="choice-card ${bookingDraft.specialization === s.name ? 'selected' : ''}"
               onclick="selectBookingSpec('${s.name}')">
            <strong>${s.name}</strong>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">${s.desc}</p>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:1.5rem; display:flex; justify-content:flex-end;">
        <button class="btn btn-primary" onclick="nextBookingStep()">Next: Choose Doctor &rarr;</button>
      </div>
    `;
  } else if (bookingDraft.step === 2) {
    const docsInSpec = appState.doctors.filter(d => d.specialization === bookingDraft.specialization);
    const list = docsInSpec.length ? docsInSpec : appState.doctors;
    panel.innerHTML = `
      <h2 style="margin-bottom:0.4rem;">Step 2: Choose Doctor (${bookingDraft.specialization})</h2>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.25rem;">Select your preferred specialist.</p>
      <div class="choice-grid">
        ${list.map(d => `
          <div class="choice-card ${bookingDraft.doctorId === d.id ? 'selected' : ''}"
               onclick="selectBookingDoctor('${d.id}')">
            <strong>${d.name}</strong>
            <div style="font-size:0.8rem; color:var(--primary); font-weight:600;">${d.qualification}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.3rem;">Fee: &#8377;${d.fee} &bull; ${d.hospital}</div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:1.5rem; display:flex; justify-content:space-between;">
        <button class="btn btn-outline" onclick="prevBookingStep()">&larr; Back</button>
        <button class="btn btn-primary" onclick="nextBookingStep()">Next: Select Hospital &rarr;</button>
      </div>
    `;
  } else if (bookingDraft.step === 3) {
    panel.innerHTML = `
      <h2 style="margin-bottom:0.4rem;">Step 3: Select Hospital in Ramgarh</h2>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.25rem;">Confirm the Ramgarh facility for your OPD visit.</p>
      <div class="choice-grid">
        ${appState.hospitals.map(h => `
          <div class="choice-card ${bookingDraft.hospital === h.name ? 'selected' : ''}"
               onclick="bookingDraft.hospital='${h.name}'; renderBookingWizard();">
            <strong>${h.name}</strong>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">${h.area}</div>
            <div style="font-size:0.76rem; color:var(--secondary); font-weight:600; margin-top:0.25rem;">Rating &#9733; ${h.rating}</div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:1.5rem; display:flex; justify-content:space-between;">
        <button class="btn btn-outline" onclick="prevBookingStep()">&larr; Back</button>
        <button class="btn btn-primary" onclick="nextBookingStep()">Next: Select Date &rarr;</button>
      </div>
    `;
  } else if (bookingDraft.step === 4) {
    panel.innerHTML = `
      <h2 style="margin-bottom:0.4rem;">Step 4: Select Appointment Date</h2>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.25rem;">Choose today or an upcoming OPD date.</p>
      <div class="form-group" style="max-width:300px;">
        <label class="form-label" for="book-date-input">Appointment Date</label>
        <input type="date" id="book-date-input" class="form-control" min="${getTodayISO(0)}" value="${bookingDraft.date}"
               onchange="bookingDraft.date=this.value; renderBookingSummary();" />
      </div>
      <div style="display:flex; gap:0.6rem; margin-top:1rem;">
        <button class="btn btn-sm btn-outline" onclick="bookingDraft.date=getTodayISO(0); renderBookingWizard();">Today (${getTodayISO(0)})</button>
        <button class="btn btn-sm btn-outline" onclick="bookingDraft.date=getTodayISO(1); renderBookingWizard();">Tomorrow (${getTodayISO(1)})</button>
      </div>
      <div style="margin-top:1.5rem; display:flex; justify-content:space-between;">
        <button class="btn btn-outline" onclick="prevBookingStep()">&larr; Back</button>
        <button class="btn btn-primary" onclick="nextBookingStep()">Next: Time Slot &rarr;</button>
      </div>
    `;
  } else if (bookingDraft.step === 5) {
    const slots = selectedDoc.slots || ['10:00 AM', '11:30 AM', '05:00 PM'];
    panel.innerHTML = `
      <h2 style="margin-bottom:0.4rem;">Step 5: Choose Available Time Slot</h2>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.25rem;">Available OPD slots for ${selectedDoc.name} on ${bookingDraft.date}.</p>
      <div class="slot-grid">
        ${slots.map(s => `
          <button type="button" class="slot-btn ${bookingDraft.slot === s ? 'selected' : ''}"
                  onclick="bookingDraft.slot='${s}'; renderBookingWizard();">${s}</button>
        `).join('')}
      </div>
      <div style="margin-top:1.5rem; display:flex; justify-content:space-between;">
        <button class="btn btn-outline" onclick="prevBookingStep()">&larr; Back</button>
        <button class="btn btn-primary" onclick="nextBookingStep()">Next: Patient Details &rarr;</button>
      </div>
    `;
  } else if (bookingDraft.step === 6) {
    panel.innerHTML = `
      <h2 style="margin-bottom:0.4rem;">Step 6: Enter Patient Details</h2>
      <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.25rem;">Provide accurate details for OPD registration and queue token SMS simulation.</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
        <div class="form-group">
          <label class="form-label">Patient Full Name *</label>
          <input type="text" id="b-pname" class="form-control" value="${bookingDraft.patientName}" placeholder="Enter full name" />
          <span class="form-error" id="err-pname"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Age *</label>
          <input type="number" id="b-page" class="form-control" min="1" max="115" value="${bookingDraft.patientAge}" />
          <span class="form-error" id="err-page"></span>
        </div>
        <div class="form-group">
          <label class="form-label">Mobile Number (10 digits) *</label>
          <input type="tel" id="b-pphone" class="form-control" value="${bookingDraft.patientPhone}" placeholder="98351XXXXX" />
          <span class="form-error" id="err-pphone"></span>
        </div>
        <div class="form-group">
          <label class="form-label">City</label>
          <input type="text" class="form-control" value="Ramgarh, Jharkhand" readonly />
        </div>
      </div>
      <div class="form-group" style="margin-top:0.75rem;">
        <label class="form-label">Symptoms / Reason for Visit (Optional)</label>
        <textarea id="b-pnotes" class="form-control" rows="2" placeholder="Describe brief symptoms...">${bookingDraft.notes}</textarea>
      </div>
      <div style="margin-top:1.5rem; display:flex; justify-content:space-between;">
        <button class="btn btn-outline" onclick="prevBookingStep()">&larr; Back</button>
        <button class="btn btn-primary" onclick="validateStepSix()">Review &amp; Confirm &rarr;</button>
      </div>
    `;
  } else if (bookingDraft.step === 7) {
    if (bookingDraft.confirmedAppt) {
      const a = bookingDraft.confirmedAppt;
      panel.innerHTML = `
        <div style="text-align:center; padding:1rem 0;">
          <div style="width:60px; height:60px; border-radius:50%; background:rgba(16,185,129,0.15); color:#10B981; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-size:1.75rem; font-weight:800;">&#10003;</div>
          <span class="badge-pill badge-teal">Booking Confirmed (Demo)</span>
          <h2 style="margin-bottom:0.4rem;">Your OPD Token is Ready!</h2>
          <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1.5rem;">Present your Appointment ID or Digital Token at ${a.hospital}.</p>

          <div style="background:var(--bg-muted); border:1.5px solid var(--primary); border-radius:14px; padding:1.25rem; text-align:left; max-width:460px; margin:0 auto 1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.88rem;">
            <div><span style="color:var(--text-muted); display:block; font-size:0.75rem;">APPOINTMENT ID</span><strong>${a.id}</strong></div>
            <div><span style="color:var(--text-muted); display:block; font-size:0.75rem;">QUEUE TOKEN</span><strong style="color:var(--secondary); font-size:1.15rem;">${a.token}</strong></div>
            <div><span style="color:var(--text-muted); display:block; font-size:0.75rem;">PATIENT</span><strong>${a.patientName} (${a.patientAge}y)</strong></div>
            <div><span style="color:var(--text-muted); display:block; font-size:0.75rem;">DOCTOR</span><strong>${a.doctorName}</strong></div>
            <div><span style="color:var(--text-muted); display:block; font-size:0.75rem;">DATE &amp; SLOT</span><strong>${a.date} &bull; ${a.slot}</strong></div>
            <div><span style="color:var(--text-muted); display:block; font-size:0.75rem;">HOSPITAL</span><strong>${a.hospital}</strong></div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:0.75rem; justify-content:center;">
            <button class="btn btn-teal" onclick="selectQueueAppointment('${a.id}'); navigateTo('queue');">Track Live Queue &rarr;</button>
            <button class="btn btn-primary" onclick="navigateTo('dashboards'); switchDashboardRole('patient');">Go to Patient Dashboard</button>
            <button class="btn btn-outline" onclick="resetBookingWizard()">Book Another</button>
          </div>
        </div>
      `;
    } else {
      panel.innerHTML = `
        <h2 style="margin-bottom:0.4rem;">Step 7: Review &amp; Confirm Appointment</h2>
        <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1.25rem;">Verify all details below before generating your queue token.</p>
        <div style="background:var(--bg-muted); border:1px solid var(--border-color); border-radius:12px; padding:1.25rem; display:flex; flex-direction:column; gap:0.65rem; font-size:0.92rem;">
          <div style="display:flex; justify-content:space-between;"><span>Patient:</span><strong>${bookingDraft.patientName} (${bookingDraft.patientAge} yrs)</strong></div>
          <div style="display:flex; justify-content:space-between;"><span>Phone:</span><strong>+91 ${bookingDraft.patientPhone}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span>Doctor:</span><strong>${selectedDoc.name} (${bookingDraft.specialization})</strong></div>
          <div style="display:flex; justify-content:space-between;"><span>Hospital:</span><strong>${bookingDraft.hospital}, Ramgarh</strong></div>
          <div style="display:flex; justify-content:space-between;"><span>Schedule:</span><strong>${bookingDraft.date} at ${bookingDraft.slot}</strong></div>
          <div style="display:flex; justify-content:space-between;"><span>Consultation Fee:</span><strong style="color:var(--secondary);">&#8377;${selectedDoc.fee} (Pay at Clinic)</strong></div>
        </div>
        <div style="margin-top:1.5rem; display:flex; justify-content:space-between;">
          <button class="btn btn-outline" onclick="prevBookingStep()">&larr; Edit Details</button>
          <button class="btn btn-teal btn-lg" onclick="confirmFinalAppointment()">Confirm &amp; Generate Token</button>
        </div>
      `;
    }
  }
}

function renderBookingSummary() {
  const box = document.getElementById('booking-summary-box');
  const doc = appState.doctors.find(d => d.id === bookingDraft.doctorId) || appState.doctors[0];
  box.innerHTML = `
    <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Location</span><strong>Ramgarh, Jharkhand</strong></div>
    <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Specialization</span><strong>${bookingDraft.specialization}</strong></div>
    <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Doctor</span><strong>${doc.name}</strong></div>
    <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Hospital</span><strong style="text-align:right;">${bookingDraft.hospital}</strong></div>
    <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Date</span><strong>${bookingDraft.date}</strong></div>
    <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Time Slot</span><strong>${bookingDraft.slot}</strong></div>
    <div style="display:flex; justify-content:space-between; padding-top:0.65rem; border-top:1px solid var(--border-color);"><span style="color:var(--text-muted);">OPD Fee</span><strong style="color:var(--primary); font-size:1.1rem;">&#8377;${doc.fee}</strong></div>
  `;
}

function selectBookingSpec(spec) {
  bookingDraft.specialization = spec;
  const matchDoc = appState.doctors.find(d => d.specialization === spec);
  if (matchDoc) {
    bookingDraft.doctorId = matchDoc.id;
    bookingDraft.hospital = matchDoc.hospital;
    bookingDraft.slot = matchDoc.slots[0];
  }
  renderBookingWizard();
}

function selectBookingDoctor(docId) {
  bookingDraft.doctorId = docId;
  const doc = appState.doctors.find(d => d.id === docId);
  if (doc) {
    bookingDraft.hospital = doc.hospital;
    bookingDraft.slot = doc.slots[0];
  }
  renderBookingWizard();
}

function jumpToBookingStep(stepNum) {
  if (bookingDraft.confirmedAppt && stepNum < 7) return;
  bookingDraft.step = stepNum;
  renderBookingWizard();
}

function nextBookingStep() {
  if (bookingDraft.step < 7) {
    bookingDraft.step++;
    renderBookingWizard();
  }
}

function prevBookingStep() {
  if (bookingDraft.step > 1) {
    bookingDraft.step--;
    renderBookingWizard();
  }
}

function validateStepSix() {
  const name = document.getElementById('b-pname').value.trim();
  const age = parseInt(document.getElementById('b-page').value, 10);
  const phone = document.getElementById('b-pphone').value.trim();
  const notes = document.getElementById('b-pnotes').value.trim();

  let valid = true;
  document.getElementById('err-pname').textContent = '';
  document.getElementById('err-page').textContent = '';
  document.getElementById('err-pphone').textContent = '';

  if (name.length < 2) {
    document.getElementById('err-pname').textContent = 'Please enter a valid patient name.';
    valid = false;
  }
  if (!age || age < 1 || age > 115) {
    document.getElementById('err-page').textContent = 'Enter a valid age (1–115).';
    valid = false;
  }
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    document.getElementById('err-pphone').textContent = 'Enter a 10-digit mobile number.';
    valid = false;
  }

  if (!valid) return;

  bookingDraft.patientName = name;
  bookingDraft.patientAge = age;
  bookingDraft.patientPhone = phone.replace(/\D/g, '');
  bookingDraft.notes = notes;
  bookingDraft.step = 7;
  renderBookingWizard();
}

function confirmFinalAppointment() {
  const doc = appState.doctors.find(d => d.id === bookingDraft.doctorId) || appState.doctors[0];
  const nextTokenNum = 108 + appState.appointments.length;
  const newAppt = {
    id: 'MQ-2026-' + Math.floor(1000 + Math.random() * 9000),
    patientName: bookingDraft.patientName,
    patientAge: bookingDraft.patientAge,
    patientPhone: bookingDraft.patientPhone,
    doctorId: doc.id,
    doctorName: doc.name,
    specialization: doc.specialization,
    hospital: bookingDraft.hospital,
    date: bookingDraft.date,
    slot: bookingDraft.slot,
    token: `T-${nextTokenNum}`,
    status: 'Upcoming',
    notes: bookingDraft.notes || 'General OPD Consultation'
  };

  appState.appointments.unshift(newAppt);
  appState.queue.selectedApptId = newAppt.id;
  saveState();

  bookingDraft.confirmedAppt = newAppt;
  renderBookingWizard();
  showToast(`Appointment Confirmed! Token ${newAppt.token} generated.`, 'success');
}

function resetBookingWizard() {
  bookingDraft.step = 1;
  bookingDraft.confirmedAppt = null;
  renderBookingWizard();
}

