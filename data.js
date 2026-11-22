/* ---------------------------------------------------------------------
   1. INITIAL SEED DATA (RAMGARH, JHARKHAND) & LOCALSTORAGE ENGINE
   --------------------------------------------------------------------- */
const STORAGE_KEY = 'mediqueue_ramgarh_v1';

const DEFAULT_HOSPITALS = [
  { id: 'h1', name: 'Ramgarh Cantt Care Hospital', area: 'Ramgarh Cantt, Main Road', beds: 120, rating: 4.8 },
  { id: 'h2', name: 'Damodar Valley Multispecialty Clinic', area: 'Gola Road, Ramgarh', beds: 85, rating: 4.7 },
  { id: 'h3', name: 'Naisarai Health & Diagnostics', area: 'Naisarai, Ramgarh', beds: 60, rating: 4.6 },
  { id: 'h4', name: 'Patratu Valley Medical Center', area: 'Patratu Thermal Road, Ramgarh', beds: 95, rating: 4.7 },
  { id: 'h5', name: 'Subhash Chowk Polyclinic', area: 'Subhash Chowk, Ramgarh', beds: 40, rating: 4.5 }
];

const DEFAULT_DOCTORS = [
  {
    id: 'd1',
    name: 'Dr. Arvind Kumar Verma',
    specialization: 'Cardiology',
    qualification: 'MD, DM (Cardiology)',
    experience: 14,
    hospital: 'Ramgarh Cantt Care Hospital',
    fee: 600,
    availability: 'Available Today',
    rating: 4.9,
    reviews: 218,
    about: 'Senior Interventional Cardiologist specializing in preventive heart care, hypertension, and ECG/Echo diagnostics in Ramgarh Cantt.',
    slots: ['09:30 AM', '10:30 AM', '11:30 AM', '05:00 PM', '06:00 PM']
  },
  {
    id: 'd2',
    name: 'Dr. Sunita Kumari',
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 11,
    hospital: 'Damodar Valley Multispecialty Clinic',
    fee: 450,
    availability: 'Available Today',
    rating: 4.8,
    reviews: 192,
    about: 'Dedicated child specialist focusing on newborn wellness, immunization schedules, and pediatric respiratory care.',
    slots: ['10:00 AM', '11:00 AM', '12:15 PM', '04:30 PM', '05:30 PM']
  },
  {
    id: 'd3',
    name: 'Dr. Rajeshwar Prasad Singh',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho)',
    experience: 16,
    hospital: 'Naisarai Health & Diagnostics',
    fee: 550,
    availability: 'Available Today',
    rating: 4.7,
    reviews: 164,
    about: 'Experienced orthopedic and joint replacement surgeon treating sports injuries, arthritis, and spine disorders.',
    slots: ['09:30 AM', '11:00 AM', '04:00 PM', '05:30 PM']
  },
  {
    id: 'd4',
    name: 'Dr. Meenakshi Tirkey',
    specialization: 'Gynecology',
    qualification: 'MBBS, DGO, MS (OBG)',
    experience: 12,
    hospital: 'Ramgarh Cantt Care Hospital',
    fee: 500,
    availability: 'Available Today',
    rating: 4.9,
    reviews: 245,
    about: 'Consultant Obstetrician & Gynecologist offering comprehensive maternal care and women’s wellness consultations.',
    slots: ['10:00 AM', '11:30 AM', '04:30 PM', '06:00 PM']
  },
  {
    id: 'd5',
    name: 'Dr. Farhan Ahmad Siddiqui',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: 9,
    hospital: 'Subhash Chowk Polyclinic',
    fee: 350,
    availability: 'Available Today',
    rating: 4.6,
    reviews: 310,
    about: 'Primary care physician managing seasonal fevers, diabetes, thyroid disorders, and chronic lifestyle conditions.',
    slots: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '05:00 PM', '06:30 PM']
  },
  {
    id: 'd6',
    name: 'Dr. Neha Rajgarhia',
    specialization: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 8,
    hospital: 'Patratu Valley Medical Center',
    fee: 500,
    availability: 'Next Slot Tomorrow',
    rating: 4.8,
    reviews: 142,
    about: 'Clinical and cosmetic dermatologist treating allergies, acne, hair disorders, and chronic skin conditions.',
    slots: ['10:30 AM', '12:00 PM', '04:30 PM']
  }
];

