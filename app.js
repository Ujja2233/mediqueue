/* ---------------------------------------------------------------------
   8. BOOTSTRAP APPLICATION ON LOAD
   --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  renderAuthHeader();
  renderHomeSections();
  renderDoctorsDirectory();
  renderBookingWizard();
  renderQueueTracker();
});
