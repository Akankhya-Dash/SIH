const sign_in_btn = document.querySelector("#sign-in-btn")
const sign_up_btn = document.querySelector("#sign-up-btn")
const container = document.querySelector(".container")
const signInForm = document.querySelector("#sign-in-form")
const signUpForm = document.querySelector("#sign-up-form")

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode")
})

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode")
})

signInForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const username = document.querySelector("#signin-username").value
  const password = document.querySelector("#signin-password").value

  if (!username || !password) {
    console.log("Please fill in all fields")
    return
  }

  if (username === "admin" && password === "password") {
    console.log("Login successful! Welcome back.")
  } else {
    console.log("Invalid username or password")
  }
})

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const username = document.querySelector("#signup-username").value
  const email = document.querySelector("#signup-email").value
  const password = document.querySelector("#signup-password").value
  const role = document.querySelector("#role-select").value

  if (!username || !email || !password || !role) {
    console.log("Please fill in all fields and select a role")
    return
  }

  if (password.length < 6) {
    console.log("Password must be at least 6 characters long")
    return
  }

  if (!email.includes("@") || !email.includes(".")) {
    console.log("Please enter a valid email address")
    return
  }

  console.log(`Account created successfully as ${role.charAt(0).toUpperCase() + role.slice(1)}!`)
  signUpForm.reset()
})

document.querySelector("#role-select").addEventListener("change", (e) => {
  const icon = e.target.closest(".input-field").querySelector("i:first-child")

  if (e.target.value === "admin") icon.className = "fas fa-shield-alt"
  else if (e.target.value === "alumni") icon.className = "fas fa-graduation-cap"
  else if (e.target.value === "student") icon.className = "fas fa-users"
  else icon.className = "fas fa-user-check"
})