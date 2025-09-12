const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signInForm = document.querySelector("#sign-in-form");
const signUpForm = document.querySelector("#sign-up-form");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// ------- SIGN IN --------
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.querySelector("#signin-username").value;
  const password = document.querySelector("#signin-password").value;
  const role = document.querySelector("#role-select-signin") 
    ? document.querySelector("#role-select-signin").value 
    : ""; 

  if (!username || !password) {
    console.log("Please fill in all fields");
    return;
  }

  // ✅ role-based redirect for sign in (mock, no backend yet)
  const pages = {
    admin: "college/collegeDashboard.html",
    alumni: "alumni/alumniDashboard.html",
    student: "student/studentDashboard.html"
  };

  if (pages[role]) {
    console.log(`Login successful as ${role}! Redirecting...`);
    window.location.href = pages[role];
  } else if (username === "admin" && password === "password") {
    // fallback test case
    console.log("Login successful! Redirecting to College Dashboard...");
    window.location.href = "college/collegeDashboard.html";
  } else {
    console.log("Invalid username or password");
  }
});

// ------- SIGN IN --------
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.querySelector("#signin-username").value;
  const password = document.querySelector("#signin-password").value;
  const role = document.querySelector("#role-select-signin") 
    ? document.querySelector("#role-select-signin").value 
    : ""; 

  if (!username || !password) {
    console.log("Please fill in all fields");
    return;
  }

  // ✅ role-based redirect for sign in (mock, no backend yet)
  const pages = {
    admin: "college/collegeDashboard.html",
    alumni: "alumni/alumniDashboard.html",
    student: "student/studentDashboard.html"
  };

  if (pages[role]) {
    console.log(`Login successful as ${role}! Redirecting...`);
    window.location.href = pages[role];
  } else if (username === "admin" && password === "password") {
    // fallback test case
    console.log("Login successful! Redirecting to College Dashboard...");
    window.location.href = "college/collegeDashboard.html";
  } else {
    console.log("Invalid username or password");
  }
});

// ------- SIGN UP --------
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.querySelector("#signup-username").value;
  const email = document.querySelector("#signup-email").value;
  const password = document.querySelector("#signup-password").value;
  const role = document.querySelector("#role-select").value;

  if (!username || !email || !password || !role) {
    console.log("Please fill in all fields and select a role");
    return;
  }

  if (password.length < 6) {
    console.log("Password must be at least 6 characters long");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    console.log("Please enter a valid email address");
    return;
  }

  console.log(`Account created successfully as ${role}!`);

  // ✅ role-based redirect for sign up
  const pages = {
    admin: "college/collegeDashboard.html",
    alumni: "alumni/form.html",
    student: "student/form.html"
  };

  console.log("Redirecting to:", pages[role]);

  if (pages[role]) {
    window.location.href = pages[role];
  }

  signUpForm.reset();
});