const SPECIALIZATIONS = [
  { name: 'Cardiology', desc: 'Heart & vascular diagnostics', count: '4 Specialists' },
  { name: 'Pediatrics', desc: 'Infant, child & adolescent care', count: '5 Specialists' },
  { name: 'Orthopedics', desc: 'Bone, joint & spine clinic', count: '3 Specialists' },
  { name: 'General Medicine', desc: 'Fever, diabetes & primary care', count: '8 Specialists' },
  { name: 'Dermatology', desc: 'Skin, hair & allergy treatment', count: '3 Specialists' },
  { name: 'Gynecology', desc: 'Maternal & women’s health', count: '4 Specialists' }
];

const FAQS = [
  {
    q: 'How does MediQueue save waiting time at Ramgarh clinics?',
    a: 'When you book a slot online, MediQueue assigns a sequential digital token (e.g., T-107). You can monitor the currently serving token and estimated minutes remaining from your phone before arriving at the clinic.'
  },
  {
    q: 'Is this connected to real hospital servers in Ramgarh?',
    a: 'No. MediQueue is a frontend-only prototype built with HTML5, CSS3, and Vanilla JavaScript. All doctors, appointments, and queue movements are simulated and persisted in your browser’s LocalStorage.'
  },
  {
    q: 'Can I reschedule or cancel my booked appointment?',
    a: 'Yes! Open the Dashboards tab (Patient Dashboard), locate your upcoming appointment, and click Reschedule to pick a new date/time or Cancel to release your token.'
  },
  {
    q: 'How can I test the Live Queue Tracker during a demo?',
    a: 'Navigate to Queue Tracker and click "Start Auto-Simulation" to watch tokens advance automatically every few seconds, or use "Advance +1 Token" for step-by-step control.'
  }
];

function getTodayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Resetting corrupted state');
    }
  }
  const initial = {
    theme: 'light',
    user: {
      name: 'Rahul Mahto',
      email: 'rahul.mahto@ramgarh.demo',
      role: 'patient',
      phone: '+91 98351-44210',
      city: 'Ramgarh, Jharkhand'
    },
    hospitals: DEFAULT_HOSPITALS,
    doctors: DEFAULT_DOCTORS,
    appointments: [
      {
        id: 'MQ-2026-1041',
        patientName: 'Rahul Mahto',
        patientAge: 29,
        patientPhone: '9835144210',
        doctorId: 'd1',
        doctorName: 'Dr. Arvind Kumar Verma',
        specialization: 'Cardiology',
        hospital: 'Ramgarh Cantt Care Hospital',
        date: getTodayISO(0),
        slot: '10:30 AM',
        token: 'T-107',
        status: 'Upcoming',
        notes: 'Routine BP & ECG review'
      },
      {
        id: 'MQ-2026-1038',
        patientName: 'Ananya Verma',
        patientAge: 24,
        patientPhone: '9123456780',
        doctorId: 'd5',
        doctorName: 'Dr. Farhan Ahmad Siddiqui',
        specialization: 'General Medicine',
        hospital: 'Subhash Chowk Polyclinic',
        date: getTodayISO(0),
        slot: '11:00 AM',
        token: 'T-105',
        status: 'Upcoming',
        notes: 'Mild seasonal fever'
      },
      {
        id: 'MQ-2026-0992',
        patientName: 'Rahul Mahto',
        patientAge: 29,
        patientPhone: '9835144210',
        doctorId: 'd3',
        doctorName: 'Dr. Rajeshwar Prasad Singh',
        specialization: 'Orthopedics',
        hospital: 'Naisarai Health & Diagnostics',
        date: getTodayISO(-5),
        slot: '05:30 PM',
        token: 'T-089',
        status: 'Completed',
        notes: 'Knee sprain follow-up'
      }
    ],
    queue: {
      selectedApptId: 'MQ-2026-1041',
      servingNumber: 104,
      avgMinutesPerPatient: 6
    }
  };
  saveState(initial);
  return initial;
}

let appState = null;

function saveState(nextState) {
  if (nextState) {
    appState = nextState;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

appState = loadState();

