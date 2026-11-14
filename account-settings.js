document.addEventListener("DOMContentLoaded", async function () {

    const supabase = window._supabase;

    if (!supabase) {
        alert("Supabase could not be initialized.");
        return;
    }

    // Check whether the user is logged in
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        alert("Please log in to access account settings.");
        window.location.href = "login.html";
        return;
    }

    const user = data.user;

    // Display current email
    document.getElementById("current-email").value = user.email || "";

    // UPDATE EMAIL
    document.getElementById("update-email-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const newEmail = document.getElementById("new-email").value.trim().toLowerCase();
        const button = event.target.querySelector(".submit-btn");

        if (!newEmail) {
            alert("Please enter a new email address.");
            return;
        }

        if (newEmail === (user.email || "").toLowerCase()) {
            alert("This is already your current email address.");
            return;
        }

        button.disabled = true;
        button.textContent = "Updating...";

        try {
            const { error } = await supabase.auth.updateUser({
                email: newEmail
            });

            if (error) {
                alert("Unable to update email: " + error.message);
                return;
            }

            alert("Email update requested! Check your email inbox for the confirmation message. Your new email may not become active until it is confirmed.");

            event.target.reset();

        } catch (error) {
            alert("Something went wrong while updating your email.");
            console.error(error);
        } finally {
            button.disabled = false;
            button.textContent = "Update Email";
        }
    });

    // CHANGE PASSWORD
    document.getElementById("change-password-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const password = document.getElementById("new-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        const button = event.target.querySelector(".submit-btn");

        if (password.length < 8) {
            alert("Your password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        button.disabled = true;
        button.textContent = "Changing...";

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                alert("Unable to change password: " + error.message);
                return;
            }

            alert("Your password has been changed successfully!");

            event.target.reset();

        } catch (error) {
            alert("Something went wrong while changing your password.");
            console.error(error);
        } finally {
            button.disabled = false;
            button.textContent = "Change Password";
        }
    });

    // LOG OUT
    document.getElementById("logout-button").addEventListener("click", async function () {

        const { error } = await supabase.auth.signOut();

        if (error) {
            alert("Unable to log out: " + error.message);
            return;
        }

        alert("You have successfully logged out.");
        window.location.href = "login.html";
    });

});