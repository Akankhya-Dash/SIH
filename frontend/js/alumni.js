const API_URL = "http://localhost:8080";
/* alumni.js — page-aware functions for alumni pages
   - mentorship toggle (persisted in localStorage)
   - optional local demo rendering for jobs and requests (if those pages are opened)
*/

(function () {
  'use strict';

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getJSON(k) {
    try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; }
  }
  function setJSON(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  /* --- Toggle: mentorship availability (dashboard) --- */
  function initToggle() {
    const btn = document.getElementById('mentorshipToggle');
    if (!btn) return;

    const saved = getJSON('alumni_mentorship_available');
    const available = (saved === null) ? true : !!saved;

    btn.classList.toggle('yes', available);
    btn.classList.toggle('no', !available);
    btn.textContent = available ? 'Yes' : 'No';

    btn.addEventListener('click', () => {
      const now = !btn.classList.contains('yes');
      btn.classList.toggle('yes', now);
      btn.classList.toggle('no', !now);
      btn.textContent = now ? 'Yes' : 'No';
      setJSON('alumni_mentorship_available', now);
    });
  }

  /* --- Jobs: seed, render (view-jobs.html) --- */
  const JOBS_KEY = 'alumni_jobs_v1';
  function seedJobsIfNeeded() {
    let jobs = getJSON(JOBS_KEY);
    if (!Array.isArray(jobs)) {
      jobs = [
        { title: 'Frontend Developer', company: 'Microsoft', location: 'Hyderabad', desc: 'Build web UIs using React.' },
        { title: 'Data Analyst', company: 'Deloitte', location: 'Bangalore', desc: 'Analyze data and build dashboards.' }
      ];
      setJSON(JOBS_KEY, jobs);
    }
    return jobs;
  }
  function getJobs() { return getJSON(JOBS_KEY) || seedJobsIfNeeded(); }

  function renderJobsGrid() {
    const grid = document.getElementById('jobs-grid');
    if (!grid) return;
    const jobs = getJobs();
    grid.innerHTML = '';
    jobs.forEach(j => {
      const el = document.createElement('article');
      el.className = 'card job-card';
      el.innerHTML = `
        <h2>${esc(j.title)}</h2>
        <p><strong>Company:</strong> ${esc(j.company)}</p>
        <p><strong>Location:</strong> ${esc(j.location)}</p>
        <p>${esc(j.desc)}</p>
      `;
      grid.appendChild(el);
    });
  }

  /* --- Post job: attach handler if a form with expected ids exists --- */
  function initPostJobForm() {
    const form = document.getElementById('post-job-form') || document.querySelector('form[data-role="post-job"], form.form-card');
    if (!form) return;
    // try to find expected inputs, otherwise bail
    const titleEl = document.getElementById('job-title') || form.querySelector('input[name="title"], input[placeholder*="Job"]');
    const companyEl = document.getElementById('job-company') || form.querySelector('input[name="company"], input[placeholder*="Company"]');
    const locationEl = document.getElementById('job-location') || form.querySelector('input[name="location"], input[placeholder*="Location"]');
    const descEl = document.getElementById('job-desc') || form.querySelector('textarea[name="description"], textarea[placeholder*="Description"]');

    if (!titleEl || !companyEl) return;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const title = (titleEl.value || '').trim();
      const company = (companyEl.value || '').trim();
      const location = (locationEl && locationEl.value) ? locationEl.value.trim() : '';
      const desc = (descEl && descEl.value) ? descEl.value.trim() : '';

      if (!title || !company) {
        alert('Please enter Job Title and Company.');
        return;
      }

      const jobs = getJobs();
      jobs.unshift({ title, company, location, desc });
      setJSON(JOBS_KEY, jobs);

      // redirect to view-jobs page in same folder
      try { window.location.href = 'view-jobs.html'; } catch (e) {}
    }, { passive:false });
  }

  /* --- Mentorship requests: seed, render, accept/decline --- */
  const REQ_KEY = 'alumni_requests_v1';
  function seedRequestsIfNeeded() {
    let list = getJSON(REQ_KEY);
    if (!Array.isArray(list)) {
      list = [
        { name: 'Alice Johnson', email: 'alice@example.com', message: 'Need help with interview prep.', status: 'pending' },
        { name: 'Rahul Mehta', email: 'rahul@example.com', message: 'Looking for mentorship in cloud infra.', status: 'pending' }
      ];
      setJSON(REQ_KEY, list);
    }
    return list;
  }

  function renderRequests() {
    const container = document.getElementById('requests-container');
    if (!container) return;
    const list = getJSON(REQ_KEY) || seedRequestsIfNeeded();
    container.innerHTML = '';
    list.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = 'card request-card';
      let controls = '';
      if (r.status === 'accepted') controls = '<span style="color:#2e7d32;font-weight:700">Accepted</span>';
      else if (r.status === 'declined') controls = '<span style="color:#c62828;font-weight:700">Declined</span>';
      else controls = `<div class="request-actions"><button data-idx="${idx}" class="accept">Accept</button><button data-idx="${idx}" class="decline">Decline</button></div>`;

      card.innerHTML = `
        <h3>Student: ${esc(r.name)}</h3>
        <p><strong>Email:</strong> ${esc(r.email)}</p>
        <p>${esc(r.message)}</p>
        ${controls}
      `;
      container.appendChild(card);
    });
  }

  function initRequestHandlers() {
    const container = document.getElementById('requests-container');
    if (!container) return;
    container.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-idx');
      if (idx === null) return;
      const list = getJSON(REQ_KEY) || seedRequestsIfNeeded();
      if (!list[idx]) return;
      if (e.target.classList.contains('accept')) list[idx].status = 'accepted';
      if (e.target.classList.contains('decline')) list[idx].status = 'declined';
      setJSON(REQ_KEY, list);
      renderRequests();
    });
  }

  /* --- Boot --- */
  document.addEventListener('DOMContentLoaded', function () {
    initToggle();
    renderJobsGrid();
    initPostJobForm();
    seedRequestsIfNeeded();
    renderRequests();
    initRequestHandlers();
  });

})();


