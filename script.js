
document.addEventListener("DOMContentLoaded", function () {

    // Get Supabase client
    const supabase = window._supabase;

    // Get form sections
    const loginSection = document.getElementById("login-section");
    const signupSection = document.getElementById("signup-section");
    const forgotSection = document.getElementById("forgot-section");

    // Check Supabase only when authentication is needed
    function getSupabase() {
        if (!supabase) {
            alert("Authentication service is unavailable. Please try again later.");
            console.error("Supabase client was not initialized.");
            return null;
        }

        return supabase;
    }

    // Show one form section at a time
    function showSection(section) {
        [loginSection, signupSection, forgotSection].forEach(function (item) {
            if (item) {
                item.classList.remove("active");
            }
        });

        if (section) {
            section.classList.add("active");
        }
    }

    // FORM NAVIGATION

    document.getElementById("show-signup")?.addEventListener("click", function () {
        showSection(signupSection);
    });

    document.getElementById("show-login")?.addEventListener("click", function () {
        showSection(loginSection);
    });

    document.getElementById("show-forgot")?.addEventListener("click", function () {
        showSection(forgotSection);
    });

    document.getElementById("back-to-login")?.addEventListener("click", function () {
        showSection(loginSection);
    });

    // LOGIN

    document.getElementById("login-form")?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const authClient = getSupabase();
        if (!authClient) return;

        const email = document.getElementById("login-email").value.trim().toLowerCase();
        const password = document.getElementById("login-password").value;

        const button = event.target.querySelector(".submit-btn");
        button.disabled = true;
        button.textContent = "Logging in...";

        try {
            const { error } = await authClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                alert("Error logging in: " + error.message);
                return;
            }

            window.location.href = "index.html";

        } catch (error) {
            alert("Something went wrong while logging in.");
            console.error(error);

        } finally {
            button.disabled = false;
            button.textContent = "Log In";
        }
    });

    // SIGNUP

    document.getElementById("signup-form")?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const authClient = getSupabase();
        if (!authClient) return;

        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim().toLowerCase();
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            alert("Your password must be at least 8 characters long.");
            return;
        }

        const button = event.target.querySelector(".submit-btn");
        button.disabled = true;
        button.textContent = "Creating account...";

        try {
            const { data, error } = await authClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: name
                    },
                    emailRedirectTo: new URL("index.html", window.location.href).href
                }
            });

            if (error) {
                alert("Error signing up: " + error.message);
                return;
            }

            event.target.reset();

            if (data.session) {
                alert("Account created successfully!");
                window.location.href = "index.html";
            } else {
                alert("Account created! Check your email to verify your account before logging in.");
                showSection(loginSection);
            }

        } catch (error) {
            alert("Something went wrong while creating your account.");
            console.error(error);

        } finally {
            button.disabled = false;
            button.textContent = "Sign Up";
        }
    });

    // FORGOT PASSWORD

    document.getElementById("forgot-form")?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const authClient = getSupabase();
        if (!authClient) return;

        const email = document.getElementById("forgot-email").value.trim().toLowerCase();

        const button = event.target.querySelector(".submit-btn");
        button.disabled = true;
        button.textContent = "Sending...";

        try {
            const redirectUrl = new URL("reset-password.html", window.location.href).href;

            const { error } = await authClient.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl
            });

            if (error) {
                alert("Unable to send reset email: " + error.message);
                return;
            }

            alert("If the account is eligible, a password-reset email will be sent. Check your inbox.");

            event.target.reset();
            showSection(loginSection);

        } catch (error) {
            alert("Something went wrong while requesting a password reset.");
            console.error(error);

        } finally {
            button.disabled = false;
            button.textContent = "Send Reset Link";
        }
    });

});
