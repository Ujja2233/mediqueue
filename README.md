🏥 MediQueue – Smart Healthcare Appointment & Queue Management

A frontend prototype for booking doctor appointments and tracking a live OPD queue, designed for Ramgarh, Jharkhand, India.

Built with plain HTML, CSS and JavaScript (ES6). No frameworks and no backend.

⚠️ Demo project. Doctors, hospitals, tokens and queue updates are sample data. Login is simulated. Nothing here is real medical advice or a real booking.

✨ Features
Doctor directory – browse Ramgarh doctors, filter by specialization, view profiles
7-step booking wizard – specialization → doctor → hospital → date → time slot → patient details → review & confirm
Smart queue tracker – look up a token, advance the queue, and run an auto-simulation
Multi-role dashboards – Patient, Doctor and Admin views
Demo login / register – simulated authentication
Dark / light theme toggle
Responsive layout for mobile, tablet and desktop
Saved in the browser – data persists using LocalStorage
🛠️ Tech Stack
Layer	Technology
Markup	HTML5
Styling	CSS3 (custom properties, Grid, Flexbox, media queries)
Logic	Vanilla JavaScript (ES6+)
Storage	Browser LocalStorage
🚀 Getting Started

No installation is needed.

Download or clone the repository:
bash
git clone https://github.com/YOUR-USERNAME/mediqueue.git
Open index.html in your browser.

To serve it locally instead:

bash
python3 -m http.server 8000
# open http://localhost:8000
📁 Project Structure
mediqueue/
├── index.html          # Page markup (all views and modals)
├── css/
│   ├── style.css       # Design tokens, base, header, buttons, hero, cards, booking, queue
│   ├── dashboard.css   # Patient / Doctor / Admin dashboards
│   ├── components.css  # FAQ accordion, modals, toasts
│   └── responsive.css  # Media queries
└── js/                 # Loaded in this order (shared global scope)
    ├── data.js         # Seed data and LocalStorage state
    ├── main.js         # Navigation, theme, notifications
    ├── doctors.js      # Home sections and doctor directory
    ├── booking.js      # 7-step booking wizard
    ├── queue.js        # Smart queue tracker and simulator
    ├── dashboard.js    # Multi-role dashboards
    ├── auth.js         # Demo authentication and contact handlers
    └── app.js          # Starts the app on page load

The <script> tags in index.html must stay in the order above, because the files share functions.

🌐 Live Demo

Deploy with GitHub Pages: Settings → Pages → Branch: main / root → Save. Your site will be at https://YOUR-USERNAME.github.io/mediqueue/.

📌 Limitations
No backend or database; data lives only in your browser
Queue updates are simulated, not real-time
Authentication is for demonstration only
🔮 Future Improvements
Connect a real backend and database
Real authentication and SMS or email notifications
Live queue updates from hospital systems
👤 Author

Your Name – B.Tech CSE GitH
