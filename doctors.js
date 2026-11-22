/* ---------------------------------------------------------------------
   3. HOMEPAGE & DOCTOR DIRECTORY (doctors.js)
   --------------------------------------------------------------------- */
function getDoctorAvatarSVG(seedIndex) {
  const colors = ['#2563EB', '#0D9488', '#4F46E5', '#0284C7', '#059669', '#7C3AED'];
  const color = colors[seedIndex % colors.length];
  return `
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="17" r="9" fill="${color}" fill-opacity="0.85"/>
      <path d="M9 42c0-8.284 6.716-14 15-14s15 5.716 15 14" fill="${color}" fill-opacity="0.25"/>
      <path d="M18 30l6 7 6-7" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function renderHomeSections() {
  // Specializations
  const specGrid = document.getElementById('home-specializations-grid');
  specGrid.innerHTML = SPECIALIZATIONS.map(s => `
    <div class="card spec-card" onclick="filterBySpecialization('${s.name}')">
      <div class="spec-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
      <h3 style="margin-bottom:0.35rem;">${s.name}</h3>
      <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:0.65rem;">${s.desc}</p>
      <span class="badge-pill" style="margin-bottom:0;">${s.count}</span>
    </div>
  `).join('');

  // Featured Doctors (First 3)
  const featGrid = document.getElementById('home-featured-doctors');
  featGrid.innerHTML = appState.doctors.slice(0, 3).map((doc, idx) => createDoctorCardHTML(doc, idx)).join('');

  // FAQs
  const faqBox = document.getElementById('faq-container');
  faqBox.innerHTML = FAQS.map((item, i) => `
    <div class="faq-item ${i === 0 ? 'open' : ''}" id="faq-${i}">
      <button class="faq-question" onclick="document.getElementById('faq-${i}').classList.toggle('open')">
        <span>${item.q}</span>
        <span style="color:var(--primary); font-size:1.2rem;">+</span>
      </button>
      <div class="faq-answer">${item.a}</div>
    </div>
  `).join('');
}

function createDoctorCardHTML(doc, idx) {
  const isAvail = doc.availability === 'Available Today';
  return `
    <div class="card doctor-card">
      <div>
        <div class="doc-top">
          <div class="doc-avatar">${getDoctorAvatarSVG(idx)}</div>
          <div>
            <h3 style="font-size:1.05rem; margin-bottom:0.15rem;">${doc.name}</h3>
            <span style="font-size:0.84rem; font-weight:700; color:var(--primary);">${doc.specialization}</span>
            <div style="font-size:0.78rem; color:var(--text-muted);">${doc.qualification} &bull; ${doc.experience} yrs exp</div>
          </div>
        </div>

        <div class="doc-meta">
          <div class="doc-meta-row">
            <span>Hospital</span>
            <strong style="color:var(--text-main); text-align:right;">${doc.hospital}</strong>
          </div>
          <div class="doc-meta-row">
            <span>Consultation Fee</span>
            <strong style="color:var(--secondary);">&#8377;${doc.fee}</strong>
          </div>
          <div class="doc-meta-row">
            <span>Rating</span>
            <strong>&#9733; ${doc.rating} (${doc.reviews})</strong>
          </div>
          <div class="doc-meta-row">
            <span>Status</span>
            <span class="status-badge ${isAvail ? 'status-available' : 'status-busy'}">${doc.availability}</span>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
        <button class="btn btn-outline btn-sm" onclick="viewDoctorProfile('${doc.id}')">View Profile</button>
        <button class="btn btn-primary btn-sm" onclick="startBookingWithDoctor('${doc.id}')">Book Now</button>
      </div>
    </div>
  `;
}

function populateFilterDropdowns() {
  const specSelect = document.getElementById('doc-filter-spec');
  const hospSelect = document.getElementById('doc-filter-hosp');
  const specs = [...new Set(appState.doctors.map(d => d.specialization))];
  const hosps = [...new Set(appState.hospitals.map(h => h.name))];

  specSelect.innerHTML = '<option value="">All Specializations</option>' +
    specs.map(s => `<option value="${s}">${s}</option>`).join('');
  hospSelect.innerHTML = '<option value="">All Ramgarh Hospitals</option>' +
    hosps.map(h => `<option value="${h}">${h}</option>`).join('');
}

function renderDoctorsDirectory() {
  populateFilterDropdowns();
  const q = (document.getElementById('doc-search').value || '').toLowerCase().trim();
  const spec = document.getElementById('doc-filter-spec').value;
  const hosp = document.getElementById('doc-filter-hosp').value;
  const avail = document.getElementById('doc-filter-avail').value;

  const filtered = appState.doctors.filter(d => {
    const matchQ = !q || d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q);
    const matchSpec = !spec || d.specialization === spec;
    const matchHosp = !hosp || d.hospital === hosp;
    const matchAvail = !avail || d.availability === avail;
    return matchQ && matchSpec && matchHosp && matchAvail;
  });

  const grid = document.getElementById('doctors-directory-grid');
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <h3>No matching doctors found in Ramgarh</h3>
        <p style="margin:0.5rem 0 1rem;">Try clearing your search filters or viewing all available departments.</p>
        <button class="btn btn-primary btn-sm" onclick="resetDoctorFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((doc, idx) => createDoctorCardHTML(doc, idx)).join('');
}

function resetDoctorFilters() {
  document.getElementById('doc-search').value = '';
  document.getElementById('doc-filter-spec').value = '';
  document.getElementById('doc-filter-hosp').value = '';
  document.getElementById('doc-filter-avail').value = '';
  renderDoctorsDirectory();
}

function handleHeroSearch(e) {
  e.preventDefault();
  const q = document.getElementById('hero-q').value;
  const spec = document.getElementById('hero-spec').value;
  const hosp = document.getElementById('hero-hosp').value;
  navigateTo('doctors');
  document.getElementById('doc-search').value = q;
  document.getElementById('doc-filter-spec').value = spec;
  document.getElementById('doc-filter-hosp').value = hosp;
  renderDoctorsDirectory();
}

function filterBySpecialization(specName) {
  navigateTo('doctors');
  document.getElementById('doc-filter-spec').value = specName;
  renderDoctorsDirectory();
}

function viewDoctorProfile(docId) {
  const doc = appState.doctors.find(d => d.id === docId);
  if (!doc) return;
  const box = document.getElementById('doctor-profile-content');
  box.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1rem;">
      <div>
        <span class="badge-pill">${doc.specialization}</span>
        <h2 style="font-size:1.35rem;">${doc.name}</h2>
        <p style="font-size:0.85rem; color:var(--text-muted);">${doc.qualification} &bull; ${doc.experience} Years Experience</p>
      </div>
      <button class="icon-btn" onclick="closeModal('doctor-profile-modal')">&times;</button>
    </div>
    <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:1.1rem;">${doc.about}</p>
    <div style="background:var(--bg-muted); padding:1rem; border-radius:12px; margin-bottom:1.25rem; font-size:0.88rem; display:flex; flex-direction:column; gap:0.5rem;">
      <div><strong>Hospital:</strong> ${doc.hospital}, Ramgarh</div>
      <div><strong>Consultation Fee:</strong> &#8377;${doc.fee}</div>
      <div><strong>OPD Slots:</strong> ${doc.slots.join(', ')}</div>
    </div>
    <div style="display:flex; gap:0.75rem; justify-content:flex-end;">
      <button class="btn btn-outline" onclick="closeModal('doctor-profile-modal')">Close</button>
      <button class="btn btn-primary" onclick="closeModal('doctor-profile-modal'); startBookingWithDoctor('${doc.id}')">Book Appointment</button>
    </div>
  `;
  openModal('doctor-profile-modal');
}

