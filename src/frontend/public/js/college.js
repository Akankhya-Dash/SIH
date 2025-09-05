// Manage Alumni
const alumni = [
    {name: "John Doe", batch: 2018, skills: "Java, Python", available: true},
    {name: "Jane Smith", batch: 2019, skills: "AI, Cloud", available: false},
    {name: "Ali Khan", batch: 2020, skills: "React, Node", available: true},
];

const alumniContainer = document.getElementById('alumniContainer');
if(alumniContainer) {
    alumni.forEach((a, index) => {
        const card = document.createElement('div');
        card.className = 'alumni-card';
        card.innerHTML = `
            <h3>${a.name}</h3>
            <p><strong>Batch:</strong> ${a.batch}</p>
            <p><strong>Skills:</strong> ${a.skills}</p>
            <div class="toggle">
                <strong>Available for Mentorship:</strong>
                <label class="${a.available ? 'available' : 'not-available'}" id="toggle${index}">
                    ${a.available ? 'Yes' : 'No'}
                </label>
            </div>
        `;
        alumniContainer.appendChild(card);

        const toggleLabel = document.getElementById(`toggle${index}`);
        toggleLabel.addEventListener('click', () => {
            a.available = !a.available;
            toggleLabel.className = a.available ? 'available' : 'not-available';
            toggleLabel.textContent = a.available ? 'Yes' : 'No';
        });
    });
}

// Post Announcements
const postBtn = document.getElementById('postBtn');
if(postBtn) {
    postBtn.addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        if(title && content) {
            alert(`Announcement Posted:\n${title}\n${content}`);
            document.getElementById('title').value = '';
            document.getElementById('content').value = '';
        } else {
            alert('Please fill both fields');
        }
    });
}

// View Opportunities
const opportunities = [
    { title: "Internship: Software Development", type: "Internship", postedBy: "Jane Smith" },
    { title: "Job: Data Analyst", type: "Job", postedBy: "John Doe" },
    { title: "Mentorship Request: AI Project", type: "Mentorship", postedBy: "Student A" }
];

const container = document.getElementById('opportunitiesContainer');
if(container) {
    opportunities.forEach(o => {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.innerHTML = `<h3>${o.title}</h3>
                          <p><strong>Type:</strong> ${o.type}</p>
                          <p><strong>Posted By:</strong> ${o.postedBy}</p>`;
        container.appendChild(card);
    });
}



