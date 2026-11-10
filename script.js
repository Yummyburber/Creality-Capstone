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

// SUPABASE LOGIN BEHAVIOR
document.getElementById("login-form").addEventListener("submit", async function (event) {
    // Prevent the browser from refreshing the page automatically on submit
    event.preventDefault();

    // Grab the email and password values typed into the input fields
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    // Call Supabase's built-in method to check user credentials
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    // If Supabase returns an error (wrong password, user doesn't exist, etc.)
    if (error) {
        alert("Error logging in: " + error.message);
    } else {
        // Success! Redirect straight to main app page
        window.location.href = "index.html";
    }
});

// SUPABASE SIGN UP BEHAVIOR
document.getElementById("signup-form").addEventListener("submit", async function (event) {
    // Prevent the default page reload
    event.preventDefault();

    // Grab all input values from the signup form
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Client-side validation: Make sure passwords match before hitting the backend
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Call Supabase's built-in method to create a new user in auth.users
    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: name // Pass extra metadata like the user's name
            }
        }
    });

    // If Supabase returns an error (e.g., email already taken)
    if (error) {
        alert("Error signing up: " + error.message);
    } else {
        // Success! The user is now registered in your Supabase Auth dashboard
        alert("Account created successfully!");
        
        // Redirect them to index.html
        window.location.href = "index.html";
    }
});