// student.js - single JS for student pages
document.addEventListener('DOMContentLoaded', () => {
  // sample dataset - replace with API calls later
  window._alumni = [
    { name: "John Doe", title: "Software Engineer", skill: "Java", industry: "Software", year: 2022 },
    { name: "Jane Smith", title: "Data Scientist", skill: "Python", industry: "Data Science", year: 2018 },
    { name: "Ali Khan", title: "Frontend Engineer", skill: "React", industry: "Web Development", year: 2021 },
    { name: "Priya Patel", title: "SRE", skill: "DevOps", industry: "SRE", year: 2019 }
  ];

  // Search button on connect page
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchAlumni();
    });
  }

  // Simple nav toggle (if you wire a hamburger)
  window.toggleMenu = function () {
    const nav = document.querySelector('nav ul');
    if (nav) nav.classList.toggle('show');
  };

  // Connect button handler (delegated)
  document.addEventListener('click', (e) => {
    if (e.target && e.target.matches('.connect-btn')) {
      const name = e.target.dataset.name || 'Alumni';
      // keep this simple for now - replace with proper flow later
      alert('Connection request sent to ' + name);
    }
  });

}); // DOMContentLoaded

// Filters dataset and renders into #results only when search runs
function searchAlumni() {
  const name = (document.getElementById('name')?.value || '').trim().toLowerCase();
  const skill = (document.getElementById('skill')?.value || '').trim().toLowerCase();
  const industry = (document.getElementById('industry')?.value || '').trim().toLowerCase();
  const yearVal = (document.getElementById('year')?.value || '').trim();

  const resultsEl = document.getElementById('results');
  if (!resultsEl) return;

  const filtered = window._alumni.filter(a => {
    const matchName = !name || a.name.toLowerCase().includes(name);
    const matchSkill = !skill || (a.skill || '').toLowerCase().includes(skill);
    const matchIndustry = !industry || (a.industry || '').toLowerCase().includes(industry);
    const matchYear = !yearVal || String(a.year) === String(yearVal);
    return matchName && matchSkill && matchIndustry && matchYear;
  });

  resultsEl.innerHTML = ''; // clear previous

  if (!filtered.length) {
    const p = document.createElement('p');
    p.textContent = 'No alumni/mentors found.';
    p.style.color = '#555';
    resultsEl.appendChild(p);
    return;
  }

  filtered.forEach(a => {
    const card = document.createElement('div');
    card.className = 'alumni-card card';
    card.innerHTML = `
      <h3>${escapeHtml(a.name)}</h3>
      <p><strong>Title:</strong> ${escapeHtml(a.title || '')}</p>
      <p><strong>Skill:</strong> ${escapeHtml(a.skill || '')}</p>
      <p><strong>Industry:</strong> ${escapeHtml(a.industry || '')}</p>
      <p><strong>Year:</strong> ${escapeHtml(a.year || '')}</p>
      <button class="connect-btn" data-name="${escapeHtml(a.name)}">Connect</button>
    `;
    resultsEl.appendChild(card);
  });
}

// tiny helper
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


