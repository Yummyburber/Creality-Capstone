// Get login and signup sections
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");

// Get toggle buttons
const showSignupButton = document.getElementById("show-signup");
const showLoginButton = document.getElementById("show-login");

// Show Signup Form
showSignupButton.addEventListener("click", function () {
    loginSection.classList.remove("active");
    signupSection.classList.add("active");
});

// Show Login Form
showLoginButton.addEventListener("click", function () {
    signupSection.classList.remove("active");
    loginSection.classList.add("active");
});


// Temporary Login Form Behavior
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    alert("Login functionality will be added when the backend is implemented.");
});


// Temporary Signup Form Behavior
document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    alert("Account creation functionality will be added when the backend is implemented.");
});